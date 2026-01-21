import React, { useState } from 'react';

type Section = 'main' | 'استشارة قانونية' | 'صياغة العقود' | 'تحليل الوثائق' | 'الرادار القانوني' | 'البحث العلمي' | 'المصادر والمراجع' | 'تسجيل الدخول';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const styles = {
    container: { 
      minHeight: '100vh', background: '#0a0a1a',
      fontFamily: "'Amiri', serif", direction: 'rtl' as const, color: '#f8fafc', padding: '1rem',
      position: 'relative' as const, overflowX: 'hidden' as const
    },
    // التوهج الجانبي كما في الصور
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
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' },
    card: {
      background: 'rgba(255, 255, 255, 0.04)', borderRadius: '1.5rem', padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.08)', cursor: 'pointer', transition: '0.3s',
      textAlign: 'center' as const, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '1rem'
    },
    iconCircle: {
      width: '65px', height: '65px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', background: 'rgba(255,255,255,0.05)'
    },
    footerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem' }
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'استشارة قانونية':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#818cf8', marginBottom: '1.5rem' }}>مركز الاستشارة القانونية الذكية ⚖️</h2>
            <div style={{ height: '300px', background: 'rgba(0,0,0,0.3)', borderRadius: '1.5rem', padding: '1.5rem', overflowY: 'auto', border: '1px solid #334155' }}>
               <div style={{ background: '#312e81', padding: '1rem', borderRadius: '1rem', maxWidth: '80%' }}>أنا مستشارك الذكي، ارفع صورة وثيقتك أو اطرح سؤالك القانوني الآن.</div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
              <label style={{ background: '#475569', padding: '1rem', borderRadius: '1rem', cursor: 'pointer' }}>📸 <input type="file" hidden accept="image/*" /></label>
              <input placeholder="اكتب سؤالك هنا..." style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '0 1rem', color: '#fff' }} />
              <button style={{ background: '#6366f1', border: 'none', padding: '0 2rem', borderRadius: '1rem', color: '#fff', fontWeight: 'bold' }}>إرسال</button>
            </div>
          </div>
        );

      case 'تحليل الوثائق':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#2dd4bf', marginBottom: '1.5rem' }}>مختبر تحليل الوثائق والملفات 🔍</h2>
            <div style={{ border: '2px dashed rgba(255,255,255,0.1)', padding: '3rem', textAlign: 'center', borderRadius: '2rem' }}>
              <input type="file" multiple style={{ marginBottom: '1rem' }} />
              <p>يمكنك رفع عدة ملفات PDF أو صور للتحليل الفوري بمطابقة JORADP.</p>
            </div>
            <button style={{ width: '100%', background: '#0284c7', padding: '1rem', borderRadius: '1rem', border: 'none', color: '#fff', marginTop: '1rem', fontWeight: 'bold' }}>بدء التحليل</button>
          </div>
        );

      case 'الرادار القانوني':
        return (
          <div style={{ animation: 'fadeIn 0.5s', textAlign: 'center' }}>
            <h2 style={{ color: '#fbbf24', marginBottom: '2rem' }}>الرادار القانوني النشط 📡</h2>
            <div style={{ padding: '3rem', background: 'rgba(0,0,0,0.2)', borderRadius: '2rem', border: '1px solid rgba(251, 191, 36, 0.3)' }}>
               <div style={{ fontSize: '3rem', animation: 'spin 4s linear infinite' }}>📡</div>
               <p style={{ marginTop: '1.5rem' }}>جاري مطابقة المدخلات مع آخر مستجدات الجريدة الرسمية 2026...</p>
            </div>
          </div>
        );

      case 'المصادر والمراجع':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#2dd4bf', marginBottom: '2rem' }}>دليل المصادر والروابط السيادية 🏛️</h2>
            {[
              { n: "الجريدة الرسمية الجزائرية (JORADP)", u: "https://www.joradp.dz" },
              { n: "المجلات العلمية (ASJP)", u: "https://asjp.cerist.dz" },
              { n: "رئاسة الجمهورية", u: "https://www.el-mouradia.dz" },
              { n: "المحكمة الدستورية", u: "https://www.cour-constitutionnelle.dz" },
              { n: "وزارة العدل", u: "https://www.mjustice.dz" }
            ].map(link => (
              <a key={link.n} href={link.u} target="_blank" rel="noreferrer" style={{ display: 'flex', justifyContent: 'space-between', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', marginBottom: '0.8rem', textDecoration: 'none', color: '#fff', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span>🏛️ {link.n}</span>
                <span style={{ fontSize: '0.8rem', color: '#2dd4bf' }}>زيارة ←</span>
              </a>
            ))}
          </div>
        );

      default:
        return (
          <div style={styles.grid}>
            {[
              { t: 'استشارة قانونية', i: '⚖️', d: 'إجابات دقيقة مع مراجعة مستجدات آخر 10 أيام.', c: '#6366f1' },
              { t: 'تحليل الوثائق', i: '🔍', d: 'تحليل ذكي للعقود والصور بمطابقة JORADP.', c: '#2dd4bf' },
              { t: 'صياغة العقود', i: '📝', d: 'نماذج عرفية ورسمية محدثة لعام 2026.', c: '#fbbf24' },
              { t: 'البحث العلمي', i: '🎓', d: 'بحوث أكاديمية تلتزم بأمانة التهميش.', c: '#f87171' },
              { t: 'الرادار القانوني', i: '📡', d: 'تمشيط آلي لآخر المستجدات وتصنيفها.', c: '#38bdf8' },
              { t: 'المصادر والمراجع', i: '📚', d: 'قائمة المصادر السيادية والمجلات الجزائرية.', c: '#a78bfa' }
            ].map((s, i) => (
              <div key={i} onClick={() => setCurrentSection(s.t as Section)} style={styles.card}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = s.c}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                <div style={{ ...styles.iconCircle, color: s.c, boxShadow: `0 0 15px ${s.c}33` }}>{s.i}</div>
                <h3 style={{ fontSize: '1.4rem' }}>{s.t}</h3>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{s.d}</p>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glowLeft}></div>
      <div style={styles.glowRight}></div>

      <div style={styles.philosophyFrame}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', letterSpacing: '1px' }}>
          "العدالة في عصر الرقمنة.. أصالة النص، وسرعة النبض"
        </h1>
      </div>

      <div style={styles.mainGlassCard}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             <span style={{ background: '#6366f1', padding: '0.5rem 1rem', borderRadius: '0.8rem', fontSize: '0.8rem', fontWeight: 'bold' }}>دخول / تسجيل</span>
             <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>hichembenzerouk3@gmail.com ✉️</span>
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>🇩🇿 المنصة القانونية الذكية</div>
          {currentSection !== 'main' && <button onClick={() => setCurrentSection('main')} style={{ background: 'transparent', border: '1px solid #d97706', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.8rem', cursor: 'pointer' }}>الرئيسية</button>}
        </nav>

        {renderContent()}

        <div style={styles.footerGrid}>
           <div style={{ background: 'rgba(20, 184, 166, 0.1)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(20, 184, 166, 0.2)' }}>
              <h4 style={{ color: '#2dd4bf', marginBottom: '0.5rem' }}>🛡️ الحماية الرقمية</h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>تخضع المنصة للقانون 18-07 المتعلق بحماية المعطيات الشخصية. تشفير سيادي كامل لعام 2026.</p>
           </div>
           <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>⚠️ إخلاء مسؤولية</h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>المخرجات إرشادية وتوليد آلي بناءً على النصوص الرسمية، لا تعوض الاستشارة المهنية للمحامي.</p>
           </div>
        </div>
        
        <div style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.4, fontSize: '0.75rem' }}>
          جميع الحقوق محفوظة © 2026 | مطابقة حية مع الجريدة الرسمية [cite: 2026-01-19]
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default App;
                        
