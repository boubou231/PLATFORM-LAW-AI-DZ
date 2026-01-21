import React, { useState, useEffect } from 'react';

// تحديد الأنواع للأقسام بناءً على الرؤية الفلسفية للمنصة
type Section = 'main' | 'استشارة قانونية' | 'صياغة العقود' | 'تحليل الوثائق' | 'الرادار القانوني' | 'البحث العلمي' | 'المصادر والمراجع';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('main');

  // تنسيقات الواجهة الإبداعية (Glassmorphism & Neumorphism)
  const styles = {
    container: { 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at 10% 20%, #1e1b4b 0%, #020617 100%)',
      fontFamily: "'Amiri', serif, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", 
      direction: 'rtl' as const, 
      color: '#f8fafc', 
      padding: '1.5rem',
      overflowX: 'hidden' as const
    },
    glassWrapper: {
      maxWidth: '1250px', 
      margin: '1rem auto', 
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(40px)', 
      borderRadius: '3.5rem', 
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '3.5rem', 
      boxShadow: '0 50px 100px rgba(0,0,0,0.7)',
      position: 'relative' as const
    },
    grid: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
      gap: '2.5rem' 
    },
    card: {
      background: 'linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01))',
      borderRadius: '2.5rem', 
      padding: '2.5rem',
      border: '1px solid rgba(255, 255, 255, 0.08)', 
      cursor: 'pointer', 
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      textAlign: 'center' as const
    },
    subContent: { 
      background: 'rgba(255,255,255,0.01)', 
      borderRadius: '3rem', 
      padding: '3rem', 
      marginTop: '1.5rem',
      border: '1px solid rgba(255,255,255,0.03)',
      animation: 'fadeIn 0.6s ease-out'
    },
    instLink: {
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '1.4rem', 
      background: 'rgba(255,255,255,0.04)', 
      borderRadius: '1.2rem',
      marginBottom: '1rem', 
      border: '1px solid rgba(255,255,255,0.05)', 
      textDecoration: 'none', 
      color: '#fff',
      transition: '0.3s ease'
    },
    footerSection: {
      marginTop: '6rem', 
      padding: '3rem', 
      background: 'rgba(0, 0, 0, 0.4)', 
      borderRadius: '2.5rem', 
      border: '1px solid rgba(255, 255, 255, 0.05)',
      fontSize: '0.95rem',
      lineHeight: '1.8'
    }
  };

  const services = [
    { title: 'استشارة قانونية', icon: '⚖️', desc: 'تحليل معمق بمطابقة حية لمستجدات آخر 10 أيام من الجريدة الرسمية.' },
    { title: 'تحليل الوثائق', icon: '🔍', desc: 'معالجة استخباراتية دقيقة للعقود والصور عبر محرك JORADP السيادي.' },
    { title: 'صياغة العقود', icon: '📝', desc: 'توليد عقود عرفية ورسمية محدثة وفق القانون المدني والتجاري 2026.' },
    { title: 'البحث العلمي', icon: '🎓', desc: 'صناعة محتوى أكاديمي رصين يلتزم بأمانة التهميش والمنهجية القانونية.' },
    { title: 'الرادار القانوني', icon: '📡', desc: 'تمشيط آلي فوري للجريدة الرسمية وتصنيف المستجدات التشريعية.' },
    { title: 'المصادر والمراجع', icon: '📚', desc: 'المستودع السيادي الرقمي لكافة المؤسسات والتشريعات الجزائرية.' }
  ];

  const renderSection = () => {
    switch (currentSection) {
      case 'صياغة العقود':
        return (
          <div style={styles.subContent}>
            <h2 style={{ color: '#fbbf24', textAlign: 'center', marginBottom: '2.5rem', fontSize: '2.2rem' }}>صياغة العقود الذكية 📝</h2>
            <h3 style={{ color: '#2dd4bf', fontSize: '1.3rem', borderRight: '5px solid #fbbf24', paddingRight: '15px', marginBottom: '2rem' }}>
              العقود العرفية (لا تتطلب موثق - المحدثة بتاريخ 21 جانفي 2026)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {[
                { n: 'عقد بيع منقول (مركبات/آلات)', d: 'حسب المادة 351 وما بعدها من القانون المدني.' },
                { n: 'عقد إيجار عرفي سكن/محل', d: 'مطابق لآخر تعديلات قانون المستأجر والمالك.' },
                { n: 'وكالة خاصة لتمثيل المصالح', d: 'تخويل قانوني للقيام بإجراءات إدارية محددة.' },
                { n: 'عقد تقديم خدمات مهنية', d: 'تنظيم العلاقة بين المتعاملين الاقتصاديين.' },
                { n: 'إقرار بدين بين الخواص', d: 'وثيقة قانونية ثابتة لإثبات الالتزامات المالية.' },
                { n: 'اتفاقية صلح وتنازل ودية', d: 'لإنهاء النزاعات بالتراضي وفق القانون المدني.' }
              ].map((item, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.8rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.n}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.d}</div>
                </div>
              ))}
            </div>
            <textarea placeholder="أدخل بيانات الأطراف، الثمن، وموضوع العقد بالتفصيل..." style={{ width: '100%', minHeight: '180px', background: 'rgba(0,0,0,0.3)', border: '1px solid #334155', borderRadius: '1.5rem', color: '#fff', padding: '1.5rem', marginTop: '2.5rem', outline: 'none', fontSize: '1rem' }} />
            <button style={{ width: '100%', background: 'linear-gradient(90deg, #064e3b, #065f46)', color: '#fff', padding: '1.4rem', border: 'none', borderRadius: '1.5rem', marginTop: '1.5rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(6, 78, 59, 0.3)' }}>
              توليد العقد العرفي المحدث لعام 2026 🚀
            </button>
          </div>
        );

      case 'المصادر والمراجع':
        return (
          <div style={styles.subContent}>
            <h2 style={{ color: '#2dd4bf', marginBottom: '3rem', textAlign: 'center', fontSize: '2.2rem' }}>دليل المؤسسات السيادية والرقابية 🏛️</h2>
            {[
              { 
                cat: "المؤسسات السيادية والتشريعية", 
                links: [
                  {n: "رئاسة الجمهورية الجزائرية", u: "https://www.el-mouradia.dz"},
                  {n: "الوزارة الأولى", u: "https://www.premier-ministre.gov.dz"},
                  {n: "مجلس الأمة", u: "http://www.majliselouma.dz"},
                  {n: "المجلس الشعبي الوطني", u: "http://www.apn.dz"}
                ] 
              },
              { 
                cat: "الهيئات الرقابية والقضائية العليا", 
                links: [
                  {n: "المحكمة الدستورية", u: "https://www.cour-constitutionnelle.dz"},
                  {n: "مجلس المحاسبة", u: "https://www.ccomptes.dz"},
                  {n: "المحكمة العليا", u: "https://www.coursupreme.dz"},
                  {n: "مجلس الدولة", u: "http://www.conseil-etat.dz"},
                  {n: "وسيط الجمهورية", u: "https://wassit.dz"}
                ] 
              },
              { 
                cat: "الوزارات الرئيسية والحساسة", 
                links: [
                  {n: "وزارة الدفاع الوطني", u: "https://www.mdn.dz"},
                  {n: "وزارة العدل", u: "https://www.mjustice.dz"},
                  {n: "وزارة الداخلية والجماعات المحلية", u: "https://interieur.gov.dz"},
                  {n: "وزارة المالية", u: "https://www.mf.gov.dz"}
                ] 
              }
            ].map((category, idx) => (
              <div key={idx} style={{ marginBottom: '3rem' }}>
                <h4 style={{ color: '#94a3b8', marginBottom: '1.5rem', paddingRight: '15px', borderRight: '4px solid #2dd4bf', fontSize: '1.2rem' }}>{category.cat}</h4>
                {category.links.map(link => (
                  <a key={link.n} href={link.u} target="_blank" rel="noreferrer" style={styles.instLink} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'} onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                    <span>🏛️ {link.n}</span>
                    <span style={{ fontSize: '0.85rem', color: '#2dd4bf', fontWeight: 'bold' }}>زيارة الموقع الرسمي ←</span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        );

      case 'الرادار القانوني':
        return (
          <div style={{ ...styles.subContent, background: 'linear-gradient(145deg, #064e3b, #022c22)', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>الرادار القانوني النشط 📡</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>تمشيط ذكي لآخر صدورات الجريدة الرسمية والمناشير الوزارية لعام 2026</p>
            <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
              <button style={{ background: '#d97706', border: 'none', padding: '1.2rem 3.5rem', color: '#fff', borderRadius: '1.2rem', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }}>تحديث المسح الفوري</button>
              <input placeholder="البحث عن مادة محددة..." style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '1.2rem', color: '#fff', width: '300px' }} />
            </div>
          </div>
        );

      case 'main':
      default:
        return (
          <>
            <header style={{ textAlign: 'center', marginBottom: '6rem', animation: 'fadeInDown 0.8s ease' }}>
              <h1 style={{ fontSize: '4rem', fontWeight: '900', marginBottom: '1.5rem', background: 'linear-gradient(to bottom, #ffffff 40%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>
                "العدالة في عصر الرقمنة.. أصالة النص، وسرعة النبض"
              </h1>
              <p style={{ fontSize: '1.3rem', color: '#94a3b8', fontStyle: 'italic', maxWidth: '900px', margin: '0 auto', lineHeight: '1.8' }}>
                « القانون ليس قيداً للحرية، بل هو الحصن الذي يحميها »
              </p>
            </header>
            <div style={styles.grid}>
              {services.map((s, i) => (
                <div key={i} style={styles.card} onClick={() => setCurrentSection(s.title as Section)}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-15px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '2rem', filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.2))' }}>{s.icon}</div>
                  <h3 style={{ fontSize: '1.7rem', marginBottom: '1rem', color: '#fff' }}>{s.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: '1.7' }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div style={styles.container}>
      {/* تأثيرات ضوئية خلفية */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', background: 'rgba(79, 70, 229, 0.1)', filter: 'blur(120px)', borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '400px', height: '400px', background: 'rgba(16, 185, 129, 0.05)', filter: 'blur(150px)', borderRadius: '50%', zIndex: 0 }}></div>

      <div style={styles.glassWrapper}>
        <nav style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4rem', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '2.2rem' }}>🇩🇿</span>
            <span style={{ fontWeight: '900', fontSize: '1.6rem', background: 'linear-gradient(90deg, #fff, #64748b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              المنصة القانونية الذكية
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
            {currentSection !== 'main' && (
              <button onClick={() => setCurrentSection('main')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.7rem 1.8rem', borderRadius: '1.2rem', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}>
                العودة للرئيسية
              </button>
            )}
            <a href="mailto:hichembenzerouk3@gmail.com" style={{ background: 'linear-gradient(90deg, #b45309, #d97706)', color: '#fff', padding: '0.7rem 1.8rem', borderRadius: '2rem', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)' }}>
              hichembenzerouk3@gmail.com ✉️
            </a>
          </div>
        </nav>

        {renderSection()}

        <div style={styles.footerSection}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h4 style={{ color: '#f59e0b', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              ⚠️ إخلاء مسؤولية قانونية
            </h4>
            <p style={{ color: '#94a3b8', textAlign: 'justify' }}>
              إن جميع الاستشارات والمعلومات والنصوص الصادرة عن هذه المنصة هي استشارات إرشادية وتوجيهية تم توليدها بواسطة تقنيات الذكاء الاصطناعي بناءً على القوانين المتاحة. 
              هذه المعلومات لا تغني بأي حال من الأحوال عن استشارة محامي معتمد أو موثق أو الجهات القضائية الرسمية. المنصة وإدارتها غير مسؤولة عن أي قرارات تُتخذ بناءً على هذه النتائج.
            </p>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
            <h4 style={{ color: '#34d399', fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              🛡️ حماية البيانات الشخصية
            </h4>
            <p style={{ color: '#94a3b8', textAlign: 'justify' }}>
              تخضع هذه المنصة وتلتزم ببنود **القانون رقم 18-07** المتعلق بحماية الأشخاص الطبيعيين في مجال معالجة المعطيات ذات الطابع الشخصي. 
              نحن نضمن تشفير وحماية بياناتكم وفق المعايير السيادية الجزائرية لعام 2026، ولا يتم تخزين المعطيات الشخصية أو مشاركتها إلا في الإطار الذي يخدم استشارتكم وبموافقتكم الصريحة.
            </p>
          </div>
          <div style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.4, fontSize: '0.8rem' }}>
            جميع الحقوق محفوظة © 2026 | مطابقة لمعايير الجريدة الرسمية للجمهورية الجزائرية الديمقراطية الشعبية
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;
