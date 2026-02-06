
import React, { useMemo } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { DocumentType, FileRecord, ViewMode } from '../../types';
import TableView from '../FileExplorer/TableView';
import FileExplorer from '../FileExplorer/FileExplorer';

const RepositoryView: React.FC = () => {
  const { tab } = useParams<{ tab: string }>();
  const activeTab = tab || 'ALL';
  
  const { 
    files, 
    viewMode, 
    searchQuery, 
    setSelectedFile, 
    currentFolderPath, 
    setCurrentFolderPath,
    onDeleteFile,
    onAnalyzeFile,
    onUploadTrigger,
    onReset
  } = useOutletContext<any>();

  const filteredFiles = useMemo(() => {
    return files.filter((f: FileRecord) => {
      const matchesTab = activeTab === 'ALL' || f.docType === activeTab;
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           f.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [files, activeTab, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {activeTab === 'ALL' ? 'Repository Overview' : `${activeTab} Management`}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            Indexing {filteredFiles.length} enterprise documents
          </p>
        </div>
        <button 
          onClick={onReset}
          className="text-[9px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors py-2 px-3 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20"
        >
          Reset DB
        </button>
      </div>

      <div className="transition-all duration-300">
        {viewMode === ViewMode.TABLE ? (
          <TableView 
            files={filteredFiles} 
            onAnalyze={onAnalyzeFile} 
            onDelete={onDeleteFile}
            setSelectedFile={setSelectedFile}
          />
        ) : (
          <FileExplorer 
            files={filteredFiles} 
            currentPath={currentFolderPath}
            setCurrentPath={setCurrentFolderPath}
            setSelectedFile={setSelectedFile}
            onDeleteFile={onDeleteFile}
            onRenameFolder={() => {}}
            onDeleteFolder={() => {}}
            onUploadTrigger={onUploadTrigger}
          />
        )}
      </div>
    </div>
  );
};

export default RepositoryView;
