import { useState, useEffect, useRef } from "react";
import "@/App.css";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";
import { Slider } from "./components/ui/slider";
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
  Pause,
  ChevronDown,
  MapPin,
  DollarSign,
  Calculator,
  ExternalLink,
  Music,
  Mic,
  MicOff,
  Globe,
  Image,
  Megaphone,
  Flag
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Language options with flags (using emoji flags for simplicity and beauty)
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', greeting: "Hey! Ask me anything about 5214 Jacana Lane." },
  { code: 'es', name: 'Español', flag: '🇪🇸', greeting: "¡Hola! Pregúntame lo que quieras sobre 5214 Jacana Lane." },
  { code: 'zh', name: '中文', flag: '🇨🇳', greeting: "你好！有关5214 Jacana Lane的任何问题都可以问我。" },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', greeting: "Xin chào! Hãy hỏi tôi bất cứ điều gì về 5214 Jacana Lane." },
  { code: 'fr', name: 'Français', flag: '🇫🇷', greeting: "Bonjour! Posez-moi vos questions sur 5214 Jacana Lane." },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', greeting: "مرحباً! اسألني أي شيء عن 5214 Jacana Lane." }
];

// Actual property images from uploaded assets + hero image we're keeping
const PROPERTY_IMAGES = [
  {
    url: "https://images.pexels.com/photos/16787444/pexels-photo-16787444.png",
    alt: "Contemporary home exterior",
    category: "exterior"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_luxury-home-showcase-1/artifacts/ihjd1v5s_59b9d56347618cb43e28559e1f7da8ad-cc_ft_384.webp",
    alt: "Living room with stone fireplace",
    category: "living"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_luxury-home-showcase-1/artifacts/ty2w647j_9b23ab2f6f901c9ab26d0ff958688091-cc_ft_768.webp",
    alt: "Property exterior street view",
    category: "exterior"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_luxury-home-showcase-1/artifacts/9eaxu7ts_eaf224eb1751e8f11ed9d12eed9b2e95-cc_ft_768.webp",
    alt: "In-unit washer and dryer",
    category: "laundry"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_luxury-home-showcase-1/artifacts/koscaccz_ada96c0e4a65eab0b64a853db9e0ba75-cc_ft_384.webp",
    alt: "Living room with fireplace - another view",
    category: "living"
  }
];

// George's actual headshot
const AGENT_IMAGE = "https://customer-assets.emergentagent.com/job_luxury-home-showcase-1/artifacts/sc55xg76_image.png";

// Property data
const PROPERTY_DATA = {
  address: "5214 Jacana Lane",
  city: "San Jose, CA 95123",
  price: 950000,
  priceFormatted: "$950,000",
  pricePerSqft: "$832/sq ft",
  beds: 3,
  baths: 2.5,
  sqft: "1,142",
  yearBuilt: 1988,
  hoa: "$255/mo",
  features: [
    { icon: Flame, label: "Stone Fireplace", desc: "Cozy gatherings start here" },
    { icon: Zap, label: "EV Ready", desc: "Charge while you sleep" },
    { icon: Thermometer, label: "Central AC", desc: "Comfort all year round" },
    { icon: Car, label: "Garage", desc: "Attached with extra parking" }
  ]
};

// Music Player Component - Direct MP3 playback, no popup
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Direct MP3 URL
  const AUDIO_URL = "https://customer-assets.emergentagent.com/job_luxury-home-showcase-1/artifacts/t1vby0cw_Stacy%20Kidd%20-%20I%20Love%20U%20%28Afro%20Mix%29.mp3";

  useEffect(() => {
    // Create audio element once
    if (!audioRef.current) {
      audioRef.current = new Audio(AUDIO_URL);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.7;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <button
      data-testid="music-player-btn"
      onClick={togglePlay}
      className={`fixed bottom-8 left-8 w-16 h-16 flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer z-50 ${isPlaying ? 'bg-[#0A0A0A] border border-[#D4AF37]/30' : 'bg-[#A51C30]'}`}
      style={{ borderRadius: '0' }}
      title={isPlaying ? "Pause I Love U" : "Play I Love U"}
    >
      {isPlaying ? (
        <div className="flex items-center gap-0.5">
          <span className="w-1 h-4 bg-[#D4AF37] animate-sound-wave" style={{ animationDelay: '0ms' }}></span>
          <span className="w-1 h-6 bg-[#D4AF37] animate-sound-wave" style={{ animationDelay: '150ms' }}></span>
          <span className="w-1 h-3 bg-[#D4AF37] animate-sound-wave" style={{ animationDelay: '300ms' }}></span>
          <span className="w-1 h-5 bg-[#D4AF37] animate-sound-wave" style={{ animationDelay: '450ms' }}></span>
        </div>
      ) : (
        <Music size={28} className="text-white" />
      )}
    </button>
  );
};

// Mortgage Calculator Component
const MortgageCalculator = () => {
  const [homePrice] = useState(PROPERTY_DATA.price);
  const [downPayment, setDownPayment] = useState(190000); // 20%
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const calculateMonthlyPayment = () => {
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    
    if (monthlyRate === 0) return principal / numPayments;
    
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                    (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    return payment;
  };

  const monthlyPayment = calculateMonthlyPayment();
  const monthlyHOA = 255;
  const totalMonthly = monthlyPayment + monthlyHOA;
  const downPaymentPercent = ((downPayment / homePrice) * 100).toFixed(0);

  return (
    <section data-testid="mortgage-section" className="bg-white py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A51C30] mb-4">
          Your Investment
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-[#0A0A0A] tracking-tight mb-4">
          What's My Payment?
        </h2>
        <p className="text-gray-600 mb-12 font-body">
          See exactly what you'd pay. No surprises.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Calculator Inputs */}
          <div className="space-y-8">
            {/* Down Payment */}
            <div>
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Down Payment</label>
                <span className="text-sm font-bold text-[#A51C30]">
                  ${downPayment.toLocaleString()} ({downPaymentPercent}%)
                </span>
              </div>
              <Slider
                data-testid="down-payment-slider"
                value={[downPayment]}
                onValueChange={(value) => setDownPayment(value[0])}
                min={47500}
                max={475000}
                step={5000}
                className="[&_[role=slider]]:bg-[#A51C30] [&_[role=slider]]:border-[#A51C30]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>

            {/* Interest Rate */}
            <div>
              <div className="flex justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Interest Rate</label>
                <span className="text-sm font-bold text-[#A51C30]">{interestRate}%</span>
              </div>
              <Slider
                data-testid="interest-rate-slider"
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                min={4}
                max={9}
                step={0.125}
                className="[&_[role=slider]]:bg-[#A51C30] [&_[role=slider]]:border-[#A51C30]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>4%</span>
                <span>9%</span>
              </div>
            </div>

            {/* Loan Term */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Loan Term</label>
              <div className="flex gap-4">
                {[15, 20, 30].map((term) => (
                  <button
                    key={term}
                    data-testid={`loan-term-${term}`}
                    onClick={() => setLoanTerm(term)}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
                      loanTerm === term 
                        ? 'bg-[#A51C30] text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {term} Years
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-[#0A0A0A] p-8 text-white">
            <div className="flex items-center gap-2 mb-6">
              <Calculator className="text-[#D4AF37]" size={24} />
              <span className="text-sm uppercase tracking-wider text-white/60">Your Monthly Payment</span>
            </div>
            
            <p className="text-5xl font-heading font-semibold text-white mb-2">
              ${Math.round(totalMonthly).toLocaleString()}
            </p>
            <p className="text-sm text-white/60 mb-8">per month (including HOA)</p>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex justify-between">
                <span className="text-white/60">Principal & Interest</span>
                <span className="font-medium">${Math.round(monthlyPayment).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">HOA Dues</span>
                <span className="font-medium">${monthlyHOA}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-white/10">
                <span className="text-white/60">Loan Amount</span>
                <span className="font-medium">${(homePrice - downPayment).toLocaleString()}</span>
              </div>
            </div>

            <a
              data-testid="mortgage-cta"
              href="tel:4086036603"
              className="mt-8 w-full bg-[#A51C30] hover:bg-[#8A1527] text-white py-4 flex items-center justify-center gap-2 font-bold uppercase text-sm transition-colors"
            >
              <Phone size={18} />
              Let's Make It Happen
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Chatbot Component with Language Selection and Voice Input
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: LANGUAGES[0].greeting
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Set language for recognition
      const langMap = { en: 'en-US', es: 'es-ES', zh: 'zh-CN', vi: 'vi-VN', fr: 'fr-FR', ar: 'ar-SA' };
      recognitionRef.current.lang = langMap[selectedLang.code] || 'en-US';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const changeLanguage = (lang) => {
    setSelectedLang(lang);
    setShowLangPicker(false);
    setMessages([{ role: "assistant", content: lang.greeting }]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: userMessage,
        language: selectedLang.code
      });
      setMessages(prev => [...prev, { role: "assistant", content: response.data.response }]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsgs = {
        en: "Having trouble connecting. Call George directly at 408-603-6603 — he picks up.",
        es: "Problemas de conexión. Llama a George directamente: 408-603-6603",
        zh: "连接问题。请直接致电 George：408-603-6603",
        vi: "Gặp sự cố kết nối. Gọi trực tiếp cho George: 408-603-6603",
        fr: "Problème de connexion. Appelez George: 408-603-6603",
        ar: "مشكلة في الاتصال. اتصل بجورج مباشرة: 408-603-6603"
      };
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: errorMsgs[selectedLang.code] || errorMsgs.en
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
          style={{ height: '550px', borderRadius: '0' }}
        >
          {/* Header with Language Selector */}
          <div className="bg-[#A51C30] text-white p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Home size={20} />
                <div>
                  <h3 className="font-heading text-lg font-semibold">Ask Anything</h3>
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
            
            {/* Language Selector */}
            <div className="relative">
              <button
                data-testid="lang-selector"
                onClick={() => setShowLangPicker(!showLangPicker)}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 transition-colors w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{selectedLang.flag}</span>
                  <span className="text-sm">{selectedLang.name}</span>
                </span>
                <Globe size={16} />
              </button>
              
              {showLangPicker && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-xl border border-gray-200 z-10">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang)}
                      className={`flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${selectedLang.code === lang.code ? 'bg-[#A51C30]/10' : ''}`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="text-sm text-gray-800 font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
                    <p className="text-sm font-body" style={{ direction: selectedLang.code === 'ar' ? 'rtl' : 'ltr' }}>{msg.content}</p>
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

          {/* Input with Microphone */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                data-testid="mic-btn"
                onClick={toggleListening}
                className={`p-2 transition-colors ${isListening ? 'bg-[#A51C30] text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                style={{ borderRadius: '0' }}
                title={isListening ? "Stop listening" : "Speak your question"}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <Input
                data-testid="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={selectedLang.code === 'ar' ? "...اسأل عن العقار" : "Ask about the property..."}
                className="flex-1 border-[#A51C30]/30 focus:border-[#A51C30] focus:ring-[#A51C30]"
                style={{ borderRadius: '0', direction: selectedLang.code === 'ar' ? 'rtl' : 'ltr' }}
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
      {/* Background Image - keeping the beautiful landing page photo */}
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
            Just Listed • San Jose •{" "}
            <a href="https://gtreal.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GT Real
            </a>
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
                {PROPERTY_DATA.priceFormatted}
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

          {/* CTAs - Frank Luntz style */}
          <div className="flex flex-wrap gap-4">
            <a
              data-testid="hero-linkedin-btn"
              href="https://www.linkedin.com/in/george-toscano-6b979821/"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-btn relative overflow-hidden bg-[#0A0A0A] text-[#D4AF37] hover:bg-[#1A1A1A] border border-[#D4AF37]/30 transition-all duration-300 px-8 py-4 flex items-center gap-3 font-bold uppercase text-sm"
            >
              <Linkedin size={20} />
              Message George Now
            </a>
            <a
              data-testid="hero-call-btn"
              href="tel:4086036603"
              className="bg-[#A51C30] text-white hover:bg-[#8A1527] transition-colors duration-300 px-8 py-4 flex items-center gap-3 font-bold uppercase text-sm"
            >
              <Phone size={20} />
              I Pick Up: 408-603-6603
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
          The Details
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-[#0A0A0A] tracking-tight mb-16">
          Move-In Ready.<br />No Compromises.
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
              <p className="text-sm text-gray-600">Utilities, sewer, water—all included. No surprises.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Photo Gallery Section - with all actual property photos
const GallerySection = () => {
  return (
    <section data-testid="gallery-section" className="bg-white py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A51C30] mb-4">
          See For Yourself
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-[#0A0A0A] tracking-tight mb-12">
          Every Room. Every Detail.
        </h2>

        {/* Bento Grid - now with 5 images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {/* Large image - exterior */}
          <div className="col-span-2 row-span-2 overflow-hidden group">
            <img
              src={PROPERTY_IMAGES[0].url}
              alt={PROPERTY_IMAGES[0].alt}
              className="w-full h-full object-cover img-grayscale group-hover:scale-105 transition-all duration-500"
              style={{ minHeight: '400px' }}
            />
          </div>
          {/* Living room */}
          <div className="overflow-hidden group">
            <img
              src={PROPERTY_IMAGES[1].url}
              alt={PROPERTY_IMAGES[1].alt}
              className="w-full h-48 md:h-full object-cover img-grayscale group-hover:scale-105 transition-all duration-500"
            />
          </div>
          {/* Exterior street view */}
          <div className="overflow-hidden group">
            <img
              src={PROPERTY_IMAGES[2].url}
              alt={PROPERTY_IMAGES[2].alt}
              className="w-full h-48 md:h-full object-cover img-grayscale group-hover:scale-105 transition-all duration-500"
            />
          </div>
          {/* Laundry */}
          <div className="overflow-hidden group">
            <img
              src={PROPERTY_IMAGES[3].url}
              alt={PROPERTY_IMAGES[3].alt}
              className="w-full h-48 md:h-full object-cover img-grayscale group-hover:scale-105 transition-all duration-500"
            />
          </div>
          {/* Living room another view */}
          <div className="overflow-hidden group">
            <img
              src={PROPERTY_IMAGES[4].url}
              alt={PROPERTY_IMAGES[4].alt}
              className="w-full h-48 md:h-full object-cover img-grayscale group-hover:scale-105 transition-all duration-500"
            />
          </div>
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
          Coming Soon
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-white tracking-tight mb-12">
          Aerial View
        </h2>

        {/* Video Placeholder */}
        <div className="relative aspect-video max-w-4xl mx-auto bg-[#111111] border border-white/10 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 border-2 border-[#D4AF37] flex items-center justify-center animate-pulse-gold">
              <Play className="text-[#D4AF37]" size={32} />
            </div>
            <p className="pulse-text text-[#D4AF37] font-heading text-2xl md:text-3xl font-medium tracking-wider uppercase">
              Drone Footage
            </p>
            <p className="text-white/40 text-sm mt-2">Launching soon</p>
          </div>
        </div>

        {/* Credit */}
        <p className="mt-8 text-xs tracking-[0.2em] uppercase text-white/40">
          Captured by Leon Mansalud{" "}
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

// Agent Profile Section - with George's actual headshot
const AgentSection = () => {
  return (
    <section data-testid="agent-section" className="bg-[#111111] py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Agent Image - properly formatted */}
          <div className="order-2 md:order-1 flex justify-center">
            <div className="relative">
              {/* Background accent */}
              <div className="absolute -inset-4 bg-gradient-to-br from-[#A51C30]/20 to-[#D4AF37]/20 -z-10"></div>
              {/* Image container */}
              <div className="w-80 h-96 overflow-hidden border-2 border-[#D4AF37]/30 bg-gradient-to-b from-white to-gray-100">
                <img
                  src={AGENT_IMAGE}
                  alt="George Toscano - Your Bay Area Realtor"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              {/* Name badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#A51C30] px-6 py-2">
                <p className="text-white text-sm font-bold uppercase tracking-wider whitespace-nowrap">George Toscano</p>
              </div>
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
              20 years in tech. Data is my language. When you work with me, 
              you get someone who actually picks up the phone. No games. No gimmicks. 
              Just results.
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
                Let's Connect on LinkedIn
              </a>
              <div className="grid grid-cols-2 gap-4">
                <a
                  data-testid="agent-call-btn"
                  href="tel:4086036603"
                  className="bg-[#A51C30] text-white hover:bg-[#8A1527] transition-colors duration-300 px-6 py-4 flex items-center justify-center gap-2 font-bold uppercase text-sm"
                >
                  <Phone size={18} />
                  Call Me
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

// Marketing Materials Section - Actual Billboard & Sign Mockups
const MarketingSection = () => {
  return (
    <section data-testid="marketing-section" className="bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase font-bold text-[#D4AF37] mb-4 flex items-center justify-center gap-2">
            <Megaphone size={16} />
            Marketing That Hits Different
          </p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight mb-6">
            Street Signs.<br />
            <span className="text-[#A51C30]">Billboards.</span><br />
            Open House Swag.
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Forget boring real estate marketing. This is what happens when you bring 
            <span className="text-[#D4AF37] font-semibold"> Madison Avenue energy </span> 
            to San Jose.
          </p>
        </div>

        {/* Large Billboard Mockup - Hero */}
        <div className="mb-12">
          <div className="relative">
            {/* Billboard Frame */}
            <div className="bg-gradient-to-b from-gray-600 to-gray-800 p-4 rounded-sm shadow-2xl">
              {/* Billboard Content */}
              <div className="bg-[#A51C30] aspect-[3/1] flex items-center justify-between px-8 md:px-16 relative overflow-hidden">
                {/* Left side - Text */}
                <div className="z-10">
                  <p className="text-white/80 text-sm md:text-lg uppercase tracking-widest mb-2">Just Listed</p>
                  <h3 className="font-heading text-3xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    5214<br />JACANA
                  </h3>
                  <p className="text-[#D4AF37] text-2xl md:text-4xl font-heading font-bold mt-2">$950K</p>
                </div>
                
                {/* Right side - Info */}
                <div className="text-right z-10">
                  <p className="text-white text-lg md:text-2xl font-bold">3 BED • 2.5 BATH</p>
                  <p className="text-white/80 text-sm md:text-lg">San Jose, CA</p>
                  <div className="mt-4 bg-[#D4AF37] text-[#0A0A0A] px-4 py-2 inline-block">
                    <p className="font-bold text-lg md:text-xl">GTREAL.IO</p>
                  </div>
                  <p className="text-white/60 text-sm mt-2">408-603-6603</p>
                </div>
                
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-black/30 to-transparent"></div>
                </div>
              </div>
            </div>
            {/* Billboard Stand */}
            <div className="flex justify-center">
              <div className="w-8 h-24 bg-gradient-to-b from-gray-600 to-gray-700"></div>
              <div className="w-8 h-24 bg-gradient-to-b from-gray-600 to-gray-700 ml-32"></div>
            </div>
          </div>
          <p className="text-center text-white/30 text-xs mt-4 uppercase tracking-widest">Highway 101 Billboard Mockup</p>
        </div>

        {/* Yard Signs Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Open House Sign */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Sign */}
              <div className="bg-[#A51C30] w-64 h-40 flex flex-col items-center justify-center shadow-xl border-4 border-white">
                <p className="text-white text-xs uppercase tracking-widest">Open House</p>
                <p className="text-white font-heading text-3xl font-bold">TODAY</p>
                <p className="text-[#D4AF37] text-lg font-bold">1PM - 4PM</p>
                <p className="text-white/80 text-sm mt-1">5214 Jacana Lane</p>
              </div>
              {/* Stake */}
              <div className="w-2 h-20 bg-gray-400 mx-auto"></div>
            </div>
            <p className="text-white/30 text-xs mt-2 uppercase tracking-wider">Yard Sign</p>
          </div>

          {/* For Sale Sign */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Sign */}
              <div className="bg-[#0A0A0A] w-64 h-40 flex flex-col items-center justify-center shadow-xl border-4 border-[#D4AF37]">
                <p className="text-[#D4AF37] text-xs uppercase tracking-widest">For Sale</p>
                <p className="text-white font-heading text-2xl font-bold">$950,000</p>
                <p className="text-white/60 text-sm">3 Bed • 2.5 Bath</p>
                <div className="mt-2 bg-[#A51C30] px-3 py-1">
                  <p className="text-white text-xs font-bold">GTREAL.IO</p>
                </div>
              </div>
              {/* Stake */}
              <div className="w-2 h-20 bg-gray-400 mx-auto"></div>
            </div>
            <p className="text-white/30 text-xs mt-2 uppercase tracking-wider">For Sale Sign</p>
          </div>

          {/* Directional Arrow */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Sign */}
              <div className="bg-[#D4AF37] w-64 h-40 flex items-center justify-center shadow-xl relative">
                <div className="text-center">
                  <p className="text-[#0A0A0A] font-heading text-2xl font-bold">OPEN</p>
                  <p className="text-[#0A0A0A] font-heading text-2xl font-bold">HOUSE</p>
                  <p className="text-[#0A0A0A]/60 text-sm">→ 2 Blocks</p>
                </div>
                {/* Arrow shape */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#D4AF37] transform rotate-45"></div>
              </div>
              {/* Stake */}
              <div className="w-2 h-20 bg-gray-400 mx-auto"></div>
            </div>
            <p className="text-white/30 text-xs mt-2 uppercase tracking-wider">Directional Sign</p>
          </div>
        </div>

        {/* Flyer / Brochure Mockup */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-16">
          {/* Stack of flyers */}
          <div className="relative w-72">
            {/* Back flyers (stacked effect) */}
            <div className="absolute top-2 left-2 w-full h-80 bg-white/80 shadow-lg transform rotate-2"></div>
            <div className="absolute top-1 left-1 w-full h-80 bg-white/90 shadow-lg transform rotate-1"></div>
            {/* Front flyer */}
            <div className="relative bg-white w-full h-80 shadow-2xl p-4 flex flex-col">
              <div className="bg-[#A51C30] h-32 flex items-center justify-center mb-3">
                <div className="text-center">
                  <p className="text-white font-heading text-2xl font-bold">5214 JACANA</p>
                  <p className="text-[#D4AF37] text-xl font-bold">$950,000</p>
                </div>
              </div>
              <div className="flex-1 text-[#0A0A0A]">
                <p className="text-sm font-bold mb-1">3 Bed • 2.5 Bath • 1,142 Sq Ft</p>
                <p className="text-xs text-gray-600 mb-2">San Jose, CA 95123</p>
                <div className="grid grid-cols-2 gap-1 text-xs mb-2">
                  <span>✓ Stone Fireplace</span>
                  <span>✓ EV Ready</span>
                  <span>✓ Central AC</span>
                  <span>✓ Garage</span>
                </div>
                <div className="mt-auto border-t pt-2">
                  <p className="text-[#A51C30] font-bold text-sm">George Toscano</p>
                  <p className="text-xs">408-603-6603 • GTREAL.IO</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center md:text-left max-w-sm">
            <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-2">Open House Ready</p>
            <h3 className="text-white font-heading text-2xl font-bold mb-3">Property Flyers</h3>
            <p className="text-white/60 text-sm">Stacked on the kitchen counter. Take one — or take five for your friends who are still renting.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-[#A51C30] p-1">
            <div className="bg-[#0A0A0A] px-8 py-4">
              <p className="text-[#D4AF37] font-heading text-xl md:text-2xl font-semibold">
                Want custom marketing like this?
              </p>
              <a 
                href="https://gtreal.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 text-sm hover:text-[#D4AF37] transition-colors"
              >
                Talk to GT Real →
              </a>
            </div>
          </div>
        </div>

        {/* Animated scroll text */}
        <div className="mt-16 overflow-hidden">
          <div className="flex gap-12 animate-scroll-left whitespace-nowrap">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-12">
                <span className="text-6xl md:text-8xl font-heading font-bold text-white/5">GTREAL.IO</span>
                <span className="text-6xl md:text-8xl font-heading font-bold text-[#A51C30]/10">5214 JACANA</span>
                <span className="text-6xl md:text-8xl font-heading font-bold text-[#D4AF37]/10">$950K</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Platform Links Section - Zillow and Redfin tiles
const PlatformLinksSection = () => {
  return (
    <section data-testid="platform-links-section" className="bg-[#FAFAFA] py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A51C30] mb-4 text-center">
          More Details
        </p>
        <h2 className="font-heading text-2xl md:text-3xl font-medium text-[#0A0A0A] tracking-tight mb-8 text-center">
          See the Full Listing
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Zillow Tile */}
          <a
            data-testid="zillow-link"
            href="https://www.zillow.com/homedetails/5214-Jacana-Ln-San-Jose-CA-95123/19826723_zpid/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 p-6 flex flex-col items-center justify-center gap-3 hover:border-[#A51C30]/30 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 bg-[#006AFF] flex items-center justify-center">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="font-bold text-[#0A0A0A] uppercase text-sm tracking-wider">Zillow</span>
            <ExternalLink size={16} className="text-gray-400 group-hover:text-[#A51C30] transition-colors" />
          </a>
          
          {/* Redfin Tile */}
          <a
            data-testid="redfin-link"
            href="https://www.redfin.com/CA/San-Jose/5214-Jacana-Ln-95123/home/1584856"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-gray-200 p-6 flex flex-col items-center justify-center gap-3 hover:border-[#A51C30]/30 hover:shadow-lg transition-all group"
          >
            <div className="w-12 h-12 bg-[#A02021] flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-[#0A0A0A] uppercase text-sm tracking-wider">Redfin</span>
            <ExternalLink size={16} className="text-gray-400 group-hover:text-[#A51C30] transition-colors" />
          </a>
        </div>
      </div>
    </section>
  );
};

// Footer with GT Real shoutout and Charlotte design credit
const Footer = () => {
  return (
    <footer data-testid="footer" className="bg-[#0A0A0A] py-16 px-6 md:px-12 lg:px-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <p className="font-heading text-2xl text-white mb-1">5214 Jacana Lane</p>
            <p className="text-sm text-white/40">San Jose, CA 95123</p>
          </div>
          
          {/* GT Real - Prominent branding */}
          <div className="text-center">
            <a 
              href="https://gtreal.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex flex-col items-center group"
            >
              <div className="bg-[#A51C30] px-6 py-3 mb-2 group-hover:bg-[#D4AF37] transition-colors">
                <p className="text-white text-2xl font-heading font-bold tracking-wider group-hover:text-[#0A0A0A] transition-colors">
                  GTREAL.IO
                </p>
              </div>
              <p className="text-white/40 text-xs uppercase tracking-[0.2em] group-hover:text-[#D4AF37] transition-colors">
                Get Real. Get Results.
              </p>
            </a>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-white/60">
              © 2025 George Toscano
            </p>
            <p className="text-xs text-white/40 mt-1">
              DRE# 02213878 • Kollab Real Estate
            </p>
          </div>
        </div>
        
        {/* Design credit - Charlotte */}
        <div className="pt-8 border-t border-white/5 text-center">
          <a 
            href="https://charlottesoftwareengineering.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/20 hover:text-[#D4AF37] transition-colors group"
          >
            <span className="text-xs uppercase tracking-[0.3em]">design by</span>
            <span className="text-sm font-medium text-white/40 group-hover:text-[#D4AF37] transition-colors">Charlotte.</span>
          </a>
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
      <MortgageCalculator />
      <DroneSection />
      <AgentSection />
      <MarketingSection />
      <PlatformLinksSection />
      <Footer />
      <MusicPlayer />
      <Chatbot />
    </div>
  );
}

export default App;
