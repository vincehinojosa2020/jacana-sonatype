import { useState, useEffect, useRef, createContext, useContext } from "react";
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

// Language Context
const LanguageContext = createContext();

// Language options with flags
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', greeting: "Hey! Ask me anything about 5214 Jacana Lane." },
  { code: 'es', name: 'Español', flag: '🇪🇸', greeting: "¡Hola! Pregúntame lo que quieras sobre 5214 Jacana Lane." },
  { code: 'zh', name: '中文', flag: '🇨🇳', greeting: "你好！有关5214 Jacana Lane的任何问题都可以问我。" },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', greeting: "Xin chào! Hãy hỏi tôi bất cứ điều gì về 5214 Jacana Lane." },
  { code: 'fr', name: 'Français', flag: '🇫🇷', greeting: "Bonjour! Posez-moi vos questions sur 5214 Jacana Lane." },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', greeting: "مرحباً! اسألني أي شيء عن 5214 Jacana Lane." }
];

// Translations for the entire UI
const TRANSLATIONS = {
  en: {
    // Hero
    justListed: "Just Listed",
    sanJose: "San Jose",
    messageGeorge: "Message George Now",
    iPickUp: "I Pick Up: 408-603-6603",
    // Details
    propertyOverview: "Property Overview",
    contemporaryLiving: "Contemporary Living",
    inHeartOfSanJose: "in the Heart of San Jose",
    moveInReady: "Move-In Ready.",
    noCompromises: "No Compromises.",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    squareFeet: "Square Feet",
    yearBuilt: "Year Built",
    stoneFireplace: "Stone Fireplace",
    cozyGatherings: "Cozy gatherings start here",
    evReady: "EV Ready",
    chargeWhileSleep: "Charge while you sleep",
    centralAC: "Central AC",
    yearRoundComfort: "Comfort all year round",
    garage: "Garage",
    attachedParking: "Attached with extra parking",
    hoaIncludes: "HOA: $260/month",
    // Zillow
    viewOnZillow: "View Full Listing & Pricing on Zillow",
    zillowShowcase: "Zillow Showcase",
    seeFullPricing: "See pricing, open house schedule, and agent details on Zillow Showcase.",
    // Open House
    openHouseSchedule: "Open House Schedule",
    openHouseDays: "Saturday & Sunday",
    openHouseTime: "1:00 PM – 4:00 PM",
    comeVisit: "Come see it in person. No appointment needed.",
    // Drone
    comingSoon: "Coming Soon",
    aerialView: "Aerial View",
    droneLaunching: "Launching soon",
    droneBy: "Captured by Leon Mansalud",
    // Agent
    yourAgent: "Your Agent",
    agentBio: "20 years in tech. Data is my language. When you work with me, you get someone who actually picks up the phone. No games. No gimmicks. Just results.",
    letsConnect: "Let's Connect on LinkedIn",
    callMe: "Call Me",
    email: "Email",
    // Marketing
    marketingHits: "Marketing That Hits Different",
    streetSigns: "Street Signs.",
    billboards: "Billboards.",
    openHouseSwag: "Open House Swag.",
    forgetBoring: "Forget boring real estate marketing. This is what happens when you bring",
    madisonAve: "Madison Avenue energy",
    toSanJose: "to San Jose.",
    openHouse: "Open House",
    today: "TODAY",
    forSale: "For Sale",
    blocks: "2 Blocks",
    openHouseReady: "Open House Ready",
    propertyFlyers: "Property Flyers",
    stackedOnCounter: "Stacked on the kitchen counter. Take one — or take five for your friends who are still renting.",
    wantCustom: "Want custom marketing like this?",
    talkToGT: "Talk to GT Real →",
    // Platform
    moreDetails: "More Details",
    seeFullListing: "See the Full Listing",
    // Footer
    getRealGetResults: "Get Real. Get Results.",
    designBy: "design by",
    // Chatbot
    askAnything: "Ask Anything",
    askAboutProperty: "Ask about the property...",
  },
  es: {
    justListed: "Recién Listado",
    sanJose: "San José",
    messageGeorge: "Mensaje a George",
    iPickUp: "Llámame: 408-603-6603",
    propertyOverview: "Resumen de la Propiedad",
    contemporaryLiving: "Vida Contemporánea",
    inHeartOfSanJose: "en el Corazón de San José",
    moveInReady: "Listo para Mudarse.",
    noCompromises: "Sin Compromisos.",
    bedrooms: "Habitaciones",
    bathrooms: "Baños",
    squareFeet: "Pies Cuadrados",
    yearBuilt: "Año de Construcción",
    stoneFireplace: "Chimenea de Piedra",
    cozyGatherings: "Reuniones acogedoras aquí",
    evReady: "Listo para EV",
    chargeWhileSleep: "Carga mientras duermes",
    centralAC: "Aire Central",
    yearRoundComfort: "Confort todo el año",
    garage: "Garaje",
    attachedParking: "Adjunto con estacionamiento extra",
    hoaIncludes: "HOA: $260/mes",
    viewOnZillow: "Ver Listado Completo y Precios en Zillow",
    zillowShowcase: "Zillow Showcase",
    seeFullPricing: "Vea precios, horarios de casa abierta e info del agente en Zillow Showcase.",
    openHouseSchedule: "Horario de Casa Abierta",
    openHouseDays: "Sábado y Domingo",
    openHouseTime: "1:00 PM – 4:00 PM",
    comeVisit: "Venga a verla en persona. Sin cita previa.",
    comingSoon: "Próximamente",
    aerialView: "Vista Aérea",
    droneLaunching: "Lanzamiento pronto",
    droneBy: "Capturado por Leon Mansalud",
    yourAgent: "Tu Agente",
    agentBio: "20 años en tecnología. Los datos son mi idioma. Cuando trabajas conmigo, obtienes a alguien que realmente contesta el teléfono.",
    letsConnect: "Conectemos en LinkedIn",
    callMe: "Llámame",
    email: "Correo",
    marketingHits: "Marketing Que Impacta",
    streetSigns: "Señales.",
    billboards: "Vallas.",
    openHouseSwag: "Promocionales.",
    forgetBoring: "Olvida el marketing aburrido. Esto pasa cuando traes",
    madisonAve: "energía de Madison Avenue",
    toSanJose: "a San José.",
    openHouse: "Casa Abierta",
    today: "HOY",
    forSale: "En Venta",
    blocks: "2 Cuadras",
    openHouseReady: "Listo para Casa Abierta",
    propertyFlyers: "Volantes",
    stackedOnCounter: "Apilados en la cocina. Toma uno — o cinco para tus amigos.",
    wantCustom: "¿Quieres marketing así?",
    talkToGT: "Habla con GT Real →",
    moreDetails: "Más Detalles",
    seeFullListing: "Ver Listado Completo",
    getRealGetResults: "Sé Real. Obtén Resultados.",
    designBy: "diseño por",
    askAnything: "Pregunta Lo Que Sea",
    askAboutProperty: "Pregunta sobre la propiedad...",
  },
  zh: {
    justListed: "新上市",
    sanJose: "圣何塞",
    messageGeorge: "联系 George",
    iPickUp: "电话: 408-603-6603",
    propertyOverview: "房产概览",
    contemporaryLiving: "现代生活",
    inHeartOfSanJose: "位于圣何塞中心",
    moveInReady: "即可入住",
    noCompromises: "品质保证",
    bedrooms: "卧室",
    bathrooms: "浴室",
    squareFeet: "平方英尺",
    yearBuilt: "建造年份",
    stoneFireplace: "石壁炉",
    cozyGatherings: "温馨聚会的好地方",
    evReady: "电动车充电",
    chargeWhileSleep: "睡觉时充电",
    centralAC: "中央空调",
    yearRoundComfort: "全年舒适",
    garage: "车库",
    attachedParking: "附带额外停车位",
    hoaIncludes: "HOA: $260/月",
    viewOnZillow: "在Zillow上查看完整列表和价格",
    zillowShowcase: "Zillow Showcase",
    seeFullPricing: "在Zillow Showcase查看价格、开放日和经纪人信息。",
    openHouseSchedule: "开放日时间",
    openHouseDays: "周六和周日",
    openHouseTime: "下午1:00 – 4:00",
    comeVisit: "欢迎亲自参观，无需预约。",
    comingSoon: "即将推出",
    aerialView: "航拍视角",
    droneLaunching: "即将发布",
    droneBy: "由 Leon Mansalud 拍摄",
    yourAgent: "您的经纪人",
    agentBio: "20年科技经验。数据是我的语言。和我合作，您会得到一个真正接电话的人。",
    letsConnect: "在LinkedIn联系",
    callMe: "打电话",
    email: "邮件",
    marketingHits: "与众不同的营销",
    streetSigns: "街头标牌",
    billboards: "广告牌",
    openHouseSwag: "开放日物料",
    forgetBoring: "忘掉无聊的房产营销。这就是",
    madisonAve: "麦迪逊大道能量",
    toSanJose: "来到圣何塞",
    openHouse: "开放参观",
    today: "今天",
    forSale: "出售中",
    blocks: "2个街区",
    openHouseReady: "开放日准备就绪",
    propertyFlyers: "房产传单",
    stackedOnCounter: "放在厨房台面上。拿一张——或者给朋友拿五张。",
    wantCustom: "想要这样的营销吗？",
    talkToGT: "联系 GT Real →",
    moreDetails: "更多详情",
    seeFullListing: "查看完整列表",
    getRealGetResults: "真实可靠，成果显著",
    designBy: "设计",
    askAnything: "随便问",
    askAboutProperty: "询问房产信息...",
  },
  vi: {
    justListed: "Mới Đăng",
    sanJose: "San Jose",
    messageGeorge: "Nhắn Tin George",
    iPickUp: "Gọi: 408-603-6603",
    propertyOverview: "Tổng Quan Bất Động Sản",
    contemporaryLiving: "Cuộc Sống Hiện Đại",
    inHeartOfSanJose: "tại Trung Tâm San Jose",
    moveInReady: "Sẵn Sàng Dọn Vào",
    noCompromises: "Không Thỏa Hiệp",
    bedrooms: "Phòng Ngủ",
    bathrooms: "Phòng Tắm",
    squareFeet: "Feet Vuông",
    yearBuilt: "Năm Xây",
    stoneFireplace: "Lò Sưởi Đá",
    cozyGatherings: "Nơi sum họp ấm cúng",
    evReady: "Sạc Xe Điện",
    chargeWhileSleep: "Sạc khi ngủ",
    centralAC: "Điều Hòa Trung Tâm",
    yearRoundComfort: "Thoải mái quanh năm",
    garage: "Nhà Xe",
    attachedParking: "Kèm chỗ đậu xe",
    hoaIncludes: "HOA: $260/tháng",
    viewOnZillow: "Xem Đầy Đủ Danh Sách & Giá Trên Zillow",
    zillowShowcase: "Zillow Showcase",
    seeFullPricing: "Xem giá, lịch open house và thông tin đại lý trên Zillow Showcase.",
    openHouseSchedule: "Lịch Open House",
    openHouseDays: "Thứ Bảy & Chủ Nhật",
    openHouseTime: "1:00 PM – 4:00 PM",
    comeVisit: "Đến xem trực tiếp. Không cần hẹn trước.",
    comingSoon: "Sắp Ra Mắt",
    aerialView: "Góc Nhìn Trên Cao",
    droneLaunching: "Sắp phát hành",
    droneBy: "Quay bởi Leon Mansalud",
    yourAgent: "Đại Lý Của Bạn",
    agentBio: "20 năm trong công nghệ. Dữ liệu là ngôn ngữ của tôi. Khi làm việc với tôi, bạn có người thực sự nghe máy.",
    letsConnect: "Kết Nối LinkedIn",
    callMe: "Gọi",
    email: "Email",
    marketingHits: "Marketing Khác Biệt",
    streetSigns: "Biển Báo",
    billboards: "Bảng Quảng Cáo",
    openHouseSwag: "Vật Phẩm Open House",
    forgetBoring: "Quên marketing nhàm chán. Đây là khi",
    madisonAve: "năng lượng Madison Avenue",
    toSanJose: "đến San Jose",
    openHouse: "Open House",
    today: "HÔM NAY",
    forSale: "Đang Bán",
    blocks: "2 Block",
    openHouseReady: "Sẵn Sàng Open House",
    propertyFlyers: "Tờ Rơi",
    stackedOnCounter: "Xếp trên quầy bếp. Lấy một tờ — hoặc năm tờ cho bạn bè.",
    wantCustom: "Muốn marketing như này?",
    talkToGT: "Liên hệ GT Real →",
    moreDetails: "Chi Tiết Thêm",
    seeFullListing: "Xem Đầy Đủ",
    getRealGetResults: "Thật Sự. Kết Quả.",
    designBy: "thiết kế bởi",
    askAnything: "Hỏi Bất Cứ Điều Gì",
    askAboutProperty: "Hỏi về bất động sản...",
  },
  fr: {
    justListed: "Nouvelle Annonce",
    sanJose: "San José",
    messageGeorge: "Contacter George",
    iPickUp: "Appelez: 408-603-6603",
    propertyOverview: "Aperçu de la Propriété",
    contemporaryLiving: "Vie Contemporaine",
    inHeartOfSanJose: "au Cœur de San José",
    moveInReady: "Prêt à Emménager",
    noCompromises: "Sans Compromis",
    bedrooms: "Chambres",
    bathrooms: "Salles de Bain",
    squareFeet: "Pieds Carrés",
    yearBuilt: "Année de Construction",
    stoneFireplace: "Cheminée en Pierre",
    cozyGatherings: "Pour des réunions chaleureuses",
    evReady: "Prêt pour VE",
    chargeWhileSleep: "Rechargez en dormant",
    centralAC: "Climatisation Centrale",
    yearRoundComfort: "Confort toute l'année",
    garage: "Garage",
    attachedParking: "Avec stationnement supplémentaire",
    hoaIncludes: "Services inclus—HOA: $260/mois",
    viewOnZillow: "Voir l'Annonce Complète et Prix sur Zillow",
    zillowShowcase: "Zillow Showcase",
    seeFullPricing: "Voir les prix, horaires portes ouvertes et détails de l'agent sur Zillow Showcase.",
    openHouseSchedule: "Horaires Portes Ouvertes",
    openHouseDays: "Samedi et Dimanche",
    openHouseTime: "13h00 – 16h00",
    comeVisit: "Venez voir en personne. Sans rendez-vous.",
    comingSoon: "Bientôt Disponible",
    aerialView: "Vue Aérienne",
    droneLaunching: "Lancement bientôt",
    droneBy: "Capturé par Leon Mansalud",
    yourAgent: "Votre Agent",
    agentBio: "20 ans dans la tech. Les données sont mon langage. Avec moi, vous avez quelqu'un qui répond vraiment au téléphone.",
    letsConnect: "Connectons-nous sur LinkedIn",
    callMe: "Appelez",
    email: "Email",
    marketingHits: "Marketing Qui Frappe",
    streetSigns: "Panneaux",
    billboards: "Affiches",
    openHouseSwag: "Matériel Open House",
    forgetBoring: "Oubliez le marketing ennuyeux. Voici ce qui arrive quand",
    madisonAve: "l'énergie de Madison Avenue",
    toSanJose: "arrive à San José",
    openHouse: "Portes Ouvertes",
    today: "AUJOURD'HUI",
    forSale: "À Vendre",
    blocks: "2 Rues",
    openHouseReady: "Prêt pour Portes Ouvertes",
    propertyFlyers: "Dépliants",
    stackedOnCounter: "Empilés sur le comptoir. Prenez-en un — ou cinq pour vos amis.",
    wantCustom: "Vous voulez ce marketing?",
    talkToGT: "Parlez à GT Real →",
    moreDetails: "Plus de Détails",
    seeFullListing: "Voir l'Annonce Complète",
    getRealGetResults: "Soyez Réel. Obtenez des Résultats.",
    designBy: "design par",
    askAnything: "Demandez N'importe Quoi",
    askAboutProperty: "Posez vos questions...",
  },
  ar: {
    justListed: "مدرج حديثاً",
    sanJose: "سان خوسيه",
    messageGeorge: "راسل جورج",
    iPickUp: "اتصل: 408-603-6603",
    propertyOverview: "نظرة عامة على العقار",
    contemporaryLiving: "حياة عصرية",
    inHeartOfSanJose: "في قلب سان خوسيه",
    moveInReady: "جاهز للسكن",
    noCompromises: "بدون تنازلات",
    bedrooms: "غرف نوم",
    bathrooms: "حمامات",
    squareFeet: "قدم مربع",
    yearBuilt: "سنة البناء",
    stoneFireplace: "مدفأة حجرية",
    cozyGatherings: "للتجمعات الدافئة",
    evReady: "شحن سيارة كهربائية",
    chargeWhileSleep: "اشحن أثناء النوم",
    centralAC: "تكييف مركزي",
    yearRoundComfort: "راحة على مدار السنة",
    garage: "مرآب",
    attachedParking: "مع موقف إضافي",
    hoaIncludes: "HOA: $260/شهرياً",
    viewOnZillow: "شاهد القائمة الكاملة والأسعار على Zillow",
    zillowShowcase: "Zillow Showcase",
    seeFullPricing: "شاهد الأسعار ومواعيد البيت المفتوح ومعلومات الوكيل على Zillow Showcase.",
    openHouseSchedule: "مواعيد البيت المفتوح",
    openHouseDays: "السبت والأحد",
    openHouseTime: "1:00 م – 4:00 م",
    comeVisit: "تعال وشاهد بنفسك. بدون موعد.",
    comingSoon: "قريباً",
    aerialView: "منظر جوي",
    droneLaunching: "قريباً",
    droneBy: "تصوير ليون مانسالود",
    yourAgent: "وكيلك",
    agentBio: "20 عاماً في التقنية. البيانات هي لغتي. معي، ستجد شخصاً يرد على الهاتف فعلاً.",
    letsConnect: "تواصل على LinkedIn",
    callMe: "اتصل",
    email: "بريد",
    marketingHits: "تسويق مختلف",
    streetSigns: "لافتات",
    billboards: "لوحات إعلانية",
    openHouseSwag: "مواد البيت المفتوح",
    forgetBoring: "انسَ التسويق الممل. هذا ما يحدث عندما تجلب",
    madisonAve: "طاقة ماديسون أفينيو",
    toSanJose: "إلى سان خوسيه",
    openHouse: "بيت مفتوح",
    today: "اليوم",
    forSale: "للبيع",
    blocks: "شارعين",
    openHouseReady: "جاهز للبيت المفتوح",
    propertyFlyers: "منشورات",
    stackedOnCounter: "مكدسة على الطاولة. خذ واحدة — أو خمس لأصدقائك.",
    wantCustom: "تريد تسويقاً كهذا؟",
    talkToGT: "تحدث مع GT Real ←",
    moreDetails: "المزيد",
    seeFullListing: "شاهد القائمة الكاملة",
    getRealGetResults: "كن حقيقياً. احصل على نتائج.",
    designBy: "تصميم",
    askAnything: "اسأل أي شيء",
    askAboutProperty: "اسأل عن العقار...",
  }
};

// Custom hook for translations
const useTranslation = () => {
  const { language } = useContext(LanguageContext);
  const t = (key) => TRANSLATIONS[language.code]?.[key] || TRANSLATIONS.en[key] || key;
  return { t, language, isRTL: language.code === 'ar' };
};

// Language Provider with top flag bar
const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(LANGUAGES[0]);
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {/* Top Language Flag Bar - Super Visible */}
      <div data-testid="language-bar" className="fixed top-0 left-0 right-0 z-[60] bg-[#0A0A0A] border-b-2 border-[#D4AF37]/40" style={{ direction: 'ltr' }}>
        <div className="flex items-center justify-center gap-2 sm:gap-4 py-2.5 sm:py-3 px-4">
          <div className="flex items-center gap-1.5 mr-2 sm:mr-4">
            <Globe size={16} className="text-[#D4AF37]" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-[#D4AF37] font-semibold hidden sm:inline">Translate</span>
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              data-testid={`lang-flag-${lang.code}`}
              onClick={() => setLanguage(lang)}
              className={`flex flex-col items-center gap-0.5 transition-all duration-300 hover:scale-110 cursor-pointer group ${
                language.code === lang.code 
                  ? 'scale-105 opacity-100' 
                  : 'opacity-60 hover:opacity-100'
              }`}
              title={lang.name}
            >
              <span className={`text-2xl sm:text-3xl ${language.code === lang.code ? 'flag-active' : ''}`}
                style={language.code === lang.code ? { filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.6))' } : undefined}
              >
                {lang.flag}
              </span>
              <span className={`text-[8px] sm:text-[10px] uppercase tracking-wider transition-colors ${
                language.code === lang.code 
                  ? 'text-[#D4AF37] font-bold' 
                  : 'text-white/40 group-hover:text-white/70'
              }`}>
                {lang.code === 'en' ? 'EN' : lang.code === 'es' ? 'ES' : lang.code === 'zh' ? '中文' : lang.code === 'vi' ? 'VI' : lang.code === 'fr' ? 'FR' : 'عر'}
              </span>
              {language.code === lang.code && (
                <span className="w-5 h-0.5 bg-[#D4AF37] rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div style={{ paddingTop: '68px' }} dir={language.code === 'ar' ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

// Actual property images from uploaded assets + hero image we're keeping
const PROPERTY_IMAGES = [
  {
    url: "https://customer-assets.emergentagent.com/job_luxury-home-showcase-1/artifacts/9eaxu7ts_eaf224eb1751e8f11ed9d12eed9b2e95-cc_ft_768.webp",
    alt: "5214 Jacana Lane exterior street view",
    category: "exterior"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_luxury-home-showcase-1/artifacts/ihjd1v5s_59b9d56347618cb43e28559e1f7da8ad-cc_ft_384.webp",
    alt: "Living room with stone fireplace",
    category: "living"
  },
  {
    url: "https://customer-assets.emergentagent.com/job_luxury-home-showcase-1/artifacts/ty2w647j_9b23ab2f6f901c9ab26d0ff958688091-cc_ft_768.webp",
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
  price: 848888,
  priceFormatted: "$848,888",
  pricePerSqft: "$743/sq ft",
  beds: 3,
  baths: 2.5,
  sqft: "1,142",
  yearBuilt: 1988,
  hoa: "$260/mo",
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

// Zillow Showcase Link Section
const ZillowLinkSection = () => {
  const { t } = useTranslation();
  return (
    <section data-testid="zillow-section" className="bg-white py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A51C30] mb-4 section-label gold-underline">
          {t('zillowShowcase')}
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-[#0A0A0A] tracking-tight mb-4">
          {PROPERTY_DATA.priceFormatted}
        </h2>
        <p className="text-gray-600 mb-10 font-body text-lg">
          {t('seeFullPricing')}
        </p>
        <a
          data-testid="zillow-link-btn"
          href="https://www.zillow.com/homes/5214-Jacana-Ln-San-Jose-CA_rb/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#006AFF] hover:bg-[#0055CC] text-white px-10 py-5 text-lg font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <ExternalLink size={22} />
          {t('viewOnZillow')}
        </a>
      </div>
    </section>
  );
};

// Open House Section
const OpenHouseSection = () => {
  const { t } = useTranslation();
  return (
    <section data-testid="openhouse-section" className="bg-[#0A0A0A] py-20 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#D4AF37] mb-4">
          {t('openHouseSchedule')}
        </p>
        <h2 className="font-heading text-4xl md:text-5xl font-medium text-white tracking-tight mb-6">
          {t('openHouseDays')}
        </h2>
        <p className="text-3xl md:text-4xl font-heading font-semibold text-[#D4AF37] mb-6">
          {t('openHouseTime')}
        </p>
        <p className="text-white/50 text-lg mb-10 font-body">
          {t('comeVisit')}
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a
            data-testid="openhouse-call-btn"
            href="tel:4086036603"
            className="bg-[#A51C30] text-white hover:bg-[#8A1527] transition-colors duration-300 px-8 py-4 flex items-center gap-3 font-bold uppercase text-sm"
          >
            <Phone size={20} />
            {t('iPickUp')}
          </a>
          <a
            data-testid="openhouse-linkedin-btn"
            href="https://www.linkedin.com/in/george-toscano-6b979821/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-colors duration-300 px-8 py-4 flex items-center gap-3 font-bold uppercase text-sm"
          >
            <Linkedin size={20} />
            {t('messageGeorge')}
          </a>
        </div>
      </div>
    </section>
  );
};

// Chatbot Component with Language Selection and Voice Input
const Chatbot = () => {
  const { language: globalLang, setLanguage: setGlobalLang } = useContext(LanguageContext);
  const { t } = useTranslation();
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

  // Sync chatbot language with global language when global changes
  useEffect(() => {
    if (globalLang && globalLang.code !== selectedLang.code) {
      const matchedLang = LANGUAGES.find(l => l.code === globalLang.code);
      if (matchedLang) {
        setSelectedLang(matchedLang);
        setMessages([{ role: "assistant", content: matchedLang.greeting }]);
      }
    }
  }, [globalLang]);

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
    // Sync with global language
    if (setGlobalLang) setGlobalLang(lang);
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
                  <h3 className="font-heading text-lg font-semibold">{t('askAnything')}</h3>
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
                placeholder={t('askAboutProperty')}
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
  const { t } = useTranslation();
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
            {t('justListed')} • {t('sanJose')} •{" "}
            <a href="https://gtreal.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GT Real
            </a>
          </p>

          {/* Address */}
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-medium text-white tracking-tighter mb-4 groovy-heading">
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
                <p className="text-xs uppercase tracking-wider text-white/60">{t('bedrooms')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-heading font-semibold text-white">{PROPERTY_DATA.baths}</p>
                <p className="text-xs uppercase tracking-wider text-white/60">{t('bathrooms')}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-heading font-semibold text-white">{PROPERTY_DATA.sqft}</p>
                <p className="text-xs uppercase tracking-wider text-white/60">{t('squareFeet')}</p>
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
              {t('messageGeorge')}
            </a>
            <a
              data-testid="hero-call-btn"
              href="tel:4086036603"
              className="bg-[#A51C30] text-white hover:bg-[#8A1527] transition-colors duration-300 px-8 py-4 flex items-center gap-3 font-bold uppercase text-sm"
            >
              <Phone size={20} />
              {t('iPickUp')}
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
  const { t } = useTranslation();
  
  const FEATURE_KEYS = [
    { icon: Flame, labelKey: 'stoneFireplace', descKey: 'cozyGatherings' },
    { icon: Zap, labelKey: 'evReady', descKey: 'chargeWhileSleep' },
    { icon: Thermometer, labelKey: 'centralAC', descKey: 'yearRoundComfort' },
    { icon: Car, labelKey: 'garage', descKey: 'attachedParking' }
  ];

  return (
    <section id="details" data-testid="details-section" className="bg-[#FAFAFA] py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A51C30] mb-4 section-label gold-underline">
          {t('propertyOverview')}
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-[#0A0A0A] tracking-tight mb-16">
          {t('moveInReady')}<br /><span className="text-[#A51C30]">{t('noCompromises')}</span>
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <div className="bg-white border border-[#A51C30]/10 p-6 feature-card">
            <Bed className="text-[#A51C30] mb-4" size={28} />
            <p className="text-3xl font-heading font-semibold text-[#0A0A0A] stat-number">{PROPERTY_DATA.beds}</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider">{t('bedrooms')}</p>
          </div>
          <div className="bg-white border border-[#A51C30]/10 p-6 feature-card">
            <Bath className="text-[#A51C30] mb-4" size={28} />
            <p className="text-3xl font-heading font-semibold text-[#0A0A0A] stat-number">{PROPERTY_DATA.baths}</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider">{t('bathrooms')}</p>
          </div>
          <div className="bg-white border border-[#A51C30]/10 p-6 feature-card">
            <Square className="text-[#A51C30] mb-4" size={28} />
            <p className="text-3xl font-heading font-semibold text-[#0A0A0A] stat-number">{PROPERTY_DATA.sqft}</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider">{t('squareFeet')}</p>
          </div>
          <div className="bg-white border border-[#A51C30]/10 p-6 feature-card">
            <Calendar className="text-[#A51C30] mb-4" size={28} />
            <p className="text-3xl font-heading font-semibold text-[#0A0A0A] stat-number">{PROPERTY_DATA.yearBuilt}</p>
            <p className="text-sm text-gray-500 uppercase tracking-wider">{t('yearBuilt')}</p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURE_KEYS.map((feature, idx) => (
            <div key={idx} className="bg-white border border-[#A51C30]/10 p-6 feature-card">
              <feature.icon className="text-[#D4AF37] mb-4" size={24} />
              <h3 className="font-heading text-xl font-medium text-[#0A0A0A] mb-2">{t(feature.labelKey)}</h3>
              <p className="text-sm text-gray-600 font-body">{t(feature.descKey)}</p>
            </div>
          ))}
        </div>

        {/* HOA Notice */}
        <div className="mt-12 p-6 bg-[#A51C30]/5 border-l-4 border-[#A51C30]">
          <div className="flex items-center gap-3">
            <DollarSign className="text-[#A51C30]" size={24} />
            <div>
              <p className="font-medium text-[#0A0A0A]">HOA: {PROPERTY_DATA.hoa}</p>
              <p className="text-sm text-gray-600">{t('hoaIncludes')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


// Drone Footage Section - FPV Tour Video
const DroneSection = () => {
  const { t } = useTranslation();
  const DRONE_VIDEO_URL = "https://customer-assets.emergentagent.com/job_87942394-b713-47b2-9d78-616215c10bb0/artifacts/lgrs2kjt_1080x1920-FPV%20Tour-5214%20Jacana%20Ln.mp4";

  return (
    <section data-testid="drone-section" className="bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto text-center">
        {/* Section Label */}
        <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#D4AF37] mb-4 section-label gold-underline">
          FPV Tour
        </p>
        <h2 className="font-heading text-3xl md:text-4xl font-medium text-white tracking-tight mb-12">
          {t('aerialView')}
        </h2>

        {/* Actual FPV Drone Video */}
        <div className="relative max-w-md mx-auto">
          <div className="relative bg-[#111111] border border-[#D4AF37]/20 shadow-2xl overflow-hidden" style={{ aspectRatio: '9/16' }}>
            <video
              data-testid="drone-video"
              className="w-full h-full object-cover"
              controls
              playsInline
              preload="metadata"
              poster=""
            >
              <source src={DRONE_VIDEO_URL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Credit */}
        <p className="mt-8 text-xs tracking-[0.2em] uppercase text-white/40">
          {t('droneBy')}{" "}
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
  const { t } = useTranslation();
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
              {t('yourAgent')}
            </p>
            <h2 className="font-heading text-4xl md:text-5xl font-medium text-white tracking-tight mb-4">
              George Toscano
            </h2>
            <p className="text-white/60 text-sm uppercase tracking-wider mb-6">
              DRE# 02213878 • Kollab Real Estate
            </p>

            <p className="font-body text-lg text-white/80 leading-relaxed mb-8">
              {t('agentBio')}
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
                {t('letsConnect')}
              </a>
              <div className="grid grid-cols-2 gap-4">
                <a
                  data-testid="agent-call-btn"
                  href="tel:4086036603"
                  className="bg-[#A51C30] text-white hover:bg-[#8A1527] transition-colors duration-300 px-6 py-4 flex items-center justify-center gap-2 font-bold uppercase text-sm"
                >
                  <Phone size={18} />
                  {t('callMe')}
                </a>
                <a
                  data-testid="agent-email-btn"
                  href="mailto:gtdrums@gmail.com"
                  className="bg-white/10 text-white hover:bg-white/20 transition-colors duration-300 px-6 py-4 flex items-center justify-center gap-2 font-bold uppercase text-sm"
                >
                  <Mail size={18} />
                  {t('email')}
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
  const { t } = useTranslation();
  return (
    <section data-testid="marketing-section" className="bg-[#0A0A0A] py-24 md:py-32 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase font-bold text-[#D4AF37] mb-4 flex items-center justify-center gap-2">
            <Megaphone size={16} />
            {t('marketingHits')}
          </p>
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-medium text-white tracking-tight mb-6">
            {t('streetSigns')}<br />
            <span className="text-[#A51C30]">{t('billboards')}</span><br />
            {t('openHouseSwag')}
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            {t('forgetBoring')}
            <span className="text-[#D4AF37] font-semibold"> {t('madisonAve')} </span> 
            {t('toSanJose')}.
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
                  <p className="text-white/80 text-sm md:text-lg uppercase tracking-widest mb-2">{t('justListed')}</p>
                  <h3 className="font-heading text-3xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                    5214<br />JACANA
                  </h3>
                  <p className="text-[#D4AF37] text-2xl md:text-4xl font-heading font-bold mt-2">$848K</p>
                </div>
                
                {/* Right side - Info */}
                <div className="text-right z-10">
                  <p className="text-white text-lg md:text-2xl font-bold">3 BED • 2.5 BATH</p>
                  <p className="text-white/80 text-sm md:text-lg">{t('sanJose')}, CA</p>
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
                <p className="text-white text-xs uppercase tracking-widest">{t('openHouse')}</p>
                <p className="text-white font-heading text-2xl font-bold">{t('openHouseDays')}</p>
                <p className="text-[#D4AF37] text-lg font-bold">{t('openHouseTime')}</p>
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
                <p className="text-[#D4AF37] text-xs uppercase tracking-widest">{t('forSale')}</p>
                <p className="text-white font-heading text-2xl font-bold">$848,888</p>
                <p className="text-white/60 text-sm">3 Bed • 2.5 Bath</p>
                <div className="mt-2 bg-[#A51C30] px-3 py-1">
                  <p className="text-white text-xs font-bold">GTREAL.IO</p>
                </div>
              </div>
              {/* Stake */}
              <div className="w-2 h-20 bg-gray-400 mx-auto"></div>
            </div>
            <p className="text-white/30 text-xs mt-2 uppercase tracking-wider">{t('forSale')} Sign</p>
          </div>

          {/* Directional Arrow */}
          <div className="flex flex-col items-center">
            <div className="relative">
              {/* Sign */}
              <div className="bg-[#D4AF37] w-64 h-40 flex items-center justify-center shadow-xl relative">
                <div className="text-center">
                  <p className="text-[#0A0A0A] font-heading text-2xl font-bold">{t('openHouse').split(' ')[0]}</p>
                  <p className="text-[#0A0A0A] font-heading text-2xl font-bold">{t('openHouse').split(' ').slice(1).join(' ') || 'HOUSE'}</p>
                  <p className="text-[#0A0A0A]/60 text-sm">→ {t('blocks')}</p>
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
                  <p className="text-[#D4AF37] text-xl font-bold">$848,888</p>
                </div>
              </div>
              <div className="flex-1 text-[#0A0A0A]">
                <p className="text-sm font-bold mb-1">3 Bed • 2.5 Bath • 1,142 Sq Ft</p>
                <p className="text-xs text-gray-600 mb-2">{t('sanJose')}, CA 95123</p>
                <div className="grid grid-cols-2 gap-1 text-xs mb-2">
                  <span>✓ {t('stoneFireplace')}</span>
                  <span>✓ {t('evReady')}</span>
                  <span>✓ {t('centralAC')}</span>
                  <span>✓ {t('garage')}</span>
                </div>
                <div className="mt-auto border-t pt-2">
                  <p className="text-[#A51C30] font-bold text-sm">George Toscano</p>
                  <p className="text-xs">408-603-6603 • GTREAL.IO</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center md:text-left max-w-sm">
            <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-2">{t('openHouseReady')}</p>
            <h3 className="text-white font-heading text-2xl font-bold mb-3">{t('propertyFlyers')}</h3>
            <p className="text-white/60 text-sm">{t('stackedOnCounter')}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-[#A51C30] p-1">
            <div className="bg-[#0A0A0A] px-8 py-4">
              <p className="text-[#D4AF37] font-heading text-xl md:text-2xl font-semibold">
                {t('wantCustom')}
              </p>
              <a 
                href="https://gtreal.io" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white/60 text-sm hover:text-[#D4AF37] transition-colors"
              >
                {t('talkToGT')}
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
                <span className="text-6xl md:text-8xl font-heading font-bold text-[#D4AF37]/10">$848K</span>
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
  const { t } = useTranslation();
  return (
    <section data-testid="platform-links-section" className="bg-[#FAFAFA] py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase font-bold text-[#A51C30] mb-4 text-center">
          {t('moreDetails')}
        </p>
        <h2 className="font-heading text-2xl md:text-3xl font-medium text-[#0A0A0A] tracking-tight mb-8 text-center">
          {t('seeFullListing')}
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Zillow Tile */}
          <a
            data-testid="zillow-link"
            href="https://www.zillow.com/homes/5214-Jacana-Ln-San-Jose-CA_rb/"
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
            href="https://www.redfin.com/CA/San-Jose/5214-Jacana-Ln-95123/"
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
  const { t } = useTranslation();
  return (
    <footer data-testid="footer" className="bg-[#0A0A0A] py-16 px-6 md:px-12 lg:px-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <p className="font-heading text-2xl text-white mb-1">5214 Jacana Lane</p>
            <p className="text-sm text-white/40">{t('sanJose')}, CA 95123</p>
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
                {t('getRealGetResults')}
              </p>
            </a>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-white/60">
              © 2026 George Toscano
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
            <span className="text-xs uppercase tracking-[0.3em]">{t('designBy')}</span>
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
    <LanguageProvider>
      <div className="App min-h-screen bg-[#FAFAFA]">
        <HeroSection />
        <DetailsSection />
        <ZillowLinkSection />
        <OpenHouseSection />
        <DroneSection />
        <AgentSection />
        <MarketingSection />
        <PlatformLinksSection />
        <Footer />
        <MusicPlayer />
        <Chatbot />
      </div>
    </LanguageProvider>
  );
}

export default App;
