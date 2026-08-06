import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hello! I am the Greenary Assistant. How can I help you with waste management today?', isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('openChatbot', handleOpenChatbot);
    return () => window.removeEventListener('openChatbot', handleOpenChatbot);
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    const loadingMessage: Message = {
      id: 'loading',
      text: 'Thinking...',
      isUser: false,
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const responseText = await getGenerativeResponse(userMessage.text);
      setMessages((prev) => prev.map(msg => 
        msg.id === 'loading' 
          ? { ...msg, id: (Date.now() + 1).toString(), text: responseText } 
          : msg
      ));
    } catch (error) {
      setMessages((prev) => prev.map(msg => 
        msg.id === 'loading' 
          ? { ...msg, id: (Date.now() + 1).toString(), text: 'Sorry, I encountered an error.' } 
          : msg
      ));
    }
  };

  const getGenerativeResponse = async (text: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    // First check if our local rules have a specific answer
    const localResponse = getBotResponse(text);
    if (!localResponse.includes("That's a great question! While I'm still learning")) {
      // Use local rule if it matched something specific
      return localResponse;
    }

    if (!apiKey) {
      return "To answer general questions like this, I need a Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file in the root directory. You can get a free key from Google AI Studio (aistudio.google.com).";
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "You are the Greenary Assistant, a helpful AI chatbot for a smart waste management platform. Help users with waste segregation, recycling tips, protecting the environment, and reporting issues. Keep answers concise (1-3 sentences max), helpful, and friendly." }]
          },
          contents: [{ parts: [{ text }] }]
        })
      });
      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text;
      }
      console.error("Gemini API Error:", data);
      return "I'm having trouble connecting to my brain right now. Please check your API key and try again.";
    } catch (error) {
      console.error(error);
      return "Sorry, I encountered an error communicating with the AI service. Please try again later.";
    }
  };

  const getBotResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Greetings
    if (lowerText.match(/\b(hi|hello|hey|greetings)\b/)) {
      return "Hello there! I can help you with waste segregation, recycling tips, and reporting issues. What would you like to know?";
    }
    
    // Navigation/App Usage
    if (lowerText.includes('report') || lowerText.includes('issue')) {
      return "You can report an issue by navigating to the 'Report' page. Make sure to provide a location and a photo if possible!";
    }
    if (lowerText.includes('dashboard') || lowerText.includes('status')) {
      return "You can view the status of all reported issues on the Dashboard page.";
    }

    // Waste Segregation & Specific Questions
    if (lowerText.includes('plastic')) {
      if (lowerText.includes('useful') || lowerText.includes('recycle')) {
        return "Useful plastic includes PET bottles, milk jugs, and sturdy containers. Rinse them out and place them in the dry waste or recycling bin. Single-use plastics (like thin bags or wrappers) are generally not recyclable and should be minimized.";
      }
      return "Plastic waste should generally be cleaned and dried before being thrown into the dry waste bin. Try to avoid single-use plastics whenever possible!";
    }
    
    if (lowerText.includes('wet') || lowerText.includes('raw') || lowerText.includes('organic') || lowerText.includes('food')) {
      return "Wet waste or raw waste (like vegetable peels, fruit scraps, tea leaves, and leftover food) should be collected separately in a green bin. The best thing to do is compost it! Composting turns this waste into nutrient-rich soil for plants.";
    }

    if (lowerText.includes('dry') || lowerText.includes('paper') || lowerText.includes('cardboard') || lowerText.includes('glass')) {
      return "Dry waste includes paper, cardboard, glass, metals, and hard plastics. Ensure they are clean and dry, then place them in the blue recycling bin so they can be processed and reused.";
    }
    
    if (lowerText.includes('e-waste') || lowerText.includes('electronic') || lowerText.includes('battery') || lowerText.includes('phone')) {
      return "Electronic waste (e-waste) such as old phones, batteries, and cables contain hazardous materials. Never throw them in regular bins! Take them to a designated e-waste collection center or drop-off point.";
    }

    if (lowerText.includes('medical') || lowerText.includes('hazardous') || lowerText.includes('medicine') || lowerText.includes('syringe')) {
      return "Medical or hazardous waste (like expired medicines, syringes, or chemical containers) must be disposed of carefully. Check with your local pharmacy or hospital for proper disposal guidelines.";
    }

    if (lowerText.includes('compost')) {
      return "Composting is a great way to handle wet waste! Just mix your organic food scraps with some dry leaves or soil in a compost bin, keep it moist and aerated, and in a few weeks, you'll have excellent fertilizer.";
    }

    // Default Fallback
    return "That's a great question! While I'm still learning, I recommend checking local guidelines for specific waste disposal rules. Can I help you with anything else regarding the Greenary platform?";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 sm:w-96 h-[500px] flex flex-col mb-4 overflow-hidden transform transition-all duration-300 origin-bottom-right">
          {/* Header */}
          <div className="bg-[#4CAF50] p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
              <Bot size={24} />
              <h3 className="font-semibold text-lg">Greenary Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-green-100 transition-colors focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${msg.isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.isUser ? 'bg-blue-100 ml-2' : 'bg-green-100 mr-2'}`}>
                    {msg.isUser ? <User size={16} className="text-blue-600" /> : <Bot size={16} className="text-[#4CAF50]" />}
                  </div>
                  <div 
                    className={`p-3 rounded-2xl shadow-sm ${
                      msg.isUser 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#4CAF50] focus:ring-1 focus:ring-[#4CAF50]"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-[#4CAF50] text-white p-2 rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#4CAF50] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-green-600 transition-all duration-300 hover:scale-105 focus:outline-none flex items-center justify-center"
          aria-label="Open chat"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
};

export default Chatbot;
