
import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { User } from './types';
import LandingPage from './components/Landing/LandingPage';
import AuthForm from './components/Forms/AuthForm';
import { ToastProvider } from './components/UI/Toast';
import DashboardLayout from './components/Layout/DashboardLayout';
import RepositoryView from './components/Dashboard/RepositoryView';
import { getProfile, loginUser, logoutUser } from './services/auth';
import SettingsPage from './components/Settings/SettingsPage';

export type ThemeMode = 'light' | 'dark' | 'system';

// --- Theme Context ---
export const ThemeContext = createContext<{
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  isDarkMode: boolean;
}>({
  theme: 'system',
  setTheme: () => {},
  isDarkMode: false,
});

export const useTheme = () => useContext(ThemeContext);

// --- Auth Context Mockup for App-wide state ---
export const AuthContext = React.createContext<{
  user: User | null;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}>({ user: null, login: async () => {}, logout: () => {}, loading: false });

// --- Protected Route Guard ---
// FIX: Using React.FC with an explicit children prop type to satisfy React 18 / TypeScript requirements
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicLayout = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
    <Outlet />
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    return JSON.parse(localStorage.getItem('eqorascale_user') || 'null');
  });
  const [authLoading, setAuthLoading] = useState(true);

  // Theme state management
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as ThemeMode) || 'system';
  });

  // Calculate actual dark mode based on theme preference
  const getSystemDarkMode = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (theme === 'system') {
      return getSystemDarkMode();
    }
    return theme === 'dark';
  });

  // Apply theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    let shouldBeDark: boolean;

    if (theme === 'system') {
      shouldBeDark = getSystemDarkMode();
    } else {
      shouldBeDark = theme === 'dark';
    }

    setIsDarkMode(shouldBeDark);

    if (shouldBeDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen to system theme changes when theme is set to 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const root = window.document.documentElement;
      if (e.matches) {
        root.classList.add('dark');
        setIsDarkMode(true);
      } else {
        root.classList.remove('dark');
        setIsDarkMode(false);
      }
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  useEffect(() => {
    const token = localStorage.getItem('eqorascale_token');
    if (!token) {
      setAuthLoading(false);
      return;
    }

    getProfile()
      .then((profile) => {
        setUser(profile);
        localStorage.setItem('eqorascale_user', JSON.stringify(profile));
      })
      .catch(() => {
        logoutUser();
        setUser(null);
        localStorage.removeItem('eqorascale_user');
      })
      .finally(() => setAuthLoading(false));
  }, []);

  const login = async (usernameOrEmail: string, password: string) => {
    const profile = await loginUser(usernameOrEmail, password);
    setUser(profile);
    localStorage.setItem('eqorascale_user', JSON.stringify(profile));
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    localStorage.removeItem('eqorascale_user');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode }}>
      <AuthContext.Provider value={{ user, login, logout, loading: authLoading }}>
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
                  <SettingsPage />
                } />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
