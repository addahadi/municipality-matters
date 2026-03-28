import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Building2, Gavel, FileText, MessageSquare, Megaphone, BarChart3,
  Users, ClipboardList, AlertCircle, Star, LogOut, Menu, Globe,
  LayoutDashboard, FolderOpen, X, ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = user?.role || "CITIZEN";
  const username = user?.username || "User";

  const handleLogout = () => {
    logout();
    toast({ title: t("auth.logoutSuccess"), variant: "success" as any });
    navigate("/login");
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const adminNav = [
    { to: "/admin", icon: LayoutDashboard, label: t("nav.dashboard") },
    { to: "/admin/accounts", icon: Users, label: t("nav.accounts") },
    { to: "/admin/statistics", icon: BarChart3, label: t("nav.statistics") },
    { to: "/admin/properties", icon: Building2, label: t("nav.properties") },
  ];

  const employeeNav = [
    { to: "/employee", icon: LayoutDashboard, label: t("nav.dashboard") },
    { to: "/employee/properties", icon: Building2, label: t("nav.properties") },
    { to: "/employee/auctions", icon: Gavel, label: t("nav.auctions") },
    { to: "/employee/invoices", icon: FileText, label: t("nav.invoices") },
    { to: "/employee/requests", icon: ClipboardList, label: t("nav.requests") },
    { to: "/employee/complaints", icon: AlertCircle, label: t("nav.complaints") },
    { to: "/employee/reviews", icon: Star, label: t("nav.reviews") },
    { to: "/employee/announcements", icon: Megaphone, label: t("nav.announcements") },
    { to: "/employee/messages", icon: MessageSquare, label: t("nav.messages") },
    { to: "/employee/documents", icon: FolderOpen, label: t("nav.documents") },
  ];

  const citizenNav = [
    { to: "/citizen", icon: LayoutDashboard, label: t("nav.dashboard") },
    { to: "/citizen/properties", icon: Building2, label: t("nav.properties") },
    { to: "/citizen/auctions", icon: Gavel, label: t("nav.auctions") },
    { to: "/citizen/requests", icon: ClipboardList, label: t("nav.requests") },
    { to: "/citizen/complaints", icon: AlertCircle, label: t("nav.complaints") },
    { to: "/citizen/reviews", icon: Star, label: t("nav.reviews") },
    { to: "/citizen/announcements", icon: Megaphone, label: t("nav.announcements") },
    { to: "/citizen/invoices", icon: FileText, label: t("nav.invoices") },
    { to: "/citizen/rentals", icon: Building2, label: t("nav.myRentals") },
    { to: "/citizen/documents", icon: FolderOpen, label: t("nav.documents") },
  ];

  const navItems =
    role === "ADMIN" ? adminNav : role === "EMPLOYEE" ? employeeNav : citizenNav;

  const isActive = (to: string) => {
    if (to === "/admin" || to === "/employee" || to === "/citizen") {
      return location.pathname === to;
    }
    return location.pathname.startsWith(to);
  };

  const roleBadgeStyle = () => {
    switch (role) {
      case "ADMIN": return "bg-destructive/10 text-destructive border border-destructive/20";
      case "EMPLOYEE": return "bg-primary/10 text-primary border border-primary/20";
      default: return "bg-accent/10 text-accent border border-accent/20";
    }
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sidebar-primary to-sidebar-primary/70 flex items-center justify-center shadow-lg shadow-sidebar-primary/20">
            <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-bold text-sidebar-foreground block truncate tracking-tight">
              {t("app.title")}
            </span>
            <span className="text-[11px] text-sidebar-foreground/50 font-medium">
              {t("app.subtitle", "Management System")}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
              isActive(item.to)
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-sidebar-primary/25"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            <span className="flex-1">{item.label}</span>
            {isActive(item.to) && (
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-0.5">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <Globe className="h-[18px] w-[18px]" />
          {i18n.language === "en" ? "العربية" : "English"}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="h-[18px] w-[18px]" />
          {t("nav.logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[260px] flex-col bg-sidebar border-e border-sidebar-border shrink-0">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/25 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-[260px] h-full bg-sidebar shadow-2xl animate-fade-in">
            <button
              className="absolute top-4 end-4 p-1.5 rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <NavContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-[60px] border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden -ms-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3 ms-auto">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-medium text-foreground block leading-tight">{username}</span>
              </div>
            </div>
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${roleBadgeStyle()}`}>
              {role}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-7 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
