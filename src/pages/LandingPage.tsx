import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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
  Star, TrendingUp, Zap, Lock, UserPlus, LayoutDashboard,
  ClipboardCheck, BellRing,
} from "lucide-react";

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

const ROLE_BADGE = ["bg-primary", "bg-accent", "bg-primary"];
const ROLE_BAR = ["bg-primary", "bg-accent", "bg-primary"];

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const isArabic = i18n.language.startsWith("ar");

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

  const features = [
    { icon: Building2, title: t("landing.featureProperties"), desc: t("landing.featurePropertiesDesc") },
    { icon: Gavel, title: t("landing.featureAuctions"), desc: t("landing.featureAuctionsDesc") },
    { icon: FileText, title: t("landing.featureInvoices"), desc: t("landing.featureInvoicesDesc") },
    { icon: ClipboardList, title: t("landing.featureRequests"), desc: t("landing.featureRequestsDesc") },
    { icon: Lock, title: t("landing.featureSecurity"), desc: t("landing.featureSecurityDesc") },
    { icon: Megaphone, title: t("landing.featureAnnouncements"), desc: t("landing.featureAnnouncementsDesc") },
  ];

  const roles = [
    {
      icon: Shield,
      role: t("landing.roleAdmin"),
      items: t("landing.roleAdminItems", { returnObjects: true }) as string[],
    },
    {
      icon: Users,
      role: t("landing.roleEmployee"),
      items: t("landing.roleEmployeeItems", { returnObjects: true }) as string[],
    },
    {
      icon: Building2,
      role: t("landing.roleCitizen"),
      items: t("landing.roleCitizenItems", { returnObjects: true }) as string[],
    },
  ];

  const trustBadges = [
    { icon: Shield, text: t("landing.trustSecure") },
    { icon: Zap, text: t("landing.trustFast") },
    { icon: TrendingUp, text: t("landing.trustImproving") },
  ];

  const processIcons = [UserPlus, LayoutDashboard, ClipboardCheck, BellRing];
  const processSteps = t("landing.processSteps", { returnObjects: true }) as { title: string; desc: string }[];
  const faqItems = t("landing.faqItems", { returnObjects: true }) as { q: string; a: string }[];

  return (
    <div className="landing-theme min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Navbar ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 bg-background/90 backdrop-blur-md ${
          scrolled ? "border-b border-border shadow-sm" : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">{t("app.title")}</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">{t("landing.navFeatures")}</a>
            <a href="#process" className="hover:text-foreground transition-colors">{t("landing.navProcess")}</a>
            <a href="#faq" className="hover:text-foreground transition-colors">{t("landing.navFaq")}</a>
          </nav>

          {/* Nav actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-1.5 text-muted-foreground hover:text-foreground px-2 sm:px-3">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">{isArabic ? "English" : "العربية"}</span>
            </Button>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground hidden sm:inline-flex">
              <Link to="/login">{t("auth.login")}</Link>
            </Button>
            <Button size="sm" asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/register">{t("auth.register")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="pointer-events-none absolute -top-32 -right-32 -z-0 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 -z-0 h-96 w-96 rounded-full bg-accent/10 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="mx-auto max-w-4xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-primary mb-8">
              <Star className="h-3.5 w-3.5 fill-primary" />
              {t("landing.badge")}
            </div>

            {/* Headline */}
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
              {t("landing.heroTitle")}
            </h1>

            {/* Subtitle */}
            <p className="mt-5 sm:mt-7 text-base sm:text-lg text-muted-foreground leading-relaxed lg:text-xl max-w-2xl mx-auto">
              {t("landing.heroSubtitle")}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto text-base px-8 bg-primary text-primary-foreground hover:bg-primary/90"
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
                className="w-full sm:w-auto text-base px-8 border-border text-foreground hover:bg-muted"
                asChild
              >
                <Link to="/login">{t("landing.signIn")}</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex items-center justify-center gap-6 flex-wrap">
              {trustBadges.map(({ icon: Icon, text }) => (
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
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-4">
            {[
              { value: 10000, suffix: "+", label: t("landing.statProperties") },
              { value: 5000, suffix: "+", label: t("landing.statCitizens") },
              { value: 99, suffix: ".9%", label: t("landing.statUptime") },
              { value: 24, suffix: "/7", label: t("landing.statSupport") },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
              >
                <p className="text-2xl sm:text-4xl font-extrabold text-primary">
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              {t("landing.kickerFeatures")}
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{t("landing.featuresTitle")}</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">{t("landing.featuresSubtitle")}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-border bg-card p-6
                           hover:border-primary/40 hover:shadow-lg hover:-translate-y-1
                           transition-all duration-300"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section id="process" className="py-24 sm:py-32 bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              {t("landing.kickerProcess")}
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{t("landing.processTitle")}</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">{t("landing.processSubtitle")}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {processSteps.map((step, i) => {
              const Icon = processIcons[i % processIcons.length];
              return (
                <div key={step.title} className="relative text-center md:text-start">
                  <div className="mx-auto md:mx-0 mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-card text-primary font-bold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="block text-xs font-semibold text-primary mb-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              {t("landing.kickerRoles")}
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{t("landing.rolesTitle")}</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">{t("landing.rolesSubtitle")}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {roles.map((r, i) => (
              <div
                key={r.role}
                className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm
                           hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`h-1.5 w-full ${ROLE_BAR[i % ROLE_BAR.length]}`} />
                <div className="p-7">
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white ${ROLE_BADGE[i % ROLE_BADGE.length]}`}>
                    <r.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold mb-5">{r.role}</h3>
                  <ul className="space-y-3">
                    {(Array.isArray(r.items) ? r.items : []).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
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

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 sm:py-32 bg-muted/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest mb-4">
              {t("landing.kickerFaq")}
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{t("landing.faqTitle")}</h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">{t("landing.faqSubtitle")}</p>
          </div>

          <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-6">
            {faqItems.map((item, idx) => (
              <AccordionItem key={item.q} value={`item-${idx}`} className={idx === faqItems.length - 1 ? "border-b-0" : ""}>
                <AccordionTrigger className="text-start text-base font-semibold hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-accent text-center px-8 py-16 sm:px-16 sm:py-20">
            <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white uppercase tracking-widest mb-6">
              {t("landing.kickerCta")}
            </span>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl text-white">{t("landing.ctaTitle")}</h2>
            <p className="mt-5 text-white/70 text-lg max-w-xl mx-auto">{t("landing.ctaSubtitle")}</p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-base px-10 bg-primary text-primary-foreground hover:bg-primary/90"
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
                className="text-base px-10 bg-transparent border-white/25 text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link to="/login">{t("auth.login")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-muted/40 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-secondary text-primary">
                <Building2 className="h-4 w-4" />
              </div>
              <span className="font-semibold text-sm">{t("app.title")}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {t("app.title")}. {t("landing.footerRights")}
            </p>
            <Button variant="ghost" size="sm" onClick={toggleLanguage} className="text-xs text-muted-foreground gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              {isArabic ? "English" : "العربية"}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
