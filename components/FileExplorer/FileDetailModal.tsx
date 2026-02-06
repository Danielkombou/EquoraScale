
import React, { useState, useEffect, useRef } from 'react';
import { FileRecord, FileStatus, DocumentType } from '../../types';
import { Icons, STATUS_COLORS, DOC_TYPE_COLORS } from '../../constants';
import PdfViewer from './PdfViewer';

interface FileDetailModalProps {
  file: FileRecord;
  rawFile?: File; 
  isOpen: boolean;
  onClose: () => void;
  onAnalyze: (file: FileRecord) => Promise<void>;
  onAsk: (question: string) => Promise<string>;
  isProcessing: boolean;
}

const FileDetailModal: React.FC<FileDetailModalProps> = ({
  file,
  rawFile,
  isOpen,
  onClose,
  onAnalyze,
  onAsk,
  isProcessing
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  if (!isOpen) return null;

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || isChatLoading) return;

    const userMsg = chatMessage;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatMessage('');
    setIsChatLoading(true);

    try {
      const answer = await onAsk(userMsg);
      setChatHistory(prev => [...prev, { role: 'ai', text: answer }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "I encountered a technical interruption. Please verify your connection and try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  /**
   * Formats raw AI text into clean, accessible React elements.
   * Handles bolding (**text**), lists (* item), and paragraphs.
   */
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    let inList = false;
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Process bolding within a line
      const processBold = (str: string) => {
        const parts = str.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={i} className="font-black text-slate-900 dark:text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });
      };

      // Handle list items
      if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        const content = trimmedLine.slice(2);
        elements.push(
          <li key={`list-${index}`} className="ml-5 mb-2 list-disc pl-2">
            {processBold(content)}
          </li>
        );
        inList = true;
      } else if (trimmedLine === '') {
        // Empty lines act as paragraph breaks
        elements.push(<div key={`gap-${index}`} className="h-3" />);
        inList = false;
      } else {
        // Regular paragraphs
        elements.push(
          <p key={`p-${index}`} className="mb-2 last:mb-0">
            {processBold(trimmedLine)}
          </p>
        );
        inList = false;
      }
    });

    return <div className="space-y-1">{elements}</div>;
  };

  const isPdf = file.name.toLowerCase().endsWith('.pdf');
  const docClassification = file.isClassifying ? 'Classifying...' : file.docType;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 lg:p-8">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-slate-900 w-full h-full max-w-400 flex flex-col rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <header className="h-20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl shrink-0">
          <div className="flex items-center space-x-4 overflow-hidden">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl shrink-0">
              <Icons.FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 truncate tracking-tight">{file.name}</h2>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${file.isClassifying ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40' : DOC_TYPE_COLORS[file.docType]}`}>
                  {docClassification}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">•</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => onAnalyze(file)}
              disabled={isProcessing || file.isClassifying}
              className="flex items-center px-6 py-2.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-2xl font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 transition-all disabled:opacity-50"
            >
              <Icons.Sparkles className={`w-4 h-4 mr-2 ${(isProcessing || file.isClassifying) ? 'animate-pulse' : ''}`} />
              {(isProcessing || file.isClassifying) ? 'Syncing...' : 'Deep Analysis'}
            </button>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-500 transition-all"
            >
              <Icons.Plus className="w-6 h-6 rotate-45" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex min-h-0">
          
          {/* Left: Document Viewer */}
          <div className="flex-3 border-r border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col min-w-0">
            <div className="flex-1 relative overflow-hidden">
              {isPdf && rawFile ? (
                <PdfViewer file={rawFile} />
              ) : isPdf && file.blobUrl ? (
                <PdfViewer file={file.blobUrl} />
              ) : file.content ? (
                <div className="h-full overflow-y-auto p-12 bg-white dark:bg-slate-900">
                  <div className="max-w-4xl mx-auto bg-slate-50 dark:bg-slate-800/50 p-10 rounded-4xl border border-slate-100 dark:border-slate-700 font-mono text-sm leading-relaxed whitespace-pre-wrap dark:text-slate-300">
                    <div className="mb-8 pb-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Document Content Extract</span>
                      <Icons.FileText className="w-4 h-4 text-slate-300" />
                    </div>
                    {file.blobUrl}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-12">
                  <Icons.File className="w-20 h-20 text-slate-200 dark:text-slate-800 mb-6" />
                  <p className="text-lg font-bold text-slate-600 dark:text-slate-400 transition-colors">Preview Unavailable</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: AI Intelligence Panel */}
          <div className="flex-2 flex flex-col min-w-0 bg-white dark:bg-slate-900">
            
            {/* AI Chat History */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
              <div className="space-y-4 mb-4">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">System Intelligence</h3>
                
                {file.isClassifying ? (
                  <div className="p-10 rounded-[3xl] bg-slate-500 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center space-x-4 animate-pulse">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent animate-spin rounded-full"></div>
                    <div>
                      <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Processing Content</p>
                      <p className="text-xs text-slate-400">Extracting supply chain entities...</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {file.summary && (
                      <div className="p-6 rounded-3xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/30">
                        <p className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-3">AI Abstract</p>
                        <p className="text-[15px] text-slate-700 dark:text-slate-200 font-medium leading-relaxed italic">"{file.summary}"</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {file.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[9px] font-black border border-slate-200 dark:border-slate-700 uppercase tracking-widest">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {chatHistory.length === 0 && !file.isClassifying && (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-60">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center mb-6">
                    <Icons.Sparkles className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black mb-2 dark:text-white">Supply Chain Analyst</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed max-w-70">
                    I can help extract items, verify quantities, or summarize terms from this document.
                  </p>
                </div>
              )}

              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-6 py-4 rounded-[28px] text-[15px] leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none font-medium' 
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                  }`}>
                    {msg.role === 'user' ? msg.text : renderFormattedText(msg.text)}
                  </div>
                </div>
              ))}
              
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 rounded-tl-none animate-pulse">
                    <div className="flex space-x-1.5">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md">
              <form onSubmit={handleChatSubmit} className="flex items-center space-x-3 bg-white dark:bg-slate-800 p-2 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <input 
                  type="text" 
                  disabled={file.isClassifying}
                  placeholder={file.isClassifying ? "AI is indexing..." : "Query document details..."} 
                  className="flex-1 bg-transparent border-none px-4 py-3 text-sm outline-none text-slate-900 dark:text-slate-100 font-medium"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!chatMessage.trim() || isChatLoading || file.isClassifying}
                  className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all disabled:opacity-50 active:scale-95 shadow-md"
                >
                  <Icons.ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileDetailModal;
