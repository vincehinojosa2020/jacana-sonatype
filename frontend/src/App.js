import { useState, useEffect, useRef } from "react";
import "@/App.css";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Home, 
  Bed, 
  Bath, 
  Square, 
  Calendar,
  Zap, 
  Thermometer,
  Car,
  Flame,
  Phone,
  Mail,
  Linkedin,
  Play,
  ChevronDown,
  MapPin,
  DollarSign
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Property images from design guidelines + additional relevant images
const PROPERTY_IMAGES = [
  {
    url: "https://images.pexels.com/photos/16787444/pexels-photo-16787444.png",
    alt: "Contemporary home exterior",
    category: "exterior"
  },
  {
    url: "https://images.pexels.com/photos/8583808/pexels-photo-8583808.jpeg",
    alt: "Living room with vaulted ceilings",
    category: "living"
  },
  {
    url: "https://images.pexels.com/photos/16501663/pexels-photo-16501663.jpeg",
    alt: "Modern kitchen with granite countertops",
    category: "kitchen"
  },
  {
    url: "https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg",
    alt: "Master bedroom",
    category: "bedroom"
  }
];

const AGENT_IMAGE = "https://images.pexels.com/photos/7641843/pexels-photo-7641843.jpeg";

// Property data
const PROPERTY_DATA = {
  address: "5214 Jacana Lane",
  city: "San Jose, CA 95123",
  price: "$950,000",
  pricePerSqft: "$832/sq ft",
  beds: 3,
  baths: 2.5,
  sqft: "1,142",
  yearBuilt: 1988,
  hoa: "$255/mo",
  features: [
    { icon: Flame, label: "Fireplace", desc: "Cozy living room fireplace" },
    { icon: Zap, label: "EV Ready", desc: "Electric vehicle charging hookup" },
    { icon: Thermometer, label: "Central AC", desc: "Year-round comfort" },
    { icon: Car, label: "Garage", desc: "Attached garage + parking" }
  ]
};

// Chatbot Component
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm here to answer any questions about 5214 Jacana Lane. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: userMessage
      });
      setMessages(prev => [...prev, { role: "assistant", content: response.data.response }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble connecting right now. Please call George directly at 408.603.6603 for immediate assistance."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Trigger Button */}
      <button
        data-testid="chatbot-trigger"
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-16 h-16 bg-[#A51C30] text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-transform cursor-pointer z-50 chatbot-trigger ${isOpen ? 'hidden' : ''}`}
        style={{ borderRadius: '0' }}
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          data-testid="chatbot-window"
          className="fixed bottom-8 right-8 w-80 md:w-96 backdrop-blur-2xl bg-white/95 border border-[#A51C30]/20 shadow-2xl flex flex-col overflow-hidden z-50"
          style={{ height: '500px', borderRadius: '0' }}
        >
          {/* Header */}
          <div className="bg-[#A51C30] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Home size={20} />
              <div>
                <h3 className="font-heading text-lg font-semibold">Property Assistant</h3>
                <p className="text-xs opacity-80">5214 Jacana Lane</p>
              </div>
            </div>
            <button 
              data-testid="chatbot-close"
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chat-message flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 ${
                      msg.role === 'user'
                        ? 'bg-[#A51C30] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                    style={{ borderRadius: '0' }}
                  >
                    <p className="text-sm font-body">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3" style={{ borderRadius: '0' }}>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-[#A51C30] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-[#A51C30] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-[#A51C30] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                data-testid="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the property..."
                className="flex-1 border-[#A51C30]/30 focus:border-[#A51C30] focus:ring-[#A51C30]"
                style={{ borderRadius: '0' }}
              />
              <Button
                data-testid="chatbot-send"
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-[#A51C30] hover:bg-[#8A1527] text-white"
                style={{ borderRadius: '0' }}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Hero Section
const HeroSection = () => {
  const scrollToDetails = () => {
    document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section data-testid="hero-section" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={PROPERTY_IMAGES[0].url}
          alt={PROPERTY_IMAGES[0].alt}
          className="w-full h-full object-cover"
        />
        <div className="hero-overlay absolute inset-0"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-12 lg:px-24 py-24">
        <div className="max-w-3xl">
          {/* Label */}
          <p className="text-xs tracking-[0.3em] uppercase font-bold text-[#D4AF37] mb-4">
            Exclusive Listing
          </p>

          {/* Address */}
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-medium text-white tracking-tighter mb-4">
            {PROPERTY_DATA.address}
          </h1>
          <p className="font-body text-xl md:text-2xl text-white/80 mb-8 flex items-center gap-2">
            <MapPin size={20} className="text-[#D4AF37]" />
            {PROPERTY_DATA.city}
          </p>

          {/* Price & Stats */}
          <div className="flex flex-wrap gap-8 mb-12">
            <div>
              <p className="text-4xl md:text-5xl font-heading font-semibold text-white">
                {PROPERTY_DATA.price}
              </p>
              <p className="text-sm text-white/60 mt-1">{PROPERTY_DATA.pricePerSqft}</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-heading font-semibold text-white">{PROPERTY_DATA.beds}</p>
                <p className="text-xs uppercase tracking-wider text-white/60">Beds</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-heading font-semibold text-white">{PROPERTY_DATA.baths}</p>
                <p className="text-xs uppercase tracking-wider text-white/60">Baths</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-heading font-semibold text-white">{PROPERTY_DATA.sqft}</p>
                <p className="text-xs uppercase tracking-wider text-white/60">Sq Ft</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <a
              data-testid="hero-linkedin-btn"
              href="https://www.linkedin.com/in/george-toscano-6b979821/"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-btn relative overflow-hidden bg-[#0A0A0A] text-[#D4AF37] hover:bg-[#1A1A1A] border border-[#D4AF37]/30 transition-all duration-300 px-8 py-4 flex items-center gap-3 font-bold uppercase text-sm"
            >
              <Linkedin size={20} />
              Message George on LinkedIn
            </a>
            <a
              data-testid="hero-call-btn"
              href="tel:4086036603"
              className="bg-[#A51C30] text-white hover:bg-[#8A1527] transition-colors duration-300 px-8 py-4 flex items-center gap-3 font-bold uppercase text-sm"
            >
              <Phone size={20} />
              Call 408.603.6603
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button 
        onClick={scrollToDetails}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
};

// Property Details Section
const DetailsSection = () => {
  return (
    <section id="details" data-testid="details-section" className="bg-[#FAFAFA] py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A51C30] mb-4">
          Property Overview
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-[#0A0A0A] tracking-tight mb-16">
          Contemporary Living<br />in the Heart of San Jose
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-white border border-[#A51C30]/10 p-6 feature-card">
            <Bed className="text-[#A51C30] mb-4" size={28} />
            <p className="text-3xl font-heading font-semibold text-[#0A0A0A] stat-number">{PROPERTY_DATA.beds}</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Bedrooms</p>
          </div>
          <div className="bg-white border border-[#A51C30]/10 p-6 feature-card">
            <Bath className="text-[#A51C30] mb-4" size={28} />
            <p className="text-3xl font-heading font-semibold text-[#0A0A0A] stat-number">{PROPERTY_DATA.baths}</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Bathrooms</p>
          </div>
          <div className="bg-white border border-[#A51C30]/10 p-6 feature-card">
            <Square className="text-[#A51C30] mb-4" size={28} />
            <p className="text-3xl font-heading font-semibold text-[#0A0A0A] stat-number">{PROPERTY_DATA.sqft}</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Square Feet</p>
          </div>
          <div className="bg-white border border-[#A51C30]/10 p-6 feature-card">
            <Calendar className="text-[#A51C30] mb-4" size={28} />
            <p className="text-3xl font-heading font-semibold text-[#0A0A0A] stat-number">{PROPERTY_DATA.yearBuilt}</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider">Year Built</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROPERTY_DATA.features.map((feature, idx) => (
            <div key={idx} className="bg-white border border-[#A51C30]/10 p-6 feature-card">
              <feature.icon className="text-[#D4AF37] mb-4" size={24} />
              <h3 className="font-heading text-xl font-medium text-[#0A0A0A] mb-2">{feature.label}</h3>
              <p className="text-sm text-gray-600 font-body">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* HOA Notice */}
        <div className="mt-12 p-6 bg-[#A51C30]/5 border-l-4 border-[#A51C30]">
          <div className="flex items-center gap-3">
            <DollarSign className="text-[#A51C30]" size={24} />
            <div>
              <p className="font-medium text-[#0A0A0A]">HOA: {PROPERTY_DATA.hoa}</p>
              <p className="text-sm text-gray-600">Includes utilities, sewer, and water</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Photo Gallery Section
const GallerySection = () => {
  return (
    <section data-testid="gallery-section" className="bg-white py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A51C30] mb-4">
          Photo Gallery
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-[#0A0A0A] tracking-tight mb-12">
          See Every Detail
        </h2>

        {/* Bento Grid */}
        <div className="bento-grid">
          {PROPERTY_IMAGES.map((img, idx) => (
            <div key={idx} className="bento-item overflow-hidden group">
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover img-grayscale group-hover:scale-105 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Drone Footage Section
const DroneSection = () => {
  return (
    <section data-testid="drone-section" className="bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Label */}
        <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#D4AF37] mb-4">
          Aerial View
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-white tracking-tight mb-12">
          Drone Footage
        </h2>

        {/* Video Placeholder */}
        <div className="relative aspect-video max-w-4xl mx-auto bg-[#111111] border border-white/10 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 border-2 border-[#D4AF37] flex items-center justify-center animate-pulse-gold">
              <Play className="text-[#D4AF37]" size={32} />
            </div>
            <p className="pulse-text text-[#D4AF37] font-heading text-2xl md:text-3xl font-medium tracking-wider uppercase">
              Coming Soon
            </p>
          </div>
        </div>

        {/* Credit */}
        <p className="mt-8 text-xs tracking-[0.2em] uppercase text-white/40">
          Drone footage by Leon Mansalud{" "}
          <a 
            href="https://www.instagram.com/ayeleon" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors"
          >
            @ayeleon
          </a>
        </p>
      </div>
    </section>
  );
};

// Agent Profile Section
const AgentSection = () => {
  return (
    <section data-testid="agent-section" className="bg-[#111111] py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Agent Image */}
          <div className="order-2 md:order-1">
            <div className="aspect-square max-w-md mx-auto overflow-hidden border border-[#D4AF37]/20">
              <img
                src={AGENT_IMAGE}
                alt="George Toscano - Real Estate Agent"
                className="w-full h-full object-cover img-grayscale hover:filter-none transition-all duration-500"
              />
            </div>
          </div>

          {/* Agent Info */}
          <div className="order-1 md:order-2">
            <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#D4AF37] mb-4">
              Your Agent
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-white tracking-tight mb-4">
              George Toscano
            </h2>
            <p className="text-white/60 text-sm uppercase tracking-wider mb-6">
              DRE# 02213878 • Kollab Real Estate
            </p>

            <p className="font-body text-lg text-white/80 leading-relaxed mb-8">
              Bay Area Realtor with 20+ years in tech. Data is my language. 
              When you work with me, you get results—no games, no gimmicks. 
              I answer when you call. I fight for your corner. Period.
            </p>

            {/* Contact Buttons */}
            <div className="space-y-4">
              <a
                data-testid="agent-linkedin-btn"
                href="https://www.linkedin.com/in/george-toscano-6b979821/"
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin-btn relative overflow-hidden w-full bg-[#0A0A0A] text-[#D4AF37] hover:bg-[#1A1A1A] border border-[#D4AF37]/30 transition-all duration-300 px-8 py-4 flex items-center justify-center gap-3 font-bold uppercase text-sm"
              >
                <Linkedin size={20} />
                Message Me on LinkedIn
              </a>
              <div className="grid grid-cols-2 gap-4">
                <a
                  data-testid="agent-call-btn"
                  href="tel:4086036603"
                  className="bg-[#A51C30] text-white hover:bg-[#8A1527] transition-colors duration-300 px-6 py-4 flex items-center justify-center gap-2 font-bold uppercase text-sm"
                >
                  <Phone size={18} />
                  Call
                </a>
                <a
                  data-testid="agent-email-btn"
                  href="mailto:gtdrums@gmail.com"
                  className="bg-white/10 text-white hover:bg-white/20 transition-colors duration-300 px-6 py-4 flex items-center justify-center gap-2 font-bold uppercase text-sm"
                >
                  <Mail size={18} />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer data-testid="footer" className="bg-[#0A0A0A] py-12 px-6 md:px-12 lg:px-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-heading text-xl text-white mb-1">5214 Jacana Lane</p>
            <p className="text-sm text-white/40">San Jose, CA 95123</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-white/60">
              © 2025 George Toscano. All rights reserved.
            </p>
            <p className="text-xs text-white/40 mt-1">
              DRE# 02213878 • Kollab Real Estate
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App
function App() {
  return (
    <div className="App min-h-screen bg-[#FAFAFA]">
      <HeroSection />
      <DetailsSection />
      <GallerySection />
      <DroneSection />
      <AgentSection />
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
