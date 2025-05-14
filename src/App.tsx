
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import PaperDetail from "./pages/PaperDetail";
import LibrariesPage from "./pages/LibrariesPage";
import LibraryDetail from "./pages/LibraryDetail";
import LiteratureReviewPage from "./pages/LiteratureReviewPage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";
import RequireAuth from "./components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="papers/:id" element={<PaperDetail />} />
                <Route path="libraries" element={
                  <RequireAuth>
                    <LibrariesPage />
                  </RequireAuth>
                } />
                <Route path="libraries/:id" element={
                  <RequireAuth>
                    <LibraryDetail />
                  </RequireAuth>
                } />
                <Route path="literature" element={
                  <RequireAuth>
                    <LiteratureReviewPage />
                  </RequireAuth>
                } />
                <Route path="settings" element={
                  <RequireAuth>
                    <SettingsPage />
                  </RequireAuth>
                } />
                <Route path="auth" element={<AuthPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
