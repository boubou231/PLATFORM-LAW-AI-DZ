import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';

type Section = 'main' | 'استشارة قانونية' | 'ديوان المناقشة' | 'صياغة العقود' | 'الإجراءات القانونية' | 'الرادار القانوني' | 'البحث العلمي';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai' | 'member' | 'bot';
  memberName?: string;
  rank?: string;
}

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('main');
  const [judgmentDate, setJudgmentDate] = useState("");
  const [judgmentType, setJudgmentType] = useState("civil_appeal");
  const [deadlineResult, setDeadlineResult] = useState<string | null>(null);
  const [contractStep, setContractStep] = useState<1 | 2 | 3>(1);
  const [contractType, setContractType] = useState<'CDD' | 'CDI' | 'URFI'>('CDI');
  const [contractData, setContractData] = useState({
    employer: "", employee: "", position: "", startDate: "", partyA: "", partyB: "", itemDescription: ""
  });
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "مرحباً بك في المنصة القانونية الذكية. تم تحديث الأنظمة لتتوافق مع الجريدة الرسمية 2026 وقانون العمل المعدل", sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState("");
  const [agreedToCharter, setAgreedToCharter] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const forbiddenWords = ["سب", "قذف", "اهانة", "رشوة", "شتم"];

  const styles = {
    container: { minHeight: '100vh', background: '#0a0a1a', fontFamily: "'Amiri', serif", direction: 'rtl' as const, color: '#f8fafc', padding: '1rem', position: 'relative' as const, overflowX: 'hidden' as const },
    glowLeft: { position: 'absolute' as const, top: '20%', left: '-10%', width: '400px', height: '400px', background: 'rgba(45, 212, 191, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 },
    glowRight: { position: 'absolute' as const, bottom: '10%', right: '-5%', width: '350px', height: '350px', background: 'rgba(139, 92, 246, 0.15)', filter: 'blur(100px)', borderRadius: '50%', zIndex: 0 },
    mainGlassCard: { maxWidth: '1100px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', borderRadius: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '2.5rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', zIndex: 2, position: 'relative' as const },
    inputStyle: { width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', marginTop: '0.5rem' },
    chatBox: { height: '400px', overflowY: 'auto' as const, padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '1.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column' as const, gap: '1rem', border: '1px solid rgba(255,255,255,0.05)' },
    bubbleAi: { alignSelf: 'flex-start' as const, background: 'rgba(99, 102, 241, 0.15)', padding: '1rem', borderRadius: '0 1.5rem 1.5rem 1.5rem', maxWidth: '80%', border: '1px solid rgba(99, 102, 241, 0.3)' },
    bubbleUser: { alignSelf: 'flex-end' as const, background: 'rgba(45, 212, 191, 0.15)', padding: '1rem', borderRadius: '1.5rem 0 1.5rem 1.5rem', maxWidth: '80%', border: '1px solid rgba(45, 212, 191, 0.3)' },
    charterBox: { background: 'rgba(56, 189, 248, 0.05)', border: '1px solid #38bdf8', padding: '2rem', borderRadius: '1.5rem', textAlign: 'center' as const }
  };

  const calculateDeadline = () => {
    if (!judgmentDate) return;
    let date = new Date(judgmentDate);
    let daysToAdd = judgmentType === 'admin_appeal' ? 60 : (judgmentType === 'opposition' ? 10 : 30);
    let addedDays = 0;
    while (addedDays < daysToAdd) {
      date.setDate(date.getDate() + 1);
      if (date.getDay() !== 5 && date.getDay() !== 6) addedDays++;
    }
    setDeadlineResult(date.toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }));
  };

  const downloadContract = async () => {
    const isUrfi = contractType === 'URFI';
    const docTitle = isUrfi ? "عقد عرفي" : `عقد عمل - ${contractType}`;
    const doc = new Document({
      sections: [{
        properties: { textDirection: "right-to-left" as any },
        children: [
          new Paragraph({ text: docTitle, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
          new Paragraph({
            children: [
              new TextRun({ text: `الطرف الأول: ${isUrfi ? contractData.partyA : contractData.employer}`, bold: true }),
              new TextRun({ text: `\nالطرف الثاني: ${isUrfi ? contractData.partyB : contractData.employee}`, bold: true }),
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
      setChatMessages([...chatMessages, { id: Date.now(), text: "تنبيه من البوت المراقب: تم حجب الرسالة لمخالفتها ميثاق الالتزام", sender: 'bot' }]);
    } else {
      setChatMessages([...chatMessages, { id: Date.now(), text: chatInput, sender: 'member', memberName: "الأستاذ المتدرب", rank: "عضو مشارك" }]);
    }
    setChatInput("");
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'استشارة قانونية':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={{ background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24', color: '#fbbf24', padding: '1.5rem', borderRadius: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              إخلاء مسؤولية: كافة الاستشارات المقدمة هنا هي لأغراض تعليمية وتدريبية فقط.
            </div>
            <div style={styles.chatBox}>
              {messages.map(m => (<div key={m.id} style={m.sender === 'ai' ? styles.bubbleAi : styles.bubbleUser}>{m.text}</div>))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input value={inputText} onChange={e => setInputText(e.target.value)} placeholder="اشرح الإشكالية..." style={{ ...styles.inputStyle, marginTop: 0 }} />
              <button onClick={() => { if (inputText) { setMessages([...messages, { id: Date.now(), text: inputText, sender: 'user' }]); setInputText(""); } }} style={{ background: '#6366f1', padding: '1rem 2rem', borderRadius: '1rem', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>إرسال</button>
            </div>
          </div>
        );
      case 'ديوان المناقشة':
        if (!agreedToCharter) {
          return (
            <div style={styles.charterBox}>
              <h2 style={{ color: '#38bdf8' }}>ميثاق الالتزام القانوني - ديوان النخبة</h2>
              <p>الالتزام بالسرية التامة وعدم ذكر أسماء حقيقية.</p>
              <button onClick={() => setAgreedToCharter(true)} style={{ background: '#38bdf8', padding: '1rem', borderRadius: '1rem', border: 'none', fontWeight: 'bold' }}>أوافق والتزم بالميثاق</button>
            </div>
          );
        }
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <div style={styles.chatBox}>
              {chatMessages.map(m => (
                <div key={m.id} style={{ alignSelf: 'flex-end', background: 'rgba(56, 189, 248, 0.1)', padding: '1rem', borderRadius: '1rem', border: '1px solid #38bdf8' }}>
                  <small style={{ color: '#38bdf8', display: 'block' }}>{m.memberName}</small>
                  <span>{m.text}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input value={chatInput} onChange={e => setChatInput(e.target.value)} style={styles.inputStyle} />
              <button onClick={handleChatSend} style={{ background: '#38bdf8', padding: '0 2rem', borderRadius: '1rem', border: 'none' }}>إرسال</button>
            </div>
          </div>
        );
      case 'صياغة العقود':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#fbbf24', textAlign: 'center' }}>منصة صياغة العقود</h2>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid #fbbf2444' }}>
              <input placeholder="الطرف الأول" style={styles.inputStyle} onChange={e => setContractData({ ...contractData, employer: e.target.value, partyA: e.target.value })} />
              <input placeholder="الطرف الثاني" style={styles.inputStyle} onChange={e => setContractData({ ...contractData, employee: e.target.value, partyB: e.target.value })} />
              <button onClick={downloadContract} style={{ width: '100%', background: '#fbbf24', color: '#000', fontWeight: 'bold', padding: '1.2rem', borderRadius: '1rem', border: 'none', marginTop: '2rem' }}>تحميل بصيغة Word</button>
            </div>
          </div>
        );
      case 'الإجراءات القانونية':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#10b981', textAlign: 'center' }}>حاسبة أجال الطعون</h2>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '2.5rem', borderRadius: '2rem', border: '1px solid #10b98155' }}>
              <input type="date" value={judgmentDate} onChange={(e) => setJudgmentDate(e.target.value)} style={styles.inputStyle} />
              <button onClick={calculateDeadline} style={{ width: '100%', background: '#10b981', color: '#000', fontWeight: 'bold', padding: '1.2rem', borderRadius: '1rem', border: 'none', marginTop: '1rem' }}>حساب الموعد</button>
              {deadlineResult && <div style={{ marginTop: '1rem', textAlign: 'center' }}>آخر أجل قانوني: {deadlineResult}</div>}
            </div>
          </div>
        );
      case 'الرادار القانوني':
        return <div style={{ textAlign: 'center' }}><h2>الرادار القانوني 2026</h2><p>جاري فحص الجريدة الرسمية والمستجدات التشريعية...</p></div>;
      case 'البحث العلمي':
        return <div style={{ textAlign: 'center' }}><h2>محرك البحث الأكاديمي</h2><textarea placeholder="أدخل إشكالية البحث..." style={styles.inputStyle} /></div>;
      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {['استشارة قانونية', 'ديوان المناقشة', 'صياغة العقود', 'الإجراءات القانونية', 'الرادار القانوني', 'البحث العلمي'].map((t, i) => (
              <div key={i} onClick={() => setCurrentSection(t as Section)} style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '1.5rem', padding: '2.5rem', border: '1px solid rgba(255, 255, 255, 0.08)', cursor: 'pointer', textAlign: 'center' }}>
                <h3>{t}</h3>
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
          <div style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>2026 المنصة القانونية الذكية</div>
          {currentSection !== 'main' && <button onClick={() => setCurrentSection('main')} style={{ background: 'transparent', border: '1px solid #d97706', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '0.8rem' }}>الرئيسية</button>}
        </nav>
        {renderContent()}
        <footer style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.5 }}>
          <p>2026 جميع الحقوق محفوظة - تشفير سيادي</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
      
