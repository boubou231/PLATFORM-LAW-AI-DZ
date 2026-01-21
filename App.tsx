import React, { useState } from 'react';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('consultation');

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      direction: 'rtl' as const,
      color: '#1e293b'
    },
    authCard: {
      maxWidth: '400px',
      margin: '5rem auto',
      backgroundColor: '#ffffff',
      padding: '2.5rem',
      borderRadius: '1rem',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    },
    input: {
      width: '100%',
      padding: '0.8rem',
      marginBottom: '1rem',
      borderRadius: '0.5rem',
      border: '1px solid #cbd5e1',
      fontSize: '1rem',
      boxSizing: 'border-box' as const
    },
    btnPrimary: {
      width: '100%',
      padding: '0.8rem',
      backgroundColor: '#1e3a8a',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      fontWeight: 'bold' as const,
      fontSize: '1rem'
    },
    nav: {
      backgroundColor: '#1e3a8a',
      padding: '0.5rem 1rem',
      display: 'flex',
      gap: '0.5rem',
      overflowX: 'auto' as const,
      alignItems: 'center'
    },
    navButton: (active: boolean) => ({
      padding: '0.6rem 1.2rem',
      backgroundColor: active ? '#3b82f6' : 'transparent',
      color: '#ffffff',
      border: 'none',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      whiteSpace: 'nowrap' as const,
      fontWeight: active ? 'bold' as const : 'normal' as const
    })
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <div style={styles.container}>
        <div style={styles.authCard}>
          <h2 style={{ textAlign: 'center', color: '#1e3a8a', marginBottom: '1.5rem' }}>
            {isRegistering ? 'إنشاء حساب قانوني' : 'دخول المنصة'}
          </h2>
          <form onSubmit={handleAuthSubmit}>
            {isRegistering && (
              <input type="text" placeholder="الاسم الكامل" style={styles.input} required />
            )}
            <input type="email" placeholder="البريد الإلكتروني" style={styles.input} required />
            <input type="password" placeholder="كلمة المرور" style={styles.input} required />
            <button type="submit" style={styles.btnPrimary}>
              {isRegistering ? 'إنشاء الحساب' : 'تسجيل الدخول'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
            <span>{isRegistering ? 'لديك حساب بالفعل؟' : 'مستخدم جديد؟'}</span>
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 'bold', marginRight: '5px' }}
            >
              {isRegistering ? 'سجل دخولك' : 'أنشئ حساباً'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <button onClick={() => setActiveTab('consultation')} style={styles.navButton(activeTab === 'consultation')}>استشارة سريعة</button>
        <button onClick={() => setActiveTab('research')} style={styles.navButton(activeTab === 'research')}>بحث أكاديمي</button>
        <button onClick={() => setActiveTab('contracts')} style={styles.navButton(activeTab === 'contracts')}>توليد عقود</button>
        <button onClick={() => setActiveTab('contact')} style={styles.navButton(activeTab === 'contact')}>اتصل بنا</button>
        <button 
          onClick={() => setIsLoggedIn(false)} 
          style={{ ...styles.navButton(false), backgroundColor: '#991b1b', marginRight: 'auto' }}
        >
          خروج
        </button>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0' }}>
          {activeTab === 'consultation' && (
            <div>
              <h2 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>الاستشارة القانونية الذكية</h2>
              <textarea 
                style={{ width: '100%', minHeight: '150px', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', boxSizing: 'border-box' }} 
                placeholder="صف حالتك القانونية بالتفصيل..."
              />
              <button style={{ ...styles.btnPrimary, marginTop: '1rem' }}>بدء التحليل</button>
            </div>
          )}

          {activeTab === 'research' && (
            <div>
              <h2 style={{ color: '#1e3a8a' }}>قسم البحوث الحقوقية</h2>
              <p>سيتم توليد بحث أكاديمي (20+ صفحة) وفق منهجية الحقوق الجزائرية.</p>
            </div>
          )}

          {activeTab === 'contact' && (
            <div style={{ textAlign: 'center' }}>
              <h2>الدعم التقني</h2>
              <p>تواصل مع المطور: <strong>hichembenzerouk3@gmail.com</strong></p>
            </div>
          )}
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '2rem', fontSize: '0.85rem', color: '#64748b', backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0' }}>
        <p>جميع البيانات محمية وفق القانون الجزائري 18-07 المتعلق بحماية الأشخاص الطبيعيين في معالجة المعطيات.</p>
        <p>© 2026 منصة القانون الجزائرية - استشارات تعليمية وتدريبية</p>
      </footer>
    </div>
  );
};

export default App;
  
