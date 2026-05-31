/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Tv, 
  Calendar, 
  Newspaper, 
  Sparkles, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  MessageSquare, 
  CornerDownLeft, 
  Clock, 
  Heart, 
  Info, 
  Globe, 
  Activity,
  Grid,
  Wifi
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Channel, Program, NewsItem, SidebarItem, ChatMessage } from "./types";

// Curated Bilingual Android TV Channel database (supports automatic language toggles)
const CURATED_CHANNELS_EN: Channel[] = [
  {
    id: "daai-indo",
    name: "DAAI TV",
    videoUrl: "https://www.youtube.com/watch?v=pM-1ytfQhos",
    embedId: "pM-1ytfQhos",
    category: "Live Stream",
    subtitle: "Main Channel - Purifying Hearts, Calming Souls",
    description: "Live broadcast of DAAI TV Indonesia, presenting humanitarian stories, compassionate values, environmental preservation, inspiring true life dramas, and mindful moral education.",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "daai-tv2",
    name: "DAAI TV 2 Live",
    videoUrl: "https://www.youtube.com/watch?v=QDxRJP-wfeI",
    embedId: "QDxRJP-wfeI",
    category: "Live Stream",
    subtitle: "DAAI TV 2 - Illuminating the World with Love",
    description: "DAAI TV 2 provides a secondary high-definition humanitarian broadcast channel, bringing Great Love dramas, health preservation tips, global volunteer deeds, and pure educational values to worldwide viewers.",
    thumbnail: "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "daai-taiwan",
    name: "DAAI Drama Channel",
    videoUrl: "https://www.youtube.com/watch?v=vOnC6RlypC0",
    embedId: "vOnC6RlypC0",
    category: "True Drama",
    subtitle: "Stories of Great Love - Tzu Chi Dramas",
    description: "Outstanding dramas based on the real-life biographies of Tzu Chi volunteers globally. Portrays overcoming family challenges, practicing filial piety, and conducting selfless acts of charity.",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "life-wisdom",
    name: "Life Wisdom Daily",
    videoUrl: "https://www.youtube.com/watch?v=JvI74A-7Z0E",
    embedId: "JvI74A-7Z0E",
    category: "Wisdom Teachings",
    subtitle: "Weekly Wisdom - Teachings of Master Cheng Yen",
    description: "Inspiring talks by Dharma Master Cheng Yen directing viewers toward continuous spiritual mindfulness, kindness in speech, daily charitable volunteerism, and responding to global climate and safety issues.",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "veggie-kitchen",
    name: "Dapur Harmoni Vegetarian",
    videoUrl: "https://www.youtube.com/watch?v=OidN4yW4o4o",
    embedId: "OidN4yW4o4o",
    category: "Vegetarian Habits",
    subtitle: "Healthy Green Culinary - Save the Earth",
    description: "Creative plant-based wellness recipes designed to enrich physical health, support ecological sustainability, and foster compassionate protection for all living creatures.",
    thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "child-education",
    name: "Character Education",
    videoUrl: "https://www.youtube.com/watch?v=t_YIidS7r3o",
    embedId: "t_YIidS7r3o",
    category: "Child Guidance",
    subtitle: "Universal Ethics - Respect & Social Harmony",
    description: "Interactive storytelling, gentle songs, and positive child-friendly animations helping to nurture daily empathy, respect toward family elders, and harmonious relationships.",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&q=80"
  }
];

const CURATED_CHANNELS_ZH: Channel[] = [
  {
    id: "daai-indo",
    name: "大愛電視台直播",
    videoUrl: "https://www.youtube.com/watch?v=pM-1ytfQhos",
    embedId: "pM-1ytfQhos",
    category: "電視直播",
    subtitle: "大愛台 - 淨化人心，清涼心靈",
    description: "印尼大愛電視台（DAAI TV）直播信號，傳遞全球慈悲與人文善因、孝道、環保、大愛劇場等精彩紀實，為廣大海外觀眾帶來清涼心靈的清醇源泉。",
    thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "daai-tv2",
    name: "大愛電視二台 Live",
    videoUrl: "https://www.youtube.com/watch?v=QDxRJP-wfeI",
    embedId: "QDxRJP-wfeI",
    category: "電視直播",
    subtitle: "大愛二台 - 行善美善流傳",
    description: "大愛電視二台（DAAI TV 2）是致力於推廣全球慈幼、醫療慈悲救助與海外行善精神的另一個高清直播窗口。全天候播放真善美故事，啟迪心中大愛。",
    thumbnail: "https://images.unsplash.com/photo-1461151304267-38535e780c79?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "daai-taiwan",
    name: "大愛劇場劇集頻道",
    videoUrl: "https://www.youtube.com/watch?v=vOnC6RlypC0",
    embedId: "vOnC6RlypC0",
    category: "精品劇場",
    subtitle: "大愛劇場 - 真實人生感人演繹",
    description: "精心挑選自真實慈濟志工歷程改編的高分人情大戲。在點滴溫情與孝悌傳家中領會命運的轉折，引導觀眾知恩、感恩、報恩，活出人生最澄淨的價值。",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "life-wisdom",
    name: "人間菩提每日智慧",
    videoUrl: "https://www.youtube.com/watch?v=JvI74A-7Z0E",
    embedId: "JvI74A-7Z0E",
    category: "大師開示",
    subtitle: "靜思妙語 - 證嚴法師法水精選",
    description: "匯聚證嚴法師每日人間菩提開示。以大菩提心觀照芸芸眾生遭遇之自然災害、生老病死與心理困局，為迷茫俗世指示一條克己復禮、慈悲利他的康莊大道。",
    thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "veggie-kitchen",
    name: "香積廚房素食大師",
    videoUrl: "https://www.youtube.com/watch?v=OidN4yW4o4o",
    embedId: "OidN4yW4o4o",
    category: "蔬食環保",
    subtitle: "用愛烹飪 - 護生減碳新餐桌",
    description: "極富創意的植物性烹飪視頻秀。教您如何用最天然樸素的五穀雜糧與有機果蔬，打造美味、營養滿分的慈悲素宴，保護眾生靈，更為減慢全球變暖盡心力。",
    thumbnail: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: "child-education",
    name: "兒童人文化育教育",
    videoUrl: "https://www.youtube.com/watch?v=t_YIidS7r3o",
    embedId: "t_YIidS7r3o",
    category: "大智慈幼",
    subtitle: "幼兒美德 - 禮貌與慈悲心生根",
    description: "專為學齡兒童設計的人文品德啟盟。通過寓言故事、手語、感恩歌謠與生動動畫，潛移默化地澆灌孩子尊敬父母、熱愛地球與關懷弱勢的美好品質。",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=500&q=80"
  }
];

const T = {
  en: {
    sidebar_live: "Live Player",
    sidebar_schedule: "TV Guide Grid",
    sidebar_news: "World Compassion",
    sidebar_chat: "Companion AI",
    sidebar_help: "Quick Settings",
    live_feed: "LIVE FEED",
    channel_selection: "Channel Selection Shelf is active",
    stream_source: "Stream Source Validated",
    easy_selection: "Easy Curated TV Channels Selection",
    use_arrows: "Use [←] [→] keys to cycle streams",
    watching: "WATCHING",
    synopsis: "Synopsis & Stream Mission",
    tv_guide: "Daily TV program grid",
    tv_guide_subtitle: "Dynamic humanistic TV schedule generated by Gemini AI model based on current temporal state",
    api_mode: "API Mode",
    api_gemini: "Gemini-3.5-flash Live",
    api_static: "Static High-Availability Grid",
    active_details: "Active Showcase Details",
    duration_mins: "Minutes",
    host: "HOST / PRESENTED BY",
    category_val: "CATEGORY VALUE",
    episode_synopsis: "EPISODE SYNOPSIS",
    no_active: "No active program selected. Navigate list and tap Enter.",
    sync_status: "Schedule automatically syncs every turn to provide real-time television slots.",
    news_title: "World Compassion News Feed",
    news_subtitle: "Heartwarming records documenting selfless Tzu Chi humanitarian deeds and DAAI TV broadcasts globally",
    news_location: "Live Grounding Active (May 2026)",
    companion_title: "DAAI TV Companion AI Assistant",
    companion_subtitle: "Interact directly with Buddhist compassion wisdom agent, helping explain Tzu Chi tenets and program values",
    companion_history_ai: "Companion Agent",
    companion_history_user: "You (Viewer)",
    contemplating: "Contemplating loving reply...",
    select_questions: "Select & Send Quick TV Questions with Arrow keys:",
    placeholder: "Type custom compassion question...",
    send: "Send",
    settings_title: "Android TV Client Settings & Help",
    settings_subtitle: "This client demonstrates full remote standard behavior simulation designed for widescreen media frameworks.",
    keyboard_map: "🎮 TV REMOTE KEYBOARD SIMULATOR MAP",
    move_dpad: "Move D-Pad Selector",
    arrow_keys: "Arrow Keys [← ↑ ↓ →]",
    click_element: "Click Element / Tap Button",
    enter_ok: "Enter [OK Button]",
    exit_menu: "Exit Menu or Go Back",
    backspace_esc: "Backspace / Esc",
    toggle_hud: "Toggle Remote HUD display",
    hud_widget: "Click 'TV HUD Widget'",
    hud_instruction: "Interactive Remote HUD Overlay is displayed on screen so you can trigger keyboard directions easily even from your mobile and tablet tap browsers without a physical keyboard accessory!",
    about_title: "💚 ABOUT DAAI TV & GREAT LOVE VALUE",
    about_text: "DAAI TV was launched on August 25, 2007 with the motto \"Menjernihkan Hati Manusia, Menyejukkan Jiwa\" (Purifying human minds, calming souls). It broadcasts program guides in both Indonesian and Chinese languages without sensationalized violence or commercially provocative advertisements.",
    headquarter: "Main Headquarter",
    pik: "PIK, North Jakarta",
    live_broadcast: "Live Broadcast Feed",
    youtube_stream: "YouTube Direct Stream",
    maturity_trust: "Maturity and Trust",
    certified: "KPID & KPI Certified",
    focus_sector: "Focus Sector Active",
    nav_aid: "Navigation Aid: Use your physical keyboard Arrow Keys [← ↑ ↓ →] and Enter [OK]",
    tv_remote: "TV Remote HUD",
    click_remote: "Click buttons below to navigate",
    back_me: "↩ BACK MENU",
    mute_stream: "UNMUTE STREAM",
    muted: "MUTED",
    hide_remote: "Hide Remote",
    show_remote: "SHOW REMOTE HUD",
    language_sel: "Language / 語言"
  },
  zh: {
    sidebar_live: "大愛電視直播",
    sidebar_schedule: "今日節目指南",
    sidebar_news: "全球大愛新聞",
    sidebar_chat: "智能心靈陪伴",
    sidebar_help: "遙控器與設置",
    live_feed: "直播信號",
    channel_selection: "精選大愛頻道欄目已啟用",
    stream_source: "流媒體源認證正常",
    easy_selection: "精選大愛電視頻道快捷切換",
    use_arrows: "請使用 [←] [→] 左右方向鍵快速循環切換頻道",
    watching: "正在收看",
    synopsis: "劇目大綱與傳播宗旨",
    tv_guide: "大愛電視每日節目表",
    tv_guide_subtitle: "由 Gemini AI 模型結合當前時間動態生成的暖心節目指南",
    api_mode: "數據接口模式",
    api_gemini: "Gemini-3.5-flash 真實在線",
    api_static: "高可用靜態節目指南",
    active_details: "選定劇目詳細資訊",
    duration_mins: "分鐘",
    host: "主持人 / 主講",
    category_val: "節目大愛價值類別",
    episode_synopsis: "單集大綱簡介說明",
    no_active: "暫無選中的節目。請瀏覽左側節目單並按[Enter]鍵選中。",
    sync_status: "節目單每回合自動與大愛雲端同步，提供最新的電視檔期。",
    news_title: "世界慈悲與大愛資訊流",
    news_subtitle: "記錄全球慈濟志工無私奉獻之暖心善行及大愛電視台的全球報導",
    news_location: "慈濟國際慈悲心（2026年5月）",
    companion_title: "大愛電視心靈陪伴智能助手",
    companion_subtitle: "與蘊含佛教慈悲智慧的智能助理對話，解說慈濟四大志業與大愛的妙法",
    companion_history_ai: "大愛陪伴助理",
    companion_history_user: "您 (大愛觀眾)",
    contemplating: "正在用心參悟、組織溫柔的答覆...",
    select_questions: "使用方向鍵選擇發送常用慈悲問題：",
    placeholder: "請在此輸入您的提問，讓我們一同探討智慧...",
    send: "發送",
    settings_title: "大愛 Android TV 終端設置與手冊",
    settings_subtitle: "本客戶端完美模擬寬屏電視遙控器交互，專為人文書香影音框架設計。",
    keyboard_map: "🎮 電視遙控器鍵盤映射指南",
    move_dpad: "移動遙控焦點 / 選擇框",
    arrow_keys: "鍵盤方向鍵 [← ↑ ↓ →]",
    click_element: "確認選取 / 點擊按鈕",
    enter_ok: "回車鍵 [Enter / OK Button]",
    exit_menu: "退出選單 / 倒退返回",
    backspace_esc: "退格鍵 / ESC [Backspace / Esc]",
    toggle_hud: "切換屏幕虛擬遙控器",
    hud_widget: "點擊屏幕「虛擬遙控器按鈕」",
    hud_instruction: "屏幕上提供直觀的虛擬遙控器 HUD Overlay 懸浮窗，即使在平板或手機觸屏瀏覽、沒有實體鍵盤時，亦能流暢體驗極致的 Android TV 遙控器導航操作！",
    about_title: "💚 關於大愛電視與慈濟大愛精神",
    about_text: "印尼大愛電視台（DAAI TV）於2007年8月25日正式開播，以「淨化人心、祥和社會、祈求天下無災難」為不變使命。秉持傳播人間真善美原則，錄製中文與印尼雙語人文化目，無任何商業羶色腥暴力或煽動廣告。",
    headquarter: "總部所在地",
    pik: "印尼雅加達 PIK (卡布新村)",
    live_broadcast: "實時直播流",
    youtube_stream: "YouTube 大愛官方實時直播",
    maturity_trust: "公信力認證",
    certified: "KPID 與 KPI 印尼廣電總局認證",
    focus_sector: "當前遙控定位模塊",
    nav_aid: "遙控小貼士：使用電腦鍵盤 [← ↑ ↓ →] 方向鍵進行焦點選擇，按下回車 [Enter] 鍵進行確認",
    tv_remote: "電視虛擬遙控",
    click_remote: "點擊下方按鍵可模擬遙控操作",
    back_me: "↩ 返回主導航",
    mute_stream: "靜音/解除靜音",
    muted: "靜音中",
    hide_remote: "隱藏遙控HUD",
    show_remote: "顯示屏幕遙控器 HUD",
    language_sel: "語言選擇 / Lang"
  }
};

const QUICK_QUESTIONS_EN = [
  "What are the main values of DAAI TV?",
  "How can I participate as a Tzu Chi volunteer?",
  "Why is vegetarianism important to save our earth?",
  "Tell me a short encouraging story of Master Cheng Yen",
  "How to donate or recycling plastic in Jakarta?"
];

const QUICK_QUESTIONS_ZH = [
  "大愛電視台的核心宗旨與價值是什麼？",
  "我如何參與慈濟做一名志工付出愛心？",
  "為什麼茹素推廣蔬食對守護地球如此重要？",
  "請給我講一個證嚴上人開示的感人智慧小故事",
  "在雅加達如何參與慈濟環保資源回收與捐贈？"
];

export default function App() {
  // Dual-language State ("en" or "zh")
  const [language, setLanguage] = useState<"en" | "zh">("en");

  // Dynamic values based on selected language
  const channels = language === "zh" ? CURATED_CHANNELS_ZH : CURATED_CHANNELS_EN;
  const QUICK_QUESTIONS = language === "zh" ? QUICK_QUESTIONS_ZH : QUICK_QUESTIONS_EN;

  const SIDEBAR_ITEMS: SidebarItem[] = [
    { id: "live", label: language === "zh" ? T.zh.sidebar_live : T.en.sidebar_live, iconName: "Tv" },
    { id: "schedule", label: language === "zh" ? T.zh.sidebar_schedule : T.en.sidebar_schedule, iconName: "Calendar" },
    { id: "news", label: language === "zh" ? T.zh.sidebar_news : T.en.sidebar_news, iconName: "Newspaper" },
    { id: "chat", label: language === "zh" ? T.zh.sidebar_chat : T.en.sidebar_chat, iconName: "Sparkles" },
    { id: "help", label: language === "zh" ? T.zh.sidebar_help : T.en.sidebar_help, iconName: "HelpCircle" }
  ];

  // App States
  const [activeTab, setActiveTab] = useState<string>("live");
  const [selectedChannel, setSelectedChannel] = useState<Channel>(channels[0]);
  
  // Navigation States matching TV d-pad behavior
  const [focusSector, setFocusSector] = useState<"sidebar" | "channels" | "content" | "chat_input">("channels");
  const [sidebarIdx, setSidebarIdx] = useState<number>(0);
  const [channelIdx, setChannelIdx] = useState<number>(0);
  const [contentIdx, setContentIdx] = useState<number>(0);
  const [isPlayerMuted, setIsPlayerMuted] = useState<boolean>(true);
  const [isRemoteOpen, setIsRemoteOpen] = useState<boolean>(true);
  const [systemTime, setSystemTime] = useState<string>("");

  // Backend Sourced Data States
  const [schedules, setSchedules] = useState<Program[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [scheduleStatus, setScheduleStatus] = useState<"loading" | "success" | "fallback">("loading");
  const [newsStatus, setNewsStatus] = useState<"loading" | "success" | "fallback">("loading");
  
  // Interactive Chat Companion States
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      id: "welcome", 
      sender: "ai", 
      text: "Selamat Datang di DAAI TV Android TV Client. I am your Compassionate AI Assistant. Feel free to ask about our drama screenings, vegetarian advice, or daily mindful wejangans!", 
      timestamp: "15:10" 
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [suggestedQuestionIdx, setSuggestedQuestionIdx] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize system time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch TV Guide (Schedules) from Backend "/api/gemini/programs"
  const fetchSchedules = useCallback(async () => {
    try {
      setScheduleStatus("loading");
      const res = await fetch(`/api/gemini/programs?time=${encodeURIComponent(new Date().toISOString())}&lang=${language}`);
      const payload = await res.json();
      setSchedules(payload.data || []);
      setScheduleStatus(payload.source === "gemini" ? "success" : "fallback");
    } catch (err) {
      console.error("Failed to load live program schedules:", err);
      setScheduleStatus("fallback");
    }
  }, [language]);

  // Fetch Humanity News from Backend "/api/gemini/news"
  const fetchNews = useCallback(async () => {
    try {
      setNewsStatus("loading");
      const res = await fetch(`/api/gemini/news?lang=${language}`);
      const payload = await res.json();
      setNews(payload.data || []);
      setNewsStatus(payload.source === "gemini" ? "success" : "fallback");
    } catch (err) {
      console.error("Failed to load world compassion news:", err);
      setNewsStatus("fallback");
    }
  }, [language]);

  useEffect(() => {
    fetchSchedules();
    fetchNews();
  }, [fetchSchedules, fetchNews]);

  // Synchronize dynamic details of selectedChannel and welcome string when language changes
  useEffect(() => {
    const fresh = channels.find(c => c.id === selectedChannel.id);
    if (fresh) {
      setSelectedChannel(fresh);
    }
  }, [language, channels]);

  useEffect(() => {
    setChatHistory(prev => 
      prev.map(msg => {
        if (msg.id === "welcome") {
          return {
            ...msg,
            text: language === "zh" 
              ? "歡迎來到大愛電視台（DAAI TV）智能指南助理。我是您的心靈陪伴者。您可以隨時諮詢我們的精美大愛劇場、素食健康食譜、和慈濟善行足跡。"
              : "Selamat Datang di DAAI TV Android TV Client. I am your Compassionate AI Assistant. Feel free to ask about our drama screenings, vegetarian advice, or daily mindful wejangans!"
          };
        }
        return msg;
      })
    );
  }, [language]);

  // Execute AI Chat companion stream request
  const handleSendChat = async (textToSend: string) => {
    if (!textToSend.trim() || isChatLoading) return;
    
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory.map(h => ({ sender: h.sender, text: h.text })),
          lang: language
        })
      });

      const data = await response.json();
      
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.reply || (language === "zh" ? "無法取得智能答覆。請檢查網路連線。" : "Unable to retrieve inspiration model. Please check connection."),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistory(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat companion communication error:", err);
      setChatHistory(prev => [...prev, {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: language === "zh" ? "連接愛心雲端發生錯誤。請確保您的互聯網處於活動狀態。" : "Error reaching Compassion Cloud. Ensure your local internet is active.",
        timestamp: "Now"
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Channel selection logic
  const playChannelIdx = useCallback((idx: number) => {
    if (idx >= 0 && idx < channels.length) {
      setChannelIdx(idx);
      setSelectedChannel(channels[idx]);
    }
  }, [channels]);

  // Unified controller trigger matching mechanical TV commands
  const handleTVAction = useCallback((command: "UP" | "DOWN" | "LEFT" | "RIGHT" | "OK" | "BACK") => {
    if (command === "BACK") {
      if (focusSector !== "sidebar") {
        setFocusSector("sidebar");
      }
      return;
    }

    if (focusSector === "sidebar") {
      if (command === "UP") {
        setSidebarIdx(prev => Math.max(0, prev - 1));
      } else if (command === "DOWN") {
        setSidebarIdx(prev => Math.min(SIDEBAR_ITEMS.length - 1, prev + 1));
      } else if (command === "RIGHT" || command === "OK") {
        const targetTab = SIDEBAR_ITEMS[sidebarIdx].id;
        setActiveTab(targetTab);
        if (targetTab === "live") {
          setFocusSector("channels");
        } else if (targetTab === "chat") {
          setFocusSector("chat_input");
        } else {
          setFocusSector("content");
          setContentIdx(0);
        }
      }
    } 
    
    else if (focusSector === "channels") {
      if (command === "LEFT") {
        if (channelIdx === 0) {
          setFocusSector("sidebar");
        } else {
          playChannelIdx(channelIdx - 1);
        }
      } else if (command === "RIGHT") {
        if (channelIdx === channels.length - 1) {
          // Wrap or hold
        } else {
          playChannelIdx(channelIdx + 1);
        }
      } else if (command === "UP") {
        setFocusSector("sidebar");
      } else if (command === "DOWN") {
        setFocusSector("content");
        setContentIdx(0);
      } else if (command === "OK") {
        // Trigger active visual replay
        setSelectedChannel(channels[channelIdx]);
      }
    } 
    
    else if (focusSector === "content") {
      if (activeTab === "live") {
        // Content represents bottom info or toggle buttons
        if (command === "UP") {
          setFocusSector("channels");
        } else if (command === "LEFT") {
          setFocusSector("sidebar");
        } else if (command === "OK") {
          setIsPlayerMuted(prev => !prev);
        }
      } else if (activeTab === "schedule") {
        if (command === "UP") {
          setContentIdx(prev => Math.max(0, prev - 1));
        } else if (command === "DOWN") {
          setContentIdx(prev => Math.min(schedules.length - 1, prev + 1));
        } else if (command === "LEFT") {
          setFocusSector("sidebar");
        }
      } else if (activeTab === "news") {
        if (command === "UP") {
          setContentIdx(prev => Math.max(0, prev - 1));
        } else if (command === "DOWN") {
          setContentIdx(prev => Math.min(news.length - 1, prev + 1));
        } else if (command === "LEFT") {
          setFocusSector("sidebar");
        }
      } else if (activeTab === "help") {
        if (command === "LEFT") {
          setFocusSector("sidebar");
        } else if (command === "UP") {
          setContentIdx(prev => Math.max(0, prev - 1));
        } else if (command === "DOWN") {
          setContentIdx(prev => Math.min(4, prev + 1));
        }
      }
    } 
    
    else if (focusSector === "chat_input") {
      if (command === "LEFT") {
        setSuggestedQuestionIdx(prev => Math.max(0, prev - 1));
      } else if (command === "RIGHT") {
        setSuggestedQuestionIdx(prev => Math.min(QUICK_QUESTIONS.length - 1, prev + 1));
      } else if (command === "UP") {
        setFocusSector("sidebar");
      } else if (command === "OK") {
        handleSendChat(QUICK_QUESTIONS[suggestedQuestionIdx]);
      }
    }
  }, [focusSector, sidebarIdx, channelIdx, contentIdx, channels, activeTab, schedules.length, news.length, suggestedQuestionIdx, playChannelIdx]);

  // Synchronize ActiveTab with selected side items
  useEffect(() => {
    if (focusSector === "sidebar") {
      setActiveTab(SIDEBAR_ITEMS[sidebarIdx].id);
    }
  }, [sidebarIdx, focusSector]);

  // Handle physical key inputs for Android TV feel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      let cmd: "UP" | "DOWN" | "LEFT" | "RIGHT" | "OK" | "BACK" | null = null;
      
      switch (e.key) {
        case "ArrowUp":
          cmd = "UP";
          break;
        case "ArrowDown":
          cmd = "DOWN";
          break;
        case "ArrowLeft":
          cmd = "LEFT";
          break;
        case "ArrowRight":
          cmd = "RIGHT";
          break;
        case "Enter":
          cmd = "OK";
          break;
        case "Backspace":
        case "Escape":
          cmd = "BACK";
          break;
        default:
          return; // Allow generic typing in chatbot when active
      }
      
      e.preventDefault();
      handleTVAction(cmd);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleTVAction]);

  return (
    <div 
      id="android-tv-container"
      ref={containerRef} 
      className="relative flex min-h-screen w-full bg-slate-950 overflow-hidden text-slate-100 font-sans select-none antialiased"
    >
      {/* Real-time Generated Cinematic DAAI TV Photo Background with Overlay */}
      <div className="absolute inset-0 select-none pointer-events-none z-0">
        <img
          src="/src/assets/images/daai_tv_bg_1780241777042.png"
          alt="DAAI TV Backdrop"
          className="w-full h-full object-cover scale-105 filter saturate-[1.1] contrast-[1.05]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-radial-gradient(ellipse_at_top,rgba(16,185,129,0.1),rgba(2,6,23,0.92))" />
      </div>
      
      {/* Modern Dashboard Layout */}
      <div className="relative flex flex-row w-full z-10">
        
        {/* SIDEBAR NAVIGATION MENU (Designed strictly for simple 44px arrow targets & TV vibe) */}
        <div className="w-72 bg-slate-950/85 border-r border-slate-800/60 p-6 flex flex-col justify-between backdrop-blur-lg">
          <div>
            {/* Elegant Branding Header */}
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-900">
              <div id="brand-logo-badge" className="w-11 h-11 bg-white/95 rounded-xl shadow-lg shadow-emerald-950/20 flex items-center justify-center p-1 border border-slate-700/10 overflow-hidden">
                <img 
                  src="/src/assets/images/daai_tv_logo_1780241800229.png" 
                  alt="DAAI TV Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display tracking-wide uppercase leading-none bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  DAAI TV
                </h1>
                <span className="text-[10px] font-mono tracking-widest text-emerald-400 font-medium uppercase mt-1 block">
                  {language === "zh" ? "安卓電視客戶端" : "Android TV Client"}
                </span>
              </div>
            </div>

            {/* Language Selector Button */}
            <div className="mb-6 px-1">
              <button 
                id="lang-switcher-btn"
                onClick={() => setLanguage(prev => prev === "en" ? "zh" : "en")}
                className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 font-semibold text-xs rounded-xl border border-slate-800/85 transition-all duration-200 active:scale-95"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span className="font-sans text-[11px] font-medium text-slate-300">
                    {language === "en" ? "Interface / 繁中" : "語言 / English"}
                  </span>
                </span>
                <span className="bg-emerald-950/80 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-400 border border-emerald-900/60 uppercase font-mono">
                  {language === "en" ? "EN" : "繁中"}
                </span>
              </button>
            </div>

            {/* Vertical Menu Items */}
            <div className="space-y-2" id="sidebar-navigation">
              {SIDEBAR_ITEMS.map((item, index) => {
                const isFocused = focusSector === "sidebar" && index === sidebarIdx;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    id={`sidebar-item-${item.id}`}
                    onClick={() => {
                      setSidebarIdx(index);
                      setFocusSector("sidebar");
                      setActiveTab(item.id);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left font-medium transition-all duration-300 ${
                      isFocused 
                        ? "bg-slate-100 text-slate-950 scale-[1.03] shadow-lg shadow-white/10 ring-2 ring-emerald-400" 
                        : isActive 
                          ? "bg-slate-900 text-emerald-400 border-l-4 border-emerald-500" 
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                    }`}
                  >
                    <span className="flex-shrink-0">
                      {item.iconName === "Tv" && <Tv className="w-5 h-5" />}
                      {item.iconName === "Calendar" && <Calendar className="w-5 h-5" />}
                      {item.iconName === "Newspaper" && <Newspaper className="w-5 h-5" />}
                      {item.iconName === "Sparkles" && <Sparkles className="w-5 h-5" />}
                      {item.iconName === "HelpCircle" && <HelpCircle className="w-5 h-5" />}
                    </span>
                    <span className="text-sm font-display tracking-wide">{item.label}</span>
                    {isActive && !isFocused && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer with Live Connectivity and Status */}
          <div className="space-y-4 pt-4 border-t border-slate-900">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Wifi className="w-3.5 h-3.5" /> ONLINE
              </span>
              <span>1080p WebTV</span>
            </div>
            
            <div className="space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                {language === "zh" ? "實時世界時鐘" : "Live UTC Clock"}
              </div>
              <div className="text-2xl font-bold font-mono tracking-tight text-slate-200 bg-slate-900/60 py-2 px-3 text-center rounded-lg border border-slate-800">
                {systemTime || "15:10:53"}
              </div>
            </div>
          </div>
        </div>

        {/* CONTAINER SHEETS FOR VIEW CONTENT */}
        <div className="flex-1 p-8 overflow-y-auto flex flex-col justify-between max-w-full">
          
          <AnimatePresence mode="wait">
            
            {/* VIEW TAB 1: LIVE PLAYER WITH HORIZONTAL SHELF */}
            {activeTab === "live" && (
              <motion.div
                key="live"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                {/* Channel Header Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest animate-tv-pulse">
                        {language === "zh" ? T.zh.live_feed : T.en.live_feed}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {language === "zh" ? T.zh.channel_selection : T.en.channel_selection}
                      </span>
                    </div>
                    <h2 className="text-3xl font-display font-extrabold text-white tracking-tight mt-1 max-w-[50vw]">
                      {selectedChannel.name}
                    </h2>
                    <p className="text-sm text-emerald-400 font-display mt-0.5 font-medium flex items-center gap-1">
                      <Globe className="w-4 h-4" /> {selectedChannel.subtitle}
                    </p>
                  </div>
                  
                  {/* Mode & TV helper panel top-right */}
                  <div className="hidden lg:flex items-center gap-3">
                    <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-mono text-slate-300">
                        {language === "zh" ? T.zh.stream_source : T.en.stream_source}
                      </span>
                    </div>
                  </div>
                </div>

                {/* VISUALLY POLISHED EMBED PLAYER (Main Requested DAAI YouTube Stream) */}
                <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl flex-1 max-h-[50vh] min-h-[300px]">
                  <iframe 
                    id="main-youtube-embed"
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${selectedChannel.embedId}?enablejsapi=1&autoplay=1&mute=${isPlayerMuted ? 1 : 0}&rel=0&iv_load_policy=3&showinfo=0`}
                    title={selectedChannel.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  
                  {/* Custom Smart TV Control Overlay */}
                  <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono text-slate-300 tracking-wider">Bitrate: 4.8 Mbps | H.264 HD</span>
                  </div>

                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <button 
                      onClick={() => setIsPlayerMuted(!isPlayerMuted)}
                      className={`p-3 rounded-full backdrop-blur-md text-white transition-all duration-300 border ${
                        focusSector === "content" 
                          ? "bg-amber-400 text-slate-950 border-amber-300 scale-110 shadow-lg shadow-amber-400/20" 
                          : "bg-slate-950/70 border-slate-800 hover:bg-slate-800"
                      }`}
                    >
                      {isPlayerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* HORIZONTAL CHANNEL SELECTION SHELF */}
                <div id="channels-shelf-region" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs uppercase font-mono tracking-widest text-slate-400 flex items-center gap-2">
                      <Grid className="w-4 h-4 text-slate-400" /> {language === "zh" ? T.zh.easy_selection : T.en.easy_selection}
                    </h3>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {language === "zh" ? "請使用 " : "Use "}<span className="text-emerald-400 font-bold">[←] [→]</span> {language === "zh" ? " 左右方向鍵快速切換" : " keys to cycle streams"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {channels.map((channel, idx) => {
                      const isFocused = focusSector === "channels" && idx === channelIdx;
                      const isCurrentlyWatching = selectedChannel.id === channel.id;

                      return (
                        <div
                          key={channel.id}
                          id={`channel-card-${channel.id}`}
                          onClick={() => {
                            setChannelIdx(idx);
                            playChannelIdx(idx);
                            setFocusSector("channels");
                          }}
                          className={`group relative cursor-pointer rounded-xl overflow-hidden bg-slate-900 border transition-all duration-300 ${
                            isFocused 
                              ? "scale-[1.05] border-amber-400 shadow-xl shadow-amber-900/30 font-medium z-10" 
                              : isCurrentlyWatching
                                ? "border-emerald-500 bg-slate-900/80"
                                : "border-slate-800 opacity-80 hover:opacity-100 hover:border-slate-700"
                          }`}
                        >
                          {/* Card Image */}
                          <div className="relative aspect-video w-full bg-slate-950">
                            <img 
                              src={channel.thumbnail} 
                              alt={channel.name}
                              referrerPolicy="no-referrer"
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                            />
                            
                            {/* Live Badge and Indicators */}
                            {isCurrentlyWatching && (
                              <div className="absolute top-2 right-2 bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-md">
                                <span className="w-1.5 h-1.5 bg-slate-950 rounded-full animate-ping" />
                                {language === "zh" ? T.zh.watching : T.en.watching}
                              </div>
                            )}

                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wide bg-slate-950/80 text-slate-300">
                              {channel.category}
                            </span>
                          </div>

                          {/* Card Title Details */}
                          <div className="p-3">
                            <h4 className="text-xs font-bold text-slate-100 line-clamp-1 group-hover:text-amber-400 transition-colors">
                              {channel.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                              {channel.subtitle}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Channel Detailed Synopsis Panel */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl flex items-start gap-4">
                  <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400 font-bold">
                      {language === "zh" ? T.zh.synopsis : T.en.synopsis}
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {selectedChannel.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW TAB 2: TV GUIDE GRID - SCHEDULES */}
            {activeTab === "schedule" && (
              <motion.div
                key="schedule"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-display font-extrabold text-white">
                        {language === "zh" ? T.zh.tv_guide : T.en.tv_guide}
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        {language === "zh" ? T.zh.tv_guide_subtitle : T.en.tv_guide_subtitle}
                      </p>
                    </div>
                    {/* Status badge representing API health */}
                    <div className="bg-slate-900/80 border border-slate-800/80 px-4 py-2 rounded-xl flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${scheduleStatus === "success" ? "bg-emerald-400" : "bg-amber-400"}`} />
                      <span className="text-xs font-mono text-slate-300">
                        {language === "zh" ? T.zh.api_mode : T.en.api_mode}: {scheduleStatus === "success" ? (language === "zh" ? T.zh.api_gemini : T.en.api_gemini) : (language === "zh" ? T.zh.api_static : T.en.api_static)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
                    {/* Schedule List */}
                    <div className="lg:col-span-7 space-y-3 max-h-[52vh] overflow-y-auto pr-3">
                      {schedules.map((show, idx) => {
                        const isFocused = focusSector === "content" && idx === contentIdx;
                        
                        return (
                          <div
                            key={idx}
                            id={`schedule-item-${idx}`}
                            onClick={() => {
                              setContentIdx(idx);
                              setFocusSector("content");
                            }}
                            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all duration-300 ${
                              isFocused 
                                ? "bg-slate-100 text-slate-950 scale-[1.02] border-amber-400 shadow-lg shadow-white/10" 
                                : "bg-slate-900/80 border-slate-800/80 text-slate-200 hover:border-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <span className={`font-mono text-xs font-bold px-3 py-1.5 rounded-lg ${
                                isFocused ? "bg-amber-400 text-slate-950" : "bg-slate-950 text-slate-400 border border-slate-800"
                              }`}>
                                {show.time}
                              </span>
                              <div>
                                <h4 className="text-sm font-bold line-clamp-1">{show.title}</h4>
                                <p className={`text-[11px] ${isFocused ? "text-slate-700" : "text-slate-400"} mt-0.5`}>
                                  {language === "zh" ? "主講: " : "Hosted by "}{show.host} • {show.duration} {language === "zh" ? T.zh.duration_mins : T.en.duration_mins}
                                </p>
                              </div>
                            </div>

                            <span className={`text-[10px] font-bold px-2 py-1 rounded tracking-wide uppercase font-mono ${
                              show.category === "Wisdom" || show.category === "大師開示" ? "bg-indigo-900/20 text-indigo-300 border border-indigo-750" :
                              show.category === "Vegetarian" || show.category === "蔬食環保" ? "bg-emerald-955/20 text-emerald-300 border border-emerald-750" :
                              show.category === "Drama" || show.category === "精品劇場" ? "bg-amber-900/25 text-amber-300 border border-amber-700/50" :
                              "bg-slate-950 text-slate-300 border border-slate-850"
                            }`}>
                              {show.category}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Left Active details pane */}
                    <div className="lg:col-span-5 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
                      {schedules[contentIdx || 0] ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest font-mono">
                              {language === "zh" ? T.zh.active_details : T.en.active_details}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 py-1 px-2.5 rounded-lg font-mono border border-slate-800">
                              <Clock className="w-3.5 h-3.5" /> {schedules[contentIdx || 0].duration} {language === "zh" ? T.zh.duration_mins : T.en.duration_mins}
                            </div>
                          </div>

                          <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">
                            {schedules[contentIdx || 0].title}
                          </h3>

                          <div className="grid grid-cols-2 gap-4 py-2 border-y border-slate-800">
                            <div>
                              <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500">
                                {language === "zh" ? T.zh.host : T.en.host}
                              </div>
                              <div className="text-xs font-bold text-slate-300 mt-0.5">{schedules[contentIdx || 0].host}</div>
                            </div>
                            <div>
                              <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500">
                                {language === "zh" ? T.zh.category_val : T.en.category_val}
                              </div>
                              <div className="text-xs font-bold text-slate-300 mt-0.5">{schedules[contentIdx || 0].category}</div>
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500">
                              {language === "zh" ? T.zh.episode_synopsis : T.en.episode_synopsis}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {schedules[contentIdx || 0].description}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-400 text-sm text-center py-10">
                          {language === "zh" ? T.zh.no_active : T.en.no_active}
                        </p>
                      )}

                      <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono text-center">
                        {language === "zh" ? T.zh.sync_status : T.en.sync_status}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW TAB 3: HUMANITY WORLD NEWS SECTION */}
            {activeTab === "news" && (
              <motion.div
                key="news"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-display font-extrabold text-white">
                        {language === "zh" ? T.zh.news_title : T.en.news_title}
                      </h2>
                      <p className="text-sm text-slate-400 mt-1">
                        {language === "zh" ? T.zh.news_subtitle : T.en.news_subtitle}
                      </p>
                    </div>

                    <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3.5 py-1.5 rounded-xl">
                      {language === "zh" ? T.zh.news_location : T.en.news_location}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {news.map((item, idx) => {
                      const isFocused = focusSector === "content" && idx === contentIdx;
                      
                      return (
                        <div
                          key={item.id}
                          id={`news-item-${item.id}`}
                          onClick={() => {
                            setContentIdx(idx);
                            setFocusSector("content");
                          }}
                          className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                            isFocused 
                              ? "bg-slate-100 text-slate-950 scale-[1.02] border-amber-400 shadow-xl shadow-white/5" 
                              : "bg-slate-900/60 border-slate-800/80 text-slate-100 hover:border-slate-700"
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded tracking-widest uppercase font-mono ${
                                isFocused ? "bg-amber-400 text-slate-950" : "bg-emerald-950/40 text-emerald-300 border border-emerald-800"
                              }`}>
                                {item.category}
                              </span>
                              <span className={`text-[10px] font-mono ${isFocused ? "text-slate-700" : "text-slate-400"}`}>
                                {item.date}
                              </span>
                            </div>

                            <h3 className="font-bold text-base leading-snug line-clamp-2">
                              {item.title}
                            </h3>

                            <p className={`text-xs leading-relaxed ${isFocused ? "text-slate-750" : "text-slate-300"}`}>
                              {item.summary}
                            </p>
                          </div>

                          <div className={`mt-4 pt-3 border-t text-[10px] uppercase tracking-wider font-mono text-right ${
                            isFocused ? "border-slate-200 text-slate-700" : "border-slate-800 text-slate-400"
                          }`}>
                            📍 {item.location}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW TAB 4: COMPANION CHAT AI (DYNAMIC RESPONSE BOT) */}
            {activeTab === "chat" && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6 flex-1 flex flex-col justify-between h-[75vh]"
              >
                <div id="companion-ai-section" className="space-y-1">
                  <h2 className="text-3xl font-display font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-7 h-7 text-emerald-400 animate-pulse" /> {language === "zh" ? T.zh.companion_title : T.en.companion_title}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {language === "zh" ? T.zh.companion_subtitle : T.en.companion_subtitle}
                  </p>
                </div>

                {/* Chat History Box */}
                <div className="flex-1 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 overflow-y-auto space-y-4 max-h-[460px]">
                  {chatHistory.map((msg) => {
                    const isAi = msg.sender === "ai";
                    
                    return (
                      <div 
                        key={msg.id} 
                        className={`flex ${isAi ? "justify-start" : "justify-end"}`}
                      >
                        <div className={`max-w-[70%] rounded-2xl p-4 shadow-lg ${
                          isAi 
                            ? "bg-slate-800/80 text-slate-100 border border-slate-700/60" 
                            : "bg-emerald-600 text-white rounded-br-none"
                        }`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] tracking-wide uppercase font-mono font-bold text-slate-400">
                              {isAi ? (language === "zh" ? "大愛AI賢者" : "Companion agent") : (language === "zh" ? "您 (觀眾)" : "You (Viewer)")}
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {msg.timestamp}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-800 text-slate-300 rounded-2xl p-4 border border-slate-700/60 flex items-center gap-2">
                        <div className="flex space-x-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0s' }} />
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          {language === "zh" ? "正在思考慈悲的解答..." : "Contemplating loving reply..."}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dynamic Smart remote input buttons for TV screens */}
                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block">
                    {language === "zh" ? "使用方向鍵選擇並發送快速問題：" : "Select & Send Quick TV Questions with Arrow keys:"}
                  </span>
                  
                  <div className="flex flex-wrap gap-2">
                    {QUICK_QUESTIONS.map((q, idx) => {
                      const isFocused = focusSector === "chat_input" && idx === suggestedQuestionIdx;
                      
                      return (
                        <button
                          key={idx}
                          id={`quick-q-${idx}`}
                          onClick={() => {
                            setSuggestedQuestionIdx(idx);
                            setFocusSector("chat_input");
                            handleSendChat(q);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-medium text-left transition-all duration-300 border ${
                            isFocused 
                              ? "bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-md shadow-amber-400/20" 
                              : "bg-slate-900 hover:bg-slate-850 text-slate-300 border-slate-800"
                          }`}
                        >
                          {q}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={language === "zh" ? "輸入您的自訂大愛問題..." : "Type custom compassion question..."}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendChat(chatInput);
                        }
                      }}
                      className="flex-grow bg-slate-900 border border-slate-800 py-3 px-4 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button 
                      onClick={() => handleSendChat(chatInput)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm py-3 px-6 rounded-xl flex items-center gap-2 transition"
                    >
                      <CornerDownLeft className="w-4 h-4" /> {language === "zh" ? "發送" : "Send"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW TAB 5: QUICK HELP & CONTROLLER EXPLAINER */}
            {activeTab === "help" && (
              <motion.div
                key="help"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-3xl font-display font-extrabold text-white">
                    {language === "zh" ? T.zh.settings_title : T.en.settings_title}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    {language === "zh" ? T.zh.settings_subtitle : T.en.settings_subtitle}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {/* Keyboard Shortcuts explanation */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <h3 className="text-sm font-bold text-amber-400 uppercase tracking-widest font-mono flex items-center gap-2">
                        {language === "zh" ? "🎮 電視遙控器鍵盤映射" : "🎮 TV REMOTE KEYBOARD SIMULATOR MAP"}
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800">
                          <span className="font-semibold text-slate-300">
                            {language === "zh" ? "移動方向選擇器" : "Move D-Pad Selector"}
                          </span>
                          <span className="bg-slate-950 font-mono text-emerald-400 px-3 py-1 rounded border border-slate-800 font-bold">
                            Arrow Keys [← ↑ ↓ →]
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800">
                          <span className="font-semibold text-slate-300">
                            {language === "zh" ? "點擊元素 / 確認按鈕" : "Click Element / Tap Button"}
                          </span>
                          <span className="bg-slate-950 font-mono text-emerald-400 px-3 py-1 rounded border border-slate-800 font-bold">
                            Enter [OK]
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-800">
                          <span className="font-semibold text-slate-300">
                            {language === "zh" ? "退出選單 / 返回" : "Exit Menu or Go Back"}
                          </span>
                          <span className="bg-slate-950 font-mono text-emerald-400 px-3 py-1 rounded border border-slate-800 font-bold">
                            Backspace / Esc
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs py-1.5">
                          <span className="font-semibold text-slate-300">
                            {language === "zh" ? "切換遙控器懸浮窗顯示" : "Toggle Remote HUD display"}
                          </span>
                          <span className="bg-slate-950 font-mono text-emerald-400 px-3 py-1 rounded border border-slate-800 font-bold">
                            {language === "zh" ? "點擊'遙控器懸浮窗'" : "Click 'TV HUD Widget'"}
                          </span>
                        </div>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 mt-4">
                        <p className="text-xs text-slate-400 leading-relaxed">
                          {language === "zh" ? (
                            <span>💡 <b className="text-slate-200">互動式遙控器 HUD 懸浮窗</b> 顯示在畫面上，方便您在移動端/平板觸摸屏瀏覽器上輕鬆觸發鍵盤方向，而無需實物鍵盤配件！</span>
                          ) : (
                            <span>💡 <b className="text-slate-200">Interactive Remote HUD Overlay</b> is displayed on screen so you can trigger keyboard directions easily even from your mobile and tablet tap browsers without a physical keyboard accessory!</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* About DAAI TV & Tzu Chi */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-2">
                        {language === "zh" ? "💚 關於大愛電視與大愛理念" : "💚 ABOUT DAAI TV & GREAT LOVE VALUE"}
                      </h3>
                      
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {language === "zh" ? (
                          <span>大愛電視（DAAI TV）於1998年起開播，秉持著 <b className="text-white">「淨化人心、祥和社會、祈求天下無災難」</b>（Menjernihkan Hati Manusia, Menyejukkan Jiwa）的首要理念，提供中文與印尼文雙語的精緻人文節目，無暴力血腥等聳動內容或商業化挑逗性廣告，是以人間大愛與守護心靈為核心價值的清流媒體。</span>
                        ) : (
                          <span>DAAI TV was launched with the motto <b className="text-white">"Menjernihkan Hati Manusia, Menyejukkan Jiwa"</b> (Purifying human minds, calming souls). It broadcasts program guides in both Indonesian and Chinese languages without sensationalized violence or commercially provocative advertisements.</span>
                        )}
                      </p>

                      <div className="space-y-2 mt-4">
                        <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between text-xs text-slate-300">
                          <span>{language === "zh" ? "總部所在地" : "Main Headquarter"}</span>
                          <span className="font-semibold text-slate-100">PIK, North Jakarta</span>
                        </div>
                        <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between text-xs text-slate-300">
                          <span>{language === "zh" ? "直播流頻道" : "Live Broadcast Feed"}</span>
                          <a 
                            href="https://www.youtube.com/watch?v=pM-1ytfQhos" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="font-semibold text-emerald-400 underline hover:text-emerald-300"
                          >
                            {language === "zh" ? "YouTube 實時直播" : "YouTube Direct Stream"}
                          </a>
                        </div>
                        <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between text-xs text-slate-300">
                          <span>{language === "zh" ? "媒體認證與信任" : "Maturity and Trust"}</span>
                          <span className="font-semibold text-slate-100">KPID & KPI Certified</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* DYNAMIC SCREEN NOTIFICATION / REMOTE NAV INSTRUCTIONS */}
          <div className="mt-8 pt-4 border-t border-slate-900/80 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                {language === "zh" ? "焦點區域活躍: " : "Focus Sector Active: "}
                <b className="text-amber-400 uppercase">[{focusSector === "sidebar" && language === "zh" ? "側邊導航" : focusSector === "channels" && language === "zh" ? "直播選台" : focusSector === "content" && language === "zh" ? "節目詳情" : focusSector === "chat_input" && language === "zh" ? "對話輸入" : focusSector}]</b>
              </span>
            </div>
            
            <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400 flex items-center gap-1.5 animate-pulse">
              <span>
                {language === "zh" 
                  ? "🎮 導航提示：請使用鍵盤的方向鍵 [← ↑ ↓ →] 與 Enter [OK 鍵]" 
                  : "🎮 Navigation Aid: Use your physical keyboard Arrow Keys [← ↑ ↓ →] and Enter [OK]"}
              </span>
            </div>
          </div>
        </div>

        {/* FLOATING ANDROID TV REMOTE CONTROLLER (For ultimate tablet & cursor convenience) */}
        {isRemoteOpen && (
          <div 
            id="virtual-remote-hud"
            className="w-48 bg-slate-950 border-l border-slate-800/80 p-4 flex flex-col items-center justify-between z-40 backdrop-blur-md"
          >
            <div className="w-full text-center pb-3 border-b border-slate-900">
              <h3 className="text-xs font-bold font-display uppercase tracking-widest text-slate-400">
                {language === "zh" ? "電視遙控器懸浮窗" : "TV Remote HUD"}
              </h3>
              <p className="text-[9px] text-slate-600 font-mono mt-0.5">
                {language === "zh" ? "點擊下方按鈕進行導航" : "Click buttons below to navigate"}
              </p>
            </div>

            {/* D-Pad controls */}
            <div className="my-8 flex flex-col items-center gap-2">
              {/* Up Button */}
              <button 
                onClick={() => handleTVAction("UP")}
                className="w-12 h-12 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 active:bg-amber-400 rounded-full flex items-center justify-center text-slate-350 active:text-slate-950 hover:scale-105 transition-all duration-200"
                title={language === "zh" ? "向上方向鍵" : "Arrow Up"}
              >
                <ArrowUp className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {/* Left Button */}
                <button 
                  onClick={() => handleTVAction("LEFT")}
                  className="w-12 h-12 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 active:bg-amber-400 rounded-full flex items-center justify-center text-slate-350 active:text-slate-950 hover:scale-105 transition-all duration-200"
                  title={language === "zh" ? "向左方向鍵" : "Arrow Left"}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                {/* OK / SELECT Button */}
                <button 
                  onClick={() => handleTVAction("OK")}
                  className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 border border-emerald-400 text-white font-extrabold text-sm rounded-full flex items-center justify-center shadow-lg shadow-emerald-950/35 hover:scale-110 active:from-amber-400 active:to-amber-500 active:text-slate-950 transition-all duration-200"
                  title={language === "zh" ? "選定與確認" : "OK / Select"}
                >
                  OK
                </button>

                {/* Right Button */}
                <button 
                  onClick={() => handleTVAction("RIGHT")}
                  className="w-12 h-12 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 active:bg-amber-400 rounded-full flex items-center justify-center text-slate-350 active:text-slate-950 hover:scale-105 transition-all duration-200"
                  title={language === "zh" ? "向右方向鍵" : "Arrow Right"}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Down Button */}
              <button 
                onClick={() => handleTVAction("DOWN")}
                className="w-12 h-12 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 active:bg-amber-400 rounded-full flex items-center justify-center text-slate-350 active:text-slate-950 hover:scale-105 transition-all duration-200"
                title={language === "zh" ? "向下方向鍵" : "Arrow Down"}
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            </div>

            {/* Utility buttons row */}
            <div className="w-full space-y-2">
              <button 
                onClick={() => handleTVAction("BACK")}
                className="w-full py-2 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-xs text-slate-300 font-medium rounded-lg flex items-center justify-center gap-1.5 hover:scale-103 transition"
              >
                <span>{language === "zh" ? "↩ 返回選單" : "↩ BACK ME"}</span>
              </button>

              <button 
                onClick={() => setIsPlayerMuted(prev => !prev)}
                className={`w-full py-2 border text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  isPlayerMuted 
                    ? "bg-slate-900 border-slate-800 text-slate-300"
                    : "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                }`}
              >
                {isPlayerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>
                  {language === "zh" 
                    ? (isPlayerMuted ? "恢復聲音" : "靜音狀態") 
                    : (isPlayerMuted ? "UNMUTE STREAM" : "MUTED")}
                </span>
              </button>

              <button
                onClick={() => setIsRemoteOpen(false)}
                className="w-full text-[10px] text-slate-500 hover:text-slate-400 transition text-center uppercase tracking-wider underline mt-4"
              >
                {language === "zh" ? "隱藏遙控器" : "Hide Remote"}
              </button>
            </div>
          </div>
        )}

        {/* Minimal Float Restore Remote Handle */}
        {!isRemoteOpen && (
          <button
            onClick={() => setIsRemoteOpen(true)}
            className="absolute bottom-6 right-6 p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition z-50 flex items-center gap-2"
          >
            <Activity className="w-5 h-5 animate-spin" />
            <span className="text-xs font-bold font-mono tracking-wider">
              {language === "zh" ? "開啟遙控面板" : "SHOW REMOTE HUD"}
            </span>
          </button>
        )}

      </div>
    </div>
  );
}
