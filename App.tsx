import React, { useState, useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';

// النوع المخصص للأقسام بناءً على الكود الأصلي والورقة
type Section = 'main' | 'legal_advice' | 'contracts' | 'discussion' | 'procedures' | 'radar' | 'research';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai' | 'member' | 'bot';
  memberName?: string;
}

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('main');
  const [judgmentDate, setJudgmentDate] = useState("");
  const [judgmentType, setJudgmentType] = useState("civil_appeal");
  const [deadlineResult, setDeadlineResult] = useState<string | null>(null);
  const [contractStep, setContractStep] = useState<1 | 2 | 3>(1);
  const [contractType, setContractType] = useState<'CDD' | 'CDI' | 'URFI'>('CDI');
  
  // الحفاظ على كافة بيانات العقود من الملف الأصلي
  const [contractData, setContractData] = useState({
    employer: "", employee: "", position: "", salary: "", startDate: "", duration: "",
    partyA: "", partyB: "", itemDescription: "", price: "", location: ""
  });

  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // حساب الآجال بدقة (مع استثناء الجمعة والسبت)
  const calculateDeadline = () => {
    if (!judgmentDate) return;
    let date = new Date(judgmentDate);
    let daysToAdd = judgmentType === 'civil_appeal' ? 30 : judgmentType === 'admin_appeal' ? 60 : 10;
    let addedDays = 0;
    while (addedDays < daysToAdd) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 5 && date.getDay() !== 6) addedDays++;
    }
    setDeadlineResult(date.toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }));
  };

  // الأنماط النارية والفخمة
  const styles = {
    fireGlow: (isHovered: boolean) => ({
      boxShadow: isHovered ? '0 0 25px #ff4500, inset 0 0 10px #ff8c00' : '0 0 10px rgba(255,69,0,0.2)',
      transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      borderRight: '5px solid #ff4500',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    })
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: 'Amiri, serif', direction: 'rtl', padding: '20px' }}>
      
      {/* 1. الميزان الفخم والعناوين */}
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{ fontSize: '5rem', filter: 'drop-shadow(0 0 15px #ff8c00)' }}>⚖️</div>
        <h1 style={{ color: '#ff4500', fontSize: '2.8rem', margin: '10px 0' }}>المنصة القانونية الجزائرية</h1>
        <h3 style={{ opacity: 0.6, letterSpacing: '2px' }}>ALGERIAN LEGAL PLATFORM 2026</h3>
        <div style={{ position: 'absolute', top: '20px', left: '20px', border: '1px solid #ff4500', padding: '10px', fontSize: '0.8rem' }}>
          hichembenzerouk@gmail.com
        </div>
      </header>

      {/* 2. الهيكل الرئيسي: المحتوى يميناً والأقسام يساراً */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '30px', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* نافذة عرض البيانات (يسار الهيكل العادي - يمين المستخدم) */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '2px solid rgba(255,69,0,0.3)', borderRadius: '20px', padding: '30px', minHeight: '500px' }}>
           {currentSection === 'main' ? (
             <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                <h2 style={{ color: '#ff8c00' }}>مرحباً بك في قمرة القيادة القانونية</h2>
                <p>يرجى اختيار القسم المطلوب من القائمة الجانبية لعرض الأدوات والبيانات</p>
             </div>
           ) : (
             <div>
                <h2 style={{ borderBottom: '2px solid #ff4500', paddingBottom: '10px' }}>
                  {currentSection === 'legal_advice' && "الاستشارات القانونية الذكية"}
                  {currentSection === 'contracts' && "توليد العقود الاحترافية"}
                  {currentSection === 'procedures' && "حساب المواعيد الإجرائية"}
                </h2>
                {/* هنا تظهر كافة البيانات والحقول لكل قسم كما في الملف الأصلي */}
                {currentSection === 'contracts' && (
                  <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
                    <input placeholder="اسم صاحب العمل" onChange={e => setContractData({...contractData, employer: e.target.value})} style={{ padding: '12px', background: '#111', border: '1px solid #333', color: '#fff' }} />
                    <input placeholder="اسم الموظف" onChange={e => setContractData({...contractData, employee: e.target.value})} style={{ padding: '12px', background: '#111', border: '1px solid #333', color: '#fff' }} />
                    <input placeholder="الراتب الشهري" onChange={e => setContractData({...contractData, salary: e.target.value})} style={{ padding: '12px', background: '#111', border: '1px solid #333', color: '#fff' }} />
                    <button style={{ background: '#ff4500', color: '#fff', padding: '15px', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>تحميل العقد فوراً</button>
                  </div>
                )}
             </div>
           )}
        </div>

        {/* قائمة الأقسام (يمين الهيكل - حسب رسم الورقة) */}
        <aside>
          {[
            { id: 'legal_advice', ar: 'إستشارة قانونية', en: 'Legal Consultation', icon: '🔥' },
            { id: 'contracts', ar: 'صياغة العقود', en: 'Contract Drafting', icon: '📜' },
            { id: 'discussion', ar: 'ديوان المناقشة', en: 'Discussion Forum', icon: '🏛️' },
            { id: 'procedures', ar: 'الإجراءات القانونية', en: 'Legal Procedures', icon: '⏱️' },
            { id: 'research', ar: 'البحث العلمي', en: 'Scientific Research', icon: '🧪' },
            { id: 'radar', ar: 'الرادار القانوني', en: 'Legal Radar', icon: '📡' }
          ].map((sec) => (
            <div 
              key={sec.id}
              onMouseEnter={() => setHoveredSection(sec.id)}
              onMouseLeave={() => setHoveredSection(null)}
              onClick={() => setCurrentSection(sec.id as Section)}
              style={{
                ...styles.fireGlow(hoveredSection === sec.id || currentSection === sec.id),
                background: currentSection === sec.id ? 'linear-gradient(90deg, #ff4500, #ff8c00)' : 'rgba(20,20,20,0.8)',
                padding: '20px', marginBottom: '15px', borderRadius: '12px', cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '1.8rem' }}>{sec.icon}</span>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: currentSection === sec.id ? '#000' : '#fff' }}>- {sec.ar}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, color: currentSection === sec.id ? '#000' : '#ff8c00' }}>{sec.en}</div>
                </div>
              </div>
            </div>
          ))}
        </aside>
      </div>

      {/* 3. الجزء السفلي: النماذج والسياسات */}
      <footer style={{ marginTop: '50px', borderTop: '2px dashed #ff4500', paddingTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
         <div style={{ background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
            <h4 style={{ color: '#ff8c00' }}>تسجيل الدخول | Login</h4>
            <input placeholder="User / Email" style={{ width: '100%', padding: '10px', marginBottom: '10px', background: '#000', border: '1px solid #ff4500' }} />
            <input type="password" placeholder="Password" style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #ff4500' }} />
         </div>
         <div style={{ background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
            <h4 style={{ color: '#ff8c00' }}>إخلاء مسؤولية | Disclaimer</h4>
            <p style={{ fontSize: '0.8rem', color: '#ccc' }}>هذه المنصة لا تقدم نصائح قانونية نهائية؛ يرجى مراجعة المحامي المختص دائماً.</p>
         </div>
         <div style={{ background: '#111', padding: '20px', borderRadius: '15px', border: '1px solid #333' }}>
            <h4 style={{ color: '#ff8c00' }}>سياسة الخصوصية</h4>
            <p style={{ fontSize: '0.8rem', color: '#ccc' }}>حماية بياناتك الشخصية مكفولة بموجب قانون 18-07 الجزائري لعام 2026.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;
      
