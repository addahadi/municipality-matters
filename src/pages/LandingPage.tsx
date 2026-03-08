import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2, Gavel, FileText, Shield, Users, Globe,
  ClipboardList, Megaphone, ArrowRight, CheckCircle2,
} from "lucide-react";

const LandingPage = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const features = [
    { icon: Building2, title: t("landing.featureProperties"), desc: t("landing.featurePropertiesDesc") },
    { icon: Gavel, title: t("landing.featureAuctions"), desc: t("landing.featureAuctionsDesc") },
    { icon: FileText, title: t("landing.featureInvoices"), desc: t("landing.featureInvoicesDesc") },
    { icon: ClipboardList, title: t("landing.featureRequests"), desc: t("landing.featureRequestsDesc") },
    { icon: Shield, title: t("landing.featureSecurity"), desc: t("landing.featureSecurityDesc") },
    { icon: Megaphone, title: t("landing.featureAnnouncements"), desc: t("landing.featureAnnouncementsDesc") },
  ];

  const stats = [
    { value: "10K+", label: t("landing.statProperties") },
    { value: "5K+", label: t("landing.statCitizens") },
    { value: "99.9%", label: t("landing.statUptime") },
    { value: "24/7", label: t("landing.statSupport") },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">{t("app.title")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleLanguage}>
              <Globe className="h-4 w-4 me-1.5" />
              {i18n.language === "en" ? "العربية" : "English"}
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">{t("auth.login")}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/register">{t("auth.register")}</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Shield className="h-3.5 w-3.5" />
              {t("landing.badge")}
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {t("landing.heroTitle")}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed sm:text-xl">
              {t("landing.heroSubtitle")}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto text-base px-8" asChild>
                <Link to="/register">
                  {t("landing.getStarted")}
                  <ArrowRight className="h-4 w-4 ms-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8" asChild>
                <Link to="/login">{t("landing.signIn")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/40 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">{t("landing.featuresTitle")}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t("landing.featuresSubtitle")}</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="group border-border/60 bg-card transition-all duration-200 hover:shadow-lg hover:border-primary/20 hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="border-t border-border bg-muted/30 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">{t("landing.rolesTitle")}</h2>
            <p className="mt-4 text-muted-foreground text-lg">{t("landing.rolesSubtitle")}</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Shield, role: t("landing.roleAdmin"), items: t("landing.roleAdminItems", { returnObjects: true }) as string[] },
              { icon: Users, role: t("landing.roleEmployee"), items: t("landing.roleEmployeeItems", { returnObjects: true }) as string[] },
              { icon: Building2, role: t("landing.roleCitizen"), items: t("landing.roleCitizenItems", { returnObjects: true }) as string[] },
            ].map((r) => (
              <Card key={r.role} className="border-border/60">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <r.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-4">{r.role}</h3>
                  <ul className="space-y-2.5">
                    {(Array.isArray(r.items) ? r.items : []).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">{t("landing.ctaTitle")}</h2>
          <p className="mt-4 text-muted-foreground text-lg">{t("landing.ctaSubtitle")}</p>
          <Button size="lg" className="mt-8 text-base px-10" asChild>
            <Link to="/register">
              {t("landing.ctaButton")}
              <ArrowRight className="h-4 w-4 ms-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/40 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {t("app.title")}. {t("landing.footerRights")}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
