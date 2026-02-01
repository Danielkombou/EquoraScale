
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { User } from './types';
import LandingPage from './components/Landing/LandingPage';
import AuthForm from './components/Forms/AuthForm';
import { ToastProvider } from './components/UI/Toast';
import DashboardLayout from './components/Layout/DashboardLayout';
import RepositoryView from './components/Dashboard/RepositoryView';

// --- Auth Context Mockup for App-wide state ---
export const AuthContext = React.createContext<{
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
}>({ user: null, login: () => {}, logout: () => {} });

// --- Protected Route Guard ---
// FIX: Using React.FC with an explicit children prop type to satisfy React 18 / TypeScript requirements
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('eqorascale_user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicLayout = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <Outlet />
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    return JSON.parse(localStorage.getItem('eqorascale_user') || 'null');
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const login = (u: User) => {
    setUser(u);
    localStorage.setItem('eqorascale_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eqorascale_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Section */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
            </Route>

            {/* Auth Section */}
            <Route path="/login" element={
              user ? <Navigate to="/app" replace /> : <AuthForm onLogin={login} />
            } />
            <Route path="/signup" element={
              user ? <Navigate to="/app" replace /> : <AuthForm onLogin={login} />
            } />

            {/* Dashboard Section */}
            <Route 
              path="/app" 
              element={
                <ProtectedRoute>
                  <DashboardLayout 
                    user={user} 
                    onLogout={logout} 
                    isDarkMode={isDarkMode} 
                    toggleTheme={() => setIsDarkMode(!isDarkMode)} 
                  />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="repository/ALL" replace />} />
              <Route path="repository/:tab" element={<RepositoryView />} />
              
              {/* Scale placeholders */}
              <Route path="collections" element={
                <div className="p-8 flex items-center justify-center h-full">
                  <div className="text-center opacity-40">
                    <p className="text-4xl font-black mb-2 uppercase tracking-widest">Collections</p>
                    <p className="text-sm font-bold uppercase tracking-widest">Module coming soon</p>
                  </div>
                </div>
              } />
              <Route path="analytics" element={
                <div className="p-8 flex items-center justify-center h-full">
                   <div className="text-center opacity-40">
                    <p className="text-4xl font-black mb-2 uppercase tracking-widest">Analytics</p>
                    <p className="text-sm font-bold uppercase tracking-widest">Module coming soon</p>
                  </div>
                </div>
              } />
              <Route path="settings" element={
                <div className="p-8 flex items-center justify-center h-full">
                  <div className="text-center opacity-40">
                    <p className="text-4xl font-black mb-2 uppercase tracking-widest">Settings</p>
                    <p className="text-sm font-bold uppercase tracking-widest">Module coming soon</p>
                  </div>
                </div>
              } />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthContext.Provider>
  );
};

export default App;
