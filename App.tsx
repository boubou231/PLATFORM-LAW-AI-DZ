import React, { useState } from 'react';

type Section = 'main' | 'استشارة قانونية' | 'صياغة العقود' | 'تحليل الوثائق' | 'الرادار القانوني' | 'البحث العلمي' | 'المصادر والمراجع' | 'تسجيل الدخول';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

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
    inputStyle: { width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', marginTop: '1rem' }
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'الرادار القانوني':
        return (
          <div style={{ animation: 'fadeIn 0.5s', textAlign: 'center' }}>
            <h2 style={{ color: '#38bdf8', marginBottom: '2rem' }}>الرادار القانوني النشط 📡</h2>
            <div style={{ padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '2rem', border: '1px solid #38bdf855', marginBottom: '3rem' }}>
               <div style={{ fontSize: '3rem', animation: 'spin 4s linear infinite' }}>📡</div>
               <p style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>جاري مطابقة المدخلات مع آخر مستجدات الجريدة الرسمية 2026</p>
            </div>

            {/* قسم مخرجات الذكاء الاصطناعي الـ 5 المضافة حديثاً */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} style={{ 
                  background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(56, 189, 248, 0.3)', 
                  padding: '1.5rem', borderRadius: '1.5rem', textAlign: 'right' as const,
                  transition: '0.3s'
                }}>
                  <div style={{ color: '#38bdf8', fontSize: '1.2rem', marginBottom: '1rem' }}>🤖 مستجد رقم {item}</div>
                  <div style={{ height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', padding: '0.5rem', color: '#94a3b8' }}>بانتظار تحليل الذكاء الاصطناعي لملخص الجريدة الرسمية...</p>
                  </div>
                  <button style={{ 
                    width: '100%', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', 
                    color: '#38bdf8', padding: '0.5rem', borderRadius: '0.8rem', cursor: 'pointer', fontSize: '0.8rem' 
                  }}>
                    تحميل PDF 📄
                  </button>
                </div>
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
            <input type="email" placeholder="📧 البريد الإلكتروني" style={styles.inputStyle} />
            <input type="password" placeholder="🔑 كلمة المرور" style={styles.inputStyle} />
            {authMode === 'signup' && <input type="password" placeholder="🔄 تأكيد كلمة المرور" style={styles.inputStyle} />}
            <button onClick={() => { setIsLoggedIn(true); setCurrentSection('main'); }} style={{ width: '100%', background: authMode === 'login' ? '#6366f1' : '#2dd4bf', padding: '1.2rem', borderRadius: '1rem', border: 'none', color: authMode === 'login' ? '#fff' : '#000', fontWeight: 'bold', marginTop: '1.5rem', cursor: 'pointer' }}>
              {authMode === 'login' ? 'دخول سيادي' : 'إنشاء حساب جديد'}
            </button>
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

      case 'المصادر والمراجع':
        return (
          <div style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#a78bfa', marginBottom: '2rem', textAlign: 'center' }}>المستودع السيادي للمراجع 🏛️</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {["الجريدة الرسمية (JORADP)", "بوابة المجلات العلمية (ASJP)", "رئاسة الجمهورية", "المحكمة الدستورية"].map(m => (
                <div key={m} style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>🏛️ {m}</div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { t: 'استشارة قانونية', i: '⚖️', c: '#6366f1' },
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
      <div style={styles.glowLeft}></div>
      <div style={styles.glowRight}></div>
      <div style={styles.philosophyFrame}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>"العدالة في عصر الرقمنة.. أصالة النص، وسرعة النبض"</h1>
      </div>
      <div style={styles.mainGlassCard}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
             {!isLoggedIn ? (
               <button onClick={() => setCurrentSection('تسجيل الدخول')} style={{ background: '#6366f1', padding: '0.6rem 1.5rem', borderRadius: '1rem', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>دخول / تسجيل</button>
             ) : (
               <span style={{ color: '#34d399' }}>مرحباً بك 👋</span>
             )}
             <a href="mailto:hichembenzerouk3@gmail.com" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none', borderBottom: '1px solid rgba(148, 163, 184, 0.3)' }}>
               hichembenzerouk3@gmail.com ✉️
             </a>
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>🇩🇿 المنصة القانونية الذكية</div>
          {currentSection !== 'main' && <button onClick={() => setCurrentSection('main')} style={{ background: 'transparent', border: '1px solid #d97706', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.8rem' }}>الرئيسية</button>}
        </nav>
        {renderContent()}
        <footer style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
           <div style={{ background: 'rgba(20, 184, 166, 0.1)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid #2dd4bf33' }}>
              <h4 style={{ color: '#2dd4bf', marginBottom: '0.5rem' }}>🛡️ حماية البيانات 18-07</h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>تشفير سيادي كامل لعام 2026.</p>
           </div>
           <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: '#fbbf24', marginBottom: '0.5rem' }}>⚠️ إخلاء مسؤولية</h4>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>المخرجات إرشادية وتوليد آلي بناءً على الجريدة الرسمية.</p>
           </div>
        </footer>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default App;
    
