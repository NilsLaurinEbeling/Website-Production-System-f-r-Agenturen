"use client"
import Link from "next/link"
import { ArrowRight, Check, Star, ArrowUpRight, Zap, Globe, BarChart3, Layers, Clock, Shield, TrendingUp, Users, Brain, FileText } from "lucide-react"

/* ─── tiny SVG UI mockups ─────────────────────────────────────── */
function DashboardMockup() {
  return (
    <svg viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect width="480" height="300" rx="16" fill="#0d0d14" />
      {/* sidebar */}
      <rect x="0" y="0" width="72" height="300" rx="0" fill="#111118" />
      {[40, 80, 120, 160, 200].map((y, i) => (
        <rect key={i} x="20" y={y} width="32" height="8" rx="4" fill={i === 0 ? "#6366f1" : "#ffffff18"} />
      ))}
      {/* top bar */}
      <rect x="72" y="0" width="408" height="36" fill="#0f0f18" />
      <rect x="88" y="12" width="80" height="10" rx="5" fill="#ffffff15" />
      <rect x="420" y="10" width="44" height="14" rx="7" fill="#6366f122" />
      {/* stat cards */}
      {[
        { x: 84, label: "#6366f1", val: "+24%" },
        { x: 192, label: "#10b981", val: "€82k" },
        { x: 300, label: "#f59e0b", val: "98%" },
        { x: 408, label: "#ec4899", val: "1.2k" },
      ].map((c, i) => (
        <g key={i}>
          <rect x={c.x} y="50" width="96" height="60" rx="10" fill="#ffffff06" stroke="#ffffff0f" strokeWidth="1" />
          <rect x={c.x + 10} y="62" width="30" height="6" rx="3" fill="#ffffff25" />
          <rect x={c.x + 10} y="74" width="55" height="14" rx="4" fill={c.label} opacity="0.9" />
          <rect x={c.x + 10} y="94" width="40" height="6" rx="3" fill="#ffffff15" />
        </g>
      ))}
      {/* chart */}
      <rect x="84" y="124" width="240" height="140" rx="12" fill="#ffffff04" stroke="#ffffff0a" strokeWidth="1" />
      <rect x="96" y="134" width="80" height="8" rx="4" fill="#ffffff20" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const heights = [60, 80, 50, 100, 70, 90, 55]
        return (
          <g key={i}>
            <rect x={96 + i * 32} y={240 - heights[i]} width="18" height={heights[i]} rx="6"
              fill={`url(#bar${i})`} opacity="0.85" />
            <defs>
              <linearGradient id={`bar${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#6366f100" />
              </linearGradient>
            </defs>
          </g>
        )
      })}
      {/* right panel */}
      <rect x="336" y="124" width="136" height="140" rx="12" fill="#ffffff04" stroke="#ffffff0a" strokeWidth="1" />
      <rect x="348" y="136" width="60" height="8" rx="4" fill="#ffffff20" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x="348" y={156 + i * 24} width="8" height="8" rx="2" fill={["#6366f1", "#10b981", "#f59e0b", "#ec4899"][i]} />
          <rect x="362" y={158 + i * 24} width="60" height="6" rx="3" fill="#ffffff18" />
          <rect x="430" y={158 + i * 24} width="24" height="6" rx="3" fill="#ffffff10" />
        </g>
      ))}
    </svg>
  )
}

function InvoiceMockup() {
  return (
    <svg viewBox="0 0 420 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect width="420" height="280" rx="16" fill="#0d0d14" />
      <rect x="20" y="20" width="380" height="240" rx="12" fill="#111118" stroke="#ffffff0a" strokeWidth="1" />
      <rect x="36" y="36" width="80" height="10" rx="5" fill="#ffffff25" />
      <rect x="280" y="34" width="100" height="16" rx="8" fill="#10b98122" />
      <rect x="290" y="38" width="80" height="8" rx="4" fill="#10b981" opacity="0.7" />
      {/* table header */}
      <rect x="36" y="64" width="348" height="1" fill="#ffffff0a" />
      {["Client", "Amount", "Date", "Status"].map((_, i) => (
        <rect key={i} x={36 + i * 88} y="72" width={i === 0 ? 70 : 50} height="7" rx="3" fill="#ffffff18" />
      ))}
      <rect x="36" y="86" width="348" height="1" fill="#ffffff08" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect x="36" y={96 + i * 28} width="64" height="8" rx="4" fill="#ffffff15" />
          <rect x="124" y={96 + i * 28} width="44" height="8" rx="4" fill="#6366f180" />
          <rect x="212" y={96 + i * 28} width="48" height="8" rx="4" fill="#ffffff10" />
          <rect x="308" y={94 + i * 28} width="52" height="12" rx="6"
            fill={["#10b98122", "#6366f122", "#10b98122", "#f59e0b22", "#10b98122"][i]} />
          <rect x="316" y={97 + i * 28} width="36" height="6" rx="3"
            fill={["#10b981", "#6366f1", "#10b981", "#f59e0b", "#10b981"][i]} opacity="0.7" />
        </g>
      ))}
    </svg>
  )
}

function RevenueMockup() {
  return (
    <svg viewBox="0 0 420 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <rect width="420" height="280" rx="16" fill="#0d0d14" />
      <rect x="20" y="20" width="380" height="240" rx="12" fill="#111118" stroke="#ffffff0a" strokeWidth="1" />
      <rect x="36" y="36" width="100" height="10" rx="5" fill="#ffffff25" />
      <rect x="36" y="56" width="120" height="28" rx="8" fill="#6366f115" />
      <rect x="44" y="63" width="90" height="14" rx="4" fill="#6366f1" opacity="0.8" />
      <rect x="36" y="94" width="60" height="8" rx="4" fill="#10b98170" />
      {/* area chart */}
      <path d="M36 220 C80 180 120 160 160 140 C200 120 240 130 280 100 C320 70 360 80 384 60 L384 220 Z"
        fill="url(#areaGrad)" opacity="0.3" />
      <path d="M36 220 C80 180 120 160 160 140 C200 120 240 130 280 100 C320 70 360 80 384 60"
        stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* dots */}
      {[[160, 140], [280, 100], [384, 60]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill="#6366f1" />
          <circle cx={x} cy={y} r="9" fill="#6366f1" opacity="0.2" />
        </g>
      ))}
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#6366f100" />
        </linearGradient>
      </defs>
      {/* months */}
      {["Jan", "Mar", "Mai", "Jul", "Sep", "Nov"].map((m, i) => (
        <text key={i} x={36 + i * 70} y="238" fill="#ffffff30" fontSize="9" fontFamily="system-ui">{m}</text>
      ))}
    </svg>
  )
}

function FeatureCardMockup({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%", opacity: 0.9 }}>
      <rect width="320" height="200" rx="12" fill="#0d0d14" />
      <rect x="16" y="16" width="80" height="10" rx="5" fill="#ffffff20" />
      <rect x="16" y="36" width="200" height="6" rx="3" fill="#ffffff10" />
      <rect x="16" y="48" width="160" height="6" rx="3" fill="#ffffff08" />
      <rect x="16" y="72" width="120" height="80" rx="10" fill={`${color}15`} stroke={`${color}30`} strokeWidth="1" />
      <rect x="26" y="84" width="60" height="8" rx="4" fill={color} opacity="0.6" />
      <rect x="26" y="100" width="80" height="6" rx="3" fill="#ffffff15" />
      <rect x="26" y="114" width="65" height="6" rx="3" fill="#ffffff10" />
      <rect x="26" y="128" width="72" height="12" rx="6" fill={`${color}40`} />
      <rect x="152" y="72" width="152" height="80" rx="10" fill="#ffffff04" stroke="#ffffff0a" strokeWidth="1" />
      {[0, 1, 2].map(i => (
        <g key={i}>
          <rect x="162" y={84 + i * 22} width="8" height="8" rx="2" fill={color} opacity="0.7" />
          <rect x="176" y={86 + i * 22} width={[70, 55, 80][i]} height="5" rx="2.5" fill="#ffffff18" />
        </g>
      ))}
    </svg>
  )
}

/* ─── animated marquee ────────────────────────────────────────── */
function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items]
  return (
    <div style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)" }}>
      <div style={{
        display: "flex", gap: 12,
        animation: `marquee${reverse ? "Rev" : ""} 30s linear infinite`,
        width: "max-content"
      }}>
        {doubled.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 100, padding: "10px 20px", whiteSpace: "nowrap",
            fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.6)"
          }}>
            <Check size={13} color="#6366f1" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── page ────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marqueeRev {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%,100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes spinRing {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .fade-up { animation: fadeUp 0.75s ease-out forwards; opacity: 0; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.15s; }
        .d3 { animation-delay: 0.25s; }
        .d4 { animation-delay: 0.4s; }
        .d5 { animation-delay: 0.6s; }
        .float-anim { animation: floatY 5s ease-in-out infinite; }
        .glow-pulse { animation: glow 2.5s ease-in-out infinite; }

        .nav-link {
          color: rgba(255,255,255,0.5);
          font-size: 14px; font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link:hover { color: rgba(255,255,255,0.95); }

        .hero-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          background: #6366f1;
          color: white; font-weight: 700; font-size: 15px;
          padding: 13px 26px; border-radius: 12px;
          text-decoration: none;
          box-shadow: 0 0 32px #6366f155;
          transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
        }
        .hero-btn-primary:hover {
          background: #5254d4;
          box-shadow: 0 0 48px #6366f180;
          transform: translateY(-2px);
        }
        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.65); font-weight: 600; font-size: 15px;
          padding: 13px 24px; border-radius: 12px;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-outline:hover { border-color: rgba(255,255,255,0.3); color: white; }

        .feature-card {
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.025);
          overflow: hidden;
          transition: border-color 0.25s, background 0.25s, transform 0.25s;
        }
        .feature-card:hover {
          border-color: rgba(99,102,241,0.35);
          background: rgba(99,102,241,0.04);
          transform: translateY(-3px);
        }

        .discover-card {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          padding: 28px;
          transition: border-color 0.2s, background 0.2s;
        }
        .discover-card:hover {
          border-color: rgba(99,102,241,0.3);
          background: rgba(99,102,241,0.04);
        }

        .pricing-card {
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          padding: 36px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .pricing-card:hover { transform: translateY(-4px); }
        .pricing-card-popular {
          border-color: #6366f150 !important;
          background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05)) !important;
        }

        .blog-card {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }
        .blog-card:hover { border-color: rgba(99,102,241,0.3); transform: translateY(-3px); }

        .section-badge {
          display: inline-flex; align-items: center; gap: 7px;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 100px; padding: 5px 14px;
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.06em;
          text-transform: uppercase;
          margin-bottom: 20px;
        }

        .grid-bg {
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080810", color: "#f8fafc", fontFamily: "var(--font-geist-sans, system-ui, sans-serif)" }}>

        {/* ── NAV ─────────────────────────────────────────────── */}
        <nav style={{
          position: "fixed", inset: "0 0 auto 0", zIndex: 100,
          background: "rgba(8,8,16,0.75)", backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Zap size={15} color="white" fill="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.025em" }}>AutoWebsite</span>
            </div>

            <div style={{ display: "flex", gap: 28 }}>
              {["Features", "Preise", "Blog"].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Link href="/login" className="nav-link" style={{ padding: "8px 14px" }}>Anmelden</Link>
              <Link href="/login" className="hero-btn-primary" style={{ padding: "9px 20px", fontSize: 14 }}>
                Kostenlos starten <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: 100 }}>
          <div className="grid-bg" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
          {/* orbs */}
          <div className="glow-pulse" style={{ position: "absolute", top: "20%", left: "20%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)", filter: "blur(60px)", pointerEvents: "none" }} />
          <div className="glow-pulse" style={{ animationDelay: "1.2s", position: "absolute", top: "30%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)", filter: "blur(50px)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 860, textAlign: "center", padding: "0 24px", position: "relative" }}>
            {/* badge */}
            <div className="fade-up d1" style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)",
                borderRadius: 100, padding: "6px 16px",
                fontSize: 13, fontWeight: 500, color: "#a5b4fc"
              }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#6366f1" }} className="glow-pulse" />
                KI-gestützte Website-Produktion für Agenturen
              </div>
            </div>

            <h1 className="fade-up d2" style={{
              fontSize: "clamp(46px, 7.5vw, 86px)", fontWeight: 800,
              lineHeight: 1.04, letterSpacing: "-0.045em", marginBottom: 26
            }}>
              Websites für Kunden —<br />
              <span style={{
                background: "linear-gradient(135deg,#6366f1 0%,#a855f7 50%,#06b6d4 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>
                in Minuten, nicht Wochen.
              </span>
            </h1>

            <p className="fade-up d3" style={{
              fontSize: 19, color: "rgba(255,255,255,0.45)", lineHeight: 1.72,
              marginBottom: 44, maxWidth: 580, margin: "0 auto 44px"
            }}>
              AutoWebsite automatisiert deine gesamte Website-Produktion — vom KI-Briefing bis zum Live-Publish. Deine Agentur skaliert, ohne mehr Personal einzustellen.
            </p>

            <div className="fade-up d4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/login" className="hero-btn-primary">
                Jetzt kostenlos starten <ArrowRight size={16} />
              </Link>
              <a href="#features" className="btn-outline">Demo ansehen</a>
            </div>

            {/* trust */}
            <div className="fade-up d5" style={{ marginTop: 56, display: "flex", gap: 36, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex" }}>
                  {["#6366f1","#8b5cf6","#06b6d4","#10b981","#f59e0b"].map((c,i) => (
                    <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: c, border: "2px solid #080810", marginLeft: i ? -8 : 0, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                      {String.fromCharCode(65+i)}
                    </div>
                  ))}
                </div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}><strong style={{ color: "rgba(255,255,255,0.8)" }}>200+</strong> Agenturen</span>
              </div>
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginLeft: 6 }}>4.9 / 5</span>
              </div>
              <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Keine Kreditkarte erforderlich</span>
            </div>
          </div>

          {/* Hero dashboard */}
          <div className="float-anim" style={{ width: "min(900px, 90vw)", margin: "64px auto 0", padding: "0 24px", position: "relative" }}>
            <div style={{
              borderRadius: 24, overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 40px 120px rgba(99,102,241,0.2), 0 0 0 1px rgba(99,102,241,0.1)",
              background: "#0d0d14"
            }}>
              <DashboardMockup />
            </div>
            {/* floating badge */}
            <div style={{
              position: "absolute", top: 24, right: 48,
              background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)",
              borderRadius: 12, padding: "10px 16px",
              display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(10px)"
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} className="glow-pulse" />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6ee7b7" }}>+38% diese Woche</span>
            </div>
          </div>
        </section>

        {/* ── LOGOS BAND ─────────────────────────────────────────── */}
        <section style={{ padding: "52px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: 32 }}>Genutzt von wachsenden Agenturen</p>
            <div style={{ display: "flex", gap: 52, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
              {["Kreativstudio", "WebWorks", "Pixelcraft", "Digitage", "NordMedia", "Brandflow", "Lumenwerk"].map(n => (
                <span key={n} style={{ fontSize: 15, fontWeight: 700, letterSpacing: "0.04em", color: "rgba(255,255,255,0.18)" }}>{n}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────── */}
        <section id="features" style={{ padding: "100px 24px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div className="section-badge">Features</div>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 16 }}>
                Alles, was du brauchst,<br />um zu skalieren
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.4)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
                Von KI-Briefing bis Live-Publish — eine Plattform für den gesamten Website-Workflow.
              </p>
            </div>

            {/* 4 feature cards grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {[
                { title: "KI-Briefing Engine", desc: "Generiert Website-Konzepte automatisch aus Kundenanfragen.", color: "#6366f1", Icon: Brain },
                { title: "1-Klick Publish", desc: "Von der Vorschau zur Live-Domain in Sekunden — inkl. SSL.", color: "#10b981", Icon: Globe },
                { title: "White-Label Ready", desc: "Deine Kunden sehen nur dein Branding. Keine Wasserzeichen.", color: "#f59e0b", Icon: Shield },
                { title: "Live-Analytics", desc: "Echtzeit-Traffic, Conversions und SEO-Scores im Dashboard.", color: "#ec4899", Icon: BarChart3 },
              ].map((f, i) => (
                <div key={i} className="feature-card">
                  <div style={{ padding: 28 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${f.color}1a`, border: `1px solid ${f.color}33`,
                      display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20
                    }}>
                      <f.Icon size={20} color={f.color} />
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>{f.title}</h3>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{f.desc}</p>
                  </div>
                  <div style={{ height: 160, background: "#0a0a12", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <FeatureCardMockup color={f.color} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── MARQUEE ──────────────────────────────────────────── */}
        <section style={{ padding: "0 0 100px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Marquee items={[
              "KI-Briefing Engine", "1-Klick Publish", "White-Label Domain", "Live-Analytics",
              "Automatisierte Workflows", "SEO-Optimierung", "Kunden-Portal", "CMS Integration"
            ]} />
            <Marquee reverse items={[
              "SSL & Hosting inklusive", "Multi-Projekt Dashboard", "Teamzugänge", "API-Zugang",
              "Revisionsverwaltung", "Echtzeit-Vorschau", "Audit-Logs", "Backup & Restore"
            ]} />
          </div>
        </section>

        {/* ── DISCOVER ─────────────────────────────────────────── */}
        <section style={{ padding: "80px 24px 100px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div className="section-badge">Entdecken</div>
              <h2 style={{ fontSize: "clamp(30px, 4.5vw, 50px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 16 }}>
                Was AutoWebsite kann
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.4)", maxWidth: 440, margin: "0 auto" }}>
                Vereinfache die Website-Produktion — smarter, schneller, mit totaler Kontrolle.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
              {[
                { Icon: Brain, color: "#6366f1", title: "KI-Briefing", desc: "Briefings werden automatisch analysiert und in Website-Strukturen umgewandelt." },
                { Icon: TrendingUp, color: "#10b981", title: "Wachstums-Insights", desc: "Sofortige Einblicke in Traffic, Conversions und Kundenbindung." },
                { Icon: FileText, color: "#f59e0b", title: "Projektmanagement", desc: "Alle Projekte in einer Ansicht — Status, Deadlines, Freigaben." },
                { Icon: Layers, color: "#a855f7", title: "Integrations-Hub", desc: "Verbinde deine Tools nahtlos — CRM, E-Mail, Analytics." },
                { Icon: BarChart3, color: "#06b6d4", title: "Performance-Dashboard", desc: "Klare Echtzeit-Metriken für alle Websites deiner Kunden." },
                { Icon: Users, color: "#ec4899", title: "Team & Kollaboration", desc: "Alle im selben System — Rollen, Kommentare, Freigabe-Flows." },
              ].map((d, i) => (
                <div key={i} className="discover-card">
                  <div style={{
                    width: 42, height: 42, borderRadius: 12,
                    background: `${d.color}18`, border: `1px solid ${d.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18
                  }}>
                    <d.Icon size={20} color={d.color} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8 }}>{d.title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{d.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SPLIT: INVOICE ────────────────────────────────────── */}
        <section style={{ padding: "80px 24px 100px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <div className="section-badge">Projektübersicht</div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 20 }}>
                Projekte im Griff —<br />immer und überall
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, marginBottom: 36 }}>
                Alle Kundenprojekte in einer zentralen Ansicht — Status, Fortschritt, Deadlines. Kein Tool-Chaos mehr.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
                {[
                  "Erstelle & verwalte Projekte in Sekunden mit deinem Branding.",
                  "Tracke den Status — Briefing, In Produktion, Live.",
                  "Kunden erhalten automatisch Benachrichtigungen bei jedem Schritt.",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 1
                    }}>
                      <Check size={12} color="#6366f1" />
                    </div>
                    <span style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/login" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 14, fontWeight: 700, color: "#a5b4fc", textDecoration: "none",
                borderBottom: "1px solid rgba(99,102,241,0.4)", paddingBottom: 2
              }}>
                Alle Projekte ansehen <ArrowUpRight size={14} />
              </Link>
            </div>
            <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
              <InvoiceMockup />
            </div>
          </div>
        </section>

        {/* ── SPLIT: REVENUE ───────────────────────────────────── */}
        <section style={{ padding: "80px 24px 100px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 24px 80px rgba(0,0,0,0.5)" }}>
              <RevenueMockup />
            </div>
            <div>
              <div className="section-badge">Analytics</div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 20 }}>
                Umsatz-Wachstum<br />live verfolgen
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, marginBottom: 36 }}>
                Sehe genau, wie deine Agentur wächst — welche Projekte laufen, welche Kunden die meisten Einnahmen bringen.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
                {[
                  "Echtzeit-Updates — Umsatz direkt wenn er entsteht, nicht Tage später.",
                  "Wachstums-Trends erkennen und mit Präzision prognostizieren.",
                  "Kundenbindung im Blick — Churn früh erkennen und gegensteuern.",
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, background: "rgba(16,185,129,0.12)",
                      border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 1
                    }}>
                      <Check size={12} color="#10b981" />
                    </div>
                    <span style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/login" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 14, fontWeight: 700, color: "#6ee7b7", textDecoration: "none",
                borderBottom: "1px solid rgba(16,185,129,0.4)", paddingBottom: 2
              }}>
                Analytics öffnen <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ── GROWTH GRID ──────────────────────────────────────── */}
        <section style={{ padding: "80px 24px 100px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", marginBottom: 72 }}>
              <div>
                <div className="section-badge">Wachstum</div>
                <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
                  Gebaut für Flexibilität,<br />Wachstum und Klarheit
                </h2>
              </div>
              <div>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, marginBottom: 28 }}>
                  Ein System das mit deiner Agentur wächst — einfach zu starten, mächtig wenn du skalierst.
                </p>
                <Link href="/login" className="hero-btn-primary" style={{ display: "inline-flex" }}>
                  Heute automatisieren <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {[
                { Icon: Zap, color: "#6366f1", title: "Automatisierung im Kern", desc: "Wiederkehrende Tasks laufen vollautomatisch — schnell und zuverlässig." },
                { Icon: Layers, color: "#a855f7", title: "Modular aufgebaut", desc: "Flexible Workflows die sich anpassen wenn dein Business wächst." },
                { Icon: Globe, color: "#06b6d4", title: "Verbundenes Ökosystem", desc: "Nahtlose Integration mit deinen Lieblings-Tools und Plattformen." },
                { Icon: Shield, color: "#10b981", title: "Sicher by Default", desc: "Enterprise-Grade Sicherheit — SSL, 2FA, DSGVO-konform." },
                { Icon: BarChart3, color: "#f59e0b", title: "Datengetriebene Entscheidungen", desc: "Sieh deine Zahlen klar und handle mit Selbstvertrauen." },
                { Icon: Users, color: "#ec4899", title: "Team-ready", desc: "Alle unter einem Dach — Rollen, Rechte, Kommunikation." },
              ].map((item, i) => (
                <div key={i} style={{
                  padding: 26, borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "rgba(255,255,255,0.02)"
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: `${item.color}18`, border: `1px solid ${item.color}28`,
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16
                  }}>
                    <item.Icon size={18} color={item.color} />
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.02em" }}>{item.title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── AI CAPABILITIES TICKER ───────────────────────────── */}
        <section style={{ padding: "80px 24px 100px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div>
              <div className="section-badge">KI-Features</div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 20 }}>
                Deine KI übernimmt<br />die schwere Arbeit
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>
                AutoWebsite erledigt alles automatisch — von der ersten Idee bis zur fertigen Website.
              </p>
            </div>
            {/* scrolling capabilities */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, height: 320, overflow: "hidden", maskImage: "linear-gradient(transparent 0%, black 15%, black 85%, transparent 100%)" }}>
              <div style={{ animation: "marquee 18s linear infinite", display: "flex", flexDirection: "column", gap: 10, willChange: "transform" }}>
                {[
                  "Automatisierte Website-Generierung",
                  "KI-gestütztes Texten & Copywriting",
                  "SEO-Analyse und Optimierung",
                  "Design-Vorschläge nach Branche",
                  "Bild-Auswahl und Komposition",
                  "Responsive Layout-Erstellung",
                  "Performance-Optimierung",
                  "Barrierefreiheit-Prüfung",
                  "Mehrsprachige Übersetzung",
                  "Code-Export auf Knopfdruck",
                  "Automatisierte Website-Generierung",
                  "KI-gestütztes Texten & Copywriting",
                  "SEO-Analyse und Optimierung",
                  "Design-Vorschläge nach Branche",
                  "Bild-Auswahl und Komposition",
                  "Responsive Layout-Erstellung",
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "14px 18px", borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.025)"
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#6366f1", flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ─────────────────────────────────────────── */}
        <section id="preise" style={{ padding: "80px 24px 100px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div className="section-badge">Preise</div>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 16 }}>
                Pläne die mit dir wachsen
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.4)" }}>Monatlich kündbar. Keine versteckten Kosten.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, alignItems: "start" }}>
              {[
                {
                  name: "Starter", price: "€149", period: "/Monat", popular: false,
                  desc: "Perfekt für den Einstieg und erste Kundenprojekte.",
                  features: ["5 aktive Projekte", "KI-Briefing Engine", "1-Klick Publish", "SSL & Hosting", "Standard Support"],
                  cta: "Kostenlos testen",
                },
                {
                  name: "Agency", price: "€349", period: "/Monat", popular: true,
                  desc: "Für wachsende Agenturen mit mehreren Kunden.",
                  features: ["Unlimited Projekte", "Alles aus Starter", "White-Label Domain", "Live-Analytics", "Priority Support", "5 Teamzugänge"],
                  cta: "14 Tage gratis",
                },
                {
                  name: "Enterprise", price: "Auf Anfrage", period: "", popular: false,
                  desc: "Maßgeschneidert für große Agenturen.",
                  features: ["Alles aus Agency", "Dedizierter Manager", "Custom Integrationen", "SLA Garantie", "Onboarding & Training", "Unlimitierte Teams"],
                  cta: "Demo buchen",
                },
              ].map((plan, i) => (
                <div key={i} className={`pricing-card${plan.popular ? " pricing-card-popular" : ""}`} style={{ position: "relative" }}>
                  {plan.popular && (
                    <div style={{
                      position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      borderRadius: 100, padding: "4px 18px",
                      fontSize: 11, fontWeight: 700, color: "white", letterSpacing: "0.08em",
                      whiteSpace: "nowrap"
                    }}>BELIEBT</div>
                  )}
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 14 }}>{plan.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 3, marginBottom: 10 }}>
                    <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.04em" }}>{plan.price}</span>
                    {plan.period && <span style={{ fontSize: 15, color: "rgba(255,255,255,0.35)" }}>{plan.period}</span>}
                  </div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, marginBottom: 28 }}>{plan.desc}</p>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.07)", marginBottom: 24 }} />
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 14 }}>Enthalten:</div>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 11 }}>
                        <Check size={15} color={plan.popular ? "#a5b4fc" : "#6366f1"} />
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/login" style={{
                    display: "block", textAlign: "center",
                    padding: "13px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                    textDecoration: "none",
                    background: plan.popular ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "rgba(255,255,255,0.06)",
                    color: "white",
                    border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.1)",
                    transition: "opacity 0.2s"
                  }}>{plan.cta}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────────────────── */}
        <section style={{ padding: "80px 24px 100px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 80, alignItems: "start" }}>
              <div>
                <div className="section-badge">Bewertungen</div>
                <div style={{ fontSize: 80, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 1, color: "white" }}>4.9</div>
                <div style={{ display: "flex", gap: 4, margin: "12px 0 8px" }}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={18} fill="#f59e0b" color="#f59e0b" />)}
                </div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>600+ Bewertungen</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {[
                  { name: "Maja Schulz", role: "CEO, Kreativstudio Berlin", initials: "MS", color: "#6366f1",
                    quote: "Wir liefern jetzt 3× mehr Projekte pro Monat — mit demselben Team. AutoWebsite hat unser Business komplett verändert." },
                  { name: "Tobias Reiner", role: "GF, WebWorks Hamburg", initials: "TR", color: "#10b981",
                    quote: "Das Briefing-System ist genial. Kunden kommen mit klaren Anforderungen, und die KI baut daraus eine Website die wirklich sitzt." },
                  { name: "Lena Hoffmann", role: "Partner, Pixelcraft München", initials: "LH", color: "#a855f7",
                    quote: "White-Label war für uns entscheidend. Unsere Kunden sehen nur unsere Marke — professional durch und durch." },
                  { name: "Sven Braun", role: "Inhaber, Digitage Frankfurt", initials: "SB", color: "#f59e0b",
                    quote: "Die Lieferzeit ist unglaublich. Ein Kunde hat mir nicht geglaubt dass seine Site in 40 Minuten live ist — bis er sie gesehen hat." },
                ].map((t, i) => (
                  <div key={i} style={{
                    padding: 24, borderRadius: 16,
                    border: "1px solid rgba(255,255,255,0.07)",
                    background: "rgba(255,255,255,0.02)"
                  }}>
                    <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                      {[1,2,3,4,5].map(j => <Star key={j} size={12} fill="#f59e0b" color="#f59e0b" />)}
                    </div>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: 18, fontStyle: "italic" }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: "50%",
                        background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700
                      }}>{t.initials}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BLOG ─────────────────────────────────────────────── */}
        <section id="blog" style={{ padding: "80px 24px 100px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52 }}>
              <div>
                <div className="section-badge">Blog</div>
                <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, letterSpacing: "-0.04em" }}>
                  Stories hinter den Zahlen
                </h2>
              </div>
              <a href="#" style={{ fontSize: 14, fontWeight: 600, color: "#a5b4fc", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                Alle Artikel <ArrowRight size={14} />
              </a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {[
                { read: "8 min", date: "10. Okt. 2025", title: "Die Kraft automatisierter Website-Produktion", desc: "Wie Agenturen mit KI 10× mehr Projekte liefern — ohne mehr Personal.", color: "#6366f1" },
                { read: "4 min", date: "9. Okt. 2025", title: "White-Label: Dein Brand, unsere Technologie", desc: "Warum White-Label-Plattformen der Wachstumshebel für moderne Agenturen sind.", color: "#a855f7" },
                { read: "6 min", date: "29. Sep. 2025", title: "Insights die Wachstum antreiben", desc: "Wie visuelle Dashboards und KI-Analytics Agenturen helfen, bessere Entscheidungen zu treffen.", color: "#06b6d4" },
              ].map((post, i) => (
                <div key={i} className="blog-card">
                  <div style={{ height: 180, background: `linear-gradient(135deg, ${post.color}22, rgba(255,255,255,0.02))`, position: "relative", overflow: "hidden" }}>
                    <div style={{
                      position: "absolute", inset: 0,
                      background: `radial-gradient(circle at 30% 50%, ${post.color}30 0%, transparent 60%)`
                    }} />
                    <div style={{ position: "absolute", top: 20, left: 20, display: "flex", gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", background: "rgba(255,255,255,0.08)", borderRadius: 100, color: "rgba(255,255,255,0.5)" }}>{post.read} Lesezeit</span>
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", background: "rgba(255,255,255,0.08)", borderRadius: 100, color: "rgba(255,255,255,0.5)" }}>{post.date}</span>
                    </div>
                    {/* visual placeholder */}
                    <div style={{ position: "absolute", right: 20, bottom: 20, width: 100, height: 80, borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      {[0,1,2].map(r => <div key={r} style={{ height: 6, margin: "10px 10px", borderRadius: 3, background: `${post.color}50`, width: `${[80,60,70][r]}%` }} />)}
                    </div>
                  </div>
                  <div style={{ padding: "22px 22px 24px" }}>
                    <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.4 }}>{post.title}</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.65 }}>{post.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────── */}
        <section style={{ padding: "80px 24px 120px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{
              borderRadius: 28, overflow: "hidden",
              position: "relative", padding: "100px 60px",
              background: "linear-gradient(135deg, #0f0f1a, #13101f)",
              border: "1px solid rgba(99,102,241,0.2)",
              textAlign: "center"
            }}>
              {/* background gradient blobs */}
              <div style={{ position: "absolute", top: -80, left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 60%)", filter: "blur(60px)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -60, right: "20%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 60%)", filter: "blur(50px)", pointerEvents: "none" }} />
              {/* grid */}
              <div className="grid-bg" style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none" }} />

              <div style={{ position: "relative" }}>
                <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 20 }}>Starte noch heute</p>
                <h2 style={{
                  fontSize: "clamp(36px, 5.5vw, 62px)", fontWeight: 800,
                  letterSpacing: "-0.045em", lineHeight: 1.08, marginBottom: 24
                }}>
                  Lass AutoWebsite die Arbeit machen,<br />
                  <span style={{ background: "linear-gradient(135deg,#6366f1,#a855f7,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    während du wächst.
                  </span>
                </h2>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", marginBottom: 48, lineHeight: 1.7 }}>
                  14 Tage kostenlos. Keine Kreditkarte. Setup in unter 5 Minuten.
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/login" className="hero-btn-primary" style={{ fontSize: 16, padding: "16px 36px", boxShadow: "0 0 60px rgba(99,102,241,0.5)" }}>
                    Kostenlos starten — Es ist gratis <ArrowRight size={16} />
                  </Link>
                </div>
                <div style={{ marginTop: 36, display: "flex", gap: 28, justifyContent: "center", flexWrap: "wrap" }}>
                  {["Kein Risiko", "Kündbar jederzeit", "DSGVO-konform", "Made in Germany"].map(t => (
                    <div key={t} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>
                      <Check size={13} color="#6366f1" /> {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ─────────────────────────────────────────── */}
        <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "64px 24px 40px" }}>
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 64 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 16 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Zap size={14} color="white" fill="white" />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.025em" }}>AutoWebsite</span>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", lineHeight: 1.7, maxWidth: 260 }}>
                  Die KI-Plattform für Agenturen, die mehr Websites liefern wollen — ohne mehr Aufwand.
                </p>
              </div>
              {[
                { title: "Produkt", links: ["Features", "Preise", "Changelog", "Roadmap"] },
                { title: "Unternehmen", links: ["Über uns", "Blog", "Karriere", "Presse"] },
                { title: "Legal", links: ["Datenschutz", "Impressum", "AGB", "Cookies"] },
              ].map(col => (
                <div key={col.title}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>{col.title}</div>
                  {col.links.map(l => (
                    <a key={l} href="#" style={{ display: "block", fontSize: 14, color: "rgba(255,255,255,0.4)", textDecoration: "none", marginBottom: 12, transition: "color 0.2s" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                    >{l}</a>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>© 2025 AutoWebsite GmbH. Alle Rechte vorbehalten.</span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>Made with ♥ in Deutschland</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
