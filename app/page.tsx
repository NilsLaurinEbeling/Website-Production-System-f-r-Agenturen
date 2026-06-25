"use client"

import Link from "next/link"
import { ArrowRight, Zap, Globe, BarChart3, Layers, CheckCircle, Star, ChevronRight, Sparkles, Clock, Shield, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-20px) translateX(15px); }
          66% { transform: translateY(10px) translateX(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counter {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes border-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
        .animate-float-delay { animation: float 7s ease-in-out infinite 2s; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #a78bfa 25%, #60a5fa 50%, #34d399 75%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        .gradient-border {
          position: relative;
          background: linear-gradient(135deg, rgba(79,110,247,0.1), rgba(139,92,246,0.1));
          border: 1px solid rgba(255,255,255,0.08);
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(79,110,247,0.5), rgba(139,92,246,0.3), rgba(6,182,212,0.3));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .card-glow:hover {
          box-shadow: 0 0 40px rgba(79,110,247,0.2), 0 0 80px rgba(139,92,246,0.1);
          border-color: rgba(79,110,247,0.4) !important;
          transform: translateY(-4px);
          transition: all 0.3s ease;
        }
        .card-glow { transition: all 0.3s ease; }
        .btn-primary {
          position: relative;
          background: linear-gradient(135deg, #4F6EF7, #8B5CF6);
          overflow: hidden;
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-primary:hover::before { opacity: 1; }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
        }
        .grid-pattern {
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .pricing-popular {
          background: linear-gradient(135deg, rgba(79,110,247,0.15), rgba(139,92,246,0.15));
          border: 1px solid rgba(139,92,246,0.4) !important;
        }
      `}</style>

      <div className="min-h-screen" style={{ background: "#050508", color: "#f8fafc" }}>

        {/* ── NAVBAR ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "rgba(5,5,8,0.7)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 68, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: "linear-gradient(135deg, #4F6EF7, #8B5CF6)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Sparkles size={16} color="white" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>AutoWebsite</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
              {["Features", "Preise", "Über uns"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} style={{
                  color: "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: 500,
                  textDecoration: "none", transition: "color 0.2s"
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.95)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                >{item}</a>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link href="/login" style={{
                color: "rgba(255,255,255,0.65)", fontSize: 14, fontWeight: 500,
                textDecoration: "none", padding: "8px 16px"
              }}>Anmelden</Link>
              <Link href="/login" className="btn-primary" style={{
                color: "white", fontSize: 14, fontWeight: 600,
                textDecoration: "none", padding: "9px 20px", borderRadius: 10,
                display: "flex", alignItems: "center", gap: 6, position: "relative", zIndex: 1
              }}>
                Kostenlos starten <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
          {/* Background orbs */}
          <div className="animate-float" style={{
            position: "absolute", top: "10%", left: "15%",
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,110,247,0.18) 0%, transparent 70%)",
            filter: "blur(40px)", pointerEvents: "none"
          }} />
          <div className="animate-float-delay" style={{
            position: "absolute", top: "20%", right: "10%",
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
            filter: "blur(50px)", pointerEvents: "none"
          }} />
          <div className="animate-float-slow" style={{
            position: "absolute", bottom: "15%", left: "40%",
            width: 350, height: 350, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
            filter: "blur(40px)", pointerEvents: "none"
          }} />

          {/* Grid pattern */}
          <div className="grid-pattern" style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />

          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", position: "relative", zIndex: 1, width: "100%" }}>
            {/* Badge */}
            <div className="animate-slide-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(79,110,247,0.12)", border: "1px solid rgba(79,110,247,0.3)",
                borderRadius: 100, padding: "6px 16px", marginBottom: 40
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4F6EF7" }} className="animate-pulse-glow" />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#93a5f8" }}>KI-gestützte Website-Erstellung für Agenturen</span>
                <ChevronRight size={13} color="#93a5f8" />
              </div>
            </div>

            {/* Headline */}
            <div className="animate-slide-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
              <h1 style={{
                fontSize: "clamp(52px, 7vw, 88px)", fontWeight: 800,
                lineHeight: 1.02, letterSpacing: "-0.04em",
                marginBottom: 28, maxWidth: 860
              }}>
                Websites für Kunden.<br />
                <span className="shimmer-text">In Minuten, nicht Wochen.</span>
              </h1>
            </div>

            {/* Subline */}
            <div className="animate-slide-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
              <p style={{
                fontSize: 20, color: "rgba(255,255,255,0.5)", maxWidth: 560,
                lineHeight: 1.7, marginBottom: 48, fontWeight: 400
              }}>
                AutoWebsite automatisiert deine gesamte Website-Produktion — von der Briefing-KI bis zum Live-Publish. Deine Agentur skaliert, ohne mehr Personal.
              </p>
            </div>

            {/* CTAs */}
            <div className="animate-slide-up" style={{ animationDelay: "0.4s", opacity: 0, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/login" className="btn-primary" style={{
                color: "white", fontWeight: 700, fontSize: 16,
                textDecoration: "none", padding: "16px 32px", borderRadius: 14,
                display: "flex", alignItems: "center", gap: 8,
                position: "relative", zIndex: 1, boxShadow: "0 0 40px rgba(79,110,247,0.4)"
              }}>
                Jetzt kostenlos starten <ArrowRight size={16} />
              </Link>
              <a href="#features" style={{
                color: "rgba(255,255,255,0.65)", fontWeight: 600, fontSize: 16,
                textDecoration: "none", padding: "16px 28px", borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.2s"
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
              >
                Demo ansehen
              </a>
            </div>

            {/* Trust indicators */}
            <div className="animate-fade-in" style={{ animationDelay: "0.8s", opacity: 0, marginTop: 72, display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex" }}>
                  {["#4F6EF7", "#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"].map((c, i) => (
                    <div key={i} style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${c}, ${c}aa)`,
                      border: "2px solid #050508",
                      marginLeft: i > 0 ? -8 : 0
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                  <strong style={{ color: "white" }}>200+</strong> Agenturen vertrauen uns
                </span>
              </div>
              <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginLeft: 4 }}>4.9 / 5 Bewertung</span>
              </div>
            </div>
          </div>

          {/* Hero dashboard mockup */}
          <div className="animate-float-slow" style={{
            position: "absolute", right: -60, top: "50%",
            transform: "translateY(-50%)",
            width: 520, opacity: 0.35,
            pointerEvents: "none"
          }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(79,110,247,0.15), rgba(139,92,246,0.1))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24, padding: 24,
              backdropFilter: "blur(10px)"
            }}>
              {[80, 60, 90, 45, 75].map((w, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{
                    height: 8, borderRadius: 4,
                    background: `linear-gradient(90deg, rgba(79,110,247,0.6), rgba(139,92,246,0.4))`,
                    width: `${w}%`
                  }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOGOS BAND ── */}
        <section style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          padding: "36px 24px",
          background: "rgba(255,255,255,0.01)"
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 28 }}>
              Genutzt von wachsenden Agenturen
            </p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 52, flexWrap: "wrap", opacity: 0.35 }}>
              {["Kreativstudio", "WebWorks", "Pixelcraft", "Digitage", "NordMedia", "Brandflow"].map((name) => (
                <span key={name} style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.05em", color: "rgba(255,255,255,0.9)" }}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section style={{ padding: "100px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 2,
              background: "rgba(255,255,255,0.04)", borderRadius: 24, overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)"
            }}>
              {[
                { number: "10×", label: "schnellere Lieferung", sub: "als traditionelle Methoden", color: "#4F6EF7" },
                { number: "98%", label: "Kundenzufriedenheit", sub: "über alle Projekte", color: "#8B5CF6" },
                { number: "3.200+", label: "Websites erstellt", sub: "in den letzten 12 Monaten", color: "#06B6D4" },
                { number: "47min", label: "Ø Lieferzeit", sub: "vom Briefing zur Live-Site", color: "#10B981" },
              ].map((stat, i) => (
                <div key={i} style={{
                  padding: "48px 36px",
                  background: "rgba(5,5,8,0.8)",
                  borderRight: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  position: "relative", overflow: "hidden"
                }}>
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)`
                  }} />
                  <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.04em", color: stat.color, marginBottom: 8, lineHeight: 1 }}>
                    {stat.number}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.85)", marginBottom: 6 }}>{stat.label}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES BENTO ── */}
        <section id="features" style={{ padding: "80px 24px 120px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Section header */}
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)",
                borderRadius: 100, padding: "6px 16px", marginBottom: 24
              }}>
                <Layers size={13} color="#a78bfa" />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#a78bfa" }}>Features</span>
              </div>
              <h2 style={{
                fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 800,
                letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 20
              }}>
                Alles, was deine Agentur braucht
              </h2>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.45)", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                Von der KI-Briefing-Erfassung bis zum automatisierten Publish — eine Plattform für den kompletten Workflow.
              </p>
            </div>

            {/* Bento grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16 }}>
              {/* Large feature card */}
              <div className="gradient-border card-glow" style={{
                gridColumn: "span 7", borderRadius: 24, padding: 48,
                background: "linear-gradient(135deg, rgba(79,110,247,0.08), rgba(5,5,8,0.9))",
                position: "relative", overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute", top: -80, right: -80,
                  width: 300, height: 300, borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(79,110,247,0.15) 0%, transparent 70%)",
                  filter: "blur(30px)"
                }} />
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: "linear-gradient(135deg, rgba(79,110,247,0.3), rgba(79,110,247,0.1))",
                  border: "1px solid rgba(79,110,247,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 28
                }}>
                  <Zap size={24} color="#4F6EF7" />
                </div>
                <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 14 }}>KI-Briefing Engine</h3>
                <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: 380, marginBottom: 32 }}>
                  Dein Kunde füllt ein intelligentes Briefing aus. Unsere KI analysiert Branche, Zielgruppe und Wettbewerber und generiert automatisch die perfekte Website-Struktur.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {["Analyse in Sekunden", "Branchenspezifisch", "Mehrsprachig"].map(tag => (
                    <span key={tag} style={{
                      fontSize: 12, fontWeight: 600, padding: "6px 14px",
                      background: "rgba(79,110,247,0.12)", border: "1px solid rgba(79,110,247,0.2)",
                      borderRadius: 100, color: "#93a5f8"
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* Right column */}
              <div style={{ gridColumn: "span 5", display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="gradient-border card-glow" style={{
                  borderRadius: 24, padding: 36, flex: 1,
                  background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(5,5,8,0.9))"
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20
                  }}>
                    <Globe size={20} color="#8B5CF6" />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 10 }}>1-Klick Publish</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
                    Von der Vorschau zur Live-Website in einem Klick. Hosting, SSL und CDN inklusive.
                  </p>
                </div>
                <div className="gradient-border card-glow" style={{
                  borderRadius: 24, padding: 36, flex: 1,
                  background: "linear-gradient(135deg, rgba(6,182,212,0.08), rgba(5,5,8,0.9))"
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: "rgba(6,182,212,0.2)", border: "1px solid rgba(6,182,212,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20
                  }}>
                    <BarChart3 size={20} color="#06B6D4" />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 10 }}>Live-Analytics</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>
                    Echtzeit-Daten zu Traffic, Conversions und Performance — direkt im Dashboard.
                  </p>
                </div>
              </div>

              {/* Bottom row */}
              {[
                { icon: <Clock size={20} color="#10B981" />, color: "#10B981", title: "Automatisierte Workflows", desc: "Wiederkehrende Tasks wie Texte aktualisieren, SEO-Audits und Backups laufen vollautomatisch.", bg: "rgba(16,185,129,0.08)" },
                { icon: <Shield size={20} color="#F59E0B" />, color: "#F59E0B", title: "White-Label Ready", desc: "Eigene Domain, eigenes Branding. Deine Kunden sehen nur deine Agentur.", bg: "rgba(245,158,11,0.08)" },
                { icon: <TrendingUp size={20} color="#EC4899" />, color: "#EC4899", title: "Skalierbar von Tag 1", desc: "10 oder 1.000 Projekte — die Plattform wächst mit deiner Agentur ohne Mehraufwand.", bg: "rgba(236,72,153,0.08)" },
              ].map((feat, i) => (
                <div key={i} className="gradient-border card-glow" style={{
                  gridColumn: "span 4", borderRadius: 24, padding: 36,
                  background: `linear-gradient(135deg, ${feat.bg}, rgba(5,5,8,0.9))`
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: `${feat.color}22`, border: `1px solid ${feat.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20
                  }}>
                    {feat.icon}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 10 }}>{feat.title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.65 }}>{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ padding: "80px 24px 120px", position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800, height: 800, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,110,247,0.05) 0%, transparent 60%)",
            pointerEvents: "none"
          }} />

          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative" }}>
            <div style={{ textAlign: "center", marginBottom: 80 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: 100, padding: "6px 16px", marginBottom: 24
              }}>
                <CheckCircle size={13} color="#34d399" />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#34d399" }}>So einfach geht&apos;s</span>
              </div>
              <h2 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 20 }}>
                Von Briefing zu Live-Site<br />in 4 Schritten
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, position: "relative" }}>
              {/* Connecting line */}
              <div style={{
                position: "absolute", top: 36, left: "12%", right: "12%", height: 1,
                background: "linear-gradient(90deg, transparent, rgba(79,110,247,0.4), rgba(139,92,246,0.4), rgba(6,182,212,0.4), transparent)",
                zIndex: 0
              }} />

              {[
                { step: "01", title: "Briefing senden", desc: "Dein Kunde füllt das smarte Online-Formular aus — Branche, Ziele, Design-Präferenzen, Texte.", color: "#4F6EF7" },
                { step: "02", title: "KI analysiert", desc: "Unsere KI verarbeitet das Briefing, recherchiert Mitbewerber und erstellt ein maßgeschneidertes Konzept.", color: "#8B5CF6" },
                { step: "03", title: "Vorschau prüfen", desc: "Du siehst die generierte Website live im Browser, kannst Anpassungen vornehmen oder direkt freigeben.", color: "#06B6D4" },
                { step: "04", title: "Live schalten", desc: "Ein Klick — und die Website ist auf der Kundendomain online. Inklusive SSL, CDN und Monitoring.", color: "#10B981" },
              ].map((step, i) => (
                <div key={i} style={{ position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${step.color}33, ${step.color}11)`,
                    border: `1px solid ${step.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 28, marginLeft: "auto", marginRight: "auto"
                  }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: step.color }}>{step.step}</span>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, letterSpacing: "-0.02em" }}>{step.title}</h3>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section style={{ padding: "80px 24px 120px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <h2 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 16 }}>
                Was Agenturen sagen
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.4)" }}>Echte Ergebnisse, echte Stimmen</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
              {[
                {
                  quote: "Wir liefern jetzt 3× mehr Projekte pro Monat — mit demselben Team. AutoWebsite hat unser Business komplett verändert.",
                  name: "Maja Schulz", role: "CEO, Kreativstudio Berlin",
                  stars: 5, color: "#4F6EF7"
                },
                {
                  quote: "Das Briefing-System ist genial. Kunden kommen mit klaren Anforderungen, und die KI baut daraus eine Website die wirklich sitzt.",
                  name: "Tobias Reiner", role: "Geschäftsführer, WebWorks Hamburg",
                  stars: 5, color: "#8B5CF6"
                },
                {
                  quote: "White-Label war für uns entscheidend. Unsere Kunden sehen nur unsere Marke — professional durch und durch.",
                  name: "Lena Hoffmann", role: "Partnerin, Pixelcraft München",
                  stars: 5, color: "#06B6D4"
                },
              ].map((t, i) => (
                <div key={i} className="gradient-border card-glow" style={{
                  borderRadius: 24, padding: 36,
                  background: "rgba(255,255,255,0.02)",
                  position: "relative"
                }}>
                  <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} size={14} fill="#F59E0B" color="#F59E0B" />
                    ))}
                  </div>
                  <p style={{ fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, marginBottom: 28, fontStyle: "italic" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: "50%",
                      background: `linear-gradient(135deg, ${t.color}, ${t.color}77)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, fontWeight: 700
                    }}>
                      {t.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="preise" style={{ padding: "80px 24px 120px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 72 }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)",
                borderRadius: 100, padding: "6px 16px", marginBottom: 24
              }}>
                <Sparkles size={13} color="#fbbf24" />
                <span style={{ fontSize: 13, fontWeight: 500, color: "#fbbf24" }}>Transparente Preise</span>
              </div>
              <h2 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 16 }}>
                Wähle deinen Plan
              </h2>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,0.4)" }}>Monatlich kündbar. Keine versteckten Kosten.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, alignItems: "start" }}>
              {[
                {
                  name: "Starter", price: "€149", period: "/Monat",
                  desc: "Perfekt für den Einstieg und erste Kunden-Projekte.",
                  features: ["5 aktive Projekte", "KI-Briefing Engine", "1-Klick Publish", "Standard Support", "SSL & Hosting"],
                  cta: "Jetzt starten", popular: false, color: "#4F6EF7"
                },
                {
                  name: "Agency", price: "€349", period: "/Monat",
                  desc: "Für wachsende Agenturen mit mehreren Kunden.",
                  features: ["Unlimited Projekte", "Alles aus Starter", "White-Label Domain", "Live-Analytics", "Priority Support", "Team-Zugänge (5)"],
                  cta: "14 Tage gratis", popular: true, color: "#8B5CF6"
                },
                {
                  name: "Enterprise", price: "Individuell", period: "",
                  desc: "Maßgeschneidert für große Agenturen und Netzwerke.",
                  features: ["Alles aus Agency", "Dedizierter Account Manager", "Custom Integrationen", "SLA Garantie", "Onboarding & Training", "Unbegrenzte Teams"],
                  cta: "Kontakt aufnehmen", popular: false, color: "#06B6D4"
                },
              ].map((plan, i) => (
                <div key={i} className={plan.popular ? "pricing-popular" : "gradient-border card-glow"} style={{
                  borderRadius: 24, padding: "40px 36px",
                  position: "relative", overflow: "hidden",
                  ...(plan.popular ? { transform: "scale(1.04)", zIndex: 2 } : {})
                }}>
                  {plan.popular && (
                    <div style={{
                      position: "absolute", top: 20, right: 20,
                      background: "linear-gradient(135deg, #8B5CF6, #4F6EF7)",
                      borderRadius: 100, padding: "4px 14px",
                      fontSize: 11, fontWeight: 700, color: "white", letterSpacing: "0.05em"
                    }}>BELIEBT</div>
                  )}
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>{plan.name}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
                      <span style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-0.04em" }}>{plan.price}</span>
                      <span style={{ fontSize: 16, color: "rgba(255,255,255,0.4)" }}>{plan.period}</span>
                    </div>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{plan.desc}</p>
                  </div>

                  <div style={{ marginBottom: 32 }}>
                    {plan.features.map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                        <CheckCircle size={16} color={plan.color} />
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <Link href="/login" style={{
                    display: "block", textAlign: "center",
                    padding: "14px 24px", borderRadius: 12,
                    fontSize: 15, fontWeight: 700, textDecoration: "none",
                    background: plan.popular
                      ? "linear-gradient(135deg, #8B5CF6, #4F6EF7)"
                      : `rgba(${plan.color === "#4F6EF7" ? "79,110,247" : plan.color === "#06B6D4" ? "6,182,212" : "255,255,255"},0.08)`,
                    color: "white",
                    border: plan.popular ? "none" : `1px solid ${plan.color}33`,
                    transition: "all 0.2s"
                  }}>{plan.cta}</Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section style={{ padding: "80px 24px 120px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div style={{
              borderRadius: 32, padding: "80px 60px", textAlign: "center",
              background: "linear-gradient(135deg, rgba(79,110,247,0.15), rgba(139,92,246,0.12), rgba(6,182,212,0.08))",
              border: "1px solid rgba(79,110,247,0.25)",
              position: "relative", overflow: "hidden"
            }}>
              {/* Background glow */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: 600, height: 300, borderRadius: "50%",
                background: "radial-gradient(circle, rgba(79,110,247,0.12) 0%, transparent 60%)",
                filter: "blur(40px)", pointerEvents: "none"
              }} />

              <div style={{ position: "relative" }}>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "rgba(79,110,247,0.15)", border: "1px solid rgba(79,110,247,0.3)",
                  borderRadius: 100, padding: "6px 16px", marginBottom: 28
                }}>
                  <Zap size={13} color="#93a5f8" fill="#93a5f8" />
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#93a5f8" }}>Starte noch heute</span>
                </div>

                <h2 style={{
                  fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800,
                  letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 20
                }}>
                  Bereit, deine Agentur<br />
                  <span className="shimmer-text">auf das nächste Level</span><br />
                  zu bringen?
                </h2>

                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", marginBottom: 44, lineHeight: 1.7 }}>
                  14 Tage kostenlos testen. Keine Kreditkarte erforderlich.<br />Setup in unter 5 Minuten.
                </p>

                <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/login" className="btn-primary" style={{
                    color: "white", fontWeight: 700, fontSize: 17,
                    textDecoration: "none", padding: "18px 40px", borderRadius: 14,
                    display: "inline-flex", alignItems: "center", gap: 8,
                    position: "relative", zIndex: 1,
                    boxShadow: "0 0 60px rgba(79,110,247,0.5), 0 0 120px rgba(139,92,246,0.2)"
                  }}>
                    Kostenlos starten <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "60px 24px 40px"
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 60 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 9,
                    background: "linear-gradient(135deg, #4F6EF7, #8B5CF6)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Sparkles size={15} color="white" />
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "-0.02em" }}>AutoWebsite</span>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: 280 }}>
                  Die KI-Plattform für Agenturen, die mehr Websites liefern wollen — ohne mehr Aufwand.
                </p>
              </div>

              {[
                { title: "Produkt", links: ["Features", "Preise", "Changelog", "Roadmap"] },
                { title: "Agentur", links: ["Über uns", "Blog", "Karriere", "Presse"] },
                { title: "Legal", links: ["Datenschutz", "Impressum", "AGB", "Cookies"] },
              ].map((col) => (
                <div key={col.title}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 20 }}>
                    {col.title}
                  </div>
                  {col.links.map(link => (
                    <a key={link} href="#" style={{
                      display: "block", fontSize: 14, color: "rgba(255,255,255,0.45)",
                      textDecoration: "none", marginBottom: 12,
                      transition: "color 0.2s"
                    }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                    >{link}</a>
                  ))}
                </div>
              ))}
            </div>

            <div style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: 28, display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: 16
            }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
                © 2025 AutoWebsite GmbH. Alle Rechte vorbehalten.
              </span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
                Made with ♥ in Deutschland
              </span>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
