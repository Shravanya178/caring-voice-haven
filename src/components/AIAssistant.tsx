import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Mic, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';

// Define types for SpeechRecognition - needed for TypeScript
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

// Import the Google Generative AI library
import { GoogleGenerativeAI } from '@google/generative-ai';

// Your API key from Google AI Studio
const API_KEY = "AIzaSyD-hvzu4f4smOTv5lK-lIERSP3Ljq4SM3I";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface LanguageContextType {
  t: (key: string, defaultValue: string) => string;
  language: string;
}

// Mock language context if not available in your app
const useLanguage = (): LanguageContextType => {
  return {
    t: (key: string, defaultValue: string) => defaultValue,
    language: 'english'
  };
};

const AIAssistant = () => {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to your health assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const [modelInitialized, setModelInitialized] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const genAIRef = useRef<any>(null);
  const modelRef = useRef<any>(null);

  // Initialize chat session on first load with a slight delay to ensure everything is loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeGeminiChat();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const initializeGeminiChat = async () => {
    try {
      setInitializationError(null);
      console.log('Initializing Gemini chat...');
      
      // Initialize the API
      genAIRef.current = new GoogleGenerativeAI(API_KEY);
      console.log('GoogleGenerativeAI initialized');
      
      // Updated model name - trying both the latest model names
      // Note: The API sometimes requires "gemini-1.5-pro" or "gemini-1.0-pro" instead of "gemini-pro"
      try {
        modelRef.current = genAIRef.current.getGenerativeModel({ model: "gemini-1.5-pro" });
        console.log('Using model: gemini-1.5-pro');
      } catch (modelError) {
        console.warn('Failed to use gemini-1.5-pro, trying gemini-1.0-pro');
        try {
          modelRef.current = genAIRef.current.getGenerativeModel({ model: "gemini-1.0-pro" });
          console.log('Using model: gemini-1.0-pro');
        } catch (fallbackError) {
          console.warn('Failed to use gemini-1.0-pro, trying legacy gemini-pro');
          modelRef.current = genAIRef.current.getGenerativeModel({ model: "gemini-pro" });
          console.log('Using model: gemini-pro');
        }
      }
      
      console.log('Model retrieved:', modelRef.current);
      
      // The Gemini API doesn't use systemInstruction directly in the same way
      // Instead, we'll set up initial chat history with our desired behavior
      const initialHistory = [
        {
          role: 'user',
          parts: [{ 
            text: `You are a healthcare assistant providing information about health, wellness, diet, and medical topics.
                  - Provide evidence-based health information when available
                  - Clearly state when information is general advice versus medical guidance
                  - Always remind users to consult healthcare professionals for medical concerns
                  - For dietary plans, consider nutritional balance and individual needs
                  - Avoid making specific diagnoses or recommending specific medications
                  - Focus on preventive care and healthy lifestyle choices
                  - Be respectful of cultural differences in health practices
                  - Provide information in a clear, accessible manner`
          }],
        }
      ];
      
      setChatHistory(initialHistory);
      setModelInitialized(true);
      
      // Test the model with a simple query to verify it's working
      try {
        // First check what models are available
        const models = await genAIRef.current.getModels();
        console.log('Available models:', models);
        
        // Then test with a simple prompt
        const result = await modelRef.current.generateContent("Send a simple ping response to confirm connectivity");
        console.log('Test response received:', result.response.text());
      } catch (testError) {
        console.error('Test message failed:', testError);
        setInitializationError(`Test message failed: ${testError.message}`);
      }
      
      console.log('Gemini chat initialization complete');
    } catch (error) {
      console.error('Error initializing Gemini chat:', error);
      setInitializationError(`${error.message}`);
      setModelInitialized(false);
      
      toast({
        title: 'Initialization Error',
        description: `Failed to initialize the health assistant: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Map language to speech recognition language code
      const langMap: Record<string, string> = {
        english: 'en-US',
        hindi: 'hi-IN',
        marathi: 'mr-IN'
      };
      recognitionRef.current.lang = langMap[language] || 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        
        toast({
          title: 'Voice Recognized',
          description: 'Your voice input has been captured',
        });
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: 'Voice Recognition Error',
          description: 'Failed to recognize speech',
          variant: "destructive",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [toast, language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      console.log('Sending message to Gemini:', userMessage.text);
      
      // Check if model is initialized
      if (!modelRef.current) {
        console.log('Model not initialized, trying to reinitialize...');
        await initializeGeminiChat();
        
        // Wait a moment for the model to be set in state
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!modelRef.current) {
          console.error('Failed to initialize model after retry');
          throw new Error('Model could not be initialized. Please refresh and try again.');
        }
      }
      
      // Check which API approach to use based on what's available
      let response;
      
      // Try the chat approach first (may not be available in all models/versions)
      try {
        console.log('Attempting to use chat history approach');
        
        // Update chat history with the user's message
        const updatedHistory = [
          ...chatHistory,
          { role: 'user', parts: [{ text: userMessage.text }] }
        ];
        
        // Generate content from the model using the entire chat history
        console.log('Generating content using history:', updatedHistory);
        const result = await modelRef.current.generateContent({
          contents: updatedHistory,
          generationConfig: {
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 1024,
          }
        });
        
        response = result.response.text();
        
        // Update the chat history with the AI's response
        setChatHistory([
          ...updatedHistory,
          { role: 'model', parts: [{ text: response }] }
        ]);
      } catch (chatError) {
        console.warn('Chat approach failed:', chatError);
        console.log('Falling back to simple prompt approach');
        
        // Fall back to simple prompt approach without chat history
        // Create a prompt that includes context and the user's message
        const contextPrompt = `
          As a healthcare assistant, provide information about health, wellness, diet, and medical topics.
          Remember to provide evidence-based health information when available,
          clearly state when information is general advice versus medical guidance,
          and remind users to consult healthcare professionals for medical concerns.
          
          User question: ${userMessage.text}
          
          Your helpful response:
        `;
        
        const result = await modelRef.current.generateContent(contextPrompt);
        response = result.response.text();
      }
      
      console.log('Processed response from Gemini:', response);
      
      // Fix for too many asterisks issue - replace markdown formatting with plain text
      response = response.replace(/\*\*/g, '');
      
      // Add AI response to messages
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting Gemini response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Sorry, I encountered an error: ${error.message}. Please try again later.`,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: 'Connection Error',
        description: `Failed to connect to the Gemini AI service: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: 'Voice Recognition Not Available',
        description: 'Your browser does not support voice recognition',
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.abort();
      setIsListening(false);
      return;
    }

    try {
      setIsListening(true);
      recognitionRef.current.start();
      toast({
        title: 'Voice Recognition',
        description: 'Listening... Speak now',
      });
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
      toast({
        title: 'Voice Recognition Error',
        description: 'Failed to start voice recognition',
        variant: "destructive",
      });
    }
  };

  const handleRetryInitialization = () => {
    setInitializationError(null);
    initializeGeminiChat();
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col h-[85vh]">
      <h1 className="text-3xl font-bold mb-6 text-center">Health Assistant</h1>
      
      {!modelInitialized && (
        <div className="p-4 bg-yellow-100 rounded-md mb-4">
          <p>Initializing AI model... Please wait.</p>
          {initializationError && (
            <div className="mt-2">
              <p className="text-red-600 font-medium">Error: {initializationError}</p>
              <button 
                onClick={handleRetryInitialization}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry Initialization
              </button>
            </div>
          )}
        </div>
      )}
      
      <Card className="flex-grow flex flex-col bg-gray-50/50 mb-4 overflow-hidden w-full">
        <CardContent className="flex-grow overflow-y-auto p-4 w-full">
          <div className="space-y-4 w-full">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} w-full`}
              >
                <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className={`h-8 w-8 flex-shrink-0 ${message.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                    <AvatarFallback>{message.sender === 'user' ? <User size={16} /> : <Bot size={16} />}</AvatarFallback>
                  </Avatar>
                  <div 
                    className={`rounded-lg px-4 py-2 ${
                      message.sender === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start w-full">
                <div className="flex items-start">
                  <Avatar className="h-8 w-8 mr-2 flex-shrink-0">
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
      
      <div className="flex gap-2 w-full">
        <Button 
          variant={isListening ? "default" : "outline"}
          size="icon" 
          onClick={handleVoiceInput}
          className={`flex-none ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
        >
          {isListening ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about health, diet, or wellness..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-grow"
          disabled={isListening}
        />
        <Button 
          onClick={handleSend} 
          disabled={!input.trim() || loading || !modelInitialized} 
          className="flex-none bg-blue-600 hover:bg-blue-700"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>⚠️ This is a demo application. The health assistant provides general information only, not medical advice.</p>
      </div>
    </div>
  );
};

export default AIAssistant;
