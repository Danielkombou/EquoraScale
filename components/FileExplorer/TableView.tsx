
import React from 'react';
import { FileRecord, FileStatus, DocumentType } from '../../types';
import { Icons, STATUS_COLORS, DOC_TYPE_COLORS } from '../../constants';

interface TableViewProps {
  files: FileRecord[];
  onAnalyze: (file: FileRecord) => void;
  onDelete?: (fileId: string) => void;
  setSelectedFile: (file: FileRecord) => void;
}

const TableView: React.FC<TableViewProps> = ({ files, onAnalyze, onDelete, setSelectedFile }) => {
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">Document</th>
                  <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap hidden sm:table-cell">AI Intelligence</th>
                  <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap hidden md:table-cell">Workflow</th>
                  <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap hidden lg:table-cell">Timestamp</th>
                  <th className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {files.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 sm:px-6 py-16 sm:py-20 text-center">
                  <div className="flex flex-col items-center">
                    <Icons.File className="w-10 h-10 sm:w-12 sm:h-12 mb-4 text-slate-200 dark:text-slate-800" />
                    <p className="font-black uppercase tracking-[0.3em] text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500">Database Empty</p>
                  </div>
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr 
                  key={file.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 group cursor-pointer transition-colors"
                  onClick={() => setSelectedFile(file)}
                >
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                    <div className="flex items-center min-w-0">
                      <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mr-2 sm:mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm group-hover:rotate-3 shrink-0">
                        <Icons.FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">{file.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest mt-0.5 truncate">{file.path}</p>
                        {/* Mobile: Show doc type and status inline */}
                        <div className="flex items-center gap-2 mt-1.5 sm:hidden">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${DOC_TYPE_COLORS[file.docType]}`}>
                            {file.isClassifying ? 'Processing' : file.docType}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase tracking-widest ${STATUS_COLORS[file.status]}`}>
                            {file.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hidden sm:table-cell">
                    {file.isClassifying ? (
                      <div className="flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/20 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full w-fit animate-pulse">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full"></div>
                        <span className="text-[9px] sm:text-[10px] font-black text-indigo-500 uppercase tracking-widest">Processing</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${DOC_TYPE_COLORS[file.docType]}`}>
                          {file.docType}
                        </span>
                        {file.summary && (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="AI Indexed"></div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hidden md:table-cell">
                    <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-black border uppercase tracking-widest ${STATUS_COLORS[file.status]}`}>
                      {file.status}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 hidden lg:table-cell">
                    <p className="text-[10px] sm:text-xs text-slate-700 dark:text-slate-300 font-bold tracking-tight">{new Date(file.createdAt).toLocaleDateString()}</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">{formatSize(file.size)}</p>
                  </td>
                  <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-right">
                    <div className="flex items-center justify-end space-x-1 sm:space-x-1.5">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onAnalyze(file); }}
                        disabled={file.isClassifying}
                        className="p-1.5 sm:p-2 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-all rounded-lg shadow-sm disabled:opacity-50"
                        title="Re-Analyze"
                      >
                        <Icons.Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                      {onDelete && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
                          className="p-1.5 sm:p-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-500 transition-all rounded-lg shadow-sm"
                          title="Delete Document"
                        >
                          <Icons.Trash className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableView;
