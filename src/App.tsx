
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import MedicationTracker from "./components/MedicationTracker";
import MemoryGame from "./components/MemoryGame";
import EmergencyContacts from "./components/EmergencyContacts";
import PharmacyFinder from "./components/PharmacyFinder";
import AIAssistant from "./components/AIAssistant";
import MentalHealth from "./components/MentalHealth";
import TelemedicineConsult from "./components/TelemedicineConsult";
import NotFound from "./pages/NotFound";
import SocialClub from "./components/SocialClub";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/medications" element={<MedicationTracker />} />
            <Route path="/games" element={<MemoryGame />} />
            <Route path="/emergency" element={<EmergencyContacts />} />
            <Route path="/pharmacy" element={<PharmacyFinder />} />
            <Route path="/chatbot" element={<AIAssistant />} />
            <Route path="/mentalhealth" element={<MentalHealth />} />
            <Route path="/telemedicine" element={<TelemedicineConsult />} />
            <Route path="/social" element={<SocialClub />} />
            <Route path="/appointments" element={<TelemedicineConsult />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
