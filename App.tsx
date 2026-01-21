import React, { useState } from 'react';

type Section = 'main' | 'استشارة قانونية' | 'صياغة العقود' | 'تحليل الوثائق' | 'الرادار القانوني' | 'البحث العلمي' | 'المصادر والمراجع';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('main');

  const styles = {
    container: { 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at 0% 0%, #1a1c2c 0%, #0a0b14 100%)',
      fontFamily: "'Segoe UI', Roboto, sans-serif", direction: 'rtl' as const, color: '#e2e8f0',
      padding: '1rem', overflowX: 'hidden' as const
    },
    // إطار متوهج خارجي
    glowWrapper: {
      maxWidth: '1200px', margin: '2rem auto', 
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(30px)', borderRadius: '3rem',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '3rem', boxShadow: '0 0 80px rgba(79, 70, 229, 0.15)',
      position: 'relative' as const, overflow: 'hidden'
    },
    // البطاقات الإبداعية
    card: {
      background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
      borderRadius: '2rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.08)',
      cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      textAlign: 'center' as const, position: 'relative' as const
    },
    // زر الإيميل الذهبي
    emailBtn: {
      background: 'linear-gradient(90deg, #b48c44, #d97706)', color: 'white',
      padding: '0.6rem 1.5rem', borderRadius: '2rem', border: 'none',
      fontWeight: 'bold', fontSize: '0.85rem', textDecoration: 'none',
      boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)', display: 'flex', alignItems: 'center', gap: '8px'
    },
    disclaimerBox: {
      marginTop: '4rem', padding: '2rem', borderRadius: '1.5rem',
      background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255, 255, 255, 0.05)',
      fontSize: '0.85rem', lineHeight: '1.8', color: '#94a3b8', textAlign: 'center' as const
    }
  };

  const services = [
    { title: 'استشارة قانونية', icon: '⚖️', desc: 'تحليل معمق بمطابقة حية لمستجدات آخر 10 أيام.', color: '#6366f1' },
    { title: 'تحليل الوثائق', icon: '🔍', desc: 'معالجة استخباراتية للعقود والصور عبر JORADP.', color: '#10b981' },
    { title: 'صياغة العقود', icon: '📝', desc: 'توليد عقود عرفية ورسمية محدثة لعام 2026.', color: '#f59e0b' },
    { title: 'البحث العلمي', icon: '🎓', desc: 'صناعة محتوى أكاديمي رصين مع تهميش منهجي.', color: '#ef4444' },
    { title: 'الرادار القانوني', icon: '📡', desc: 'تمشيط آلي للجريدة الرسمية وتصنيف المستجدات.', color: '#8b5cf6' },
    { title: 'المصادر والمراجع', icon: '📚', desc: 'المستودع السيادي للتشريع والقوانين الجزائرية.', color: '#14b8a6' }
  ];

  return (
    <div style={styles.container}>
      {/* الأنيميشن الخلفي المتوهج */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'rgba(99, 102, 241, 0.1)', filter: 'blur(150px)', zIndex: 0 }}></div>
      
      <div style={styles.glowWrapper}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '2rem' }}>🇩🇿</span>
            <span style={{ fontWeight: '900', fontSize: '1.5rem', letterSpacing: '1px', background: 'linear-gradient(to left, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              المنصة القانونية الذكية
            </span>
          </div>
          <a href="mailto:hichembenzerouk3@gmail.com" style={styles.emailBtn}>
            <span>hichembenzerouk3@gmail.com</span>
            <span style={{ fontSize: '1.2rem' }}>✉️</span>
          </a>
        </nav>

        {currentSection === 'main' ? (
          <>
            <header style={{ textAlign: 'center', marginBottom: '5rem' }}>
              <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>بوابتكم لعدالة المستقبل</h1>
              <p style={{ fontSize: '1.2rem', color: '#94a3b8', fontStyle: 'italic' }}>
                « القانون ليس قيداً للحرية، بل هو الحصن الذي يحميها »
              </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {services.map((s, i) => (
                <div 
                  key={i} 
                  style={styles.card}
                  onClick={() => setCurrentSection(s.title as Section)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-12px) scale(1.03)';
                    e.currentTarget.style.boxShadow = `0 20px 40px ${s.color}15`;
                    e.currentTarget.style.borderColor = s.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  }}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '1.5rem', filter: `drop-shadow(0 0 10px ${s.color}55)` }}>{s.icon}</div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: '1.6' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <button onClick={() => setCurrentSection('main')} style={{ background: 'none', border: '1px solid #444', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: '1rem', cursor: 'pointer', marginBottom: '2rem' }}>
              ← العودة للمركز الرئيسي
            </button>
            <h2>قسم: {currentSection}</h2>
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#444' }}>
              [ واجهة القسم قيد المعالجة الإبداعية... ]
            </div>
          </div>
        )}

        <div style={styles.disclaimerBox}>
          <div style={{ color: '#f59e0b', fontWeight: 'bold', marginBottom: '1rem', fontSize: '1rem' }}>⚠️ إخلاء مسؤولية قانونية</div>
          إن جميع الاستشارات والمعلومات الصادرة عن هذه المنصة هي استشارات إرشادية وتوجيهية بناءً على خوارزميات الذكاء الاصطناعي، 
          ولا تغني بأي حال من الأحوال عن استشارة محامي معتمد أو موثق رسمي. المنصة غير مسؤولة عن سوء استخدام المعلومات.
          <br /><br />
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', color: '#34d399' }}>
            🛡️ **حماية البيانات الشخصية:** تخضع هذه المنصة وتلتزم ببنود **القانون رقم 18-07** المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي. 
            بياناتكم مشفرة ومحمية وفق المعايير السيادية الجزائرية لعام 2026 [cite: 2026-01-19].
          </div>
        </div>

        <footer style={{ textAlign: 'center', marginTop: '3rem', opacity: 0.4, fontSize: '0.75rem' }}>
          حقوق الطبع والنشر © 2026 - الرادار القانوني المحدث
        </footer>
      </div>
    </div>
  );
};

export default App;
