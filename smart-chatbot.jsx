import { useState, useRef, useEffect, useCallback } from "react";

// ─── DATASET ────────────────────────────────────────────────────────────────
const DATASET = [
  { keywords: ["hello", "hi", "hey", "salam", "namaste", "hii", "helo"], response: "Hey there! 👋 Main aapki kaise madad kar sakta hoon?" },
  { keywords: ["name", "naam", "tumhara naam", "aap kaun"], response: "Main SmartBot hoon — aapka personal AI assistant! 🤖" },
  { keywords: ["how are you", "kaisa hai", "kaisa ho", "theek ho"], response: "Main bilkul theek hoon, shukriya puchne ke liye! Aap kaise hain? 😊" },
  { keywords: ["weather", "mausam", "barish", "garmi", "sardi"], response: "Abhi mera mausam data available nahi hai, lekin aap Weather.com check kar sakte hain! 🌤️" },
  { keywords: ["joke", "mazak", "funny", "laugh", "haso"], response: "Ek programmer ne apni girlfriend ko kaha: 'Main tumse pyaar karta hoon.' Girlfriend: 'Kya proof hai?' Programmer: 'Console mein dekho — no errors! 😂'" },
  { keywords: ["capital", "rajdhani", "india", "bharat"], response: "India ki rajdhani New Delhi hai! 🇮🇳 Kya aur kuch jaanna chahte hain?" },
  { keywords: ["time", "samay", "waqt", "ghanta"], response: `Abhi ka local time: ${new Date().toLocaleTimeString()} ⏰` },
  { keywords: ["date", "aaj", "today", "tarikh"], response: `Aaj ki tarikh: ${new Date().toLocaleDateString("hi-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} 📅` },
  { keywords: ["math", "calculate", "plus", "minus", "jodo", "ghato"], response: "Main basic math kar sakta hoon! Abhi ye feature improve ho raha hai. 🔢" },
  { keywords: ["photo", "image", "tasveer", "picture", "camera"], response: "Wah! Aapne ek photo bheja. Main image dekh sakta hoon — meri nazar mein aapka photo bahut achha hai! 📸" },
  { keywords: ["help", "madad", "support", "assist"], response: "Main aapki madad karne ke liye yahaan hoon! Aap mujhse kuch bhi pooch sakte hain — jokes, facts, ya general baatein. 💬" },
  { keywords: ["bye", "goodbye", "alvida", "tata", "phir milenge"], response: "Alvida! Dobara aate rehna. Main yahaan hoon aapke liye. 👋😊" },
  { keywords: ["love", "pyaar", "mohabbat", "ishq"], response: "Pyaar ek anmol ehsaas hai! ❤️ Kya aap kisi khaas ke baare mein baat karna chahte hain?" },
  { keywords: ["food", "khana", "khaana", "recipe", "cook"], response: "Mujhe khana bahut pasand hai! 🍛 Dal chawal, biryani, pizza — sab achha lagta hai. Aapka favorite kya hai?" },
  { keywords: ["sport", "cricket", "football", "khel"], response: "Cricket India ka dil hai! 🏏 Kya aap India ki team ke fan hain? Rohit Sharma ya Virat Kohli?" },
  { keywords: ["music", "gaana", "song", "geet", "sangeet"], response: "Music soul ko sukoon deta hai! 🎵 Bollywood, classical, ya pop — aapko kaunsa pasand hai?" },
  { keywords: ["study", "padhai", "school", "college", "university"], response: "Padhai bahut zaroori hai! 📚 Consistency aur smart work se sab possible hai. Kya aap kisi subject mein madad chahte hain?" },
  { keywords: ["age", "umra", "kitne saal", "old"], response: "Main ek AI hoon, isliye meri officially koi umra nahi! Lekin main bahut young aur energetic hoon 😄" },
];

function getBotResponse(input) {
  const lower = input.toLowerCase();
  for (const entry of DATASET) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return entry.response;
    }
  }
  return "Hmm, mujhe is sawaal ka jawab nahi pata abhi. 🤔 Kuch aur puchho — main seekh raha hoon!";
}

// ─── ICONS ──────────────────────────────────────────────────────────────────
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const GalleryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const BotIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7H3a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zM7.5 14a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm9 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM5 21v-1.5A1.5 1.5 0 0 1 6.5 18h11a1.5 1.5 0 0 1 1.5 1.5V21H5z" />
  </svg>
);

// ─── TYPING INDICATOR ───────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center", padding: "10px 14px" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 8, height: 8, borderRadius: "50%", background: "#a78bfa",
          animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s`,
          display: "inline-block"
        }} />
      ))}
    </div>
  );
}

// ─── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, from: "bot", text: "Assalamualaikum! Main SmartBot hoon 🤖\nMujhse kuch bhi poochho — text likho, photo lo, ya gallery se image bhejo!", time: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const addUserMessage = (text, imgSrc = null) => {
    const msg = { id: Date.now(), from: "user", text, img: imgSrc, time: new Date() };
    setMessages((p) => [...p, msg]);
    return msg;
  };

  const addBotMessage = (text) => {
    setMessages((p) => [...p, { id: Date.now() + 1, from: "bot", text, time: new Date() }]);
  };

  const triggerBot = useCallback((userText) => {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      addBotMessage(getBotResponse(userText));
    }, 900 + Math.random() * 600);
  }, []);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    addUserMessage(trimmed);
    setInput("");
    triggerBot(trimmed);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Camera
  const openCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setStream(s);
      setCameraOpen(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s; }, 100);
    } catch { addBotMessage("Camera access nahi mila. Browser settings check karein! 📷"); }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
    closeCamera();
    addUserMessage("📸 Photo liya!", dataUrl);
    triggerBot("photo");
  };

  const closeCamera = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setCameraOpen(false);
  };

  // Gallery
  const handleGallery = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addUserMessage("🖼️ Image bheja!", ev.target.result);
      triggerBot("photo image tasveer");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const fmt = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a12; font-family: 'DM Sans', sans-serif; }
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-8px)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes shimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3d3d5c; border-radius: 4px; }
        textarea { resize: none; }
      `}</style>

      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "radial-gradient(ellipse at 20% 50%, #1a0533 0%, #0a0a12 50%, #001a2c 100%)",
        padding: 16,
      }}>
        {/* Ambient orbs */}
        <div style={{ position:"fixed",top:"-10%",left:"-10%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.12) 0%,transparent 70%)",pointerEvents:"none" }} />
        <div style={{ position:"fixed",bottom:"-10%",right:"-5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(14,165,233,0.1) 0%,transparent 70%)",pointerEvents:"none" }} />

        <div style={{
          width: "100%", maxWidth: 480, height: "min(720px, 92vh)",
          background: "rgba(15,15,28,0.95)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(139,92,246,0.2)",
          borderRadius: 28,
          display: "flex", flexDirection: "column",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.04), 0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(139,92,246,0.08)",
          overflow: "hidden",
          position: "relative",
        }}>

          {/* Header */}
          <div style={{
            padding: "18px 22px",
            background: "linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(14,165,233,0.08) 100%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14,
              background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
              color: "white", flexShrink: 0,
            }}>
              <BotIcon />
            </div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:17, color:"white", letterSpacing:"-0.3px" }}>SmartBot</div>
              <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:2 }}>
                <span style={{ width:7,height:7,borderRadius:"50%",background:"#22c55e",display:"inline-block",animation:"pulse 2s infinite" }} />
                <span style={{ fontSize:12, color:"#6ee7b7", fontWeight:400 }}>Online • Dataset Mode</span>
              </div>
            </div>
            <div style={{ marginLeft:"auto", fontSize:11, color:"rgba(255,255,255,0.3)", textAlign:"right" }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:600, letterSpacing:1 }}>NO API</div>
              <div>Local Data</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"20px 16px", display:"flex", flexDirection:"column", gap:12 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{
                display:"flex", flexDirection:"column",
                alignItems: msg.from === "user" ? "flex-end" : "flex-start",
                animation: "fadeSlideUp 0.3s ease",
              }}>
                <div style={{
                  maxWidth: "80%",
                  background: msg.from === "user"
                    ? "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
                    : "rgba(255,255,255,0.05)",
                  border: msg.from === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: msg.from === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                  padding: "10px 14px",
                  boxShadow: msg.from === "user" ? "0 4px 20px rgba(124,58,237,0.35)" : "none",
                }}>
                  {msg.img && (
                    <img src={msg.img} alt="sent" style={{
                      width:"100%", maxWidth:240, borderRadius:12, display:"block",
                      marginBottom: msg.text !== (msg.from === "user" ? "📸 Photo liya!" : "") ? 8 : 0,
                    }} />
                  )}
                  <div style={{
                    color: msg.from === "user" ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.85)",
                    fontSize:14.5, lineHeight:1.55, whiteSpace:"pre-wrap",
                  }}>
                    {msg.text}
                  </div>
                </div>
                <div style={{ fontSize:10.5, color:"rgba(255,255,255,0.25)", marginTop:4, padding:"0 4px" }}>
                  {fmt(msg.time)}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display:"flex", alignItems:"flex-start", animation:"fadeSlideUp 0.3s ease" }}>
                <div style={{
                  background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)",
                  borderRadius:"20px 20px 20px 4px",
                }}>
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding:"14px 16px 18px",
            borderTop:"1px solid rgba(255,255,255,0.06)",
            background:"rgba(0,0,0,0.2)",
          }}>
            <div style={{
              display:"flex", alignItems:"flex-end", gap:10,
              background:"rgba(255,255,255,0.05)",
              border:"1px solid rgba(255,255,255,0.1)",
              borderRadius:20, padding:"10px 10px 10px 16px",
              transition:"border-color 0.2s",
            }}
              onFocus={() => {}} 
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
                }}
                onKeyDown={handleKey}
                placeholder="Kuch bhi likho..."
                style={{
                  flex:1, background:"transparent", border:"none", outline:"none",
                  color:"rgba(255,255,255,0.9)", fontSize:14.5, lineHeight:1.5,
                  fontFamily:"'DM Sans',sans-serif", minHeight:24, maxHeight:100,
                  overflowY:"auto",
                }}
              />

              <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
                {/* Camera */}
                <button onClick={openCamera} title="Camera" style={{
                  width:36, height:36, borderRadius:12, border:"none",
                  background:"rgba(139,92,246,0.15)", color:"#a78bfa",
                  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(139,92,246,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.background="rgba(139,92,246,0.15)"}
                >
                  <CameraIcon />
                </button>

                {/* Gallery */}
                <button onClick={() => fileRef.current?.click()} title="Gallery" style={{
                  width:36, height:36, borderRadius:12, border:"none",
                  background:"rgba(14,165,233,0.15)", color:"#38bdf8",
                  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background="rgba(14,165,233,0.3)"}
                  onMouseLeave={e => e.currentTarget.style.background="rgba(14,165,233,0.15)"}
                >
                  <GalleryIcon />
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleGallery} />

                {/* Send */}
                <button onClick={handleSend} title="Send" style={{
                  width:36, height:36, borderRadius:12, border:"none",
                  background: input.trim() ? "linear-gradient(135deg,#7c3aed,#0ea5e9)" : "rgba(255,255,255,0.07)",
                  color: input.trim() ? "white" : "rgba(255,255,255,0.3)",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  transition:"all 0.2s",
                  boxShadow: input.trim() ? "0 4px 16px rgba(124,58,237,0.4)" : "none",
                }}>
                  <SendIcon />
                </button>
              </div>
            </div>

            <div style={{ textAlign:"center", marginTop:10, fontSize:11, color:"rgba(255,255,255,0.2)" }}>
              Dataset-powered • No external API • Local responses
            </div>
          </div>
        </div>

        {/* Camera Modal */}
        {cameraOpen && (
          <div style={{
            position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)",
            display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000,
            animation:"fadeSlideUp 0.2s ease",
          }}>
            <div style={{
              background:"rgba(15,15,28,0.98)", borderRadius:24,
              border:"1px solid rgba(139,92,246,0.3)", overflow:"hidden",
              width:"min(420px,90vw)", boxShadow:"0 32px 80px rgba(0,0,0,0.8)",
            }}>
              <div style={{ padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"white", fontSize:15 }}>📷 Camera</span>
                <button onClick={closeCamera} style={{ background:"rgba(255,255,255,0.08)", border:"none", borderRadius:8, color:"white", cursor:"pointer", width:32, height:32, display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <CloseIcon />
                </button>
              </div>
              <video ref={videoRef} autoPlay playsInline muted style={{ width:"100%", display:"block", maxHeight:320, objectFit:"cover", background:"#000" }} />
              <canvas ref={canvasRef} style={{ display:"none" }} />
              <div style={{ padding:16, display:"flex", justifyContent:"center" }}>
                <button onClick={capturePhoto} style={{
                  padding:"12px 36px", borderRadius:50, border:"2px solid rgba(139,92,246,0.5)",
                  background:"linear-gradient(135deg,#7c3aed,#6d28d9)", color:"white",
                  fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, cursor:"pointer",
                  boxShadow:"0 4px 24px rgba(124,58,237,0.5)", letterSpacing:"0.5px",
                }}>
                  📸 Capture
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
