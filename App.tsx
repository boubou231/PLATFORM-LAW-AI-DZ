import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import FeatureCard from './components/FeatureCard';
import { View, Message, LegalCorrection, LegalNotification, User } from './types';
import * as gemini from './services/geminiService';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Helper to clean text from accidental markdown or extra spaces as a fallback for strict instructions
const cleanText = (text: string) => {
  if (!text) return "";
  // Although the model is instructed to avoid markdown, we strip common symbols as a safety measure
  return text.replace(/[#*`]/g, '').trim();
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Home);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [editableContent, setEditableContent] = useState<string>('');
  const [researchStage, setResearchStage] = useState<string>('');
  const [corrections, setCorrections] = useState<LegalCorrection[]>([]);
  const [showCorrectionForm, setShowCorrectionForm] = useState<string | null>(null);
  const [correctionText, setCorrectionText] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [radarResults, setRadarResults] = useState<{ text: string, sources: { title: string, url: string }[] } | null>(null);
  const [analysisFiles, setAnalysisFiles] = useState<{ base64: string, mimeType: string, name: string }[]>([]);
  const [consultationFiles, setConsultationFiles] = useState<{ base64: string, mimeType: string, name: string }[]>([]);
  const [analysisResult, setAnalysisResult] = useState<{ text: string, sources: { title: string, url: string }[] } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // حالة المستخدم والمصادقة
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<'login' | 'register' | 'verify'>('login');
  const [authFormData, setAuthFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', code: '' });

  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // نظام الإشعارات
  const [notifications, setNotifications] = useState<LegalNotification[]>([]);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [interestCategories, setInterestCategories] = useState<string[]>(['قانون مدني', 'قانون تجاري', 'عقار']);

  const commonContracts = [
    { id: 'lease_movable', title: 'عقد كراء منقول (مركبة/آلة)', category: 'قانون مدني' },
    { id: 'sale_movable', title: 'عقد بيع منقول (تجهيزات/أثاث)', category: 'قانون مدني' },
    { id: 'labor_contract', title: 'عقد عمل مححدد المدة (CDD)', category: 'قانون العمل' },
    { id: 'commercial_agency', title: 'عقد وكالة تجارية عرفية', category: 'قانون تجاري' },
    { id: 'service_agreement', title: 'عقد تقديم خدمات (مقاولة)', category: 'قانون مدني' },
    { id: 'loan_use', title: 'عقد عارية استهلاك (قرض عرفي)', category: 'قانون مدني' },
    { id: 'customary_power', title: 'وكالة عرفية (غير رسمية)', category: 'إجراءات عامة' }
  ];

  const officialResources = [
    { name: "الجريدة الرسمية للجمهورية الجزائرية", url: "https://www.joradp.dz", icon: "📜", description: "المصدر الرسمي لكافة القوانين والمراسيم" },
    { name: "رئاسة الجمهورية الجزائرية", url: "https://www.el-mouradia.dz", icon: "🏛️", description: "الموقع الرسمي لرئاسة الجمهورية ونشاطات الرئيس" },
    { name: "الوزارة الأولى", url: "https://www.premier-ministre.gov.dz", icon: "🏢", description: "بوابة الوزارة الأولى والمراسيم التنفيذية" },
    { name: "مجلس الأمة", url: "https://www.majliselouma.dz", icon: "🏛️", description: "الغرفة العليا للبرلمان الجزائري" },
    { name: "المجلس الشعبي الوطني", url: "https://www.apn.dz", icon: "👥", description: "الغرفة السفلى للبرلمان الجزائري" },
    { name: "المحكمة الدستورية", url: "https://www.cour-constitutionnelle.dz", icon: "⚖️", description: "مراقبة دستورية القوانين والمعاهدات" },
    { name: "مجلس المحاسبة", url: "https://www.ccomptes.dz", icon: "📊", description: "أعلى هيئة رقابية بعدية للأموال العمومية" },
    { name: "مجلس الدولة", url: "https://www.conseiletat.dz", icon: "🏛️", description: "أعلى هيئة في القضاء الإداري الجزائري" },
    { name: "المحكمة العليا", url: "https://www.coursupreme.dz", icon: "⚖️", description: "أعلى هيئة في القضاء العادي" },
    { name: "وزارة الدفاع الوطني", url: "https://www.mdn.dz", icon: "🛡️", description: "الموقع الرسمي لوزارة الدفاع الوطني" },
    { name: "وزارة العدل", url: "https://www.mjustice.dz", icon: "⚖️", description: "القوانين، التنظيمات، والخدمات القضائية" },
    { name: "وزارة الداخلية والجماعات المحلية", url: "https://www.interieur.gov.dz", icon: "🛡️", description: "الإدارة الإقليمية والتشريعات ذات الصلة" },
    { name: "وزارة الشؤون الخارجية", url: "https://www.mfa.gov.dz", icon: "🌍", description: "العلاقات الدولية والجالية الوطنية بالخارج" },
    { name: "وزارة المالية", url: "https://www.mf.gov.dz", icon: "💰", description: "السياسات المالية، الضرائب والميزانية" },
    { name: "المركز الوطني للسجل التجاري (سجلكم)", url: "https://sidjilcom.cnrc.dz", icon: "🏢", description: "بوابة الخدمات الإلكترونية للسجل التجاري" },
    { name: "وزارة التعليم العالي والبحث العلمي", url: "https://www.mesrs.dz", icon: "🎓", description: "شؤون الجامعات والبحث العلمي" },
    { name: "وزارة التربية الوطنية", url: "https://www.education.gov.dz", icon: "📚", description: "قطاع التربية والتعليم" },
    { name: "السلطة الوطنية المستقلة للانتخابات", url: "https://www.ina-elections.dz", icon: "🗳️", description: "تنظيم ومراقبة العمليات الانتخابية" },
    { name: "المجلس الأعلى للشباب", url: "https://www.csj.dz", icon: "🌟", description: "هيئة استشارية لرئاسة الجمهورية" },
    { name: "المرصد الوطني للمجتمع المدني", url: "https://www.onsc.dz", icon: "🤝", description: "ترقية العمل الجمعوي" },
    { name: "المرصد الوطني للمجتمع المدني", url: "https://www.onsc.dz", icon: "🤝", description: "ترقية العمل الجمعوي" },
    { name: "المجلس الوطني الاقتصادي والاجتماعي", url: "https://www.cnese.dz", icon: "📉", description: "هيئة استشارية اقتصادية" },
    { name: "المجلة الجزائرية للعلوم القانونية", url: "https://www.asjp.cerist.dz/en/PresentationRevue/13", icon: "📚", description: "مجلة قانونية جزائرية مرجعية" }
  ];

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dz_legal_corrections');
    if (saved) setCorrections(JSON.parse(saved));
    
    const savedPrefs = localStorage.getItem('dz_legal_interests');
    if (savedPrefs) setInterestCategories(JSON.parse(savedPrefs));

    const savedUser = localStorage.getItem('dz_legal_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dz_legal_user');
    setView(View.Home);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authView === 'register') {
      if (authFormData.password !== authFormData.confirmPassword) {
        alert("كلمات المرور غير متطابقة!");
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setAuthView('verify');
        alert("كود التفعيل هو: 123456 (لأغراض التجربة)");
      }, 1500);
    } else if (authView === 'verify') {
      if (authFormData.code === '123456') {
        const newUser = { username: authFormData.username, email: authFormData.email, isVerified: true };
        setUser(newUser);
        localStorage.setItem('dz_legal_user', JSON.stringify(newUser));
        setView(View.Home);
      } else {
        alert("كود التفعيل خاطئ!");
      }
    } else if (authView === 'login') {
      if (authFormData.username && authFormData.password) {
        const loggedUser = { username: authFormData.username, email: 'user@example.com', isVerified: true };
        setUser(loggedUser);
        localStorage.setItem('dz_legal_user', JSON.stringify(loggedUser));
        setView(View.Home);
      } else {
        alert("يرجى إدخال اسم المستخدم وكلمة المرور");
      }
    }
  };

  const setView = (v: View) => {
    setCurrentView(v);
    setLoading(false);
    setInputText('');
    setEditableContent('');
    setRadarResults(null);
    setAnalysisFiles([]);
    setConsultationFiles([]);
    setAnalysisResult(null);
    setContactStatus('idle');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'analysis' | 'consultation') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const fileList: File[] = Array.from(files);
    const promises = fileList.map((file: File) => {
      return new Promise<{ base64: string, mimeType: string, name: string }>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve({ base64, mimeType: file.type, name: file.name });
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(results => {
      if (target === 'analysis') {
        setAnalysisFiles(prev => [...prev, ...results]);
      } else {
        setConsultationFiles(prev => [...prev, ...results]);
      }
    });
  };

  const removeFile = (index: number, target: 'analysis' | 'consultation') => {
    if (target === 'analysis') {
      setAnalysisFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      setConsultationFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleDocumentAnalysis = async () => {
    if (analysisFiles.length === 0 || loading) return;
    setLoading(true);
    try {
      const result = await gemini.analyzeLegalDocument(analysisFiles, inputText);
      setAnalysisResult(result);
    } catch (e) { alert("خطأ في تحليل الوثيقة."); }
    finally { setLoading(false); }
  };

  const handleConsultation = async () => {
    if ((!inputText.trim() && consultationFiles.length === 0) || loading) return;
    const query = inputText;
    const files = [...consultationFiles];
    setLoading(true);
    setChatHistory(prev => [...prev, { 
      id: 'u-'+Date.now(), 
      role: 'user', 
      text: query || (files.length > 0 ? "[تم إرفاق صور للتحليل]" : ""), 
      timestamp: new Date() 
    }]);
    setInputText('');
    setConsultationFiles([]);
    try {
      const res = await gemini.getLegalConsultation(query, corrections, files);
      setChatHistory(prev => [...prev, { id: 'm-'+Date.now(), role: 'model', text: res.text, timestamp: new Date(), sources: res.sources }]);
    } catch (e) { alert("خطأ في الاتصال"); }
    finally { setLoading(false); }
  };

  const handleCorrectionSubmit = async () => {
    if (!user) {
      alert("يجب تسجيل الدخول لاستخدام ميزة التحقيق المجتمعي.");
      return;
    }
    if (!correctionText.trim() || !showCorrectionForm || verifying) return;
    const originalQuery = chatHistory.find(m => m.id === showCorrectionForm)?.text || "استشارة قانونية";
    setVerifying(true);
    try {
      const result = await gemini.verifyCorrectionWithGazette(originalQuery, correctionText);
      if (result.isCorrect) {
        const newCorr = { originalQuery, correctedText: correctionText, timestamp: new Date() };
        // We adopt this as the definitive answer by adding it to local storage for future context
        const updated = [...corrections, newCorr];
        setCorrections(updated);
        localStorage.setItem('dz_legal_corrections', JSON.stringify(updated));
      }
      
      setChatHistory(prev => [...prev, { 
        id: 'v-'+Date.now(), 
        role: 'model', 
        text: result.isCorrect 
          ? `✅ [تأكيد المطابقة الرقمية]\nتم قبول تصحيحك لمطابقته الحرفية مع نصوص الجريدة الرسمية الجزائرية.\n\n${result.verdict}` 
          : `❌ [رفض لعدم المطابقة القانونية]\nتم رفض المقترح لتعارضه مع التشريع الجزائري الساري.\n\n${result.verdict}\nيرجى مراجعة joradp.dz للتأكد.`,
        timestamp: new Date(),
        sources: result.sources
      }]);
      setShowCorrectionForm(null);
      setCorrectionText('');
    } catch (e) { alert("خطأ في عملية التحقيق الرقمي"); }
    finally { setVerifying(false); }
  };

  const handleFullResearch = async () => {
    if (!inputText.trim() || loading) return;
    setLoading(true);
    try {
      setResearchStage('جاري وضع الخطة...');
      const plan = await gemini.generateResearchStage(inputText, 'plan');
      setResearchStage('جاري توليد المحتوى (20 صفحة)...');
      const content = await gemini.generateResearchStage(inputText, 'content', plan);
      setResearchStage('جاري صياغة المراجع...');
      const conc = await gemini.generateResearchStage(inputText, 'conclusion', inputText);
      setEditableContent(`${plan}\n\n${content}\n\n${conc}`);
      setResearchStage('تم اكتمال البحث العلمي ✅');
    } catch (e) { setResearchStage('خطأ في التوليد'); }
    finally { setLoading(false); }
  };

  const handleDraftContract = async (templateTitle?: string) => {
    const details = templateTitle || inputText;
    if (!details.trim() || loading) return;
    setLoading(true);
    try {
      const res = await gemini.draftLegalContract(details);
      setEditableContent(res);
    } catch (e) { alert("خطأ في صياغة العقود"); }
    finally { setLoading(false); }
  };

  const handleRadarSearch = async (query?: string) => {
    setLoading(true);
    setRadarResults(null);
    try {
      const res = await gemini.legalRadarSearch(query || "أحدث المراسيم والقوانين الجزائرية الصادرة في آخر 10 أيام");
      setRadarResults(res);
    } catch (e) { alert("خطأ في الرصد"); }
    finally { setLoading(false); }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactStatus('sending');
    setTimeout(() => {
      setContactStatus('success');
      setContactForm({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const toggleInterest = (cat: string) => {
    const updated = interestCategories.includes(cat) 
      ? interestCategories.filter(i => i !== cat) 
      : [...interestCategories, cat];
    setInterestCategories(updated);
    localStorage.setItem('dz_legal_interests', JSON.stringify(updated));
  };

  const downloadPDF = async (customId?: string) => {
    const target = customId ? document.getElementById(customId) : contentRef.current;
    if (!target) return;
    const canvas = await html2canvas(target);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`مستند_قانوني_${Date.now()}.pdf`);
  };

  const renderView = () => {
    switch (currentView) {
      case View.Home:
        return (
          <div className="max-w-7xl mx-auto px-4 py-16 text-right">
            <div className="text-center mb-8">
              <div className="inline-block bg-[#052e26]/5 border border-[#052e26]/10 px-8 py-3 rounded-2xl shadow-sm">
                <p className="text-xs font-black text-[#052e26]">📍 توقيت الجزائر: {currentTime.toLocaleTimeString('ar-DZ')}</p>
              </div>
            </div>
            
            <div className="text-center mb-16">
              <h2 className="text-5xl font-black text-[#052e26] mb-8 underline decoration-[#b45309]/30 underline-offset-8">منصة القانون الجزائرية</h2>
              <div className="relative inline-block group">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#b45309]/10 to-[#052e26]/10 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
                 <div className="relative px-8 py-4 border-r-4 border-l-4 border-[#b45309] bg-white/50 backdrop-blur-sm rounded-2xl shadow-sm">
                    <p className="text-xl md:text-2xl font-black text-[#052e26] italic leading-relaxed">
                       <span className="text-[#b45309] text-3xl align-middle ml-2 opacity-60">«</span>
                       القانونُ لَيسَ قيداً لِلحريّة، بَل هو الحِصنُ الذي يَحميها
                       <span className="text-[#b45309] text-3xl align-middle mr-2 opacity-60">»</span>
                    </p>
                 </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                title="إستشارة قانونية" 
                description="إجابات دقيقة مع مراجعة مستجدات آخر 10 أيام." 
                icon={
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l11 6 11-6-11-6zm0 18c-3.31 0-6-2.69-6-6h12c0 3.31-2.69-6-6 6zm-7-9l7 4 7-4-7-4-7 4z"/>
                    <path d="M12 21c-3.31 0-6-2.69-6-6h2c0 2.21 1.79 4 4 4s4-1.79 4-4h2c0 3.31-2.69 6-6 6z"/>
                    <rect x="11" y="10" width="2" height="6" />
                  </svg>
                } 
                view={View.Consultation} 
                onClick={setView} 
                color="bg-white" 
              />
              <FeatureCard 
                title="تحليل الوثائق" 
                description="تحليل ذكي للعقود والصور بمطابقة JORADP." 
                icon={
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    <path d="M9 7h1v5H9zM11 7h1v5h-1z"/>
                  </svg>
                } 
                view={View.FileAnalysis} 
                onClick={setView} 
                color="bg-white" 
              />
              <FeatureCard 
                title="صياغة العقود" 
                description="نماذج عرفية محدثة لعام 2026." 
                icon={
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                  </svg>
                } 
                view={View.ContractDrafting} 
                onClick={setView} 
                color="bg-white" 
              />
              <FeatureCard 
                title="البحث العلمي" 
                description="بحوث أكاديمية (20 صفحة) تلتزم بالتهميش." 
                icon={
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M5 13.18v2.81c0 .73.4 1.41 1.04 1.76l5 2.73c.6.33 1.32.33 1.92 0l5-2.73c.64-.35 1.04-1.03 1.04-1.76v-2.81l-6.04 3.3c-.6.33-1.32.33-1.92 0L5 13.18zm7.04-4.13l10.43 5.69c.35.19.53.59.43.98-.1.39-.44.66-.85.66H19v3c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v-3H3.95c-.41 0-.75-.27-.85-.66-.1-.39.08-.79.43-.98l10.43-5.69c.6-.33 1.32-.33 1.92 0zM12 3l10 5.5-10 5.5L2 8.5 12 3z"/>
                  </svg>
                } 
                view={View.Research} 
                onClick={setView} 
                color="bg-white" 
              />
              <FeatureCard 
                title="الرادار القانوني" 
                description="تمشيط آلي لآخر المستجدات وتصنيفها." 
                icon={
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    <circle cx="12" cy="12" r="3" opacity=".3"/>
                  </svg>
                } 
                view={View.Radar} 
                onClick={setView} 
                color="bg-white" 
              />
              <FeatureCard 
                title="المصادر والمراجع" 
                description="قائمة المصادر السيادية والمجلة الجزائرية." 
                icon={
                  <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/>
                  </svg>
                } 
                view={View.Resources} 
                onClick={setView} 
                color="bg-white" 
              />
            </div>
          </div>
        );

      case View.Auth:
        return (
          <div className="max-w-md mx-auto px-4 py-16">
            <div className="bg-white p-10 rounded-[3rem] shadow-2xl border relative overflow-hidden text-right">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#b45309] to-[#052e26]"></div>
              <h3 className="text-3xl font-black text-[#052e26] mb-8">
                {authView === 'login' && "تسجيل الدخول"}
                {authView === 'register' && "إنشاء حساب جديد"}
                {authView === 'verify' && "تفعيل الحساب"}
              </h3>
              
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authView !== 'verify' && (
                  <input 
                    required 
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-xs" 
                    placeholder="اسم المستخدم" 
                    value={authFormData.username} 
                    onChange={e => setAuthFormData({...authFormData, username: e.target.value})} 
                  />
                )}
                
                {authView === 'register' && (
                  <input 
                    required 
                    type="email"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-xs" 
                    placeholder="البريد الإلكتروني" 
                    value={authFormData.email} 
                    onChange={e => setAuthFormData({...authFormData, email: e.target.value})} 
                  />
                )}
                
                {authView !== 'verify' && (
                  <input 
                    required 
                    type="password"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-xs" 
                    placeholder="كلمة المرور" 
                    value={authFormData.password} 
                    onChange={e => setAuthFormData({...authFormData, password: e.target.value})} 
                  />
                )}
                
                {authView === 'register' && (
                  <input 
                    required 
                    type="password"
                    className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-xs" 
                    placeholder="تأكيد كلمة المرور" 
                    value={authFormData.confirmPassword} 
                    onChange={e => setAuthFormData({...authFormData, confirmPassword: e.target.value})} 
                  />
                )}
                
                {authView === 'verify' && (
                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-slate-500">لقد أرسلنا كود التفعيل إلى بريدك الإلكتروني، يرجى إدخاله للمتابعة.</p>
                    <input 
                      required 
                      className="w-full p-5 bg-amber-50 rounded-2xl border-2 border-amber-200 outline-none font-black text-center text-2xl tracking-[0.5em]" 
                      placeholder="000000" 
                      value={authFormData.code} 
                      onChange={e => setAuthFormData({...authFormData, code: e.target.value})} 
                    />
                  </div>
                )}
                
                <button type="submit" disabled={loading} className="w-full bg-[#052e26] text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-[#064e3b] transition-all">
                  {loading ? "جاري المعالجة..." : (
                    authView === 'login' ? "دخول 🚀" : (authView === 'register' ? "إنشاء حساب" : "تفعيل الحساب ✅")
                  )}
                </button>
              </form>
              
              <div className="mt-8 text-center">
                {authView === 'login' ? (
                  <p className="text-[10px] font-bold text-slate-500">ليس لديك حساب؟ <button onClick={() => setAuthView('register')} className="text-[#b45309] font-black underline">سجل الآن</button></p>
                ) : authView === 'register' ? (
                  <p className="text-[10px] font-bold text-slate-500">لديك حساب بالفعل؟ <button onClick={() => setAuthView('login')} className="text-[#b45309] font-black underline">سجل دخولك</button></p>
                ) : (
                  <button onClick={() => setAuthView('register')} className="text-[10px] text-slate-400 font-bold underline">العودة للتسجيل</button>
                )}
              </div>
            </div>
          </div>
        );

      case View.Resources:
        return (
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-16">
               <h3 className="text-4xl font-black text-[#052e26] mb-4">المصادر والمراجع القانونية المعتمدة 📚</h3>
               <p className="text-slate-500 font-bold">قائمة شاملة للمواقع السيادية والهيئات القانونية الجزائرية</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {officialResources.map((res, idx) => (
                <a key={idx} href={res.url} target="_blank" rel="noopener noreferrer" className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all flex flex-col items-center text-center group">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform group-hover:bg-[#b45309]/10">{res.icon}</div>
                  <h4 className="text-xl font-black text-[#052e26] group-hover:text-[#b45309]">{res.name}</h4>
                  <p className="text-[11px] font-bold text-slate-400 mt-2 leading-relaxed">{res.description}</p>
                </a>
              ))}
            </div>
            <button onClick={() => setView(View.Home)} className="mt-16 block mx-auto bg-[#052e26] text-white px-10 py-4 rounded-2xl font-black text-xs">العودة للرئيسية</button>
          </div>
        );

      case View.Radar:
        return (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-[#052e26] p-12 rounded-[3.5rem] shadow-2xl text-white relative overflow-hidden mb-12">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-20">
                <div className="w-full h-full border-2 border-emerald-400 rounded-full animate-ping"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-400/10 to-transparent animate-spin-slow"></div>
              </div>
              <div className="relative z-10 text-center">
                <h3 className="text-4xl font-black mb-4 flex items-center justify-center gap-4">
                  <span className="w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]"></span>
                  البوت الراداري: تمشيط المستجدات (آخر 10 أيام)
                </h3>
                <p className="text-emerald-100/70 font-bold mb-8">يتم الآن تمشيط المصادر السيادية وتصنيف النتائج آلياً</p>
                <div className="max-w-xl mx-auto flex gap-3">
                  {/* FIX: Use an arrow function wrapper with an explicit body to avoid returning the Promise value to React, which satisfies the void return type requirement. */}
                  <input className="flex-1 p-5 bg-white/10 border border-white/20 rounded-2xl outline-none font-bold text-white placeholder:text-white/40 text-right" placeholder="بحث مخصص في المستجدات..." value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleRadarSearch(inputText); }} />
                  {/* FIX: Use an arrow function wrapper with an explicit body to avoid returning the Promise value to React, which satisfies the void return type requirement. */}
                  <button onClick={() => { handleRadarSearch(inputText); }} disabled={loading} className="bg-[#b45309] text-white px-8 py-5 rounded-2xl font-black text-sm hover:scale-105 transition-all">تحديث المسح</button>
                </div>
              </div>
            </div>

            {loading && (
              <div className="text-center py-20">
                <div className="w-20 h-20 border-4 border-[#b45309] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-lg font-black text-[#052e26]">جاري جلب روابط PDF وملخصات JORADP المحدثة...</p>
              </div>
            )}

            {radarResults && !loading && (
              <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-700" id="radar-output">
                <div className="bg-white p-12 rounded-[4rem] shadow-xl border-t-8 border-[#b45309] leading-loose text-right text-slate-700 font-bold whitespace-pre-wrap">
                  {cleanText(radarResults.text)}
                  
                  {radarResults.sources && radarResults.sources.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-slate-100">
                      <h5 className="text-sm font-black text-[#052e26] mb-4">روابط التحقق المباشرة:</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {radarResults.sources.map((s, idx) => (
                          <a key={idx} href={s.url} target="_blank" rel="noopener noreferrer" className="p-4 bg-slate-50 border rounded-2xl text-xs text-[#b45309] hover:bg-slate-100 transition-all flex items-center justify-between group">
                            <span className="font-black truncate ml-2">{s.title}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case View.Contact:
        return (
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="text-right space-y-8">
                <h3 className="text-4xl font-black text-[#052e26]">تواصل معنا 📞</h3>
                <p className="text-lg text-slate-600 font-bold">للدعم التقني والاستفسارات، راسلنا عبر البريد الرسمي:</p>
                <div className="p-8 bg-white rounded-3xl border-r-8 border-[#b45309] shadow-sm flex items-center justify-between">
                  <p className="text-[#b45309] font-black text-2xl">hichembenzerouk3@gmail.com</p>
                  <span className="text-3xl">📧</span>
                </div>
              </div>
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#b45309]"></div>
                {contactStatus === 'success' ? (
                  <div className="text-center py-10 animate-in zoom-in">
                    <div className="text-6xl mb-4">✅</div>
                    <h4 className="text-2xl font-black mb-4 text-[#052e26]">تم الإرسال بنجاح!</h4>
                    <button onClick={() => setContactStatus('idle')} className="text-[#b45309] font-black underline">إرسال رسالة أخرى</button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6 text-right">
                    <input required className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-xs" placeholder="الاسم الكامل" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} />
                    <input required type="email" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-xs" placeholder="البريد الإلكتروني" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} />
                    <textarea required className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-xs min-h-[150px]" placeholder="كيف يمكننا مساعدتك؟" value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} />
                    <button type="submit" className="w-full bg-[#052e26] text-white py-5 rounded-2xl font-black text-sm shadow-xl hover:bg-[#064e3b] transition-all">إرسال 🚀</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        );

      case View.Consultation:
      case View.FileAnalysis:
      case View.Research:
      case View.ContractDrafting:
      case View.DataProtection:
        return (
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="bg-white p-12 rounded-[4rem] shadow-xl border text-right">
              <h3 className="text-3xl font-black text-[#052e26] mb-8">
                {currentView === View.Consultation && "إستشارة قانونية ذكية ⚖️"}
                {currentView === View.FileAnalysis && "تحليل الوثائق المتعددة 🔍"}
                {currentView === View.Research && "البحث العلمي القانوني 🎓"}
                {currentView === View.ContractDrafting && "صياغة العقود 🖋️"}
                {currentView === View.DataProtection && "حماية المعطيات الشخصية 🔒"}
              </h3>
              
              {currentView === View.Consultation && (
                <div className="h-[600px] flex flex-col relative">
                  <div className="bg-blue-50 text-blue-700 p-4 rounded-2xl mb-4 text-[11px] font-black text-center border border-blue-100 shadow-sm">
                    🛡️ بروتوكول إجباري: جاري مراجعة مستجدات آخر 10 أيام قبل الإجابة. يمكنك إرسال صور مع الاستفسار.
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 p-6 border rounded-3xl bg-slate-50/30 shadow-inner">
                     {chatHistory.map(m => (
                        <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                           <div className={`max-w-[85%] p-5 rounded-3xl text-sm ${m.role === 'user' ? 'bg-[#052e26] text-white font-bold shadow-md' : 'bg-white border text-slate-800 shadow-sm relative group'}`}>
                              <div className="whitespace-pre-wrap leading-relaxed">{cleanText(m.text)}</div>
                              
                              {m.sources && m.sources.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                  <p className="text-[10px] font-black text-slate-400 mb-2">أدلة التحقق من JORADP:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {m.sources.map((s, idx) => (
                                      <a key={idx} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-amber-50 text-[#b45309] px-3 py-1.5 rounded-lg border border-[#b45309]/20 hover:bg-[#b45309] hover:text-white transition-all font-black">🔗 {s.title}</a>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {m.role === 'model' && !m.id.startsWith('v-') && user && (
                                <button onClick={() => setShowCorrectionForm(m.id)} className="mt-4 text-[9px] font-black text-red-600 bg-red-50 px-3 py-1.5 rounded-full border border-red-100 flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all">
                                  <span>🔍 تحقيق مجتمعي (اقتراح تصحيح)</span>
                                </button>
                              )}
                           </div>
                        </div>
                     ))}
                     {loading && <p className="text-xs font-black animate-pulse text-[#b45309] text-center bg-amber-50 py-2 rounded-xl">جاري الفحص والمطابقة مع JORADP...</p>}
                  </div>

                  {showCorrectionForm && user && (
                    <div className="absolute inset-x-6 bottom-24 bg-white border-2 border-red-200 p-6 rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-5 z-20">
                      <h4 className="text-sm font-black text-red-600 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                        اقتراح تصحيح قانوني مستند للجريدة الرسمية
                      </h4>
                      <textarea 
                        className="w-full p-4 bg-slate-50 border rounded-2xl outline-none font-bold text-xs min-h-[100px]" 
                        placeholder="ادخل التصحيح القانوني الدقيق (يرجى ذكر رقم المادة والعدد إن أمكن)..." 
                        value={correctionText} 
                        onChange={e => setCorrectionText(e.target.value)} 
                      />
                      <div className="flex gap-2 mt-4">
                        {/* FIX: Use an arrow function wrapper with an explicit body to avoid returning the Promise value to React, which satisfies the void return type requirement. */}
                        <button onClick={() => { handleCorrectionSubmit(); }} disabled={verifying} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-black text-[11px]">
                          {verifying ? "جاري التحقق من JORADP..." : "إرسال للتحقيق الرقمي 🚀"}
                        </button>
                        <button onClick={() => { setShowCorrectionForm(null); setCorrectionText(''); }} className="px-6 bg-slate-100 text-slate-500 py-3 rounded-xl font-black text-[11px]">إلغاء</button>
                      </div>
                    </div>
                  )}

                  {consultationFiles.length > 0 && (
                    <div className="absolute bottom-20 right-4 flex gap-2 overflow-x-auto p-2 bg-white/80 backdrop-blur rounded-xl border shadow-sm max-w-[80%]">
                      {consultationFiles.map((f, i) => (
                        <div key={i} className="relative w-12 h-12 flex-shrink-0 border rounded-lg bg-slate-50 flex items-center justify-center overflow-hidden">
                          <img src={`data:${f.mimeType};base64,${f.base64}`} className="w-full h-full object-cover" alt="" />
                          <button onClick={() => removeFile(i, 'consultation')} className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full text-[8px] flex items-center justify-center shadow-md">✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 p-2 bg-white rounded-3xl border shadow-xl relative items-center">
                    <label className="p-3 bg-slate-50 rounded-2xl border cursor-pointer hover:bg-slate-100 transition-colors">
                      <input type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'consultation')} />
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                    {/* FIX: Use an arrow function wrapper with an explicit body to avoid returning the Promise value to React, which satisfies the void return type requirement. */}
                    <input className="flex-1 p-4 outline-none font-bold text-right text-sm" placeholder="اسأل عن أي مادة أو أرفق صوراً للتحليل..." value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleConsultation(); }} />
                    {/* FIX: Use an arrow function wrapper with an explicit body to avoid returning the Promise value to React, which satisfies the void return type requirement. */}
                    <button onClick={() => { handleConsultation(); }} className="bg-[#052e26] text-white px-10 py-4 rounded-2xl font-black text-xs hover:bg-[#064e3b] transition-all">إرسال</button>
                  </div>
                </div>
              )}

              {currentView === View.FileAnalysis && (
                <div className="space-y-8">
                   <div className="border-4 border-dashed rounded-[3rem] p-12 flex flex-col items-center bg-slate-50 cursor-pointer relative group hover:bg-slate-100 transition-colors">
                      <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'analysis')} />
                      <div className="text-6xl mb-6 group-hover:rotate-12 transition-transform">📄</div>
                      <p className="font-black text-[#052e26] text-lg">
                        {analysisFiles.length > 0 ? `تم اختيار ${analysisFiles.length} وثائق للتحليل` : "ارفع وثيقة واحدة أو أكثر (صور/PDF) للمعالجة"}
                      </p>
                   </div>
                   
                   {analysisFiles.length > 0 && (
                     <div className="flex flex-wrap gap-3 mb-4">
                       {analysisFiles.map((file, idx) => (
                         <div key={idx} className="bg-slate-100 px-4 py-2 rounded-xl flex items-center gap-2 border shadow-sm">
                           <span className="text-[10px] font-black truncate max-w-[120px]">{file.name}</span>
                           <button onClick={() => removeFile(idx, 'analysis')} className="text-red-500 font-black hover:scale-125 transition-transform">✕</button>
                         </div>
                       ))}
                     </div>
                   )}

                   <input className="w-full p-5 border rounded-3xl font-bold text-right outline-none bg-slate-50" placeholder="أسئلة إضافية حول مجموعة الوثائق المرفقة..." value={inputText} onChange={e => setInputText(e.target.value)} />
                   {/* FIX: Use an arrow function wrapper with an explicit body to avoid returning the Promise value to React, which satisfies the void return type requirement. */}
                   <button onClick={() => { handleDocumentAnalysis(); }} disabled={analysisFiles.length === 0 || loading} className="w-full bg-[#052e26] text-white py-5 rounded-[2rem] font-black shadow-xl">
                     {loading ? "جاري التحليل الجماعي للوثائق..." : "بدء التحليل الاستخباراتي الشامل 🚀"}
                   </button>
                   {analysisResult && (
                      <div className="mt-8 p-12 bg-white border-2 border-slate-100 rounded-[3rem] whitespace-pre-wrap font-bold leading-relaxed shadow-lg relative" id="analysis-out">
                         {cleanText(analysisResult.text)}
                         {/* FIX: Use an arrow function wrapper with an explicit body to avoid returning the Promise value to React, which satisfies the void return type requirement. */}
                         <button onClick={() => { downloadPDF('analysis-out'); }} className="mt-10 bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-xs block mx-auto">تحميل التقرير بصيغة PDF</button>
                      </div>
                   )}
                </div>
              )}

              {currentView === View.Research && (
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <input className="flex-1 p-5 border rounded-3xl font-bold text-right outline-none bg-slate-50" placeholder="عنوان البحث (مثال: النظام القانوني للصفقات العمومية)..." value={inputText} onChange={e => setInputText(e.target.value)} />
                      {/* FIX: Use an arrow function wrapper with an explicit body to avoid returning the Promise value to React, which satisfies the void return type requirement. */}
                      <button onClick={() => { handleFullResearch(); }} disabled={loading} className="bg-[#052e26] text-white px-10 py-5 rounded-3xl font-black">توليد البحث</button>
                   </div>
                   {researchStage && <p className="text-center font-black animate-pulse text-[#b45309] text-sm">{researchStage}</p>}
                   {editableContent && (
                      <div className="p-12 border-2 rounded-[4rem] whitespace-pre-wrap leading-loose text-justify font-bold academic-content bg-white shadow-sm" ref={contentRef}>
                         {cleanText(editableContent)}
                         {/* FIX: Use an arrow function wrapper with an explicit body to avoid returning the Promise value to React, which satisfies the void return type requirement. */}
                         <button onClick={() => { downloadPDF(); }} className="mt-12 bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs block mx-auto">تصدير البحث العلمي الكامل (PDF)</button>
                      </div>
                   )}
                </div>
              )}

              {currentView === View.ContractDrafting && (
                <div className="space-y-8">
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {commonContracts.map(c => (
                        /* FIX: Use an arrow function wrapper with an explicit body to avoid returning the Promise value to React, which satisfies the void return type requirement. */
                        <button key={c.id} onClick={() => { handleDraftContract(c.title); }} className="p-4 border rounded-2xl font-black text-[10px] hover:bg-[#b45309]/5 hover:border-[#b45309] transition-all text-center">{c.title}</button>
                      ))}
                   </div>
                   <textarea className="w-full p-8 border rounded-[2.5rem] min-h-[200px] outline-none font-bold text-right leading-relaxed bg-slate-50" placeholder="أدخل تفاصيل الأطراف والموضوع لصياغة مخصصة..." value={inputText} onChange={e => setInputText(e.target.value)} />
                   {/* FIX: Changed handleDraftContract() call to an arrow function reference to prevent it from executing during every render and wrapped it in braces to satisfy the MouseEventHandler return type. */}
                   <button onClick={() => { handleDraftContract(); }} disabled={loading} className="w-full bg-[#052e26] text-white py-5 rounded-[2rem] font-black shadow-xl">صياغة عقد عرفي محدث 2026</button>
                   {editableContent && (
                      <div className="mt-10 p-12 border-2 rounded-[3.5rem] relative bg-white shadow-lg">
                         <textarea className="w-full min-h-[500px] border-none outline-none font-bold text-right leading-loose" value={editableContent} onChange={e => setEditableContent(e.target.value)} />
                         {/* FIX: Use an arrow function wrapper with an explicit body to avoid returning the Promise value to React, which satisfies the void return type requirement. */}
                         <button onClick={() => { downloadPDF(); }} className="mt-8 bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xs block mx-auto">تحميل العقد الموثق رقمياً</button>
                      </div>
                   )}
                </div>
              )}

              {currentView === View.DataProtection && (
                <div className="space-y-8 leading-loose text-lg font-bold">
                  <p className="text-[#052e26] text-2xl font-black border-b pb-4 inline-block">الامتثال التام للقانون 18-07 🔒</p>
                  <p>تخضع كافة معالجات البيانات في منصة القانون الجزائرية لأحكام القانون رقم 18-07 المؤرخ في 10 يونيو 2018.</p>
                  <button onClick={() => setView(View.Home)} className="mt-10 bg-[#052e26] text-white px-12 py-5 rounded-[2rem] font-black shadow-lg">أوافق، العودة للرئيسية</button>
                </div>
              )}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-cairo bg-[#f8f5f2]">
      <Header currentView={currentView} setView={setView} user={user} onLogout={handleLogout} />
      <div className="flex-1">{renderView()}</div>
      <footer className="bg-white border-t py-12 no-print">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-10 p-6 bg-amber-50 rounded-[2rem] border-2 border-amber-100 shadow-sm text-center">
            <p className="text-[11px] font-bold text-amber-900 italic">⚠️ إخلاء مسؤولية: الاستشارات إرشادية فقط ولا تغني عن استشارة محامي.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-[11px] font-black text-slate-400">
            <p>© {new Date().getFullYear()} منصة القانون الجزائرية - حماية المعطيات الشخصية مكفولة بالقانون 18-07</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
