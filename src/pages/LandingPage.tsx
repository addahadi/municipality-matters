import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Building2, Gavel, FileText, Shield, Users, Globe,
  ClipboardList, Megaphone, ArrowRight, CheckCircle2,
  TrendingUp, Zap, Lock, UserPlus, LayoutDashboard,
  ClipboardCheck, BellRing, KeyRound, CreditCard, EyeOff,
  ScrollText, Home, Languages,
} from "lucide-react";
import { landingAssets } from "@/lib/landingAssets";

gsap.registerPlugin(ScrollTrigger);

/* Lazily loaded so three/R3F never enters the bundle path on fallback devices. */
const CivicScene = lazy(() => import("@/components/landing/CivicScene"));

/* ─── environment hook: decide whether heavy 3D + motion are allowed ─── */
function useRichMotion() {
  const [rich, setRich] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 768px)");
    const evaluate = () => setRich(!reduce.matches && wide.matches);
    evaluate();
    reduce.addEventListener("change", evaluate);
    wide.addEventListener("change", evaluate);
    return () => {
      reduce.removeEventListener("change", evaluate);
      wide.removeEventListener("change", evaluate);
    };
  }, []);
  return rich;
}

/* ─── tiny animated number counter (kept from the original) ─── */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = target / 60;
      const id = setInterval(() => {
        start = Math.min(start + step, target);
        setDisplay(Math.floor(start));
        if (start >= target) clearInterval(id);
      }, 16);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

/* Small gold eyebrow used across sections (structural, not decorative). */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[hsl(var(--landing-gold))]">
      <span className="h-px w-6 bg-[hsl(var(--landing-gold))]" />
      {children}
    </div>
  );
}

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const isArabic = i18n.language.startsWith("ar");
  const rich = useRichMotion();

  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    const newLang = isArabic ? "en" : "ar";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ─── GSAP: single motion engine. Gated behind reduced-motion/mobile. ─── */
  useEffect(() => {
    if (!rich || !rootRef.current) return;
    const ctx = gsap.context(() => {
      // Section reveals — subtle, y-only (RTL-safe), one element at a time.
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
      // Gentle hero parallax (DOM-level, so it coordinates with the 3D scene).
      if (sceneRef.current) {
        gsap.to(sceneRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: sceneRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, rootRef);
    return () => ctx.revert();
  }, [rich]);

  /* ─── content pulled from i18n (EN + AR) ─── */
  const stats = [
    { value: 12000, suffix: "+", label: t("landing.statProperties") },
    { value: 48000, suffix: "+", label: t("landing.statCitizens") },
    { value: 99, suffix: "%", label: t("landing.statUptime") },
    { value: 24, suffix: "/7", label: t("landing.statSupport") },
  ];

  const trustBadges = [
    { icon: Shield, text: t("landing.trustSecure") },
    { icon: Zap, text: t("landing.trustFast") },
    { icon: TrendingUp, text: t("landing.trustImproving") },
  ];

  const services = [
    { icon: Building2, key: "Properties" },
    { icon: Gavel, key: "Auctions" },
    { icon: FileText, key: "Invoices" },
    { icon: ClipboardList, key: "Requests" },
    { icon: Megaphone, key: "Complaints" },
    { icon: ScrollText, key: "Documents" },
    { icon: Home, key: "Rentals" },
    { icon: BellRing, key: "Announcements" },
  ] as const;

  const processIcons = [UserPlus, LayoutDashboard, ClipboardCheck, BellRing];
  const processSteps = t("landing.processSteps", { returnObjects: true }) as { title: string; desc: string }[];

  const announcements = t("landing.announceItems", { returnObjects: true }) as { title: string; date: string; tag: string }[];
  const announceImgs = [landingAssets.announcement1, landingAssets.announcement2, landingAssets.announcement3];

  const securityPoints = [
    { icon: KeyRound, key: "Encryption" },
    { icon: CreditCard, key: "Dahabia" },
    { icon: EyeOff, key: "Privacy" },
    { icon: ScrollText, key: "Audit" },
  ] as const;

  const roles = [
    { icon: Shield, role: t("landing.roleAdmin"), items: t("landing.roleAdminItems", { returnObjects: true }) as string[] },
    { icon: Users, role: t("landing.roleEmployee"), items: t("landing.roleEmployeeItems", { returnObjects: true }) as string[] },
    { icon: Building2, role: t("landing.roleCitizen"), items: t("landing.roleCitizenItems", { returnObjects: true }) as string[] },
  ];

  const faqItems = t("landing.faqItems", { returnObjects: true }) as { q: string; a: string }[];

  return (
    <div ref={rootRef} className="landing-theme min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Navbar ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 bg-background/90 backdrop-blur-md ${
          scrolled ? "border-b border-border shadow-sm" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary ring-1 ring-[hsl(var(--landing-gold))]/40">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">{t("app.title")}</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#services" className="hover:text-foreground transition-colors">{t("landing.navServices")}</a>
            <a href="#process" className="hover:text-foreground transition-colors">{t("landing.navProcess")}</a>
            <a href="#security" className="hover:text-foreground transition-colors">{t("landing.navSecurity")}</a>
            <a href="#faq" className="hover:text-foreground transition-colors">{t("landing.navFaq")}</a>
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2">
              <Languages className="h-4 w-4" />
              {isArabic ? "EN" : "عربي"}
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/login">{t("landing.signIn")}</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/register">{t("landing.getStarted")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── 1. Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
          <div className="reveal">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--landing-gold))]/40 bg-[hsl(var(--landing-gold))]/10 px-3 py-1 text-xs font-semibold text-[hsl(var(--landing-gold))]">
              <Shield className="h-3.5 w-3.5" />
              {t("landing.badge")}
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {t("landing.heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              {t("landing.heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link to="/register">{t("landing.getStarted")} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">{t("landing.signIn")}</Link>
              </Button>
            </div>
          </div>

          {/* 3D civic scene (or static fallback) */}
          <div ref={sceneRef} className="relative h-[320px] sm:h-[420px] lg:h-[500px]">
            <div className="absolute inset-0 rounded-2xl border border-border bg-[hsl(var(--landing-navy-deep))] shadow-2xl overflow-hidden">
              {rich ? (
                <Suspense
                  fallback={
                    <div className="h-full w-full animate-pulse bg-[hsl(var(--landing-navy-deep))]" />
                  }
                >
                  <CivicScene />
                </Suspense>
              ) : (
                <img
                  src={landingAssets.heroFallback}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover opacity-90"
                  loading="eager"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Trust strip (absorbs the old Stats section) ── */}
      <section className="border-y border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold sm:text-4xl">
                  <AnimatedNumber target={s.value} suffix={s.suffix} />
                </div>
                <div className="mt-1 text-sm text-primary-foreground/70">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-primary-foreground/15 pt-6">
            {trustBadges.map((b) => (
              <div key={b.text} className="flex items-center gap-2 text-sm text-primary-foreground/85">
                <b.icon className="h-4 w-4 text-[hsl(var(--landing-gold))]" />
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. e-Services (replaces the old generic Features) ── */}
      <section id="services" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="reveal max-w-2xl">
          <Eyebrow>{t("landing.kickerServices")}</Eyebrow>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("landing.servicesTitle")}</h2>
          <p className="mt-3 text-lg text-muted-foreground">{t("landing.servicesSubtitle")}</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.key}
              className="reveal group rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-[hsl(var(--landing-gold))]/50 hover:shadow-lg"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{t(`landing.eService${s.key}`)}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{t(`landing.eService${s.key}Desc`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. How it works (condensed Process) ── */}
      <section id="process" className="bg-secondary/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="reveal max-w-2xl">
            <Eyebrow>{t("landing.kickerProcess")}</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("landing.processTitle")}</h2>
            <p className="mt-3 text-lg text-muted-foreground">{t("landing.processSubtitle")}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {processSteps.map((step, i) => {
              const Icon = processIcons[i] ?? UserPlus;
              return (
                <div key={step.title} className="reveal relative rounded-xl border border-border bg-card p-6">
                  <span className="absolute right-4 top-4 font-mono text-sm font-bold text-[hsl(var(--landing-gold))] rtl:left-4 rtl:right-auto">
                    0{i + 1}
                  </span>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Announcements preview ── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="reveal flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <Eyebrow>{t("landing.kickerAnnounce")}</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("landing.announceTitle")}</h2>
            <p className="mt-3 text-lg text-muted-foreground">{t("landing.announceSubtitle")}</p>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/register">{t("landing.announceViewAll")} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
          </Button>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {announcements.map((a, i) => (
            <article key={a.title} className="reveal overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg">
              <img src={announceImgs[i]} alt="" aria-hidden="true" className="h-40 w-full object-cover" loading="lazy" />
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="rounded-full bg-[hsl(var(--landing-gold))]/15 px-2 py-0.5 text-[hsl(var(--landing-gold))]">{a.tag}</span>
                  <span className="text-muted-foreground">{a.date}</span>
                </div>
                <h3 className="mt-3 font-semibold leading-snug">{a.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── 6. Roles (condensed) ── */}
      <section className="bg-secondary/60">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="reveal max-w-2xl">
            <Eyebrow>{t("landing.kickerRoles")}</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("landing.rolesTitle")}</h2>
            <p className="mt-3 text-lg text-muted-foreground">{t("landing.rolesSubtitle")}</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {roles.map((r) => (
              <div key={r.role} className="reveal rounded-xl border border-border bg-card p-6">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <r.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{r.role}</h3>
                <ul className="mt-4 space-y-2">
                  {r.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--landing-teal))]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Security & data protection ── */}
      <section id="security" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="reveal">
            <Eyebrow>{t("landing.kickerSecurity")}</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("landing.securityTitle")}</h2>
            <p className="mt-3 text-lg text-muted-foreground">{t("landing.securitySubtitle")}</p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {securityPoints.map((p) => (
                <div key={p.key} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold">{t(`landing.security${p.key}`)}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t(`landing.security${p.key}Desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal relative">
            <img
              src={landingAssets.security}
              alt=""
              aria-hidden="true"
              className="aspect-[4/3] w-full rounded-2xl border border-border object-cover shadow-xl"
              loading="lazy"
            />
            <div className="absolute -bottom-4 start-6 flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg">
              <Lock className="h-4 w-4 text-[hsl(var(--landing-gold))]" />
              {t("landing.securityNote")}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. FAQ ── */}
      <section id="faq" className="bg-secondary/60">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="reveal mb-10 text-center">
            <Eyebrow>{t("landing.kickerFaq")}</Eyebrow>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("landing.faqTitle")}</h2>
            <p className="mt-3 text-lg text-muted-foreground">{t("landing.faqSubtitle")}</p>
          </div>
          <Accordion type="single" collapsible className="reveal w-full">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-start">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── 9. CTA ── */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="reveal text-3xl font-bold tracking-tight sm:text-4xl">{t("landing.ctaTitle")}</h2>
          <p className="reveal mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">{t("landing.ctaSubtitle")}</p>
          <div className="reveal mt-8">
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/register">{t("landing.ctaButton")} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 10. Footer ── */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">{t("app.title")}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            {t("landing.footerRights", { year: new Date().getFullYear() })}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
