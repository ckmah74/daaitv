/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy-initialize Gemini Client
let googleAI: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!googleAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      try {
        googleAI = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      } catch (e) {
        console.error("Failed to initialize GoogleGenAI client:", e);
      }
    }
  }
  return googleAI;
}

// Fallback STATIC Program Schedule
const FALLBACK_PROGRAMS_EN = [
  {
    title: "Sanubari Teduh (Calm Contemplation)",
    time: "06:00 - 06:30",
    duration: 30,
    category: "Wisdom",
    host: "Dewi Kartika",
    description: "Start your morning with inspiring, calm reflection and humanistic wisdom about daily mindfulness and peace."
  },
  {
    title: "Meningkatkan Karakter Anak (Children's Character)",
    time: "07:30 - 08:15",
    duration: 45,
    category: "Education",
    host: "Budi Santoso",
    description: "Interactive storytelling that instills universal humanistic values, respect, and filial piety in children."
  },
  {
    title: "Dapur Harmoni (Veggie Kitchen Showcase)",
    time: "11:30 - 12:15",
    duration: 45,
    category: "Vegetarian",
    host: "Chef William & Sis Lily",
    description: "Healthy, eco-friendly plant-based alternatives that nourish your body while protecting our mother earth."
  },
  {
    title: "Kisah Kasih DAAI (Stories of Great Love)",
    time: "14:00 - 15:00",
    duration: 60,
    category: "Drama",
    host: "Tzu Chi Drama Ensemble",
    description: "A professional cinematic drama presentation based on real-life stories of Tzu Chi volunteers and their journeys of mercy."
  },
  {
    title: "Buletin DAAI TV Live (Compassion News)",
    time: "19:00 - 19:45",
    duration: 45,
    category: "News",
    host: "Lidya Natalia & Hendra Wijaya",
    description: "Global news with a focus on compassion, disaster relief, post-disaster recovery, and positive social initiatives."
  },
  {
    title: "Lentera Kehidupan (Life Wisdom Teachings)",
    time: "20:00 - 21:00",
    duration: 60,
    category: "Wisdom",
    host: "Master Cheng Yen Teachings",
    description: "Profound guidance on the Bodhisattva path, explaining Buddhist philosophies with simplicity and compassionate action."
  }
];

const FALLBACK_PROGRAMS_ZH = [
  {
    title: "《靜思晨語。薰法香》 (Calm Contemplation)",
    time: "06:00 - 06:30",
    duration: 30,
    category: "Wisdom",
    host: "德凡法師 / 靜思弟子",
    description: "清晨薰法香，恭聽證嚴上人開示法華經妙義。洗滌塵垢，回歸清淨本性，開啟一天的慈悲智慧與正知見。"
  },
  {
    title: "《菩提心要》 (Children's Character & Education)",
    time: "07:30 - 08:15",
    duration: 45,
    category: "Education",
    host: "慈濟大愛主播",
    description: "以生動的真實案例與紀錄片段，引導學童與家長體會感恩、尊重與愛。寓教於樂，長養孩子純真的赤子之心。"
  },
  {
    title: "《香積廚房 / 蔬食美學》 (Veggie Kitchen Showcase)",
    time: "11:30 - 12:15",
    duration: 45,
    category: "Vegetarian",
    host: "主廚威廉 & 莉莉阿姨",
    description: "推廣精緻、健康、零負擔的無肉蔬食美學。從產地到餐桌，教您如何吃得營養、吃得慈悲，為守護地球盡一份心力。"
  },
  {
    title: "《大愛劇場 / 慈濟真實故事》 (True Great Love Drama)",
    time: "14:00 - 15:00",
    duration: 60,
    category: "Drama",
    host: "大愛藝術劇團",
    description: "取材自全球慈濟志工生平的真實人生編製而成的感人電視劇，探討家庭和樂、跨越逆境，以及用愛化解仇恨的心路歷程。"
  },
  {
    title: "《全球慈濟大愛新聞》 (Compassionate World News)",
    time: "19:00 - 19:45",
    duration: 45,
    category: "News",
    host: "新聞主播 麗迪雅 & 亨德拉",
    description: "秉持客觀、祥和、導向正面善意的全球新聞報導。傳遞國際賑災最新動態、骨髓捐贈、環保減碳等充滿大愛的光明消息。"
  },
  {
    title: "《人間菩提 / 證嚴法師開示》 (Life Wisdom Teachings)",
    time: "20:00 - 21:00",
    duration: 60,
    category: "Wisdom",
    host: "釋證嚴上人 (Master Cheng Yen)",
    description: "恭聽證嚴上人對時事與世間疾苦的慈悲開示。引導人人發揮心中本具的慈悲與克己精神，化人心為祥和，福慧雙修。"
  }
];

// Fallback STATIC News Items
const FALLBACK_NEWS_EN = [
  {
    id: "news-1",
    title: "Sumbangsih Kasih: Tzu Chi Distributes Relief for Floods",
    summary: "Dedicated volunteers braved high waters to bring hot meals, medical supplies, and sanitary kits to hundreds of affected families, expressing care through direct actions.",
    date: "May 31, 2026",
    location: "Jakarta, Indonesia",
    category: "Disaster Relief"
  },
  {
    id: "news-2",
    title: "Depo Pelestarian Lingkungan Reaches 10 Tons Recyclables Milestone",
    summary: "Local community volunteers join hands to turn trash into gold and gold into help, processing tons of plastics to fund dialysis assistance programs.",
    date: "May 29, 2026",
    location: "Medan, Indonesia",
    category: "Environmentalism"
  },
  {
    id: "news-3",
    title: "Cataract Surgery Charity Day Restores Vision for 250 Elderly Patients",
    summary: "DAAI TV journalists document the emotional moments as bandaged eyes are unsealed, revealing tears of joy and renewed hopes for impoverished village elders.",
    date: "May 25, 2026",
    location: "Surabaya, Indonesia",
    category: "Medical Charity"
  },
  {
    id: "news-4",
    title: "Inspiring Vegetarianism: Youth Green Living Festival Launches",
    summary: "A vibrant campaign aiming to decrease carbon footprints by demonstrating modern delicious plant-based culinary skills.",
    date: "May 20, 2026",
    location: "Bandung, Indonesia",
    category: "Veggie Advocacy"
  }
];

const FALLBACK_NEWS_ZH = [
  {
    id: "news-1",
    title: "【賑災救助】發放溫熱愛心：慈濟志工涉水為災民送上熱食",
    summary: "面對突如其來的嚴重澇災，大批慈濟志工不畏水深，將新鮮烹調的熱便當、衛生包與急需醫療乾淨水源送達千戶人家。",
    date: "2026年5月31日",
    location: "印尼雅加達",
    category: "Disaster Relief"
  },
  {
    id: "news-2",
    title: "【環保人文】Depo環保教育站資源回收量突破十噸大關",
    summary: "社區志工與老少居民分工合作，落實「垃圾變黃金，黃金變愛心」理念。所有回收變賣所得將全數資助弱勢病患洗腎項目。",
    date: "2026年5月29日",
    location: "印尼棉蘭",
    category: "Environmentalism"
  },
  {
    id: "news-3",
    title: "【守護健康】白內障慈善義診 幫助250名孤貧長者重見光明",
    summary: "慈濟義診醫療團隊深入鄉間開刀復明。當白色紗布緩緩揭開，銀髮長輩紛紛流下感激淚水，重燃對人生未來的生機與期盼。",
    date: "2026年5月25日",
    location: "印尼泗水",
    category: "Medical Charity"
  },
  {
    id: "news-4",
    title: "【茹素愛地球】青年綠色蔬食節盛大開幕 萬名群眾響應支持",
    summary: "藉由青年主廚現場創意的法式健康料理演示，廣大市民親身體驗了茹素的清爽與美味，誓言用筷子一餐餐為地球退燒。",
    date: "2026年5月20日",
    location: "印尼萬隆",
    category: "Veggie Advocacy"
  }
];

// Endpoint: Dynamic or Fallback TV Program Schedule
app.get("/api/gemini/programs", async (req, res) => {
  const userTime = req.query.time || new Date().toISOString();
  const lang = req.query.lang === "zh" ? "zh" : "en";
  const ai = getAI();

  const fallbacks = lang === "zh" ? FALLBACK_PROGRAMS_ZH : FALLBACK_PROGRAMS_EN;

  if (!ai) {
    console.log(`No Gemini API key. Returning high-quality fallback programs (${lang}).`);
    return res.json({ source: "fallback", data: fallbacks });
  }

  try {
    const isChinese = lang === "zh";
    const prompt = `Create a list of 6 realistic humanistic TV programs for DAAI TV based on current timestamp ${userTime}.
    The programs must cover humanism, Tzu Chi compassionate actions, environmental preservation (recycling), daily life wisdom, children character development, or vegetarian wellness.
    Ensure they have diverse realistic timings. 
    Language requirement: Generate the responses strictly in ${isChinese ? "Traditional Chinese (繁體中文)" : "English (with Indonesian references)"}.
    Produce a JSON array of scheduled programs.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: isChinese 
          ? "你是一名為大愛電視台（DAAI TV）作節目編排安排的資深編導。請嚴格以繁體中文（Traditional Chinese）返回節目單的標題、類別、主持、描述，不要返回英文，並確保符合JSON結構。"
          : "You are a TV scheduler for DAAI TV, a multi-award winning humanistic television channel based on Tzu Chi's 'Great Love' values. Output JSON matching the requested schema in English.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of scheduled programs",
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Program title" },
              time: { type: Type.STRING, description: "Formatted duration, e.g. '08:30 - 09:15'" },
              duration: { type: Type.INTEGER, description: "Duration in minutes" },
              category: { 
                type: Type.STRING, 
                description: "Must be a humanitarian category like: Humanism, Education, News, Vegetarian, Drama, Wisdom" 
              },
              host: { type: Type.STRING, description: "Name of the hosts or presenters" },
              description: { type: Type.STRING, description: "Short description highlighting the humanistic context" }
            },
            required: ["title", "time", "duration", "category", "host", "description"]
          }
        },
        temperature: 1.0,
      }
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text.trim());
      return res.json({ source: "gemini", data: parsed });
    } else {
      throw new Error("Empty text returned from Gemini");
    }
  } catch (error) {
    console.error("Gemini program schedule generation failed. Sending fallback data:", error);
    return res.json({ source: "fallback", data: fallbacks });
  }
});

// Endpoint: Dynamic or Fallback Compassion News
app.get("/api/gemini/news", async (req, res) => {
  const lang = req.query.lang === "zh" ? "zh" : "en";
  const ai = getAI();

  const fallbacks = lang === "zh" ? FALLBACK_NEWS_ZH : FALLBACK_NEWS_EN;

  if (!ai) {
    return res.json({ source: "fallback", data: fallbacks });
  }

  try {
    const isChinese = lang === "zh";
    const prompt = `List 4 latest simulated high-fidelity humanitarian news updates for DAAI TV and Tzu Chi Foundation activities worldwide.
    Each news item must detail compassionate volunteerism, disaster alleviation, environmental preservation, bone marrow donation, or medical missions.
    Language requirement: Generate the headlines, summaries, and categories strictly in ${isChinese ? "Traditional Chinese (繁體中文)" : "English with localized Indonesian touch"}.
    Return JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: isChinese 
          ? "你是大愛電視台（DAAI TV）世界新聞主編。請嚴格以繁體中文（Traditional Chinese）製作極富溫度與人文關懷的溫馨志工賑災新聞，格式需符合JSON約束。"
          : "You are an editor for DAAI TV World News. Produce a JSON array documenting heartwarming humanitarian responses with local flavor in English.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING, description: "Positive humanitarian headline" },
              summary: { type: Type.STRING, description: "1-2 sentence detailed summary of what was accomplished" },
              date: { type: Type.STRING },
              location: { type: Type.STRING, description: "City and region" },
              category: { type: Type.STRING, description: "Relief, Medical, Environmental, Education etc." }
            },
            required: ["id", "title", "summary", "date", "location", "category"]
          }
        }
      }
    });

    if (response && response.text) {
      const parsed = JSON.parse(response.text.trim());
      return res.json({ source: "gemini", data: parsed });
    } else {
      throw new Error("Empty news from Gemini");
    }
  } catch (error) {
    console.error("Failed to generate dynamic news, sending fallback:", error);
    return res.json({ source: "fallback", data: fallbacks });
  }
});

// Endpoint: Interactive Compassionate Chat AI
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history, lang } = req.body;
  const isChinese = lang === "zh";
  const ai = getAI();

  if (!message) {
    return res.status(400).json({ error: "No message supplied" });
  }

  if (!ai) {
    // Elegant fallback simulation
    let reply = "";
    if (isChinese) {
      reply = "感恩您的留言。大愛電視台（DAAI TV）致力於傳播大愛與清淨人文智慧。讓我們攜手守護大地，淨化人心，祝福您身心安祥、法喜充滿！";
      const msgLower = message.toLowerCase();
      if (msgLower.includes("你好") || msgLower.includes("hello") || msgLower.includes("hi") || msgLower.includes("您好")) {
        reply = "歡迎來到大愛電視指南智能助理！我是您的心靈同伴。今天我可以協助您查找法師開示、素食健康妙招、環保回收站或大愛劇場節目時間表。";
      } else if (msgLower.includes("素食") || msgLower.includes("吃素") || msgLower.includes("蔬食") || msgLower.includes("vege")) {
        reply = "茹素能守護眾生靈、節能減碳，為地球降溫！我們的《香積廚房》在每天11:30播出，為您展示既健康又美味的精緻蔬食食譜，歡迎收看。";
      } else if (msgLower.includes("慈濟") || msgLower.includes("上人") || msgLower.includes("基金會")) {
        reply = "慈濟基金會由證嚴上人於1966年在台灣創立。四大志業包括慈善、醫療、教育、人文。大愛電視即為人文志業窗口，向世界呈現源源不絕的慈悲力量。";
      } else if (msgLower.includes("觀看") || msgLower.includes("電視") || msgLower.includes("頻道") || msgLower.includes("daai")) {
        reply = "您可以在此客戶端內直接觀看大愛電視 Live 與大愛電視二台！使用您的遙控器或鍵盤箭頭方向鍵選擇「電視直播」進行播放與切換。";
      }
    } else {
      reply = "Terima kasih atas pesan Anda. DAAI TV menyebarkan cinta kasih universal (Great Love). Mari terus dukung kelestarian bumi dan keharmonisan masyarakat!";
      const msgLower = message.toLowerCase();
      if (msgLower.includes("how") || msgLower.includes("hello") || msgLower.includes("hi")) {
        reply = "Welcome to DAAI TV Android TV Guide! I am your companion. How can I help you navigate master teachings, vegetarian habits, recycling hubs, or news schedules today?";
      } else if (msgLower.includes("vegetarian") || msgLower.includes("makan") || msgLower.includes("vege")) {
        reply = "Eating vegetarian helps protect the earth and spares living beings! Our show 'Dapur Harmoni' airs at 11:30 daily with healthy, inspiring plant-based recipes.";
      } else if (msgLower.includes("tzu chi") || msgLower.includes("master.cheng yen") || msgLower.includes("yayasan")) {
        reply = "Tzu Chi was founded by Dharma Master Cheng Yen in 1966. Its four main missions are charity, medicine, education, and humanistic culture. DAAI TV serves as the voice of humanistic culture.";
      } else if (msgLower.includes("channel") || msgLower.includes("watch") || msgLower.includes("youtube") || msgLower.includes("daai")) {
        reply = "You can watch DAAI TV directly through this app! Use your arrow keys to select 'DAAI TV' or other curated streams on the screen. Press enter to play.";
      }
    }
    return res.json({ source: "fallback", reply });
  }

  try {
    // Construct chat history context for Gemini
    const systemInstruction = isChinese
      ? "你是大愛電視（DAAI TV）心靈輔導陪伴AI。你的語氣非常謙和、禮貌、溫柔慈悲、充滿正能量和啟發性。" +
        "你會向用戶解說慈濟大愛精神、證嚴上人的法水妙語、素食救地球的好處、環保減塑的具體行動。" +
        "請務必使用繁體中文（Traditional Chinese）回答，且回答力求簡潔精煉（不超過3到4句話），以便於電視屏幕上閱讀。"
      : "You are the DAAI TV Companion AI, an assistant embedded in an Android TV interface. " +
        "Your tone is polite, gentle, deeply compassionate, encouraging, and informative. " +
        "You explain Tzu Chi's humanistic values, great love philosophy, master Cheng Yen's advice, vegetarian lifestyles, " +
        "and you help guide users to watch DAAI TV broadcasts. Keep answers compact (max 3-4 sentences) so they read well on a TV screen.";

    // Simplify history for API format
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      history.slice(-6).forEach((h: any) => {
        formattedContents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents as any,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    return res.json({ source: "gemini", reply: response.text || "我心存感恩，讓我們用心聆聽彼此，請您重試。" });
  } catch (error) {
    console.error("Gemini chat error, sending fallback:", error);
    return res.json({ 
      source: "fallback_error", 
      reply: isChinese 
        ? "我們心存感恩，無奈當前志願服務線路繁忙。請深吸氣、保持善念！我能如何幫您尋找今日節目安排呢？" 
        : "We are currently experiencing heavy volunteer services. Keep cultivating great love in your heart! How can I help you find schedules?" 
    });
  }
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static hosting
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[DAAI TV Server] Running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
