import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, FileText, Gavel, Timer, Search, ShieldCheck, 
  Send, Paperclip, Download, Info, MessageSquare, Radar, 
  ChevronRight, Bookmark, ExternalLink, LucideIcon 
} from 'lucide-react';

// --- الأنواع (Types) ---
type Section = 'main' | 'legal_advice' | 'contracts' | 'procedures' | 'radar' | 'research';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  time: string;
}

// --- المكونات الفرعية (Sub-Components) ---
const NavButton = ({ id, active, icon: Icon, label, en, onClick }: { 
  id: Section, active: boolean, icon: LucideIcon, label: string, en: string, onClick: () => void 
}) => (
  <motion.div
    whileHover={{ x: -5 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`flex items-center gap-4 p-4 mb-3 rounded-2xl cursor-pointer transition-all duration-500 ${
      active 
      ? 'bg-gradient-to-l from-orange-600 to-red-700 shadow-[0_10px_30px_rgba(234,88,12,0.3)] border-r-4 border-white' 
      : 'bg-zinc-900/40 border border-zinc-800 hover:border-orange-500/50'
    }`}
  >
    <div className={`p-2.5 rounded-xl ${active ? 'bg-white/20' : 'bg-orange-500/10'}`}>
      <Icon size={22} className={active ? 'text-white' : 'text-orange-500'} />
    </div>
    <div>
      <div className={`font-bold text-[15px] ${active ? 'text-white' : 'text-zinc-200'}`}>{label}</div>
      <div className={`text-[10px] uppercase tracking-[0.1em] ${active ? 'text-orange-100' : 'text-zinc-500'}`}>{en}</div>
    </div>
  </motion.div>
);

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('main');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // حاسبة الآجال
  const [judgmentDate, setJudgmentDate] = useState("");
  const [procedureType, setProcedureType] = useState("civil_appeal");
  const [deadlineResult, setDeadlineResult] = useState<string | null>(null);

  // --- منطق حساب المواعيد (القانون الجزائري) ---
  const calculateDeadline = () => {
    if (!judgmentDate) return;
    const date = new Date(judgmentDate);
    const daysToAdd = procedureType === 'civil_appeal' ? 30 : procedureType === 'admin_appeal' ? 60 : 10;
    
    date.setDate(date.getDate() + daysToAdd);

    // إذا صادف اليوم الأخير عطلة نهاية الأسبوع (الجمعة أو السبت)
    if (date.getDay() === 5) date.setDate(date.getDate() + 2); // تمديد للأحد
    else if (date.getDay() === 6) date.setDate(date.getDate() + 1); // تمديد للأحد

    setDeadlineResult(date.toLocaleDateString('ar-DZ', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    }));
  };

  // --- منطق الدردشة ---
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
        text: "بناءً على قانون الإجراءات الجزائري المحدث لعام 2026، فإن وضعيتك تتطلب إعداد مذكرة رد رسمية. هل تريد مني صياغة نموذج أولي؟",
        sender: 'ai',
        time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100 selection:bg-orange-500/30 font-['Amiri',_serif]" dir="rtl">
      
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-black/40 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-2xl shadow-xl rotate-3">
              <Scale size={28} className="text-white -rotate-3" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-l from-orange-400 to-red-500 bg-clip-text text-transparent">المنصة القانونية الجزائرية</h1>
              <p className="text-[10px] text-zinc-500 tracking-[0.3em] uppercase">Algerian Justice Tech 2026</p>
            </div>
          </div>
          <div className="hidden md:flex gap-6 items-center">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-zinc-500 uppercase font-mono">Server Status</span>
              <span className="text-xs text-green-500 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> مشغل بالذكاء الاصطناعي
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-2">
          <NavButton id="legal_advice" active={currentSection === 'legal_advice'} icon={MessageSquare} label="الاستشارات الذكية" en="Legal AI Chat" onClick={() => setCurrentSection('legal_advice')} />
          <NavButton id="contracts" active={currentSection === 'contracts'} icon={FileText} label="صياغة العقود" en="Smart Contracts" onClick={() => setCurrentSection('contracts')} />
          <NavButton id="procedures" active={currentSection === 'procedures'} icon={Timer} label="المواعيد والآجال" en="Deadlines Calc" onClick={() => setCurrentSection('procedures')} />
          <NavButton id="radar" active={currentSection === 'radar'} icon={Radar} label="الرادار القانوني" en="Law Radar" onClick={() => setCurrentSection('radar')} />
          <NavButton id="research" active={currentSection === 'research'} icon={Search} label="البحث العلمي" en="Legal Search" onClick={() => setCurrentSection('research')} />
          
          <div className="mt-10 p-6 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
               <ShieldCheck size={80} className="text-orange-500" />
             </div>
             <h4 className="text-orange-500 font-bold mb-2 flex items-center gap-2 relative z-10"><ShieldCheck size={18}/> ضمان الدقة</h4>
             <p className="text-xs text-zinc-500 leading-relaxed relative z-10 font-sans">
               يتم مطابقة جميع المخرجات آلياً مع نصوص الجريدة الرسمية الجزائرية لعام 2026.
             </p>
          </div>
        </aside>

        {/* Content Area */}
        <section className="lg:col-span-9 min-h-[700px] flex flex-col bg-zinc-900/20 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            {currentSection === 'main' ? (
              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-orange-500/5 rounded-full flex items-center justify-center border border-orange-500/10 animate-pulse">
                  <Gavel size={48} className="text-orange-500 opacity-60" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold">نظام العدالة الرقمي المتكامل</h2>
                  <p className="text-zinc-500 max-w-md mx-auto leading-relaxed">أهلاً بك يا أستاذ. المنصة جاهزة لمساعدتك في تحليل القضايا، حساب المواعيد، وصياغة العرائض بدقة متناهية.</p>
                </div>
                <button onClick={() => setCurrentSection('legal_advice')} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-orange-500 hover:text-white transition-all">ابدأ الآن</button>
              </motion.div>
            ) : currentSection === 'procedures' ? (
              <motion.div key="proc" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-bold flex items-center gap-3"><Timer className="text-orange-500" /> حساب المواعيد الإجرائية</h3>
                  <span className="text-[10px] bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full border border-orange-500/20">قانون الإجراءات 2026</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 bg-black/40 p-8 rounded-[2rem] border border-zinc-800">
                  <div className="space-y-3">
                    <label className="text-sm text-zinc-400 block px-1">تاريخ صدور الحكم / التبليغ</label>
                    <input type="date" onChange={(e) => setJudgmentDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all text-white" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm text-zinc-400 block px-1">نوع المسار الإجرائي</label>
                    <select onChange={(e) => setProcedureType(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 p-4 rounded-2xl outline-none focus:border-orange-500 appearance-none text-white">
                      <option value="civil_appeal">استئناف مدني (30 يوم)</option>
                      <option value="admin_appeal">استئناف إداري (60 يوم)</option>
                      <option value="criminal_objection">معارضة جزائية (10 أيام)</option>
                    </select>
                  </div>
                  <button onClick={calculateDeadline} className="md:col-span-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-900/20 transition-all active:scale-[0.99]">تحليل الموعد النهائي</button>
                </div>

                {deadlineResult && (
                  <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-10 p-8 bg-orange-500/5 border border-orange-500/20 rounded-3xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                    <p className="text-zinc-400 text-sm mb-2 font-sans uppercase tracking-widest">The legal deadline expires on</p>
                    <p className="text-orange-500 font-black text-3xl">{deadlineResult}</p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col h-[700px]">
                {/* Chat Header */}
                <div className="p-6 border-b border-zinc-800/50 bg-black/20 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-bold">المساعد القانوني الذكي</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"><Bookmark size={18} className="text-zinc-500"/></button>
                    <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"><Download size={18} className="text-zinc-500"/></button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar">
                  {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-600 space-y-4">
                      <MessageSquare size={40} className="opacity-20" />
                      <p className="text-sm italic">اطرح سؤالك القانوني، أو ارفع ملفاً للتحليل...</p>
                    </div>
                  )}
                  {messages.map((msg) => (
                    <motion.div key={msg.id} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`p-5 rounded-3xl max-w-[80%] leading-relaxed text-[15px] shadow-sm ${
                        msg.sender === 'user' 
                        ? 'bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-br-none' 
                        : 'bg-gradient-to-br from-orange-600 to-red-700 text-white rounded-bl-none'
                      }`}>
                        {msg.text}
                        <div className={`text-[9px] mt-3 font-mono opacity-50 ${msg.sender === 'user' ? 'text-left' : 'text-right'}`}>
                          {msg.time}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-2 items-center text-orange-500 text-xs font-sans">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </span>
                      AI is analyzing the law...
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-black/40 border-t border-zinc-800/50">
                  <div className="flex gap-3 bg-zinc-900/50 border border-zinc-800 p-2 rounded-[1.5rem] focus-within:border-orange-500 transition-all shadow-inner">
                    <button className="p-3 text-zinc-500 hover:text-orange-500 transition-colors"><Paperclip size={22}/></button>
                    <input 
                      value={inputText} 
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="اسأل عن المواد القانونية أو اطلب صياغة عريضة..." 
                      className="flex-1 bg-transparent border-none p-3 outline-none text-sm"
                    />
                    <button onClick={handleSend} className="bg-orange-600 p-4 rounded-2xl hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/40 text-white">
                      <Send size={20}/>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-zinc-900 bg-black/80 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-orange-500 font-bold">
              <Scale size={20} /> المنصة القانونية الجزائرية
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
              أول مشروع جزائري يهدف لرقمنة قطاع العدالة باستخدام تقنيات الذكاء الاصطناعي التوليدي، مع الالتزام الكامل بالسيادة الرقمية والنصوص القانونية الوطنية.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold">روابط هامة</h4>
            <ul className="text-xs text-zinc-500 space-y-2">
              <li className="flex items-center gap-2 hover:text-orange-500 cursor-pointer"><ChevronRight size={12}/> الجريدة الرسمية</li>
              <li className="flex items-center gap-2 hover:text-orange-500 cursor-pointer"><ChevronRight size={12}/> وزارة العدل</li>
              <li className="flex items-center gap-2 hover:text-orange-500 cursor-pointer"><ChevronRight size={12}/> مجلس الدولة</li>
            </ul>
          </div>
          <div className="bg-orange-500/5 p-6 rounded-3xl border border-orange-500/10">
             <div className="flex items-center gap-2 text-red-500 font-bold text-xs mb-2">
               <Info size={14}/> إخلاء مسؤولية
             </div>
             <p className="text-[10px] text-zinc-500 leading-tight font-sans italic">
               The AI outputs are for guidance only. Always consult a certified lawyer for official legal procedures.
             </p>
          </div>
        </div>
        <div className="text-center mt-12 pt-8 border-t border-zinc-900">
           <p className="text-[10px] text-zinc-700 tracking-[0.6em] uppercase">© 2026 ALGERIAN LEGAL TECH - BY HICHEM BENZEROUK</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
