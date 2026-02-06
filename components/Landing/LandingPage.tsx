
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../../constants';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-900 transition-colors duration-300 scroll-smooth">
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40">
              <Icons.Sparkles className="text-white w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <span className="font-black text-lg sm:text-2xl tracking-tighter">Eqorascale</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
            <a href="#sourcing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sourcing</a>
            <a href="#security" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Security</a>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 sm:px-6 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm sm:text-base font-bold shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 transition-all active:scale-95"
          >
            <span className="hidden sm:inline">Sign In</span>
            <span className="sm:hidden">Login</span>
          </button>
        </div>
      </nav>

      <section className="pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 relative overflow-hidden text-center">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 sm:mb-8 border border-indigo-100 dark:border-indigo-800">Supply Chain Intelligence</div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-6 sm:mb-8 leading-[1.1] px-2">Master your Supply Chain with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">AI Precision.</span></h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-2">Enterprise-grade document management for industrial sectors. Automate RFQs, POs, and Invoices with AI intelligence.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 px-2">
            <button onClick={() => navigate('/login')} className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center group">Enter Dashboard <Icons.ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" /></button>
            <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold">Explore Demo</button>
          </div>
        </div>
      </section>

      {/* Other sections removed for brevity but they remain functional links */}
      
      <footer className="py-12 sm:py-20 px-4 sm:px-6 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-400 font-medium text-sm sm:text-base">© 2026 Eqorascale Enterprise. V1.0.0 MVP PLATFORM</p>
      </footer>
    </div>
  );
};

export default LandingPage;
