import React, { useState, useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';

type Section = 'main' | 'استشارة قانونية' | 'صياغة العقود' | 'تحليل الوثائق' | 'الرادار القانوني' | 'البحث العلمي' | 'المصادر والمراجع' | 'تسجيل الدخول' | 'الإجراءات القانونية' | 'ديوان المناقشة';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai' | 'member' | 'bot';
  memberName?: string;
}

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('main');
  const [isLoggedIn, setisLoggedIn] = useState(false);
  
  const [judgmentDate, setJudgmentDate] = useState("");
  const [judgmentType, setJudgmentType] = useState("civil_appeal");
  const [deadlineResult, setDeadlineResult] = useState<string | null>(null);

  const [contractStep, setContractStep] = useState<1 | 2 | 3>(1);
  const [contractType, setContractType] = useState<'CDD' | 'CDI' | 'URFI'>('CDI');
  const [urfiType, setUrfiType] = useState<'rent' | 'sale' | 'maintenance' | 'supply' | 'proxy'>('rent');
  const [contractData, setContractData] = useState({
    employer: "", employee: "", position: "", salary: "", startDate: "", duration: "",
    partyA: "", partyB: "", itemDescription: "", price: "", location: ""
  });
  const [cnasData, setCnasData] = useState({ ssNumber: "", birthPlace: "", birthDate: "", address: "" });

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "مرحباً بك في المنصة القانونية الذكية. تم تحديث الأنظمة لتتوافق مع الجريدة الرسمية 2026 وقانون العمل المعدل", sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [agreedToCharter, setAgreedToCharter] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const forbiddenWords = ['سب', 'قذف', 'اهانة', 'رشوة', 'شتم'];

  const styles = {
    container: { minHeight: '100vh', background: '#0a0a1a', fontFamily: "'Amiri', serif", direction: 'rtl' as const, color: '#f8fafc', padding: '1rem', position: 'relative' as const, overflowX: 'hidden' as const },
    glowLeft: { position: 'absolute' as const, top: '20%', left: '-10%', width: '400px', height: '400px', background: 'rgba(45, 212, 191, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 },
    glowRight: { position: 'absolute' as const, bottom: '10%', right: '-5%', width: '350px', height: '350px', background: 'rgba(139, 92, 246, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 },
    mainGlassCard: { maxWidth: '1100px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', borderRadius: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', zIndex: 2, position: 'relative' as const },
    inputStyle: { width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', marginTop: '0.5rem' },
    chatBox: { height: '400px', overflowY: 'auto' as const, padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column' as const, gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' },
    bubbleAi: { alignSelf: 'flex-start', background: 'rgba(99, 102, 241, 0.15)', padding: '1rem', borderRadius: '0 1.5rem 1.5rem 1.5rem', maxWidth: '80%', border: '1px solid rgba(99, 102, 241, 0.3)' },
    bubbleUser: { alignSelf: 'flex-end', background: 'rgba(45, 212, 191, 0.15)', padding: '1rem', borderRadius: '1.5rem 0 1.5rem 1.5rem', maxWidth: '80%', border: '1px solid rgba(45, 212, 191, 0.3)' },
    charterBox: { background: 'rgba(56, 189, 248, 0.05)', border: '1px solid #38bdf8', padding: '2rem', borderRadius: '1.5rem', textAlign: 'center' as const }
  };

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
               }
    let addedDays = 0;
    while (addedDays < daysToAdd) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 5 && date.getDay() !== 6) { addedDays++; }
    }
    setDeadlineResult(date.toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }));
  };

  const downloadContract = async () => {
    const isUrfi = contractType === 'URFI';
    const docTitle = isUrfi ? `عقد عرفي - ${urfiType}` : `عقد عمل - ${contractType}`;
    const doc = new Document({
      sections: [{
        properties: { textDirection: "right-to-left" as any },
        children: [
          new Paragraph({ text: docTitle, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph({
            children: [
              new TextRun({ text: `الطرف الأول: ${isUrfi ? contractData.partyA : contractData.employer}`, bold: true }),
              new TextRun({ text: `\nالطرف الثاني: ${isUrfi ? contractData.partyB : contractData.employee}`, bold: true }),
              isUrfi ? new TextRun({ text: "\n\nملاحظة هامة: هذا العقد عرفي ويستوجب المصادقة عليه في البلدية لمنحه حجية التاريخ الثابت.", color: "FF0000", bold: true }) : new TextRun({ text: "" })
            ],
            alignment: AlignmentType.RIGHT,
          }),
        ],
      }],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${docTitle}.docx`);
  };

  const handleChatSend = () => {
    if (!chatInput) return;
    let isClean = true;
    forbiddenWords.forEach(word => { if (chatInput.includes(word)) isClean = false; });
    if (!isClean) {
      setChatMessages([...chatMessages, { id: Date.now(), text: "⚠️ تنبيه من البوت المراقب: تم حجب الرسالة لمخالفتها ميثاق الالتزام المهني والوقار القانوني.", sender: 'bot' }]);
    } else {
      setChatMessages([...chatMessages, { id: Date.now(), text: chatInput, sender: 'member', memberName: "الأستاذ (عضو)" }]);
    }
    setChatInput("");
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'استشارة قانونية':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24', color: '#fbbf24', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
              إخلاء مسؤولية: كافة الاستشارات المقدمة هنا هي لأغراض تعليمية وتدريبية فقط، ولا تعوض الاستشارة القانونية الرسمية.
            </div>
            <div style={styles.chatBox}>
              {messages.map(m => (<div key={m.id} style={m.sender === 'ai' ? styles.bubbleAi : styles.bubbleUser}>{m.text}</div>))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input value={inputText} onChange={e => setInputText(e.target.value)} placeholder="اشرح الإشكالية القانونية (لأغراض تدريبية) ..." style={{...styles.inputStyle, marginTop: 0}} />
              <button onClick={() => { if(inputText) { setMessages([...messages, {id: Date.now(), text: inputText, sender: 'user'}]); setInputText(""); } }} style={{ background: '#6366f1', padding: '1rem 2rem', borderRadius: '1rem', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>إرسال</button>
            </div>
          </div>
        );

      case 'ديوان المناقشة':
        if (!agreedToCharter) {
          return (
            <div style={styles.charterBox}>
              <h2 style={{ color: '#38bdf8', marginBottom: '1.5rem' }}>ميثاق الالتزام القانوني - ديوان النخبة</h2>
              <div style={{ textAlign: 'right', display: 'inline-block', margin: '0 auto 2rem auto', lineHeight: '1.8', color: '#cbd5e1' }}>
                <p>1. الالتزام بالسرية التامة وعدم ذكر أسماء حقيقية للمتقاضين.</p>
                <p>2. الحفاظ على وقار المهنة في النقاشات الأكاديمية.</p>
                <p>3. الغرفة تخضع لرقابة "البوت المراقب" لحظر أي تجاوزات لفظية.</p>
                <p>4. الحد الأقصى لكل غرفة هو 20 عضواً لضمان جودة التداول.</p>
              </div>
              <button onClick={() => setAgreedToCharter(true)} style={{ width: '100%', background: '#38bdf8', color: '#000', padding: '1.2rem', borderRadius: '1rem', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>أوافق وألتزم بالميثاق</button>
            </div>
          );
        }
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: '#38bdf8' }}>غرفة تداول النخبة (تحت رقابة البوت)</h3>
              <button onClick={() => setAgreedToCharter(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>الميثاق</button>
            </div>
            <div style={styles.chatBox}>
              {chatMessages.map(m => (
                <div key={m.id} style={{ alignSelf: m.sender === 'bot' ? 'center' : 'flex-end', background: m.sender === 'bot' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '1rem', border: m.sender === 'bot' ? '1px solid #ef4444' : '1px solid #38bdf8', maxWidth: '85%' }}>
                  {m.sender === 'member' && <small style={{ color: '#38bdf8', display: 'block', marginBottom: '5px' }}>{m.memberName}</small>}
                  <span style={{ color: m.sender === 'bot' ? '#ef4444' : '#fff' }}>{m.text}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="اكتب مساهمتك القانونية..." style={{...styles.inputStyle, marginTop: 0}} />
              <button onClick={handleChatSend} style={{ background: '#38bdf8', padding: '0 2rem', borderRadius: '1rem', border: 'none', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>إرسال</button>
            </div>
          </div>
        );

      case 'صياغة العقود':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#fbbf24', textAlign: 'center', marginBottom: '2rem' }}>منصة صياغة العقود والضمان الاجتماعي</h2>
            {contractStep === 1 && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #fbbf2444' }}>
                {contractType === 'URFI' && (
                  <div style={{ color: '#ff4d4d', background: 'rgba(255, 77, 77, 0.1)', padding: '1rem', borderRadius: '1rem', marginBottom: '1.5rem', border: '1px solid #ff4d4d', textAlign: 'center', fontWeight: 'bold' }}>
                    ملاحظة: هذا العقد يستوجب تصديقه في بلدية من أجل أعطائه تاريخا ثابتا
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
                  <button onClick={() => setContractType('CDI')} style={{ flex: 1, padding: '1rem', borderRadius: '0.8rem', border: 'none', background: contractType === 'CDI' ? '#fbbf24' : '#333', color: contractType === 'CDI' ? '#000' : '#fff', cursor: 'pointer', fontWeight: 'bold' }}>CDI</button>
                  <button onClick={() => setContractType('CDD')} style={{ flex: 1, padding: '1rem', borderRadius: '0.8rem', border: 'none', background: contractType === 'CDD' ? '#fbbf24' : '#333', color: contractType === 'CDD' ? '#000' : '#fff', cursor: 'pointer', fontWeight: 'bold' }}>CDD</button>
                  <button onClick={() => setContractType('URFI')} style={{ flex: 1, padding: '1rem', borderRadius: '0.8rem', border: 'none', background: contractType === 'URFI' ? '#fbbf24' : '#333', color: contractType === 'URFI' ? '#000' : '#fff', cursor: 'pointer', fontWeight: 'bold' }}>عقود عرفية</button>
                </div>
                {contractType === 'URFI' && (
                  <select value={urfiType} onChange={(e) => setUrfiType(e.target.value as any)} style={{...styles.inputStyle, marginBottom: '1.5rem'}}>
                    <option value="rent">عقد إيجار أماكن مخصصة للسكن</option>
                    <option value="sale">بيع المنقولات العادية</option>
                    <option value="maintenance">عقود المقاولة والصيانة</option>
                  </select>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <input placeholder="الطرف الأول / المستخدم" style={styles.inputStyle} onChange={e => setContractData({...contractData, employer: e.target.value, partyA: e.target.value})} />
                  <input placeholder="الطرف الثاني / العامل" style={styles.inputStyle} onChange={e => setContractData({...contractData, employee: e.target.value, partyB: e.target.value})} />
                  <input placeholder="الموضوع / الوظيفة" style={styles.inputStyle} onChange={e => setContractData({...contractData, position: e.target.value, itemDescription: e.target.value})} />
                  <input type="date" style={styles.inputStyle} onChange={e => setContractData({...contractData, startDate: e.target.value})} />
                </div>
                <button onClick={() => setContractStep(2)} style={{ width: '100%', background: '#fbbf24', color: '#000', fontWeight: 'bold', padding: '1.2rem', borderRadius: '1rem', border: 'none', marginTop: '2rem', cursor: 'pointer' }}>التالي (CNAS)</button>
              </div>
            )}
            {contractStep === 2 && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #2dd4bf44' }}>
                <h3 style={{ color: '#2dd4bf', marginBottom: '1.5rem' }}>المرحلة 2: بيانات الضمان الاجتماعي</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <input placeholder="رقم الضمان الاجتماعي" style={styles.inputStyle} onChange={e => setCnasData({...cnasData, ssNumber: e.target.value})} />
                  <input placeholder="مكان الميلاد" style={styles.inputStyle} onChange={e => setCnasData({...cnasData, birthPlace: e.target.value})} />
                  <input type="date" style={styles.inputStyle} onChange={e => setCnasData({...cnasData, birthDate: e.target.value})} />
                  <input placeholder="عنوان السكن" style={styles.inputStyle} onChange={e => setCnasData({...cnasData, address: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
                  <button onClick={() => setContractStep(1)} style={{ flex: 1, padding: '1.2rem', borderRadius: '1rem', border: 'none', background: '#444', color: '#fff', cursor: 'pointer' }}>رجوع</button>
                  <button onClick={() => setContractStep(3)} style={{ flex: 2, padding: '1.2rem', borderRadius: '1rem', border: 'none', background: '#2dd4bf', color: '#000', fontWeight: 'bold', cursor: 'pointer' }}>معاينة وتوليد الملف</button>
                </div>
              </div>
            )}
            {contractStep === 3 && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ background: '#fff', color: '#1a1a1a', padding: '2rem', borderRadius: '0.5rem', marginBottom: '2rem', textAlign: 'right' }}>
                   <h3 style={{ textAlign: 'center', textDecoration: 'underline' }}>{contractType === 'URFI' ? 'نموذج عقد عرفي' : `عقد عمل ${contractType}`}</h3>
                   <p><b>الطرف الأول:</b> {contractData.employer || contractData.partyA}</p>
                   <p><b>الطرف الثاني:</b> {contractData.employee || contractData.partyB}</p>
                   {contractType === 'URFI' && <p style={{ color: 'red' }}>* ملاحظة: يستوجب التصديق في البلدية.</p>}
                </div>
                <button onClick={downloadContract} style={{ width: '100%', background: '#fbbf24', color: '#000', fontWeight: 'bold', padding: '1.5rem', borderRadius: '1rem', border: 'none', cursor: 'pointer' }}>تحميل بصيغة Word</button>
              </div>
            )}
          </div>
        );

      case 'الإجراءات القانونية':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#10b981', textAlign: 'center', marginBottom: '2rem' }}>حاسبة آجال الطعون (تخطي الجمعة والسبت)</h2>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '2.5rem', borderRadius: '2rem', border: '1px solid #10b98155' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <input type="date" value={judgmentDate} onChange={(e) => setJudgmentDate(e.target.value)} style={styles.inputStyle} />
                <select value={judgmentType} onChange={(e) => setJudgmentType(e.target.value)} style={styles.inputStyle}>
                  <option value="civil_appeal">استئناف مدني (30 يوم)</option>
                  <option value="admin_appeal">استئناف إداري (60 يوم)</option>
                  <option value="opposition">معارضة (10 أيام)</option>
                  <option value="cassation">طعن بالنقض (60 يوم)</option>
                </select>
              </div>
              <button onClick={calculateDeadline} style={{ width: '100%', background: '#10b981', color: '#000', fontWeight: 'bold', padding: '1.2rem', borderRadius: '1rem', border: 'none', marginTop: '2rem', cursor: 'pointer' }}>حساب الموعد النهائي بدقة</button>
              {deadlineResult && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '1rem', textAlign: 'center', border: '1px dashed #10b981' }}>
                  آخر أجل قانوني هو: <br/> <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.5rem' }}>{deadlineResult}</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'الرادار القانوني':
        return (
          <div style={{ animation: 'fadeIn 0.5s', textAlign: 'center' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '2rem' }}>الرادار القانوني - تحديثات 2026</h2>
            <div style={{ padding: '4rem', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '2rem' }}>
              <p>... جاري فحص الجريدة الرسمية والمستجدات التشريعية لعام 2026 ...</p>
            </div>
          </div>
        );

      case 'البحث العلمي':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#f87171', textAlign: 'center', marginBottom: '1.5rem' }}>محرك البحث الأكاديمي القانوني</h2>
            <textarea placeholder="أدخل إشكالية البحث هنا لتوليد مذكرة بحثية..." style={{...styles.inputStyle, minHeight: '200px'}} />
            <button style={{ width: '100%', background: '#f87171', color: '#fff', fontWeight: 'bold', padding: '1.2rem', borderRadius: '1rem', border: 'none', marginTop: '1rem' }}>توليد مذكرة البحث بصيغة Word</button>
          </div>
        );

      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { t: 'استشارة قانونية', c: '#6366f1', i: '⚖️' },
              { t: 'ديوان المناقشة', c: '#38bdf8', i: '💬' },
              { t: 'صياغة العقود', c: '#fbbf24', i: '📝' },
              { t: 'الإجراءات القانونية', c: '#10b981', i: '📅' },
              { t: 'الرادار القانوني', c: '#38bdf8', i: '📡' },
              { t: 'البحث العلمي', c: '#f87171', i: '🎓' }
            ].map((s, i) => (
              <div key={i} onClick={() =>
  setCurrentSection(s.t as Section)} style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius:1.5rem', padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.08)', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{s.i}</div>
                <h3 style={{ color: s.c }}>{s.t}</h3>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glowLeft}></div><div style={styles.glowRight}></div>
      <div style={styles.mainGlassCard}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>المنصة القانونية الذكية 2026</div>
          {currentSection !== 'main' && <button onClick={() => {setCurrentSection('main'); setContractStep(1);}} style={{ background: 'transparent', border: '1px solid #d97706', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '0.8rem', cursor: 'pointer' }}>الرئيسية</button>}
        </nav>
        {renderContent()}
        <footer style={{ marginTop: '4rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>جميع الحقوق محفوظة - تشفير</p>
        </footer>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

export default App;
