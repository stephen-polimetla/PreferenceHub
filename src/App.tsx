import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { I18nProvider, useI18n } from './i18n';
import LandingPage from './pages/LandingPage';
import SurveyPage from './pages/SurveyPage';
import ReviewPage from './pages/ReviewPage';
import SuccessPage from './pages/SuccessPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function AppContent() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('preferencehub-theme') === 'dark';
    }
    return true;
  });
  const { t, lang } = useI18n();
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('preferencehub-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const headerText = useMemo(
    () => (location.pathname === '/admin' ? t('admin.title') : t('app.title')),
    [location.pathname, t],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/5 bg-slate-900/70 p-5 shadow-soft backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-violet-300/80">PreferenceHub</p>
            <h1 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{headerText}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="rounded-full border border-violet-500/20 bg-slate-900/80 px-4 py-2 text-sm text-slate-100 transition hover:bg-violet-500/10"
            >
              {t('app.home')}
            </Link>
            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              className="rounded-full bg-violet-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-400"
            >
              {darkMode ? t('app.lightMode') : t('app.darkMode')}
            </button>
            <span className="rounded-full bg-slate-800/90 px-3 py-2 text-sm text-slate-300">
              {lang.toUpperCase()}
            </span>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/survey" element={<SurveyPage />} />
              <Route path="/review" element={<ReviewPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
