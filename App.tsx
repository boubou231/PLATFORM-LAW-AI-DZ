import React, { useState, useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';

// --- الأنواع والبيانات الأساسية ---
type Section = 'main' | 'legal_advice' | 'contracts' | 'discussion' | 'procedures' | 'radar' | 'research';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai' | 'member' | 'bot';
  memberName?: string;
}

const App: React.FC = () => {
  // --- الحالات (States) من الكود الأصلي ---
  const [currentSection, setCurrentSection] = useState<Section>('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [judgmentDate, setJudgmentDate] = useState("");
  [cite_start]const [judgmentType, setJudgmentType] = useState("civil_appeal");[span_0](end_span)
  const [deadlineResult, setDeadlineResult] = useState<string | null>(null);
  const [contractStep, setContractStep] = useState<1 | 2 | [span_1](start_span)3>(1);[span_1](end_span)
  const [contractType, setContractType] = useState<'CDD' | 'CDI' | 'URFI'>('CDI');
  const [urfiType, setUrfiType] = useState<'rent' | 'sale' | 'maintenance' | 'supply' | [span_2](start_span)'proxy'>('rent');[span_2](end_span)
  const [contractData, setContractData] = useState({
    employer: "", employee: "", position: "", salary: "", startDate: "", duration: "",
    partyA: "", partyB: "", itemDescription: "", price: "", location: ""
  [span_3](start_span)});[span_3](end_span)
  [span_4](start_span)const [cnasData, setCnasData] = useState({ ssNumber: "", birthPlace: "", birthDate: "", address: "" });[span_4](end_span)
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "مرحباً بك في المنصة القانونية الذكية. تم تحديث الأنظمة لتتوافق مع الجريدة الرسمية 2026 وقانون العمل المعدل", sender: 'ai' }
  [span_5](start_span)]);[span_5](end_span)
  const [inputText, setInputText] = useState("");
  [span_6](start_span)const [agreedToCharter, setAgreedToCharter] = useState(false);[span_6](end_span)
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  [span_7](start_span)const forbiddenWords = ['سب', 'قذف', 'اهانة', 'رشوة', 'شتم'];[span_7](end_span)

  // --- الأنماط النارية والإبداعية (التحديث المطلوب) ---
  const fireStyles = {
    container: { minHeight: '100vh', background: '#050505', fontFamily: "'Amiri', serif", direction: 'rtl' as const, color: '#fff', padding: '1rem' },
    flameShadow: '0 0 20px rgba(255, 69, 0, 0.6), 0 0 40px rgba(255, 140, 0, 0.4)',
    sidebarItem: (isActive: boolean) => ({
      display: 'flex', flexDirection: 'column' as const, padding: '1.2rem', marginBottom: '1rem',
      background: isActive ? 'linear-gradient(90deg, #ff4500, #ff8c00)' : 'rgba(255,255,255,0.03)',
      borderRadius: '12px', cursor: 'pointer', transition: '0.3s', borderRight: isActive ? '5px solid #fff' : '5px solid #ff4500',
      boxShadow: isActive ? '0 0 15px #ff4500' : 'none', color: isActive ? '#000' : '#fff'
    }),
    glassCard: { background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,69,0,0.2)', borderRadius: '2rem', padding: '2rem' },
    fireButton: { background: 'linear-gradient(45deg, #ff4500, #ff8c00)', color: '#fff', border: 'none', padding: '1rem', borderRadius: '10px', fontWeight: 'bold' as const, cursor: 'pointer' }
  };

  // --- الوظائف (Logic) من الكود الأصلي ---
  const calculateDeadline = () => {
    if (!judgmentDate) return;
    let date = new Date(judgmentDate);
    let daysToAdd = 0;
    switch (judgmentType) {
      case 'civil_appeal': daysToAdd = 30; break;
      case 'admin_appeal': daysToAdd = 60; break;
      case 'opposition': daysToAdd = 10; break;
      case 'cassation': daysToAdd = 60; break;
      default: daysToAdd = 30;
    [span_8](start_span)}
    let addedDays = 0;
    while (addedDays < daysToAdd) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 5 && date.getDay() !== 6) { addedDays++; }[span_8](end_span)
    }
    setDeadlineResult(date.toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }));
  [span_9](start_span)};[span_9](end_span)

  const downloadContract = async () => {
    [span_10](start_span)const isUrfi = contractType === 'URFI';[span_10](end_span)
    const docTitle = isUrfi ? [span_11](start_span)`عقد عرفي - ${urfiType}` : `عقد عمل - ${contractType}`;[span_11](end_span)
    const doc = new Document({
      sections: [{
        properties: { textDirection: "right-to-left" as any },
        children: [
          new Paragraph({ text: docTitle, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph({
            children: [
              new TextRun({ text: `الطرف الأول: ${isUrfi ? contractData.partyA : contractData.employer}`, bold: true }),
              new TextRun({ text: `\nالطرف الثاني: ${isUrfi ? contractData.partyB : contractData.employee}`, bold: true }),
              isUrfi ? new TextRun({ text: "\n\nملاحظة هامة: هذا العقد عرفي ويستوجب المصادقة عليه في البلدية", color: "FF0000", bold: true }) : new TextRun({ text: "" })
            ],
            alignment: AlignmentType.RIGHT,
          }),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${docTitle}.docx`);
  [span_12](start_span)};[span_12](end_span)

  const handleChatSend = () => {
    if (!chatInput) return;
    let isClean = true;
    [span_13](start_span)forbiddenWords.forEach(word => { if (chatInput.includes(word)) isClean = false; });[span_13](end_span)
    if (!isClean) {
      [span_14](start_span)setChatMessages([...chatMessages, { id: Date.now(), text: "تنبيه: تم حجب الرسالة لمخالفتها ميثاق الالتزام المهني", sender: 'bot' }]);[span_14](end_span)
    } else {
      setChatMessages([...chatMessages, { id: Date.now(), text: chatInput, sender: 'member', memberName: "الأستاذ (عضو)" }]);
    }
    setChatInput("");
  [span_15](start_span)};[span_15](end_span)

  // --- واجهة المستخدم (Render) ---
  const renderMainContent = () => {
    switch (currentSection) {
      case 'legal_advice':
        return (
          <div style={fireStyles.glassCard}>
            <div style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                [span_16](start_span)إخلاء مسؤولية: الاستشارات لأغراض تعليمية فقط[span_16](end_span)
            </div>
            <div style={{ height: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
              {messages.map(m => (
                <div key={m.id} style={{ alignSelf: m.sender === 'ai' ? 'flex-start' : 'flex-end', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '10px', margin: '5px' }}>
                  {m.text}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input value={inputText} onChange={e => setInputText(e.target.value)} style={{ flex: 1, background: '#111', border: '1px solid #ff4500', color: '#fff', padding: '10px' }} placeholder="اشرح الإشكالية..." />
              <button onClick={() => { if(inputText) { setMessages([...messages, {id: Date.now(), text: inputText, sender: 'user'}]); setInputText(""); } }} style={fireStyles.fireButton}>إرسال</button>
            </div>
          </div>
        );

      case 'contracts':
        return (
          <div style={fireStyles.glassCard}>
            [span_17](start_span)<h2 style={{ textAlign: 'center', color: '#ff8c00' }}>منصة صياغة العقود | Contract Drafting</h2>[span_17](end_span)
            {contractStep === 1 && (
              <div>
                 <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                    <button onClick={() => setContractType('CDI')} style={{ flex: 1, padding: '10px', background: contractType === 'CDI' ? '#ff4500' : '#333' }}>CDI</button>
                    <button onClick={() => setContractType('CDD')} style={{ flex: 1, padding: '10px', background: contractType === 'CDD' ? '#ff4500' : '#333' }}>CDD</button>
                    <button onClick={() => setContractType('URFI')} style={{ flex: 1, padding: '10px', background: contractType === 'URFI' ? '#ff4500' : '#333' }}>عرفية</button>
                 </div>
                 <input placeholder="الطرف الأول" onChange={e => setContractData({...contractData, employer: e.target.value, partyA: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
                 <input placeholder="الطرف الثاني" onChange={e => setContractData({...contractData, employee: e.target.value, partyB: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
                 <button onClick={() => setContractStep(2)} style={{ ...fireStyles.fireButton, width: '100%' }}>التالي (CNAS)</button>
              </div>
            )}
            {contractStep === 2 && (
                <div>
                    <input placeholder="رقم الضمان الاجتماعي" onChange={e => setCnasData({...cnasData, ssNumber: e.target.value})} style={{ width: '100%', marginBottom: '10px', padding: '10px' }} />
                    <button onClick={() => setContractStep(3)} style={{ ...fireStyles.fireButton, width: '100%' }}>معاينة</button>
                </div>
            )}
            {contractStep === 3 && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{ background: '#fff', color: '#000', padding: '20px', borderRadius: '10px' }}>
                        <h3>{contractType === 'URFI' ? 'نموذج عقد عرفي' : 'نموذج عقد عمل'}</h3>
                        <p>الطرف الأول: {contractData.partyA || contractData.employer}</p>
                        <p>الطرف الثاني: {contractData.partyB || contractData.employee}</p>
                    </div>
                    <button onClick={downloadContract} style={{ ...fireStyles.fireButton, width: '100%', marginTop: '20px' }}>تحميل بصيغة Word</button>
                </div>
            )}
          </div>
        );

      case 'procedures':
        return (
          <div style={fireStyles.glassCard}>
            [span_18](start_span)<h2 style={{ color: '#ff4500', textAlign: 'center' }}>حاسبة آجال الطعون | Legal Procedures</h2>[span_18](end_span)
            <input type="date" value={judgmentDate} onChange={(e) => setJudgmentDate(e.target.value)} style={{ width: '100%', padding: '1rem', background: '#111', color: '#fff', border: '1px solid #ff4500', borderRadius: '10px' }} />
            <select value={judgmentType} onChange={(e) => setJudgmentType(e.target.value)} style={{ width: '100%', padding: '1rem', marginTop: '1rem', background: '#111', color: '#fff', border: '1px solid #ff4500' }}>
                <option value="civil_appeal">استئناف مدني (30 يوم)</option>
                <option value="admin_appeal">استئناف إداري (60 يوم)</option>
                <option value="opposition">معارضة (10 أيام)</option>
                <option value="cassation">طعن بالنقض (60 يوم)</option>
            </select>
            <button onClick={calculateDeadline} style={{ ...fireStyles.fireButton, width: '100%', marginTop: '1rem' }}>حساب الموعد النهائي بدقة</button>
            {deadlineResult && <div style={{ marginTop: '1rem', padding: '1rem', border: '1px dashed #ff4500', textAlign: 'center' }}>آخر أجل هو: <br/><span style={{ fontSize: '1.5rem', color: '#ff8c00' }}>{deadlineResult}</span></div>}
          </div>
        );

      case 'discussion':
          if (!agreedToCharter) {
              return (
                <div style={{ ...fireStyles.glassCard, textAlign: 'center' }}>
                    [span_19](start_span)<h3>ميثاق الالتزام القانوني</h3>[span_19](end_span)
                    <p>1. السرية التامة وعدم ذكر أسماء حقيقية</p>
                    <p>2. الحفاظ على وقار المهنة</p>
                    <button onClick={() => setAgreedToCharter(true)} style={fireStyles.fireButton}>أوافق وألتزم</button>
                </div>
              );
          }
          return (
            <div style={fireStyles.glassCard}>
                <div style={{ height: '300px', overflowY: 'auto' }}>
                    {chatMessages.map(m => (
                        <div key={m.id} style={{ background: m.sender === 'bot' ? 'rgba(239,68,68,0.1)' : 'rgba(255,140,0,0.1)', padding: '10px', margin: '5px', borderRadius: '10px' }}>
                            <small>{m.memberName}</small>
                            <p>{m.text}</p>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)} style={{ flex: 1, background: '#111', color: '#fff' }} />
                    <button onClick={handleChatSend} style={fireStyles.fireButton}>إرسال</button>
                </div>
            </div>
          );

      case 'radar':
          return (
              <div style={{ ...fireStyles.glassCard, textAlign: 'center' }}>
                  [span_20](start_span)<h2>الرادار القانوني 2026 | Legal Radar</h2>[span_20](end_span)
                  <p>... جاري فحص الجريدة الرسمية والمستجدات التشريعية لعام 2026 ...</p>
              </div>
          );

      case 'research':
          return (
              <div style={fireStyles.glassCard}>
                  [span_21](start_span)<h2 style={{ textAlign: 'center' }}>محرك البحث الأكاديمي | Scientific Research</h2>[span_21](end_span)
                  <textarea placeholder="أدخل إشكالية البحث..." style={{ width: '100%', height: '150px', background: '#111', color: '#fff' }}></textarea>
                  <button style={{ ...fireStyles.fireButton, width: '100%' }}>توليد مذكرة بحثية</button>
              </div>
          );

      default:
        return (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <h2 style={{ fontSize: '2rem', color: '#ff8c00' }}>مرحباً بك في المنصة الذكية</h2>
            <p>اختر قسماً من القائمة الجانبية للبدء</p>
          </div>
        );
    }
  };

  return (
    <div style={fireStyles.container}>
      {/* Header مع الميزان والعناوين */}
      <header style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, border: '1px solid #ff4500', padding: '10px', fontSize: '0.8rem' }}>
            إتصل بنا | Contact Us<br/>hichembenzerouk@gmail.com
        </div>
        <div style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 10px #ff4500)' }}>⚖️</div>
        <h1 style={{ margin: 0, color: '#ff4500' }}>المنصة القانونية الجزائرية</h1>
        <h2 style={{ margin: 0, fontSize: '1.2rem', opacity: 0.7 }}>ALGERIAN LEGAL PLATFORM</h2>
      </header>

      {/* Main Layout: الوسط حسب الورقة */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* القسم الأيسر: عرض المحتوى */}
        <section>
            {renderMainContent()}
        </section>

        {/* القسم الأيمن: القائمة الجانبية (الأقسام) */}
        <aside>
          {[
            { id: 'legal_advice', ar: 'إستشارة قانونية', en: 'Legal Consultation' },
            { id: 'contracts', ar: 'صياغة العقود', en: 'Contract Drafting' },
            { id: 'discussion', ar: 'ديوان المناقشة', en: 'Discussion Forum' },
            { id: 'procedures', ar: 'الإجراءات القانونية', en: 'Legal Procedures' },
            { id: 'research', ar: 'البحث العلمي', en: 'Scientific Research' },
            { id: 'radar', ar: 'الرادار القانوني', en: 'Legal Radar' }
          ].map((sec) => (
            <div 
              key={sec.id} 
              style={fireStyles.sidebarItem(currentSection === sec.id)}
              onClick={() => setCurrentSection(sec.id as Section)}
            >
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>- {sec.ar}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{sec.en}</span>
            </div>
          ))}
        </aside>
      </div>

      {/* Footer: تسجيل الدخول والسياسات */}
      <footer style={{ marginTop: '3rem', borderTop: '2px dashed #ff4500', paddingTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div style={fireStyles.glassCard}>
            <h4>تسجيل الدخول | Login</h4>
            <input placeholder="البريد الإلكتروني" style={{ width: '100%', marginBottom: '5px' }} />
            <input type="password" placeholder="الرقم السري" style={{ width: '100%' }} />
        </div>
        <div style={fireStyles.glassCard}>
            <h4>فتح حساب | Register</h4>
            <input placeholder="البريد الإلكتروني" style={{ width: '100%', marginBottom: '5px' }} />
            <input type="password" placeholder="كلمة السر" style={{ width: '100%' }} />
        </div>
        <div style={{ ...fireStyles.glassCard, border: '1px solid #ff0000' }}>
            <h4 style={{ color: '#ff4d4d' }}>⚠️ إخلاء مسؤولية</h4>
            [span_22](start_span)<p style={{ fontSize: '0.8rem' }}>المعلومات للأغراض التعليمية ولا تعوض الاستشارة الرسمية[span_22](end_span)</p>
        </div>
        <div style={fireStyles.glassCard}>
            <h4>سياسة الخصوصية</h4>
            <p style={{ fontSize: '0.8rem' }}>تخضع المنصة لحماية البيانات الشخصية وفق قانون 18-07 لعام 2026</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
                
