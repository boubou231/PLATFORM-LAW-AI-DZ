import React, { useState } from 'react';

type Section = 'main' | 'استشارة قانونية' | 'صياغة العقود' | 'تحليل الوثائق' | 'الرادار القانوني' | 'البحث العلمي' | 'المصادر والمراجع' | 'تسجيل الدخول';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const styles = {
    container: { 
      minHeight: '100vh', background: 'radial-gradient(circle at 10% 20%, #1a1b2e 0%, #020617 100%)',
      fontFamily: "'Amiri', serif, sans-serif", direction: 'rtl' as const, color: '#f8fafc', padding: '1.5rem'
    },
    philosophyFrame: {
      margin: '0 auto 4rem auto', padding: '2rem', maxWidth: '900px',
      borderRadius: '2rem', border: '2px solid rgba(255, 255, 255, 0.1)',
      background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
      boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)', textAlign: 'center' as const,
      animation: 'glowPulse 3s infinite ease-in-out'
    },
    glassWrapper: {
      maxWidth: '1200px', margin: '0 auto', background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(30px)', borderRadius: '3rem', border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '3rem', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', position: 'relative' as const
    },
    inputStyle: {
      width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.05)', 
      border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', marginTop: '1rem', outline: 'none'
    }
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'تسجيل الدخول':
        return (
          <div style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
            <h2 style={{ marginBottom: '2rem' }}>مرحباً بك في بوابتك القانونية</h2>
            <input placeholder="البريد الإلكتروني أو اسم المستخدم" style={styles.inputStyle} />
            <input type="password" placeholder="كلمة المرور" style={styles.inputStyle} />
            <button onClick={() => { setIsLoggedIn(true); setCurrentSection('main'); }} style={{ width: '100%', background: 'linear-gradient(90deg, #6366f1, #4f46e5)', border: 'none', padding: '1.2rem', borderRadius: '1rem', color: '#fff', fontWeight: 'bold', marginTop: '1.5rem', cursor: 'pointer' }}>تسجيل الدخول</button>
            <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', opacity: 0.7 }}>ليس لديك حساب؟ <span style={{ color: '#6366f1', cursor: 'pointer' }}>إنشاء حساب جديد</span></p>
          </div>
        );

      case 'استشارة قانونية':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#818cf8', marginBottom: '1.5rem' }}>مركز الاستشارة القانونية الفورية ⚖️</h2>
            <div style={{ height: '300px', background: 'rgba(0,0,0,0.2)', borderRadius: '1.5rem', padding: '1.5rem', overflowY: 'auto', border: '1px solid #334155' }}>
              <div style={{ background: '#312e81', padding: '1rem', borderRadius: '1rem', maxWidth: '80%', marginBottom: '1rem' }}>مرحباً بك. أنا مستشارك القانوني الذكي، كيف يمكنني مساعدتك اليوم؟</div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <input type="file" id="upload-img" hidden accept="image/*" />
              <label htmlFor="upload-img" style={{ cursor: 'pointer', background: '#475569', padding: '0.8rem 1.5rem', borderRadius: '1rem' }}>📸 رفع صورة</label>
              <input placeholder="اكتب سؤالك القانوني هنا..." style={{ ...styles.inputStyle, flex: 1, marginTop: 0 }} />
              <button style={{ background: '#6366f1', padding: '1rem 2rem', borderRadius: '1rem', border: 'none', color: '#fff', fontWeight: 'bold' }}>إرسال</button>
            </div>
          </div>
        );

      case 'تحليل الوثائق':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '1.5rem' }}>مختبر تحليل الوثائق والملفات 🔍</h2>
            <div style={{ border: '2px dashed rgba(255,255,255,0.2)', padding: '3rem', textAlign: 'center', borderRadius: '2rem' }}>
              <input type="file" multiple style={{ marginBottom: '1rem' }} />
              <p>رفع عدة صور، ملفات PDF، أو وثائق قانونية للتحليل الشامل</p>
            </div>
            <textarea placeholder="أضف ملاحظاتك أو سياق الوثائق المرفوعة..." style={{ ...styles.inputStyle, minHeight: '120px' }} />
            <button style={{ width: '100%', background: '#0284c7', padding: '1.2rem', borderRadius: '1rem', border: 'none', color: '#fff', marginTop: '1.5rem', fontWeight: 'bold' }}>بدء المعالجة الاستخباراتية</button>
          </div>
        );

      case 'البحث العلمي':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#f87171', marginBottom: '1.5rem' }}>محرك البحث العلمي القانوني 🎓</h2>
            <input placeholder="أدخل موضوع البحث القانوني..." style={styles.inputStyle} />
            <button onClick={() => window.open('https://www.google.com', '_blank')} style={{ width: '100%', background: '#064e3b', color: '#fff', padding: '1.2rem', borderRadius: '1rem', border: 'none', cursor: 'pointer', marginTop: '1.5rem' }}>تحميل البحث بصيغة Word (يفتح في نافذة جديدة) 📄</button>
          </div>
        );

      case 'صياغة العقود':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#fbbf24', textAlign: 'center', marginBottom: '2rem' }}>صياغة العقود الذكية 📝</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
               {['عقد بيع منقول', 'عقد إيجار عرفي', 'وكالة خاصة', 'إقرار بدين'].map(c => (
                 <div key={c} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)' }}>{c}</div>
               ))}
            </div>
            <textarea placeholder="أدخل تفاصيل العقد..." style={{ ...styles.inputStyle, minHeight: '150px' }} />
            <button style={{ width: '100%', background: '#b45309', padding: '1.2rem', borderRadius: '1rem', border: 'none', color: '#fff', marginTop: '1rem', fontWeight: 'bold' }}>توليد العقد العرفي المحدث 2026</button>
          </div>
        );

      case 'المصادر والمراجع':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#2dd4bf', marginBottom: '2rem' }}>المراجع والمؤسسات السيادية 🏛️</h2>
            {[
              { n: "الجريدة الرسمية للجمهورية الجزائرية", u: "https://www.joradp.dz" },
              { n: "البوابة الجزائرية للمجلات العلمية ASJP", u: "https://asjp.cerist.dz" },
              { n: "رئاسة الجمهورية الجزائرية", u: "https://www.el-mouradia.dz" },
              { n: "المحكمة الدستورية", u: "https://www.cour-constitutionnelle.dz" }
            ].map(link => (
              <a key={link.n} href={link.u} target="_blank" rel="noreferrer" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', marginBottom: '0.8rem', textDecoration: 'none', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span>🏛️ {link.n}</span>
                <span style={{ fontSize: '0.8rem', color: '#2dd4bf' }}>زيارة الرابط ←</span>
              </a>
            ))}
          </div>
        );

      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
             {['استشارة قانونية', 'تحليل الوثائق', 'صياغة العقود', 'البحث العلمي', 'الرادار القانوني', 'المصادر والمراجع'].map((title, i) => (
              <div key={i} onClick={() => setCurrentSection(title as Section)} style={{ background: 'rgba(255,255,255,0.05)', padding: '2.5rem', borderRadius: '2rem', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)', transition: '0.3s' }}>
                <h3 style={{ fontSize: '1.5rem' }}>{title}</h3>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.philosophyFrame}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, background: 'linear-gradient(to right, #fff, #94a3b8, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          "العدالة في عصر الرقمنة.. أصالة النص، وسرعة النبض"
        </h1>
      </div>

      <div style={styles.glassWrapper}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>🇩🇿 المنصة القانونية الذكية</div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {currentSection !== 'main' && <button onClick={() => setCurrentSection('main')} style={{ background: 'transparent', border: '1px solid #d97706', padding: '0.6rem 1.5rem', color: '#fff', borderRadius: '1rem', cursor: 'pointer' }}>الرئيسية</button>}
            
            {!isLoggedIn ? (
              <button onClick={() => setCurrentSection('تسجيل الدخول')} style={{ background: '#6366f1', border: 'none', padding: '0.6rem 1.5rem', color: '#fff', borderRadius: '1rem', cursor: 'pointer', fontWeight: 'bold' }}>دخول / تسجيل</button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.9rem' }}>مرحباً، هشام 👋</span>
                <button onClick={() => setIsLoggedIn(false)} style={{ background: 'rgba(255,0,0,0.2)', border: 'none', padding: '0.4rem 1rem', color: '#ff4444', borderRadius: '0.8rem', cursor: 'pointer' }}>خروج</button>
              </div>
            )}
          </div>
        </nav>

        {renderContent()}

        <footer style={{ marginTop: '4rem', padding: '2rem', background: 'rgba(0,0,0,0.3)', borderRadius: '2rem', textAlign: 'center', fontSize: '0.85rem' }}>
          <div style={{ color: '#34d399', marginBottom: '1rem' }}>
            🛡️ حماية البيانات الشخصية: تخضع هذه المنصة وتلتزم ببنود القانون رقم 18-07 المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي. نحن نضمن تشفير وحماية بياناتكم وفق المعايير السيادية الجزائرية لعام 2026، ولا يتم تخزين المعطيات الشخصية أو مشاركتها إلا في الإطار الذي يخدم استشارتكم وبموافقتكم الصريحة.
          </div>
          <div style={{ opacity: 0.6 }}>جميع الحقوق محفوظة © 2026</div>
        </footer>
      </div>

      <style>{`
        @keyframes glowPulse { 0% { border-color: rgba(99,102,241,0.2); } 50% { border-color: rgba(99,102,241,0.5); } 100% { border-color: rgba(99,102,241,0.2); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;
                                                                                                                                                                                                                                                                                                     
