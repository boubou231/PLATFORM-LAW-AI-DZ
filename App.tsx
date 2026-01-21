import React, { useState } from 'react';

// الأنواع الخاصة بالأقسام بناءً على صورك
type Section = 'main' | 'استشارة قانونية' | 'صياغة العقود' | 'تحليل الوثائق' | 'الرادار القانوني' | 'البحث العلمي' | 'المصادر والمراجع';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('main');

  const styles = {
    container: { 
      minHeight: '100vh', background: 'radial-gradient(circle at top right, #4f46e5, #312e81, #111827)',
      fontFamily: 'system-ui, sans-serif', direction: 'rtl' as const, color: '#fff', padding: '1rem'
    },
    glassWrapper: {
      maxWidth: '1200px', margin: '2rem auto', background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(25px)', borderRadius: '2rem', border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
    },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' },
    card: {
      background: 'rgba(255, 255, 255, 0.07)', borderRadius: '1.5rem', padding: '1.5rem',
      border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer', transition: '0.3s', textAlign: 'center' as const
    },
    subPageCard: {
      background: '#fff', color: '#1a202c', borderRadius: '1.5rem', padding: '2rem', marginTop: '1rem'
    }
  };

  // 1. واجهة الصفحة الرئيسية (بناءً على صورتك الأخيرة)
  const MainLanding = () => (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>"منصة القانون الجزائرية"</h1>
      <p style={{ opacity: 0.8, marginBottom: '2rem' }}>« القانون ليس قيداً للحرية، بل هو الحصن الذي يحميها »</p>
      
      <div style={styles.grid}>
        {services.map((s, i) => (
          <div key={i} style={styles.card} onClick={() => setCurrentSection(s.title as Section)}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{s.icon}</div>
            <h3 style={{ marginBottom: '0.5rem' }}>{s.title}</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{s.desc}</p>
            <div style={{ marginTop: '1rem', color: '#3b82f6', fontSize: '0.85rem' }}>دخول الخدمة ←</div>
          </div>
        ))}
      </div>
    </div>
  );

  // 2. محرك عرض الأقسام الفرعية (بناءً على صورك المرفقة)
  const renderSubSection = () => {
    switch (currentSection) {
      case 'استشارة قانونية':
        return (
          <div style={styles.subPageCard}>
            <h2 style={{ color: '#2d3748' }}>⚖️ استشارة قانونية ذكية</h2>
            <div style={{ padding: '1rem', background: '#ebf8ff', borderRadius: '0.5rem', margin: '1rem 0' }}>
              بروتوكول إجباري: جاري مراجعة مستجدات آخر 10 أيام
            </div>
            <textarea placeholder="اسأل عن أي مادة أو أرفق صوراً للتحليل..." style={{ width: '100%', height: '150px', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e0' }} />
            <button style={{ background: '#2d3748', color: '#fff', padding: '0.7rem 2rem', border: 'none', borderRadius: '0.5rem', marginTop: '1rem' }}>إرسال</button>
          </div>
        );

      case 'صياغة العقود':
        return (
          <div style={styles.subPageCard}>
            <h2 style={{ color: '#2d3748' }}>📝 صياغة العقود</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '1.5rem' }}>
              {['عقد بيع منقول', 'عقد عمل محدد', 'وكالة تجارية', 'عقد تقديم خدمات'].map(c => (
                <div key={c} style={{ border: '1px solid #e2e8f0', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center' }}>{c}</div>
              ))}
            </div>
            <input placeholder="أدخل تفاصيل الأطراف والموضوع..." style={{ width: '100%', padding: '1rem', marginTop: '1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e0' }} />
            <button style={{ width: '100%', background: '#064e3b', color: '#fff', padding: '1rem', border: 'none', borderRadius: '0.5rem', marginTop: '1rem' }}>صياغة عقد عرفي محدث 2026</button>
          </div>
        );

      case 'الرادار القانوني':
        return (
          <div style={styles.subPageCard}>
            <div style={{ background: '#064e3b', color: '#fff', padding: '2rem', borderRadius: '1rem', textAlign: 'center' }}>
              <h2>البوت الراداري: تمشيط المستجدات</h2>
              <p>يتم الآن تمشيط المصادر السيادية وتصنيف النتائج آلياً</p>
              <button style={{ background: '#d97706', border: 'none', padding: '0.5rem 1.5rem', color: '#fff', borderRadius: '0.5rem' }}>تحديث المسح</button>
            </div>
          </div>
        );

      case 'المصادر والمراجع':
        return (
          <div style={styles.subPageCard}>
            <h2 style={{ color: '#2d3748' }}>📚 المصادر والمراجع القانونية المعتمدة</h2>
            <div style={{ marginTop: '1rem' }}>
              {['الجريدة الرسمية للجمهورية الجزائرية', 'رئاسة الجمهورية الجزائرية', 'المحكمة الدستورية', 'مجلس الدولة'].map(m => (
                <div key={m} style={{ padding: '1rem', borderBottom: '1px solid #edf2f7', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  🏛️ {m}
                </div>
              ))}
            </div>
          </div>
        );

      case 'البحث العلمي':
        return (
          <div style={styles.subPageCard}>
            <h2 style={{ color: '#2d3748' }}>🎓 البحث العلمي القانوني</h2>
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <input placeholder="عنوان البحث (مثال: النظام القانوني للسد)..." style={{ width: '70%', padding: '1rem', borderRadius: '0.5rem 0 0 0.5rem', border: '1px solid #cbd5e0' }} />
              <button style={{ padding: '1rem 2rem', background: '#064e3b', color: '#fff', border: 'none', borderRadius: '0 0.5rem 0.5rem 0' }}>توليد البحث</button>
            </div>
          </div>
        );

      case 'تحليل الوثائق':
        return (
          <div style={styles.subPageCard}>
            <h2 style={{ color: '#2d3748' }}>🔍 تحليل الوثائق المتعددة</h2>
            <div style={{ border: '2px dashed #cbd5e0', padding: '3rem', textAlign: 'center', borderRadius: '1rem', margin: '1rem 0' }}>
              📄 ارفع وثيقة واحدة أو أكثر (PDF/صور) للمعالجة
            </div>
            <button style={{ width: '100%', background: '#064e3b', color: '#fff', padding: '1rem', border: 'none', borderRadius: '0.5rem' }}>بدء التحليل الاستخباراتي الشامل 🚀</button>
          </div>
        );

      default:
        return <MainLanding />;
    }
  };

  const services = [
    { title: 'استشارة قانونية', icon: '⚖️', desc: 'إجابات دقيقة مع مراجعة مستجدات آخر 10 أيام' },
    { title: 'تحليل الوثائق', icon: '🔍', desc: 'تحليل ذكي للعقود والصور بمطابقة JORADP' },
    { title: 'صياغة العقود', icon: '📝', desc: 'نماذج عرفية محدثة لعام 2026' },
    { title: 'البحث العلمي', icon: '🎓', desc: 'بحوث أكاديمية تلتزم بأمانة التهميش' },
    { title: 'الرادار القانوني', icon: '📡', desc: 'تمشيط آلي لآخر المستجدات وتصنيفها' },
    { title: 'المصادر والمراجع', icon: '📚', desc: 'قائمة المصادر السيادية والمجلات الجزائرية' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.glassWrapper}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold' }}>🇩🇿 منصة القانون</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {currentSection !== 'main' && <button onClick={() => setCurrentSection('main')} style={{ background: '#d97706', border: 'none', padding: '0.4rem 1rem', borderRadius: '0.5rem', color: '#fff' }}>العودة للرئيسية</button>}
            <a href="mailto:hichembenzerouk3@gmail.com" style={{ background: 'rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '0.5rem', color: '#fff', textDecoration: 'none', fontSize: '0.8rem' }}>الدعم التقني</a>
          </div>
        </nav>
        
        {renderSubSection()}

        <footer style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.7rem', opacity: 0.6 }}>
           مطابقة حية مع الجريدة الرسمية 2026 | حماية المعطيات 18-07 [cite: 2026-01-19]
        </footer>
      </div>
    </div>
  );
};

export default App;
