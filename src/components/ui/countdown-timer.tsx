import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endDate: string | Date;
}

const CountdownTimer = ({ endDate }: CountdownTimerProps) => {
  const { t } = useTranslation();

  const calculateTimeLeft = () => {
    const difference = +new Date(endDate) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      ended: false,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        ended: false,
      };
    } else {
      timeLeft.ended = true;
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (remaining.ended) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.ended) {
    return (
      <div className="flex items-center gap-2 text-destructive font-medium">
        <Clock className="h-4 w-4" />
        <span>{t("auctions.ended", "Ended")}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 bg-gradient-to-br from-card to-muted/30 border border-border/50 rounded-xl shadow-sm max-w-fit">
      <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Clock className="h-3.5 w-3.5 text-primary" />
        <span>{t("auctions.countdown", "Time Remaining")}</span>
      </div>
      <div className="flex gap-1.5 items-center">
        {timeLeft.days > 0 && (
          <>
            <div className="flex flex-col items-center justify-center bg-background border border-border/50 rounded-lg min-w-12 px-2 py-1.5 shadow-sm relative overflow-hidden transition-all hover:border-primary/50">
              <span className="font-mono text-lg font-bold text-foreground leading-none">{timeLeft.days}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">{t("time.days", "D")}</span>
            </div>
            <span className="text-muted-foreground/50 font-bold mb-3">:</span>
          </>
        )}
        <div className="flex flex-col items-center justify-center bg-background border border-border/50 rounded-lg min-w-12 px-2 py-1.5 shadow-sm relative overflow-hidden transition-all hover:border-primary/50">
          <span className="font-mono text-lg font-bold text-foreground leading-none">{timeLeft.hours.toString().padStart(2, "0")}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">{t("time.hours", "H")}</span>
        </div>
        <span className="text-muted-foreground/50 font-bold mb-3">:</span>
        <div className="flex flex-col items-center justify-center bg-background border border-border/50 rounded-lg min-w-12 px-2 py-1.5 shadow-sm relative overflow-hidden transition-all hover:border-primary/50">
          <span className="font-mono text-lg font-bold text-foreground leading-none">{timeLeft.minutes.toString().padStart(2, "0")}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">{t("time.minutes", "M")}</span>
        </div>
        <span className="text-primary/50 font-bold animate-pulse mb-3">:</span>
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg min-w-12 px-2 py-1.5 shadow-sm relative overflow-hidden">
          <span className="font-mono text-lg font-bold text-primary leading-none">{timeLeft.seconds.toString().padStart(2, "0")}</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80 mt-1">{t("time.seconds", "S")}</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
