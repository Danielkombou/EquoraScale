
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { User, FileRecord, DocumentType, ViewMode, FileStatus } from '../../types';
import { INITIAL_FILES } from '../../store/mockData';
import { Icons } from '../../constants';
import { useToast } from '../UI/Toast';
import { analyzeDocument, askDocumentQuestion } from '../../services/ai';
import FileDetailModal from '../FileExplorer/FileDetailModal';
import ConfirmationModal from '../UI/ConfirmationModal';

interface DashboardLayoutProps {
  user: User | null;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout, isDarkMode, toggleTheme }) => {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileRecord[]>(() => {
    const saved = localStorage.getItem('eqorascale_files');
    return saved ? JSON.parse(saved) : INITIAL_FILES;
  });

  const [rawFilesMap, setRawFilesMap] = useState<Map<string, File>>(new Map());
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.TABLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [currentFolderPath, setCurrentFolderPath] = useState('Root');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  useEffect(() => {
    const metadata = files.map(({blobUrl, isClassifying, ...f}) => f);
    localStorage.setItem('eqorascale_files', JSON.stringify(metadata));
  }, [files]);

  const extractText = async (file: File): Promise<string> => {
    const fileName = file.name.toLowerCase();
    try {
      if (fileName.endsWith('.pdf')) {
        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        const pdfjsLib = window['pdfjs-dist/build/pdf'];
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= Math.min(pdf.numPages, 10); i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
        }
        return fullText.trim() || "No readable text in PDF.";
      } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        const arrayBuffer = await file.arrayBuffer();
        // @ts-ignore
        const mammoth = window['mammoth'];
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value || "No readable text in Word document.";
      }
    } catch (e) {
      console.error("Extraction failed:", e);
    }
    return "Unsupported or error extracting content.";
  };

  const triggerAnalysis = async (fileId: string, name: string, content: string) => {
    try {
      const result = await analyzeDocument(name, content);
      setFiles(prev => prev.map(f => f.id === fileId ? {
        ...f,
        docType: result?.documentType as DocumentType || DocumentType.GENERAL,
        tags: [...new Set([...f.tags, ...(result?.suggestedTags || [])])],
        summary: result?.summary,
        isClassifying: false
      } : f));
    } catch (err) {
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, isClassifying: false } : f));
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = event.target.files;
    if (!rawFiles) return;
    const newRecords: FileRecord[] = [];
    const newRawMap = new Map(rawFilesMap);

    // FIX: Cast Array.from(rawFiles) to File[] to resolve 'unknown' type issues and access File properties
    for (const file of Array.from(rawFiles) as File[]) {
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.pdf') && !fileName.endsWith('.doc') && !fileName.endsWith('.docx')) continue;

      const fileId = Math.random().toString(36).substr(2, 9);
      const content = await extractText(file);
      const blobUrl = URL.createObjectURL(file);
      newRawMap.set(fileId, file);

      const record: FileRecord = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        path: currentFolderPath,
        createdAt: new Date().toISOString(),
        status: FileStatus.COMPLETED,
        docType: DocumentType.GENERAL,
        tags: ['New'],
        content,
        blobUrl,
        isClassifying: true
      };
      newRecords.push(record);
      triggerAnalysis(fileId, record.name, content);
    }

    if (newRecords.length > 0) {
      setRawFilesMap(newRawMap);
      setFiles(prev => [...prev, ...newRecords]);
      toast.success(`Indexed ${newRecords.length} documents.`);
    }
    event.target.value = '';
  };

  const handleManualAnalyze = async (file: FileRecord) => {
    setFiles(prev => prev.map(f => f.id === file.id ? { ...f, isClassifying: true } : f));
    await triggerAnalysis(file.id, file.name, file.content || '');
    toast.info(`Analyzing ${file.name}...`);
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm("Delete document?")) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success("Document removed.");
    }
  };

  const handleReset = () => {
    setFiles(INITIAL_FILES);
    localStorage.removeItem('eqorascale_files');
    toast.warning("Repository wiped.");
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar user={user} onLogout={onLogout} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10 transition-colors">
          <div className="flex items-center space-x-4 flex-1 max-w-2xl">
            <div className="relative w-full">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search repository..." 
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-xs transition-all dark:text-slate-100 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4 ml-4">
            <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
              {isDarkMode ? <Icons.Sun className="w-5 h-5" /> : <Icons.Moon className="w-5 h-5" />}
            </button>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
              <button onClick={() => setViewMode(ViewMode.TABLE)} className={`p-1.5 rounded-md ${viewMode === ViewMode.TABLE ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-500'}`}><Icons.List className="w-3.5 h-3.5" /></button>
              <button onClick={() => setViewMode(ViewMode.EXPLORER)} className={`p-1.5 rounded-md ${viewMode === ViewMode.EXPLORER ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-500'}`}><Icons.LayoutGrid className="w-3.5 h-3.5" /></button>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-l-xl hover:bg-indigo-700 cursor-pointer shadow-sm">
                <Icons.File className="w-3 h-3 mr-2" />
                Files
                <input ref={fileInputRef} type="file" multiple accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileUpload} />
              </label>
              <label className="flex items-center px-4 py-2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-r-xl hover:bg-indigo-600 cursor-pointer border-l border-indigo-400 shadow-sm">
                <Icons.Folder className="w-3 h-3 mr-2" />
                Folder
                {/* @ts-ignore */}
                <input type="file" webkitdirectory="" directory="" multiple accept=".pdf,.doc,.docx" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          <Outlet context={{ 
            files, 
            setFiles, 
            viewMode, 
            searchQuery, 
            setSelectedFile, 
            currentFolderPath, 
            setCurrentFolderPath,
            onDeleteFile: handleDeleteFile,
            onAnalyzeFile: handleManualAnalyze,
            onReset: () => setIsResetModalOpen(true)
          }} />
        </div>
      </main>

      {selectedFile && (
        <FileDetailModal 
          file={selectedFile}
          rawFile={rawFilesMap.get(selectedFile.id)}
          isOpen={!!selectedFile}
          onClose={() => setSelectedFile(null)}
          onAnalyze={handleManualAnalyze}
          onAsk={(q) => askDocumentQuestion(selectedFile.name, selectedFile.content || '', q)}
          isProcessing={selectedFile.isClassifying || false}
        />
      )}

      <ConfirmationModal 
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
        title="Wipe Local Repository?"
        message="This will delete all indexed document metadata and extracted text."
        confirmText="Wipe Everything"
      />
    </div>
  );
};

export default DashboardLayout;
