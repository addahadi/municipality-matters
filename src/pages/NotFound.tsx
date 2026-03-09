import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-6xl font-bold text-foreground tracking-tight">404</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          {t("errors.pageNotFound", "The page you're looking for doesn't exist or has been moved.")}
        </p>
        <Button asChild className="mt-8 gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            {t("errors.goHome", "Back to Home")}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
