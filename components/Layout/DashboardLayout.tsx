
import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Sidebar from './Sidebar';
import { User, FileRecord, DocumentType, ViewMode, FileStatus } from '../../types';
import { Icons } from '../../constants';
import { useToast } from '../UI/Toast';
import { analyzeDocument, askDocumentQuestion } from '../../services/ai';
import FileDetailModal from '../FileExplorer/FileDetailModal';
import ConfirmationModal from '../UI/ConfirmationModal';
import { useHasPermission, useIsAdmin } from '../../hooks/usePermissions';
import { Permission } from '../../utils/permissions';
import {
  listFiles,
  flattenFileStructure,
  uploadFile,
  uploadMultipleFiles,
  uploadFolder,
  deleteFile,
  getFile,
} from '../../services/files';

interface DashboardLayoutProps {
  user: User | null;
  onLogout: () => void;
  isDarkMode: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout, isDarkMode }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const canUpload = useHasPermission(Permission.UPLOAD_DOCUMENTS);
  const canDelete = useHasPermission(Permission.DELETE_DOCUMENTS);
  const canReset = useIsAdmin();
  
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.TABLE);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileRecord | null>(null);
  const [currentFolderPath, setCurrentFolderPath] = useState('Root');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<number | undefined>(undefined);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  // Fetch files from API
  const { data: fileStructure, isLoading: filesLoading, refetch: refetchFiles } = useQuery({
    queryKey: ['files', currentFolderId],
    queryFn: () => listFiles(currentFolderId),
    staleTime: 1000 * 60, // 1 minute
  });

  // Convert file structure to flat array
  const files: FileRecord[] = fileStructure ? flattenFileStructure(fileStructure, currentFolderPath) : [];

  // Upload mutations
  const uploadFileMutation = useMutation({
    mutationFn: uploadFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('File uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to upload file');
    },
  });

  const uploadMultipleMutation = useMutation({
    mutationFn: uploadMultipleFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('Files uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to upload files');
    },
  });

  const uploadFolderMutation = useMutation({
    mutationFn: ({ files, folderPath }: { files: File[]; folderPath?: string }) => 
      uploadFolder(files, folderPath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('Folder uploaded successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to upload folder');
    },
  });

  const deleteFileMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('File deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete file');
    },
  });

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
      // Invalidate queries to refresh file data after analysis
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success(`Analysis completed for ${name}`);
    } catch (err) {
      toast.error(`Failed to analyze ${name}`);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawFiles = event.target.files;
    if (!rawFiles || rawFiles.length === 0) return;

    const fileArray = Array.from(rawFiles) as File[];
    
    // Check if this is a folder upload (has webkitRelativePath)
    const isFolderUpload = fileArray.some(f => (f as any).webkitRelativePath);
    
    if (isFolderUpload) {
      // Upload as folder structure
      uploadFolderMutation.mutate({
        files: fileArray,
        folderPath: currentFolderPath !== 'Root' ? currentFolderPath.replace('Root/', '') : undefined,
      });
    } else if (fileArray.length === 1) {
      // Single file upload
      uploadFileMutation.mutate(fileArray[0]);
    } else {
      // Multiple files upload
      uploadMultipleMutation.mutate(fileArray);
    }
    
    event.target.value = '';
  };

  const handleManualAnalyze = async (file: FileRecord) => {
    await triggerAnalysis(file.id, file.name, file.content || '');
    toast.info(`Analyzing ${file.name}...`);
  };

  const handleDeleteFile = async (fileId: string) => {
    if (!canDelete) {
      toast.error("You don't have permission to delete documents.");
      return;
    }
    if (confirm("Delete document?")) {
      try {
        await deleteFileMutation.mutateAsync(parseInt(fileId, 10));
        setSelectedFile(null);
      } catch (error) {
        // Error already handled by mutation
      }
    }
  };

  const handleReset = () => {
    if (!canReset) {
      toast.error("Only administrators can reset the database.");
      return;
    }
    // Note: Backend doesn't have a reset endpoint
    // This would need to be implemented on the backend
    toast.warning("Reset functionality requires backend implementation.");
    setIsResetModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar user={user} onLogout={onLogout} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-auto min-h-[64px] bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 lg:px-6 py-2 sm:py-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 sticky top-0 z-10 transition-colors">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <div className="relative w-full max-w-2xl">
              <Icons.Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <input 
                type="text" 
                placeholder="Search repository..." 
                className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500/20 text-xs transition-all dark:text-slate-100 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-end space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Theme toggle removed - now handled in Settings */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
              <button onClick={() => setViewMode(ViewMode.TABLE)} className={`p-1 sm:p-1.5 rounded-md transition-all ${viewMode === ViewMode.TABLE ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-500 dark:text-slate-400'}`}><Icons.List className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></button>
              <button onClick={() => setViewMode(ViewMode.EXPLORER)} className={`p-1 sm:p-1.5 rounded-md transition-all ${viewMode === ViewMode.EXPLORER ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600' : 'text-slate-500 dark:text-slate-400'}`}><Icons.LayoutGrid className="w-3 h-3 sm:w-3.5 sm:h-3.5" /></button>
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-indigo-600 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-l-lg sm:rounded-l-xl hover:bg-indigo-700 cursor-pointer shadow-sm">
                <Icons.File className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Files</span>
                <input ref={fileInputRef} type="file" multiple accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
              </label>
              <label className="flex items-center px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-indigo-500 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-r-lg sm:rounded-r-xl hover:bg-indigo-600 cursor-pointer border-l border-indigo-400 shadow-sm">
                <Icons.Folder className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Folder</span>
                {/* @ts-ignore */}
                <input type="file" webkitdirectory="" directory="" multiple accept="image/*,.pdf" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {filesLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <Outlet context={{ 
              files, 
              viewMode, 
              searchQuery, 
              setSelectedFile, 
              currentFolderPath, 
              setCurrentFolderPath,
              onDeleteFile: handleDeleteFile,
              onAnalyzeFile: handleManualAnalyze,
              onUploadTrigger: () => fileInputRef.current?.click(),
              onReset: () => setIsResetModalOpen(true)
            }} />
          )}
        </div>
      </main>

      {selectedFile && (
        <FileDetailModal 
          file={selectedFile}
          rawFile={undefined}
          isOpen={!!selectedFile}
          onClose={() => setSelectedFile(null)}
          onAnalyze={handleManualAnalyze}
          onAsk={(q) => askDocumentQuestion(selectedFile.name, selectedFile.content || '', q)}
          isProcessing={false}
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
