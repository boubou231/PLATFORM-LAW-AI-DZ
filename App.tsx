import React, { useState, useRef, useEffect } from 'react';

type Section = 'main' | 'استشارة قانونية' | 'صياغة العقود' | 'تحليل الوثائق' | 'الرادار القانوني' | 'البحث العلمي' | 'المصادر والمراجع' | 'تسجيل الدخول' | 'الإجراءات القانونية';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  images?: string[]; 
}

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // حاسبة المواعيد الإجرائية
  const [judgmentDate, setJudgmentDate] = useState("");
  const [judgmentType, setJudgmentType] = useState("civil_appeal");
  const [deadlineResult, setDeadlineResult] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "مرحباً بك في قسم الاستشارات القانونية الذكية. كيف يمكنني مساعدتك اليوم؟ يمكنك كتابة استفسارك أو إرفاق صورة للمستندات.", sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styles = {
    container: { 
      minHeight: '100vh', background: '#0a0a1a',
      fontFamily: "'Amiri', serif", direction: 'rtl' as const, color: '#f8fafc', padding: '1rem',
      position: 'relative' as const, overflowX: 'hidden' as const
    },
    glowLeft: { position: 'absolute' as const, top: '20%', left: '-10%', width: '400px', height: '400px', background: 'rgba(45, 212, 191, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 },
    glowRight: { position: 'absolute' as const, bottom: '10%', right: '-5%', width: '350px', height: '350px', background: 'rgba(139, 92, 246, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 },
    philosophyFrame: {
      margin: '1rem auto 3rem auto', padding: '1.5rem', maxWidth: '900px',
      borderRadius: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(255, 255, 255, 0.02)', textAlign: 'center' as const, zIndex: 2, position: 'relative' as const
    },
    mainGlassCard: {
      maxWidth: '1100px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)', borderRadius: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', zIndex: 2, position: 'relative' as const
    },
    inputStyle: { width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', marginTop: '1rem' },
    chatBox: {
      height: '400px', overflowY: 'auto' as const, padding: '1rem',
      background: 'rgba(0,0,0,0.2)', borderRadius: '1.5rem', marginBottom: '1rem',
      display: 'flex', flexDirection: 'column' as const, gap: '1rem', border: '1px solid rgba(255,255,255,0.05)'
    },
    bubbleAi: { alignSelf: 'flex-start', background: 'rgba(99, 102, 241, 0.15)', padding: '1rem', borderRadius: '0 1.5rem 1.5rem 1.5rem', maxWidth: '80%', border: '1px solid rgba(99, 102, 241, 0.3)' },
    bubbleUser: { alignSelf: 'flex-end', background: 'rgba(45, 212, 191, 0.15)', padding: '1rem', borderRadius: '1.5rem 0 1.5rem 1.5rem', maxWidth: '80%', border: '1px solid rgba(45, 212, 191, 0.3)' }
  };

  const calculateDeadline = () => {
    if (!judgmentDate) return;
    const date = new Date(judgmentDate);
    let daysToAdd = 0;

    switch (judgmentType) {
      case 'civil_appeal': daysToAdd = 30; break;
      case 'admin_appeal': daysToAdd = 60; break;
      case 'opposition': daysToAdd = 10; break;
      case 'cassation': daysToAdd = 60; break;
      default: daysToAdd = 30;
    }

    date.setDate(date.getDate() + daysToAdd);
    setDeadlineResult(date.toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }));
  };

  const handleSendMessage = () => {
    if (!inputText && selectedImages.length === 0) return;
    const newUserMsg: Message = { id: Date.now(), text: inputText, sender: 'user', images: selectedImages.length > 0 ? selectedImages : undefined };
    setMessages([...messages, newUserMsg]);
    setInputText("");
    setSelectedImages([]);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: "جاري تحليل مدخلاتكم بناءً على التشريعات الصادرة في الجريدة الرسمية لعام 2026. يرجى الانتظار...", sender: 'ai' }]);
    }, 1000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => { setSelectedImages(prev => [...prev, reader.result as string]); };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => { setSelectedImages(prev => prev.filter((_, i) => i !== index)); };

  const renderContent = () => {
    switch (currentSection) {
      case 'استشارة قانونية':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#6366f1', marginBottom: '1.5rem', textAlign: 'center' }}>المستشار القانوني الذكي ⚖️</h2>
            <div style={styles.chatBox}>
              {messages.map(msg => (
                <div key={msg.id} style={msg.sender === 'ai' ? styles.bubbleAi : styles.bubbleUser}>
                  {msg.images && msg.images.map((img, idx) => (
                    <img key={idx} src={img} alt="uploaded" style={{ maxWidth: '100px', borderRadius: '0.5rem', margin: '5px' }} />
                  ))}
                  <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.6' }}>{msg.text}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              {selectedImages.map((img, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={img} alt="preview" style={{ height: '60px', borderRadius: '10px', border: '2px solid #6366f1' }} />
                  <button onClick={() => removeImage(idx)} style={{ position: 'absolute', top: -5, left: -5, background: 'red', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', width: '20px', height: '20px' }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="اشرح قضيتك هنا..." style={{ ...styles.inputStyle, marginTop: 0 }} />
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*" multiple />
              <button onClick={() => fileInputRef.current?.click()} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', padding: '1rem', borderRadius: '1rem', cursor: 'pointer', fontSize: '1.5rem' }}>🖼️</button>
              <button onClick={handleSendMessage} style={{ background: '#6366f1', border: 'none', padding: '1rem 2rem', borderRadius: '1rem', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>إرسال</button>
            </div>
          </div>
        );

      case 'تحليل الوثائق':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#2dd4bf', marginBottom: '1.5rem', textAlign: 'center' }}>تحليل الوثائق والمستندات (OCR) 🔍</h2>
            <div style={styles.chatBox}>
              <div style={styles.bubbleAi}><p style={{ margin: 0 }}>مرحباً بك في وحدة تحليل المستندات السيادية. يمكنك رفع عدة صور لعقد أو عريضة أو ملف PDF لتحليل ثغراتها القانونية بناءً على قوانين 2026.</p></div>
              {messages.filter(m => m.id > 1).map(msg => (
                <div key={msg.id} style={msg.sender === 'ai' ? styles.bubbleAi : styles.bubbleUser}>
                   {msg.images && <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>{msg.images.map((img, idx) => (<img key={idx} src={img} alt="doc" style={{ height: '80px', borderRadius: '0.5rem' }} />))}</div>}
                  <p style={{ margin: 0 }}>{msg.text}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              {selectedImages.map((img, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img src={img} alt="preview" style={{ height: '70px', borderRadius: '10px', border: '2px solid #2dd4bf' }} />
                  <button onClick={() => removeImage(idx)} style={{ position: 'absolute', top: -5, left: -5, background: '#ef4444', border: 'none', borderRadius: '50%', color: '#fff', cursor: 'pointer', width: '22px', height: '22px' }}>×</button>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '1.2rem' }}>
              <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="أدخل تعليمات التحليل..." style={{ ...styles.inputStyle, marginTop: 0, border: 'none', background: 'transparent' }} />
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} style={{ display: 'none' }} accept="image/*,application/pdf" multiple />
              <button onClick={() => fileInputRef.current?.click()} style={{ background: 'rgba(45, 212, 191, 0.2)', border: 'none', padding: '0.8rem', borderRadius: '1rem', cursor: 'pointer' }}>📎</button>
              <button onClick={handleSendMessage} style={{ background: '#2dd4bf', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '1rem', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>بدء التحليل</button>
            </div>
          </div>
        );

      case 'الرادار القانوني':
        return (
          <div style={{ animation: 'fadeIn 0.5s', textAlign: 'center' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '2rem' }}>الرادار القانوني النشط 📡</h2>
            <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '2rem', border: '1px solid #38bdf855', marginBottom: '3rem' }}>
               <div style={{ fontSize: '3rem', animation: 'spin 4s linear infinite' }}>📡</div>
               <p style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>جاري مطابقة المدخلات مع آخر مستجدات الجريدة الرسمية 2026</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(56, 189, 248, 0.3)', padding: '1.5rem', borderRadius: '1.5rem', textAlign: 'right' as const }}>
                  <div style={{ color: '#38bdf8', fontSize: '1.2rem', marginBottom: '1rem' }}>🤖 مستجد رقم {item}</div>
                  <div style={{ height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', marginBottom: '1rem' }}><p style={{ fontSize: '0.75rem', padding: '0.5rem', color: '#94a3b8' }}>بانتظار تحليل الذكاء الاصطناعي لملخص الجريدة الرسمية...</p></div>
                  <button style={{ width: '100%', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#38bdf8', padding: '0.5rem', borderRadius: '0.8rem', cursor: 'pointer', fontSize: '0.8rem' }}>تحميل PDF 📄</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'الإجراءات القانونية':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#10b981', marginBottom: '1.5rem', textAlign: 'center' }}>دليل الإجراءات والحاسبة الآلية للمواعيد 🏛️</h2>
            
            {/* حاسبة المواعيد */}
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '2rem', borderRadius: '2rem', border: '2px solid #10b98155', marginBottom: '2rem' }}>
              <h3 style={{ color: '#10b981', textAlign: 'center', marginBottom: '1.5rem' }}>⏱️ حاسبة آجال الطعون القانونية</h3>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>تاريخ التبليغ الرسمي:</label>
                  <input type="date" value={judgmentDate} onChange={(e) => setJudgmentDate(e.target.value)} style={{ ...styles.inputStyle, marginTop: 0 }} />
                </div>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>نوع الإجراء المطلوب:</label>
                  <select value={judgmentType} onChange={(e) => setJudgmentType(e.target.value)} style={{ ...styles.inputStyle, marginTop: 0, appearance: 'none' }}>
                    <option value="civil_appeal">استئناف مدني (30 يوم)</option>
                    <option value="admin_appeal">استئناف إداري (60 يوم)</option>
                    <option value="opposition">معارضة (10 أيام)</option>
                    <option value="cassation">طعن بالنقض (60 يوم)</option>
                  </select>
                </div>
              </div>
              <button onClick={calculateDeadline} style={{ width: '100%', background: '#10b981', color: '#000', fontWeight: 'bold', padding: '1rem', borderRadius: '1rem', border: 'none', marginTop: '1.5rem', cursor: 'pointer' }}>احسب تاريخ انتهاء الأجل</button>
              {deadlineResult && (
                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '1rem', textAlign: 'center', border: '1px dashed #10b981' }}>
                  آخر أجل لاتخاذ الإجراء هو: <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>{deadlineResult}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ color: '#34d399' }}>💰 الرسوم القضائية 2026</h3>
                <ul style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '2' }}>
                  <li>• القسم العقاري / التجاري: 2000 دج - 5000 دج</li>
                  <li>• قضايا شؤون الأسرة: رسوم رمزية مخفضة</li>
                  <li>• الاستئناف (المجالس): 1500 دج</li>
                  <li>• المحكمة العليا: 3000 دج إلى 5000 دج</li>
                </ul>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h3 style={{ color: '#34d399' }}>📑 استخراج السندات</h3>
                <ul style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '2' }}>
                  <li>• <b>النسخة التنفيذية:</b> تسلم مرة واحدة بطلب لكتابة الضبط.</li>
                  <li>• <b>شهادة الكف:</b> تستخرج في حال تسوية وضعية الإكراه البدني.</li>
                  <li>• <b>صحيفة السوابق:</b> متاحة عبر الشباك الإلكتروني الموحد.</li>
                </ul>
              </div>
            </div>
          </div>
        );

      case 'المصادر والمراجع':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#a78bfa', marginBottom: '2rem', textAlign: 'center' }}>المستودع السيادي للمراجع والمؤسسات (روابط مباشرة) 🏛️</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', maxHeight: '500px', overflowY: 'auto', padding: '10px' }}>
              {[
                { n: "الجريدة الرسمية (JORADP)", t: "التشريعات", l: "https://www.joradp.dz" },
                { n: "رئاسة الجمهورية الجزائرية", t: "القرارات السيادية", l: "https://www.el-mouradia.dz" },
                { n: "المحكمة الدستورية", t: "الرقابة الدستورية", l: "https://www.cour-constitutionnelle.dz" },
                { n: "وزارة العدل الجزائرية", t: "الخدمات القانونية", l: "https://www.mjustice.dz" },
                { n: "المحكمة العليا", t: "القضاء العادي", l: "https://www.coursupreme.dz" },
                { n: "مجلس الدولة", t: "القضاء الإداري", l: "https://www.conseile tat.dz" },
                { n: "مجلس المحاسبة", t: "الرقابة المالية", l: "https://www.ccomptes.dz" },
                { n: "بوابة المجلات العلمية (ASJP)", t: "البحوث الأكاديمية", l: "https://www.asjp.cerist.dz" },
                { n: "مجلس الأمة", t: "السلطة التشريعية", l: "https://www.majliselouma.dz" },
                { n: "المجلس الشعبي الوطني", t: "السلطة التشريعية", l: "https://www.apn.dz" },
                { n: "المجلس الإسلامي الأعلى", t: "الفتوى والاجتهاد", l: "https://hci-algeria.dz" },
                { n: "المجلس الوطني لحقوق الإنسان", t: "الحقوق والحريات", l: "https://www.cndh.dz" },
                { n: "المكتبة الوطنية الجزائرية", t: "الأرشيف", l: "http://www.biblionat.dz" },
                { n: "الديوان الوطني لحقوق المؤلف", t: "الملكية الفكرية", l: "https://www.onda.dz" },
                { n: "المعهد الجزائري للملكية الصناعية", t: "INAPI", l: "https://www.inapi.org" },
                { n: "سلطة الانتخابات (ANIE)", t: "المسار الانتخابي", l: "https://ina-elections.dz" },
                { n: "الوكالة الوطنية لترقية الاستثمار", t: "قانون الاستثمار", l: "https://www.aapi.dz" },
                { n: "بوابة البيانات المفتوحة", t: "إحصائيات سيادية", l: "https://www.data.gov.dz" }
              ].map((m, i) => (
                <a key={i} href={m.l} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(167, 139, 250, 0.2)', transition: '0.3s', cursor: 'pointer' }} 
                       onMouseOver={(e) => e.currentTarget.style.background = 'rgba(167, 139, 250, 0.1)'}
                       onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                    <div style={{ color: '#a78bfa', fontSize: '0.75rem', marginBottom: '0.4rem' }}>{m.t}</div>
                    <div style={{ fontWeight: 'bold' }}>🔗 {m.n}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        );

      case 'تسجيل الدخول':
        return (
          <div style={{ maxWidth: '450px', margin: '0 auto', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
            <div style={{ display: 'flex', marginBottom: '2rem', borderRadius: '1rem', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => setAuthMode('login')} style={{ flex: 1, padding: '1rem', background: authMode === 'login' ? '#6366f1' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>تسجيل الدخول</button>
              <button onClick={() => setAuthMode('signup')} style={{ flex: 1, padding: '1rem', background: authMode === 'signup' ? '#6366f1' : 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>إنشاء حساب</button>
            </div>
            <input type="email" placeholder="📧 البريد الإلكتروني" style={styles.inputStyle} /><input type="password" placeholder="🔑 كلمة المرور" style={styles.inputStyle} />
            {authMode === 'signup' && <input type="password" placeholder="🔄 تأكيد كلمة المرور" style={styles.inputStyle} />}
            <button onClick={() => { setIsLoggedIn(true); setCurrentSection('main'); }} style={{ width: '100%', background: authMode === 'login' ? '#6366f1' : '#2dd4bf', padding: '1.2rem', borderRadius: '1rem', border: 'none', color: authMode === 'login' ? '#fff' : '#000', fontWeight: 'bold', marginTop: '1.5rem', cursor: 'pointer' }}>{authMode === 'login' ? 'دخول سيادي' : 'إنشاء حساب جديد'}</button>
          </div>
        );

      case 'البحث العلمي':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#f87171', marginBottom: '1.5rem', textAlign: 'center' }}>محرك البحث الأكاديمي 🎓</h2>
            <textarea placeholder="اكتب موضوع بحثك هنا..." style={{ ...styles.inputStyle, minHeight: '150px' }} />
            <button onClick={() => window.open('https://docs.google.com/document/u/0/', '_blank')} style={{ width: '100%', background: '#b91c1c', border: 'none', padding: '1.2rem', borderRadius: '1rem', color: '#fff', fontWeight: 'bold', cursor: 'pointer', marginTop: '1rem' }}>تحميل البحث بصيغة Word 📄</button>
          </div>
        );

      case 'صياغة العقود':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#fbbf24', marginBottom: '1.5rem', textAlign: 'center' }}>منصة صياغة العقود والعرائض 📝</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '1rem' }}>📑 عقود عرفية</div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '1rem' }}>🏛️ عريضة افتتاحية</div>
            </div>
            <textarea placeholder="أدخل تفاصيل المستند..." style={{ ...styles.inputStyle, minHeight: '100px' }} />
            <button style={{ width: '100%', background: '#fbbf24', border: 'none', padding: '1rem', borderRadius: '1rem', fontWeight: 'bold' }}>توليد المستند 2026</button>
          </div>
        );

      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { t: 'استشارة قانونية', i: '⚖️', c: '#6366f1' },
              { t: 'الإجراءات القانونية', i: '🏛️', c: '#10b981' },
              { t: 'تحليل الوثائق', i: '🔍', c: '#2dd4bf' },
              { t: 'صياغة العقود', i: '📝', c: '#fbbf24' },
              { t: 'البحث العلمي', i: '🎓', c: '#f87171' },
              { t: 'الرادار القانوني', i: '📡', c: '#38bdf8' },
              { t: 'المصادر والمراجع', i: '📚', c: '#a78bfa' }
            ].map((s, i) => (
              <div key={i} onClick={() => setCurrentSection(s.t as Section)} style={{ 
                background: 'rgba(255, 255, 255, 0.04)', borderRadius: '1.5rem', padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.08)', cursor: 'pointer', textAlign: 'center' as const
              }}>
                <div style={{ fontSize: '2.5rem', color: s.c }}>{s.i}</div>
                <h3 style={{ fontSize: '1.4rem' }}>{s.t}</h3>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glowLeft}></div><div style={styles.glowRight}></div>
      <div style={styles.philosophyFrame}><h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>"العدالة في عصر الرقمنة.. أصالة النص، وسرعة النبض"</h1></div>
      <div style={styles.mainGlassCard}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             {!isLoggedIn ? (<button onClick={() => setCurrentSection('تسجيل الدخول')} style={{ background: '#6366f1', padding: '0.6rem 1.5rem', borderRadius: '1rem', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>دخول / تسجيل</button>) : (<span style={{ color: '#34d399' }}>مرحباً بك 👋</span>)}
             <a href="mailto:hichembenzerouk3@gmail.com" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid rgba(148, 163, 184, 0.3)' }}>hichembenzerouk3@gmail.com ✉️</a>
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>🇩🇿 المنصة القانونية الذكية</div>
          {currentSection !== 'main' && <button onClick={() => setCurrentSection('main')} style={{ background: 'transparent', border: '1px solid #d97706', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.8rem' }}>الرئيسية</button>}
        </nav>
        {renderContent()}
        <footer style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
           <div style={{ background: 'rgba(20, 184, 166, 0.1)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #2dd4bf33' }}><h4 style={{ color: '#2dd4bf', marginBottom: '0.5rem' }}>🛡️ حماية البيانات 18-07</h4><p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>تشفير سيادي كامل لعام 2026.</p></div>
           <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}><h4 style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>⚠️ إخلاء مسؤولية</h4><p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>المخرجات إرشادية وتوليد آلي بناءً على الجريدة الرسمية.</p></div>
        </footer>
      </div>
    </div>
  );
};

export default App;
