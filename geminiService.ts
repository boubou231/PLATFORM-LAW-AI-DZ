import { GoogleGenAI } from "@google/genai";
import { LegalCorrection } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const getAI = () => new GoogleGenAI({ apiKey });

const FREE_MODEL = 'gemini-1.5-flash';

const NO_MARKDOWN_INSTRUCTION = "هام جداً: يمنع استخدام الرموز (#، *، **، ###). استخدم العناوين النصية الواضحة والأسطر الجديدة فقط. للخط العريض استخدم نصاً عادياً متبوعاً بنقطتين.";
const DATA_PROTECTION_INSTRUCTION = "تحذير أمني وقانوني: بصفتك نظاماً خاضعاً للقانون الجزائري 18-07، يمنع منعاً باتاً طلب أو معالجة أو عرض أي بيانات هوية حساسة. استخدم رموز مستعارة دائماً.";
const ACADEMIC_METHODOLOGY = `المنهجية القانونية الجزائرية: 1. التهميش: يجب وضع هوامش أسفل كل فقرة بصيغة [1] اسم المؤلف، المرجع، الصفحة. 2. التوسع في التحليل لضمان مادة علمية تعادل 20 صفحة.`;
const MANDATORY_UPDATE_CHECK = "بروتوكول إجباري: قبل الإجابة على أي استفسار، يجب عليك مراجعة قائمة المراجع الرسمية (JORADP، وزارة الخارجية، السجل التجاري) والتحقق من وجود أي تحديثات تشريعية صدرت في آخر 10 أيام.";
const LEGAL_REASONING_RULES = `قواعد الترجيح القانوني الإلزامية: 1. السمو الدستوري. 2. سمو المعاهدات. 3. قاعدة التخصص. 4. قاعدة الزمن. 5. مبدأ عدم الرجعية.`;
const IDENTITY_INSTRUCTION = "يجب أن تُعرّف نفسك دائماً بأنك 'أنا مساعدك القانوني الذكي'.";

const extractSources = (response: any) => {
  return response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
    if (chunk.web) return { title: chunk.web.title || 'مرجع رسمي', url: chunk.web.uri };
    return null;
  }).filter(Boolean) || [];
};

export const getLegalConsultation = async (query: string, localCorrections: LegalCorrection[] = [], files: { base64: string, mimeType: string }[] = []) => {
  const ai = getAI();
  const verifiedContext = localCorrections.length > 0 
    ? `\nالمعلومات الموثقة:\n${localCorrections.map(c => `- الاستشارة: ${c.originalQuery} -> التصحيح: ${c.correctedText}`).join('\n')}`
    : "";
  const fileParts = files.map(file => ({ inlineData: { data: file.base64, mimeType: file.mimeType } }));
  const response = await ai.getGenerativeModel({ model: FREE_MODEL }).generateContent({
    contents: [{ role: 'user', parts: [...fileParts, { text: query + verifiedContext }] }],
    generationConfig: { temperature: 0.1 }
  });
  return { text: response.response.text(), sources: extractSources(response.response) };
};

export const verifyCorrectionWithGazette = async (query: string, suggestedCorrection: string) => {
  const ai = getAI();
  const response = await ai.getGenerativeModel({ model: FREE_MODEL }).generateContent({
    contents: [{ role: 'user', parts: [{ text: `الاستشارة: "${query}"\nالتصحيح: "${suggestedCorrection}"\nتحقق مع joradp.dz.` }] }],
    generationConfig: { temperature: 0.1 }
  });
  const text = response.response.text();
  return { isCorrect: text.includes("[تأكيد_صحيح]"), verdict: text, sources: extractSources(response.response) };
};

export const generateResearchStage = async (topic: string, stage: string, context: string = "") => {
  const ai = getAI();
  let prompt = stage === 'plan' ? `خطة بحث لـ: ${topic}` : `محتوى البحث لـ: ${topic}. المراجع: ${context}`;
  const response = await ai.getGenerativeModel({ model: FREE_MODEL }).generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2 }
  });
  return response.response.text();
};

export const draftLegalContract = async (details: string) => {
  const ai = getAI();
  const response = await ai.getGenerativeModel({ model: FREE_MODEL }).generateContent({
    contents: [{ role: 'user', parts: [{ text: `عقد عرفي جزائري: ${details}` }] }]
  });
  return response.response.text();
};

export const legalRadarSearch = async (query: string = "أحدث القوانين الجزائرية") => {
  const ai = getAI();
  const response = await ai.getGenerativeModel({ model: FREE_MODEL }).generateContent({
    contents: [{ role: 'user', parts: [{ text: `ابحث في joradp.dz عن: ${query}` }] }],
    generationConfig: { temperature: 0.1 }
  });
  return { text: response.response.text(), sources: extractSources(response.response) };
};

export const analyzeLegalDocument = async (files: { base64: string, mimeType: string }[], userQuery: string = "") => {
  const ai = getAI();
  const fileParts = files.map(file => ({ inlineData: { data: file.base64, mimeType: file.mimeType } }));
  const response = await ai.getGenerativeModel({ model: FREE_MODEL }).generateContent({
    contents: [{ role: 'user', parts: [...fileParts, { text: `حلل الوثائق: ${userQuery}` }] }],
    generationConfig: { temperature: 0.1 }
  });
  return { text: response.response.text(), sources: extractSources(response.response) };
};
