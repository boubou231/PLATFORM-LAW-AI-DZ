import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, FileText, Gavel, Timer, Search, ShieldCheck, 
  Send, Paperclip, Info, MessageSquare, Radar, LucideIcon 
} from 'lucide-react';

// --- الأنواع والبيانات ---
type Section = 'main' | 'legal_advice' | 'contracts' | 'discussion' | 'procedures' | 'radar' | 'research';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  time: string;
}

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('main');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const [judgmentDate, setJudgmentDate] = useState("");
  const [procedureType, setProcedureType] = useState("civil_appeal");
  const [deadlineResult, setDeadlineResult] = useState<string | null>(null);

  // --- منطق حاسبة الآجال المعدل ---
  const calculateDeadline = () => {
    if (!judgmentDate) return;
    let date = new Date(judgmentDate);
    
    // المواعيد القانونية حسب النوع
    let daysToAdd = procedureType === 'civil_appeal' ? 30 : procedureType === 'admin_appeal' ? 60 : 10;
    
    // إضافة الأيام (حساب تقويمي)
    date.setDate(date.getDate() + daysToAdd);

    // إذا صادف اليوم الأخير يوم جمعة (5) أو سبت (6)، يمدد ليوم الأحد (قاعدة إجرائية)
    if (date.getDay() === 5) date.setDate(date.getDate() + 2);
    else if (date.getDay() === 6) date.setDate(date.getDate() + 1);

    setDeadlineResult(date.toLocaleDateString('ar-DZ', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "بناءً على المنظومة القانونية الجزائرية وتحديثات 2026، فإن استفساركم يندرج ضمن اختصاصات...",
        sender: 'ai',
        time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  // --- المكونات الفرعية ---
  const NavButton = ({ id, icon: Icon, label, en }: { id: Section, icon: LucideIcon, label: string, en: string }) => (
    <motion.div
      whileHover={{ scale: 1.02, x: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setCurrentSection(id)}
      className={`flex items-center gap-4 p-4 mb-3 rounded-xl cursor-pointer transition-all duration-300 ${
        currentSection === id 
        ? 'bg-gradient-to-l from-orange-600 to-red-700 shadow-lg shadow-orange-900/20' 
        : 'bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50'
      }`}
    >
      <div className={`p-2 rounded-lg ${currentSection === id ? 'bg-white/20' : 'bg-orange-500/10'}`}>
        <Icon size={22} className={currentSection === id ? 'text-white' : 'text-orange-500'} />
      </div>
      <div>
        <div className={`font-bold text-sm ${currentSection === id ? 'text-white' : 'text-zinc-200'}`}>{label}</div>
        <div className={`text-[10px] uppercase tracking-tighter ${currentSection === id ? 'text-orange-100' : 'text-orange-500/60'}`}>{en}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-orange-500/30 font-sans" dir="rtl">
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg shadow-lg">
              <Scale size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-l from-orange-400 to-red-500 bg-clip-text text-transparent">المنصة القانونية الجزائرية</h1>
              <p className="text-[9px] text-zinc-500 tracking-[0.2em] uppercase">Algerian Legal Hub 2026</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <span className="text-orange-500 font-mono">hichembenzerouk@gmail.com</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <NavButton id="legal_advice" icon={MessageSquare} label="الاستشارات الذكية" en="Legal AI Chat" />
          <NavButton id="contracts" icon={FileText} label="صياغة العقود" en="Smart Contracts" />
          <NavButton id="discussion" icon={Gavel} label="ديوان المناقشة" en="Legal Forum" />
          <NavButton id="procedures" icon={Timer} label="المواعيد الإجرائية" en="Deadlines Calc" />
          <NavButton id="radar" icon={Radar} label="الرادار القانوني" en="Law Radar" />
          <NavButton id="research" icon={Search} label="البحث العلمي" en="Legal Research" />
        </aside>

        <section className="lg:col-span-9 min-h-[600px] flex flex-col bg-zinc-900/30 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {currentSection === 'main' ? (
              <motion.div key="main" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <Scale size={48} className="text-orange-500 mb-6 opacity-50" />
                <h2 className="text-2xl font-bold mb-4">مرحباً بك في المحاماة الرقمية</h2>
                <p className="text-zinc-400 max-w-sm text-sm">اختر إحدى الأدوات لبدء العمل على ملفاتك القانونية بدقة 2026.</p>
              </motion.div>
            ) : currentSection === 'procedures' ? (
              <motion.div key="proc" initial={{y:10, opacity:0}} animate={{y:0, opacity:1}} className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><Timer className="text-orange-500" /> حساب المواعيد والآجال</h3>
                <div className="space-y-4 bg-black/40 p-6 rounded-2xl border border-zinc-800">
                  <input type="date" onChange={(e) => setJudgmentDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg outline-none focus:border-orange-500" />
                  <select onChange={(e) => setProcedureType(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg outline-none focus:border-orange-500">
                    <option value="civil_appeal">استئناف مدني (30 يوم)</option>
                    <option value="admin_appeal">استئناف إداري (60 يوم)</option>
                    <option value="criminal_objection">معارضة جزائية (10 أيام)</option>
                  </select>
                  <button onClick={calculateDeadline} className="w-full bg-orange-600 hover:bg-orange-500 py-3 rounded-xl font-bold transition-all">احسب الموعد</button>
                </div>
                {deadlineResult && (
                  <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl text-center">
                    <p className="text-orange-500 font-bold text-lg">{deadlineResult}</p>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`p-4 rounded-2xl max-w-[80%] ${msg.sender === 'user' ? 'bg-zinc-800' : 'bg-orange-600 text-white'}`}>
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-[9px] opacity-50 block mt-1">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                  {isTyping && <div className="text-orange-500 text-xs animate-bounce italic">المستشار يحلل النص...</div>}
                </div>
                <div className="p-4 bg-black/40 border-t border-zinc-800 flex gap-2">
                  <input 
                    value={inputText} 
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="اكتب استفسارك القانوني..." 
                    className="flex-1 bg-zinc-900 border border-zinc-800 p-3 rounded-xl outline-none focus:border-orange-500"
                  />
                  <button onClick={handleSend} className="bg-orange-600 p-3 rounded-xl"><Send size={20}/></button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
};

export default App;
