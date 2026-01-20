
import { GoogleGenAI } from "@google/genai";
import { LegalCorrection } from "../types";

// Always use named parameter for apiKey and use process.env.API_KEY directly.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-1.5-flash for complex reasoning tasks as per guidelines.
const PRO_MODEL = 'gemini-1.5-flash';

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

// Helper to extract sources from grounding metadata as per MUST REQUIREMENT for googleSearch.
const extractSources = (response: any) => {
  return response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
    if (chunk.web) {
      return { title: chunk.web.title || 'مرجع رسمي', url: chunk.web.uri };
    }
    return null;
  }).filter(Boolean) || [];
};

export const getLegalConsultation = async (query: string, localCorrections: LegalCorrection[] = []) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: PRO_MODEL,
    contents: query,
    config: {
      systemInstruction: `أنت مساعد قانوني جزائري ذكي. ${IDENTITY_INSTRUCTION} ${MANDATORY_UPDATE_CHECK} ${LEGAL_REASONING_RULES} قم بتصنيف الإجابة حسب الفرع القانوني (مدني، جنائي، إداري، إلخ). استند حصراً للجريدة الرسمية الجزائرية 2026. ${DATA_PROTECTION_INSTRUCTION} ${NO_MARKDOWN_INSTRUCTION}`,
      tools: [{ googleSearch: {} }],
      temperature: 0.1,
    },
  });
  return { text: response.text, sources: extractSources(response) };
};

export const verifyCorrectionWithGazette = async (query: string, suggestedCorrection: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: PRO_MODEL,
    contents: `المسألة القانونية: "${query}"\nالنص المراد التحقق منه: "${suggestedCorrection}"\nقم بالتحقق من المطابقة الحرفية مع joradp.dz.`,
    config: {
      systemInstruction: `أنت مدقق قانوني. ${IDENTITY_INSTRUCTION} عند تفعيل 'التحقيق المجتمعي'، لا تعتمد أي إجابة أو تعديل إلا بعد مطابقته حرفياً مع نص الجريدة الرسمية الجزائرية. إذا وجدت تعارضاً بين مدخلات المستخدم والجريدة الرسمية، ارفض الإجابة فوراً واذكر رقم العدد والمادة الرسمية كدليل على الرفض. ابدأ ردك بكلمة [تأكيد_صحيح] في حالة المطابقة التامة أو [رفض_خاطئ] في حالة وجود تعارض. ${NO_MARKDOWN_INSTRUCTION}`,
      tools: [{ googleSearch: {} }],
      temperature: 0.1,
    },
  });
  const text = response.text;
  return { 
    isCorrect: text.includes("[تأكيد_صحيح]"), 
    verdict: text.replace("[تأكيد_صحيح]", "").replace("[رفض_خاطئ]", "").trim(),
    sources: extractSources(response)
  };
};

export const generateResearchStage = async (topic: string, stage: string, context: string = "") => {
  const ai = getAI();
  let prompt = "";
  if (stage === 'plan') prompt = `ضع خطة بحث أكاديمية لموضوع: ${topic}.`;
  else if (stage === 'content') prompt = `اكتب محتوى البحث لموضوع ${topic} بتوسع (20 صفحة) مع تهميش دقيق. المراجع: ${context}`;
  else if (stage === 'conclusion') prompt = `اكتب الخاتمة والمراجع لموضوع: ${topic}.`;

  const response = await ai.models.generateContent({
    model: PRO_MODEL,
    contents: prompt,
    config: {
      systemInstruction: `أنت مساعد قانوني جزائري ذكي متخصص في البحوث الأكاديمية. ${IDENTITY_INSTRUCTION} ${MANDATORY_UPDATE_CHECK} ${LEGAL_REASONING_RULES} ${ACADEMIC_METHODOLOGY} ${DATA_PROTECTION_INSTRUCTION} ${NO_MARKDOWN_INSTRUCTION}`,
      tools: [{ googleSearch: {} }],
      temperature: 0.2,
    },
  });
  return response.text;
};

export const draftLegalContract = async (details: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: PRO_MODEL,
    contents: `صغ نموذج عقد عرفي جزائري 2026: ${details}.`,
    config: { 
      systemInstruction: `أنت مساعد قانوني جزائري ذكي متخصص في صياغة العقود. ${IDENTITY_INSTRUCTION} ${MANDATORY_UPDATE_CHECK} ${LEGAL_REASONING_RULES} تأكد من مراجعة القوانين الصادرة في آخر 10 أيام بخصوص هذا العقد. ${DATA_PROTECTION_INSTRUCTION} ${NO_MARKDOWN_INSTRUCTION}`,
      tools: [{ googleSearch: {} }]
    },
  });
  return response.text;
};

export const legalRadarSearch = async (query: string = "أحدث القوانين الجزائرية الصادرة في آخر 10 أيام") => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: PRO_MODEL,
    contents: `تمشيط شامل لـ joradp.dz والمواقع السيادية بخصوص: ${query}. 
    صنف النتائج حسب الفروع القانونية (قانون إداري، مدني، جنائي، عمل، إلخ).
    لكل مستجد اذكر:
    1. التصنيف القانوني (الفرع).
    2. العنوان والملخص المركز.
    3. التاريخ الدقيق.
    4. رابط مباشر للمعاينة أو التحميل (بصيغة PDF إن وجد).`,
    config: {
      systemInstruction: `أنت مساعد قانوني جزائري ذكي "بوت الرادار القانوني". ${IDENTITY_INSTRUCTION} مهمتك هي التصنيف الفوري للمستجدات وربطها بالجرائد الرسمية المحدثة 2026. ركز على التحديثات الصادرة في آخر 10 أيام. ${LEGAL_REASONING_RULES} ${NO_MARKDOWN_INSTRUCTION}`,
      tools: [{ googleSearch: {} }],
      temperature: 0.1,
    },
  });
  return { text: response.text, sources: extractSources(response) };
};

export const analyzeLegalDocument = async (files: { base64: string, mimeType: string }[], userQuery: string = "") => {
  const ai = getAI();
  
  // Convert all files to parts readable by the model
  const fileParts = files.map(file => ({
    inlineData: { data: file.base64, mimeType: file.mimeType }
  }));

  const response = await ai.models.generateContent({
    model: PRO_MODEL,
    contents: {
      parts: [
        ...fileParts,
        { text: `قم بتحليل هذه الوثائق الجزائرية مجتمعة وتقديم استشارة قانونية شاملة تربط بينها: ${userQuery}. ${MANDATORY_UPDATE_CHECK}` },
      ],
    },
    config: {
      systemInstruction: `أنت مساعد قانوني جزائري ذكي متخصص في تحليل الوثائق المتعددة. ${IDENTITY_INSTRUCTION} راجع مستجدات آخر 10 أيام قبل التحليل. قارن بين الوثائق المرفوعة إذا كانت تنتمي لنفس الملف القانوني. ${LEGAL_REASONING_RULES} ${NO_MARKDOWN_INSTRUCTION}`,
      tools: [{ googleSearch: {} }],
      temperature: 0.1,
    },
  });
  return { text: response.text, sources: extractSources(response) };
};
