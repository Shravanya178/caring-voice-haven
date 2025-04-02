
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Pill, Brain, Phone, Mic, MapPin, MessageSquare, Video, Users, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { toast } = useToast();
  
  const navItems: NavItem[] = [
    { path: '/', label: 'Home', icon: <Home className="h-7 w-7" /> },
    { path: '/medications', label: 'Medications', icon: <Pill className="h-7 w-7" /> },
    { path: '/games', label: 'Games', icon: <Brain className="h-7 w-7" /> },
    { path: '/emergency', label: 'Emergency', icon: <Phone className="h-7 w-7" /> },
    { path: '/pharmacy', label: 'Pharmacy', icon: <MapPin className="h-7 w-7" /> },
    { path: '/chatbot', label: 'AI Assistant', icon: <MessageSquare className="h-7 w-7" /> },
    { path: '/telemedicine', label: 'Video Call', icon: <Video className="h-7 w-7" /> },
    { path: '/social', label: 'Social Club', icon: <Users className="h-7 w-7" /> },
    { path: '/mentalhealth', label: 'Mental Health', icon: <Heart className="h-7 w-7" /> },
  ];

  const handleVoiceAssistant = () => {
    toast({
      title: "Voice Assistant",
      description: "Voice assistant activated. Please speak your command.",
      duration: 3000,
    });
    
    // This would connect to voice recognition API in a real implementation
    setTimeout(() => {
      toast({
        title: "Listening...",
        description: "What can I help you with today?",
        duration: 3000,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <header className="bg-care-primary text-white p-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Caring Voice Haven</h1>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6">
        {children}
      </main>

      {/* Voice assistant button */}
      <div className="fixed right-4 bottom-20 md:bottom-24 z-10">
        <Button 
          onClick={handleVoiceAssistant}
          size="lg" 
          className="rounded-full h-14 w-14 bg-care-secondary hover:bg-care-tertiary shadow-lg"
        >
          <Mic className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 md:hidden z-10">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 ${
                location.pathname === item.path
                  ? 'text-care-primary'
                  : 'text-gray-500'
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:block fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 pt-20">
        <div className="flex flex-col p-4 gap-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                location.pathname === item.path
                  ? 'bg-care-light text-care-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
