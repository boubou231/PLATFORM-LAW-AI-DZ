import React, { useState, useRef, useEffect } from 'react';
[span_0](start_span)import { saveAs } from 'file-saver';[span_0](end_span)
[span_1](start_span)import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';[span_1](end_span)

[span_2](start_span)// الأنواع المخصصة بناءً على متطلبات المنصة[span_2](end_span)
type Section = 'main' | 'legal_advice' | 'contracts' | 'discussion' | 'procedures' | 'radar' | 'research';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai' | 'member' | [span_3](start_span)'bot';[span_3](end_span)
  memberName?: string;
  files?: File[];
  timestamp: Date;
}

const App: React.FC = () => {
  [span_4](start_span)const [currentSection, setCurrentSection] = useState<Section>('main');[span_4](end_span)
  [span_5](start_span)const [judgmentDate, setJudgmentDate] = useState("");[span_5](end_span)
  [span_6](start_span)const [judgmentType, setJudgmentType] = useState("civil_appeal");[span_6](end_span)
  [span_7](start_span)const [deadlineResult, setDeadlineResult] = useState<string | null>(null);[span_7](end_span)
  [span_8](start_span)const [contractData, setContractData] = useState({[span_8](end_span)
    employer: "", employee: "", position: "", salary: "", startDate: "", duration: "",
    partyA: "", partyB: "", itemDescription: "", price: "", location: ""
  });
  [span_9](start_span)const [hoveredSection, setHoveredSection] = useState<string | null>(null);[span_9](end_span)
  
  // حالات الدردشة والملفات
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  [span_10](start_span)// حساب الآجال بدقة مع استثناء الجمعة والسبت[span_10](end_span)
  const calculateDeadline = () => {
    if (!judgmentDate) return;
    [span_11](start_span)let date = new Date(judgmentDate);[span_11](end_span)
    let daysToAdd = judgmentType === 'civil_appeal' ? 30 : judgmentType === 'admin_appeal' ? [span_12](start_span)60 : 10;[span_12](end_span)
    let addedDays = 0;
    while (addedDays < daysToAdd) {
      date.setDate(date.getDate() + 1);
      [span_13](start_span)if (date.getDay() !== 5 && date.getDay() !== 6) addedDays++;[span_13](end_span)
    }
    [span_14](start_span)setDeadlineResult(date.toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }));[span_14](end_span)
  };

  // وظيفة إرسال الرسالة مع الملفات
  const handleSendMessage = () => {
    if (!inputText.trim() && selectedFiles.length === 0) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      files: selectedFiles,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputText("");
    setSelectedFiles([]);
    
    // محاكاة رد الذكاء الاصطناعي
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: "جاري تحليل استشارتك بناءً على القوانين الجزائرية المحدثة لعام 2026...",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const styles = {
    fireGlow: (isHovered: boolean) => ({
      boxShadow: isHovered ? '0 0 25px #ff4500, inset 0 0 10px #ff8c00' : '0 0 10px rgba(255,69,0,0.2)',
      transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      borderRight: '5px solid #ff4500',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    [span_15](start_span)})[span_15](end_span)
  };

  return (
    [span_16](start_span)<div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: 'Amiri, serif', direction: 'rtl', padding: '20px' }}>[span_16](end_span)
      
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 0 15px #ff8c00)' }}>⚖️</div>
        [span_17](start_span)<h1 style={{ color: '#ff4500', fontSize: '2.8rem', margin: '10px 0' }}>المنصة القانونية الجزائرية</h1>[span_17](end_span)
        [span_18](start_span)<h3 style={{ opacity: 0.6, letterSpacing: '2px' }}>ALGERIAN LEGAL PLATFORM 2026</h3>[span_18](end_span)
        <div style={{ position: 'absolute', top: '20px', left: '20px', border: '1px solid #ff4500', padding: '10px', fontSize: '0.8rem' }}>
          [span_19](start_span)hichembenzerouk@gmail.com[span_19](end_span)
        </div>
      </header>

      [span_20](start_span)<div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', maxWidth: '1400px', margin: '0 auto' }}>[span_20](end_span)
        
        {/* نافذة عرض البيانات الرئيسية */}
        [span_21](start_span)<div style={{ background: 'rgba(255,255,255,0.02)', border: '2px solid rgba(255,69,0,0.3)', borderRadius: '20px', padding: '30px', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>[span_21](end_span)
           
           {currentSection === 'main' ? (
             <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                [span_22](start_span)<h2 style={{ color: '#ff8c00' }}>مرحباً بك في قمرة القيادة القانونية</h2>[span_22](end_span)
                [span_23](start_span)<p>يرجى اختيار القسم المطلوب من القائمة الجانبية لعرض الأدوات والبيانات</p>[span_23](end_span)
             </div>
           ) : (
             <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <h2 style={{ borderBottom: '2px solid #ff4500', paddingBottom: '10px', marginBottom: '20px' }}>
                  [span_24](start_span){currentSection === 'legal_advice' && "الاستشارات القانونية الذكية"}[span_24](end_span)
                  [span_25](start_span){currentSection === 'contracts' && "توليد العقود الاحترافية"}[span_25](end_span)
                  [span_26](start_span){currentSection === 'discussion' && "ديوان المناقشة (التحقق من الجريدة الرسمية)"}[span_26](end_span)
                  [span_27](start_span){currentSection === 'procedures' && "حساب المواعيد الإجرائية"}[span_27](end_span)
                </h2>

                {/* نظام الدردشة الموحد للأقسام */}
                {(currentSection === 'legal_advice' || currentSection === 'discussion') && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '15px', marginBottom: '20px' }}>
                      {messages.map(m => (
                        <div key={m.id} style={{ marginBottom: '15px', textAlign: m.sender === 'user' ? 'right' : 'left' }}>
                          <div style={{ 
                            display: 'inline-block', 
                            padding: '12px 18px', 
                            borderRadius: '15px', 
                            background: m.sender === 'user' ? '#ff4500' : '#222',
                            maxWidth: '80%'
                          }}>
                            <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '5px', opacity: 0.8 }}>
                              {m.sender === 'user' ? 'أنت' : 'المستشار الذكي'}
                            </div>
                            {m.text}
                            {m.files && m.files.map(f => (
                              <div key={f.name} style={{ marginTop: '10px', padding: '5px', border: '1px solid #fff', fontSize: '0.7rem' }}>
                                📎 {f.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="اكتب استفسارك أو شارك قضيتك..." 
                        style={{ flex: 1, padding: '15px', background: '#111', border: '1px solid #333', color: '#fff', borderRadius: '10px' }} 
                      />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        style={{ background: '#333', color: '#fff', padding: '10px 15px', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        📷
                      </button>
                      <input type="file" hidden ref={fileInputRef} multiple onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))} />
                      <button 
                        onClick={handleSendMessage}
                        style={{ background: '#ff4500', color: '#fff', padding: '10px 25px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        إرسال
                      </button>
                    </div>
                  </div>
                )}

                [span_28](start_span){/* قسم العقود[span_28](end_span) */}
                {currentSection === 'contracts' && (
                  <div style={{ display: 'grid', gap: '15px' }}>
                    [span_29](start_span)<input placeholder="اسم صاحب العمل" onChange={e => setContractData({...contractData, employer: e.target.value})} style={{ padding: '12px', background: '#111', border: '1px solid #333', color: '#fff' }} />[span_29](end_span)
                    [span_30](start_span)<input placeholder="اسم الموظف" onChange={e => setContractData({...contractData, employee: e.target.value})} style={{ padding: '12px', background: '#111', border: '1px solid #333', color: '#fff' }} />[span_30](end_span)
                    [span_31](start_span)<input placeholder="الراتب الشهري" onChange={e => setContractData({...contractData, salary: e.target.value})} style={{ padding: '12px', background: '#111', border: '1px solid #333', color: '#fff' }} />[span_31](end_span)
                    [span_32](start_span)<button style={{ background: '#ff4500', color: '#fff', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>تحميل العقد DOCX</button>[span_32](end_span)
                  </div>
                )}

                [span_33](start_span){/* قسم الإجراءات[span_33](end_span) */}
                {currentSection === 'procedures' && (
                  <div style={{ padding: '20px', background: 'rgba(255,69,0,0.05)', borderRadius: '15px' }}>
                    <label>تاريخ التبليغ أو صدور الحكم:</label>
                    <input type="date" onChange={(e) => setJudgmentDate(e.target.value)} style={{ width: '100%', padding: '12px', margin: '10px 0', background: '#111', color: '#fff', border: '1px solid #ff4500' }} />
                    <select onChange={(e) => setJudgmentType(e.target.value)} style={{ width: '100%', padding: '12px', background: '#111', color: '#fff', border: '1px solid #ff4500' }}>
                      <option value="civil_appeal">استئناف مدني (30 يوم)</option>
                      <option value="admin_appeal">استئناف إداري (60 يوم)</option>
                      <option value="criminal_objection">معارضة جزائية (10 أيام)</option>
                    </select>
                    <button onClick={calculateDeadline} style={{ width: '100%', marginTop: '20px', padding: '15px', background: '#ff4500', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>حساب الموعد النهائي</button>
                    {deadlineResult && <div style={{ marginTop: '20px', fontSize: '1.2rem', color: '#ff8c00', textAlign: 'center' }}>آخر أجل هو: {deadlineResult}</div>}
                  </div>
                )}
             </div>
           )}
        </div>

        [span_34](start_span){/* قائمة الأقسام الجانبية[span_34](end_span) */}
        <aside>
          {[
            { id: 'legal_advice', ar: 'إستشارة قانونية', en: 'Legal Consultation', icon: '🔥' },
            { id: 'contracts', ar: 'صياغة العقود', en: 'Contract Drafting', icon: '📜' },
            [span_35](start_span){ id: 'discussion', ar: 'ديوان المناقشة', en: 'Discussion Forum', icon: '🏛️' },[span_35](end_span)
            [span_36](start_span){ id: 'procedures', ar: 'الإجراءات القانونية', en: 'Legal Procedures', icon: '⏱️' },[span_36](end_span)
            [span_37](start_span){ id: 'research', ar: 'البحث العلمي', en: 'Scientific Research', icon: '🧪' },[span_37](end_span)
            [span_38](start_span){ id: 'radar', ar: 'الرادار القانوني', en: 'Legal Radar', icon: '📡' }[span_38](end_span)
          ].map((sec) => (
            <div 
              key={sec.id}
              onMouseEnter={() => setHoveredSection(sec.id)}
              onMouseLeave={() => setHoveredSection(null)}
              onClick={() => setCurrentSection(sec.id as Section)}
              style={{
                [span_39](start_span)...styles.fireGlow(hoveredSection === sec.id || currentSection === sec.id),[span_39](end_span)
                background: currentSection === sec.id ? [span_40](start_span)'linear-gradient(90deg, #ff4500, #ff8c00)' : 'rgba(20,20,20,0.8)',[span_40](end_span)
                padding: '20px', marginBottom: '15px', borderRadius: '12px', cursor: 'pointer'
              }}
            >
              [span_41](start_span)<div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>[span_41](end_span)
                [span_42](start_span)<span style={{ fontSize: '1.8rem' }}>{sec.icon}</span>[span_42](end_span)
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: currentSection === sec.id ? [span_43](start_span)'#000' : '#fff' }}>- {sec.ar}</div>[span_43](end_span)
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, color: currentSection === sec.id ? [span_44](start_span)'#000' : '#ff8c00' }}>{sec.en}</div>[span_44](end_span)
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>

      [span_45](start_span)<footer style={{ marginTop: '50px', borderTop: '2px dashed #ff4500', paddingTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>[span_45](end_span)
         <div style={{ background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
            <h4 style={{ color: '#ff8c00' }}>تسجيل الدخول | [span_46](start_span)Login</h4>[span_46](end_span)
            [span_47](start_span)<input placeholder="User / Email" style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#000', border: '1px solid #ff4500', color: '#fff' }} />[span_47](end_span)
            [span_48](start_span)<input type="password" placeholder="Password" style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #ff4500', color: '#fff' }} />[span_48](end_span)
         </div>
         <div style={{ background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
            <h4 style={{ color: '#ff8c00' }}>إخلاء مسؤولية | [span_49](start_span)Disclaimer</h4>[span_49](end_span)
            <p style={{ fontSize: '0.8rem', color: '#ccc' }}>هذه المنصة لا تقدم نصائح قانونية نهائية؛ [span_50](start_span)يرجى مراجعة المحامي المختص دائماً.</p>[span_50](end_span)
         </div>
         <div style={{ background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
            [span_51](start_span)<h4 style={{ color: '#ff8c00' }}>سياسة الخصوصية</h4>[span_51](end_span)
            [span_52](start_span)<p style={{ fontSize: '0.8rem', color: '#ccc' }}>حماية بياناتك الشخصية مكفولة بموجب قانون 18-07 الجزائري لعام 2026.</p>[span_52](end_span)
         </div>
      </footer>
    </div>
  );
};

[span_53](start_span)export default App;[span_53](end_span)
    
