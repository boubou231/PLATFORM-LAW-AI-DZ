import React, { useState, useRef, useEffect } from 'react';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';

// الأنماط النارية والإبداعية
const fireStyles = {
    glow: {
        filter: 'drop-shadow(0 0 15px #ff4500) drop-shadow(0 0 30px #ff8c00)',
        transition: 'all 0.3s ease'
    },
    sidebarItem: {
        background: 'linear-gradient(90deg, rgba(255, 69, 0, 0.1) 0%, rgba(255, 140, 0, 0.05) 100%)',
        borderRight: '4px solid #ff4500',
        padding: '1rem',
        marginBottom: '0.8rem',
        cursor: 'pointer',
        borderRadius: '0 10px 10px 0',
        color: '#fff',
        transition: '0.3s'
    }
};

type Section = 'main' | 'legal_advice' | 'contracts' | 'discussion' | 'procedures' | 'radar' | 'research';

const App: React.FC = () => {
    const [currentSection, setCurrentSection] = useState<Section>('main');
    const [sectionInfo, setSectionInfo] = useState("اضغط على أحد الأقسام لعرض التفاصيل");
    
    [span_0](start_span)// البيانات المحفوظة من الكود السابق[span_0](end_span)
    const [judgmentDate, setJudgmentDate] = useState("");
    const [judgmentType, setJudgmentType] = useState("civil_appeal");
    const [contractType, setContractType] = useState<'CDD' | 'CDI' | 'URFI'>('CDI');
    const [contractStep, setContractStep] = useState<1 | 2 | 3>(1);
    const [contractData, setContractData] = useState({ employer: "", employee: "", position: "", salary: "", startDate: "", duration: "", partyA: "", partyB: "", itemDescription: "", price: "", location: "" });
    const [cnasData, setCnasData] = useState({ ssNumber: "", birthPlace: "", birthDate: "", address: "" });

    // ميزان العدالة الفخم
    const BalanceIcon = () => (
        <div style={{ fontSize: '4rem', textAlign: 'center', marginBottom: '10px' }}>⚖️</div>
    );

    const sections = [
        { id: 'legal_advice', ar: 'إستشارة قانونية', en: 'Legal Consultation', icon: '⚖️' },
        { id: 'contracts', ar: 'صياغة العقود', en: 'Contract Drafting', icon: '📝' },
        { id: 'discussion', ar: 'ديوان المناقشة', en: 'Discussion Forum', icon: '💬' },
        { id: 'procedures', ar: 'الإجراءات القانونية', en: 'Legal Procedures', icon: '📅' },
        { id: 'research', ar: 'البحث العلمي', en: 'Scientific Research', icon: '🔬' },
        { id: 'radar', ar: 'الرادار القانوني', en: 'Legal Radar', icon: '📡' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'Amiri, serif', direction: 'rtl', padding: '2rem' }}>
            
            {/* الجزء العلوي: العنوان والميزان */}
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <BalanceIcon />
                <h1 style={{ fontSize: '2.5rem', margin: '0', color: '#ff8c00' }}>المنصة القانونية الجزائرية</h1>
                <h2 style={{ fontSize: '1.5rem', opacity: 0.8 }}>ALGERIAN LEGAL PLATFORM</h2>
                <div style={{ position: 'absolute', top: '20px', left: '20px', border: '1px solid #ff4500', padding: '10px' }}>
                    إتصل بنا <br/> hichembenzerouk@gmail.com
                </div>
            </header>

            <main style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
                
                {/* الجزء الأوسط: التعريف بالقسم */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '2px solid #ff4500', borderRadius: '1.5rem', padding: '2rem', minHeight: '400px' }}>
                    <h2 style={{ color: '#ff8c00', borderBottom: '1px solid #444', paddingBottom: '1rem' }}>
                        {sections.find(s => s.id === currentSection)?.ar || "تعريف القسم"}
                    </h2>
                    <p style={{ fontSize: '1.4rem', lineHeight: '2' }}>
                        {currentSection === 'main' ? "عرفة كل قسم من المنصة بمجرد ضغط المستخدم عليه" : sectionInfo}
                    </p>
                    {/* هنا يتم استدعاء محتوى الأقسام الأصلي بناءً على التبديل */}
                </div>

                {/* القائمة الجانبية: الأقسام */}
                <aside>
                    {sections.map((sec) => (
                        <div 
                            key={sec.id}
                            style={fireStyles.sidebarItem}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(-10px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                            onClick={() => {
                                setCurrentSection(sec.id as Section);
                                setSectionInfo(`هذا القسم مخصص لـ ${sec.ar} وتوفير كافة الأدوات المتعلقة بـ ${sec.en}`);
                            }}
                        >
                            <span style={{ fontSize: '1.5rem', marginLeft: '15px', ...fireStyles.glow }}>{sec.icon}</span>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>- {sec.ar}</span>
                            <div style={{ fontSize: '0.8rem', opacity: 0.6, marginRight: '25px' }}>{sec.en}</div>
                        </div>
                    ))}
                </aside>
            </main>

            {/* الجزء السفلي: النماذج والسياسات */}
            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem', borderTop: '2px dashed #ff4500', paddingTop: '2rem' }}>
                
                {/* تسجيل الدخول */}
                <div style={{ border: '1px solid #444', padding: '1.5rem', borderRadius: '1rem' }}>
                    <h3 style={{ color: '#ff8c00' }}>تسجيل دخول | Login</h3>
                    <input placeholder="البريد الإلكتروني" style={{ width: '90%', padding: '0.8rem', marginBottom: '10px', background: '#222', border: '1px solid #ff4500', color: '#fff' }} />
                    <input type="password" placeholder="الرقم السري" style={{ width: '90%', padding: '0.8rem', background: '#222', border: '1px solid #ff4500', color: '#fff' }} />
                </div>

                {/* فتح حساب */}
                <div style={{ border: '1px solid #444', padding: '1.5rem', borderRadius: '1rem' }}>
                    <h3 style={{ color: '#ff8c00' }}>فتح حساب | Register</h3>
                    <input placeholder="البريد الإلكتروني" style={{ width: '90%', padding: '0.8rem', marginBottom: '10px', background: '#222', border: '1px solid #444' }} />
                    <input placeholder="كلمة السر" style={{ width: '90%', padding: '0.8rem', marginBottom: '10px', background: '#222', border: '1px solid #444' }} />
                    <input placeholder="تأكيد كلمة السر" style={{ width: '90%', padding: '0.8rem', background: '#222', border: '1px solid #444' }} />
                </div>

                {/* إخلاء المسؤولية */}
                <div style={{ background: 'rgba(255, 69, 0, 0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #ff4500' }}>
                    <h3 style={{ color: '#ff4500' }}>⚠️ إخلاء مسؤولية</h3>
                    <p style={{ fontSize: '0.9rem' }}>
                        إن المعلومات الواردة في هذه المنصة لأغراض تعليمية وتدريبية ولا تغني عن استشارة محامي أو جهات مختصة.
                    </p>
                </div>

                {/* سياسة الخصوصية */}
                <div style={{ border: '1px solid #444', padding: '1.5rem', borderRadius: '1rem' }}>
                    <h3 style={{ color: '#ff8c00' }}>سياسة الخصوصية</h3>
                    <p style={{ fontSize: '0.9rem' }}>
                        تخضع المنصة لحماية معطيات البيانات الشخصية لعام 2026 وفق القانون 18-07.
                    </p>
                </div>
            </section>

            <footer style={{ textAlign: 'center', marginTop: '3rem', padding: '2rem', opacity: 0.5 }}>
                2026 جميع الحقوق محفوظة - المنصة القانونية الذكية
            </footer>
        </div>
    );
};

export default App;
                                                      
