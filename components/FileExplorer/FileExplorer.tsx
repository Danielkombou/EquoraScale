
import React, { useState } from 'react';
import { FileRecord } from '../../types';
import { Icons, DOC_TYPE_COLORS } from '../../constants';

interface FileExplorerProps {
  files: FileRecord[];
  currentPath: string;
  setCurrentPath: (path: string) => void;
  setSelectedFile: (file: FileRecord) => void;
  onRenameFolder: (path: string) => void;
  onDeleteFolder: (path: string) => void;
  onDeleteFile: (fileId: string) => void;
  onUploadTrigger: () => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ 
  files, 
  currentPath, 
  setCurrentPath, 
  setSelectedFile,
  onRenameFolder,
  onDeleteFolder,
  onDeleteFile,
  onUploadTrigger
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (!bytes && bytes !== 0) return '0 KB';
    if (bytes < 1024) return `${bytes} Bytes`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  };

  const itemsInCurrentScope = files.filter(f => f.path.startsWith(currentPath));
  
  const subFolders = Array.from(new Set(
    itemsInCurrentScope
      .map(f => {
        const relative = f.path.slice(currentPath.length).replace(/^\//, '');
        if (!relative) return null;
        return relative.split('/')[0];
      })
      .filter(f => f !== null)
  )) as string[];

  const directFiles = itemsInCurrentScope.filter(f => f.path === currentPath);
  const breadcrumbs = currentPath.split('/');

  const handleBack = () => {
    if (breadcrumbs.length > 1) {
      const parentPath = breadcrumbs.slice(0, -1).join('/');
      setCurrentPath(parentPath);
    }
  };

  return (
    <div className="space-y-5">
      {/* Navigation Header */}
      <div className="flex items-center space-x-4">
        {currentPath !== 'Root' && (
          <button 
            onClick={handleBack}
            className="flex items-center px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <Icons.Plus className="w-3.5 h-3.5 rotate-45 mr-1.5" />
            Back
          </button>
        )}
        
        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.2em] overflow-x-auto no-scrollbar py-2">
          {breadcrumbs.map((part, i) => (
            <React.Fragment key={i}>
              <button 
                onClick={() => setCurrentPath(breadcrumbs.slice(0, i + 1).join('/'))}
                className={`hover:text-indigo-600 transition-colors whitespace-nowrap ${i === breadcrumbs.length - 1 ? 'text-slate-800 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}
              >
                {part}
              </button>
              {i < breadcrumbs.length - 1 && <Icons.ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
        
        {/* Go Back Trigger Card */}
        {currentPath !== 'Root' && (
          <div 
            onClick={handleBack}
            className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-900/20 cursor-pointer transition-all "
          >
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-400 group-hover:text-indigo-600 transition-colors mb-2 shadow-sm">
              <Icons.Plus className="w-5 h-5 rotate-45" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-600">Parent</span>
          </div>
        )}

        {/* Subfolders */}
        {subFolders.map(folderName => {
          const folderPath = `${currentPath}/${folderName}`;
          const isMenuOpen = activeMenu === folderPath;
          const itemsCount = files.filter(f => f.path.startsWith(folderPath)).length;
          
          return (
            <div 
              key={folderName}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group relative cursor-pointer  flex flex-col"
              onClick={() => setCurrentPath(folderPath)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/40 transition-colors">
                  <Icons.Folder className="w-7 h-7" />
                </div>
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(isMenuOpen ? null : folderPath);
                    }}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-300 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  >
                    <Icons.Settings className="w-4 h-4" />
                  </button>
                  
                  {isMenuOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-30 py-1.5 animate-in fade-in zoom-in-95"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button 
                        onClick={() => { onRenameFolder(folderPath); setActiveMenu(null); }}
                        className="w-full text-left px-4 py-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center"
                      >
                        <Icons.Settings className="w-3.5 h-3.5 mr-2.5 text-slate-400" />
                        Rename
                      </button>
                      <div className="mx-2 my-1 border-t border-slate-100 dark:border-slate-700"></div>
                      <button 
                        onClick={() => { onDeleteFolder(folderPath); setActiveMenu(null); }}
                        className="w-full text-left px-4 py-2 text-[11px] font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center"
                      >
                        <Icons.Trash className="w-3.5 h-3.5 mr-2.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-100 mb-1 truncate leading-tight">{folderName}</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-auto">
                {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'}
              </p>
            </div>
          );
        })}

        {/* Files */}
        {directFiles.map(file => (
          <div 
            key={file.id}
            onClick={() => setSelectedFile(file)}
            className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all group cursor-pointer flex flex-col relative"
          >
            {/* Action Bar */}
            <div className="absolute top-4 right-4 z-10 flex space-x-1 opacity-60 group-hover:opacity-100 transition-opacity">
               <button 
                onClick={(e) => { e.stopPropagation(); onDeleteFile(file.id); }}
                className="p-1.5 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 transition-all rounded-lg shadow-sm border border-slate-100 dark:border-slate-700"
                title="Delete"
               >
                <Icons.Trash className="w-3.5 h-3.5" />
               </button>
            </div>

            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                <Icons.FileText className="w-7 h-7" />
              </div>
              {file.isClassifying && (
                <div className="w-5 h-5 border-3 border-indigo-500 border-t-transparent animate-spin rounded-full"></div>
              )}
            </div>
            <div
              className="text-[12px] font-black text-slate-900 dark:text-slate-50 leading-tight pr-8 mb-2"
              title={file.name}
            >
              <span className="block truncate">{file.name}</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter mb-3">
              {formatSize(file.size)}
            </p>
            <div className="mt-auto pt-3 border-t border-slate-50 dark:border-slate-800">
              <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${file.isClassifying ? 'bg-indigo-50 text-indigo-500 dark:bg-indigo-900/30 animate-pulse' : DOC_TYPE_COLORS[file.docType]}`}>
                {file.isClassifying ? 'Syncing' : file.docType}
              </span>
            </div>
          </div>
        ))}
        
        {/* ADD FILE TRIGGER */}
        <div 
          onClick={onUploadTrigger}
          className="group flex flex-col items-center justify-center p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 cursor-pointer transition-all min-h-45"
        >
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm mb-2.5 group-hover:scale-105">
            <Icons.Plus className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-600 text-center">Add Document</span>
        </div>

      </div>
      
      {activeMenu && (
        <div className="fixed inset-0 z-20" onClick={() => setActiveMenu(null)} />
      )}
    </div>
  );
};

export default FileExplorer;
