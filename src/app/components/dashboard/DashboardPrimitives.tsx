import type { ReactNode } from "react";
import { cn } from "../ui/utils";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";

type Tone = "default" | "primary" | "info" | "success" | "warning" | "danger" | "muted";

const toneClass: Record<Tone, string> = {
  default: "border-[color:var(--app-border)] bg-card text-foreground",
  primary: "border-[color:var(--app-primary-300)] bg-[color:var(--app-primary-soft)] text-[color:var(--app-primary)]",
  info: "border-[color:var(--app-primary-300)] bg-[color:var(--app-primary-soft)] text-[color:var(--app-primary)]",
  success: "border-[color:var(--app-success-300)] bg-[color:var(--app-success-soft)] text-[color:var(--app-success)]",
  warning: "border-[color:var(--app-warning-300)] bg-[color:var(--app-warning-soft)] text-[color:var(--app-warning)]",
  danger: "border-[color:var(--app-danger-300)] bg-[color:var(--app-danger-soft)] text-[color:var(--app-danger)]",
  muted: "border-[color:var(--app-border-light)] bg-[color:var(--app-info-soft)] text-[color:var(--app-info)]",
};

export function StatusBadge({ children, tone = "muted", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <Badge
      variant="outline"
      data-tone={tone}
      className={cn(
        "app-status-badge rounded-[var(--app-radius-badge)] text-[var(--app-type-micro)] font-semibold tracking-0",
        toneClass[tone],
        className
      )}
    >
      {children}
    </Badge>
  );
}

export function SectionHeader({
  title,
  meta,
  action,
  icon,
  className,
}: {
  title: ReactNode;
  meta?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("app-section-header flex items-center justify-between gap-2 px-2.5 py-2", className)}>
      <div className="flex min-w-0 items-center gap-2">
        <span className="app-title-icon">{icon}</span>
        <div className="app-section-title min-w-0 font-bold text-foreground">
          {title}
        </div>
        {meta && <div className="shrink-0 text-[var(--app-type-meta)] leading-none text-muted-foreground">{meta}</div>}
      </div>
      {action && <div className="shrink-0 text-[var(--app-type-meta)] font-medium text-primary">{action}</div>}
    </div>
  );
}

export function KpiCard({
  label,
  value,
  unit,
  trend,
  tone = "default",
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  trend?: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div className={cn("app-kpi-card", tone !== "default" && toneClass[tone], className)}>
      <div className="app-kpi-label">{label}</div>
      <div className="app-kpi-value-row">
        <span className="app-kpi-value">{value}</span>
        {unit && <span className="app-kpi-unit">{unit}</span>}
      </div>
      {trend && <div className="app-kpi-trend">{trend}</div>}
    </div>
  );
}

export function ChartPanel({
  title,
  unit,
  height = 96,
  children,
  className,
}: {
  title?: ReactNode;
  unit?: ReactNode;
  height?: number;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("app-chart-panel", className)}>
      {(title || unit) && (
        <div className="app-chart-head">
          <span className="app-chart-title">{title}</span>
          {unit && <span className="app-chart-unit">{unit}</span>}
        </div>
      )}
      <div className="app-chart-body" style={{ minHeight: height }}>
        {children}
      </div>
    </div>
  );
}

export function HorizontalBar({
  value,
  tone = "primary",
  className,
  label,
}: {
  value: number;
  tone?: "primary" | "success" | "warning" | "danger";
  className?: string;
  label?: string;
}) {
  const normalizedValue = Math.max(0, Math.min(100, value));
  const visibleValue = normalizedValue > 0 ? Math.max(normalizedValue, 1.5) : 0;

  return (
    <Progress
      value={visibleValue}
      aria-label={label}
      aria-valuenow={normalizedValue}
      className={cn("app-horizontal-bar", `is-${tone}`, className)}
    />
  );
}

export function DataTableCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("app-data-table", className)}>{children}</div>;
}

export function RiskListItem({
  category,
  text,
  priority,
  tone,
  onClick,
}: {
  category: ReactNode;
  text: ReactNode;
  priority: ReactNode;
  tone: "danger" | "warning" | "muted";
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="app-risk-item" data-tone={tone} style={{ cursor: onClick ? "pointer" : "default" }}>
      <span className={cn("app-risk-stripe", toneClass[tone])} />
      <span className="min-w-0 flex-1 text-left">
        <span className="mb-1 flex items-center gap-1.5">
          <span className="app-risk-category">{category}</span>
          <StatusBadge tone={tone} className="app-risk-priority">{priority}</StatusBadge>
        </span>
        <span className="app-risk-text">{text}</span>
      </span>
      <span className="app-risk-chevron">›</span>
    </button>
  );
}
