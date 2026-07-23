import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Search, Plus, Mic, Send, ChevronLeft, ChevronRight,
  CheckCheck, MessageCircle, Sparkles, Play, Pause,
  Heart, Trophy, Radio,
  SkipBack, SkipForward, Bell, LogOut, Shield, Moon,
  Swords, Gamepad2, Dice5, Flame
} from "lucide-react";

/* =========================================================================
   NOXCHAT — Sprint 1 Prototype
   Palette + type pulled directly from the reference moodboard:
     Dark Charcoal #000000 / Burnham Green #013324 / Cosmic Latte #F9F3E1
     Camel #C19A6B / Navy #101826 / Deep Forest #102C26
     Champagne #F7E7CE / Ivory #FFF2E1 / Donkey Brown #A79277
     Type: Archivo Black (headline) + Literata (serif body) + Bricolage
     Grotesque (UI workhorse) — the two pairings from the font-pairing
     reel, split by job: Archivo Black for branded moments, Literata for
     long-form blog reading, Bricolage Grotesque for everything in between.

   Structural idea: the "read & reflect" surfaces (Home, Vibes, Profile,
   Onboarding) live in warm daylight paper tones. The "play & connect"
   surfaces (Games, Chat) live in a dark forest-charcoal — so the palette
   itself signals what kind of a moment you're in.
   ========================================================================= */

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Bricolage+Grotesque:wght@400;500;600;700&family=Literata:ital,wght@0,400;0,500;0,600;1,400&display=swap');

.nx2-root, .nx2-root * { box-sizing: border-box; }
.nx2-root {
  --charcoal: #000000;
  --forest: #102C26;
  --forest-deep: #013324;
  --latte: #F9F3E1;
  --ivory: #FFF2E1;
  --champagne: #F7E7CE;
  --camel: #C19A6B;
  --navy: #101826;
  --donkey: #A79277;
  --ink: #1B1712;
  --ink-dim: #776E5E;
  --noir: #0C1512;
  --noir-2: #142019;
  --noir-3: #1C2921;
  font-family: 'Bricolage Grotesque', sans-serif;
  -webkit-font-smoothing: antialiased;
}
.nx2-root .nx2-display { font-family: 'Archivo Black', sans-serif; letter-spacing: -0.01em; }
.nx2-root .nx2-serif { font-family: 'Literata', serif; }
.nx2-root ::-webkit-scrollbar { display: none; }
.nx2-root * { scrollbar-width: none; }
.nx2-root :focus-visible { outline: 2px solid var(--forest); outline-offset: 2px; border-radius: 8px; }
.nx2-root.nx2-ondark :focus-visible { outline-color: var(--camel); }

.nx2-pressable { transition: transform 0.15s cubic-bezier(.22,1,.36,1); cursor: pointer; }
.nx2-pressable:active { transform: scale(0.96); }

@keyframes nx2Rise { 0% { transform: translateY(12px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
.nx2-rise { animation: nx2Rise 0.5s cubic-bezier(.16,1,.3,1) both; }

@keyframes nx2RevealUp { 0% { transform: translateY(100%); opacity: 0; } 100% { transform: translateY(0%); opacity: 1; } }
.nx2-reveal { display: inline-block; animation: nx2RevealUp 0.7s cubic-bezier(.16,1,.3,1) both; }

@keyframes nx2Spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.nx2-spin { animation: nx2Spin 6s linear infinite; }

@keyframes nx2Pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(16,44,38,0.35); } 50% { box-shadow: 0 0 0 8px rgba(16,44,38,0); } }
.nx2-pulse { animation: nx2Pulse 2.2s ease-out infinite; }
.nx2-ondark .nx2-pulse { animation-name: nx2PulseDark; }
@keyframes nx2PulseDark { 0%, 100% { box-shadow: 0 0 0 0 rgba(193,154,107,0.4); } 50% { box-shadow: 0 0 0 9px rgba(193,154,107,0); } }

@keyframes nx2Blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
.nx2-live-dot { animation: nx2Blink 1.3s ease-in-out infinite; }

@keyframes nx2Fade { from { opacity: 0; } to { opacity: 1; } }
.nx2-fade { animation: nx2Fade 0.4s ease both; }

@media (prefers-reduced-motion: reduce) {
  .nx2-root *, .nx2-root *::before, .nx2-root *::after {
    animation-duration: 0.001ms !important; transition-duration: 0.001ms !important;
  }
}
`;

/* ---------------- mock data ---------------- */

const BLOGS = [
  { id: "b1", title: "Why your group chat needs a coin economy", category: "Culture", swatch: "#102C26", author: "Maya R.", readTime: "4 min", excerpt: "Betting a few fake coins on trivia does something real to a friend group \u2014 it gives the inside jokes a scoreboard." },
  { id: "b2", title: "The lost art of the voice note", category: "Essays", swatch: "#A79277", author: "Theo K.", readTime: "6 min", excerpt: "A text can be reread for tone. A voice note can't hide what it actually sounded like to say it out loud." },
  { id: "b3", title: "Ghost mode is a feature, not a red flag", category: "Product", swatch: "#013324", author: "Priya N.", readTime: "3 min", excerpt: "Presence shouldn't be a performance. Sometimes the kindest status is no status at all." },
];

const VIBES = [
  { id: "v1", user: "Maya", swatch: "#102C26", caption: "cabin weekend \u2728", song: "Sunset Blvd \u2014 Nia James" },
  { id: "v2", user: "Sam", swatch: "#C19A6B", caption: "3am diner run", song: null },
  { id: "v3", user: "Theo", swatch: "#013324", caption: "quiz night champion \uD83C\uDFC6", song: "Victory Lap \u2014 KOTO" },
  { id: "v4", user: "Priya", swatch: "#A79277", caption: "new plant, who dis", song: null },
];

const GAME_CATS = [
  { id: "gc1", label: "Live now", swatch: "#013324" },
  { id: "gc2", label: "1v1", swatch: "#A79277" },
  { id: "gc3", label: "Party", swatch: "#102C26" },
];

const GAMES = [
  { id: "g1", name: "Quiz Battle", icon: Swords, players: ["Maya","Theo","Sam"], live: true, pot: "35 coins" },
  { id: "g2", name: "Tic-Tac-Toe", icon: Gamepad2, players: ["Priya"], live: false, pot: "Open lobby" },
  { id: "g3", name: "Truth or Dare", icon: Dice5, players: ["Maya","Sam","Theo","Priya"], live: true, pot: "No bet" },
];

const CHATS = [
  { id: "c1", name: "Weekend Trip", preview: "packing list is in the to-do list!", time: "2m", unread: 3 },
  { id: "c2", name: "Maya", preview: "sent a voice note \u2022 0:42", time: "12m", unread: 0 },
  { id: "c3", name: "Quiz Night Crew", preview: "sent an Echo message", time: "1h", unread: 0 },
];

const MESSAGES = [
  { id: "m1", mine: false, text: "ok who's driving Friday" },
  { id: "m2", mine: true, text: "I can take 3 people, car's already packed with snacks" },
  { id: "m3", mine: false, text: "packing list is in the to-do list!" },
];

const ONBOARDING = [
  { title: "One app.\nEvery vibe.", body: "Chat, play, share and read \u2014 without switching apps four times before breakfast.", swatch: "#102C26" },
  { title: "Play for\nbragging rights.", body: "Bet Nox Coins on trivia, tic-tac-toe and truth or dare with the people already in your chats.", swatch: "#A79277" },
  { title: "Share a vibe,\nnot a highlight reel.", body: "Vibes disappear in 24 hours. No pressure, just the moment.", swatch: "#013324" },
];

/* ---------------- hooks ---------------- */

function useMagnetic(strength = 0.3, max = 12) {
  const ref = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  const loop = useCallback(() => {
    current.current.x += (target.current.x - current.current.x) * 0.18;
    current.current.y += (target.current.y - current.current.y) * 0.18;
    if (ref.current) ref.current.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;
    raf.current = requestAnimationFrame(loop);
  }, []);
  useEffect(() => { raf.current = requestAnimationFrame(loop); return () => cancelAnimationFrame(raf.current); }, [loop]);
  const onMouseMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    target.current = { x: Math.max(-max, Math.min(max, dx * strength)), y: Math.max(-max, Math.min(max, dy * strength)) };
  };
  const onMouseLeave = () => { target.current = { x: 0, y: 0 }; };
  return { ref, onMouseMove, onMouseLeave };
}

function useSlidingIndicator(activeKey, itemRefs) {
  const [rect, setRect] = useState({ left: 0, width: 0 });
  useEffect(() => {
    const el = itemRefs.current[activeKey];
    if (el) setRect({ left: el.offsetLeft, width: el.offsetWidth });
  }, [activeKey, itemRefs]);
  return rect;
}

/* ---------------- atoms ---------------- */

function TextReveal({ text, className = "", tag: Tag = "span" }) {
  const lines = text.split("\n");
  return (
    <Tag className={className}>
      {lines.map((line, li) => (
        <span key={li} style={{ display: "block", overflow: "hidden" }}>
          <span className="nx2-reveal" style={{ animationDelay: `${li * 90}ms` }}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

// The signature element: a rounded color-block "swatch" card with a label,
// echoing the palette/color-combo reels this whole system was pulled from.
function Swatch({ color, label, sublabel, height = 96, radius = 20, small = false, selected = false }) {
  return (
    <div
      className="nx2-pressable"
      style={{
        background: color, borderRadius: radius, height, padding: small ? "10px 12px" : "14px 16px",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        boxShadow: selected ? `0 0 0 2px var(--latte), 0 0 0 4px ${color}` : "0 6px 18px rgba(0,0,0,0.18)",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(200deg, rgba(255,255,255,0.14), transparent 55%)" }} />
      <span className="nx2-display" style={{ position: "relative", fontSize: small ? 11 : 13, color: "#fff", letterSpacing: "0.01em" }}>{label}</span>
      {sublabel && <span style={{ position: "relative", fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>{sublabel}</span>}
    </div>
  );
}

function Avatar({ name, size = 44, ring = false }) {
  const initial = name?.[0]?.toUpperCase() || "?";
  const hue = useMemo(() => { let h = 0; for (let i = 0; i < (name || "").length; i++) h = (h * 31 + name.charCodeAt(i)) % 360; return h; }, [name]);
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      {ring && (
        <div style={{ position: "absolute", inset: -3, borderRadius: "50%", padding: 2, background: "conic-gradient(from 0deg, var(--camel), var(--forest), var(--donkey), var(--camel))" }}>
          <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--latte)" }} />
        </div>
      )}
      <div className="nx2-display" style={{
        position: "absolute", inset: ring ? 3 : 0, borderRadius: "50%",
        background: `linear-gradient(150deg, hsl(${hue},32%,42%), hsl(${(hue + 30) % 360},28%,26%))`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, color: "#fff",
      }}>
        {initial}
      </div>
    </div>
  );
}

function TopBar({ onAvatarClick, dark = false, title = "Noxchat" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px 6px" }}>
      <span className="nx2-display" style={{ fontSize: 20, color: dark ? "var(--latte)" : "var(--charcoal)" }}>{title}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button aria-label="Search" className="nx2-pressable" style={{
          border: "none", width: 36, height: 36, borderRadius: 12,
          background: dark ? "var(--noir-2)" : "var(--ivory)", color: dark ? "var(--latte)" : "var(--ink)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Search size={16} />
        </button>
        <button aria-label="Open profile" onClick={onAvatarClick} className="nx2-pressable" style={{ border: "none", background: "none", padding: 0 }}>
          <Avatar name="You" size={36} />
        </button>
      </div>
    </div>
  );
}

function FloatingChatButton({ onClick }) {
  const m = useMagnetic(0.3, 10);
  return (
    <button
      ref={m.ref} onMouseMove={m.onMouseMove} onMouseLeave={m.onMouseLeave}
      onClick={onClick} aria-label="Open chats"
      className="nx2-pressable nx2-pulse"
      style={{
        position: "absolute", right: 20, bottom: 96, zIndex: 6, width: 56, height: 56, borderRadius: "50%", border: "none",
        background: "linear-gradient(150deg, var(--forest), var(--forest-deep))",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 10px 24px rgba(1,51,36,0.45)",
      }}
    >
      <MessageCircle size={22} color="var(--latte)" />
      <div style={{ position: "absolute", top: 4, right: 4, width: 10, height: 10, borderRadius: "50%", background: "var(--camel)", border: "2px solid var(--latte)" }} />
    </button>
  );
}

/* =========================================================================
   SPLASH
   ========================================================================= */

function SplashScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      onClick={onDone}
      style={{
        height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "radial-gradient(120% 90% at 50% 0%, var(--forest), var(--noir) 75%)", gap: 14, cursor: "pointer",
      }}
    >
      <div className="nx2-rise" style={{
        width: 64, height: 64, borderRadius: 20, background: "linear-gradient(150deg, var(--camel), var(--donkey))",
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6,
      }}>
        <MessageCircle size={28} color="var(--noir)" />
      </div>
      <TextReveal text="Noxchat" tag="h1" className="nx2-display" />
      <style>{`.nx2-root h1.nx2-display { font-size: 34px; color: var(--latte); margin: 0; }`}</style>
      <p className="nx2-rise" style={{ animationDelay: "300ms", color: "var(--donkey)", fontSize: 13, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Chat &middot; Play &middot; Vibe
      </p>
    </div>
  );
}

/* =========================================================================
   ONBOARDING
   ========================================================================= */

function OnboardingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const slide = ONBOARDING[step];
  const isLast = step === ONBOARDING.length - 1;

  return (
    <div className="nx2-fade" key={step} style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--latte)" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "18px 20px 0" }}>
        {!isLast && (
          <button onClick={onDone} className="nx2-pressable" style={{ border: "none", background: "none", color: "var(--ink-dim)", fontSize: 13, fontWeight: 600 }}>
            Skip
          </button>
        )}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 26px" }}>
        <div className="nx2-rise" style={{ width: "100%", height: 190, borderRadius: 28, background: slide.swatch, marginBottom: 30, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(200deg, rgba(255,255,255,0.18), transparent 60%)" }} />
        </div>
        <TextReveal key={step} text={slide.title} tag="h2" className="nx2-display" />
        <style>{`.nx2-root h2.nx2-display { font-size: 30px; line-height: 1.15; color: var(--charcoal); margin: 0 0 12px; white-space: pre-line; }`}</style>
        <p className="nx2-rise" style={{ animationDelay: "150ms", fontSize: 15, lineHeight: 1.5, color: "var(--ink-dim)" }}>{slide.body}</p>
      </div>

      <div style={{ padding: "0 26px 34px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
          {ONBOARDING.map((_, i) => (
            <div key={i} style={{ height: 4, borderRadius: 2, flex: 1, background: i <= step ? "var(--forest)" : "var(--champagne)", transition: "background 0.3s ease" }} />
          ))}
        </div>
        <button
          onClick={() => (isLast ? onDone() : setStep((s) => s + 1))}
          className="nx2-pressable"
          style={{
            width: "100%", border: "none", padding: "16px 0", borderRadius: 18,
            background: "linear-gradient(135deg, var(--forest), var(--forest-deep))", color: "var(--latte)",
            fontSize: 15, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {isLast ? "Get started" : "Next"} <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   HOME — music now-playing + blog feed
   ========================================================================= */

function MusicCard() {
  const [playing, setPlaying] = useState(true);
  return (
    <div className="nx2-rise" style={{
      margin: "4px 20px 22px", borderRadius: 22, padding: 16, background: "var(--charcoal)",
      display: "flex", alignItems: "center", gap: 14, position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(193,154,107,0.18), transparent 60%)" }} />
      <div style={{
        width: 52, height: 52, borderRadius: "50%", flexShrink: 0, position: "relative",
        background: "radial-gradient(circle at 50% 50%, #2a2016 0%, #100c07 60%)",
        border: "3px solid #3a2f20",
      }} className={playing ? "nx2-spin" : ""}>
        <div style={{ position: "absolute", inset: "38%", borderRadius: "50%", background: "var(--camel)" }} />
      </div>
      <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: "var(--latte)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Sunset Blvd</div>
        <div style={{ fontSize: 12, color: "var(--donkey)" }}>Nia James &middot; shared by Maya</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
        <SkipBack size={16} color="var(--donkey)" />
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
          className="nx2-pressable"
          style={{ border: "none", width: 34, height: 34, borderRadius: "50%", background: "var(--camel)", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          {playing ? <Pause size={14} color="var(--charcoal)" fill="var(--charcoal)" /> : <Play size={14} color="var(--charcoal)" fill="var(--charcoal)" />}
        </button>
        <SkipForward size={16} color="var(--donkey)" />
      </div>
    </div>
  );
}

function BlogCard({ post, i }) {
  return (
    <div className="nx2-pressable nx2-rise" style={{ animationDelay: `${i * 70}ms`, margin: "0 20px 16px", display: "flex", gap: 14 }}>
      <div style={{ width: 74, flexShrink: 0 }}>
        <Swatch color={post.swatch} label={post.category} height={74} radius={16} small />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 className="nx2-display" style={{ fontSize: 15, margin: "0 0 5px", color: "var(--charcoal)", lineHeight: 1.25 }}>{post.title}</h3>
        <p className="nx2-serif" style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink-dim)", margin: "0 0 6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {post.excerpt}
        </p>
        <span style={{ fontSize: 11.5, color: "var(--donkey)" }}>{post.author} &middot; {post.readTime}</span>
      </div>
    </div>
  );
}

function HomeScreen({ onAvatarClick }) {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: "var(--latte)", paddingBottom: 110 }}>
      <TopBar onAvatarClick={onAvatarClick} />
      <MusicCard />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0 20px 12px" }}>
        <span className="nx2-display" style={{ fontSize: 13, color: "var(--charcoal)", letterSpacing: "0.04em", textTransform: "uppercase" }}>From your friends</span>
        <span style={{ fontSize: 12, color: "var(--forest)", fontWeight: 700 }}>See all</span>
      </div>
      {BLOGS.map((b, i) => <BlogCard key={b.id} post={b} i={i} />)}
    </div>
  );
}

/* =========================================================================
   VIBES — status/stories, using the swatch-card motif as the main grid
   ========================================================================= */

function VibesScreen({ onAvatarClick }) {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: "var(--latte)", paddingBottom: 110 }}>
      <TopBar onAvatarClick={onAvatarClick} title="Vibes" />
      <div style={{ display: "flex", gap: 14, padding: "6px 20px 18px", overflowX: "auto" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 56 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", border: "1.5px dashed var(--donkey)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--forest)" }}>
            <Plus size={18} />
          </div>
          <span style={{ fontSize: 11, color: "var(--ink-dim)" }}>Add yours</span>
        </div>
        {VIBES.map((v) => (
          <div key={v.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 56 }}>
            <Avatar name={v.user} size={46} ring />
            <span style={{ fontSize: 11, color: "var(--ink-dim)" }}>{v.user}</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {VIBES.map((v, i) => (
          <div key={v.id} className="nx2-rise" style={{ animationDelay: `${i * 70}ms` }}>
            <Swatch color={v.swatch} label={v.user} sublabel={v.caption} height={150} />
            {v.song && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, fontSize: 11, color: "var(--donkey)" }}>
                <Radio size={11} /> {v.song}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   GAMES — dark surface
   ========================================================================= */

function GameRow({ game, i }) {
  const Icon = game.icon;
  return (
    <div className="nx2-pressable nx2-rise" style={{
      animationDelay: `${i * 70}ms`, margin: "0 20px 12px", padding: 14, borderRadius: 18,
      background: "var(--noir-2)", display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{ width: 42, height: 42, borderRadius: 13, background: "linear-gradient(135deg, var(--camel), var(--donkey))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={19} color="var(--noir)" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 14.5, color: "var(--latte)" }}>{game.name}</span>
          {game.live && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: "#FF9B7A" }}>
              <span className="nx2-live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF9B7A" }} /> LIVE
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: "var(--donkey)", marginTop: 2 }}>{game.players.length} playing &middot; {game.pot}</div>
      </div>
      <div style={{ display: "flex" }}>
        {game.players.slice(0, 3).map((p, idx) => (
          <div key={p} style={{ marginLeft: idx === 0 ? 0 : -10 }}><Avatar name={p} size={26} /></div>
        ))}
      </div>
      <button className="nx2-pressable" style={{
        border: "none", padding: "8px 14px", borderRadius: 12, background: "var(--camel)", color: "var(--noir)", fontWeight: 700, fontSize: 12.5,
      }}>
        {game.live ? "Join" : "Start"}
      </button>
    </div>
  );
}

function GamesScreen({ onAvatarClick }) {
  const [activeCat, setActiveCat] = useState("gc1");
  return (
    <div className="nx2-ondark" style={{ height: "100%", overflowY: "auto", background: "var(--noir)", paddingBottom: 110 }}>
      <TopBar onAvatarClick={onAvatarClick} title="Games" dark />
      <div style={{ display: "flex", gap: 10, padding: "6px 20px 18px", overflowX: "auto" }}>
        {GAME_CATS.map((c) => (
          <button
            key={c.id} onClick={() => setActiveCat(c.id)}
            className="nx2-pressable"
            style={{
              border: "none", flexShrink: 0, padding: "9px 16px", borderRadius: 14,
              background: activeCat === c.id ? c.swatch : "var(--noir-2)",
              color: activeCat === c.id ? "var(--latte)" : "var(--donkey)", fontSize: 12.5, fontWeight: 700,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div style={{ margin: "0 20px 16px", padding: 16, borderRadius: 20, background: "var(--noir-2)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--forest)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Flame size={18} color="var(--camel)" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--latte)" }}>128 Nox Coins</div>
          <div style={{ fontSize: 11.5, color: "var(--donkey)" }}>#2 on Weekend Trip's leaderboard</div>
        </div>
      </div>

      {GAMES.map((g, i) => <GameRow key={g.id} game={g} i={i} />)}
    </div>
  );
}

/* =========================================================================
   PROFILE — opened via the top-right avatar, not a bottom tab
   ========================================================================= */

function SettingsRow({ icon: Icon, label, danger }) {
  return (
    <div className="nx2-pressable" style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 20px" }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: "var(--ivory)", display: "flex", alignItems: "center", justifyContent: "center", color: danger ? "#B5432D" : "var(--forest)" }}>
        <Icon size={16} />
      </div>
      <div style={{ flex: 1, fontSize: 14.5, fontWeight: 600, color: danger ? "#B5432D" : "var(--ink)" }}>{label}</div>
      <ChevronRight size={16} color="var(--donkey)" />
    </div>
  );
}

function ProfileScreen({ onBack }) {
  return (
    <div style={{ height: "100%", overflowY: "auto", background: "var(--latte)", paddingBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 14px 4px" }}>
        <button onClick={onBack} aria-label="Back" className="nx2-pressable" style={{ border: "none", width: 34, height: 34, borderRadius: 12, background: "var(--ivory)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={18} />
        </button>
        <span className="nx2-display" style={{ fontSize: 16 }}>Profile</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "18px 20px 10px" }}>
        <Avatar name="You" size={76} ring />
        <span className="nx2-display" style={{ fontSize: 18 }}>You</span>
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div className="nx2-display" style={{ fontSize: 16 }}>128</div>
            <div style={{ fontSize: 11, color: "var(--donkey)" }}>Nox Coins</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="nx2-display" style={{ fontSize: 16 }}>#2</div>
            <div style={{ fontSize: 11, color: "var(--donkey)" }}>Leaderboard</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div className="nx2-display" style={{ fontSize: 16 }}>5</div>
            <div style={{ fontSize: 11, color: "var(--donkey)" }}>Groups</div>
          </div>
        </div>
      </div>

      <div style={{ margin: "16px 20px 6px", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--donkey)" }}>Settings</div>
      <div style={{ background: "var(--ivory)", margin: "0 20px", borderRadius: 18, overflow: "hidden" }}>
        <SettingsRow icon={Moon} label="Sleep mode" />
        <div style={{ height: 1, background: "var(--champagne)", margin: "0 20px" }} />
        <SettingsRow icon={Bell} label="Notifications" />
        <div style={{ height: 1, background: "var(--champagne)", margin: "0 20px" }} />
        <SettingsRow icon={Shield} label="Privacy & safety" />
      </div>
      <div style={{ background: "var(--ivory)", margin: "16px 20px 0", borderRadius: 18, overflow: "hidden" }}>
        <SettingsRow icon={LogOut} label="Log out" danger />
      </div>
    </div>
  );
}

/* =========================================================================
   CHAT — list + a single conversation, dark surface
   ========================================================================= */

function ChatListScreen({ onBack, onOpenChat }) {
  return (
    <div className="nx2-ondark" style={{ height: "100%", overflowY: "auto", background: "var(--noir)", paddingBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 20px 10px" }}>
        <button onClick={onBack} aria-label="Back" className="nx2-pressable" style={{ border: "none", width: 34, height: 34, borderRadius: 12, background: "var(--noir-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={18} color="var(--latte)" />
        </button>
        <span className="nx2-display" style={{ fontSize: 18, color: "var(--latte)" }}>Chats</span>
      </div>
      <div style={{ padding: "6px 14px" }}>
        {CHATS.map((c, i) => (
          <div key={c.id} onClick={() => onOpenChat(c)} className="nx2-pressable nx2-rise" style={{
            animationDelay: `${i * 60}ms`, display: "flex", alignItems: "center", gap: 12, padding: "10px", borderRadius: 16,
          }}>
            <Avatar name={c.name} size={48} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--latte)" }}>{c.name}</div>
              <div style={{ fontSize: 12.5, color: "var(--donkey)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.preview}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
              <span style={{ fontSize: 11, color: "var(--donkey)" }}>{c.time}</span>
              {c.unread > 0 && (
                <div style={{ minWidth: 18, height: 18, borderRadius: 9, background: "var(--camel)", color: "var(--noir)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10.5, fontWeight: 700, padding: "0 5px" }}>
                  {c.unread}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConversationScreen({ chat, onBack }) {
  const [text, setText] = useState("");
  const send = useMagnetic(0.35, 10);
  return (
    <div className="nx2-ondark" style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--noir)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 14px 12px", borderBottom: "1px solid var(--noir-2)" }}>
        <button onClick={onBack} aria-label="Back" className="nx2-pressable" style={{ border: "none", width: 34, height: 34, borderRadius: 12, background: "var(--noir-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ChevronLeft size={18} color="var(--latte)" />
        </button>
        <Avatar name={chat.name} size={34} />
        <div style={{ fontWeight: 700, fontSize: 14.5, color: "var(--latte)" }}>{chat.name}</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
        {MESSAGES.map((m) => (
          <div key={m.id} className="nx2-rise" style={{ display: "flex", flexDirection: "column", alignItems: m.mine ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={{
              maxWidth: "78%", padding: "10px 14px", borderRadius: 18,
              borderBottomRightRadius: m.mine ? 5 : 18, borderBottomLeftRadius: m.mine ? 18 : 5,
              background: m.mine ? "linear-gradient(135deg, var(--forest), var(--forest-deep))" : "var(--noir-2)",
              color: "var(--latte)", fontSize: 14.5, lineHeight: 1.4,
            }}>
              {m.text}
            </div>
            {m.mine && <CheckCheck size={13} color="var(--camel)" style={{ marginTop: 3 }} />}
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 14px 18px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, background: "var(--noir-2)", borderRadius: 20, padding: "10px 16px" }}>
          <input
            value={text} onChange={(e) => setText(e.target.value)} placeholder="Message"
            style={{ width: "100%", background: "none", border: "none", outline: "none", color: "var(--latte)", fontSize: 14.5 }}
          />
        </div>
        <button
          ref={send.ref} onMouseMove={send.onMouseMove} onMouseLeave={send.onMouseLeave}
          aria-label={text ? "Send" : "Record"} className="nx2-pressable"
          style={{
            width: 42, height: 42, borderRadius: "50%", border: "none", flexShrink: 0,
            background: "linear-gradient(135deg, var(--camel), var(--donkey))", color: "var(--noir)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {text ? <Send size={16} /> : <Mic size={17} />}
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   BOTTOM NAV — minimized to 3 items since Profile now lives up top
   ========================================================================= */

const TABS = [
  { key: "home", label: "Home", icon: Sparkles },
  { key: "vibes", label: "Vibes", icon: Heart },
  { key: "games", label: "Games", icon: Trophy },
];

function BottomNav({ active, onChange }) {
  const itemRefs = useRef({});
  const rect = useSlidingIndicator(active, itemRefs);
  return (
    <div style={{ position: "absolute", left: 50, right: 50, bottom: 16, zIndex: 5 }}>
      <div style={{
        position: "relative", display: "flex", borderRadius: 22, padding: 6,
        background: "var(--charcoal)", boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
      }}>
        <div style={{
          position: "absolute", top: 6, bottom: 6, left: rect.left, width: rect.width,
          background: "linear-gradient(135deg, var(--camel), var(--donkey))", borderRadius: 16,
          transition: "left 0.4s cubic-bezier(.22,1,.36,1), width 0.4s cubic-bezier(.22,1,.36,1)",
        }} />
        {TABS.map((t) => {
          const Icon = t.icon; const isActive = active === t.key;
          return (
            <button
              key={t.key} ref={(el) => { itemRefs.current[t.key] = el; }}
              onClick={() => onChange(t.key)} className="nx2-pressable"
              style={{
                position: "relative", zIndex: 1, flex: 1, border: "none", background: "none",
                padding: "9px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                color: isActive ? "var(--noir)" : "var(--donkey)",
              }}
            >
              <Icon size={16} strokeWidth={isActive ? 2.4 : 2} />
              <span style={{ fontSize: 9.5, fontWeight: 700 }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================================
   PHONE FRAME + STATUS BAR
   ========================================================================= */

function StatusBarMock({ dark }) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => { const i = setInterval(() => setTime(new Date()), 30000); return () => clearInterval(i); }, []);
  const h = time.getHours() % 12 || 12, m = String(time.getMinutes()).padStart(2, "0");
  const color = dark ? "var(--latte)" : "var(--charcoal)";
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 46, zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px", fontSize: 13.5, fontWeight: 700, color }}>
      <span>{h}:{m}</span>
      <div style={{ position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)", width: 90, height: 24, borderRadius: 14, background: "#000" }} />
      <div style={{ width: 20, height: 10, border: `1.4px solid ${color}`, borderRadius: 3, position: "relative" }}>
        <div style={{ position: "absolute", inset: 1.5, right: 4, background: color, borderRadius: 1 }} />
      </div>
    </div>
  );
}

function PhoneFrame({ children, dark }) {
  return (
    <div style={{ width: "100%", maxWidth: 390, height: 780, margin: "0 auto", borderRadius: 46, padding: 12, background: "linear-gradient(160deg, #2a2420, #0a0806)", boxShadow: "0 25px 70px rgba(0,0,0,0.55), inset 0 1px 1px rgba(255,255,255,0.08)", position: "relative" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 34, overflow: "hidden", position: "relative", background: dark ? "var(--noir)" : "var(--latte)" }}>
        <StatusBarMock dark={dark} />
        <div style={{ position: "absolute", inset: 0, paddingTop: 46 }}>{children}</div>
      </div>
    </div>
  );
}

/* =========================================================================
   APP ROOT — splash -> onboarding -> (tabs + profile/chat overlays)
   ========================================================================= */

export default function NoxchatPrototype() {
  const [stage, setStage] = useState("splash"); // splash | onboarding | app
  const [activeTab, setActiveTab] = useState("home");
  const [overlay, setOverlay] = useState(null); // null | 'profile' | 'chatlist' | 'conversation'
  const [activeChat, setActiveChat] = useState(null);

  const tabScreen = useMemo(() => {
    switch (activeTab) {
      case "home": return <HomeScreen onAvatarClick={() => setOverlay("profile")} />;
      case "vibes": return <VibesScreen onAvatarClick={() => setOverlay("profile")} />;
      case "games": return <GamesScreen onAvatarClick={() => setOverlay("profile")} />;
      default: return null;
    }
  }, [activeTab]);

  const isDarkOverlay = overlay === "chatlist" || overlay === "conversation" || activeTab === "games";

  let body;
  if (stage === "splash") body = <SplashScreen onDone={() => setStage("onboarding")} />;
  else if (stage === "onboarding") body = <OnboardingScreen onDone={() => setStage("app")} />;
  else if (overlay === "profile") body = <ProfileScreen onBack={() => setOverlay(null)} />;
  else if (overlay === "chatlist") body = <ChatListScreen onBack={() => setOverlay(null)} onOpenChat={(c) => { setActiveChat(c); setOverlay("conversation"); }} />;
  else if (overlay === "conversation") body = <ConversationScreen chat={activeChat} onBack={() => setOverlay("chatlist")} />;
  else body = tabScreen;

  const showChrome = stage === "app" && !overlay;

  return (
    <div className={`nx2-root ${isDarkOverlay ? "nx2-ondark" : ""}`} style={{ minHeight: 780, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <style>{GLOBAL_CSS}</style>
      <PhoneFrame dark={stage !== "app" ? stage === "splash" : (activeTab === "games" || overlay === "chatlist" || overlay === "conversation")}>
        {body}
        {showChrome && (
          <>
            <FloatingChatButton onClick={() => setOverlay("chatlist")} />
            <BottomNav active={activeTab} onChange={setActiveTab} />
          </>
        )}
      </PhoneFrame>
    </div>
  );
}
