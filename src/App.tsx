/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { OverlayProvider, useOverlay } from './context/OverlayContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { AppShell } from './components/layout/AppShell';

// Modular Public Website Components & Pages
import { Navbar } from './components/public/Navbar';
import { Footer } from './components/public/Footer';
import { LandingPage } from './components/public/LandingPage';
import { FeaturesPage } from './components/public/FeaturesPage';
import { StoryTypesPage } from './components/public/StoryTypesPage';
import { AboutPage } from './components/public/AboutPage';
import { ContactPage } from './components/public/ContactPage';
import { FAQPage } from './components/public/FAQPage';
import { PrivacyPage } from './components/public/PrivacyPage';
import { TermsPage } from './components/public/TermsPage';
import { AuthModal } from './components/public/AuthModal';
import { NotFound } from './components/public/NotFound';
import { ToastContainer } from './components/ui/ToastContainer';
import { EphemeralScrollbar } from './components/public/EphemeralScrollbar';

// Authentication Module Imports
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { EmailVerification } from './components/auth/EmailVerification';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ResetPassword } from './components/auth/ResetPassword';
import { ProtectedRoute, GuestRoute } from './components/auth/AuthGuards';
import { DashboardView } from './components/dashboard/DashboardView';
import { ProfilesView } from './components/profiles/ProfilesView';
import { StoriesView } from './components/stories/StoriesView';
import { StoryStudioView } from './components/stories/StoryStudioView';
import { MediaLibrary } from './components/media/MediaLibrary';
import { NotificationsView } from './components/supporting/NotificationsView';
import { GlobalSearchView } from './components/supporting/GlobalSearchView';
import { HelpCenterView } from './components/supporting/HelpCenterView';
import { SettingsView } from './components/supporting/SettingsView';
import { MigrationService } from './storage';

// Custom UI Primitives
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Modal } from './components/ui/Modal';
import { Drawer } from './components/ui/Drawer';
import { EmptyState } from './components/ui/EmptyState';
import { ErrorState } from './components/ui/ErrorState';
import {
  Skeleton,
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
  SkeletonForm,
  LinearLoader,
  CircularLoader,
  AIGenerationLoader,
  MediaUploadLoader,
  RenderLoader,
} from './components/ui/Skeleton';

// Icons
import {
  Sparkles,
  Info,
  Layers,
  AlertCircle,
  CheckCircle2,
  Bell,
  Trash2,
  Terminal,
  Cpu,
  UserCheck,
  FileCode,
  Layout,
} from 'lucide-react';

function MediaView() {
  return <MediaLibrary />;
}

import { NarrationStudioPage } from './components/narration/NarrationStudioPage';
import { StoryTemplatesPage } from './components/storyTemplates/StoryTemplatesPage';
import { RenderQueuePage } from './components/render/RenderQueuePage';
import { StudioAnalyticsPage } from './components/analytics/StudioAnalyticsPage';

function NarrationView() {
  return <NarrationStudioPage />;
}

function RenderView() {
  return <RenderQueuePage />;
}

function RenderActiveView() {
  const { activeView } = useOverlay();

  switch (activeView) {
    case 'dashboard':
      return <DashboardView />;
    case 'profiles':
      return <ProfilesView />;
    case 'stories':
      return <StoriesView />;
    case 'studio':
      return <StoryStudioView />;
    case 'media':
      return <MediaView />;
    case 'narration':
      return <NarrationView />;
    case 'templates':
      return <StoryTemplatesPage />;
    case 'render':
      return <RenderView />;
    case 'analytics':
      return <StudioAnalyticsPage />;
    case 'settings':
      return <SettingsView />;
    case 'notifications':
      return <NotificationsView />;
    case 'search':
      return <GlobalSearchView />;
    case 'help':
      return <HelpCenterView />;
    default:
      return (
        <div id="unsupported-view-placeholder" className="py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex items-center justify-center text-cinema-amber-500 mx-auto">
            <Layout className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-cinema-slate-800 dark:text-cinema-slate-200 uppercase tracking-wide">
              Future Page Placeholder
            </h3>
            <p className="text-xs text-cinema-slate-500 dark:text-cinema-slate-400 max-w-md mx-auto mt-1">
              The application shell recognizes this view. Feature-specific business logic and panels will be linked in downstream sprints.
            </p>
          </div>
        </div>
      );
  }
}

function PublicLayoutContent({
  currentPage,
  setCurrentPage,
  authModalOpen,
  setAuthModalOpen,
  authTab,
  handleOpenAuth,
  handleAuthSuccess,
}: {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authTab: 'login' | 'register';
  handleOpenAuth: (tab: 'login' | 'register') => void;
  handleAuthSuccess: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground animate-fade-in relative">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onOpenAuth={handleOpenAuth}
      />
      
      <main className="flex-grow">
        <RenderPublicPage
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onOpenAuth={handleOpenAuth}
        />
      </main>

      <Footer setCurrentPage={setCurrentPage} />
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authTab}
        onSuccess={handleAuthSuccess}
      />

      {/* Floating Gold Scrollbar */}
      <EphemeralScrollbar />

      {/* Public toast container rendering */}
      <ToastContainer />
    </div>
  );
}

function RenderPublicPage({
  currentPage,
  setCurrentPage,
  onOpenAuth,
}: {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
}) {
  switch (currentPage) {
    case 'home':
      return <LandingPage setCurrentPage={setCurrentPage} onOpenAuth={onOpenAuth} />;
    case 'features':
      return <FeaturesPage onOpenAuth={onOpenAuth} />;
    case 'story-types':
      return <StoryTypesPage onOpenAuth={onOpenAuth} />;
    case 'about':
      return <AboutPage setCurrentPage={setCurrentPage} onOpenAuth={onOpenAuth} />;
    case 'contact':
      return <ContactPage setCurrentPage={setCurrentPage} />;
    case 'faq':
      return <FAQPage />;
    case 'privacy':
      return <PrivacyPage />;
    case 'terms':
      return <TermsPage />;
    default:
      return <LandingPage setCurrentPage={setCurrentPage} onOpenAuth={onOpenAuth} />;
  }
}

function WorkspaceLayout() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <AppShell>
        <RenderActiveView />
      </AppShell>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    MigrationService.checkAndMigrate();
    
    // Load and apply settings on mount
    import('./storage').then(({ SettingsService }) => {
      SettingsService.getSettings().then(settings => {
        SettingsService.applyTheme(settings.theme);
        SettingsService.applyAccessibility(settings);
      });
    });
  }, []);

  const handleOpenAuth = (tab: 'login' | 'register') => {
    navigate(tab === 'login' ? '/login' : '/register');
  };

  const handleAuthSuccess = () => {
    // Check if there was a pending redirect
    const pendingRedirect = localStorage.getItem('rl_redirect_after_auth');
    if (pendingRedirect) {
      localStorage.removeItem('rl_redirect_after_auth');
      navigate(pendingRedirect);
    } else {
      navigate('/workspace/dashboard');
    }
  };

  return (
    <Routes>
      {/* Authentication Module Pages */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <Register />
          </GuestRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <GuestRoute>
            <ResetPassword />
          </GuestRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <EmailVerification />
        }
      />

      {/* Public Pages */}
      <Route
        path="/"
        element={
          <PublicLayoutContent
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            authModalOpen={authModalOpen}
            setAuthModalOpen={setAuthModalOpen}
            authTab={authTab}
            handleOpenAuth={handleOpenAuth}
            handleAuthSuccess={handleAuthSuccess}
          />
        }
      />

      {/* Workspace Pages (Protected) */}
      <Route
        path="/workspace/dashboard"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/story-library"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/story-studio"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/legacy-profiles"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/timeline-chronology"
        element={<Navigate to="/workspace/story-studio" replace />}
      />
      <Route
        path="/workspace/media-library"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/narration-studio"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/story-templates"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/render-queue"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/studio-analytics"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/integrations"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/settings"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/settings/my-profile"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/notifications"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/search"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspace/help"
        element={
          <ProtectedRoute>
            <WorkspaceLayout />
          </ProtectedRoute>
        }
      />

      {/* Catch-all Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { BreadcrumbProvider } from './context/BreadcrumbContext';
import { InspectorProvider } from './context/InspectorContext';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <OverlayProvider>
            <InspectorProvider>
              <AuthProvider>
                <BreadcrumbProvider>
                  <AppContent />
                </BreadcrumbProvider>
              </AuthProvider>
            </InspectorProvider>
          </OverlayProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

