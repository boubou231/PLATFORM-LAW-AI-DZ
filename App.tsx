import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, FileText, Gavel, Timer, Search, ShieldCheck, 
  Send, Paperclip, Info, MessageSquare, Radar, LucideIcon 
} from 'lucide-react';

// --- Types ---
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
  
  // Deadlines State
  const [judgmentDate, setJudgmentDate] = useState("");
  const [procedureType, setProcedureType] = useState("civil_appeal");
  const [deadlineResult, setDeadlineResult] = useState<string | null>(null);

  // --- Logic: Deadline Calculator (Algerian Law) ---
  const calculateDeadline = () => {
    if (!judgmentDate) return;
    const date = new Date(judgmentDate);
    const daysToAdd = procedureType === 'civil_appeal' ? 30 : procedureType === 'admin_appeal' ? 60 : 10;
    
    date.setDate(date.getDate() + daysToAdd);

    // Rule: If the last day is Friday (5) or Saturday (6), extend to Sunday
    if (date.getDay() === 5) date.setDate(date.getDate() + 2);
    else if (date.getDay() === 6) date.setDate(date.getDate() + 1);

    setDeadlineResult(date.toLocaleDateString('ar-DZ', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    }));
  };

  // --- Logic: Chat Messaging ---
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

    // Simulated AI Response based on 2026 legal context
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "بناءً على مستجدات القانون الجزائري لعام 2026، فإن استشارتكم تقع ضمن نطاق القانون المدني. ننصح بمراجعة المادة 124 وما يليها...",
        sender: 'ai',
        time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  // --- Sub-Component: Navigation Button ---
  const NavButton = ({ id, icon: Icon, label, en }: { id: Section, icon: LucideIcon, label: string, en: string }) => (
    <motion.div
      whileHover={{ scale: 1.02, x: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setCurrentSection(id)}
      className={`flex items-center gap-4 p-4 mb-3 rounded-xl cursor-pointer transition-all duration-300 ${
        currentSection === id 
        ? 'bg-gradient-to-l from-orange-600 to-red-700 shadow-lg shadow-orange-900/40' 
        : 'bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50'
      }`}
    >
      <div className={`p-2 rounded-lg ${currentSection === id ? 'bg-white/20' : 'bg-orange-500/10'}`}>
        <Icon size={22} className={currentSection === id ? 'text-white' : 'text-orange-500'} />
      </div>
      <div>
        <div className={`font-bold text-sm ${currentSection === id ? 'text-white' : 'text-zinc-200'}`}>{label}</div>
        <div className={`text-[10px] uppercase tracking-wider ${currentSection === id ? 'text-orange-100' : 'text-orange-500/40'}`}>{en}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 selection:bg-orange-500/30 font-sans" dir="rtl">
      
      {/* Dynamic Header */}
      <header className="border-b border-zinc-800 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-orange-600 p-2 rounded-lg shadow-lg shadow-orange-600/20">
              <Scale size={26} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-l from-orange-400 to-red-500 bg-clip-text text-transparent">المنصة القانونية الجزائرية</h1>
              <p className="text-[9px] text-zinc-500 tracking-[0.2em] uppercase">Algerian Legal Hub 2026</p>
            </div>
          </div>
          <div className="hidden md:block text-xs font-mono text-orange-500/80">system_status: online</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <NavButton id="legal_advice" icon={MessageSquare} label="الاستشارات الذكية" en="Legal AI Chat" />
          <NavButton id="contracts" icon={FileText} label="صياغة العقود" en="Smart Contracts" />
          <NavButton id="procedures" icon={Timer} label="المواعيد الإجرائية" en="Deadlines Calc" />
          <NavButton id="radar" icon={Radar} label="الرادار القانوني" en="Law Radar" />
          <NavButton id="research" icon={Search} label="البحث العلمي" en="Legal Research" />
          
          <div className="mt-8 p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800 shadow-inner">
             <h4 className="text-xs font-bold text-zinc-400 mb-2 flex items-center gap-2"><ShieldCheck size={14}/> تحديثات 2026</h4>
             <p className="text-[10px] text-zinc-500 leading-relaxed">تمت مطابقة الخوارزميات مع آخر تعديلات قانون الإجراءات المدنية والجزائية.</p>
          </div>
        </aside>

        {/* Dynamic Content Area */}
        <section className="lg:col-span-9 min-h-[650px] flex flex-col bg-zinc-900/20 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
          <AnimatePresence mode="wait">
            {currentSection === 'main' ? (
              <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-orange-500/5 rounded-full flex items-center justify-center mb-6 border border-orange-500/10">
                  <Gavel size={40} className="text-orange-500 opacity-40" />
                </div>
                <h2 className="text-2xl font-bold mb-3">مرحباً بك في مستقبل القانون</h2>
                <p className="text-zinc-500 max-w-sm text-sm">استخدم القائمة الجانبية للوصول إلى الأدوات الذكية المخصصة للمحامي والمواطن الجزائري.</p>
              </motion.div>
            ) : currentSection === 'procedures' ? (
              <motion.div key="proc" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><Timer className="text-orange-500" /> حساب المواعيد القانونية</h3>
                <div className="grid md:grid-cols-2 gap-4 bg-black/40 p-6 rounded-2xl border border-zinc-800">
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 mr-1">تاريخ التبليغ أو الصدور</label>
                    <input type="date" onChange={(e) => setJudgmentDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-xl outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-zinc-500 mr-1">نوع الإجراء</label>
                    <select onChange={(e) => setProcedureType(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-xl outline-none focus:border-orange-500 appearance-none">
                      <option value="civil_appeal">استئناف أحكام مدنية (30 يوم)</option>
                      <option value="admin_appeal">استئناف قرارات إدارية (60 يوم)</option>
                      <option value="criminal_objection">معارضة في أحكام جزائية (10 أيام)</option>
                    </select>
                  </div>
                  <button onClick={calculateDeadline} className="md:col-span-2 bg-orange-600 hover:bg-orange-500 py-3 rounded-xl font-bold transition-all mt-4">حساب الموعد النهائي</button>
                </div>
                {deadlineResult && (
                  <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="mt-8 p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-center">
                    <p className="text-zinc-400 text-xs mb-2">آخر أجل قانوني لإيداع العريضة:</p>
                    <p className="text-orange-500 font-black text-2xl underline underline-offset-8">{deadlineResult}</p>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-zinc-600 mt-20 text-sm italic">ابدأ المحادثة مع المستشار القانوني الذكي...</div>
                  )}
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`p-4 rounded-2xl max-w-[85%] ${msg.sender === 'user' ? 'bg-zinc-800 border-r-2 border-orange-500' : 'bg-gradient-to-br from-orange-600 to-red-700 text-white shadow-lg'}`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <span className="text-[9px] opacity-60 block mt-2 font-mono">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                  {isTyping && <div className="text-orange-500 text-[10px] animate-pulse">جاري تحليل النصوص القانونية...</div>}
                </div>
                <div className="p-4 bg-black/40 border-t border-zinc-800 flex gap-2">
                  <button className="p-3 text-zinc-500 hover:text-orange-500 transition-colors"><Paperclip size={20}/></button>
                  <input 
                    value={inputText} 
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="اسأل عن أي مادة قانونية أو قضية..." 
                    className="flex-1 bg-zinc-900/50 border border-zinc-800 p-3 rounded-xl outline-none focus:border-orange-500 transition-all text-sm"
                  />
                  <button onClick={handleSend} className="bg-orange-600 p-3 rounded-xl hover:bg-orange-500 transition-shadow shadow-lg shadow-orange-900/20 text-white">
                    <Send size={20}/>
                  </button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer className="mt-12 border-t border-zinc-900 bg-black/60 py-8 px-6 text-center">
        <p className="text-[10px] text-zinc-600 tracking-[0.4em] mb-4 uppercase">© 2026 ALGERIAN LEGAL PLATFORM - HICHEM BENZEROUK</p>
        <div className="flex justify-center gap-4 text-xs text-zinc-500">
           <span className="hover:text-orange-500 cursor-pointer">شروط الاستخدام</span>
           <span className="hover:text-orange-500 cursor-pointer">سياسة الخصوصية</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
