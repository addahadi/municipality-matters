import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Building2, Gavel, FileText, Shield, Users, Globe,
  ClipboardList, Megaphone, ArrowRight, CheckCircle2,
  Star, TrendingUp, Zap, Lock,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── tiny animated number counter ─── */
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

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const mainRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hero] > *", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.18,
        ease: "power4.out",
      });

      gsap.from("[data-stat]", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-stats]", start: "top 85%" },
      });

      gsap.from("[data-feature]", {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-features]", start: "top 80%" },
      });

      gsap.utils.toArray<HTMLElement>("[data-heading]").forEach((el) => {
        gsap.from(el, {
          y: 35,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      gsap.from("[data-role]", {
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.7,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-roles]", start: "top 80%" },
      });

      gsap.from("[data-cta] > *", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-cta]", start: "top 88%" },
      });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const features = [
    { icon: Building2, title: t("landing.featureProperties"), desc: t("landing.featurePropertiesDesc"), color: "from-blue-500/20 to-blue-600/5" },
    { icon: Gavel,     title: t("landing.featureAuctions"),   desc: t("landing.featureAuctionsDesc"),   color: "from-violet-500/20 to-violet-600/5" },
    { icon: FileText,  title: t("landing.featureInvoices"),   desc: t("landing.featureInvoicesDesc"),   color: "from-emerald-500/20 to-emerald-600/5" },
    { icon: ClipboardList, title: t("landing.featureRequests"), desc: t("landing.featureRequestsDesc"), color: "from-orange-500/20 to-orange-600/5" },
    { icon: Lock,      title: t("landing.featureSecurity"),   desc: t("landing.featureSecurityDesc"),   color: "from-rose-500/20 to-rose-600/5" },
    { icon: Megaphone, title: t("landing.featureAnnouncements"), desc: t("landing.featureAnnouncementsDesc"), color: "from-cyan-500/20 to-cyan-600/5" },
  ];

  const roles = [
    {
      icon: Shield,
      role: t("landing.roleAdmin"),
      items: t("landing.roleAdminItems", { returnObjects: true }) as string[],
      gradient: "from-violet-600 to-purple-700",
      ring: "ring-violet-500/20",
    },
    {
      icon: Users,
      role: t("landing.roleEmployee"),
      items: t("landing.roleEmployeeItems", { returnObjects: true }) as string[],
      gradient: "from-blue-600 to-sky-700",
      ring: "ring-blue-500/20",
    },
    {
      icon: Building2,
      role: t("landing.roleCitizen"),
      items: t("landing.roleCitizenItems", { returnObjects: true }) as string[],
      gradient: "from-emerald-600 to-teal-700",
      ring: "ring-emerald-500/20",
    },
  ];

  return (
    <div ref={mainRef} className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── Navbar ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "border-b border-border/60 bg-background/85 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/30">
              <Building2 className="h-5 w-5 text-primary-foreground" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background" />
            </div>
            <span className="text-lg font-bold tracking-tight">{t("app.title")}</span>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-1.5 text-muted-foreground hover:text-foreground px-2 sm:px-3">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{i18n.language === "en" ? "العربية" : "English"}</span>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
              <Link to="/login">{t("auth.login")}</Link>
            </Button>
            <Button size="sm" asChild className="bg-primary shadow-md shadow-primary/30 hover:shadow-primary/40 hover:shadow-lg transition-shadow">
              <Link to="/register">{t("auth.register")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden py-24 sm:py-36"
        style={{
          backgroundImage: `
            linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.30) 50%, var(--background, #fff) 100%),
            url('/hero-bg.png')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dot grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 -z-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Color tint */}
        <div className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br from-primary/15 via-transparent to-violet-900/15" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div data-hero className="mx-auto max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-sm font-medium text-primary mb-8 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-primary" />
              {t("landing.badge")}
            </div>

            {/* Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl leading-[1.08]">
              <span className="block text-foreground">{t("landing.heroTitle")}</span>
              <span className="block mt-2 bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                {t("app.title")}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-5 sm:mt-7 text-base sm:text-lg text-muted-foreground leading-relaxed lg:text-xl max-w-2xl mx-auto">
              {t("landing.heroSubtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base px-8 shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                asChild
              >
                <Link to="/register">
                  {t("landing.getStarted")}
                  <ArrowRight className="h-4 w-4 ms-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base px-8 border-border/60 bg-background/50 backdrop-blur-sm hover:bg-muted/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                asChild
              >
                <Link to="/login">{t("landing.signIn")}</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex items-center justify-center gap-6 flex-wrap">
              {[
                { icon: Shield, text: "Secure & Encrypted" },
                { icon: Zap,    text: "Lightning Fast" },
                { icon: TrendingUp, text: "Always Improving" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section data-stats className="relative py-14 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-violet-500/5 to-cyan-500/5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { value: 10000, suffix: "+", label: t("landing.statProperties") },
              { value: 5000,  suffix: "+", label: t("landing.statCitizens") },
              { value: 99,    suffix: ".9%", label: t("landing.statUptime") },
              { value: 24,    suffix: "/7", label: t("landing.statSupport") },
            ].map((stat) => (
              <div
                key={stat.label}
                data-stat
                className="group relative rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 text-center shadow-sm hover:shadow-md hover:border-primary/25 transition-all duration-300"
              >
                <p className="text-4xl font-extrabold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section data-features className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-heading className="text-center mb-16">
            <span className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              Platform Features
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{t("landing.featuresTitle")}</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">{t("landing.featuresSubtitle")}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <div
                key={f.title}
                data-feature
                className="group relative rounded-2xl border border-border/50 bg-card p-6 overflow-hidden cursor-default
                           hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1
                           transition-all duration-300"
              >
                {/* gradient bg blob */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary
                                  group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/30
                                  transition-all duration-300">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 h-16 w-16 bg-gradient-to-tl from-primary/8 to-transparent rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section data-roles className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div data-heading className="text-center mb-16">
            <span className="inline-block rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              Who It's For
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{t("landing.rolesTitle")}</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">{t("landing.rolesSubtitle")}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {roles.map((r) => (
              <div
                key={r.role}
                data-role
                className={`group relative rounded-2xl border bg-card overflow-hidden shadow-sm
                            ring-1 ${r.ring} hover:ring-2 hover:-translate-y-1 hover:shadow-xl
                            transition-all duration-300`}
              >
                {/* Top gradient bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${r.gradient}`} />
                <div className="p-7">
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${r.gradient} shadow-lg text-white`}>
                    <r.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold mb-5">{r.role}</h3>
                  <ul className="space-y-3">
                    {(Array.isArray(r.items) ? r.items : []).map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 sm:py-32">
        <div data-cta className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden border border-primary/20 shadow-2xl shadow-primary/10">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-violet-500/8 to-cyan-500/10" />
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 70% 50%, hsl(var(--primary)/0.12), transparent 60%)",
            }} />
            <div className="relative z-10 text-center px-8 py-16 sm:px-16 sm:py-20">
              <span className="inline-block rounded-full bg-primary/15 border border-primary/25 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest mb-6">
                Get Started Today
              </span>
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{t("landing.ctaTitle")}</h2>
              <p className="mt-5 text-muted-foreground text-lg max-w-xl mx-auto">{t("landing.ctaSubtitle")}</p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="text-base px-10 shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                  asChild
                >
                  <Link to="/register">
                    {t("landing.ctaButton")}
                    <ArrowRight className="h-4 w-4 ms-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-base px-10 bg-background/40 backdrop-blur-sm hover:bg-muted/50 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
                  asChild
                >
                  <Link to="/login">{t("auth.login")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/60 bg-muted/20 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="font-semibold text-sm">{t("app.title")}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {t("app.title")}. {t("landing.footerRights")}
            </p>
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="text-xs text-muted-foreground gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              {i18n.language === "en" ? "العربية" : "English"}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
