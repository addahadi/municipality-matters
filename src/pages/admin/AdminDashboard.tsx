import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Users,
  Gavel,
  ClipboardList,
  FileText,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { statisticsApi } from "@/services/api";

interface Activity {
  type: string;
  id: string;
  title: string;
  created_at: string;
  action: string;
  resource_type: string;
}

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);

  useEffect(() => {
    statisticsApi
      .getAdminStats()
      .then((r) => setData(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setActivitiesLoading(true);
        const res = await statisticsApi.getRecentActivity(10);
        setActivities(res.data);
      } catch (err) {
        console.error("Error fetching activities:", err);
      } finally {
        setActivitiesLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "PROPERTY":
        return Building2;
      case "AUCTION":
        return Gavel;
      case "REQUEST":
        return ClipboardList;
      case "INVOICE":
        return CreditCard;
      case "COMPLAINT":
        return AlertCircle;
      default:
        return FileText;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "PROPERTY":
        return "text-primary";
      case "AUCTION":
        return "text-warning";
      case "REQUEST":
        return "text-info";
      case "INVOICE":
        return "text-accent";
      case "COMPLAINT":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const formatTime = (date: string) => {
    const now = new Date();
    const actDate = new Date(date);
    const diff = now.getTime() - actDate.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t("common.now") || "now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return actDate.toLocaleDateString();
  };

  const stats = [
    {
      label: t("dashboard.totalProperties"),
      value: data?.totalProperties ?? "—",
      icon: Building2,
      bg: "bg-primary/10",
      color: "text-primary",
    },
    {
      label: t("dashboard.totalCitizens"),
      value: data?.totalCitizens ?? "—",
      icon: Users,
      bg: "bg-accent/10",
      color: "text-accent",
    },
    {
      label: t("dashboard.activeAuctions"),
      value: data?.activeAuctions ?? "—",
      icon: Gavel,
      bg: "bg-warning/10",
      color: "text-warning",
    },
    {
      label: t("dashboard.pendingRequests"),
      value: data?.pendingRequests ?? "—",
      icon: ClipboardList,
      bg: "bg-info/10",
      color: "text-info",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-7">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            {t("dashboard.welcome")}, {user?.username || "Admin"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("app.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-[13px] font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}
                  >
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {t("dashboard.recentActivity")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activitiesLoading ? (
              <div className="py-6 text-center text-muted-foreground text-sm">
                {t("common.loading")}
              </div>
            ) : activities.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground text-sm">
                {t("common.noData")}
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity, idx) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div
                      key={`${activity.id}-${idx}`}
                      className="flex items-start gap-3 pb-3 border-b last:border-b-0 last:pb-0"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0`}
                      >
                        <Icon
                          className={`h-4 w-4 ${getActivityColor(activity.type)}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {activity.title}
                          </p>
                          <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                            {formatTime(activity.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activity.type} • {activity.action}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
