import React, { useState } from 'react';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [isRegistering, setIsRegistering] = useState(false);

  const styles = {
    container: { minHeight: '100vh', backgroundColor: '#fdfdfd', fontFamily: 'system-ui, sans-serif', direction: 'rtl' as const },
    hero: { padding: '4rem 2rem', textAlign: 'center' as const, background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
    card: { 
      backgroundColor: 'white', padding: '2rem', borderRadius: '1.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', 
      border: '1px solid #f1f5f9', transition: 'transform 0.3s ease', cursor: 'pointer', textAlign: 'center' as const 
    },
    iconCircle: { width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' },
    btnPrimary: { padding: '0.8rem 2rem', backgroundColor: '#1e3a8a', color: 'white', borderRadius: '2rem', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' },
    badge: { backgroundColor: '#dcfce7', color: '#166534', padding: '0.2rem 0.8rem', borderRadius: '1rem', fontSize: '0.8rem', marginBottom: '1rem', display: 'inline-block' }
  };

  const services = [
    { id: 1, title: 'إستشارة قانونية', desc: 'إجابات دقيقة مع مراجعة مستجدات آخر 10 أيام.', icon: '⚖️' },
    { id: 2, title: 'تحليل الوثائق', desc: 'تحليل ذكي للعقود والصور بمطابقة JORADP.', icon: '🔍' },
    { id: 3, title: 'صياغة العقود', desc: 'نماذج عرفية محدثة لعام 2026.', icon: '📝' },
    { id: 4, title: 'البحث العلمي', desc: 'بحوث أكاديمية (20 صفحة) تلتزم بالتهميش.', icon: '🎓' },
    { id: 5, title: 'الرادار القانوني', desc: 'تمشيط آلي لآخر المستجدات وتصنيفها.', icon: '📡' },
    { id: 6, title: 'المصادر والمراجع', desc: 'قائمة المصادر السيادية والمجلات الجزائرية.', icon: '📚' }
  ];

  // 1. الواجهة التعريفية (Landing Page)
  if (view === 'landing') {
    return (
      <div style={styles.container}>
        <header style={styles.hero}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>منصة القانون الجزائرية</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>"القانون ليس قيداً للحرية، بل هو الحصن الذي يحميها"</p>
          <div style={{ marginTop: '2rem' }}>
            <button onClick={() => setView('auth')} style={{ ...styles.btnPrimary, backgroundColor: '#ffffff', color: '#1e3a8a' }}>ابدأ الآن مجاناً</button>
          </div>
        </header>
        
        <div style={styles.grid}>
          {services.map(s => (
            <div key={s.id} style={styles.card} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={styles.iconCircle}>{s.icon}</div>
              <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6' }}>{s.desc}</p>
              <button style={{ background: 'none', border: 'none', color: '#2563eb', marginTop: '1rem', fontWeight: '600' }}>دخول الخدمة ←</button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. واجهة الدخول (Auth Page)
  if (view === 'auth') {
    return (
      <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div style={{ ...styles.card, maxWidth: '450px', width: '100%' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#1e3a8a' }}>{isRegistering ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}</h2>
          <input type="email" placeholder="البريد الإلكتروني" style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '0.8rem', border: '1px solid #e2e8f0' }} />
          <input type="password" placeholder="كلمة المرور" style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', borderRadius: '0.8rem', border: '1px solid #e2e8f0' }} />
          <button onClick={() => setView('dashboard')} style={styles.btnPrimary}>تأكيد</button>
          <p style={{ marginTop: '1.5rem', color: '#64748b' }}>
            {isRegistering ? 'لديك حساب؟' : 'ليس لديك حساب؟'} 
            <span onClick={() => setIsRegistering(!isRegistering)} style={{ color: '#2563eb', cursor: 'pointer', marginRight: '5px' }}>اضغط هنا</span>
          </p>
        </div>
      </div>
    );
  }

  // 3. لوحة التحكم (Dashboard) - تظهر بعد الدخول
  return (
    <div style={styles.container}>
      <nav style={{ padding: '1rem 2rem', backgroundColor: '#1e3a8a', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
        <strong>منصة القانون 2026</strong>
        <button onClick={() => setView('landing')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>خروج</button>
      </nav>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>مرحباً بك في لوحة التحكم</h2>
        <p>تم تفعيل الرادار القانوني للمطابقة مع الجريدة الرسمية [cite: 2026-01-19].</p>
      </div>
    </div>
  );
};

export default App;
