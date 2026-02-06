
import React, { useMemo } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { DocumentType, FileRecord, ViewMode } from '../../types';
import TableView from '../FileExplorer/TableView';
import FileExplorer from '../FileExplorer/FileExplorer';
import { useHasPermission, useIsAdmin } from '../../hooks/usePermissions';
import { Permission } from '../../utils/permissions';

const RepositoryView: React.FC = () => {
  const { tab } = useParams<{ tab: string }>();
  const activeTab = tab || 'ALL';
  const canDelete = useHasPermission(Permission.DELETE_DOCUMENTS);
  const canUpload = useHasPermission(Permission.UPLOAD_DOCUMENTS);
  const canReset = useIsAdmin(); // Only admin can reset database
  
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
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight truncate">
            {activeTab === 'ALL' ? 'Repository Overview' : `${activeTab} Management`}
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">
            Indexing {filteredFiles.length} enterprise documents
          </p>
        </div>
        <button 
          onClick={onReset}
          className="text-[8px] sm:text-[9px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 whitespace-nowrap"
        >
          Reset DB
        </button>
      </div>

      <div className="transition-all duration-300">
        {viewMode === ViewMode.TABLE ? (
          <TableView 
            files={filteredFiles} 
            onAnalyze={onAnalyzeFile} 
            onDelete={canDelete ? onDeleteFile : undefined}
            setSelectedFile={setSelectedFile}
          />
        ) : (
          <FileExplorer 
            files={filteredFiles} 
            currentPath={currentFolderPath}
            setCurrentPath={setCurrentFolderPath}
            setSelectedFile={setSelectedFile}
            onDeleteFile={canDelete ? onDeleteFile : undefined}
            onRenameFolder={() => {}}
            onDeleteFolder={() => {}}
            onUploadTrigger={canUpload ? onUploadTrigger : undefined}
          />
        )}
      </div>
    </div>
  );
};

export default RepositoryView;
