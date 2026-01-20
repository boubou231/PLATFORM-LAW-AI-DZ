import { GoogleGenAI } from "@google/genai";
import { LegalCorrection } from "../types";

// تم إصلاح الخلل هنا: استخدام import.meta.env بدلاً من process.env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const getAI = () => new GoogleGenAI(apiKey);

// Switching to the free model as requested by the user.
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

// Helper to extract sources from grounding metadata
const extractSources = (response: any) => {
  return response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => {
    if (chunk.web) {
      return {
        title: chunk.web.title || 'مرجع رسمي',
        url: chunk.web.uri
      };
    }
    return null;
  }).filter(Boolean) || [];
};

export const getLegalConsultation = async (query: string, localCorrections: LegalCorrection[] = [], files: { base64: string, mimeType: string }[] = []) => {
  const genAI = getAI();
  const model = genAI.getGenerativeModel({ 
    model: FREE_MODEL,
    systemInstruction: `أنت مساعد قانوني جزائري ذكي. ${IDENTITY_INSTRUCTION} ${DATA_PROTECTION_INSTRUCTION} ${LEGAL_REASONING_RULES} ${NO_MARKDOWN_INSTRUCTION} ${ACADEMIC_METHODOLOGY} ${MANDATORY_UPDATE_CHECK}`,
  });

  const verifiedContext = localCorrections.length > 0 
    ? `\nالمعلومات التالية تم التحقق منها مسبقاً من قبل المجتمع ومطابقتها مع الجريدة الرسمية الجزائرية (JORADP)، اعتمدها كحقائق قانونية نهائية ولا تخالفها إطلاقاً:\n${localCorrections.map(c => `- الاستشارة: ${c.originalQuery} -> التصحيح القانوني المعتمد: ${c.correctedText}`).join('\n')}`
    : "";

  const fileParts = files.map(file => ({
    inlineData: { data: file.base64, mimeType: file.mimeType }
  }));

  const result = await model.generateContent([
    ...fileParts,
    query + verifiedContext
  ]);

  const response = await result.response;
  return {
    text: response.text(),
    sources: extractSources(response)
  };
};

export const verifyCorrectionWithGazette = async (query: string, suggestedCorrection: string) => {
  const genAI = getAI();
  const model = genAI.getGenerativeModel({ 
    model: FREE_MODEL,
    systemInstruction: `أنت خبير في تدقيق القوانين الجزائرية والجريدة الرسمية. مهمتك هي التحقق من صحة التصحيحات المقترحة. ${NO_MARKDOWN_INSTRUCTION}`,
  });

  const prompt = `الاستشارة الأصلية: "${query}"\nالتصحيح المقترح من المواطن: "${suggestedCorrection}"\n\nقم بالتحقق من المطابقة الحرفية مع الموقع الرسمي joradp.dz والمراجع التشريعية. إذا كان التصحيح دقيقاً، ابدأ إجابتك بكلمة [تأكيد_صحيح]، وإذا كان خاطئاً ابدأ بـ [رفض_خاطئ].`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  return {
    isCorrect: text.includes("[تأكيد_صحيح]"),
    verdict: text.replace("[تأكيد_صحيح]", "").replace("[رفض_خاطئ]", "").trim(),
    sources: extractSources(response)
  };
};

export const generateResearchStage = async (topic: string, stage: string, context: string = "") => {
  const genAI = getAI();
  const model = genAI.getGenerativeModel({ 
    model: FREE_MODEL,
    systemInstruction: `أنت باحث أكاديمي قانوني متخصص في القانون الجزائري. ${ACADEMIC_METHODOLOGY} ${NO_MARKDOWN_INSTRUCTION}`,
  });

  let prompt = "";
  if (stage === 'plan') {
    prompt = `ضع خطة بحث أكاديمية مفصلة (مقدمة، فصول، مباحث) لموضوع: ${topic}.`;
  } else if (stage === 'content') {
    prompt = `بناءً على المراجع التالية: ${context}، اكتب محتوى البحث لموضوع ${topic} بتوسع شديد مع الالتزام بالتهميش الأكاديمي الجزائري لكل فقرة.`;
  } else if (stage === 'conclusion') {
    prompt = `اكتب خاتمة البحث لموضوع ${topic} مع قائمة مراجع مفصلة مرتبة أبجدياً (قوانين، كتب، مقالات).`;
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

export const draftLegalContract = async (details: string) => {
  const genAI = getAI();
  const model = genAI.getGenerativeModel({ 
    model: FREE_MODEL,
    systemInstruction: `أنت خبير في صياغة العقود القانونية الجزائرية (مدني، تجاري، عمل). ${DATA_PROTECTION_INSTRUCTION} ${NO_MARKDOWN_INSTRUCTION}`,
  });

  const result = await model.generateContent(`قم بصياغة نموذج عقد قانوني جزائري احترافي بناءً على التفاصيل التالية: ${details}. التزم بلغة قانونية رصينة.`);
  const response = await result.response;
  return response.text();
};

export const legalRadarSearch = async (query: string = "أحدث القوانين الجزائرية الصادرة في آخر 10 أيام") => {
  const genAI = getAI();
  const model = genAI.getGenerativeModel({
    model: FREE_MODEL,
    systemInstruction: `أنت مساعد قانوني جزائري ذكي "بوت الرادار القانوني". ${IDENTITY_INSTRUCTION} مهمتك هي التصنيف الفوري للمستجدات وربطها بالجرائد الرسمية المحدثة 2026. ركز على التحديثات الصادرة في آخر 10 أيام. ${LEGAL_REASONING_RULES} ${NO_MARKDOWN_INSTRUCTION}`,
  });

  const result = await model.generateContent([
    { text: `تمشيط شامل لـ joradp.dz والمواقع السيادية بخصوص: ${query}. 
    صنف النتائج حسب الفروع القانونية (قانون إداري، مدني، جنائي، عمل، إلخ).
    لكل مستجد اذكر:
    1. التصنيف القانوني (الفرع).
    2. العنوان والملخص المركز.
    3. التاريخ الدقيق.
    4. رابط مباشر للمعاينة أو التحميل (بصيغة PDF إن وجد).` }
  ]);

  const response = await result.response;
  return { text: response.text(), sources: extractSources(response) };
};

export const analyzeLegalDocument = async (files: { base64: string, mimeType: string }[], userQuery: string = "") => {
  const genAI = getAI();
  const model = genAI.getGenerativeModel({
    model: FREE_MODEL,
    systemInstruction: `أنت مساعد قانوني جزائري ذكي متخصص في تحليل الوثائق المتعددة. ${IDENTITY_INSTRUCTION} راجع الوثائق بدقة واستخرج المخاطر أو الالتزامات القانونية. ${MANDATORY_UPDATE_CHECK}`,
  });
  
  const fileParts = files.map(file => ({
    inlineData: { data: file.base64, mimeType: file.mimeType }
  }));

  const result = await model.generateContent([
    ...fileParts,
    { text: `قم بتحليل هذه الوثائق الجزائرية مجتمعة وتقديم استشارة قانونية شاملة تربط بينها: ${userQuery}. ${MANDATORY_UPDATE_CHECK}` },
  ]);

  const response = await result.response;
  return { text: response.text(), sources: extractSources(response) };
};
