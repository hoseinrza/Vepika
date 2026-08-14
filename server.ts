import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini if key exists
  const getGeminiClient = () => {
    if (!process.env.GEMINI_API_KEY) {
      return null;
    }
    return new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI SEO Generator & Optimizer endpoint
  app.post('/api/gemini/generate-seo', async (req, res) => {
    try {
      const { title, content, category, focusKeyword } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        // Fallback rule-based SEO generator if no API key is provided
        const plainText = (content || '').replace(/[#*`_[\]()-]/g, ' ').replace(/\s+/g, ' ').trim();
        const excerpt = plainText.slice(0, 155) + (plainText.length > 155 ? '...' : '');
        const generatedSlug = (title || 'article')
          .toLowerCase()
          .replace(/[^\u0600-\u06FFa-zA-Z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 60);

        return res.json({
          metaTitle: `${title || 'مقاله آموزشی'} | وبلاگ لاله زار`,
          metaDescription: excerpt || `راهنمای جامع و کاربردی ${title || 'موضوع آموزشی'} به همراه مثال‌های عملی و نکات کلیدی.`,
          focusKeyword: focusKeyword || title?.split(' ')?.[0] || 'آموزش',
          slug: generatedSlug,
          tags: ['آموزش', category || 'تکنولوژی', 'راهنما', 'توسعه وب'],
          faqs: [
            {
              question: `هدف اصلی این مقاله در مورد «${title || 'موضوع'}» چیست؟`,
              answer: `این مقاله به صورت گام‌به‌گام مفاهیم کلیدی و راهکارهای اجرایی را برای علاقه‌مندان توضیح می‌دهد.`
            },
            {
              question: `پیش‌نیاز یادگیری این مبحث چیست؟`,
              answer: `آشنایی اولیه با مفاهیم پایه و انگیزه برای یادگیری عملی کافی است.`
            }
          ],
          aiEnhanced: false,
        });
      }

      const prompt = `شما یک متخصص حرفه‌ای سئو (SEO Specialist) و تولید محتوای وب فارسی هستید.
لطفاً برای مقاله زیر با مشخصات داده شده، بهترین مقادیر بهینه‌سازی سئو، متاتگ‌ها و اسکیما را به زبان فارسی استخراج کن:

عنوان مقاله: ${title || 'بدون عنوان'}
دسته‌بندی: ${category || 'عمومی'}
کلمه کلیدی مد نظر: ${focusKeyword || 'تعیین نشده'}
بخشی از محتوا:
${(content || '').slice(0, 1500)}

لطفاً پاسخ را دقیقاً در قالب فرمت JSON زیر (بدون هیچ متن اضافی قبل یا بعد از آن) ارسال کن:
{
  "metaTitle": "عنوان سئو جذاب و بهینه حداکثر ۶۰ کاراکتر",
  "metaDescription": "توضیحات متا جذاب و دعوت‌کننده به کلیک بین ۱۳۰ تا ۱۵۵ کاراکتر",
  "focusKeyword": "بهترین کلمه کلیدی اصلی مقاله",
  "slug": "اسلاگ-مناسب-فارسی-یا-انگلیسی-کوتاه",
  "tags": ["تگ۱", "تگ۲", "تگ۳", "تگ۴"],
  "faqs": [
    {
      "question": "سوال متداول ۱ در ارتباط با مقاله",
      "answer": "پاسخ کوتاه و مفید به سوال ۱"
    },
    {
      "question": "سوال متداول ۲ در ارتباط با مقاله",
      "answer": "پاسخ کوتاه و مفید به سوال ۲"
    }
  ],
  "seoAdvice": "توصیه و نکته کوتاه برای بهبود رتبه مقاله در گوگل"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const parsed = JSON.parse(text);
      res.json({ ...parsed, aiEnhanced: true });
    } catch (err: any) {
      console.error('Gemini SEO error:', err);
      res.status(500).json({ error: err.message || 'خطا در پردازش با هوش مصنوعی' });
    }
  });

  // AI Content Assistant endpoint (generate outlines, improve writing)
  app.post('/api/gemini/assist-content', async (req, res) => {
    try {
      const { prompt: userPrompt, topic, action } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          result: `## سرفصل‌های پیشنهادی برای «${topic || 'موضوع مورد نظر'}»\n\n1. مقدمه و چرایی اهمیت موضوع\n2. مفاهیم اولیه و تعاریف کلیدی\n3. راهنمای گام‌به‌گام و ابزارهای مورد نیاز\n4. اشتباهات رایج و نحوه رفع آنها\n5. جمع‌بندی و نتیجه‌گیری\n\n> نکته: برای نتایج دقیق‌تر هوش مصنوعی، کلید API متصل است.`,
          aiEnhanced: false,
        });
      }

      let systemPrompt = 'شما یک نویسنده و مدرس تخصصی محتوای وبلاگ آموزشی به زبان فارسی با لحن روان، شیوا و خوانا هستید.';
      let query = userPrompt;

      if (action === 'generate-outline') {
        query = `یک ساختار سرفصل کامل و جذاب برای مقاله آموزشی با موضوع «${topic}» به زبان فارسی با فرمت مارک‌داون شامل مقدمه، تیترهای اصلی H2 و زیرعنوان‌های H3 و بخش نتیجه‌گیری بنویس.`;
      } else if (action === 'summarize') {
        query = `متن زیر را به صورت یک خلاصه موجز، روان و جذاب برای درج در پیش‌نمایش کارت مقاله بازنویسی کن:\n\n${userPrompt}`;
      } else if (action === 'improve-persian') {
        query = `متن زیر را از نظر نگارش زبان فارسی، شیوایی، نیم‌فاصله‌ها و خوانایی برای یک مقاله وبلاگی بازنویسی و زیباتر کن:\n\n${userPrompt}`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: query,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      res.json({ result: response.text, aiEnhanced: true });
    } catch (err: any) {
      console.error('Gemini Content assist error:', err);
      res.status(500).json({ error: err.message || 'خطا در ارتباط با سرور' });
    }
  });

  // Vite middleware for development vs Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`وب‌سرور وبلاگ آموزشی در پورت ${PORT} با موفقیت اجرا شد.`);
  });
}

startServer();
