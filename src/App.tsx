// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Index from "./pages/Index";
import Buscar from "./pages/Buscar";
import PlantaDetalle from "./pages/PlantaDetalle";
import Acerca from "./pages/Acerca";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import LoginPage from "./pages/LoginPage"; // Importar LoginPage
import { ProtectedRoute } from "./components/auth/ProtectedRoute"; // Importar ProtectedRoute

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/buscar" element={<Buscar />} />
            <Route path="/plantas/:slug" element={<PlantaDetalle />} />
            <Route path="/acerca" element={<Acerca />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;