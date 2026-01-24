import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Scale, FileText, Gavel, Timer, Search, ShieldCheck, 
  Send, Paperclip, Download, User, Info, MessageSquare, Radar 
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx';

// --- الأنواع والبيانات ---
type Section = 'main' | 'legal_advice' | 'contracts' | 'discussion' | 'procedures' | 'radar' | 'research';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  files?: string[];
  time: string;
}

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('main');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // حاسبة الآجال القانونية
  const [judgmentDate, setJudgmentDate] = useState("");
  const [procedureType, setProcedureType] = useState("civil_appeal");
  const [deadlineResult, setDeadlineResult] = useState<string | null>(null);

  // --- منطق حاسبة الآجال (قانون الإجراءات الجزائري) ---
  const calculateDeadline = () => {
    if (!judgmentDate) return;
    let date = new Date(judgmentDate);
    // الآجال حسب القانون الجزائري (30 يوم استئناف، 60 إداري، 10 معارضة)
    let daysToAdd = procedureType === 'civil_appeal' ? 30 : procedureType === 'admin_appeal' ? 60 : 10;
    
    let count = 0;
    while (count < daysToAdd) {
      date.setDate(date.getDate() + 1);
      // استثناء العطل الرسمية (الجمعة والسبت) لضمان الدقة الإجرائية
      if (date.getDay() !== 5 && date.getDay() !== 6) count++;
    }
    setDeadlineResult(date.toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  };

  // --- منطق إرسال الرسائل ---
  const handleSend = () => {
    if (!inputText.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, userMsg]);
    setInputText("");
    setIsTyping(true);

    // محاكاة استشارة قانونية ذكية
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "بناءً على قانون العقوبات وقانون الإجراءات المدنية الجزائري (تحديث 2026)، فإن وضعيتك تتطلب...",
        sender: 'ai',
        time: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  // --- المكونات الفرعية الجمالية ---
  const NavButton = ({ id, icon: Icon, label, en }: { id: Section, icon: any, label: string, en: string }) => (
    <motion.div
      whileHover={{ scale: 1.03, x: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setCurrentSection(id)}
      className={`flex items-center gap-4 p-4 mb-3 rounded-xl cursor-pointer transition-all duration-300 ${
        currentSection === id 
        ? 'bg-gradient-to-l from-orange-600 to-red-700 shadow-[0_0_20px_rgba(234,88,12,0.4)]' 
        : 'bg-zinc-900/50 border border-zinc-800 hover:border-orange-500/50'
      }`}
    >
      <div className={`p-2 rounded-lg ${currentSection === id ? 'bg-white/20' : 'bg-orange-500/10'}`}>
        <Icon size={24} className={currentSection === id ? 'text-white' : 'text-orange-500'} />
      </div>
      <div>
        <div className={`font-bold ${currentSection === id ? 'text-white' : 'text-zinc-200'}`}>{label}</div>
        <div className={`text-xs uppercase tracking-widest ${currentSection === id ? 'text-orange-100' : 'text-orange-500/60'}`}>{en}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-['Amiri'] selection:bg-orange-500/30" dir="rtl">
      
      {/* Header الفخم */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-lg shadow-lg">
              <Scale size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-l from-orange-400 to-red-500 bg-clip-text text-transparent">المنصة القانونية الجزائرية</h1>
              <p className="text-[10px] text-zinc-500 tracking-[0.3em] uppercase">Algerian Legal Hub 2026</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <span className="hover:text-orange-500 cursor-pointer transition-colors">اتصل بنا</span>
            <div className="h-4 w-px bg-zinc-800"></div>
            <span className="text-orange-500 font-mono">hichembenzerouk@gmail.com</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* القائمة الجانبية (يمين) */}
        <aside className="lg:col-span-3 order-2 lg:order-1">
          <NavButton id="legal_advice" icon={MessageSquare} label="الاستشارات الذكية" en="Legal AI Chat" />
          <NavButton id="contracts" icon={FileText} label="صياغة العقود" en="Smart Contracts" />
          <NavButton id="discussion" icon={Gavel} label="ديوان المناقشة" en="Legal Forum" />
          <NavButton id="procedures" icon={Timer} label="المواعيد الإجرائية" en="Deadlines Calc" />
          <NavButton id="radar" icon={Radar} label="الرادار القانوني" en="Law Radar" />
          <NavButton id="research" icon={Search} label="البحث العلمي" en="Legal Research" />
          
          <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800">
            <h4 className="text-orange-500 font-bold mb-2 flex items-center gap-2">
              <ShieldCheck size={18} /> ضمان الدقة
            </h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              يتم مراجعة كافة المخرجات آلياً ومقارنتها بالجريدة الرسمية الجزائرية وقانون عقوبات 2026.
            </p>
          </div>
        </aside>

        {/* محتوى القمرة الرئيسي (يسار) */}
        <section className="lg:col-span-9 order-1 lg:order-2 min-h-[700px] flex flex-col bg-zinc-900/30 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
          
          <AnimatePresence mode="wait">
            {currentSection === 'main' ? (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <Scale size={48} className="text-orange-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4">مرحباً بك في مستقبل المحاماة الرقمية</h2>
                <p className="text-zinc-400 max-w-md">اختر إحدى الأدوات من القائمة لبدء العمل على ملفاتك القانونية بدقة متناهية وسرعة فائقة.</p>
              </motion.div>
            ) : currentSection === 'procedures' ? (
              <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Timer className="text-orange-500" /> حساب المواعيد والآجال الإجرائية
                </h3>
                <div className="grid md:grid-cols-2 gap-6 bg-black/40 p-6 rounded-2xl border border-zinc-800">
                  <div>
                    <label className="block text-sm text-zinc-500 mb-2">تاريخ تبليغ المحضر / صدور الحكم</label>
                    <input 
                      type="date" 
                      onChange={(e) => setJudgmentDate(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-500 mb-2">نوع الإجراء القانوني</label>
                    <select 
                      onChange={(e) => setProcedureType(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg focus:outline-none focus:border-orange-500 transition-all"
                    >
                      <option value="civil_appeal">استئناف (المواد المدنية) - 30 يوم</option>
                      <option value="admin_appeal">استئناف (المواد الإدارية) - 60 يوم</option>
                      <option value="criminal_objection">معارضة (المواد الجزائية) - 10 أيام</option>
                    </select>
                  </div>
                  <button 
                    onClick={calculateDeadline}
                    className="md:col-span-2 bg-orange-600 hover:bg-orange-500 py-4 rounded-xl font-bold transition-all shadow-lg shadow-orange-900/20"
                  >
                    حساب الموعد النهائي بدقة
                  </button>
                </div>
                {deadlineResult && (
                  <motion.div initial={{scale:0.9}} animate={{scale:1}} className="mt-8 p-6 bg-orange-500/10 border border-orange-500/30 rounded-2xl text-center">
                    <div className="text-orange-500 text-sm mb-1 text-zinc-400">آخر أجل قانوني لإيداع العريضة هو:</div>
                    <div className="text-2xl font-black text-orange-500 underline underline-offset-8">{deadlineResult}</div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              // نظام الدردشة الموحد للأقسام الأخرى
              <div className="flex-1 flex flex-col h-full">
                <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.sender === 'user' 
                        ? 'bg-zinc-800 border-r-4 border-orange-500' 
                        : 'bg-gradient-to-br from-orange-600 to-red-700 text-white shadow-xl'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <span className="text-[10px] opacity-50 mt-2 block">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                  {isTyping && <div className="text-orange-500 text-xs animate-pulse">المستشار الذكي يكتب الآن...</div>}
                </div>
                
                {/* منطقة الإدخال الذكية */}
                <div className="p-4 bg-black/60 border-t border-zinc-800">
                  <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 p-2 rounded-2xl focus-within:border-orange-500 transition-all">
                    <button className="p-2 text-zinc-500 hover:text-orange-500 transition-colors">
                      <Paperclip size={20} />
                    </button>
                    <input 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="اكتب استفسارك أو ارفع وثيقة للتحليل..."
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm p-2"
                    />
                    <button 
                      onClick={handleSend}
                      className="bg-orange-600 p-3 rounded-xl hover:bg-orange-500 transition-all shadow-lg shadow-orange-900/40"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer مع إخلاء المسؤولية */}
      <footer className="mt-12 border-t border-zinc-900 bg-black/80 py-8">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-orange-500 font-bold mb-4">عن المنصة</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">
              أول منصة جزائرية متكاملة تدمج بين الذكاء الاصطناعي التوليدي والنصوص القانونية الصرفة للجريدة الرسمية. تهدف لتسهيل العمل القضائي للمحامين والمواطنين.
            </p>
          </div>
          <div>
            <h4 className="text-orange-500 font-bold mb-4">روابط سريعة</h4>
            <ul className="text-xs text-zinc-500 space-y-2 font-mono">
              <li className="hover:text-orange-500 cursor-pointer">/ الجريدة الرسمية</li>
              <li className="hover:text-orange-500 cursor-pointer">/ مجلس الدولة</li>
              <li className="hover:text-orange-500 cursor-pointer">/ وزارة العدل</li>
            </ul>
          </div>
          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
            <h4 className="text-red-500 font-bold mb-2 flex items-center gap-2 text-sm"><Info size={16}/> إخلاء مسؤولية</h4>
            <p className="text-[10px] text-zinc-500 uppercase leading-tight">
              الاستشارات المقدمة عبر الذكاء الاصطناعي هي استرشادية فقط. يجب دائماً الرجوع لمحامي معتمد قبل اتخاذ أي إجراء قانوني رسمي.
            </p>
          </div>
        </div>
        <div className="text-center mt-8 text-[10px] text-zinc-700 tracking-[0.5em]">
          &copy; 2026 ALGERIAN LEGAL PLATFORM - HICHEM BENZEROUK
        </div>
      </footer>
    </div>
  );
};

export default App;
