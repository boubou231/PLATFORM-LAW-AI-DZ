import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { FeatureCard } from './FeatureCard';
import { getLegalConsultation } from './geminiService';

const getJsPDF = () => (window as any).jspdf?.jsPDF;
const getHtml2Canvas = () => (window as any).html2canvas;

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConsultation = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await getLegalConsultation(query);
      setResult(data.text);
    } catch (error) {
      setResult("حدث خطأ في الاتصال بالمحرك القانوني.");
    }
    setLoading(false);
  };

  const downloadPDF = async () => {
    const jsPDF = getJsPDF();
    const html2canvas = getHtml2Canvas();

    if (!jsPDF || !html2canvas) {
      alert("المكتبات المطلوبة للتحميل غير جاهزة بعد.");
      return;
    }

    const element = document.getElementById('consultation-result');
    if (!element) return;

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save('consultation-dz.pdf');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-right" dir="rtl">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <section className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">استشارة قانونية فورية</h2>
          <textarea 
            className="w-full p-4 border rounded-lg mb-4 h-32 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="اكتب سؤالك القانوني هنا..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={handleConsultation}
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'جاري التحليل...' : 'تحليل النص قانونياً'}
          </button>
        </section>

        {result && (
          <section id="consultation-result" className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">النتيجة القانونية:</h3>
              <button 
                onClick={downloadPDF}
                className="text-blue-600 hover:underline"
              >
                تحميل كـ PDF
              </button>
            </div>
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;

