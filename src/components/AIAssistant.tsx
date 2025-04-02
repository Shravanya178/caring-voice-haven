
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Mic } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIAssistant = () => {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI health assistant. I can help you with medication information, health tips, or answer questions about senior care. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses: { [key: string]: string } = {
        medication: "It's important to take your medications as prescribed. If you're experiencing side effects, please consult with your doctor before making any changes.",
        pain: "For minor pain, you might try a warm compress or gentle stretching. If pain persists, please consult with your healthcare provider.",
        sleep: "Establishing a regular sleep schedule can help improve sleep quality. Try avoiding screens before bedtime and create a comfortable sleep environment.",
        hello: "Hello! How are you feeling today? Is there something specific I can help you with?",
        hi: "Hi there! How can I assist you with your health needs today?",
      };

      // Simple keyword matching for demo purposes
      const keyword = Object.keys(aiResponses).find(key => 
        input.toLowerCase().includes(key)
      );

      const responseText = keyword 
        ? aiResponses[keyword]
        : "I'm here to help with health-related questions. Could you provide more details about what you'd like to know?";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setLoading(false);
    }, 1500);
  };

  const handleVoiceInput = () => {
    toast({
      title: "Voice Recognition",
      description: "Voice input activated. Please speak your question.",
    });
    
    // Simulate voice recognition
    setTimeout(() => {
      setInput("What medications should I take for pain?");
      toast({
        title: "Voice Recognized",
        description: "Your question has been captured.",
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col h-[85vh] md:ml-64 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">AI Health Assistant</h1>
      
      <Card className="flex-grow flex flex-col bg-gray-50/50 mb-4 overflow-hidden">
        <CardContent className="flex-grow overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className={`h-8 w-8 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                    <AvatarFallback>{message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}</AvatarFallback>
                  </Avatar>
                  <div 
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-care-primary text-white' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback><Bot size={16} /></AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-4 py-2 bg-white border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleVoiceInput}
          className="flex-none"
        >
          <Mic className="h-4 w-4" />
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-grow"
        />
        <Button onClick={handleSend} disabled={!input.trim() || loading} className="flex-none bg-care-primary hover:bg-care-secondary">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AIAssistant;
