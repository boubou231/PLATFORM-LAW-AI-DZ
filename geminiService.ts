import { GoogleGenAI } from "@google/genai";
import { LegalCorrection } from "../types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const getAI = () => new GoogleGenAI(apiKey);

const FREE_MODEL = 'gemini-1.5-flash';

const NO_MARKDOWN_INSTRUCTION = "هام جداً: يمنع استخدام الرموز (#، *، **، ###). استخدم العناوين النصية الواضحة والأسطر الجديدة فقط. للخط العريض استخدم نصاً عادياً متبوعاً بنقطتين.";

const DATA_PROTECTION_INSTRUCTION = "تحذير أمني وقانوني: بصفتك نظاماً خاضعاً للقانون الجزائري 18-07، يمنع منعاً باتاً طلب أو معالجة أو عرض أي بيانات هوية حساسة. استخدم رموز مستعارة دائماً.";

const ACADEMIC_METHODOLOGY = `
المنهجية القانونية الجزائرية:
1. التهميش: يجب وضع هوامش أسفل كل فقرة بصيغة [1] اسم المؤلف، المرجع، الصفحة.
2. التوسع في التحليل لضمان مادة علمية تعادل 20 صفحة.
`;

const MANDATORY_UPDATE_CHECK = "بروتوكول إجباري: قبل الإجابة على أي استفسار، يجب عليك مراجعة قائمة المراجع الرسمية (JORADP، وزارة الخارجية، السجل التجاري) والتحقق من وجود أي تحديثات تشريعية صدرت في آخر 10 أيام. إذا وجدت تحديثاً، يجب إعطاؤه الأولوية القصوى في الإجابة.";

const LEGAL_REASONING_RULES = `
قواعد الترجيح القانوني الإلزامية (تطبق ضمنياً دون الإفصاح عنها للمستخدم):
1. السمو الدستوري: الدستور فوق الجميع.
2. سمو المعاهدات: المعاهدات الدولية المصادق عليها تسمو على القانون (المادة 154 من الدستور).
3. قاعدة التخصص: النص الخاص يقيد النص العام.
4. قاعدة الزمن: النص اللاحق يلغي النص السابق.
5. مبدأ عدم الرجعية: القانون لا يسري إلا على ما يأتي بعده.
اعتمد هذه القواعد في حل أي تعارض قانوني يواجهك.
`;

const IDENTITY_INSTRUCTION = "يجب أن تُعرّف نفسك دائماً بأنك 'أنا مساعدك القانوني الذكي' ويُمنع منعاً باتاً استخدام صفة 'بروفيسور' أو 'مستشار بروفيسور' في أي جزء من الإجابة.";

const extractSources = (response: any) => {
  return response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
    if (chunk.web) {
      return { title: chunk.web.title || 'مرجع رسمي', url: chunk.web.uri };
    }
    return null;
  }).filter(Boolean) || [];
};

export const getLegalConsultation = async (query: string, localCorrections: LegalCorrection[] = [], files: { base64: string, mimeType: string }[] = []) => {
  const ai = getAI();
  
  const verifiedContext = localCorrections.length > 0 
    ? `\nالمعلومات التالية تم التحقق منها مسبقاً من قبل المجتمع ومطابقتها مع الجريدة الرسمية الجزائرية (JORADP)، اعتمدها كحقائق قانونية نهائية ولا تخالفها إطلاقاً:\n${localCorrections.map(c => `- الاستشارة: ${c.originalQuery} -> التصحيح القانوني المعتمد: ${c.correctedText}`).join('\n')}`
    : "";

  const fileParts = files.map(file => ({
    inlineData: { data: file.base64, mimeType: file.mimeType }
  }));

  const response = await ai.getGenerativeModel({ model: FREE_MODEL }).generateContent({
    contents: [{
      role: 'user',
      parts: [
        ...fileParts,
        { text: query + verifiedContext }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
    }
  });

  return { text: response.response.text(), sources: extractSources(response.response) };
};

export const verifyCorrectionWithGazette = async (query: string, suggestedCorrection: string) => {
  const ai = getAI();
  const model = ai.getGenerativeModel({ model: FREE_MODEL });
  
  const response = await model.generateContent({
    contents: [{
      role: 'user',
      parts: [{ text: `الاستشارة الأصلية: "${query}"\nالتصحيح المقترح من المواطن: "${suggestedCorrection}"\nقم بالتحقق من المطابقة الحرفية مع الموقع الرسمي joradp.dz.` }]
    }],
    generationConfig: {
      temperature: 0.1,
    }
  });

  const text = response.response.text();
  return { 
    isCorrect: text.includes("[تأكيد_صحيح]"), 
    verdict: text.replace("[تأكيد_صحيح]", "").replace("[رفض_خاطئ]", "").trim(),
    sources: extractSources(response.response)
  };
};

export const generateResearchStage = async (topic: string, stage: string, context: string = "") => {
  const ai = getAI();
  let prompt = "";
  if (stage === 'plan') prompt = `ضع خطة بحث أكاديمية لموضوع: ${topic}.`;
  else if (stage === 'content') prompt = `اكتب محتوى البحث لموضوع ${topic} بتوسع (20 صفحة) مع تهميش دقيق. المراجع: ${context}`;
  else if (stage === 'conclusion') prompt = `اكتب الخاتمة والمراجع لموضوع: ${topic}.`;

  const response = await ai.getGenerativeModel({ model: FREE_MODEL }).generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
    }
  });
  return response.response.text();
};

export const draftLegalContract = async (details: string) => {
  const ai = getAI();
  const response = await ai.getGenerativeModel({ model: FREE_MODEL }).generateContent({
    contents: [{ role: 'user', parts: [{ text: `صغ نموذج عقد عرفي جزائري 2026: ${details}.` }] }]
  });
  return response.response.text();
};

export const legalRadarSearch = async (query: string = "أحدث القوانين الجزائرية الصادرة في آخر 10 أيام") => {
  const ai = getAI();
  const response = await ai.getGenerativeModel({ model: FREE_MODEL }).generateContent({
    contents: [{
      role: 'user',
      parts: [{ text: `تمشيط شامل لـ joradp.dz والمواقع السيادية بخصوص: ${query}. 
    صنف النتائج حسب الفروع القانونية (قانون إداري، مدني، جنائي، عمل، إلخ).
    لكل مستجد اذكر:
    1. التصنيف القانوني (الفرع).
    2. العنوان والملخص المركز.
    3. التاريخ الدقيق.
    4. رابط مباشر للمعاينة أو التحميل (بصيغة PDF إن وجد).` }]
    }],
    generationConfig: {
      temperature: 0.1,
    }
  });
  return { text: response.response.text(), sources: extractSources(response.response) };
};

export const analyzeLegalDocument = async (files: { base64: string, mimeType: string }[], userQuery: string = "") => {
  const ai = getAI();
  const fileParts = files.map(file => ({
    inlineData: { data: file.base64, mimeType: file.mimeType }
  }));

  const response = await ai.getGenerativeModel({ model: FREE_MODEL }).generateContent({
    contents: [{
      role: 'user',
      parts: [
        ...fileParts,
        { text: `قم بتحليل هذه الوثائق الجزائرية مجتمعة وتقديم استشارة قانونية شاملة تربط بينها: ${userQuery}. ${MANDATORY_UPDATE_CHECK}` },
      ],
    }],
    generationConfig: {
      temperature: 0.1,
    }
  });
  return { text: response.response.text(), sources: extractSources(response.response) };
};
    
