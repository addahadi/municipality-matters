import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Building2, Gavel, FileText, MessageSquare, Megaphone, BarChart3,
  Users, ClipboardList, AlertCircle, Star, LogOut, Menu, Globe,
  LayoutDashboard, FolderOpen, X,
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
  ];

  const citizenNav = [
    { to: "/citizen", icon: LayoutDashboard, label: t("nav.dashboard") },
    { to: "/citizen/properties", icon: Building2, label: t("nav.properties") },
    { to: "/citizen/requests", icon: ClipboardList, label: t("nav.requests") },
    { to: "/citizen/complaints", icon: AlertCircle, label: t("nav.complaints") },
    { to: "/citizen/reviews", icon: Star, label: t("nav.reviews") },
    { to: "/citizen/announcements", icon: Megaphone, label: t("nav.announcements") },
    { to: "/citizen/invoices", icon: FileText, label: t("nav.invoices") },
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

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-bold text-sidebar-foreground block truncate">
              {t("app.title")}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive(item.to)
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border space-y-0.5">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          <Globe className="h-4 w-4" />
          {i18n.language === "en" ? "العربية" : "English"}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-sidebar-accent transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t("nav.logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-sidebar border-e border-sidebar-border shrink-0">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 h-full bg-sidebar shadow-xl animate-fade-in">
            <button
              className="absolute top-3 end-3 p-1 rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
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
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-3 ms-auto">
            <span className="text-sm font-medium text-muted-foreground">{username}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-primary text-primary-foreground font-semibold">
              {role}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
