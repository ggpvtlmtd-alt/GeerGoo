import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { ElementType } from "react";

/* ─────────────────────────────────────────────────────────────
   Ease-out cubic counter
   Runs 0 → target over `duration` ms using rAF.
   Only activates for pure-integer value strings.
────────────────────────────────────────────────────────────── */
function useCounter(target: number, duration = 1300): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) { setCount(0); return; }

    let frame: number;
    const t0 = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - t0) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setCount(target);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return count;
}

/* ─────────────────────────────────────────────────────────────
   Props — `color` is kept for API compatibility but
   intentionally unused in this design (monochromatic).
────────────────────────────────────────────────────────────── */
type Props = {
  title:    string;
  value:    string;
  icon?:    ElementType;
  trend?:   string;
  trendUp?: boolean;
  /** Accepted but unused — design is intentionally monochromatic */
  color?:   "blue" | "purple" | "green" | "orange";
};

/* ─────────────────────────────────────────────────────────────
   StatCard
   Visual hierarchy:
     [LABEL]   — small, uppercase, quiet
     [VALUE]   — huge, bold, animated for integers
     [FOOTER]  — icon + trend chip, subtle
────────────────────────────────────────────────────────────── */
function StatCard({ title, value, icon: Icon, trend, trendUp }: Props) {
  // Only animate pure integers ("12", "9", "3").
  // Non-numeric strings like "<5 sec" render as-is — no animation.
  const isInteger = /^\d+$/.test(value);
  const target    = isInteger ? parseInt(value, 10) : 0;
  const animated  = useCounter(target, 1300);
  const display   = isInteger ? String(animated) : value;

  return (
    <div className="db-stat-card">

      {/* 1. Label — reads first, establishes context */}
      <div className="db-stat-label">{title}</div>

      {/* 2. Value — the primary data point, made enormous */}
      <div className="db-stat-value">{display}</div>

      {/* 3. Footer — small supporting detail */}
      <div className="db-stat-footer">
        {Icon && (
          <span className="db-stat-icon-mini">
            <Icon size={13} strokeWidth={1.5} />
          </span>
        )}
        {trend !== undefined && (
          <span className={`db-stat-trend ${trendUp ? "up" : "down"}`}>
            {trendUp
              ? <TrendingUp  size={10} strokeWidth={2.25} />
              : <TrendingDown size={10} strokeWidth={2.25} />
            }
            {trend}
          </span>
        )}
      </div>

    </div>
  );
}

export default StatCard;
