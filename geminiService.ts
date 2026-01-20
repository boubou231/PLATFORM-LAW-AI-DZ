import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const getAI = () => new GoogleGenAI({ apiKey });

const FREE_MODEL = 'gemini-1.5-flash';

// القواعد الصارمة التي الزمتني بها
const INSTRUCTIONS = `
1. المنهجية الجزائرية: التهميش الإلزامي [1] لكل فقرة.
2. التحقق القانوني: مراجعة الجريدة الرسمية (JORADP) قبل أي إجابة.
3. حماية البيانات: منع معالجة أي هويات حقيقية طبقاً للقانون 18-07.
4. الهوية: تعريف النفس بـ "أنا مساعدك القانوني الذكي".
5. الترجيح: السمو للدستور ثم المعاهدات الدولية.
`;

export const getLegalConsultation = async (query: string) => {
  try {
    const ai = getAI();
    const model = ai.getGenerativeModel({ 
      model: FREE_MODEL,
      systemInstruction: INSTRUCTIONS 
    });
    
    const result = await model.generateContent(query);
    const response = await result.response;
    return { text: response.text() };
  } catch (error) {
    console.error("خطأ تقني:", error);
    return { text: "فشل الاتصال بالمحرك القانوني. تأكد من إعدادات Vercel." };
  }
};

export const verifyCorrectionWithGazette = async (query: string, suggestedCorrection: string) => {
  const ai = getAI();
  const model = ai.getGenerativeModel({ model: FREE_MODEL });
  const prompt = `تحقق من صحة هذه المعلومة بناءً على الجريدة الرسمية الجزائرية: 
  الاستشارة: ${query}
  التصحيح المقترح: ${suggestedCorrection}
  رد بـ [تأكيد_صحيح] إذا كانت مطابقة للقانون الحالي.`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return { text: response.text() };
};
