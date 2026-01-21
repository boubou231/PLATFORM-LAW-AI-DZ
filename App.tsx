import React, { useState } from 'react';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'auth'>('landing');

  const styles = {
    // الخلفية المتدرجة العميقة كما في الصورة
    container: { 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at top right, #4f46e5, #312e81, #111827)',
      fontFamily: 'system-ui, sans-serif',
      direction: 'rtl' as const,
      color: '#ffffff',
      display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
      padding: '2rem 1rem'
    },
    // الحاوية الزجاجية الكبيرة المحيطة بالكل
    glassWrapper: {
      maxWidth: '1200px', width: '100%',
      background: 'rgba(255, 255, 255, 0.03)',
      backdropFilter: 'blur(20px)',
      borderRadius: '2.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
    },
    // شريط التنقل الاحترافي
    navbar: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '3rem', padding: '0 1rem'
    },
    // بطاقات الخدمات (تصميم المربعات في الصورة)
    grid: {
      display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '1.5rem', marginTop: '3rem'
    },
    serviceCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '1.5rem', padding: '2rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      textAlign: 'center' as const,
      transition: 'all 0.3s ease'
    },
    emailLink: {
      color: '#cbd5e1', textDecoration: 'none', fontSize: '0.9rem',
      background: 'rgba(255, 255, 255, 0.1)', padding: '0.5rem 1rem',
      borderRadius: '2rem', border: '1px solid rgba(255, 255, 255, 0.2)'
    }
  };

  const services = [
    { title: 'استشارة قانونية', icon: '⚖️', desc: 'إجابات دقيقة مع مراجعة مستجدات آخر 10 أيام.' },
    { title: 'تحليل الوثائق', icon: '🔍', desc: 'تحليل ذكي للعقود والصور بمطابقة JORADP.' },
    { title: 'صياغة العقود', icon: '📄', desc: 'نماذج عرفية محدثة لعام 2026.' },
    { title: 'البحث العلمي', icon: '🎓', desc: 'بحوث أكاديمية تلتزم بأمانة التهميش.' },
    { title: 'الرادار القانوني', icon: '📡', desc: 'تمشيط آلي لآخر المستجدات وتصنيفها.' },
    { title: 'المصادر والمراجع', icon: '📚', desc: 'قائمة المصادر السيادية والمجلات الجزائرية.' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.glassWrapper}>
        <nav style={styles.navbar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>🇩🇿</span>
            <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>منصة القانون</span>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <a href="mailto:hichembenzerouk3@gmail.com" style={styles.emailLink}>
               hichembenzerouk3@gmail.com ✉️
            </a>
            <button onClick={() => setView('auth')} style={{ padding: '0.5rem 1.5rem', borderRadius: '2rem', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              دخول / تسجيل
            </button>
          </div>
        </nav>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>"منصة القانون الجزائرية"</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>« القانون ليس قيداً للحرية، بل هو الحصن الذي يحميها »</p>
          <div style={{ marginTop: '1.5rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '1rem', display: 'inline-block', fontSize: '0.9rem' }}>
            مطابقة حية مع الجريدة الرسمية لعام 2026 [cite: 2026-01-19]
          </div>
        </div>

        <div style={styles.grid}>
          {services.map((s, i) => (
            <div key={i} style={styles.serviceCard}>
              <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{s.icon}</div>
              <h3 style={{ marginBottom: '0.5rem' }}>{s.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5' }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <footer style={{ marginTop: '4rem', textAlign: 'center', fontSize: '0.8rem', opacity: 0.6 }}>
          <p>تحقق الرادار يتم عبر مقارنة المدخلات مع الجريدة الرسمية قبل الموافقة النهائية [cite: 2026-01-19]</p>
          <p>تخضع المنصة لقانون حماية المعطيات الشخصية 18-07</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
