import { useState, useEffect, useRef } from "react";
import { PageDesignTokens, PageAtomicComponents, PageDashboardComponents, PageStateCoverage } from "./DesignSystemPages";
import { cn } from "./components/ui/utils";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import {
  Card as UICard,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./components/ui/sheet";
import { DEFAULT_GLOBAL_DATE, GlobalHeader } from "./components/GlobalHeader";
import {
  Activity,
  AlertTriangle,
  Anchor,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Factory,
  Gauge,
  Landmark,
  LineChart,
  PackageCheck,
  ShieldCheck,
  Ship,
  Table2,
  TrendingUp,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  ChartPanel,
  DataTableCard,
  KpiCard,
  HorizontalBar,
  RiskListItem,
  SectionHeader,
  StatusBadge,
} from "./components/dashboard/DashboardPrimitives";
import { GroupedBarChart } from "./components/dashboard/GroupedBarChart";
import { EnergyModeTabs, type EnergyMode } from "./components/dashboard/EnergyModeTabs";
import { PurchaseModeTabs, type PurchaseMode } from "./components/dashboard/PurchaseModeTabs";
import { ProductionModeTabs, type ProductionMode } from "./components/dashboard/ProductionModeTabs";

/* ─── Design Tokens · 中远海运重工 V1.1 Element 色阶 ─── */
const C = {
  // 中性灰
  bg: "var(--background)",
  card: "var(--card)",
  border: "var(--app-border)",
  divider: "rgba(0,80,142,0.08)",
  t1: "var(--foreground)",
  t2: "var(--app-ink-muted)",
  t3: "var(--muted-foreground)",
  ph: "var(--app-primary-soft)",
  phDark: "var(--app-info-500)",
  // 品牌色
  brand: "#00508E",
  brandHover: "var(--app-primary-hover)",
  brandDark: "var(--app-primary-900)",
  brandSoft: "var(--app-primary-soft)",
  // 语义色
  success: "var(--app-success)",
  successSoft: "var(--app-success-soft)",
  warning: "var(--app-warning)",
  warningSoft: "var(--app-warning-soft)",
  danger: "var(--app-danger)",
  dangerSoft: "var(--app-danger-soft)",
  pendingSoft: "var(--app-pending-soft)",
  disabled: "var(--app-text-disabled)",
  // 图表色板
  chart: ["#00508E","#0B69C7","#79BBFF","#9FCEFF","#C6E2FF","#D9ECFF","#ECF5FF","#6C94B8"],
};

/* ─── Page Registry ─── */
const PAGES = [
  { id: "home",                 label: "1  首页" },
  { id: "biz",                  label: "2  经营主题" },
  { id: "biz-progress",         label: "2  经营·本周进展" },
  { id: "biz-overdue",          label: "2  经营·逾期应收" },
  { id: "biz-collection-plan",  label: "2  经营·计划收款" },
  { id: "biz-support-revenue-detail", label: "2  配套·营业收入分析" },
  { id: "biz-kpi-progress",     label: "2  经营·指标进度" },
  { id: "prod-repair",          label: "3  生产·修船主题" },
  { id: "prod-repair-ships",      label: "3  修船·在厂艘数" },
  { id: "prod-repair-completion", label: "3  修船·完工明细" },
  { id: "prod-repair-daily",    label: "3  修船·今日动态" },
  { id: "prod-ship",            label: "3  生产·造船主题" },
  { id: "prod-ship-delivery",        label: "3  造船·交付进度" },
  { id: "prod-ship-delivery-detail", label: "3  造船·交付进度明细" },
  { id: "prod-ship-track",      label: "3  造船·生产跟踪" },
  { id: "finance",              label: "4  财务主题" },
  { id: "finance-fund",         label: "4  财务·可用资金" },
  { id: "finance-rate",         label: "4  财务·汇率" },
  { id: "finance-revenue",      label: "4  财务·营业收入" },
  { id: "purchase-steel-dist",  label: "5  钢材·企业分布" },
  { id: "purchase-steel-delivery", label: "5  钢材·锁价交付" },
  { id: "purchase-steel-cost",     label: "5  钢材·成本预算" },
  { id: "purchase-group",       label: "5  采购·集采主题" },
  { id: "purchase-group-rate",  label: "5  集采·集采率" },
  { id: "quality",              label: "6  质量主题" },
  { id: "quality-rt",           label: "6  质量·RT合格率" },
  { id: "quality-inspection",   label: "6  质量·报验一次" },
  { id: "energy",               label: "7  能源主题" },
  { id: "design-tokens",        label: "DS  Design Token System" },
  { id: "atomic-components",    label: "DS  Atomic Components" },
  { id: "dashboard-components", label: "DS  Dashboard Components" },
  { id: "state-coverage",       label: "DS  State Coverage" },
];

/* ─── Shared UI Atoms (shadcn + Tailwind) ─── */

function StatusBar() {
  return (
    <div
      className="h-[56px] pt-3 flex items-start justify-between px-5 shrink-0"
      style={{ background: "transparent" }}
    >
      <span className="text-[13px] font-semibold tracking-tight" style={{ color: "#00345F" }}>9:41</span>
      <div className="flex gap-1.5 items-center">
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          {[0,1,2,3].map(i => <rect key={i} x={i*4} y={12-(i+1)*3} width="3" height={(i+1)*3} rx="1" fill={i < 3 ? "#00345F" : "rgba(0,52,95,0.28)"} />)}
        </svg>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
          <path d="M7 2.5C9.2 2.5 11.1 3.5 12.4 5L14 3.4C12.3 1.3 9.8 0 7 0S1.7 1.3 0 3.4l1.6 1.6C2.9 3.5 4.8 2.5 7 2.5Z" fill="#00345F" fillOpacity="0.35"/>
          <path d="M7 5.5C8.3 5.5 9.4 6 10.2 6.9L11.8 5.3C10.6 4 8.9 3.2 7 3.2S3.4 4 2.2 5.3l1.6 1.6C4.6 6 5.7 5.5 7 5.5Z" fill="#00345F" fillOpacity="0.65"/>
          <circle cx="7" cy="9" r="1.5" fill="#00345F"/>
        </svg>
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
          <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke="#00345F" strokeOpacity="0.35"/>
          <rect x="2" y="2" width="14" height="8" rx="1.5" fill="#00345F"/>
          <path d="M21.5 4.5v3c.8-.3 1.3-1 1.3-1.5s-.5-1.2-1.3-1.5Z" fill="#00345F" fillOpacity="0.35"/>
        </svg>
      </div>
    </div>
  );
}

function NavBar({
  title,
  subtitle,
  backPage,
  dateBadge,
  badgeMode,
  badgeExpanded,
  onBadgeClick,
}: {
  title: string;
  subtitle?: string;
  backLabel?: string;
  backPage?: string;
  dateBadge?: string;
  badgeMode?: "date" | "freshness";
  badgeExpanded?: boolean;
  onBadgeClick?: () => void;
}) {
  return (
    <GlobalHeader
      dateLabel={dateBadge ?? DEFAULT_GLOBAL_DATE}
      pageTitle={backPage ? title : undefined}
      pageSubtitle={backPage ? subtitle : undefined}
      onBack={backPage ? () => nav(backPage) : undefined}
      badgeMode={badgeMode}
      badgeExpanded={badgeExpanded}
      onBadgeClick={onBadgeClick}
    />
  );
}

function BreadcrumbBar(_props: { crumbs: string[]; period?: string; periodLabel?: string; timeSwitch?: string[] }) {
  return null;
}

function SegCtrl({ options, sel }: { options: string[]; sel: string }) {
  return (
    <ToggleGroup
      type="single"
      value={sel}
      size="sm"
      variant="outline"
      className="mb-2.5 grid w-full grid-cols-[repeat(var(--seg-count),minmax(0,1fr))] rounded-lg bg-muted p-0.5"
      style={{ "--seg-count": options.length } as React.CSSProperties}
    >
      {options.map((o) => (
        <ToggleGroupItem
          key={o}
          value={o}
          aria-label={o}
          className={cn(
            "h-7 rounded-md border-0 text-xs font-normal text-muted-foreground data-[state=on]:bg-card data-[state=on]:font-semibold data-[state=on]:text-foreground data-[state=on]:shadow-[var(--app-shadow-card)]"
          )}
        >
          {o}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function TabCtrl({ options, sel }: { options: string[]; sel: string }) {
  return (
    <Tabs value={sel} className="mb-2.5 gap-0">
      <TabsList className="h-8 w-full justify-start rounded-none border-b border-border bg-transparent p-0">
        {options.map((o) => (
          <TabsTrigger
            key={o}
            value={o}
            className="h-8 flex-none rounded-none border-0 border-b-2 border-transparent bg-transparent px-3 py-1.5 text-[11px] font-normal text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            {o}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}

function getTitleIcon(title?: string): LucideIcon {
  if (!title) return BarChart3;
  if (/风险|逾期|异常|告警|待提升|超标/.test(title)) return AlertTriangle;
  if (/财务|资金|收入|成本|汇率|应收|金额|费用/.test(title)) return CircleDollarSign;
  if (/采购|钢材|集采|供应商|锁价/.test(title)) return PackageCheck;
  if (/质量|合格|RT|PAUT|QC/.test(title)) return ShieldCheck;
  if (/能源|能耗|碳|排放/.test(title)) return Zap;
  if (/生产|在建|交付|完工|在厂|出厂|船坞|泊位|资源/.test(title)) return Factory;
  if (/修船/.test(title)) return Wrench;
  if (/造船|船|航|船舶/.test(title)) return Ship;
  if (/趋势|走势|进度|完成率|对比|分布|结构|排名/.test(title)) return TrendingUp;
  if (/明细|表|清单/.test(title)) return Table2;
  if (/动态|活动|日|周|月/.test(title)) return CalendarClock;
  if (/指标|KPI|经营|概况|速览|洞察|态势/.test(title)) return Gauge;
  if (/项目|任务|计划/.test(title)) return ClipboardList;
  if (/企业|单位/.test(title)) return Landmark;
  if (/雷达|分析/.test(title)) return Activity;
  if (/港|码头/.test(title)) return Anchor;
  return BarChart3;
}

const DETAIL_CARD_TITLES = new Set([
  "在厂艘数排名",
  "修船完工·计划与实绩",
  "在建艘数排名",
  "本周交付",
  "交付进度",
  "月度交付趋势（艘）",
  "各板块交付进度对比",
  "建造阶段总览",
  "企业阶段分布",
  "可用资金",
  "各企业可用资金",
  "市场汇率",
  "美元兑人民币汇率走势",
  "各企业锁价项目分布",
  "各企业锁价项目供应商分布",
  "各企业交付钢板供应商分布",
  "各企业钢板锁价成本差额",
  "采购金额构成",
  "集采率对标管理",
  "质量运营总览",
  "质量活动分享",
  "结构RT/PAUT一次性合规率总览",
  "企业结构RT/PAUT一次性合规率表现",
  "报验一次合规率总览",
  "企业报验一次合规率表现",
  "能效趋势",
  "年累计万元产值综合能耗排名",
]);

function Card({ title, titleMeta, tag, extra, onExtra, noPad = false, className, children }: { title?: string; titleMeta?: string; tag?: string; extra?: React.ReactNode; onExtra?: () => void; noPad?: boolean; className?: string; children: React.ReactNode }) {
  const isDataTableCard = typeof title === "string" && /明细|排名/.test(title);
  const isDrilldownCard = Boolean(onExtra) || (typeof title === "string" && DETAIL_CARD_TITLES.has(title));
  const TitleIcon = getTitleIcon(title);
  return (
    <UICard className={cn("app-dashboard-card mx-[10px] mb-2 gap-0 overflow-hidden py-0", isDrilldownCard && "app-detail-entry-card", className)}>
      {title && (
        <CardHeader className="app-card-header grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-2.5 py-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="app-title-icon">
              <TitleIcon size={14} strokeWidth={2} />
            </span>
            <CardTitle className="app-card-title min-w-0 truncate font-semibold tracking-tight text-foreground">{title}</CardTitle>
            {titleMeta && <span className="app-card-title-meta">{titleMeta}</span>}
            {tag && <StatusBadge tone="primary">{tag}</StatusBadge>}
          </div>
          {extra && (
            <CardAction>
              {onExtra ? (
                <button type="button" onClick={onExtra} className="app-drilldown-link">
                  {extra} <ChevronRight size={13} strokeWidth={2.3} />
                </button>
              ) : typeof extra === "string" ? (
                <span className="app-card-meta">{extra}</span>
              ) : (
                extra
              )}
            </CardAction>
          )}
        </CardHeader>
      )}
      <CardContent className={noPad ? "p-0" : "px-2.5 py-2"}>
        {isDataTableCard ? <DataTableCard>{children}</DataTableCard> : children}
      </CardContent>
    </UICard>
  );
}

function Grid3({ items }: { items: { label: string; value: string; unit?: string }[] }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {items.map((it, i) => (
        <KpiCard key={i} label={it.label} value={it.value} unit={it.unit} className="text-center" />
      ))}
    </div>
  );
}

function ChartBox({ label, h = 96 }: { label: string; h?: number }) {
  return (
    <ChartPanel height={h}>
      <span className="text-[10px] text-muted-foreground">[ {label} ]</span>
    </ChartPanel>
  );
}

function RadarMetricCard({
  icon,
  name,
  eng,
  pct,
  amt,
  status,
  side = "left",
}: {
  icon: React.ReactNode;
  name: string;
  eng: string;
  pct: string;
  amt: string;
  status: string;
  side?: "left" | "right";
}) {
  const displayStatus = eng === "Offshore" ? "稳定" : status === "正常" ? "良好" : status;
  const statusTone = displayStatus === "稳定" ? "stable" : "good";
  return (
    <div className="radar-metric-card" data-side={side}>
      <div className="radar-metric-visual">{icon}</div>
      <div className="radar-metric-copy">
        <div className="radar-metric-name">{name}</div>
        <div className="radar-metric-amt">{amt}</div>
      </div>
      <div className="radar-metric-value">{pct}</div>
      <div className="radar-metric-status" data-tone={statusTone}>
        <span />
        {displayStatus}
      </div>
    </div>
  );
}

function OperationalRadarCore() {
  const cx = 66;
  const cy = 66;
  const r = 48;
  const points = [
    [0.86, -90],
    [0.78, 0],
    [0.90, 90],
    [0.72, 180],
  ];
  const pointString = points.map(([pct, deg]) => {
    const rad = (Number(deg) * Math.PI) / 180;
    return `${cx + r * Number(pct) * Math.cos(rad)},${cy + r * Number(pct) * Math.sin(rad)}`;
  }).join(" ");

  return (
    <div className="biz-radar-core">
      <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden="true">
        <defs>
          <radialGradient id="radarFill" cx="50%" cy="50%" r="58%">
            <stop offset="0%" stopColor={C.chart[1]} stopOpacity="0.10" />
            <stop offset="100%" stopColor={C.brand} stopOpacity="0.28" />
          </radialGradient>
          <filter id="radarGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {[18, 30, 42, 54, 62].map((radius) => (
          <circle key={radius} cx={cx} cy={cy} r={radius} fill="none" stroke="rgba(0,80,142,0.08)" strokeWidth="1" />
        ))}
        {[0, 45, 90, 135].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <line
              key={deg}
              x1={cx - 62 * Math.cos(rad)}
              y1={cy - 62 * Math.sin(rad)}
              x2={cx + 62 * Math.cos(rad)}
              y2={cy + 62 * Math.sin(rad)}
              stroke="rgba(47,127,234,0.12)"
              strokeWidth="1"
            />
          );
        })}
        {[0, 90, 180, 270].map((deg) => {
          const dash = 54;
          const gap = 26;
          return (
            <circle
              key={deg}
              cx={cx}
              cy={cy}
              r="56"
              fill="none"
              stroke={C.brand}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={deg}
              filter="url(#radarGlow)"
              opacity="0.95"
            />
          );
        })}
        <polygon points={pointString} fill="url(#radarFill)" stroke={C.brand} strokeWidth="1.6" />
        {points.map(([pct, deg]) => {
          const rad = (Number(deg) * Math.PI) / 180;
          return <circle key={deg} cx={cx + r * Number(pct) * Math.cos(rad)} cy={cy + r * Number(pct) * Math.sin(rad)} r="3.6" fill={C.brand} stroke="#fff" strokeWidth="1.2" />;
        })}
        <circle cx={cx} cy={cy} r="23" fill="#fff" stroke="rgba(0,80,142,0.08)" strokeWidth="1" />
        <text x={cx} y={cy - 3} textAnchor="middle" fontSize="10" fontWeight="800" fill="#00508E">COSCO</text>
        <text x={cx} y={cy + 9} textAnchor="middle" fontSize="6" fontWeight="700" fill="#00508E">SHIPPING</text>
        <circle cx={cx} cy="10" r="2.5" fill={C.brand} />
        <circle cx="122" cy={cy} r="2.5" fill={C.brand} />
        <circle cx={cx} cy="122" r="2.5" fill={C.brand} />
        <circle cx="10" cy={cy} r="2.5" fill={C.brand} />
      </svg>
    </div>
  );
}

function DonutBox({ label, center }: { label: string; center?: string }) {
  const lines = center ? center.split("\n") : [];
  const segs = [
    { pct: 47, color: C.brand },
    { pct: 32, color: C.chart[1] },
    { pct: 21, color: C.success },
  ];
  const cx = 52, cy = 52, r = 36, sw = 10;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col items-center py-1">
      <svg width={104} height={104} viewBox="0 0 104 104" style={{ display: "block" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={`${C.brand}18`} strokeWidth={sw} />
        {segs.map((s, i) => {
          const dash = (s.pct / 100) * circ;
          const off = -offset;
          offset += dash;
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={sw}
            strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ / 4 + off} strokeLinecap="round" />;
        })}
        {lines[0] && <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill={C.brand}>{lines[0]}</text>}
        {lines[1] && <text x={cx} y={cy + 11} textAnchor="middle" fontSize="9" fill={C.t3}>{lines[1]}</text>}
      </svg>
    </div>
  );
}

function BarRow({ label, value, maxVal, suffix = "" }: { label: string; value: number; maxVal: number; suffix?: string }) {
  const pct = Math.round((value / maxVal) * 100);
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <span className="text-[11px] text-foreground/70 w-[72px] shrink-0 truncate">{label}</span>
      <Progress value={pct} className="flex-1 h-1.5 bg-primary/10" />
      <span className="text-[12px] font-bold text-foreground w-9 text-right tabular-nums tracking-tight">{value}{suffix}</span>
    </div>
  );
}

function AlertRow({ cat, text, pri, link, onClick }: { cat: string; text: string; pri: string; link: string; onClick?: () => void }) {
  const tone = pri === "高优先级" ? "danger" : pri === "中优先级" ? "warning" : "muted";
  return <RiskListItem category={cat} text={text} priority={pri} tone={tone} onClick={onClick} />;
}

function MatrixHeader({ cols }: { cols: string[] }) {
  return (
    <div className="pb-1 border-b border-border mb-1" style={{ display: "grid", gridTemplateColumns: `80px repeat(${cols.length}, 1fr)` }}>
      <span />
      {cols.map((c) => <span key={c} className="text-[10px] text-muted-foreground text-center">{c}</span>)}
    </div>
  );
}

function MatrixRow({ label, vals }: { label: string; vals: string[] }) {
  return (
    <div className="py-1 border-b border-border" style={{ display: "grid", gridTemplateColumns: `80px repeat(${vals.length}, 1fr)` }}>
      <span className="text-[12px] text-foreground/70 font-medium">{label}</span>
      {vals.map((v, i) => <span key={i} className="text-[12px] text-foreground font-semibold text-center tabular-nums">{v}</span>)}
    </div>
  );
}

function TRow({ cells, head = false }: { cells: string[]; head?: boolean }) {
  return (
    <div className={cn("app-table-row", head && "app-table-row-head")}>
      {cells.map((c, i) => (
        <div key={i} className={cn(
          "app-table-cell",
          i === 0 ? "flex-[1.4] text-left" : "flex-1 text-center",
          !head && (i === 0 ? "font-medium" : "text-foreground/70"),
        )}>{c}</div>
      ))}
    </div>
  );
}

function Footer({ text }: { text: string }) {
  return (
    <div className="px-2.5 pt-2.5 pb-7 text-center">
      <div className="h-px bg-border mb-3" />
      <span className="text-[9px] text-muted-foreground tracking-wide">{text}</span>
    </div>
  );
}

function KpiScrollGroup({ cards, activeIdx = 0 }: { cards: { title: string; items: { k: string; v: string }[] }[]; activeIdx?: number }) {
  return (
    <div className="flex gap-2 px-2.5 pb-0.5 overflow-x-auto" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
      {cards.map((card, i) => (
        <div key={i} className={cn(
          "shrink-0 w-[152px] bg-card rounded-xl p-3 relative overflow-hidden",
          i === activeIdx ? "border-[1.5px] border-primary shadow-sm" : "border border-border shadow-[var(--app-shadow-card)]"
        )}>
          {i === activeIdx && <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />}
          <div className={cn("text-[11px] font-semibold mb-2 tracking-tight", i === activeIdx ? "text-primary" : "text-muted-foreground")}>{card.title}</div>
          {card.items.map((it, j) => (
            <div key={j} className="flex justify-between items-baseline mb-1.5">
              <span className="text-[10px] text-muted-foreground">{it.k}</span>
              <span className="text-[13px] font-bold text-foreground tabular-nums tracking-tight">{it.v}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── 2.5D 频道图标 SVG（灰阶等距风格） ── */
function IconShip() { /* 经营：货轮 */
  return (
    <svg width="52" height="48" viewBox="0 0 52 48" fill="none">
      {/* 水面倒影 */}
      <ellipse cx="26" cy="44" rx="20" ry="3" fill="#E8E8E8" opacity="0.6"/>
      {/* 船体侧面（深） */}
      <path d="M6 32 L46 32 L42 42 L10 42 Z" fill="#C8C8C8"/>
      {/* 船体顶面（浅） */}
      <path d="M8 28 L44 28 L46 32 L6 32 Z" fill="#E0E0E0"/>
      {/* 船舱主体侧 */}
      <rect x="14" y="18" width="24" height="10" fill="#BFBFBF"/>
      {/* 船舱主体顶 */}
      <path d="M14 14 L38 14 L38 18 L14 18 Z" fill="#D8D8D8"/>
      {/* 驾驶台侧 */}
      <rect x="20" y="10" width="12" height="8" fill="#AFAFAF"/>
      {/* 驾驶台顶 */}
      <path d="M20 7 L32 7 L32 10 L20 10 Z" fill="#CFCFCF"/>
      {/* 烟囱 */}
      <rect x="28" y="4" width="5" height="6" fill="#A0A0A0"/>
      <path d="M28 3 L33 3 L33 4 L28 4 Z" fill="#BFBFBF"/>
      {/* 甲板栏杆线 */}
      <line x1="8" y1="28" x2="44" y2="28" stroke="#A0A0A0" strokeWidth="0.8"/>
      {/* 船窗 */}
      <circle cx="17" cy="22" r="1.5" fill="#E8E8E8"/>
      <circle cx="22" cy="22" r="1.5" fill="#E8E8E8"/>
      {/* 左侧高光 */}
      <path d="M8 28 L14 18 L14 22 L9 30 Z" fill="rgba(255,255,255,0.3)"/>
    </svg>
  );
}

function IconFinance() { /* 财务：带吊机的船/港口 */
  return (
    <svg width="52" height="48" viewBox="0 0 52 48" fill="none">
      <ellipse cx="26" cy="44" rx="18" ry="2.5" fill="#E8E8E8" opacity="0.6"/>
      {/* 底座侧 */}
      <path d="M8 36 L44 36 L44 42 L8 42 Z" fill="#C0C0C0"/>
      {/* 底座顶 */}
      <path d="M6 32 L46 32 L44 36 L8 36 Z" fill="#D8D8D8"/>
      {/* 主楼侧 */}
      <rect x="14" y="16" width="16" height="16" fill="#B8B8B8"/>
      {/* 主楼顶 */}
      <path d="M12 12 L32 12 L30 16 L14 16 Z" fill="#D0D0D0"/>
      {/* 吊塔竖杆 */}
      <rect x="33" y="8" width="4" height="24" fill="#ADADAD"/>
      {/* 吊臂 */}
      <rect x="22" y="8" width="15" height="3" fill="#C8C8C8"/>
      {/* 吊绳 */}
      <line x1="30" y1="11" x2="30" y2="22" stroke="#A0A0A0" strokeWidth="1"/>
      {/* 吊钩 */}
      <path d="M28 22 Q30 24 32 22" stroke="#A0A0A0" strokeWidth="1.2" fill="none"/>
      {/* 窗格 */}
      <rect x="16" y="19" width="5" height="5" fill="#D8D8D8"/>
      <rect x="23" y="19" width="5" height="5" fill="#D8D8D8"/>
      <rect x="16" y="26" width="5" height="4" fill="#D8D8D8"/>
      <rect x="23" y="26" width="5" height="4" fill="#D8D8D8"/>
      <path d="M12 12 L14 16 L14 20 L13 18 Z" fill="rgba(255,255,255,0.25)"/>
    </svg>
  );
}

function IconProduction() { /* 生产：海上钻井平台 */
  return (
    <svg width="52" height="48" viewBox="0 0 52 48" fill="none">
      <ellipse cx="26" cy="44" rx="19" ry="2.5" fill="#E8E8E8" opacity="0.6"/>
      {/* 平台底侧 */}
      <path d="M7 34 L45 34 L45 40 L7 40 Z" fill="#BEBEBE"/>
      {/* 平台顶面 */}
      <path d="M5 30 L47 30 L45 34 L7 34 Z" fill="#D4D4D4"/>
      {/* 支腿 */}
      <rect x="10" y="34" width="4" height="8" fill="#A8A8A8"/>
      <rect x="22" y="34" width="4" height="8" fill="#A8A8A8"/>
      <rect x="34" y="34" width="4" height="8" fill="#A8A8A8"/>
      {/* 钻塔主框架 */}
      <path d="M21 8 L31 8 L33 30 L19 30 Z" fill="#C0C0C0"/>
      {/* 钻塔顶面 */}
      <path d="M19 6 L33 6 L31 8 L21 8 Z" fill="#D8D8D8"/>
      {/* 钻塔斜撑 */}
      <line x1="21" y1="12" x2="33" y2="20" stroke="#A8A8A8" strokeWidth="1"/>
      <line x1="33" y1="12" x2="21" y2="20" stroke="#A8A8A8" strokeWidth="1"/>
      <line x1="21" y1="20" x2="33" y2="28" stroke="#A8A8A8" strokeWidth="1"/>
      <line x1="33" y1="20" x2="21" y2="28" stroke="#A8A8A8" strokeWidth="1"/>
      {/* 顶部尖 */}
      <path d="M23 4 L26 0 L29 4 Z" fill="#B0B0B0"/>
      {/* 设备房侧 */}
      <rect x="12" y="22" width="8" height="8" fill="#ABABAB"/>
      <path d="M10 19 L22 19 L20 22 L12 22 Z" fill="#C8C8C8"/>
      <path d="M5 30 L7 34 L7 36 L6 33 Z" fill="rgba(255,255,255,0.25)"/>
    </svg>
  );
}

function IconProcurement() { /* 采购：齿轮 */
  return (
    <svg width="52" height="48" viewBox="0 0 52 48" fill="none">
      <ellipse cx="26" cy="44" rx="14" ry="2" fill="#E8E8E8" opacity="0.6"/>
      {/* 齿轮侧面厚度（伪等距） */}
      <path d="M12 28 Q12 42 26 43 Q40 42 40 28 L40 26 Q40 40 26 41 Q12 40 12 26 Z" fill="#BEBEBE"/>
      {/* 齿轮主体 */}
      <circle cx="26" cy="24" r="13" fill="#D0D0D0"/>
      <circle cx="26" cy="24" r="8" fill="#E8E8E8"/>
      <circle cx="26" cy="24" r="4" fill="#C8C8C8"/>
      {/* 齿牙（8个） */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI * 2) / 8;
        const x = 26 + Math.cos(angle) * 13;
        const y = 24 + Math.sin(angle) * 13;
        const x2 = 26 + Math.cos(angle) * 16;
        const y2 = 24 + Math.sin(angle) * 16;
        return (
          <line key={i} x1={x} y1={y} x2={x2} y2={y2} stroke="#ADADAD" strokeWidth="3.5" strokeLinecap="round"/>
        );
      })}
      {/* 中心孔高光 */}
      <circle cx="25" cy="23" r="1.5" fill="rgba(255,255,255,0.5)"/>
      {/* 顶面高光弧 */}
      <path d="M15 18 Q20 14 30 16" stroke="rgba(255,255,255,0.5)" strokeWidth="2" fill="none"/>
    </svg>
  );
}

function IconQuality() { /* 质量：3D柱状图+金币 */
  return (
    <svg width="52" height="48" viewBox="0 0 52 48" fill="none">
      <ellipse cx="26" cy="44" rx="17" ry="2.5" fill="#E8E8E8" opacity="0.6"/>
      {/* 底部平台 */}
      <path d="M8 38 L44 38 L44 42 L8 42 Z" fill="#C0C0C0"/>
      <path d="M6 35 L46 35 L44 38 L8 38 Z" fill="#D4D4D4"/>
      {/* 柱1（低） */}
      <rect x="11" y="26" width="8" height="9" fill="#B8B8B8"/>
      <path d="M9 23 L21 23 L19 26 L11 26 Z" fill="#D0D0D0"/>
      {/* 柱2（中） */}
      <rect x="22" y="18" width="8" height="17" fill="#ADADAD"/>
      <path d="M20 15 L32 15 L30 18 L22 18 Z" fill="#C8C8C8"/>
      {/* 柱3（高） */}
      <rect x="33" y="10" width="8" height="25" fill="#A5A5A5"/>
      <path d="M31 7 L43 7 L41 10 L33 10 Z" fill="#C0C0C0"/>
      {/* 金币（堆叠等距圆柱） */}
      <ellipse cx="15" cy="23" rx="5" ry="2" fill="#D8D8D8"/>
      <path d="M10 23 L10 26 Q10 28 15 28 Q20 28 20 26 L20 23" fill="#C4C4C4"/>
      <ellipse cx="15" cy="23" rx="5" ry="2" fill="#E0E0E0"/>
      {/* 高光 */}
      <path d="M9 35 L11 26 L11 28 L9.5 37 Z" fill="rgba(255,255,255,0.2)"/>
    </svg>
  );
}

function IconEnergy() { /* 能源：盾牌+星形 */
  return (
    <svg width="52" height="48" viewBox="0 0 52 48" fill="none">
      <ellipse cx="26" cy="44" rx="13" ry="2" fill="#E8E8E8" opacity="0.6"/>
      {/* 盾牌侧面厚度 */}
      <path d="M13 36 Q13 43 26 44 Q39 43 39 36 L39 34 Q39 41 26 42 Q13 41 13 34 Z" fill="#BEBEBE"/>
      {/* 盾牌主体 */}
      <path d="M26 6 L40 12 L40 28 Q40 40 26 44 Q12 40 12 28 L12 12 Z" fill="#D0D0D0"/>
      {/* 盾牌内面（浅） */}
      <path d="M26 10 L37 15 L37 27 Q37 37 26 40 Q15 37 15 27 L15 15 Z" fill="#E0E0E0"/>
      {/* 五角星 */}
      <path d="M26 16 L27.5 21 L33 21 L28.5 24.5 L30 29.5 L26 26.5 L22 29.5 L23.5 24.5 L19 21 L24.5 21 Z" fill="#BFBFBF"/>
      {/* 星高光 */}
      <path d="M26 16 L27.5 21 L24.5 21 Z" fill="rgba(255,255,255,0.4)"/>
      {/* 盾牌左侧高光 */}
      <path d="M12 12 L15 15 L15 22 L13 20 Z" fill="rgba(255,255,255,0.3)"/>
      {/* 盾顶光 */}
      <path d="M20 10 Q26 7 32 10 L26 6 Z" fill="rgba(255,255,255,0.2)"/>
    </svg>
  );
}

const CHANNEL_ICONS: Record<string, () => JSX.Element> = {
  "经营": IconShip,
  "财务": IconFinance,
  "生产": IconProduction,
  "采购": IconProcurement,
  "质量": IconQuality,
  "能源": IconEnergy,
};

const CHANNEL_NAV: Record<string, string> = {
  "经营": "biz",
  "财务": "finance",
  "生产": "prod-repair",
  "采购": "purchase-group",
  "质量": "quality",
  "能源": "energy",
};

function ChannelBizIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="chBizHull" x1="8" y1="12" x2="40" y2="38">
          <stop stopColor="#00508E" />
          <stop offset="1" stopColor="#003F72" />
        </linearGradient>
        <linearGradient id="chBizDeck" x1="16" y1="7" x2="34" y2="26">
          <stop stopColor="#79BBFF" />
          <stop offset="1" stopColor="#00508E" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="41" rx="16" ry="3.2" fill="#00508E" opacity=".14" />
      <path d="M7 29h34l-5.2 9.2H13.2L7 29Z" fill="url(#chBizHull)" />
      <path d="M10 24h28.5L41 29H7l3-5Z" fill="#79BBFF" />
      <path d="M17 14h17v10H17z" fill="url(#chBizDeck)" />
      <path d="M21 8h9v6h-9z" fill="#00508E" opacity=".9" />
      <path d="M31 6h4v18h-4z" fill="#0B69C7" />
      <circle cx="18" cy="29" r="1.8" fill="#fff" opacity=".85" />
      <circle cx="25" cy="29" r="1.8" fill="#fff" opacity=".85" />
      <path d="M10 24h8l-5 8H8.5L10 24Z" fill="#fff" opacity=".28" />
    </svg>
  );
}

function ChannelFinanceIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="chFinanceBag" x1="13" y1="7" x2="36" y2="40">
          <stop stopColor="#00508E" />
          <stop offset="1" stopColor="#003F72" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="41" rx="13" ry="3" fill="#9A5A00" opacity=".14" />
      <path d="M15 16h18.5A4.5 4.5 0 0 1 38 20.5V36a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V21a5 5 0 0 1 5-5Z" fill="url(#chFinanceBag)" />
      <path d="M18 16v-2.5C18 9.9 20.9 7 24.5 7S31 9.9 31 13.5V16h-4v-2.4c0-1.5-1-2.6-2.5-2.6S22 12.1 22 13.6V16h-4Z" fill="#E6A23C" />
      <path d="M16 20h18.5c1.8 0 3.2 1.2 3.5 2.8V20.5A4.5 4.5 0 0 0 33.5 16H15a5 5 0 0 0-5 5v2.2c1-2 2.9-3.2 6-3.2Z" fill="#fff" opacity=".22" />
      <path d="M24 21v13M19.5 25.5h9M20.5 30.5h8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

function ChannelProductionIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="chProd" x1="8" y1="9" x2="39" y2="39">
          <stop stopColor="#00508E" />
          <stop offset="1" stopColor="#003F72" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="41" rx="15" ry="3" fill="#007A55" opacity=".14" />
      <path d="M8 36V20l9 6v-7l9 7v-8l14 9v9a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4Z" fill="url(#chProd)" />
      <path d="M11 22v-8h7v12l-7-4Z" fill="#67C23A" />
      <path d="M15 31h5M25 31h5M34 31h3M15 35h5M25 35h5M34 35h3" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".88" />
      <path d="M8 20l9 6v3l-9-5v-4Z" fill="#fff" opacity=".22" />
    </svg>
  );
}

function ChannelProcurementIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="chProcA" x1="10" y1="13" x2="36" y2="39">
          <stop stopColor="#00508E" />
          <stop offset="1" stopColor="#003F72" />
        </linearGradient>
        <linearGradient id="chProcB" x1="22" y1="8" x2="40" y2="33">
          <stop stopColor="#79BBFF" />
          <stop offset="1" stopColor="#00508E" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="41" rx="15" ry="3" fill="#006D8E" opacity=".14" />
      <path d="M10 19h20v18H10z" fill="url(#chProcA)" />
      <path d="M30 15h9v18l-9 4V19Z" fill="url(#chProcB)" />
      <path d="M10 19l10-6 19 2-9 4H10Z" fill="#9FCEFF" />
      <path d="M15 24h10M15 29h10M15 34h7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" opacity=".8" />
      <path d="M31 20l7-3v5l-7 3v-5Z" fill="#fff" opacity=".24" />
    </svg>
  );
}

function ChannelQualityIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="chQuality" x1="12" y1="7" x2="36" y2="41">
          <stop stopColor="#00508E" />
          <stop offset="1" stopColor="#003F72" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="41" rx="13" ry="3" fill="#1B3AA8" opacity=".14" />
      <path d="M24 6 38 12v12c0 8-5.3 14.2-14 18-8.7-3.8-14-10-14-18V12L24 6Z" fill="url(#chQuality)" />
      <path d="M24 10 34 14.4v9.2c0 6-3.6 10.8-10 14-6.4-3.2-10-8-10-14v-9.2L24 10Z" fill="#fff" opacity=".16" />
      <path d="m17 24 4.4 4.5L31.5 18" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 14 24 9v6l-10 4v-5Z" fill="#fff" opacity=".22" />
    </svg>
  );
}

function ChannelEnergyIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="chEnergy" x1="12" y1="6" x2="36" y2="41">
          <stop stopColor="#00508E" />
          <stop offset=".52" stopColor="#004B86" />
          <stop offset="1" stopColor="#003F72" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="41" rx="12" ry="3" fill="#007A55" opacity=".14" />
      <path d="M27 5 13 26h10l-3 17 15-23H25l2-15Z" fill="url(#chEnergy)" />
      <path d="M27 5 17 24h8l-2 12 12-16H25l2-15Z" fill="#fff" opacity=".22" />
      <path d="M29 13c4 1.5 7 5.3 7 10 0 5.9-4.8 10.7-10.7 10.7" stroke="#67C23A" strokeWidth="2" strokeLinecap="round" opacity=".82" />
    </svg>
  );
}

function CoreResourceIcon({ type }: { type: "factory" | "dock" | "berth" }) {
  const gradientId = `coreResourceBlue-${type}`;
  const lightGradientId = `coreResourceLight-${type}`;

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="8" y1="8" x2="40" y2="40">
          <stop stopColor="#0B69C7" />
          <stop offset="1" stopColor="#003F72" />
        </linearGradient>
        <linearGradient id={lightGradientId} x1="14" y1="10" x2="37" y2="36">
          <stop stopColor="#C6E2FF" />
          <stop offset="1" stopColor="#79BBFF" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="41" rx="15" ry="3" fill="#00508E" opacity=".14" />
      {type === "factory" && (
        <>
          <path d="M7 36V21l9 5v-7l9 7v-8l16 9v9a4 4 0 0 1-4 4H11a4 4 0 0 1-4-4Z" fill={`url(#${gradientId})`} />
          <path d="M10 23V12h7v14l-7-3Z" fill="#67C23A" />
          <path d="M15 31h5M25 31h5M35 31h2M15 35h5M25 35h5M35 35h2" stroke="#fff" strokeWidth="2.1" strokeLinecap="round" opacity=".9" />
          <path d="M7 21l9 5v3l-9-4v-4Z" fill="#fff" opacity=".24" />
        </>
      )}
      {type === "dock" && (
        <>
          <path d="M7 17h7l3 20h14l3-20h7l-4 23H11L7 17Z" fill={`url(#${gradientId})`} />
          <path d="M14 29h20l-4 8H18l-4-8Z" fill={`url(#${lightGradientId})`} />
          <path d="M18 25h12l3 4H15l3-4Z" fill="#E6A23C" />
          <path d="M21 17h8v8h-8zM23 12h4v5h-4z" fill={`url(#${lightGradientId})`} />
          <path d="M10 18h4l2 15" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity=".42" />
          <circle cx="21" cy="29" r="1.4" fill="#fff" opacity=".9" />
          <circle cx="27" cy="29" r="1.4" fill="#fff" opacity=".9" />
        </>
      )}
      {type === "berth" && (
        <>
          <path d="M6 34h36v6H6z" fill={`url(#${gradientId})`} />
          <path d="m9 34 7-18h16l7 18H9Z" fill={`url(#${lightGradientId})`} />
          <path d="M15 27h18l-3.5 7h-11L15 27Z" fill={`url(#${gradientId})`} />
          <path d="M19 20h10v7H19zM22 15h4v5h-4z" fill="#00508E" />
          <path d="M12 34 17 18M36 34l-5-16" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" opacity=".55" />
          <path d="M8 37h32" stroke="#67C23A" strokeWidth="2" strokeLinecap="round" />
          <circle cx="21" cy="27" r="1.4" fill="#fff" opacity=".9" />
          <circle cx="27" cy="27" r="1.4" fill="#fff" opacity=".9" />
        </>
      )}
    </svg>
  );
}

function BusinessShipbuildingIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bizShipBuildHull" x1="7" y1="15" x2="40" y2="39">
          <stop stopColor="#0B69C7" />
          <stop offset="1" stopColor="#003F72" />
        </linearGradient>
        <linearGradient id="bizShipBuildCabin" x1="16" y1="7" x2="34" y2="26">
          <stop stopColor="#C6E2FF" />
          <stop offset="1" stopColor="#00508E" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="41" rx="16" ry="3.2" fill="#00508E" opacity=".14" />
      <path d="M7 30h34l-5.5 8.5H13L7 30Z" fill="url(#bizShipBuildHull)" />
      <path d="M11 25h27l3 5H7l4-5Z" fill="#79BBFF" />
      <path d="M17 14h18v11H17z" fill="url(#bizShipBuildCabin)" />
      <path d="M21 8h4v6h-4zM27 8h4v6h-4z" fill="#00508E" />
      <path d="M14 25h10l-6 9h-6l2-9Z" fill="#fff" opacity=".24" />
      <circle cx="18" cy="30" r="1.7" fill="#fff" opacity=".88" />
      <circle cx="25" cy="30" r="1.7" fill="#fff" opacity=".88" />
      <path d="M35 10v13M31 14h8" stroke="#67C23A" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function BusinessRepairIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bizRepairHull" x1="9" y1="18" x2="40" y2="40">
          <stop stopColor="#0B69C7" />
          <stop offset="1" stopColor="#003F72" />
        </linearGradient>
        <linearGradient id="bizRepairCrane" x1="22" y1="7" x2="39" y2="31">
          <stop stopColor="#C6E2FF" />
          <stop offset="1" stopColor="#00508E" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="41" rx="15" ry="3" fill="#00508E" opacity=".14" />
      <path d="M8 30h31l-5 8H13L8 30Z" fill="url(#bizRepairHull)" />
      <path d="M12 25h25l2 5H8l4-5Z" fill="#9FCEFF" />
      <path d="M24 12h13v4H24zM35 12h3v18h-3z" fill="url(#bizRepairCrane)" />
      <path d="M27 16l8 7M35 16l-7 7" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" opacity=".72" />
      <path d="M18 10l4 4-9 9-4-4 9-9Z" fill="#E6A23C" />
      <path d="M11 21l4 4-3 3-4-4 3-3Z" fill="#00508E" />
      <path d="M13 25h8l-5 7h-5l2-7Z" fill="#fff" opacity=".24" />
    </svg>
  );
}

function BusinessOffshoreIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bizOffshoreBase" x1="10" y1="18" x2="39" y2="41">
          <stop stopColor="#0B69C7" />
          <stop offset="1" stopColor="#003F72" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="42" rx="15" ry="3" fill="#00508E" opacity=".14" />
      <path d="M13 34h22l3 5H10l3-5Z" fill="url(#bizOffshoreBase)" />
      <path d="M17 16h14l4 18H13l4-18Z" fill="#00508E" />
      <path d="M20 9h8l3 7H17l3-7Z" fill="#79BBFF" />
      <path d="M20 16l-5 18M28 16l5 18M18 25h12M16 30h16" stroke="#C6E2FF" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M31 11h7v3h-7zM37 11h2v20h-2z" fill="#67C23A" />
      <path d="M18 16h14l-3 5H16l2-5Z" fill="#fff" opacity=".22" />
    </svg>
  );
}

function BusinessSupportIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="bizSupportBox" x1="10" y1="15" x2="36" y2="40">
          <stop stopColor="#0B69C7" />
          <stop offset="1" stopColor="#003F72" />
        </linearGradient>
        <linearGradient id="bizSupportSide" x1="30" y1="12" x2="40" y2="36">
          <stop stopColor="#9FCEFF" />
          <stop offset="1" stopColor="#00508E" />
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="41" rx="15" ry="3" fill="#00508E" opacity=".14" />
      <path d="M10 20h22v17H10z" fill="url(#bizSupportBox)" />
      <path d="M32 16l8 4v17l-8-4V16Z" fill="url(#bizSupportSide)" />
      <path d="M10 20l10-6 20 2-8 4H10Z" fill="#C6E2FF" />
      <path d="M15 25h12M15 30h12M15 35h8" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity=".82" />
      <path d="M34 21l5-2v5l-5 2v-5Z" fill="#fff" opacity=".24" />
      <path d="M36 8v7M32 11h8" stroke="#E6A23C" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

const CHANNEL_SERVICE_ICONS: Record<string, () => JSX.Element> = {
  "经营": ChannelBizIcon,
  "财务": ChannelFinanceIcon,
  "生产": ChannelProductionIcon,
  "采购": ChannelProcurementIcon,
  "质量": ChannelQualityIcon,
  "能源": ChannelEnergyIcon,
};

function ChannelBar({ items, active }: { items: string[]; active: string }) {
  return (
    <div className="home-channel-shell shrink-0">
      <div className="home-channel-grid">
        {items.map((it) => {
          const Icon = CHANNEL_SERVICE_ICONS[it];
          return (
            <div key={it} onClick={() => { if (CHANNEL_NAV[it]) nav(CHANNEL_NAV[it]); }}
              className="home-channel-item cursor-pointer select-none">
              <div className="home-channel-icon transition-all duration-150">
                {Icon && <Icon />}
              </div>
              <span className="home-channel-label transition-colors">{it}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-px bg-border mx-2.5" />;
}

function SectionTitle({ text }: { text: string }) {
  return <SectionHeader title={<span className="text-primary uppercase tracking-widest">{text}</span>} icon={<LineChart size={14} strokeWidth={2} />} />;
}

function InlineTag({ text }: { text: string }) {
  return <StatusBadge tone="info" className="ml-1.5">{text}</StatusBadge>;
}

function HScrollCards({ cards }: { cards: { icon: string; title: string; count: string }[] }) {
  return (
    <div className="overflow-x-auto flex gap-2 px-2.5 pb-0.5" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
      {cards.map((c, i) => (
        <div key={i} className="shrink-0 w-[102px] bg-card rounded-xl border border-border text-center p-2.5 shadow-[var(--app-shadow-card)]">
          <div className="text-lg mb-0.5">{c.icon}</div>
          <div className="text-[10px] text-muted-foreground mb-1 leading-[13px]">{c.title}</div>
          <div className="text-[17px] font-bold text-foreground tabular-nums leading-none">{c.count}</div>
          <div className="text-[9px] text-muted-foreground">项</div>
        </div>
      ))}
    </div>
  );
}

/* 通用卡片菱形图标（品牌蓝等距三面小正方体） */
function CardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M11 2 L20 7 L11 12 L2 7 Z" fill={C.chart[1]}/>
      <path d="M2 7 L11 12 L11 20 L2 15 Z" fill="#00508E"/>
      <path d="M11 12 L20 7 L20 15 L11 20 Z" fill="#00467C"/>
      <path d="M6 4.5 Q11 2.5 16 4.5 L11 2 Z" fill="rgba(255,255,255,0.35)"/>
    </svg>
  );
}

function BizKpiProgressCard() {
  const rows = [
    { label: "新接", n: "8",  nu: "艘", dwt: "95",  dwtu: "万DWT", amt: "62",  amtu: "亿" },
    { label: "在手", n: "72", nu: "艘", dwt: "860", dwtu: "万DWT", amt: "520", amtu: "亿" },
    { label: "交付", n: "6",  nu: "艘", dwt: "78",  dwtu: "万DWT", amt: "45",  amtu: "亿" },
  ];

  return (
    <div
      onClick={() => nav("biz-kpi-progress")}
      style={{
        background: C.card,
        borderRadius: 12,
        boxShadow: "var(--app-shadow-card)",
        margin: "10px 10px 8px",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <div style={{ padding: "9px 14px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.divider}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CardIcon />
          <span style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>指标进度</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr 1fr", padding: "7px 14px 5px", borderBottom: `1px solid ${C.divider}` }}>
        <span />
        {["订单艘数", "万载重吨", "金额"].map((heading) => (
          <span key={heading} style={{ fontSize: 11, color: C.t3, textAlign: "center" }}>{heading}</span>
        ))}
      </div>
      {rows.map((row, index) => (
        <div
          key={row.label}
          style={{
            display: "grid",
            gridTemplateColumns: "56px 1fr 1fr 1fr",
            padding: "8px 14px",
            borderBottom: index < rows.length - 1 ? `1px solid ${C.divider}` : "none",
            alignItems: "center",
          }}
        >
          <button type="button" className="home-progress-link" onClick={(event) => { event.stopPropagation(); nav("biz-kpi-progress"); }}>
            {row.label}<ChevronRight size={12} strokeWidth={2.4} />
          </button>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{row.n}</span>
            <span style={{ fontSize: 11, color: C.t3 }}>{row.nu}</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{row.dwt}</span>
            <span style={{ fontSize: 10, color: C.t3 }}>{row.dwtu}</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{row.amt}</span>
            <span style={{ fontSize: 11, color: C.t3 }}>{row.amtu}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ShipbuildingCoreMetricsCard() {
  const rows = [
    { label: "新接", n: "8",  nu: "艘", dwt: "95",  dwtu: "万DWT", amt: "62",  amtu: "亿" },
    { label: "手持", n: "72", nu: "艘", dwt: "860", dwtu: "万DWT", amt: "520", amtu: "亿" },
    { label: "交付", n: "6",  nu: "艘", dwt: "78",  dwtu: "万DWT", amt: "45",  amtu: "亿" },
  ];
  const summaryMetrics = [
    { label: "在建船舶", value: "36", unit: "艘", meta: "较上月 +1 ▲" },
    { label: "本月交付", value: "12", unit: "艘", meta: "较上月 +1 ▲" },
    { label: "本月累计交付订单", value: "8.2", unit: "亿", meta: "较上月 +0.8亿 ▲" },
  ];

  return (
    <section
      className="repair-core-metrics shipbuilding-core-metrics"
      aria-labelledby="shipbuilding-core-metrics-title"
    >
      <div className="repair-core-metrics-head">
        <div><CardIcon /><span id="shipbuilding-core-metrics-title">造船核心指标</span></div>
        <small>年度累计</small>
      </div>
      <div className="shipbuilding-core-table">
        <div className="shipbuilding-core-table-head">
          <span />
          {['订单艘数', '万载重吨', '金额'].map((heading) => <span key={heading}>{heading}</span>)}
        </div>
        {rows.map((row) => (
          <div key={row.label} className="shipbuilding-core-table-row">
            <span className="shipbuilding-core-row-label">{row.label}</span>
            <div><strong>{row.n}</strong><span>{row.nu}</span></div>
            <div><strong>{row.dwt}</strong><span className="is-dwt">{row.dwtu}</span></div>
            <div><strong>{row.amt}</strong><span>{row.amtu}</span></div>
          </div>
        ))}
      </div>
      <div className="shipbuilding-core-summary-card">
        {summaryMetrics.map((metric) => (
          <article key={metric.label}>
            <span>{metric.label}</span>
            <div><strong>{metric.value}</strong><em>{metric.unit}</em></div>
            <small>{metric.meta}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function OffshoreCoreMetricsCard() {
  const constructionOrders = 68.40;
  const conversionOutput = 9.60;
  const annualTarget = 96;
  const totalOrders = constructionOrders + conversionOutput;
  const completionRate = (totalOrders / annualTarget) * 100;

  return (
    <section className="repair-core-metrics offshore-core-metrics" aria-labelledby="offshore-core-metrics-title">
      <div className="repair-core-metrics-head">
        <div><CardIcon /><span id="offshore-core-metrics-title">海工核心指标</span></div>
        <small>年度累计</small>
      </div>
      <article className="offshore-core-order-card">
        <div className="offshore-core-card-title">
          <span>海工接单金额</span>
          <em>同比 <b>↑ 10.80%</b></em>
        </div>
        <div className="offshore-core-total-value"><strong>{totalOrders.toFixed(2)}</strong><span>亿元</span></div>
        <div className="offshore-core-composition">
          <div>
            <span>海工建造接单金额</span>
            <strong>{constructionOrders.toFixed(2)}<em>亿</em></strong>
            <small>6个项目</small>
          </div>
          <div>
            <span>海工改装进度产值</span>
            <strong>{conversionOutput.toFixed(2)}<em>亿</em></strong>
            <small>3个项目</small>
          </div>
        </div>
        <div className="offshore-core-target-row">
          <span>年度目标 <b>{annualTarget.toFixed(2)}亿</b></span>
          <span>完成率 <b>{completionRate.toFixed(2)}%</b></span>
        </div>
        <div className="repair-core-progress" aria-label={`海工接单金额完成率${completionRate.toFixed(2)}%`}>
          <i style={{ width: `${completionRate}%` }} />
        </div>
      </article>
      <div className="offshore-core-secondary-grid">
        <article>
          <div className="offshore-core-secondary-title"><span>累计交付订单</span><small>本年累计</small></div>
          <div className="offshore-core-secondary-value"><strong>13.20</strong><span>亿元</span></div>
          <div className="offshore-core-secondary-meta"><span>3个项目</span><em>同比 ↑ 18.60%</em></div>
        </article>
        <article>
          <div className="offshore-core-secondary-title"><span>手持订单</span><small>截至当前</small></div>
          <div className="offshore-core-secondary-value"><strong>168.50</strong><span>亿元</span></div>
          <div className="offshore-core-secondary-meta"><span>20个项目</span><em>同比 ↑ 7.80%</em></div>
        </article>
      </div>
    </section>
  );
}

function SupportCoreMetricsCard() {
  const financialMetrics = [
    { label: "完工产值", actual: "24.60", target: "50.00", rate: 49.20, yoy: "5.10" },
    { label: "接单金额", actual: "49.80", target: "68.00", rate: 73.24, yoy: "26.80" },
  ];
  const secondaryMetrics = [
    { label: "新能源接单金额", value: "5.20", yoy: "32.60", mom: "9.40" },
    { label: "重工内协同金额", value: "26.40", yoy: "21.50", mom: "7.30" },
  ];

  return (
    <section className="repair-core-metrics support-core-metrics" aria-labelledby="support-core-metrics-title">
      <div className="repair-core-metrics-head">
        <div><CardIcon /><span id="support-core-metrics-title">配套核心指标</span></div>
        <small>年度累计</small>
      </div>
      <div className="repair-core-financial-grid">
        {financialMetrics.map((metric) => (
          <article key={metric.label} className="repair-core-financial-card">
            <div className="repair-core-financial-title">
              <span>{metric.label}</span>
              <em>同比 <b>↑ {metric.yoy}%</b></em>
            </div>
            <div className="repair-core-financial-value"><strong>{metric.actual}</strong><span>亿元</span></div>
            <div className="repair-core-financial-meta">
              <span>总体目标 <b>{metric.target}亿</b></span>
              <span>完成率 <b>{metric.rate.toFixed(2)}%</b></span>
            </div>
            <div className="repair-core-progress" aria-label={`${metric.label}完成率${metric.rate.toFixed(2)}%`}>
              <i style={{ width: `${metric.rate}%` }} />
            </div>
          </article>
        ))}
      </div>
      <div className="support-core-secondary-card">
        {secondaryMetrics.map((metric) => (
          <article key={metric.label}>
            <span>{metric.label}</span>
            <div><strong>{metric.value}</strong><em>亿元</em></div>
            <small>同比 ↑ {metric.yoy}%</small>
            <small>环比 ↑ {metric.mom}%</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function RepairCoreMetricsCard() {
  const financialMetrics = [
    { label: "完工产值", actual: "72.36", target: "108.00", rate: 67.00, yoy: "6.42" },
    { label: "接单金额", actual: "56.80", target: "120.00", rate: 47.33, yoy: "12.75" },
  ];

  return (
    <section className="repair-core-metrics" aria-labelledby="repair-core-metrics-title">
      <div className="repair-core-metrics-head">
        <div><CardIcon /><span id="repair-core-metrics-title">修船核心指标</span></div>
        <small>年度累计</small>
      </div>
      <div className="repair-core-financial-grid">
        {financialMetrics.map((metric) => (
          <article key={metric.label} className="repair-core-financial-card">
            <div className="repair-core-financial-title">
              <span>{metric.label}</span>
              <em>同比 <b>↑ {metric.yoy}%</b></em>
            </div>
            <div className="repair-core-financial-value"><strong>{metric.actual}</strong><span>亿元</span></div>
            <div className="repair-core-financial-meta">
              <span>总体目标 <b>{metric.target}亿</b></span>
              <span>完成率 <b>{metric.rate.toFixed(2)}%</b></span>
            </div>
            <div className="repair-core-progress" aria-label={`${metric.label}完成率${metric.rate.toFixed(2)}%`}>
              <i style={{ width: `${metric.rate}%` }} />
            </div>
          </article>
        ))}
      </div>
      <article className="repair-core-fleet-card">
        <div className="repair-core-fleet-stat">
          <span>在厂艘数</span>
          <div><strong>82</strong><em>艘</em></div>
        </div>
        <div className="repair-core-fleet-stat">
          <span>完工艘数</span>
          <div><strong>914</strong><em>艘</em></div>
        </div>
      </article>
    </section>
  );
}

function MetricPair({ a, b }: { a: { label: string; value: string; target: string }; b: { label: string; value: string; target: string } }) {
  return (
    <div className="flex gap-2">
      {[a, b].map((it, i) => (
        <div key={i} className="flex-1 p-2 rounded-xl bg-primary/5 border border-primary/10">
          <div className="text-[10px] text-muted-foreground mb-0.5 leading-[13px]">{it.label}</div>
          <div className="text-[18px] font-bold text-foreground tabular-nums leading-none">{it.value}</div>
          <div className="text-[9px] text-muted-foreground mt-1">目标 <span className="text-primary font-medium">{it.target}</span></div>
        </div>
      ))}
    </div>
  );
}

/* ─── Page Renderers ─── */

function PageHome({ repairMode = false }: { repairMode?: boolean }) {
  const [alertExpanded, setAlertExpanded] = useState(false);
  const [freshnessOpen, setFreshnessOpen] = useState(false);
  const [freshnessContainer, setFreshnessContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setFreshnessContainer(document.querySelector<HTMLElement>(".app-phone-screen"));
  }, []);

  const DATA_FRESHNESS = [
    { module: "新接订单", date: "2026年8月8日", cadence: "每日更新" },
    { module: "年度交付", date: "2026年7月31日", cadence: "按月更新" },
    { module: "完工出厂", date: "2026年7月31日", cadence: "按月更新" },
    { module: "逾期应收", date: "2026年8月7日", cadence: "每日更新" },
  ];

  const ALERTS = [
    { cat: "生产", text: "广东重工交付完成率 90%",                 pri: "高优先级", link: "生产",  page: "prod-repair" },
    { cat: "经营", text: "新接订单完成率 29.8%，低于时间进度 5%", pri: "高优先级", link: "经营",  page: "biz"         },
    { cat: "财务", text: "逾期应收本周新增 +1931",                 pri: "高优先级", link: "财务",  page: "finance"     },
    { cat: "采购", text: "钢材集采率 81.3%，低于目标 85%",         pri: "中优先级", link: "采购",  page: "purchase-group" },
    { cat: "质量", text: "结构RT一次合格率 96.2%，低于目标 97%",   pri: "中优先级", link: "质量",  page: "quality"     },
  ];
  const visibleAlerts = alertExpanded ? ALERTS : ALERTS.slice(0, 3);

  return (
    <>
      <StatusBar />
      <NavBar
        title="重工数字化运营平台"
        dateBadge="数据口径：最新可用"
        badgeMode="freshness"
        badgeExpanded={freshnessOpen}
        onBadgeClick={() => setFreshnessOpen(true)}
      />

      {/* L3 KPI区：上下结构 */}
      <div style={{ padding: "0 10px 0", background: "linear-gradient(180deg, var(--app-primary-200) 0%, var(--app-border-extra-light) 34%, var(--background) 86%)" }}>

        {/* ── 上层：年度新接订单目标 hero card（全宽） ── */}
        <div className="home-order-card" style={{ borderRadius: 14, background: "linear-gradient(135deg, var(--app-white) 0%, var(--app-primary-soft) 58%, var(--app-fill-light) 100%)", boxShadow: "0 8px 18px rgba(18,58,99,0.09)", border: `1px solid var(--app-border-lighter)`, overflow: "hidden", position: "relative", marginTop: -14, marginBottom: 8, minHeight: 104 }}>
          <img className="home-order-ship-3d" src="/assets/order-ship-3d.png" alt="" aria-hidden="true" />

          <div style={{ padding: "10px 14px 10px", position: "relative", zIndex: 1 }}>
            {/* 标题行 + 安全运营 badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: "var(--app-type-section-title)", color: C.t1, fontWeight: "var(--app-weight-title)", letterSpacing: 0 }}>年度新接订单目标</span>
              <div style={{ display: "none", alignItems: "center", gap: 4, background: C.ph, borderRadius: 999, padding: "3px 10px", border: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: C.brand }}>安</span>
                <span style={{ fontSize: 9, color: C.t3 }}>安全运营</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>892</span>
                <span style={{ fontSize: 9, color: C.t3 }}>天</span>
              </div>
            </div>

            {/* 大数字 */}
            <div className="hero-order-value" style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: "var(--app-type-kpi-hero)", fontWeight: "var(--app-weight-data)", color: C.brand, fontVariantNumeric: "tabular-nums", lineHeight: 0.92, letterSpacing: -0.5 }}>156</span>
              <span style={{ fontSize: "var(--app-type-unit)", fontWeight: 700, color: "#00508E", paddingBottom: 3 }}>亿</span>
              <span style={{ fontSize: "var(--app-type-data)", fontWeight: 700, color: C.t2, paddingBottom: 4 }}>亿</span>
            </div>

            {/* 子指标行 */}
            <div style={{ display: "none", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, color: C.t3 }}>已完成 <b style={{ color: C.t1 }}>106亿</b></span>
              <span style={{ color: C.border, fontSize: 11 }}>|</span>
              <span style={{ fontSize: 11, color: C.t3 }}>完成率 <b style={{ color: C.t1 }}>68%</b></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: C.t3, fontSize: "var(--app-type-meta)", fontWeight: "var(--app-weight-meta)" }}>
              <span>已完成 <b style={{ color: "#00508E", fontSize: "var(--app-type-body)" }}>106亿</b></span>
              <span style={{ color: "#BFBFBF" }}>|</span>
              <span>完成率 <b style={{ color: "#00508E", fontSize: "var(--app-type-body)" }}>68%</b></span>
            </div>

            {/* 68% 完成率徽章 */}
            <div style={{ marginTop: 12, display: "none", alignItems: "center", gap: 4, background: C.ph, border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 12px" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>68%</span>
            </div>
            <div style={{ marginTop: 8, height: 16, borderRadius: 999, background: "rgba(255,255,255,0.9)", border: `1px solid ${C.border}`, boxShadow: "inset 0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden", position: "relative" }}>
              <div style={{ width: "68%", height: "100%", borderRadius: 999, background: "linear-gradient(90deg, var(--app-primary) 0%, var(--app-primary-hover) 48%, var(--app-primary-500) 100%)", boxShadow: "0 4px 10px rgba(0,80,142,0.24)" }} />
              <div style={{ position: "absolute", right: 12, top: 0, height: "100%", display: "flex", alignItems: "center", fontSize: "var(--app-type-caption)", fontWeight: "var(--app-weight-data)", color: "#00508E", fontVariantNumeric: "tabular-nums" }}>68%</div>
            </div>
          </div>
        </div>

        {/* ── 航旅式紧凑运营总览：造船 / 修船 / 海工 ── */}
        <div className="home-ops-card">
          <div className="home-ops-head">
            <span>运营总览</span>
          </div>
          <div className="home-ops-body">
            <div className="home-ops-row" onClick={() => nav("prod-ship")}>
              <div className="home-ops-line">
                <span className="home-ops-name">造船</span>
              </div>
              <div className="home-ops-metrics">
                <span><em>在建</em><b>48</b>艘</span>
                <span><em>年度累计交付</em><b>12</b>艘</span>
                <span className="text-warning"><em>完成率</em><b>26</b>%</span>
              </div>
            </div>
            <div className="home-ops-row" onClick={() => nav("prod-repair")}>
              <div className="home-ops-line">
                <span className="home-ops-name">修船</span>
              </div>
              <div className="home-ops-metrics">
                <span><em>在厂</em><b>48</b>艘</span>
                <span><em>年度完工出厂</em><b>12</b>艘</span>
                <span><em>产值</em><b>892</b>亿</span>
              </div>
            </div>
            <div className="home-ops-row" onClick={() => nav("prod-ship")}>
              <div className="home-ops-line">
                <span className="home-ops-name">海工</span>
              </div>
              <div className="home-ops-metrics">
                <span><em>在建</em><b>48</b>艘</span>
                <span><em>年度累计交付</em><b>2</b>艘</span>
                <span><em>完成率</em><b>76</b>%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 频道导航 */}
      <ChannelBar items={["经营", "财务", "生产", "采购", "质量", "能源"]} active="经营" />

      {/* L4 优先关注 */}
      <div style={{ padding: "7px 10px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <span className="home-alert-title"><AlertTriangle size={14} strokeWidth={2.3} />优先关注</span>
          <span onClick={() => setAlertExpanded(v => !v)}
            style={{ fontSize: "var(--app-type-meta)", color: C.brand, cursor: "pointer", fontWeight: "var(--app-weight-meta)" }}>
            查看更多 ›
          </span>
        </div>
      </div>
      <div className="home-alert-card">
        {visibleAlerts.map((a, i) => (
          <AlertRow key={i} cat={a.cat} text={a.text} pri={a.pri} link={a.link} onClick={() => nav(a.page)} />
        ))}
      </div>

      {/* L5 指标进度 */}
      <div onClick={() => nav("biz-kpi-progress")} style={{ background: C.card, borderRadius: 12, boxShadow: "var(--app-shadow-card)", margin: "0 10px 8px", overflow: "hidden", cursor: "pointer" }}>
        <div style={{ padding: "9px 14px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.divider}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CardIcon />
            <span style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>指标进度</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr 1fr", padding: "7px 14px 5px", borderBottom: `1px solid ${C.divider}` }}>
          <span />
          {["订单艘数", "万载重吨", "金额"].map(h => (
            <span key={h} style={{ fontSize: 11, color: C.t3, textAlign: "center" }}>{h}</span>
          ))}
        </div>
        {[
          { label: "新接", n: "8", nu: "艘", dwt: "95", dwtu: "万DWT", amt: "62", amtu: "亿" },
          { label: "在手", n: "72", nu: "艘", dwt: "860", dwtu: "万DWT", amt: "520", amtu: "亿" },
          { label: "交付", n: "6", nu: "艘", dwt: "78", dwtu: "万DWT", amt: "45", amtu: "亿" },
        ].map((row, i, arr) => (
          <div key={row.label} style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr 1fr", padding: "8px 14px", borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none", alignItems: "center" }}>
            <button type="button" className="home-progress-link" onClick={(e) => { e.stopPropagation(); nav("biz-kpi-progress"); }}>
              {row.label}<ChevronRight size={12} strokeWidth={2.4} />
            </button>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{row.n}</span>
              <span style={{ fontSize: 11, color: C.t3 }}>{row.nu}</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{row.dwt}</span>
              <span style={{ fontSize: 10, color: C.t3 }}>{row.dwtu}</span>
            </div>
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{row.amt}</span>
              <span style={{ fontSize: 11, color: C.t3 }}>{row.amtu}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 逾期应收 */}
      <div onClick={() => nav("biz-overdue")} style={{ background: C.card, borderRadius: 12, boxShadow: "var(--app-shadow-card)", margin: "0 10px 8px", overflow: "hidden", cursor: "pointer" }}>
        {/* 卡头 */}
        <div style={{ padding: "12px 14px 10px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.divider}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <CardIcon />
            <span style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>逾期应收</span>
            <span style={{ fontSize: 11, color: C.t3 }}>（经营口径）</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button type="button" className="app-drilldown-link" onClick={(e) => { e.stopPropagation(); nav("biz-overdue"); }}>
            查看全部 <ChevronRight size={13} strokeWidth={2.3} />
            </button>
          </div>
        </div>
        {/* 3列指标 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 0 12px" }}>
          {[
            { label: "本周新增", value: "+1931", unit: "万", positive: true },
            { label: "本周收回", value: "-133", unit: "万", positive: false },
            { label: "净变动", value: "+1798", unit: "万", positive: true },
          ].map((it, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, borderRight: i < 2 ? `1px solid ${C.divider}` : "none", padding: "0 8px" }}>
              <span style={{ fontSize: 11, color: C.t3 }}>{it.label}</span>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
                <span style={{ fontSize: 24, fontWeight: 700, fontVariantNumeric: "tabular-nums", lineHeight: 1, color: it.positive ? C.danger : C.success }}>{it.value}</span>
                <span style={{ fontSize: 12, color: C.t3, paddingBottom: 2 }}>{it.unit}</span>
              </div>
            </div>
          ))}
        </div>
        {/* 归因文本区 */}
        <div style={{ margin: "0 14px 14px", background: "#FFF8F2", border: `1px solid #EDE0D4`, borderRadius: 8, padding: "8px 10px", display: "flex", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.warning, flexShrink: 0, marginTop: 1 }}>注</span>
          <span style={{ fontSize: 11, color: C.t2, lineHeight: "18px" }}>
            本周新增主要为修理改装板块，舟山重工"BLUE DREAM MELODY"轮 <b style={{ color: C.t1 }}>1213万</b>，催收跟进中。
          </span>
        </div>
      </div>

      {/* 采购 */}
      <div onClick={() => nav("purchase-group")} style={{ background: C.card, borderRadius: 12, boxShadow: "var(--app-shadow-card)", margin: "0 10px 8px", overflow: "hidden", cursor: "pointer" }}>
        {/* 卡头：2.5D图标 + 标题 | 截至日期 + 胶囊按钮 */}
        <div style={{ padding: "12px 14px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.divider}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* 2.5D 采购包裹图标（品牌蓝） */}
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M3 14 L13 19 L13 25 L3 20 Z" fill="#00467C"/>
              <path d="M13 19 L23 14 L23 20 L13 25 Z" fill="#00345F"/>
              <path d="M3 14 L13 9 L23 14 L13 19 Z" fill={C.chart[1]}/>
              <line x1="3" y1="14" x2="23" y2="14" stroke="#00508E" strokeWidth="0.8"/>
              <line x1="13" y1="9" x2="13" y2="19" stroke="#00508E" strokeWidth="0.8"/>
              <path d="M7 12 Q13 9.5 19 12 L13 9 Z" fill="rgba(255,255,255,0.35)"/>
              <path d="M10 9 Q10 6 13 6 Q16 6 16 9" stroke="#78AEFF" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>采购</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: C.t3 }}>截至3.16</span>
            <button type="button" className="app-drilldown-link" onClick={(e) => { e.stopPropagation(); nav("purchase-group"); }}>
            查看全部 <ChevronRight size={13} strokeWidth={2.3} />
            </button>
          </div>
        </div>

        {/* 3列指标：竖分割线 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "14px 0 16px" }}>
          {/* 总采购金额 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, borderRight: `1px solid ${C.divider}`, padding: "0 8px" }}>
            <span style={{ fontSize: 11, color: C.t3 }}>总采购金额</span>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>128</span>
              <span style={{ fontSize: 13, color: C.t2, paddingBottom: 2, fontWeight: 500 }}>亿</span>
            </div>
            <span style={{ fontSize: 11, color: C.t3 }}>本周+6.2亿</span>
          </div>

          {/* 集采金额 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, borderRight: `1px solid ${C.divider}`, padding: "0 8px" }}>
            <span style={{ fontSize: 11, color: C.t3 }}>集采金额</span>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 2 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>104</span>
              <span style={{ fontSize: 13, color: C.t2, paddingBottom: 2, fontWeight: 500 }}>亿</span>
            </div>
            <span style={{ fontSize: 11, color: C.t3 }}>较上周+5.1亿</span>
          </div>

          {/* 集采率 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "0 8px" }}>
            <span style={{ fontSize: 11, color: C.t3 }}>集采率</span>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.warning, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>81.3</span>
              <span style={{ fontSize: 13, color: C.t3, paddingBottom: 2 }}>%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 质量 */}
      <div onClick={() => nav("quality")} style={{ background: C.card, borderRadius: 12, boxShadow: "var(--app-shadow-card)", margin: "0 10px 8px", overflow: "hidden", cursor: "pointer" }}>
        {/* 卡头 */}
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.divider}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* 圆形?图标（品牌蓝） */}
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: `1.5px solid ${C.brand}`, background: `${C.brand}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                <path d="M1 5 L4.5 8.5 L11 1.5" stroke={C.brand} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>质量</span>
            {/* ▲ RT待提升 预警tag */}
            <div style={{ display: "flex", alignItems: "center", gap: 3, background: C.ph, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 7px" }}>
              <span style={{ fontSize: 9, color: C.t2 }}>▲</span>
              <span style={{ fontSize: 10, color: C.t2, fontWeight: 500 }}>RT待提升</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: C.t3 }}>截至3.16</span>
            <button type="button" className="app-drilldown-link" onClick={(e) => { e.stopPropagation(); nav("quality"); }}>
            查看全部 <ChevronRight size={13} strokeWidth={2.3} />
            </button>
          </div>
        </div>

        {/* 两列合格率指标 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "10px 10px 8px", gap: 8 }}>
          {[
            { label: "报验一次合格率", value: "98.6", target: "≥98%", ok: true },
            { label: "结构RT一次合格率", value: "96.2", target: "≥97%", ok: false },
          ].map((it, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <span style={{ fontSize: 11, color: C.t3 }}>{it.label}</span>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
                <span style={{ fontSize: 28, fontWeight: 700, fontVariantNumeric: "tabular-nums", lineHeight: 1, color: it.ok ? C.success : C.warning }}>{it.value}</span>
                <span style={{ fontSize: 13, color: C.t3, paddingBottom: 2 }}>%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 10, color: C.t3 }}>目标{it.target}</span>
                <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 4, background: it.ok ? `${C.success}15` : `${C.warning}15`, color: it.ok ? C.success : C.warning, fontWeight: 600 }}>{it.ok ? "达标" : "待提升"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 质量活动动态 */}
        <div className="home-news-card">
          <div className="home-news-head">
            <span>质量活动动态 · 本周3场</span>
            <button type="button" className="home-news-action" onClick={(e) => { e.stopPropagation(); nav("quality"); }}>
              查看 <ChevronRight size={12} strokeWidth={2.3} />
            </button>
          </div>
          <button type="button" className="home-news-item" onClick={(e) => { e.stopPropagation(); nav("quality"); }}>
            <span className="home-news-date">
              <em>3月</em>
              <b>11-12</b>
            </span>
            <span className="home-news-title">组织中远海运重工/船研所 QC 小组活动专题培训班</span>
            <ChevronRight className="home-news-chevron" size={14} strokeWidth={2.3} />
          </button>
        </div>
      </div>

      {/* 能源 */}
      <div onClick={() => nav("energy")} style={{ background: C.card, borderRadius: 12, boxShadow: "var(--app-shadow-card)", margin: "0 10px 8px", overflow: "hidden", cursor: "pointer" }}>
        {/* 卡头 */}
        <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.divider}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* ? 闪电图标（品牌蓝） */}
            <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
              <path d="M13 2 L4 14 L10 14 L9 22 L18 10 L12 10 Z" fill={C.brand} stroke={C.brandDark} strokeWidth="0.8" strokeLinejoin="round"/>
              <path d="M13 2 L7 13 L10 13 Z" fill="rgba(255,255,255,0.35)"/>
            </svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>能源</span>
            {/* ▲ 碳超标 预警tag */}
            <div style={{ display: "flex", alignItems: "center", gap: 3, background: C.ph, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 7px" }}>
              <span style={{ fontSize: 9, color: C.t2 }}>▲</span>
              <span style={{ fontSize: 10, color: C.t2, fontWeight: 500 }}>碳超标</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: C.t3 }}>截至3.16</span>
            <button type="button" className="app-drilldown-link" onClick={(e) => { e.stopPropagation(); nav("energy"); }}>
            查看全部 <ChevronRight size={13} strokeWidth={2.3} />
            </button>
          </div>
        </div>

        {/* 两列指标 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", padding: "10px 10px 10px", gap: 8 }}>
          {/* 万元产值碳排放 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, color: C.t3 }}>万元产值碳排放</span>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>0.48</span>
              <span style={{ fontSize: 12, color: C.t3, paddingBottom: 2 }}>吨</span>
            </div>
            <span style={{ fontSize: 11, color: C.t3 }}>目标≤0.45</span>
          </div>
          {/* 万元产值综合能耗 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <span style={{ fontSize: 11, color: C.t3 }}>万元产值综合能耗</span>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>0.32</span>
              <span style={{ fontSize: 12, color: C.t3, paddingBottom: 2 }}>吨标煤/万元</span>
            </div>
            <span style={{ fontSize: 11, color: C.t3 }}>同比↓4%</span>
          </div>
        </div>
      </div>

      <Footer text="数据口径混合日更/月更 · 点主题卡下钻至详情" />

      <Sheet open={freshnessOpen} onOpenChange={setFreshnessOpen}>
        <SheetContent side="bottom" className="home-freshness-sheet" container={freshnessContainer}>
          <SheetHeader className="home-freshness-head">
            <SheetTitle>数据更新时间说明</SheetTitle>
            <SheetDescription>首页按各业务系统最近一次可用数据展示</SheetDescription>
          </SheetHeader>
          <div className="home-freshness-list">
            {DATA_FRESHNESS.map((item) => (
              <div className="home-freshness-item" key={item.module}>
                <div>
                  <strong>{item.module}</strong>
                  <span>{item.cadence}</span>
                </div>
                <time>{item.date}</time>
              </div>
            ))}
          </div>
          <p className="home-freshness-note">
            不同指标更新频率不同，详情页中的口径说明及更新时间优先。
          </p>
        </SheetContent>
      </Sheet>
    </>
  );
}

type BizInsightTab = "修船" | "造船" | "海工" | "配套";
type CollectionPlanBusiness = "修船" | "造船" | "海工" | "配套";
type CollectionPlanProject = {
  code: string;
  name: string;
  status: "已结账未收款" | "已完成收款";
  customer: string;
  customerImportance?: string;
  customerCredit?: string;
  balance: string;
  dueDate: string;
  overdue: string;
  monthNew: string;
  aging: { under3: number; m3to6: number; m6to12: number; y1to2: number; y2to3: number; over3: number };
  risk: "低风险" | "中风险" | "高风险";
  reason: string;
};
type CollectionFilter = "全部" | "待收" | "逾期";

const COLLECTION_AGING_FIELDS: Array<[label: string, key: keyof CollectionPlanProject["aging"]]> = [
  ["3个月以内", "under3"],
  ["3–6个月", "m3to6"],
  ["6–12个月", "m6to12"],
  ["1–2年", "y1to2"],
  ["2–3年", "y2to3"],
  ["3年以上", "over3"],
];

/** 后端金额可返回数字、千分位字符串或空值；统一转换后再参与业务判断。 */
function parseCollectionAmount(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

/** 待收由结账状态判断；逾期必须以逾期金额大于 0 为准，不能只依赖状态文案。 */
function matchesCollectionFilter(project: CollectionPlanProject, filter: CollectionFilter) {
  if (filter === "全部") return true;
  if (filter === "待收") return project.status === "已结账未收款";
  return parseCollectionAmount(project.overdue) > 0;
}

/** 只输出非零账龄，接口缺失或为 0 的账龄不占据移动端空间。 */
function getCollectionAgingItems(project: CollectionPlanProject) {
  return COLLECTION_AGING_FIELDS
    .map(([label, key]) => [label, parseCollectionAmount(project.aging?.[key])] as const)
    .filter(([, value]) => value > 0);
}

// 当前为原型模拟数据；接入接口时保持该视图模型字段即可复用全部筛选与风险判断。
const COLLECTION_PLAN_CONFIG: Record<CollectionPlanBusiness, {
  title: "经营计划收款" | "经营逾期收款";
  flow: "plan" | "overdue";
  overviewMetrics: Array<{ label: string; value: string; unit: "万元" | "%" | "家"; meta: string; tone: "primary" | "success" | "danger"; trend: "up" | "down" | "good" }>;
  summary: {
    heading: string;
    primary: { label: string; value: string };
    secondary: { label: string; value: string; tone: "success" | "danger" };
    progress: { label: string; value: string; width: string; meta: string; tone: "behind" | "risk" };
    stats: Array<{ label: string; value: number; tone?: "risk" }>;
  };
  detailRoute: string;
  returnRoute: string;
  projects: CollectionPlanProject[];
}> = {
  修船: {
    title: "经营逾期收款",
    flow: "overdue",
    overviewMetrics: [
      { label: "应收账款总额", value: "118,260.00", unit: "万元", meta: "较上月 ↓ 1.8%", tone: "primary", trend: "good" },
      { label: "逾期账款总额", value: "4,360.00", unit: "万元", meta: "较上月 ↓ 6.2%", tone: "danger", trend: "good" },
      { label: "逾期账款占比", value: "3.69", unit: "%", meta: "较上月 ↓ 0.18pct", tone: "success", trend: "good" },
    ],
    summary: {
      heading: "应收账款风险概览",
      primary: { label: "应收账款总额", value: "118,260.00" },
      secondary: { label: "逾期账款总额", value: "4,360.00", tone: "danger" },
      progress: { label: "逾期账款占比", value: "3.69%", width: "3.69%", meta: "较上月下降 0.18pct", tone: "risk" },
      stats: [
        { label: "应收项目", value: 18 },
        { label: "待收项目", value: 9 },
        { label: "逾期项目", value: 2, tone: "risk" },
      ],
    },
    detailRoute: "biz-collection-plan-repair",
    returnRoute: "biz-repair",
    projects: [
      { code: "R26001", name: "大型集装箱船坞修", status: "已结账未收款", customer: "华远航运", customerImportance: "重点客户", customerCredit: "信用良好", balance: "12,600", dueDate: "2026-08-18", overdue: "0", monthNew: "0", aging: { under3: 0, m3to6: 0, m6to12: 0, y1to2: 0, y2to3: 0, over3: 0 }, risk: "低风险", reason: "按合同节点正常推进" },
      { code: "R26002", name: "LNG运输船修理改装", status: "已结账未收款", customer: "东海能源航运", customerImportance: "重点客户", customerCredit: "信用一般", balance: "8,800", dueDate: "2026-07-28", overdue: "960", monthNew: "960", aging: { under3: 960, m3to6: 0, m6to12: 0, y1to2: 0, y2to3: 0, over3: 0 }, risk: "中风险", reason: "验收单据补充中，预计本月回款" },
      { code: "R26003", name: "特种工程船改装", status: "已结账未收款", customer: "远洋工程船务", customerImportance: "一般客户", customerCredit: "信用关注", balance: "15,500", dueDate: "2026-06-25", overdue: "3,400", monthNew: "720", aging: { under3: 0, m3to6: 2100, m6to12: 1300, y1to2: 0, y2to3: 0, over3: 0 }, risk: "高风险", reason: "增补工程量尚待客户确认" },
      { code: "R26004", name: "散货船常规修理", status: "已完成收款", customer: "蓝海船舶管理", customerImportance: "重点客户", customerCredit: "信用良好", balance: "0", dueDate: "2026-07-16", overdue: "0", monthNew: "0", aging: { under3: 0, m3to6: 0, m6to12: 0, y1to2: 0, y2to3: 0, over3: 0 }, risk: "低风险", reason: "已按计划完成收款" },
    ],
  },
  造船: {
    title: "经营计划收款",
    flow: "plan",
    overviewMetrics: [
      { label: "本年计划收款", value: "245,000.00", unit: "万元", meta: "同比 ↓ 2.8%", tone: "primary", trend: "down" },
      { label: "本年实收金额", value: "216,800.00", unit: "万元", meta: "同比 ↑ 7.6%", tone: "success", trend: "up" },
      { label: "7月实收总额", value: "26,400.00", unit: "万元", meta: "同比 ↑ 5.1%", tone: "primary", trend: "up" },
    ],
    summary: {
      heading: "年度收款计划执行",
      primary: { label: "本年计划收款", value: "245,000.00" },
      secondary: { label: "本年实收金额", value: "216,800.00", tone: "success" },
      progress: { label: "年度计划达成率", value: "88.5%", width: "88.5%", meta: "距计划 28,200.00万元", tone: "behind" },
      stats: [{ label: "计划项目", value: 24 }, { label: "待收项目", value: 13 }, { label: "逾期项目", value: 2, tone: "risk" }],
    },
    detailRoute: "biz-collection-plan-shipbuilding",
    returnRoute: "biz-shipbuilding",
    projects: [
      { code: "S26001", name: "LNG双燃料船建造", status: "已结账未收款", customer: "远海航运", balance: "22,600", dueDate: "2026-08-22", overdue: "0", monthNew: "0", aging: { under3: 0, m3to6: 0, m6to12: 0, y1to2: 0, y2to3: 0, over3: 0 }, risk: "低风险", reason: "按合同交船节点正常推进" },
      { code: "S26002", name: "甲醇双燃料集装箱船", status: "已结账未收款", customer: "环球集运", balance: "18,900", dueDate: "2026-07-26", overdue: "1,260", monthNew: "1,260", aging: { under3: 1260, m3to6: 0, m6to12: 0, y1to2: 0, y2to3: 0, over3: 0 }, risk: "中风险", reason: "交船结算资料补充中，预计本月回款" },
      { code: "S26003", name: "新能源汽车运输船", status: "已结账未收款", customer: "海洲汽车航运", balance: "31,800", dueDate: "2026-06-18", overdue: "4,380", monthNew: "920", aging: { under3: 0, m3to6: 2580, m6to12: 1800, y1to2: 0, y2to3: 0, over3: 0 }, risk: "高风险", reason: "设计变更结算尚待客户确认" },
      { code: "S26004", name: "82000吨散货船", status: "已完成收款", customer: "蓝洋船务", balance: "0", dueDate: "2026-07-12", overdue: "0", monthNew: "0", aging: { under3: 0, m3to6: 0, m6to12: 0, y1to2: 0, y2to3: 0, over3: 0 }, risk: "低风险", reason: "已按计划完成收款" },
    ],
  },
  海工: {
    title: "经营计划收款",
    flow: "plan",
    overviewMetrics: [
      { label: "本年计划收款", value: "186,500.00", unit: "万元", meta: "同比 ↓ 4.8%", tone: "primary", trend: "down" },
      { label: "本年实收金额", value: "172,360.00", unit: "万元", meta: "同比 ↑ 9.6%", tone: "success", trend: "up" },
      { label: "7月实收总额", value: "21,680.00", unit: "万元", meta: "同比 ↑ 5.4%", tone: "primary", trend: "up" },
    ],
    summary: {
      heading: "年度收款计划执行",
      primary: { label: "本年计划收款", value: "186,500.00" },
      secondary: { label: "本年实收金额", value: "172,360.00", tone: "success" },
      progress: { label: "年度计划达成率", value: "92.4%", width: "92.4%", meta: "距计划 14,140.00万元", tone: "behind" },
      stats: [{ label: "计划项目", value: 12 }, { label: "待收项目", value: 7 }, { label: "逾期项目", value: 2, tone: "risk" }],
    },
    detailRoute: "biz-collection-plan",
    returnRoute: "biz-offshore",
    projects: [
      { code: "N1234", name: "深海能源平台建造", status: "已结账未收款", customer: "中海油能源", balance: "28,600", dueDate: "2026-08-20", overdue: "0", monthNew: "0", aging: { under3: 0, m3to6: 0, m6to12: 0, y1to2: 0, y2to3: 0, over3: 0 }, risk: "低风险", reason: "按合同节点正常推进" },
      { code: "N1235", name: "海上风电安装平台", status: "已结账未收款", customer: "国家能源集团", balance: "19,850", dueDate: "2026-07-31", overdue: "1,680", monthNew: "1,680", aging: { under3: 1680, m3to6: 0, m6to12: 0, y1to2: 0, y2to3: 0, over3: 0 }, risk: "中风险", reason: "验收资料补充中，预计本月回款" },
      { code: "N1236", name: "FPSO模块建造项目", status: "已结账未收款", customer: "中海油服", balance: "32,500", dueDate: "2026-06-30", overdue: "5,620", monthNew: "1,250", aging: { under3: 0, m3to6: 3200, m6to12: 1420, y1to2: 1000, y2to3: 0, over3: 0 }, risk: "高风险", reason: "变更签证尚未完成客户确认" },
      { code: "N1237", name: "海工改装升级项目", status: "已完成收款", customer: "招商海工", balance: "0", dueDate: "2026-07-18", overdue: "0", monthNew: "0", aging: { under3: 0, m3to6: 0, m6to12: 0, y1to2: 0, y2to3: 0, over3: 0 }, risk: "低风险", reason: "已按计划完成收款" },
    ],
  },
  配套: {
    title: "经营逾期收款",
    flow: "overdue",
    overviewMetrics: [
      { label: "应收账款总额", value: "328,600.00", unit: "万元", meta: "较上月 ↓ 2.1%", tone: "primary", trend: "good" },
      { label: "逾期账款总额", value: "7,420.00", unit: "万元", meta: "较上月 ↓ 5.4%", tone: "danger", trend: "good" },
      { label: "逾期账款占比", value: "2.26", unit: "%", meta: "较上月 ↓ 0.08pct", tone: "success", trend: "good" },
    ],
    summary: {
      heading: "应收账款风险概览",
      primary: { label: "应收账款总额", value: "328,600.00" },
      secondary: { label: "逾期账款总额", value: "7,420.00", tone: "danger" },
      progress: { label: "逾期账款占比", value: "2.26%", width: "2.26%", meta: "较上月下降 0.08pct", tone: "risk" },
      stats: [
        { label: "应收项目", value: 22 },
        { label: "待收项目", value: 14 },
        { label: "逾期项目", value: 2, tone: "risk" },
      ],
    },
    detailRoute: "biz-collection-overdue-support",
    returnRoute: "biz-support",
    projects: [
      { code: "P26001", name: "船用柴油机配套订单", status: "已结账未收款", customer: "远洋装备制造", customerImportance: "重点客户", customerCredit: "信用良好", balance: "28,800", dueDate: "2026-08-24", overdue: "0", monthNew: "0", aging: { under3: 0, m3to6: 0, m6to12: 0, y1to2: 0, y2to3: 0, over3: 0 }, risk: "低风险", reason: "按合同交付节点正常推进" },
      { code: "P26002", name: "船用锅炉交付项目", status: "已结账未收款", customer: "海盛船舶科技", customerImportance: "重点客户", customerCredit: "信用一般", balance: "12,600", dueDate: "2026-07-25", overdue: "1,860", monthNew: "1,860", aging: { under3: 1860, m3to6: 0, m6to12: 0, y1to2: 0, y2to3: 0, over3: 0 }, risk: "中风险", reason: "终验资料补充中，预计本月完成回款" },
      { code: "P26003", name: "新能源动力系统配套", status: "已结账未收款", customer: "蓝海新能源装备", customerImportance: "一般客户", customerCredit: "信用关注", balance: "21,900", dueDate: "2026-06-16", overdue: "5,560", monthNew: "1,120", aging: { under3: 0, m3to6: 3200, m6to12: 2360, y1to2: 0, y2to3: 0, over3: 0 }, risk: "高风险", reason: "技术变更结算尚待客户确认" },
      { code: "P26004", name: "船舶电气自动化设备", status: "已完成收款", customer: "华东船舶工业", customerImportance: "重点客户", customerCredit: "信用良好", balance: "0", dueDate: "2026-07-10", overdue: "0", monthNew: "0", aging: { under3: 0, m3to6: 0, m6to12: 0, y1to2: 0, y2to3: 0, over3: 0 }, risk: "低风险", reason: "已按计划完成收款" },
    ],
  },
};

function CollectionPlanOverviewCard({ business }: { business: CollectionPlanBusiness }) {
  const config = COLLECTION_PLAN_CONFIG[business];
  return (
    <section className="biz-collection-overview" aria-label={`${business}${config.title}`}>
      <div className="biz-collection-overview-head">
        <div><CircleDollarSign aria-hidden="true" /><span>{config.title}</span></div>
        <button type="button" className="app-drilldown-link" onClick={() => nav(config.detailRoute)}>查看全部 <ChevronRight size={13} strokeWidth={2.3} /></button>
      </div>
      <div className="biz-collection-overview-grid">
        {config.overviewMetrics.map((metric) => (
          <article key={metric.label} className={metric.tone === "success" ? "is-success" : metric.tone === "danger" ? "is-risk" : ""}>
            <span>{metric.label}</span>
            <div><strong>{metric.value}</strong><em>{metric.unit}</em></div>
            <small className={`is-${metric.trend}`}>{metric.meta}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

type BusinessValueMarginPoint = {
  id: string;
  label: string;
  actual: number;
  target: number;
  marginRate: number;
};

function BusinessValueMarginChart({
  metrics,
  points,
  marginLabel = "预计边贡率",
}: {
  metrics: Array<{ label: string; value: string; unit: string }>;
  points: BusinessValueMarginPoint[];
  marginLabel?: string;
}) {
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);
  const axisMax = Math.max(100, Math.ceil(Math.max(...points.flatMap(item => [item.actual, item.target]), 0) / 100) * 100);
  const plotBottom = 162;
  const plotLeft = points.length === 2 ? 94 : 36;
  const plotRight = points.length === 2 ? 226 : 284;
  const pointGap = points.length > 1 ? (plotRight - plotLeft) / (points.length - 1) : 0;
  const chartPoints = points.map((item, index) => ({
    ...item,
    x: points.length === 1 ? 160 : plotLeft + pointGap * index,
    marginY: plotBottom - ((Math.max(20, Math.min(100, item.marginRate)) - 20) / 80) * 128,
  }));
  const linePath = chartPoints.length === 2
    ? `M${chartPoints[0].x} ${chartPoints[0].marginY} C${chartPoints[0].x + 44} ${chartPoints[0].marginY} ${chartPoints[1].x - 44} ${chartPoints[1].marginY} ${chartPoints[1].x} ${chartPoints[1].marginY}`
    : chartPoints.map((item, index) => `${index === 0 ? "M" : "L"}${item.x} ${item.marginY}`).join(" ");
  const areaPath = chartPoints.length > 0
    ? `${linePath} L${chartPoints[chartPoints.length - 1].x} ${plotBottom} L${chartPoints[0].x} ${plotBottom} Z`
    : "";

  return (
    <div className="biz-value-margin-chart" style={{ padding: "10px 10px 14px" }}>
      <div className="biz-value-margin-metrics">
        {metrics.map(item => (
          <div key={item.label}>
            <span>{item.label}</span><strong>{item.value}</strong><em>{item.unit}</em>
          </div>
        ))}
      </div>
      <div className="biz-value-margin-legend">
        <span><i className="is-actual" />实际产值</span>
        <span><i className="is-target" />目标产值</span>
        <span><i className="is-margin" />{marginLabel}（%）</span>
      </div>

      {points.length === 0 ? <div className="biz-value-margin-empty">暂无产值及边贡数据</div> : (
        <svg width="100%" height="210" viewBox="0 0 320 210" preserveAspectRatio="none" style={{ display: "block" }} aria-label="产值及边贡图表">
          <defs>
            <linearGradient id="businessMarginArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.success} stopOpacity="0.22" /><stop offset="100%" stopColor={C.success} stopOpacity="0.02" /></linearGradient>
            <linearGradient id="businessActualBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#79BBFF" /><stop offset="100%" stopColor={C.brand} /></linearGradient>
            <linearGradient id="businessTargetBar" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#B9CDDE" /><stop offset="100%" stopColor="#91AAC0" /></linearGradient>
            <filter id="businessTooltipShadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#10263A" floodOpacity="0.24" /></filter>
          </defs>
          <text x="4" y="16" fontSize="10" fill={C.t3}>万元</text><text x="300" y="16" fontSize="10" fill={C.t3}>%</text>
          {[0, 1, 2, 3, 4].map(index => {
            const y = 34 + index * 32;
            return <g key={index}><line x1="28" y1={y} x2="288" y2={y} stroke={C.divider} strokeWidth="0.8" /><text x="22" y={y + 4} textAnchor="end" fontSize="10" fill={C.t3}>{axisMax - index * axisMax / 4}</text><text x="294" y={y + 4} fontSize="10" fill={C.t3}>{100 - index * 20}</text></g>;
          })}
          {chartPoints.map(item => {
            const targetHeight = Math.max(20, Math.min(116, item.target / axisMax * 116));
            const actualHeight = Math.max(18, Math.min(110, item.actual / axisMax * 110));
            return <g key={item.id}><rect x={item.x - 10} y={plotBottom - targetHeight} width="20" height={targetHeight} rx="9" fill="url(#businessTargetBar)" stroke="#7897B2" strokeWidth="0.9" /><rect x={item.x - 10} y={plotBottom - actualHeight} width="20" height={actualHeight} rx="9" fill="url(#businessActualBar)" /></g>;
          })}
          <path d={areaPath} fill="url(#businessMarginArea)" pointerEvents="none" /><path d={linePath} fill="none" stroke={C.success} strokeWidth="2.2" strokeLinecap="round" pointerEvents="none" />
          {chartPoints.map(item => {
            const targetHeight = Math.max(20, Math.min(116, item.target / axisMax * 116));
            return <g key={`${item.id}-label`} pointerEvents="none"><text x={item.x} y={154 - targetHeight} textAnchor="middle" fontSize="10" fill={C.t2}>{item.target}</text><text x={item.x} y="184" textAnchor="middle" fontSize="10" fill={C.t2}>{item.label}</text></g>;
          })}
          <text x="17" y="166" textAnchor="end" fontSize="10" fill={C.t3}>0</text><text x="304" y="166" fontSize="10" fill={C.t3}>20</text><line x1="24" y1="162" x2="292" y2="162" stroke={C.divider} strokeWidth="0.8" />
          {chartPoints.map((item, index) => <rect key={`${item.id}-touch`} x={Math.max(24, item.x - 48)} y="26" width="96" height="166" fill="transparent" role="button" tabIndex={0} aria-label={`${item.label}，实际产值${item.actual}万元，目标产值${item.target}万元，${marginLabel}${item.marginRate}%`} style={{ cursor: "pointer", outline: "none", touchAction: "pan-y" }} onPointerEnter={event => { if (event.pointerType === "mouse") setTooltipIndex(index); }} onPointerLeave={event => { if (event.pointerType === "mouse") setTooltipIndex(null); }} onPointerDown={event => { if (event.pointerType !== "mouse") setTooltipIndex(index); }} onClick={() => setTooltipIndex(index)} onFocus={() => setTooltipIndex(index)} onBlur={() => setTooltipIndex(null)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setTooltipIndex(index); } }} />)}
          {tooltipIndex !== null && (() => {
            const item = chartPoints[tooltipIndex];
            if (!item) return null;
            const tooltipX = Math.max(6, Math.min(186, item.x - 62));
            return <g pointerEvents="none"><line x1={item.x} y1="28" x2={item.x} y2="162" stroke="#7897B2" strokeWidth="1" strokeDasharray="3 3" opacity="0.72" /><circle cx={item.x} cy={item.marginY} r="4" fill="#FFFFFF" stroke={C.success} strokeWidth="2" /><g filter="url(#businessTooltipShadow)"><rect x={tooltipX} y="28" width="128" height="76" rx="7" fill="#26384A" fillOpacity="0.97" /><text x={tooltipX + 10} y="44" fontSize="10" fontWeight="700" fill="#FFFFFF">{item.label}</text><circle cx={tooltipX + 11} cy="57" r="3" fill={C.brand} /><text x={tooltipX + 19} y="60" fontSize="9" fill="#DCE8F2">实际产值</text><text x={tooltipX + 118} y="60" textAnchor="end" fontSize="9" fontWeight="700" fill="#FFFFFF">{item.actual} 万元</text><circle cx={tooltipX + 11} cy="73" r="3" fill="#AFC4D6" stroke="#7897B2" strokeWidth="0.8" /><text x={tooltipX + 19} y="76" fontSize="9" fill="#DCE8F2">目标产值</text><text x={tooltipX + 118} y="76" textAnchor="end" fontSize="9" fontWeight="700" fill="#FFFFFF">{item.target} 万元</text><line x1={tooltipX + 8} y1="89" x2={tooltipX + 14} y2="89" stroke={C.success} strokeWidth="2" strokeLinecap="round" /><text x={tooltipX + 19} y="92" fontSize="9" fill="#DCE8F2">{marginLabel}</text><text x={tooltipX + 118} y="92" textAnchor="end" fontSize="9" fontWeight="700" fill="#FFFFFF">{item.marginRate}%</text></g></g>;
          })()}
        </svg>
      )}
    </div>
  );
}

function SupportRevenueAnalysis({ detail = false }: { detail?: boolean } = {}) {
  const businessTypes = [
    { label: "设备", value: 24.8, percentage: 47, color: "#12B886" },
    { label: "工程", value: 15.2, percentage: 29, color: "#3B8FD9" },
    { label: "服务", value: 10.1, percentage: 19, color: "#FFB43A" },
    { label: "其他", value: 2.7, percentage: 5, color: "#F56C6C" },
  ];
  const projectStages = [
    { label: "报价", value: 96 },
    { label: "立项", value: 84 },
    { label: "工程", value: 76 },
    { label: "完工", value: 68 },
    { label: "结算", value: 61 },
    { label: "开票", value: 54 },
    { label: "关闭", value: 21 },
  ];
  const companyRows = [
    { name: "南通配套", finish: 18, settlement: 16, invoice: 12, close: 5 },
    { name: "威海科技", finish: 15, settlement: 13, invoice: 11, close: 6 },
    { name: "大连装备", finish: 12, settlement: 10, invoice: 9, close: 4 },
  ];
  const [selectedStageIndex, setSelectedStageIndex] = useState(3);
  const selectedStage = projectStages[selectedStageIndex] ?? projectStages[0];
  const stageMax = Math.max(...projectStages.map(item => item.value), 1);
  const donutBackground = `conic-gradient(${businessTypes.map((item, index) => {
    const start = businessTypes.slice(0, index).reduce((sum, current) => sum + current.percentage, 0);
    return `${item.color} ${start}% ${start + item.percentage}%`;
  }).join(", ")})`;

  return (
    <div className="biz-support-analysis">
      {!detail && <div className="biz-support-kpis">
        <article><span>本年营业收入</span><div><strong>38.60</strong><em>亿元</em></div><small className="is-up">同比 ↑ 8.4%</small></article>
        <article><span>本年接单金额</span><div><strong>52.80</strong><em>亿元</em></div><small>目标完成率 78.8%</small></article>
      </div>}

      {!detail && (
        <div className="biz-support-overview-strip" aria-label="配套营业收入分析摘要">
          <span>设备占比 <strong>47%</strong></span>
          <span>完工节点 <strong>68项</strong></span>
          <span>重点企业 <strong>3家</strong></span>
        </div>
      )}

      {detail && <section className="biz-support-section" aria-label="接单业务类型分布">
        <header><strong>接单业务类型分布</strong><span>金额口径</span></header>
        <div className="biz-support-type-layout">
          <div className="biz-support-donut" style={{ background: donutBackground }} aria-label="接单金额52.80亿元">
            <div><span>接单金额</span><strong>52.80</strong><em>亿元</em></div>
          </div>
          <div className="biz-support-type-legend">
            {businessTypes.map(item => <div key={item.label}><i style={{ background: item.color }} /><span>{item.label}</span><strong>{item.value.toFixed(1)}亿</strong><em>{item.percentage}%</em></div>)}
          </div>
        </div>
      </section>}

      {detail && <section className="biz-support-section" aria-label="项目节点完成情况">
        <header><strong>项目节点完成情况</strong><span>项目数 · 全节点</span></header>
        <div className="biz-support-stage-scroll">
          <div className="biz-support-stage-chart" style={{ "--support-stage-count": projectStages.length } as React.CSSProperties}>
            {projectStages.map((stage, index) => (
              <button key={stage.label} type="button" className={selectedStageIndex === index ? "is-selected" : ""} onClick={() => setSelectedStageIndex(index)} aria-label={`${stage.label}节点${stage.value}项`}>
                <span><b style={{ height: `${Math.max(14, stage.value / stageMax * 82)}%` }}><strong>{stage.value}</strong></b></span><em>{stage.label}</em>
              </button>
            ))}
          </div>
        </div>
        <div className="biz-support-stage-detail"><strong>{selectedStage.label}节点</strong><span>{selectedStage.value}项</span><em>占全部项目 {(selectedStage.value / projectStages[0].value * 100).toFixed(0)}%</em></div>
      </section>}

      {detail && <section className="biz-support-section biz-support-company-section" aria-label="重点企业项目节点明细">
        <header><strong>重点企业节点明细</strong><span>核心节点</span></header>
        <div className="biz-support-company-head"><span>企业</span><span>完工</span><span>结算</span><span>开票</span><span>关闭</span></div>
        {companyRows.map(row => <div className="biz-support-company-row" key={row.name}><strong>{row.name}</strong><span>{row.finish}</span><span>{row.settlement}</span><span>{row.invoice}</span><span>{row.close}</span></div>)}
      </section>}
    </div>
  );
}

function PageBiz({ initialTab = "修船" }: { initialTab?: BizInsightTab } = {}) {
  const [bizTab, setBizTab] = useState<BizInsightTab>(initialTab);
  const [trendTab, setTrendTab] = useState<"月度趋势" | "区域分布">("月度趋势");
  const [repairChartTooltipIndex, setRepairChartTooltipIndex] = useState<number | null>(null);
  const [shipbuildingChartTooltipIndex, setShipbuildingChartTooltipIndex] = useState<number | null>(null);
  const [selectedMarketRegion, setSelectedMarketRegion] = useState(0);
  const [isMarketDragging, setIsMarketDragging] = useState(false);
  const marketScrollRef = useRef<HTMLDivElement | null>(null);
  const marketDragRef = useRef({ active: false, startX: 0, startScrollLeft: 0, moved: false });
  const marketSuppressClickRef = useRef(false);
  const [showDonut, setShowDonut] = useState(false);
  const [includeKawasaki, setIncludeKawasaki] = useState(false);
  const repairChartData = [
    { x: 42,  label: "南通船务", actual: 270, target: 750,  marginRate: 78 },
    { x: 104, label: "大连重工", actual: 275, target: 750,  marginRate: 70 },
    { x: 166, label: "舟山重工", actual: 380, target: 780,  marginRate: 82 },
    { x: 228, label: "上海重工", actual: 430, target: 1280, marginRate: 43 },
    { x: 290, label: "广东重工", actual: 280, target: 1250, marginRate: 76 },
  ];
  const shipbuildingChartData = [
    { x: 44, label: "南通川崎", actual: 470, target: 750, marginRate: 82 },
    { x: 92, label: "大连川崎", actual: 450, target: 750, marginRate: 70 },
    { x: 140, label: "扬州重工", actual: 360, target: 780, marginRate: 88 },
    { x: 188, label: "大连重工", actual: 280, target: 1280, marginRate: 64 },
    { x: 236, label: "舟山重工", actual: 420, target: 1250, marginRate: 72 },
    { x: 284, label: "广东重工", actual: 325, target: 1250, marginRate: 80 },
  ];
  const offshoreValueMarginData: BusinessValueMarginPoint[] = [
    { id: "offshore-zhoushan", label: "舟山重工", actual: 420, target: 680, marginRate: 76 },
    { id: "offshore-qidong", label: "启东海工", actual: 360, target: 620, marginRate: 72 },
  ];
  const marketRegions = [
    { short: "希腊区", full: "希腊区", target: 9.5, actual: 11.2 },
    { short: "中欧西葡", full: "中欧及西葡区", target: 3.1, actual: 2.7 },
    { short: "东北欧区", full: "东北欧区", target: 9.2, actual: 7.8 },
    { short: "西欧日菲", full: "西欧及日菲区", target: 5.5, actual: 4.1 },
    { short: "东南亚印度", full: "东南亚、香港及印度区", target: 10.8, actual: 9.6 },
    { short: "中东澳美韩", full: "中东、澳洲、美洲及韩国区", target: 12.6, actual: 17.8 },
    { short: "中国北方", full: "中远海运及中国北方区", target: 20.3, actual: 27.5 },
    { short: "中国中南", full: "中国中南部及台湾", target: 10.7, actual: 8.9 },
  ];
  const marketTargetTotal = marketRegions.reduce((sum, item) => sum + item.target, 0);
  const marketActualTotal = marketRegions.reduce((sum, item) => sum + item.actual, 0);
  const marketAxisMax = Math.max(10, Math.ceil(Math.max(...marketRegions.flatMap(item => [item.target, item.actual]), 0) / 10) * 10);
  const marketAxisTicks = [marketAxisMax, marketAxisMax * 2 / 3, marketAxisMax / 3, 0];
  const emptyMarketRegion = { short: "暂无", full: "暂无区域数据", target: 0, actual: 0 };
  const highestMarketRegion = marketRegions.reduce((highest, item) => item.actual > highest.actual ? item : highest, marketRegions[0] ?? emptyMarketRegion);
  const safeSelectedMarketRegion = Math.min(selectedMarketRegion, Math.max(0, marketRegions.length - 1));
  const selectedMarket = marketRegions[safeSelectedMarketRegion] ?? emptyMarketRegion;
  const scrollMarketRegions = (direction: -1 | 1) => {
    marketScrollRef.current?.scrollBy({ left: direction * 176, behavior: "smooth" });
  };
  const handleMarketPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    marketDragRef.current = {
      active: true,
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsMarketDragging(true);
  };
  const handleMarketPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = marketDragRef.current;
    if (!drag.active) return;
    const distance = event.clientX - drag.startX;
    if (Math.abs(distance) > 4) drag.moved = true;
    event.currentTarget.scrollLeft = drag.startScrollLeft - distance;
  };
  const finishMarketPointerDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!marketDragRef.current.active) return;
    marketSuppressClickRef.current = marketDragRef.current.moved;
    marketDragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsMarketDragging(false);
  };
  const orderOverview = includeKawasaki
    ? {
        summary: { target: "720.00", actual: "214.70", rate: "29.82" },
        businesses: [
          { icon: <BusinessShipbuildingIcon />, name: "船舶建造", pct: "36.04", amount: "162.88", target: "452" },
          { icon: <BusinessRepairIcon />, name: "船舶修理", pct: "14.95", amount: "15.69", target: "105" },
          { icon: <BusinessOffshoreIcon />, name: "海工业务", pct: "20.60", amount: "18.54", target: "90" },
          { icon: <BusinessSupportIcon />, name: "配套服务", pct: "24.10", amount: "17.59", target: "73" },
        ],
      }
    : {
        summary: { target: "156", actual: "106", rate: "68" },
        businesses: [
          { icon: <BusinessShipbuildingIcon />, name: "船舶建造", pct: "86", amount: "245", target: "285" },
          { icon: <BusinessRepairIcon />, name: "船舶修理", pct: "78", amount: "45", target: "58" },
          { icon: <BusinessOffshoreIcon />, name: "海工业务", pct: "72", amount: "80", target: "111" },
          { icon: <BusinessSupportIcon />, name: "配套服务", pct: "90", amount: "30", target: "33" },
        ],
      };
  const compactOrderValue = (value: string) => String(Math.round(Number(value)));
  return (
    <>
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <StatusBar />
      <NavBar title="经营主题" backLabel="返回首页" backPage="home" />
      <BreadcrumbBar crumbs={["首页", "经营主题"]} period="截至7.10" />

      {/* 经营新接订单总览 */}
      <section className="biz-order-overview">
        <div className="biz-order-summary">
          <button type="button" className="biz-order-summary-main" onClick={() => nav("biz-kpi-progress")}>
            <span className="biz-order-summary-item primary">
              <span>年度目标</span>
              <strong key={`target-${includeKawasaki}`} className="biz-order-value-change">{compactOrderValue(orderOverview.summary.target)}<em>亿</em></strong>
            </span>
            <span className="biz-order-summary-item">
              <span>已完成</span>
              <strong key={`actual-${includeKawasaki}`} className="biz-order-value-change">{compactOrderValue(orderOverview.summary.actual)}<em>亿</em></strong>
            </span>
            <span className="biz-order-summary-item">
              <span>完成率</span>
              <strong key={`rate-${includeKawasaki}`} className="biz-order-value-change">{compactOrderValue(orderOverview.summary.rate)}<em>%</em></strong>
            </span>
            <ChevronRight className="biz-order-summary-arrow" size={14} strokeWidth={2.3} />
          </button>
          <div className="biz-order-scope-inline">
            <span>包含南北川崎</span>
            <button
              type="button"
              role="switch"
              aria-checked={includeKawasaki}
              aria-label="包含南通川崎和大连川崎"
              className={`biz-order-scope-switch${includeKawasaki ? " is-on" : ""}`}
              onClick={() => setIncludeKawasaki((current) => !current)}
            >
              <span />
            </button>
          </div>
        </div>

        <div className="biz-order-grid">
          {orderOverview.businesses.map((it) => (
            <div key={it.name} className="biz-order-card">
              <span className="biz-order-card-icon">{it.icon}</span>
              <span className="biz-order-card-main">
                <span className="biz-order-card-name">{it.name}</span>
                <span key={`${it.name}-${includeKawasaki}`} className="biz-order-card-desc biz-order-value-change">新接 {compactOrderValue(it.amount)}亿 / 目标 {compactOrderValue(it.target)}亿</span>
              </span>
              <span className="biz-order-card-side">
                <span key={`${it.name}-rate-${includeKawasaki}`} className="biz-order-card-pct biz-order-value-change">{compactOrderValue(it.pct)}<em>%</em></span>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* L5 经营洞察 */}
      {(() => {
        const isRepair = bizTab === "修船";
        // 环形图数据
        const donutData = isRepair
          ? [
              { label: "散货船", n: "27艘", pct: 33, color: C.chart[0] },
              { label: "集装箱", n: "21艘", pct: 25, color: C.chart[1] },
              { label: "油船",   n: "14艘", pct: 17, color: C.chart[2] },
              { label: "海工船", n: "11艘", pct: 13, color: C.chart[3] },
              { label: "其他",   n: "9艘",  pct: 12, color: C.chart[4] },
            ]
          : [
              { label: "散货船", n: "14艘", pct: 39, color: C.chart[0] },
              { label: "集装箱", n: "10艘", pct: 28, color: C.chart[1] },
              { label: "油船",   n: "7艘",  pct: 19, color: C.chart[2] },
              { label: "海工船", n: "5艘",  pct: 14, color: C.chart[3] },
            ];
        const totalShips = isRepair ? "82艘" : "36艘";
        // 面积折线图数据点 (归一化至 viewBox 0 0 160 72)
        const pts: [number, number][] = [[0,62],[26,52],[52,46],[78,36],[104,22],[130,10],[160,6]];
        const lineD = pts.map(([x,y], i) => `${i===0?"M":"L"}${x} ${y}`).join(" ");
        const areaD = lineD + ` L160 72 L0 72 Z`;
        // 环形图 SVG
        const cx = 38, cy = 38, r = 28, sw = 9, circ = 2 * Math.PI * r;
        let dashOffset = circ / 4; // start at top
        const donutArcs = donutData.map(seg => {
          const dash = (seg.pct / 100) * circ;
          const arc = { dash, offset: dashOffset, color: seg.color };
          dashOffset -= dash;
          return arc;
        });
        return (
          <div style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 48%, #ECF5FF 100%)", border: "1px solid rgba(0,80,142,0.08)", borderRadius: 12, boxShadow: "0 4px 10px rgba(20,76,128,0.055)", margin: "0 10px 8px", overflow: "hidden" }}>
            {/* ── 卡头：标题 + 修船/造船切换 + 日期 ── */}
            <div className="biz-insight-header" style={{ padding: "10px 12px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(0,80,142,0.07)", background: "linear-gradient(90deg, rgba(236,245,255,0.72), rgba(255,255,255,0.52))" }}>
              <div style={{ display: "flex", minWidth: 0, alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.brand }}>经营洞察</span>
                {/* 切换 pill */}
                <div className="app-unified-segmented biz-insight-segmented biz-insight-segmented-four" role="tablist" aria-label="经营业务切换">
                  {(["修船", "造船", "海工", "配套"] as const).map(tab => (
                    <button key={tab} type="button" role="tab" aria-selected={bizTab === tab} className={bizTab === tab ? "is-active" : ""} onClick={() => setBizTab(tab)} style={{
                      borderRadius: 999, padding: "3px 4px", border: "none", cursor: "pointer",
                      background: bizTab === tab ? "linear-gradient(135deg, #00508E 0%, #0B69C7 100%)" : "transparent",
                      boxShadow: bizTab === tab ? "0 2px 6px rgba(0,80,142,0.18)" : "none",
                      transition: "background 150ms, box-shadow 150ms",
                    }}>
                      <span style={{ fontSize: 9, fontWeight: 600, color: bizTab === tab ? "#fff" : C.brand, whiteSpace: "nowrap" }}>{tab}</span>
                    </button>
                  ))}
                </div>
              </div>
              <span style={{ fontSize: 9, color: C.t3, flexShrink: 0 }}>截至2026.07</span>
            </div>

            {isRepair ? <RepairCoreMetricsCard /> : bizTab === "造船" ? <ShipbuildingCoreMetricsCard /> : bizTab === "海工" ? <OffshoreCoreMetricsCard /> : <SupportCoreMetricsCard />}

            {/* ── 趋势分析区 ── */}
            <div style={{ borderTop: `1px solid ${C.divider}`, margin: "9px 0 0" }}>
              <div style={{ padding: "10px 10px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                {(bizTab === "修船" || bizTab === "造船" || bizTab === "海工" || bizTab === "配套") && (
                  <>
                    <div style={{ display: "flex", minWidth: 0, alignItems: "center" }}>
                      <span style={{ overflow: "hidden", color: C.t1, fontSize: 13, fontWeight: 700, lineHeight: 1, textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {bizTab === "造船" ? "船舶建造产值及边贡" : bizTab === "海工" ? "海工建造产值及边贡" : bizTab === "配套" ? "配套营业收入分析" : trendTab === "区域分布" ? "产值市场区域分布" : "修理改装产值及边贡"}
                      </span>
                    </div>
                    {bizTab === "修船" && <div className="app-unified-segmented biz-insight-segmented biz-market-segmented" role="tablist" aria-label="经营数据视图切换">
                      {[
                        { value: "月度趋势", label: "企业" },
                        { value: "区域分布", label: "市场区域" },
                      ].map(tab => (
                        <button key={tab.value} type="button" role="tab" aria-selected={trendTab === tab.value} className={trendTab === tab.value ? "is-active" : ""} onClick={() => setTrendTab(tab.value as "月度趋势" | "区域分布")} style={{
                          borderRadius: 999, padding: "2px 9px", border: "none", cursor: "pointer",
                          background: trendTab === tab.value ? "linear-gradient(135deg, #00508E 0%, #0B69C7 100%)" : "transparent",
                          boxShadow: trendTab === tab.value ? "0 2px 6px rgba(0,80,142,0.16)" : "none",
                        }}>
                          <span style={{ fontSize: 10, fontWeight: 600, color: trendTab === tab.value ? "#fff" : C.brand }}>{tab.label}</span>
                        </button>
                      ))}
                    </div>}
                    {bizTab === "配套" && <button type="button" data-testid="support-revenue-detail-entry" className="app-drilldown-link" onClick={() => nav("biz-support-revenue-detail")}>查看全部 <ChevronRight size={13} strokeWidth={2.3} /></button>}
                  </>
                )}
              </div>

              {/* 修船：企业产值及边贡组合图 */}
              {trendTab === "月度趋势" && bizTab === "修船" && (
                <div style={{ padding: "10px 10px 14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
                    {[
                      { label: "完工产值", value: "67.41", unit: "万元" },
                      { label: "实际边贡率", value: "67.41", unit: "%" },
                    ].map(item => (
                      <div key={item.label} style={{ display: "flex", minWidth: 0, alignItems: "baseline", justifyContent: "center", gap: 6, borderRadius: 5, background: "rgba(217,236,255,0.56)", padding: "6px 8px" }}>
                        <span style={{ color: C.t2, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>{item.label}</span>
                        <span style={{ color: C.brand, fontSize: 20, fontWeight: 700, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{item.value}</span>
                        <span style={{ color: C.t2, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>{item.unit}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 13, marginBottom: 4 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.t2, fontSize: 10 }}>
                      <i style={{ width: 9, height: 9, borderRadius: 2, background: C.brand, display: "inline-block" }} />
                      实际产值
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.t2, fontSize: 10 }}>
                      <i style={{ width: 9, height: 9, border: "1px solid #7897B2", borderRadius: 2, background: "#AFC4D6", display: "inline-block" }} />
                      目标产值
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.t2, fontSize: 10 }}>
                      <i style={{ width: 12, height: 2, borderRadius: 999, background: C.success, display: "inline-block" }} />
                      实际边贡率（%）
                    </span>
                  </div>

                  <svg width="100%" height="210" viewBox="0 0 320 210" preserveAspectRatio="none" style={{ display: "block" }}>
                    <defs>
                      <linearGradient id="repairMarginArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.success} stopOpacity="0.22" />
                        <stop offset="100%" stopColor={C.success} stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="repairActualBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#79BBFF" />
                        <stop offset="100%" stopColor={C.brand} />
                      </linearGradient>
                      <linearGradient id="repairTargetBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#B9CDDE" />
                        <stop offset="100%" stopColor="#91AAC0" />
                      </linearGradient>
                      <filter id="repairTooltipShadow" x="-20%" y="-20%" width="140%" height="150%">
                        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#10263A" floodOpacity="0.24" />
                      </filter>
                    </defs>

                    <text x="4" y="16" fontSize="10" fill={C.t3}>万元</text>
                    <text x="300" y="16" fontSize="10" fill={C.t3}>%</text>
                    {[0, 1, 2, 3, 4].map(i => {
                      const y = 34 + i * 32;
                      const left = 800 - i * 200;
                      const right = 100 - i * 20;
                      return (
                        <g key={i}>
                          <line x1="28" y1={y} x2="288" y2={y} stroke={C.divider} strokeWidth="0.8" />
                          <text x="22" y={y + 4} textAnchor="end" fontSize="10" fill={C.t3}>{left}</text>
                          <text x="294" y={y + 4} fontSize="10" fill={C.t3}>{right}</text>
                        </g>
                      );
                    })}

                    {repairChartData.map(item => {
                      const targetH = Math.max(34, Math.min(116, item.target / 1280 * 116));
                      const actualH = Math.max(30, Math.min(110, item.actual / 800 * 110));
                      return (
                        <g key={item.label}>
                          <rect x={item.x - 7} y={162 - targetH} width="14" height={targetH} rx="7" fill="url(#repairTargetBar)" stroke="#7897B2" strokeWidth="0.9" />
                          <rect x={item.x - 7} y={162 - actualH} width="14" height={actualH} rx="7" fill="url(#repairActualBar)" />
                        </g>
                      );
                    })}

                    {/* 面积与趋势线置于柱体上层，避免目标柱遮挡趋势。 */}
                    <path d="M42 70 C54 42 69 43 82 70 C95 92 109 82 122 60 C139 31 158 48 176 74 C192 98 204 121 218 125 C234 129 247 93 258 93 C272 93 282 76 292 70 L292 162 L42 162 Z" fill="url(#repairMarginArea)" pointerEvents="none" />
                    <path d="M42 70 C54 42 69 43 82 70 C95 92 109 82 122 60 C139 31 158 48 176 74 C192 98 204 121 218 125 C234 129 247 93 258 93 C272 93 282 76 292 70" fill="none" stroke={C.success} strokeWidth="2.2" strokeLinecap="round" pointerEvents="none" />

                    {repairChartData.map(item => {
                      const targetH = Math.max(34, Math.min(116, item.target / 1280 * 116));
                      return (
                        <g key={`${item.label}-labels`} pointerEvents="none">
                          <text x={item.x} y={154 - targetH} textAnchor="middle" fontSize="10" fill={C.t2}>{item.target}</text>
                          <text x={item.x} y="184" textAnchor="middle" fontSize="10" fill={C.t2}>{item.label}</text>
                        </g>
                      );
                    })}

                    <text x="17" y="166" textAnchor="end" fontSize="10" fill={C.t3}>0</text>
                    <text x="304" y="166" fontSize="10" fill={C.t3}>20</text>
                    <line x1="24" y1="162" x2="292" y2="162" stroke={C.divider} strokeWidth="0.8" />

                    {repairChartData.map((item, index) => (
                      <rect
                        key={`${item.label}-touch`}
                        x={Math.max(24, item.x - 27)}
                        y="26"
                        width={item.x === 290 ? 30 : 54}
                        height="166"
                        fill="transparent"
                        role="button"
                        tabIndex={0}
                        aria-label={`${item.label}，实际产值${item.actual}万元，目标产值${item.target}万元，实际边贡率${item.marginRate}%`}
                        style={{ cursor: "pointer", outline: "none", touchAction: "pan-y" }}
                        onPointerEnter={(event) => {
                          if (event.pointerType === "mouse") setRepairChartTooltipIndex(index);
                        }}
                        onPointerLeave={(event) => {
                          if (event.pointerType === "mouse") setRepairChartTooltipIndex(null);
                        }}
                        onPointerDown={(event) => {
                          if (event.pointerType !== "mouse") {
                            setRepairChartTooltipIndex(index);
                          }
                        }}
                        onFocus={() => setRepairChartTooltipIndex(index)}
                        onBlur={() => setRepairChartTooltipIndex(null)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setRepairChartTooltipIndex(index);
                          }
                        }}
                      />
                    ))}

                    {repairChartTooltipIndex !== null && (() => {
                      const item = repairChartData[repairChartTooltipIndex];
                      const tooltipX = Math.max(6, Math.min(186, item.x - 62));
                      const marginY = 162 - ((item.marginRate - 20) / 80) * 128;
                      return (
                        <g pointerEvents="none">
                          <line x1={item.x} y1="28" x2={item.x} y2="162" stroke="#7897B2" strokeWidth="1" strokeDasharray="3 3" opacity="0.72" />
                          <circle cx={item.x} cy={marginY} r="4" fill="#FFFFFF" stroke={C.success} strokeWidth="2" />
                          <g filter="url(#repairTooltipShadow)">
                            <rect x={tooltipX} y="28" width="128" height="76" rx="7" fill="#26384A" fillOpacity="0.97" />
                            <text x={tooltipX + 10} y="44" fontSize="10" fontWeight="700" fill="#FFFFFF">{item.label}</text>
                            <circle cx={tooltipX + 11} cy="57" r="3" fill={C.brand} />
                            <text x={tooltipX + 19} y="60" fontSize="9" fill="#DCE8F2">实际产值</text>
                            <text x={tooltipX + 118} y="60" textAnchor="end" fontSize="9" fontWeight="700" fill="#FFFFFF">{item.actual} 万元</text>
                            <circle cx={tooltipX + 11} cy="73" r="3" fill="#AFC4D6" stroke="#7897B2" strokeWidth="0.8" />
                            <text x={tooltipX + 19} y="76" fontSize="9" fill="#DCE8F2">目标产值</text>
                            <text x={tooltipX + 118} y="76" textAnchor="end" fontSize="9" fontWeight="700" fill="#FFFFFF">{item.target} 万元</text>
                            <line x1={tooltipX + 8} y1="89" x2={tooltipX + 14} y2="89" stroke={C.success} strokeWidth="2" strokeLinecap="round" />
                            <text x={tooltipX + 19} y="92" fontSize="9" fill="#DCE8F2">实际边贡率</text>
                            <text x={tooltipX + 118} y="92" textAnchor="end" fontSize="9" fontWeight="700" fill="#FFFFFF">{item.marginRate}%</text>
                          </g>
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              )}

              {/* 造船：产值及边贡组合图 */}
              {bizTab === "造船" && (
                <div style={{ padding: "10px 10px 14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
                    {[
                      { label: "总产值", value: "67.41", unit: "万元" },
                      { label: "预计边贡率", value: "67.41", unit: "%" },
                    ].map(item => (
                      <div key={item.label} style={{ display: "flex", minWidth: 0, alignItems: "baseline", justifyContent: "center", gap: 6, borderRadius: 5, background: "rgba(217,236,255,0.56)", padding: "6px 8px" }}>
                        <span style={{ color: C.t2, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>{item.label}</span>
                        <span style={{ color: C.brand, fontSize: 20, fontWeight: 700, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{item.value}</span>
                        <span style={{ color: C.t2, fontSize: 11, fontWeight: 500, whiteSpace: "nowrap" }}>{item.unit}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 13, marginBottom: 4 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.t2, fontSize: 10 }}>
                      <i style={{ width: 9, height: 9, borderRadius: 2, background: C.brand, display: "inline-block" }} />
                      实际产值
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.t2, fontSize: 10 }}>
                      <i style={{ width: 9, height: 9, border: "1px solid #7897B2", borderRadius: 2, background: "#AFC4D6", display: "inline-block" }} />
                      目标产值
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: C.t2, fontSize: 10 }}>
                      <i style={{ width: 12, height: 2, borderRadius: 999, background: C.success, display: "inline-block" }} />
                      预计边贡率（%）
                    </span>
                  </div>

                  <svg width="100%" height="210" viewBox="0 0 320 210" preserveAspectRatio="none" style={{ display: "block" }}>
                    <defs>
                      <linearGradient id="shipbuildingMarginArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={C.success} stopOpacity="0.22" />
                        <stop offset="100%" stopColor={C.success} stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="shipbuildingActualBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#79BBFF" />
                        <stop offset="100%" stopColor={C.brand} />
                      </linearGradient>
                      <linearGradient id="shipbuildingTargetBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#B9CDDE" />
                        <stop offset="100%" stopColor="#91AAC0" />
                      </linearGradient>
                      <filter id="shipbuildingTooltipShadow" x="-20%" y="-20%" width="140%" height="150%">
                        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#10263A" floodOpacity="0.24" />
                      </filter>
                    </defs>

                    <text x="4" y="16" fontSize="10" fill={C.t3}>万元</text>
                    <text x="300" y="16" fontSize="10" fill={C.t3}>%</text>
                    {[0, 1, 2, 3, 4].map(i => {
                      const y = 34 + i * 32;
                      const left = 800 - i * 200;
                      const right = 100 - i * 20;
                      return (
                        <g key={i}>
                          <line x1="28" y1={y} x2="288" y2={y} stroke={C.divider} strokeWidth="0.8" />
                          <text x="22" y={y + 4} textAnchor="end" fontSize="10" fill={C.t3}>{left}</text>
                          <text x="294" y={y + 4} fontSize="10" fill={C.t3}>{right}</text>
                        </g>
                      );
                    })}

                    {shipbuildingChartData.map(item => {
                      const targetH = Math.max(34, Math.min(116, item.target / 1250 * 116));
                      const actualH = Math.max(30, Math.min(110, item.actual / 800 * 110));
                      return (
                        <g key={item.label}>
                          <rect x={item.x - 7} y={162 - targetH} width="14" height={targetH} rx="7" fill="url(#shipbuildingTargetBar)" stroke="#7897B2" strokeWidth="0.9" />
                          <rect x={item.x - 7} y={162 - actualH} width="14" height={actualH} rx="7" fill="url(#shipbuildingActualBar)" />
                        </g>
                      );
                    })}

                    {/* 与修船图一致：面积与趋势线覆盖在柱体之上。 */}
                    <path d="M44 62 C58 36 72 37 92 72 C107 101 121 38 140 44 C160 49 176 78 188 95 C207 120 221 102 236 85 C252 69 270 95 284 74 L284 162 L44 162 Z" fill="url(#shipbuildingMarginArea)" pointerEvents="none" />
                    <path d="M44 62 C58 36 72 37 92 72 C107 101 121 38 140 44 C160 49 176 78 188 95 C207 120 221 102 236 85 C252 69 270 95 284 74" fill="none" stroke={C.success} strokeWidth="2.2" strokeLinecap="round" pointerEvents="none" />

                    {shipbuildingChartData.map(item => {
                      const targetH = Math.max(34, Math.min(116, item.target / 1250 * 116));
                      return (
                        <g key={`${item.label}-labels`} pointerEvents="none">
                          <text x={item.x} y={154 - targetH} textAnchor="middle" fontSize="10" fill={C.t2}>{item.target}</text>
                          <text x={item.x} y="184" textAnchor="middle" fontSize="10" fill={C.t2}>{item.label}</text>
                        </g>
                      );
                    })}

                    <text x="17" y="166" textAnchor="end" fontSize="10" fill={C.t3}>0</text>
                    <text x="304" y="166" fontSize="10" fill={C.t3}>20</text>
                    <line x1="24" y1="162" x2="292" y2="162" stroke={C.divider} strokeWidth="0.8" />

                    {shipbuildingChartData.map((item, index) => (
                      <rect
                        key={`${item.label}-touch`}
                        x={Math.max(24, item.x - 23)}
                        y="26"
                        width={item.x === 284 ? 31 : 46}
                        height="166"
                        fill="transparent"
                        role="button"
                        tabIndex={0}
                        aria-label={`${item.label}，实际产值${item.actual}万元，目标产值${item.target}万元，预计边贡率${item.marginRate}%`}
                        style={{ cursor: "pointer", outline: "none", touchAction: "pan-y" }}
                        onPointerEnter={(event) => {
                          if (event.pointerType === "mouse") setShipbuildingChartTooltipIndex(index);
                        }}
                        onPointerLeave={(event) => {
                          if (event.pointerType === "mouse") setShipbuildingChartTooltipIndex(null);
                        }}
                        onPointerDown={(event) => {
                          if (event.pointerType !== "mouse") setShipbuildingChartTooltipIndex(index);
                        }}
                        onClick={() => setShipbuildingChartTooltipIndex(index)}
                        onFocus={() => setShipbuildingChartTooltipIndex(index)}
                        onBlur={() => setShipbuildingChartTooltipIndex(null)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setShipbuildingChartTooltipIndex(index);
                          }
                        }}
                      />
                    ))}

                    {shipbuildingChartTooltipIndex !== null && (() => {
                      const item = shipbuildingChartData[shipbuildingChartTooltipIndex];
                      const tooltipX = Math.max(6, Math.min(186, item.x - 62));
                      const marginY = 162 - ((item.marginRate - 20) / 80) * 128;
                      return (
                        <g pointerEvents="none">
                          <line x1={item.x} y1="28" x2={item.x} y2="162" stroke="#7897B2" strokeWidth="1" strokeDasharray="3 3" opacity="0.72" />
                          <circle cx={item.x} cy={marginY} r="4" fill="#FFFFFF" stroke={C.success} strokeWidth="2" />
                          <g filter="url(#shipbuildingTooltipShadow)">
                            <rect x={tooltipX} y="28" width="128" height="76" rx="7" fill="#26384A" fillOpacity="0.97" />
                            <text x={tooltipX + 10} y="44" fontSize="10" fontWeight="700" fill="#FFFFFF">{item.label}</text>
                            <circle cx={tooltipX + 11} cy="57" r="3" fill={C.brand} />
                            <text x={tooltipX + 19} y="60" fontSize="9" fill="#DCE8F2">实际产值</text>
                            <text x={tooltipX + 118} y="60" textAnchor="end" fontSize="9" fontWeight="700" fill="#FFFFFF">{item.actual} 万元</text>
                            <circle cx={tooltipX + 11} cy="73" r="3" fill="#AFC4D6" stroke="#7897B2" strokeWidth="0.8" />
                            <text x={tooltipX + 19} y="76" fontSize="9" fill="#DCE8F2">目标产值</text>
                            <text x={tooltipX + 118} y="76" textAnchor="end" fontSize="9" fontWeight="700" fill="#FFFFFF">{item.target} 万元</text>
                            <line x1={tooltipX + 8} y1="89" x2={tooltipX + 14} y2="89" stroke={C.success} strokeWidth="2" strokeLinecap="round" />
                            <text x={tooltipX + 19} y="92" fontSize="9" fill="#DCE8F2">预计边贡率</text>
                            <text x={tooltipX + 118} y="92" textAnchor="end" fontSize="9" fontWeight="700" fill="#FFFFFF">{item.marginRate}%</text>
                          </g>
                        </g>
                      );
                    })()}
                  </svg>
                </div>
              )}

              {/* 海工：沿用统一产值及边贡组件，仅展示海工企业模拟数据。 */}
              {bizTab === "海工" && (
                <BusinessValueMarginChart
                  metrics={[
                    { label: "总产值", value: "780.00", unit: "万元" },
                    { label: "预计边贡率", value: "74.20", unit: "%" },
                  ]}
                  points={offshoreValueMarginData}
                />
              )}

              {/* 配套：营业收入、接单结构与项目节点分析。 */}
              {bizTab === "配套" && <SupportRevenueAnalysis />}

              {/* 区域分布（修船）：柱状+折线组合图 */}
              {trendTab === "区域分布" && bizTab === "修船" && (
                <div className="biz-market-panel">
                  <div className="biz-market-summary">
                    <span>实际金额 <strong>{marketActualTotal.toFixed(1)}</strong><small>亿</small></span>
                    <span>达成率 <strong>{marketTargetTotal > 0 ? (marketActualTotal / marketTargetTotal * 100).toFixed(0) : "—"}</strong><small>%</small></span>
                    <span>最高区域 <strong>{highestMarketRegion.short}</strong></span>
                  </div>
                  <div className="biz-market-legend">
                    <span><i className="is-actual" />实际金额</span>
                    <span><i className="is-target" />目标金额</span>
                    <em>左右滑动或拖拽</em>
                    <span className="biz-market-scroll-actions" aria-label="区域图横向浏览">
                      <button type="button" onClick={() => scrollMarketRegions(-1)} aria-label="向左查看区域">‹</button>
                      <button type="button" onClick={() => scrollMarketRegions(1)} aria-label="向右查看区域">›</button>
                    </span>
                  </div>
                  <div className="biz-market-chart-shell">
                    <div className="biz-market-axis" aria-hidden="true">
                      {marketAxisTicks.map((tick, index) => <span key={index}>{Number.isInteger(tick) ? tick : tick.toFixed(1)}</span>)}
                      <small>亿元</small>
                    </div>
                    <div
                      ref={marketScrollRef}
                      className={`biz-market-scroll ${isMarketDragging ? "is-dragging" : ""}`}
                      onPointerDown={handleMarketPointerDown}
                      onPointerMove={handleMarketPointerMove}
                      onPointerUp={finishMarketPointerDrag}
                      onPointerCancel={finishMarketPointerDrag}
                      onWheel={(event) => {
                        if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
                        event.currentTarget.scrollLeft += event.deltaY;
                        event.preventDefault();
                      }}
                    >
                      <div className="biz-market-grid" style={{ "--market-column-count": Math.max(marketRegions.length, 1) } as React.CSSProperties}>
                        {marketRegions.length === 0 && <div className="biz-market-empty">暂无市场区域数据</div>}
                        {marketRegions.map((item, index) => {
                          const actualHeight = Math.max(10, item.actual / marketAxisMax * 100);
                          const targetPosition = Math.max(8, item.target / marketAxisMax * 100);
                          const achieved = item.actual >= item.target;
                          return (
                            <button
                              type="button"
                              className={`biz-market-column ${safeSelectedMarketRegion === index ? "is-selected" : ""}`}
                              key={item.full}
                              onClick={() => {
                                if (marketSuppressClickRef.current) {
                                  marketSuppressClickRef.current = false;
                                  return;
                                }
                                setSelectedMarketRegion(index);
                              }}
                              aria-label={`${item.full}，目标${item.target}亿元，实际${item.actual}亿元`}
                            >
                              <span className="biz-market-plot">
                                <b style={{ height: `${actualHeight}%` }}>
                                  <strong>{item.actual}</strong>
                                </b>
                                <i className={achieved ? "is-achieved" : "is-behind"} style={{ bottom: `${targetPosition}%` }} />
                              </span>
                              <span className="biz-market-label">{item.short}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  {marketRegions.length > 0 && <div className={`biz-market-detail ${selectedMarket.actual >= selectedMarket.target ? "is-achieved" : "is-behind"}`}>
                    <strong>{selectedMarket.full}</strong>
                    <span>目标 {selectedMarket.target.toFixed(1)}亿</span>
                    <span>实际 {selectedMarket.actual.toFixed(1)}亿</span>
                    <em>{selectedMarket.actual >= selectedMarket.target ? "超目标" : "距目标"} {Math.abs(selectedMarket.actual - selectedMarket.target).toFixed(1)}亿</em>
                  </div>}
                </div>
              )}

            </div>
          </div>
        );
      })()}

      {/* 经营收款：修船/配套为逾期口径，造船/海工为计划口径 */}
      <CollectionPlanOverviewCard business={bizTab} />

      {/* L6 本周重点项目进展 */}
      <div className="biz-project-entry-card">
        <div className="biz-project-entry-head">
          <div className="biz-project-entry-title">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="7" height="7" rx="1.5" fill={C.phDark}/>
              <rect x="10" y="1" width="7" height="7" rx="1.5" fill={C.phDark}/>
              <rect x="1" y="10" width="7" height="7" rx="1.5" fill={C.phDark}/>
              <rect x="10" y="10" width="7" height="7" rx="1.5" fill={C.phDark}/>
            </svg>
            <span>本周重点项目进展</span>
          </div>
          <span className="biz-project-entry-subtitle">按业务板块查看</span>
        </div>
        <div className="biz-project-entry-grid">
          {[
            { label: "船舶修理", Icon: BusinessRepairIcon, page: "biz-progress-repair" },
            { label: "船舶建造", Icon: BusinessShipbuildingIcon, page: "biz-progress-shipbuilding" },
            { label: "海工业务", Icon: BusinessOffshoreIcon, page: "biz-progress-offshore" },
            { label: "配套服务", Icon: BusinessSupportIcon, page: "biz-progress-support" },
          ].map(({ label, Icon, page }) => (
            <button key={label} type="button" className="biz-project-entry-item" onClick={() => nav(page)}>
              <span className="biz-project-entry-icon"><Icon /></span>
              <span className="biz-project-entry-name">{label}</span>
              <span className="biz-project-entry-count">10项 <ChevronRight size={11} strokeWidth={2.4} /></span>
            </button>
          ))}
        </div>
      </div>

      <Footer text="经营主题 · 数据口径随时间切换 · 返回首页保留时间上下文" />
    </>
  );
}

type BizProjectSection = "repair" | "shipbuilding" | "offshore" | "support";

const BIZ_PROJECTS: Record<BizProjectSection, {
  index: string;
  name: string;
  count: string;
  company: string;
  owner: string;
  progress: string;
}[]> = {
  repair: [
    { index: "01", name: "集装箱船节能改装", count: "1艘", company: "南通船务", owner: "中远海运集运", progress: "节能装置方案完成评审，关键设备已进入采购阶段，计划本月底进厂施工。" },
    { index: "02", name: "VLCC坞修项目", count: "2艘", company: "舟山重工", owner: "中远海运能源", progress: "船东技术澄清已完成，坞期及生产资源完成锁定，重点跟踪长周期物资到货。" },
  ],
  shipbuilding: [
    { index: "01", name: "PANAMAX（带艏装载）", count: "2艘", company: "启东海工", owner: "中远海运能源", progress: "意向书已大签，重工已过会。跟踪能源董事会上会进展（预计4月中旬）。" },
    { index: "02", name: "13kTEU集装箱船", count: "12艘", company: "扬州重工", owner: "中远海运集运", progress: "常规燃料和 LNG 双燃料方案详规均已提供，技术沟通谈判预计延迟至3月末或4月初。" },
  ],
  offshore: [
    { index: "01", name: "FPSO模块建造项目", count: "1座", company: "启东海工", owner: "海洋石油工程", progress: "详细设计按计划推进，首批结构件已开工，当前重点协调核心设备接口资料。" },
    { index: "02", name: "海上风电安装平台", count: "1座", company: "大连重工", owner: "中远海运特运", progress: "主船体分段进入连续建造阶段，关键节点总体受控，计划下月完成阶段性验收。" },
  ],
  support: [
    { index: "01", name: "船用配套设备升级", count: "6套", company: "南通重工装备", owner: "扬州重工", progress: "首套设备完成联调，剩余设备按船期分批交付，当前重点跟踪现场安装反馈。" },
    { index: "02", name: "智能能效系统交付", count: "4套", company: "威海重工科技", owner: "大连川崎", progress: "系统功能测试完成，船端数据接口已联通，计划本周完成用户验收。" },
  ],
};

function PageBizProgress({ section = "shipbuilding" }: { section?: BizProjectSection }) {
  const [selectedCompany, setSelectedCompany] = useState("all");
  const projects = BIZ_PROJECTS[section];
  const companies = Array.from(new Set(projects.map(project => project.company)));
  const visibleProjects = selectedCompany === "all"
    ? projects
    : projects.filter(project => project.company === selectedCompany);
  return (
    <>
      <StatusBar />
      <NavBar title="经营主题" backLabel="返回经营主题" backPage="biz" />
      <BreadcrumbBar crumbs={["首页", "经营主题", "本周进展"]} period="截至7.10" />

      <Card
        title="本周重点项目进展明细"
        className="mt-3 biz-project-detail-card"
        extra={(
          <label className="biz-project-company-filter">
            <span>承建企业</span>
            <span className="biz-project-company-select">
              <select
                value={selectedCompany}
                onChange={(event) => setSelectedCompany(event.target.value)}
                aria-label="按承建企业筛选项目"
              >
                <option value="all">全部企业</option>
                {companies.map(company => <option key={company} value={company}>{company}</option>)}
              </select>
              <ChevronDown size={12} strokeWidth={2.2} aria-hidden="true" />
            </span>
          </label>
        )}
      >
        <div className="biz-project-detail-list">
          {visibleProjects.map(project => <article key={project.index} className="biz-project-detail-item">
            <header><span>{project.index}</span><strong>{project.name}</strong><StatusBadge tone="info">{project.count}</StatusBadge></header>
            <dl><div><dt>船东</dt><dd>{project.owner}</dd></div></dl>
            <div className="biz-project-detail-progress"><span>项目进展</span><p>{project.progress}</p></div>
          </article>)}
          {visibleProjects.length === 0 && (
            <div className="biz-project-detail-empty">
              当前承建企业暂无重点项目
            </div>
          )}
        </div>
      </Card>

      <Footer text="本周重点项目进展明细 · 数据随时间口径切换" />
    </>
  );
}

function PageBizRepairArea() {
  return (
    <>
      <StatusBar />
      <NavBar title="经营主题" backLabel="返回经营主题" backPage="biz" />
      <BreadcrumbBar crumbs={["首页", "经营主题"]} />

      <Card title="经营速览" className="mt-3">
        <SegCtrl options={["修船", "造船"]} sel="修船" />
        <div style={{ fontSize: 11, color: C.t3, marginBottom: 8 }}>切换至 修船-市场区域</div>
        <TabCtrl options={["月度趋势", "区域分布"]} sel="区域分布" />
        {/* Horizontal bar chart: repair ship market regions */}
        {(() => {
          const regions = [
            { label: "东南亚", pct: 38 },
            { label: "欧洲",   pct: 22 },
            { label: "中东",   pct: 18 },
            { label: "美洲",   pct: 12 },
            { label: "其他",   pct: 10 },
          ];
          const W = 300, H = 140;
          const padL = 44, padR = 40, padT = 10, padB = 10;
          const rowH = (H - padT - padB) / regions.length;
          const barAreaW = W - padL - padR;
          return (
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", display: "block" }}>
              {regions.map((r, i) => {
                const y = padT + i * rowH;
                const barW = (r.pct / 100) * barAreaW;
                const barH = rowH * 0.45;
                const barY = y + (rowH - barH) / 2;
                return (
                  <g key={r.label}>
                    <text x={padL - 4} y={barY + barH / 2 + 3} textAnchor="end" fontSize={9} fill={C.t2}>{r.label}</text>
                    <rect x={padL} y={barY} width={barAreaW} height={barH} fill={C.ph} />
                    <rect x={padL} y={barY} width={barW} height={barH} fill={i === 0 ? C.t1 : C.phDark} />
                    <text x={padL + barW + 4} y={barY + barH / 2 + 3} fontSize={9} fill={C.t2}>{r.pct}%</text>
                  </g>
                );
              })}
              <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={C.border} strokeWidth="1" />
              <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={C.border} strokeWidth="1" />
            </svg>
          );
        })()}
      </Card>

      <Footer text="经营速览 · 修船-市场区域口径" />
    </>
  );
}


function PageBizKpiProgress() {
  const timeProgress = 24.82;
  const rows = [
    {
      label: "船舶建造",
      target: 452, actual: 162.88, rate: "36.04%",
      subs: [{ name: "本部", rate: "50.23%" }, { name: "川崎", rate: "17.33%" }],
    },
    { label: "船舶修理改装", target: 105, actual: 15.69,  rate: "14.95%", subs: [] },
    { label: "海工业务",     target: 90,  actual: 18.54,  rate: "20.60%", subs: [] },
    { label: "配套业务",     target: 73,  actual: 17.59,  rate: "24.10%", subs: [] },
  ];
  return (
    <>
      <StatusBar />
      <NavBar title="年度接单指标进度" subtitle="经营口径" backLabel="返回经营主题" backPage="biz" />
      <BreadcrumbBar crumbs={["首页", "经营主题", "指标进度"]} period="截至7.10" />

      {/* 英雄卡：深色背景 */}
      <div className="app-kpi-hero biz-progress-hero">
        <img className="biz-progress-ship-3d" src="/assets/order-ship-3d.png" alt="" aria-hidden="true" />
        <div className="biz-progress-hero-title">年度接单总体进度</div>
        <div className="biz-progress-hero-value">
          29.82<span>%</span>
        </div>
        <div className="biz-progress-hero-meta">
          <span>累计已接单 <strong>214.70</strong> 亿</span>
          <i aria-hidden="true" />
          <span>全年目标 <strong>720.00</strong> 亿</span>
        </div>
        {/* 总进度条 */}
        <Progress value={29.82} className="biz-progress-hero-bar" />
        <div className="biz-progress-status-line">
          <span aria-hidden="true" />
          提示：接单目标实际进度较时间进度超5%，进度正常
        </div>
      </div>

      {/* 各业务进度条图 */}
      <div className="app-dashboard-card biz-progress-panel">
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 16 }}>各业务板块接单进度</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {rows.map((row) => {
            const rateValue = Number.parseFloat(row.rate);
            const isAheadOfTime = rateValue >= timeProgress;
            return (
              <div key={row.label} className="biz-progress-item">
                <div className="biz-progress-item-head">
                  <span className="biz-progress-item-name">{row.label}</span>
                  <span className="biz-progress-target">目标 <strong>{row.target}</strong> 亿</span>
                  <span className="biz-progress-actual">已接 <strong>{row.actual}</strong> 亿</span>
                </div>
                <div className="biz-progress-item-track-row">
                  <Progress value={rateValue} className="biz-progress-track" aria-label={`${row.label}接单进度 ${row.rate}`} />
                  <strong className={`biz-progress-rate ${isAheadOfTime ? "is-ahead" : "is-behind"}`} aria-label={`${row.rate}，${isAheadOfTime ? "高于" : "低于"}时间进度`}>
                    {row.rate}
                  </strong>
                </div>
                {/* 细分子标注（船舶建造专用） */}
                {row.subs.length > 0 && (
                  <div style={{ display: "flex", gap: 12, marginTop: 5 }}>
                    {row.subs.map(s => (
                      <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 5, height: 5, borderRadius: 1, background: C.phDark }} />
                        <span style={{ fontSize: 9, color: C.t3 }}>{s.name}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: C.t2 }}>{s.rate}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 图例 */}
        <div style={{ display: "flex", gap: 14, marginTop: 18, paddingTop: 12, borderTop: `1px solid ${C.divider}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 16, height: 8, borderRadius: 2, background: C.brand }} />
            <span style={{ fontSize: 9, color: C.t3 }}>已接单金额</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 16, height: 8, borderRadius: 2, background: C.ph }} />
            <span style={{ fontSize: 9, color: C.t3 }}>年度目标额</span>
          </div>
        </div>

        {/* 底部短板提示 */}
        <div className="app-alert-strip biz-progress-note">
          <span>注：</span>
          <span>船舶建造板块完成进度领先，整体接单进度符合时间预期</span>
        </div>
      </div>

      <Footer text="指标进度 · 年度接单口径 · 截至7.10" />
    </>
  );
}

function PageBizCollectionPlan({ business }: { business: CollectionPlanBusiness }) {
  const [filter, setFilter] = useState<CollectionFilter>("全部");
  const config = COLLECTION_PLAN_CONFIG[business];
  const summary = config.summary;
  const projects = config.projects;
  const visibleProjects = projects.filter((project) => matchesCollectionFilter(project, filter));

  return (
    <>
      <StatusBar />
      <NavBar title={`${business}${config.title}`} subtitle={`${business}·经营口径`} backLabel={`返回${business}经营洞察`} backPage={config.returnRoute} />
      <BreadcrumbBar crumbs={["首页", "经营主题", `${business}${config.title}`]} period="截至2026.07" />

      <section className="collection-plan-summary" aria-label={`${config.title}概览`}>
        <div className="collection-plan-summary-head">
          <span>{summary.heading}</span><small>单位：万元</small>
        </div>
        <div className="collection-plan-summary-values">
          <div><span>{summary.primary.label}</span><strong>{summary.primary.value}</strong></div>
          <div className={summary.secondary.tone === "danger" ? "is-risk" : "is-success"}><span>{summary.secondary.label}</span><strong>{summary.secondary.value}</strong></div>
        </div>
        <div className={`collection-plan-progress is-${summary.progress.tone}`} aria-label={`${summary.progress.label}${summary.progress.value}`}><i style={{ width: summary.progress.width }} /></div>
        <div className={`collection-plan-progress-meta is-${summary.progress.tone}`}><span>{summary.progress.label} <b>{summary.progress.value}</b></span><em>{summary.progress.meta}</em></div>
        <div className="collection-plan-summary-stats">
          {summary.stats.map((stat) => <div key={stat.label} className={stat.tone === "risk" ? "is-risk" : ""}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
        </div>
      </section>

      <section className="collection-plan-detail" aria-labelledby="collection-plan-detail-title">
        <div className="collection-plan-detail-head">
          <div><ClipboardList aria-hidden="true" /><span id="collection-plan-detail-title">{config.flow === "overdue" ? "项目逾期收款明细" : "项目收款计划明细"}</span></div>
          <small>共 {visibleProjects.length} 项</small>
        </div>
        <div className="collection-plan-filters" role="tablist" aria-label="收款状态筛选">
          {(["全部", "待收", "逾期"] as const).map((item) => (
            <button key={item} type="button" role="tab" aria-selected={filter === item} className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>
          ))}
        </div>
        <div className="collection-plan-project-list">
          {visibleProjects.length === 0 && (
            <div className="collection-plan-empty" role="status">
              <ClipboardList aria-hidden="true" />
              <strong>暂无匹配项目</strong>
              <span>当前筛选条件下没有可展示的收款记录</span>
            </div>
          )}
          {visibleProjects.map((project) => {
            const agingItems = getCollectionAgingItems(project);
            const hasOverdue = parseCollectionAmount(project.overdue) > 0;
            const isReceived = project.status === "已完成收款";
            return <article className="collection-plan-project" key={project.code}>
              <div className="collection-plan-project-head">
                <div><small>{project.code}</small><strong>{project.name}</strong></div>
                <span className={isReceived ? "is-received" : "is-pending"}>{project.status}</span>
              </div>
              <div className="collection-plan-customer-row">
                <span>客户名称 <b>{project.customer}</b></span>
                {project.customerImportance && <em>客户重要性 {project.customerImportance}</em>}
                {project.customerCredit && <em>客户资信 {project.customerCredit}</em>}
              </div>
              <div className="collection-plan-amount-grid">
                <div><span>期末账面余额</span><strong>{project.balance}<small>万元</small></strong></div>
                <div className={hasOverdue ? "is-risk" : ""}><span>逾期应收账款合计</span><strong>{project.overdue}<small>万元</small></strong></div>
              </div>
              <div className="collection-plan-project-meta">
                <span>合同约定付款日 <b>{project.dueDate}</b></span>
              </div>
              {hasOverdue && (
                <div className="collection-plan-overdue-detail">
                  <span>本月新增逾期 <b>{project.monthNew}万元</b></span>
                  {agingItems.length > 0 && (
                  <div className="collection-plan-aging">
                    <span>非零账龄分布</span>
                    <div>{agingItems.map(([label, value]) => (
                    <span key={String(label)}><small>{label}</small><b>{Number(value).toLocaleString()}</b></span>
                    ))}</div>
                  </div>
                  )}
                </div>
              )}
              <div className="collection-plan-risk-row">
                <span className={`is-${project.risk === "高风险" ? "high" : project.risk === "中风险" ? "medium" : "low"}`}>回收风险评级：{project.risk}</span>
                <p><b>风险评级依据：</b>{project.reason}</p>
              </div>
            </article>
          })}
        </div>
      </section>
      <Footer text={`${config.title} · ${business}经营口径 · 模拟数据`} />
    </>
  );
}

function PageBizSupportRevenueDetail() {
  return (
    <>
      <StatusBar />
      <NavBar title="配套营业收入分析" subtitle="配套·经营口径" backLabel="返回配套经营洞察" backPage="biz-support" />
      <BreadcrumbBar crumbs={["首页", "经营主题", "配套营业收入分析"]} period="截至2026.07" />
      <section className="biz-support-detail-page" aria-label="配套营业收入分析详情">
        <div className="biz-support-detail-head"><CircleDollarSign aria-hidden="true" /><div><strong>配套营业收入分析</strong><span>接单结构、项目节点与重点企业完成情况</span></div></div>
        <SupportRevenueAnalysis detail />
      </section>
      <Footer text="配套营业收入分析 · 配套经营口径 · 截至2026.07" />
    </>
  );
}

function PageBizOverdue() {
  const [distTab, setDistTab] = useState<"合计" | "系内" | "系外">("合计");

  type AgingAmount = { overYear: number; underYear: number };
  const distributionData: Array<{
    label: string;
    internal: AgingAmount;
    external: AgingAmount;
  }> = [
    { label: "船舶建造", internal: { overYear: 0, underYear: 0 }, external: { overYear: 0, underYear: 0 } },
    { label: "修理改装", internal: { overYear: 1200, underYear: 3000 }, external: { overYear: 3600, underYear: 2200 } },
    { label: "海工及新能源", internal: { overYear: 540, underYear: 1260 }, external: { overYear: 1350, underYear: 750 } },
    { label: "配套业务", internal: { overYear: 215, underYear: 500 }, external: { overYear: 560, underYear: 319 } },
  ];
  const axisMax = 10000;
  const overdueColors = {
    external: C.danger,
    internal: C.brand,
    overYear: C.danger,
    overYearSoft: C.dangerSoft,
    underYear: C.brand,
    underYearSoft: C.brandSoft,
    risk: C.warning,
    riskSoft: C.warningSoft,
    recovery: C.success,
    recoverySoft: C.successSoft,
  };

  return (
    <>
      <StatusBar />
      <NavBar title="逾期应收账款" subtitle="经营口径" backLabel="返回经营主题" backPage="biz" />
      <BreadcrumbBar crumbs={["首页", "经营主题", "逾期应收"]} period="截至7.10" />

      {/* 英雄数字区 */}
      <div style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)", border: "1px solid rgba(0,80,142,0.08)", margin: "8px 10px 0", borderRadius: 12, padding: "10px 10px 10px", boxShadow: "0 4px 10px rgba(20,76,128,0.055)" }}>
        <div style={{ fontSize: 11, color: C.t2, fontWeight: 500, marginBottom: 4 }}>逾期应收账款总规模（万元）</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 10 }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: C.brand, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>15,494</span>
          <span style={{ fontSize: 12, color: C.t3, paddingBottom: 4 }}>万元</span>
          <span style={{ borderRadius: 999, background: overdueColors.riskSoft, color: overdueColors.risk, fontSize: 9, fontWeight: 700, lineHeight: 1, padding: "3px 6px", marginBottom: 5 }}>风险存量</span>
        </div>
        {/* 两色说明行 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: overdueColors.external, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: C.t2 }}>逾期</span>
            <span style={{ fontSize: 11, color: C.t3 }}>≥1年</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: overdueColors.external }}>7,465</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: overdueColors.internal, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: C.t2 }}>逾期</span>
            <span style={{ fontSize: 11, color: C.t3 }}>{"<"}1年</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: overdueColors.internal }}>8,029</span>
          </div>
        </div>
        {/* 分隔 */}
        <div style={{ height: 1, background: C.divider, marginBottom: 10 }} />
        {/* 本周变动 */}
        <div style={{ display: "flex", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 10, color: C.t3 }}>上周新增逾期</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: overdueColors.external }}>+1,931</span>
            <span style={{ fontSize: 10, color: C.t3 }}>万</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 10, color: C.t3 }}>收回</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: overdueColors.recovery }}>133</span>
            <span style={{ fontSize: 10, color: C.t3 }}>万</span>
          </div>
        </div>
      </div>

      {/* 堆叠横向条形图 */}
      <div className="biz-overdue-distribution-card" style={{ background: C.card, border: "1px solid rgba(0,80,142,0.07)", margin: "8px 10px 8px", borderRadius: 12, padding: "10px 10px 10px", boxShadow: "0 4px 10px rgba(20,76,128,0.055)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 12 }}>
          <div style={{ display: "flex", minWidth: 0, alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.t1, whiteSpace: "nowrap" }}>各业务板块逾期分布</span>
            <span style={{ fontSize: 9, color: C.t3, whiteSpace: "nowrap" }}>单位：万元</span>
          </div>
          {/* 合计 / 系内 / 系外 切换 */}
          <div style={{ display: "flex", flexShrink: 0, background: "rgba(217,236,255,0.72)", border: "1px solid rgba(0,80,142,0.10)", borderRadius: 999, padding: 2, gap: 2 }}>
            {(["合计", "系内", "系外"] as const).map(tab => (
              <button key={tab} onClick={() => setDistTab(tab)} style={{ borderRadius: 999, padding: "3px 10px", border: "none", cursor: "pointer", background: distTab === tab ? "linear-gradient(135deg, #00508E 0%, #0B69C7 100%)" : "transparent", boxShadow: distTab === tab ? "0 2px 6px rgba(0,80,142,0.16)" : "none" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: distTab === tab ? "#FFFFFF" : C.brand }}>{tab}</span>
              </button>
            ))}
          </div>
        </div>
        {/* 账龄图例：三个视图均保持一致 */}
        <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 12, height: 10, borderRadius: 2, background: overdueColors.overYear }} />
            <span style={{ fontSize: 10, color: C.t3 }}>逾期 ≥1年</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 12, height: 10, borderRadius: 2, background: overdueColors.underYear }} />
            <span style={{ fontSize: 10, color: C.t3 }}>逾期 {"<"}1年</span>
          </div>
        </div>
        {/* 条形图 */}
        <div style={{ display: "flex", flexDirection: "column", gap: distTab === "合计" ? 13 : 16 }}>
          {distributionData.map((item) => {
            const internalTotal = item.internal.overYear + item.internal.underYear;
            const externalTotal = item.external.overYear + item.external.underYear;
            const total = internalTotal + externalTotal;
            const sourceRows = distTab === "合计"
              ? [
                  { label: "系外", amount: item.external },
                  { label: "系内", amount: item.internal },
                ]
              : distTab === "系内"
                ? [{ label: "系内", amount: item.internal }]
                : [{ label: "系外", amount: item.external }];
            const viewTotal = distTab === "合计"
              ? total
              : distTab === "系内"
                ? internalTotal
                : externalTotal;
            return (
              <div key={item.label}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: C.t2, fontWeight: 500 }}>{item.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: viewTotal === 0 ? C.t3 : C.t1, fontVariantNumeric: "tabular-nums" }}>
                    {viewTotal === 0 ? "—" : viewTotal.toLocaleString()}
                  </span>
                </div>
                {viewTotal === 0 ? (
                  <div style={{ display: "flex", height: 20, alignItems: "center", borderRadius: 5, background: "rgba(236,245,255,0.64)", paddingLeft: 8 }}>
                    <span style={{ fontSize: 9, color: C.t3 }}>暂无逾期</span>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 4 }}>
                    {sourceRows.map(source => {
                      const sourceTotal = source.amount.overYear + source.amount.underYear;
                      const overYearW = (source.amount.overYear / axisMax) * 100;
                      const underYearW = (source.amount.underYear / axisMax) * 100;
                      return (
                        <div key={source.label} style={{ display: "grid", gridTemplateColumns: "30px minmax(0,1fr)", alignItems: "center", gap: 5 }}>
                          <span style={{ fontSize: 9, color: C.t3, textAlign: "right" }}>{source.label}</span>
                          <div style={{ display: "flex", height: distTab === "合计" ? 14 : 20, borderRadius: 5, overflow: "hidden", background: "rgba(236,245,255,0.64)" }}>
                            {source.amount.overYear > 0 && (
                              <div style={{ width: `${overYearW}%`, background: overdueColors.overYear, borderRadius: source.amount.underYear > 0 ? "5px 0 0 5px" : 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {overYearW > 11 && <span style={{ fontSize: distTab === "合计" ? 8 : 9, color: "#FFFFFF", fontWeight: 600 }}>{source.amount.overYear.toLocaleString()}</span>}
                              </div>
                            )}
                            {source.amount.underYear > 0 && (
                              <div style={{ width: `${underYearW}%`, background: overdueColors.underYear, borderRadius: source.amount.overYear > 0 ? "0 5px 5px 0" : 5, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {underYearW > 11 && <span style={{ fontSize: distTab === "合计" ? 8 : 9, color: "#FFFFFF", fontWeight: 600 }}>{source.amount.underYear.toLocaleString()}</span>}
                              </div>
                            )}
                            {sourceTotal === 0 && (
                              <span style={{ alignSelf: "center", paddingLeft: 6, fontSize: 8, color: C.t3 }}>—</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* X轴刻度 */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingLeft: 35 }}>
          {[0, 2500, 5000, 7500, 10000].map(v => (
            <span key={v} style={{ fontSize: 9, color: C.t3 }}>{v.toLocaleString()}</span>
          ))}
        </div>
      </div>

      <Footer text="经营逾期收款 · 经营口径 · 截至7.10" />
    </>
  );
}

function PageProdRepairShips() {
  const companies = [
    { name: "南通船务", total: 14, internal: 2 },
    { name: "大连重工", total: 9,  internal: 3 },
    { name: "舟山重工", total: 20, internal: 4 },
    { name: "上海重工", total: 29, internal: 2 },
    { name: "广东重工", total: 20, internal: 0 },
  ];
  const maxTotal = Math.max(...companies.map(c => c.total));

  return (
    <>
      <StatusBar />
      <NavBar title="在厂艘数排名" subtitle="修船·生产口径" backLabel="返回修船主题" backPage="prod-repair" />
      <BreadcrumbBar crumbs={["首页", "生产主题", "修船", "在厂艘数"]} period="截至7.10" />

      <Card title="在厂船舶总览" className="repair-fleet-summary-card mt-2">
        <div className="repair-fleet-summary">
          <div className="repair-fleet-total"><strong>92</strong><span>艘</span></div>
          <div className="repair-fleet-flow"><div><span>进厂</span><strong>25<small>艘</small></strong><em>集团船5艘</em></div><div><span>出厂</span><strong>28<small>艘</small></strong><em>集团船5艘</em></div></div>
        </div>
      </Card>

      {/* 堆叠横向条形图 */}
      <div style={{ background: C.card, margin: "8px 10px 8px", borderRadius: 12, padding: "10px 10px 10px", boxShadow: "var(--app-shadow-card)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 12 }}>各企业在厂分布</div>
        {/* 图例 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 14, height: 10, borderRadius: 2, background: C.brand }} />
            <span style={{ fontSize: 10, color: C.t3 }}>外部船舶</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 14, height: 10, borderRadius: 2, background: C.success }} />
            <span style={{ fontSize: 10, color: C.t3 }}>集团内部船舶</span>
          </div>
        </div>
        {/* 条形图行 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {companies.map((co) => {
            const external = co.total - co.internal;
            const extPct = (external / maxTotal) * 100;
            const intPct = (co.internal / maxTotal) * 100;
            return (
              <div key={co.name}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: C.t2 }}>{co.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{co.total} 艘</span>
                </div>
                <div style={{ display: "flex", height: 16, borderRadius: 4, overflow: "hidden", background: C.bg }}>
                  {external > 0 && (
                    <div style={{ width: `${extPct}%`, background: C.brand, borderRadius: co.internal > 0 ? "4px 0 0 4px" : 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {extPct > 15 && <span style={{ fontSize: 9, color: "#FFF", fontWeight: 600 }}>{external}</span>}
                    </div>
                  )}
                  {co.internal > 0 && (
                    <div style={{ width: `${intPct}%`, background: C.success, borderRadius: external > 0 ? "0 4px 4px 0" : 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {intPct > 10 && <span style={{ fontSize: 9, color: C.card, fontWeight: 600 }}>{co.internal}</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* X轴刻度 */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          {[0, 10, 20, 30].map(v => (
            <span key={v} style={{ fontSize: 9, color: C.t3 }}>{v}</span>
          ))}
        </div>
        {/* 小结 */}
        <div style={{ marginTop: 12, background: C.bg, borderRadius: 8, padding: "7px 12px", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.phDark }}>注</span>
          <span style={{ fontSize: 11, color: C.t2 }}>
            <span style={{ fontWeight: 600, color: C.t1 }}>上海重工</span>在厂体量最大，共 29 艘
          </span>
        </div>
      </div>

      <Footer text="在厂艘数排名 · 修船生产口径 · 截至7.10" />
    </>
  );
}

function PageProdRepair() {
  const [dockMetric, setDockMetric] = useState<string>("shore");
  return (
    <>
      <StatusBar />
      <NavBar title="生产主题" backLabel="返回首页" backPage="home" />
      <div className="repair-mode-shell">
        <ProductionModeTabs value="repair" onValueChange={(mode: ProductionMode) => nav(mode === "ship" ? "prod-ship" : "prod-repair")} />
      </div>

      {/* L5 今日动态 */}
      <div className="repair-click-card" role="button" tabIndex={0} onClick={() => nav("prod-repair-daily")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") nav("prod-repair-daily"); }}>
      <Card className="app-production-card repair-today-card mode-content-first-card attached-overview-card">
        <div className="attached-overview-heading">
          <strong>今日动态</strong>
          <span>查看详情 <ChevronRight aria-hidden="true" /></span>
        </div>
        <div className="repair-today-metrics repair-today-metrics-three">
          {[
            { label: "在厂船舶",  value: "92",    unit: "艘" },
            { label: "今日进厂", value: "18", unit: "艘" },
            { label: "今日出厂", value: "15", unit: "艘", tone: "success" },
          ].map((it, i) => (
            <div key={i}>
              <div className={`repair-metric-value${it.tone === "success" ? " is-success" : ""}`}>{it.value}<span>{it.unit}</span></div>
              <div className="repair-metric-label">{it.label}</div>
            </div>
          ))}
        </div>
      </Card>
      </div>

      {/* 在厂艘数排名 */}
      <Card title="在厂艘数排名" extra="下钻明细" onExtra={() => nav("prod-repair-ships")} className="app-production-card repair-ranking-card">
        <div className="repair-ranking-list">
          {[
            { name: "舟山重工", value: 32 },
            { name: "大连重工", value: 25 },
            { name: "广东重工", value: 19 },
            { name: "南通中远", value: 16 },
          ].map((item, index) => (
            <div className="repair-ranking-row" key={item.name}>
              <span className="repair-rank-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="repair-rank-name">{item.name}</span>
              <HorizontalBar value={(item.value / 32) * 100} label={`${item.name} ${item.value}艘`} />
              <strong>{item.value}<small>艘</small></strong>
            </div>
          ))}
        </div>
      </Card>

      <div className="repair-section-heading">
        <span className="app-title-icon"><Anchor size={16} strokeWidth={2} /></span>
        <div><strong>核心资源</strong><small>支撑修船生产的关键设施能力</small></div>
      </div>

      {/* 船坞资源 — 摘要卡 */}
      <div className="repair-resource-summary">
        <span className="repair-resource-icon"><Anchor size={24} strokeWidth={1.8} /></span>
        <div className="repair-resource-copy"><strong>船坞资源</strong><small>干船坞与浮船坞配置</small></div>
        <div className="repair-resource-total"><strong>19</strong><span>座</span></div>
        <div className="repair-resource-facts"><span>干船坞 <b>6座</b></span><span>浮船坞 <b>13座</b></span></div>
      </div>

      {/* 船坞资源 — 条形图卡 */}
      <div className="repair-resource-detail" style={{ background: C.card, margin: "8px 10px 8px", borderRadius: 12, padding: "10px 10px 10px", boxShadow: "var(--app-shadow-card)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 14 }}>各类型船坞分布</div>

        {/* 干船坞 */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: 2, background: C.brand, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.t2 }}>干船坞</span>
          <span style={{ fontSize: 10, color: C.t3 }}>（6座）</span>
        </div>
        {[
          { label: "20–30万吨级", val: 4, max: 6 },
          { label: "8万吨级",     val: 2, max: 6 },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: C.t2, width: 72, flexShrink: 0 }}>{row.label}</span>
            <div style={{ flex: 1, height: 16, borderRadius: 4, overflow: "hidden", background: C.bg }}>
              <div style={{ width: `${(row.val / row.max) * 100}%`, height: "100%", background: C.brand, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 5 }}>
                {(row.val / row.max) > 0.2 && <span style={{ fontSize: 9, color: "#FFF", fontWeight: 600 }}>{row.val}</span>}
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.t1, width: 22, textAlign: "right", flexShrink: 0 }}>{row.val}</span>
            <span style={{ fontSize: 9, color: C.t3 }}>座</span>
          </div>
        ))}

        <div style={{ height: 1, background: C.divider, margin: "4px 0 12px" }} />

        {/* 浮船坞 */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: 2, background: C.success, flexShrink: 0 }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: C.t2 }}>浮船坞</span>
          <span style={{ fontSize: 10, color: C.t3 }}>（13座）</span>
        </div>
        {[
          { label: "30万吨级及以上", val: 2, max: 6 },
          { label: "15–20万吨级",   val: 5, max: 6 },
          { label: "8万吨级及以下", val: 6, max: 6 },
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: C.t2, width: 72, flexShrink: 0 }}>{row.label}</span>
            <div style={{ flex: 1, height: 16, borderRadius: 4, overflow: "hidden", background: C.bg }}>
              <div style={{ width: `${(row.val / row.max) * 100}%`, height: "100%", background: C.success, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 5 }}>
                {(row.val / row.max) > 0.2 && <span style={{ fontSize: 9, color: C.card, fontWeight: 600 }}>{row.val}</span>}
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.t1, width: 22, textAlign: "right", flexShrink: 0 }}>{row.val}</span>
            <span style={{ fontSize: 9, color: C.t3 }}>座</span>
          </div>
        ))}
      </div>

      {/* 码头泊位吊车 — 摘要卡 */}
      <div className="repair-resource-summary">
        <span className="repair-resource-icon"><Factory size={24} strokeWidth={1.8} /></span>
        <div className="repair-resource-copy"><strong>码头泊位与吊车</strong><small>岸线、泊位及起重能力</small></div>
        <div className="repair-resource-total"><strong>84</strong><span>个泊位</span></div>
        <div className="repair-resource-facts"><span>岸线 <b>22,100m</b></span><span>码头 <b>19,400m</b></span></div>
      </div>

      {/* 码头泊位吊车 — 条形图卡 */}
      <div className="repair-resource-detail" style={{ background: C.card, margin: "8px 10px 8px", borderRadius: 12, padding: "10px 10px 10px", boxShadow: "var(--app-shadow-card)" }}>
        <div className="repair-resource-compare-head">
          <div className="repair-resource-compare-title">各企业资源对比</div>
        </div>

        {/* 企业条形图 */}
        {(() => {
          const metricMap: Record<string, { label: string; vals: number[]; unit: string; maxVal: number }> = {
            shore:   { label: "岸线长",              vals: [3200, 4800, 5100, 6200, 2800], unit: "m",  maxVal: 7000 },
            berth:   { label: "码头长",              vals: [2800, 4100, 4600, 5500, 2400], unit: "m",  maxVal: 7000 },
            slots:   { label: "泊位数",              vals: [12, 18, 20, 24, 10],           unit: "个", maxVal: 28   },
            crane_s: { label: "码头吊车（100米以下变幅）", vals: [6, 10, 12, 8, 5],         unit: "台", maxVal: 15   },
            crane_l: { label: "码头吊车（100米以上变幅）", vals: [2, 4, 5, 6, 2],           unit: "台", maxVal: 8    },
            float:   { label: "浮吊",                vals: [1, 2, 3, 2, 1],               unit: "台", maxVal: 4    },
          };
          const active = metricMap[dockMetric] ?? metricMap["shore"];
          const companies = ["南通船务", "大连重工", "舟山重工", "上海重工", "广东重工"];
          return (
            <>
              <div className="repair-resource-compare-toolbar">
                <span>单位:{active.unit}</span>
                <div className="repair-resource-compare-switch" role="tablist" aria-label="企业资源指标切换">
                  {[
                    { key: "shore", short: "岸线" },
                    { key: "berth", short: "码头长" },
                    { key: "slots", short: "泊位" },
                    { key: "crane_s", short: "吊车≤100m" },
                    { key: "crane_l", short: "吊车＞100m" },
                    { key: "float", short: "浮吊" },
                  ].map((metric) => (
                    <button
                      type="button"
                      role="tab"
                      aria-selected={dockMetric === metric.key}
                      className={dockMetric === metric.key ? "is-active" : ""}
                      key={metric.key}
                      onClick={() => setDockMetric(metric.key)}
                    >
                      {metric.short}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {companies.map((co, i) => {
                  const pct = (active.vals[i] / active.maxVal) * 100;
                  return (
                    <div key={i}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: C.t2 }}>{co}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{active.vals[i].toLocaleString()} {active.unit}</span>
                      </div>
                      <div style={{ height: 16, borderRadius: 4, overflow: "hidden", background: C.bg }}>
                        <div style={{ width: `${pct}%`, height: "100%", background: C.brand, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 5 }}>
                          {pct > 20 && <span style={{ fontSize: 9, color: "#FFF", fontWeight: 600 }}>{active.vals[i].toLocaleString()}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}
      </div>

      <Footer text="生产主题 · 修船板块 · 数据口径随时间切换" />
    </>
  );
}

function PageProdRepairCompletion() {
  const [period, setPeriod] = useState<"月度" | "年累计">("月度");
  const [metric, setMetric] = useState<"艘数" | "产值">("艘数");

  const companies = ["南通船务", "大连重工", "舟山重工", "上海重工", "广东重工"];
  const shipNums  = [28, 22, 30, 18, 24];
  const valNums   = [420, 380, 510, 290, 400];
  const shipMax   = Math.max(...shipNums);
  const valMax    = Math.max(...valNums);

  return (
    <>
      <StatusBar />
      <NavBar title="修船完工明细" backLabel="返回修船主题" backPage="prod-repair" />
      <BreadcrumbBar crumbs={["首页", "生产主题", "修船", "完工明细"]} period="截至7.10" />
      <div className="production-detail-page repair-completion-page">
        <Card title="完工表现总览" className="production-summary-card">
          <div className="production-summary-grid">
            <div><span>本月完工</span><strong>122<small>艘</small></strong></div>
            <div><span>完工产值</span><strong>2,000<small>万元</small></strong></div>
            <div><span>达成率</span><strong>97.6<small>%</small></strong></div>
          </div>
        </Card>

        <Card title="企业完工表现" className="production-chart-card" extra={
          <div className="app-segment-control compact app-unified-segmented" role="tablist">
            {(["艘数", "产值"] as const).map(t => <button key={t} role="tab" className={metric === t ? "is-active" : ""} onClick={() => setMetric(t)}>{t}</button>)}
          </div>
        }>
          <div className="production-control-row chart-period-row">
            <div className="app-segment-control compact app-unified-segmented" role="tablist">
              {(["月度", "年累计"] as const).map(t => <button key={t} role="tab" className={period === t ? "is-active" : ""} onClick={() => setPeriod(t)}>{t}</button>)}
            </div>
            <span className="chart-inline-unit">单位：{metric === "艘数" ? "艘" : "万元"}</span>
          </div>
          <div className="production-bar-chart" aria-label={`企业完工${metric}`}>
            {companies.map((co, i) => {
              const value = metric === "艘数" ? shipNums[i] : valNums[i];
              const max = metric === "艘数" ? shipMax : valMax;
              return <div className="production-bar-item" key={co}><strong>{value}</strong><div><i style={{ height: `${Math.round((value / max) * 78)}px` }} /></div><span>{co}</span></div>;
            })}
          </div>
        </Card>

        <Card title="企业完工明细" className="production-list-card">
          <div className="production-list-head"><span>企业</span><span>计划 / 实绩</span><span>达成率</span></div>
          <div className="production-enterprise-list">
            {[
              { name: "南通船务", plan: 30, actual: 28 },
              { name: "大连重工", plan: 25, actual: 22 },
              { name: "舟山重工", plan: 28, actual: 30 },
              { name: "上海重工", plan: 20, actual: 18 },
              { name: "广东重工", plan: 22, actual: 24 },
            ].map((row) => {
              const rate = Math.round((row.actual / row.plan) * 100);
              return <div className="production-enterprise-row" key={row.name}><strong>{row.name}</strong><span><b>{row.plan}</b> / <b>{row.actual}</b> 艘</span><em className={rate > 100 ? "is-over" : ""}>{rate}%</em></div>;
            })}
          </div>
        </Card>
      </div>
    </>
  );
}

function PageProdRepairDaily() {
  const rows = [
    { name: "南通船务", inbound: "1（瑞泰）", outbound: "—", labor: "1543+428", active: true },
    { name: "大连重工", inbound: "—", outbound: "—", labor: "3356" },
    { name: "舟山重工", inbound: "19", outbound: "—", labor: "3872", badge: "集团1", active: true },
    { name: "上海重工", inbound: "29", outbound: "—", labor: "6168", active: true },
    { name: "广东重工", inbound: "20", outbound: "—", labor: "3045", active: true },
  ];
  return (
    <>
      <StatusBar />
      <NavBar title="生产主题" backLabel="返回修船主题" backPage="prod-repair" />
      <BreadcrumbBar crumbs={["首页", "生产主题", "修船", "今日动态"]} />

      <div className="production-detail-page repair-daily-page">
        <Card title="今日运营摘要" className="production-summary-card">
          <div className="production-summary-grid"><div><span>在厂船舶</span><strong>92<small>艘</small></strong></div><div><span>今日进厂</span><strong>18<small>艘</small></strong></div><div><span>今日出厂</span><strong className="is-good">15<small>艘</small></strong></div></div>
        </Card>
        <Card title="企业今日动态" className="production-list-card">
          <div className="daily-list-head"><span>企业</span><span>进厂 / 出厂</span><span>劳动力</span></div>
          <div className="daily-enterprise-list">
            {rows.map(row => <div className="daily-enterprise-row" key={row.name}><div className="daily-company"><i className={row.active ? "is-active" : ""}/><strong>{row.name}</strong>{row.badge && <small>{row.badge}</small>}</div><span><b>{row.inbound}</b><i>/</i><b className="is-out">{row.outbound}</b></span><em>{row.labor}<small>人</small></em></div>)}
          </div>
        </Card>
        <div className="production-update-note">截至7.10</div>
      </div>

      <Footer text="修船在厂/进出厂/劳动力明细（含集团船口径）" />
    </>
  );
}


function PageProdShip() {
  const [seg, setSeg] = useState<"造船" | "修船">("造船");
  const [bubbleIdx, setBubbleIdx] = useState<number | null>(null);
  const [resourceDetail, setResourceDetail] = useState<"dock" | "berth" | null>(null);
  const resourceRows = ["南通川崎", "大连川崎", "扬州重工", "启东海工", "舟山重工"];

  // 造船数据
  const shipData = {
    today: [
      { label: "在建艘数",    value: "72", unit: "艘" },
      { label: "本周计划交付", value: "1",  unit: "艘" },
      { label: "本周计划开工", value: "0",  unit: "艘" },
    ],
    trackBars: [
      { name: "大连川崎", v: 18 }, { name: "舟山重工", v: 15 },
      { name: "大连重工", v: 14 }, { name: "广东重工", v: 12 },
      { name: "启东造船", v: 8  }, { name: "扬州重工", v: 5  },
    ],
    deliveryRate: 26, deliveryCnt: "6", dwt: "78", cgt: "24",
    trendPts: [0, 2, 4, 5, 6, 4, 3, 5, 7, 9, 10, 11],
  };
  // 修船数据
  const repairData = {
    today: [
      { label: "在厂艘数",    value: "92", unit: "艘" },
      { label: "本周计划完工", value: "10", unit: "艘" },
      { label: "本周实际完工", value: "9",  unit: "艘" },
    ],
    trackBars: [
      { name: "上海重工", v: 29 }, { name: "舟山重工", v: 20 },
      { name: "广东重工", v: 20 }, { name: "南通船务", v: 14 },
      { name: "大连重工", v: 9  },
    ],
    deliveryRate: 90, deliveryCnt: "30", dwt: "100", cgt: "88",
    trendPts: [4, 6, 5, 8, 7, 9, 8, 10, 9, 10, 11, 11],
  };
  const d = seg === "造船" ? shipData : repairData;
  const maxBar = Math.max(...d.trackBars.map(b => b.v));
  const pts = d.trendPts;
  const maxV = 12; const W = 300; const H = 76;
  const chartLeft = 16; const chartRight = 6;
  const xStep = (W - chartLeft - chartRight) / 11;
  const pointX = (index: number) => chartLeft + index * xStep;
  const toY = (v: number) => H - (v / maxV) * (H - 4) - 2;
  const linePath = pts.map((v, i) => `${i === 0 ? "M" : "L"}${pointX(i)},${toY(v)}`).join(" ");
  const areaPath = `${linePath} L${pointX(11)},${H} L${pointX(0)},${H} Z`;

  return (
    <>
      <StatusBar />
      <NavBar title="生产主题" backLabel="返回首页" backPage="home" />
      <div className="repair-mode-shell">
        <ProductionModeTabs value="ship" onValueChange={(mode: ProductionMode) => {
          setSeg(mode === "ship" ? "造船" : "修船");
          setBubbleIdx(null);
          if (mode === "repair") nav("prod-repair");
        }} />
      </div>

      {/* 今日动态 — 整卡下钻至生产跟踪 */}
      <div className="repair-click-card" role="button" tabIndex={0} onClick={() => nav("prod-ship-track")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") nav("prod-ship-track"); }}>
        <Card className="app-production-card repair-today-card mode-content-first-card attached-overview-card">
          <div className="attached-overview-heading">
            <strong>今日动态</strong>
            <span>查看详情 <ChevronRight aria-hidden="true" /></span>
          </div>
          <div className="repair-today-metrics ship-today-metrics">
            {d.today.map((it, i) => (
              <div key={i}>
                <div className="repair-metric-value">{it.value}<span>{it.unit}</span></div>
                <div className="repair-metric-label">{it.label}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* 在建艘数排名 */}
      <Card title="在建艘数排名" extra="下钻明细" onExtra={() => nav("prod-ship-track")} className="app-production-card repair-ranking-card ship-ranking-card ship-detail-title-card">
        <div className="repair-ranking-list">
          {d.trackBars.map((item, index) => (
            <div className="repair-ranking-row" key={item.name}>
              <span className="repair-rank-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="repair-rank-name">{item.name}</span>
              <HorizontalBar value={(item.v / maxBar) * 100} label={`${item.name} ${item.v}艘`} />
              <strong>{item.v}<small>艘</small></strong>
            </div>
          ))}
        </div>
      </Card>

      {/* 本周交付 — 点击进入单船详情 */}
      <Card title="本周交付" extra="下钻明细" onExtra={() => nav("prod-ship-delivery")} className="app-production-card ship-delivery-card ship-detail-title-card">
        <div className="ship-delivery-summary">本周计划交付 <strong>1</strong><span>艘</span></div>
        <div className="ship-delivery-record" role="button" tabIndex={0} onClick={() => nav("prod-ship-delivery")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") nav("prod-ship-delivery"); }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 12, color: C.t1, fontWeight: 500 }}>大连川崎 · DE166　82kBC · 非集团船</div>
          </div>
          <div className="ship-delivery-status"><CheckCircle2 aria-hidden="true" />提前 1 天交付</div>
          <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            {[["合同计划日期", "2026/10/10"], ["线表计划日期", "2026/10/10"], ["实际交付日期", "2026/10/9"]].map(([k, v]) => (
              <div key={k} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 9, color: C.t3 }}>{k}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.t1 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* 交付进度 */}
      <Card title="交付进度" tag="正常" className="ship-delivery-progress-card ship-detail-title-card">
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: C.t1, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{d.deliveryRate}</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: C.t1 }}>%</span>
          <span style={{ fontSize: 11, color: C.t3, marginLeft: 2 }}>本年累计交付完成率，目标进度75%</span>
        </div>
        <div style={{ height: 6, background: C.ph, borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
          <div style={{ width: `${d.deliveryRate}%`, height: "100%", background: C.brand, borderRadius: 3 }} />
        </div>
        <div className="ship-delivery-kpi-strip" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
          {[
            { period: "本年", label: "累计交付",  value: d.deliveryCnt, unit: "艘", target: "50" },
            { period: "本年", label: "万载重吨",  value: d.dwt,         unit: "",   target: "50" },
            { period: "本年", label: "万修正总吨", value: d.cgt,         unit: "",   target: "50" },
          ].map((it, i) => (
            <div key={i} style={{ textAlign: "center", padding: "6px 4px", background: C.bg, borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: C.t3, marginBottom: 2 }}>
                <span style={{ fontWeight: 600, color: C.t2 }}>{it.period}</span> {it.label}
              </div>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 2 }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{it.value}</span>
                {it.unit && <span style={{ fontSize: 11, color: C.t3 }}>{it.unit}</span>}
              </div>
              <div style={{ fontSize: 9, color: C.t3, marginTop: 3 }}>目标：{it.target}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* 月度交付趋势 — 节点可点击展示气泡 */}
      <Card title="月度交付趋势（艘）" extra="下钻明细" onExtra={() => nav("prod-ship-delivery-detail")} className="ship-detail-title-card">
        <div style={{ position: "relative" }}>
          <svg className="app-standard-line-chart" width="100%" height={H + 24} viewBox={`0 0 ${W} ${H + 24}`} preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="shipDeliveryTrendArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.brand} stopOpacity="0.22" />
                <stop offset="100%" stopColor={C.brand} stopOpacity="0.02" />
              </linearGradient>
            </defs>
            {[12, 6, 0].map((value) => (
              <line key={value} className="app-chart-grid-line" x1={chartLeft} x2={W - chartRight} y1={toY(value)} y2={toY(value)} />
            ))}
            <path d={areaPath} fill="url(#shipDeliveryTrendArea)" />
            <path d={linePath} fill="none" stroke={C.brand} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            {pts.map((v, i) => (
              <g key={i}>
                <text className="app-chart-data-label" x={pointX(i)} y={Math.max(8, toY(v) - 7)} textAnchor="middle">{v}</text>
                <circle cx={pointX(i)} cy={toY(v)} r={bubbleIdx === i ? 4.5 : 3}
                  fill={bubbleIdx === i ? C.brand : "#fff"} stroke={C.brand} strokeWidth="1.5"
                  style={{ cursor: "pointer" }}
                  onClick={() => setBubbleIdx(bubbleIdx === i ? null : i)} />
              </g>
            ))}
            {["1","2","3","4","5","6","7","8","9","10","11","12"].map((m, i) => (
              <text className="app-chart-axis-label" key={i} x={pointX(i)} y={H + 16} textAnchor="middle">{m}</text>
            ))}
          </svg>

          {/* 数据气泡 */}
          {bubbleIdx !== null && (() => {
            const bx = (bubbleIdx / 11) * 100;
            const alignRight = bubbleIdx > 8;
            return (
              <div style={{
                position: "absolute",
                top: toY(pts[bubbleIdx]) - 44,
                left: alignRight ? "auto" : `calc(${bx}% - 4px)`,
                right: alignRight ? `calc(${100 - bx}% - 4px)` : "auto",
                background: C.brand, color: "#fff", borderRadius: 8,
                padding: "5px 8px", fontSize: 10, whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(0,0,0,0.18)", pointerEvents: "none",
              }}>
                <div style={{ fontWeight: 600 }}>{bubbleIdx + 1}月</div>
                <div>交付 <span style={{ fontWeight: 700 }}>{pts[bubbleIdx]}</span> 艘</div>
                <div style={{
                  position: "absolute", bottom: -5, left: alignRight ? "auto" : 10, right: alignRight ? 10 : "auto",
                  width: 8, height: 8, background: C.brand, transform: "rotate(45deg)",
                }} />
              </div>
            );
          })()}

          {/* Y轴标注 */}
          <div style={{ position: "absolute", top: 0, left: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", height: H, pointerEvents: "none" }}>
            {[12, 6, 0].map(v => <span key={v} style={{ fontSize: 9, color: C.t3, lineHeight: 1 }}>{v}</span>)}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6 }}>
          <div style={{ width: 16, height: 2, background: C.brand, borderRadius: 1 }} />
          <span style={{ fontSize: 9, color: C.t3 }}>月度交付艘数（点击节点查看详情）</span>
        </div>
      </Card>

      {/* 各板块交付进度对比 */}
      <Card title="各板块交付进度对比" titleMeta="年度交付概览" tag="达成" className="app-production-card ship-segment-progress-card ship-detail-title-card">
        <div className="ship-progress-overview">
          <div className="ship-progress-kpis">
            {[
              { label: "累计交付数量", value: d.deliveryCnt, unit: "艘" },
              { label: "年度目标", value: "50", unit: "艘" },
              { label: "已交付数量", value: d.deliveryCnt, unit: "艘" },
              { label: "未交付数量", value: String(50 - Number(d.deliveryCnt)), unit: "艘" },
            ].map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}<small>{item.unit}</small></strong>
              </div>
            ))}
          </div>
        </div>

        {/* 图例 */}
        <div className="ship-progress-legend">
          {[
            { color: "var(--app-primary)", label: "交付进度（%）" },
            { color: "var(--app-warning-700)", label: "超计划交付进度（%）" },
          ].map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
              <span style={{ fontSize: 9, color: C.t3 }}>{l.label}</span>
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 14, height: 2, background: C.phDark, borderRadius: 1, borderTop: `1px dashed ${C.phDark}` }} />
            <span style={{ fontSize: 9, color: C.t3 }}>时间进度（%）</span>
          </div>
        </div>

        {/* 柱状图区域 */}
        {(() => {
          const segments = [
            { name: "造船", progress: 97,  over: 0  },
            { name: "海工", progress: 100, over: 5  },
            { name: "模块", progress: 95,  over: 0  },
          ];
          const timeLine = 78; // 时间进度线 %
          const chartH = 100;
          return (
            <div style={{ position: "relative", paddingTop: 8 }}>
              {/* 时间进度虚线 */}
              <div style={{ position: "absolute", top: 8 + chartH * (1 - timeLine / 120), left: 0, right: 0, borderTop: `1.5px dashed ${C.phDark}`, zIndex: 1 }}>
                <span style={{ position: "absolute", right: 0, top: -10, fontSize: 9, color: C.t3 }}>{timeLine}%</span>
              </div>

              {/* 柱子 */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: chartH, paddingBottom: 0, justifyContent: "space-around" }}>
                {segments.map((seg, i) => {
                  const barH = Math.round((seg.progress / 120) * chartH);
                  const overH = Math.round((seg.over / 120) * chartH);
                  return (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{ width: "60%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                        {overH > 0 && (
                          <div style={{ height: overH, background: "var(--app-warning-700)", borderRadius: "3px 3px 0 0" }} />
                        )}
                        <div style={{ height: barH, background: C.brand, borderRadius: overH > 0 ? "0 0 3px 3px" : "3px 3px 3px 3px" }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X轴标签 */}
              <div style={{ display: "flex", justifyContent: "space-around", marginTop: 6 }}>
                {segments.map((seg, i) => (
                  <span key={i} style={{ flex: 1, fontSize: 10, color: C.t2, textAlign: "center" }}>{seg.name}</span>
                ))}
              </div>

              {/* Y轴刻度 */}
              <div style={{ position: "absolute", left: 0, top: 8, bottom: 20, display: "flex", flexDirection: "column", justifyContent: "space-between", pointerEvents: "none" }}>
                {[120, 80, 40, 0].map(v => (
                  <span key={v} style={{ fontSize: 9, color: C.t3 }}>{v}</span>
                ))}
              </div>
            </div>
          );
        })()}

        {/* 数值注释行 */}
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: 10 }}>
          {[
            { name: "造船", val: "97%", over: null },
            { name: "海工", val: "105%", over: "超5%" },
            { name: "模块", val: "95%", over: null },
          ].map((it, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.brand }}>{it.val}</div>
              {it.over && <div style={{ fontSize: 9, color: "var(--app-warning-900)" }}>{it.over}</div>}
            </div>
          ))}
        </div>
      </Card>

      <div className="repair-section-heading">
        <span className="app-title-icon"><Factory size={16} strokeWidth={2} /></span>
        <div><strong>核心资源</strong><small>支撑造船生产的关键设施能力</small></div>
      </div>

      <div className="repair-resource-summary ship-resource-summary">
        <span className="repair-resource-icon"><CoreResourceIcon type="factory" /></span>
        <div className="repair-resource-copy"><strong>企业制造资源</strong><small>厂区、码头及岸线资源概览</small></div>
        <div className="repair-resource-total"><strong>6</strong><span>家企业</span></div>
        <div className="repair-resource-facts"><span>厂区面积 <b>600m²</b></span><span>码头长度 <b>600m</b></span></div>
      </div>

      <div className="ship-resource-enterprises">
        {[
          "南通川崎", "大连川崎", "扬州重工", "大连重工", "舟山重工", "广东重工",
        ].map((name, index) => (
          <div className="ship-resource-enterprise" key={name}>
            <span className="ship-resource-enterprise-icon"><Factory size={16} strokeWidth={1.8} /></span>
            <strong>{name}</strong>
            <span className="ship-resource-index">{String(index + 1).padStart(2, "0")}</span>
            <dl className="ship-resource-metrics">
              <div><dt>厂区面积</dt><dd>100 <small>m²</small></dd></div>
              <div><dt>码头长度</dt><dd>100 <small>m</small></dd></div>
              <div><dt>岸线长度</dt><dd>100 <small>m</small></dd></div>
            </dl>
          </div>
        ))}
      </div>

      <div className="repair-resource-summary ship-capacity-summary ship-resource-disclosure" role="button" tabIndex={0} aria-expanded={resourceDetail === "dock"} onClick={() => setResourceDetail((current) => current === "dock" ? null : "dock")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setResourceDetail((current) => current === "dock" ? null : "dock"); }}>
        <span className="repair-resource-icon"><CoreResourceIcon type="dock" /></span>
        <div className="repair-resource-copy"><strong>船坞能力</strong><small>覆盖三类造船吨级</small></div>
        <div className="repair-resource-total"><strong>7</strong><span>个</span></div>
        <ChevronDown className="ship-resource-disclosure-icon" aria-hidden="true" />
        <div className="repair-resource-facts ship-resource-facts-three">
          <span>50万吨级以上 <b>4个</b></span>
          <span>40万吨级以下 <b>2个</b></span>
          <span>30万吨级干船坞 <b>1个</b></span>
        </div>
      </div>
      {resourceDetail === "dock" && <div className="ship-resource-detail" aria-label="船坞明细">
        <div className="ship-resource-detail-head"><strong>船坞明细</strong><span>共5家企业</span></div>
        {resourceRows.map((company) => <article key={`dock-${company}`}>
          <header><strong>{company}</strong><span>船坞编号 1000</span></header>
          <dl><div><dt>规格（长×宽×深）</dt><dd>150×15×14</dd></div><div><dt>大型吊机</dt><dd>1000吨 · 1000台</dd></div><div><dt>总组定盘面积</dt><dd>1000m²</dd></div></dl>
        </article>)}
      </div>}

      <div className="repair-resource-summary ship-capacity-summary ship-resource-disclosure" role="button" tabIndex={0} aria-expanded={resourceDetail === "berth"} onClick={() => setResourceDetail((current) => current === "berth" ? null : "berth")} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setResourceDetail((current) => current === "berth" ? null : "berth"); }}>
        <span className="repair-resource-icon"><CoreResourceIcon type="berth" /></span>
        <div className="repair-resource-copy"><strong>船台能力</strong><small>8–10万吨级造船船台</small></div>
        <div className="repair-resource-total"><strong>4</strong><span>个</span></div>
        <ChevronDown className="ship-resource-disclosure-icon" aria-hidden="true" />
        <div className="repair-resource-facts"><span>能力等级 <b>8–10万吨级</b></span><span>船台总量 <b>4个</b></span></div>
      </div>
      {resourceDetail === "berth" && <div className="ship-resource-detail" aria-label="船台明细">
        <div className="ship-resource-detail-head"><strong>船台明细</strong><span>共5家企业</span></div>
        {resourceRows.map((company) => <article key={`berth-${company}`}>
          <header><strong>{company}</strong><span>船台编号 1000</span></header>
          <dl><div><dt>规格（长×宽×深）</dt><dd>150×15×14</dd></div><div><dt>大型吊机</dt><dd>1000吨 · 1000台</dd></div><div><dt>总组定盘面积</dt><dd>1000m²</dd></div></dl>
        </article>)}
      </div>}

      <Footer text="生产主题 · 造船板块 · 数据口径随时间切换" />
    </>
  );
}

function PageProdShipDelivery() {
  const deliveryRows = [
    { company: "南通川崎", project: "NE440", contract: "2024-12-26", schedule: "2024-10-30", actual: "2024-10-30", ac: 57, bc: 0 },
    { company: "大连川崎", project: "DE153", contract: "2024-12-20", schedule: "2024-11-20", actual: "2024-11-20", ac: 30, bc: 0 },
    { company: "大连重工", project: "N1118", contract: "2025-02-28", schedule: "2024-11-20", actual: "2024-11-20", ac: 100, bc: 0 },
    { company: "舟山重工", project: "N1142", contract: "2024-12-31", schedule: "2024-11-12", actual: "2024-11-08", ac: 53, bc: 4 },
    { company: "舟山重工", project: "N787", contract: "2024-10-30", schedule: "2024-10-30", actual: "2024-10-30", ac: 0, bc: 0 },
  ];
  return (
    <>
      <StatusBar />
      <NavBar title="交付实绩明细" backLabel="返回造船主题" backPage="prod-ship" />

      <div className="ship-delivery-detail-summary">
        <div className="ship-delivery-detail-period"><CalendarClock size={15} strokeWidth={2} /><strong>2024年10月实绩</strong></div>
        <div className="ship-delivery-detail-kpis">
          <div><span>计划交付</span><strong>5<small>艘</small></strong></div>
          <div><span>实际交付</span><strong>5<small>艘</small></strong></div>
          <div><span>按期交付率</span><strong>100<small>%</small></strong></div>
          <div><span>延期数量</span><strong>0<small>艘</small></strong></div>
        </div>
      </div>

      <Card title="交付项目" extra="共5艘" className="app-production-card ship-delivery-detail-list" noPad>
        {deliveryRows.map((row) => (
          <article className="ship-delivery-detail-row" key={row.project}>
            <header>
              <div><strong>{row.company}</strong><span>{row.project}</span></div>
              <StatusBadge tone="success">按期交付</StatusBadge>
            </header>
            <div className="ship-delivery-timeline">
              <div><span>合同计划 A</span><strong>{row.contract}</strong></div>
              <i />
              <div><span>线表计划 B</span><strong>{row.schedule}</strong></div>
              <i />
              <div><span>交付实绩 C</span><strong>{row.actual}</strong></div>
            </div>
            <footer>
              <span>A-C <b>{row.ac}天</b></span>
              <span>B-C <b>{row.bc}天</b></span>
            </footer>
          </article>
        ))}
      </Card>

      <Footer text="造船交付实绩 · 2024年10月 · 共5艘" />
    </>
  );
}

function PageProdShipDeliveryDetail() {
  const companies = ["南通川崎", "大连川崎", "扬州重工", "大连重工", "舟山重工", "广东重工"];
  const dwt  = [62, 78, 55, 72, 80, 30]; // 万载重吨
  const cgt  = [50, 57, 65, 40, 90, 25]; // 万修正总吨
  const maxV = 100;

  return (
    <>
      <StatusBar />
      <NavBar title="交付进度明细" backLabel="返回造船主题" backPage="prod-ship" />
      <BreadcrumbBar period="截至7.10" crumbs={[]} />

      {/* 累计交付情况 — 分组条形图 */}
      <div style={{ background: C.card, margin: "8px 10px 0", borderRadius: 12, padding: "10px 10px 10px", boxShadow: "var(--app-shadow-card)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 12 }}>累计交付情况</div>

        {/* 图例 */}
        <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 14, height: 10, borderRadius: 2, background: C.brand }} />
            <span style={{ fontSize: 10, color: C.t3 }}>万载重吨</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 14, height: 10, borderRadius: 2, background: C.phDark }} />
            <span style={{ fontSize: 10, color: C.t3 }}>万修正总吨</span>
          </div>
        </div>

        {/* 条形图：每家企业两条并排 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {companies.map((co, i) => (
            <div key={i}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: C.t2 }}>{co}</span>
              </div>
              {/* 万载重吨 */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 9, color: C.t3, width: 36, flexShrink: 0 }}>载重吨</span>
                <div style={{ flex: 1, height: 12, borderRadius: 3, overflow: "hidden", background: C.bg }}>
                  <div style={{ width: `${(dwt[i] / maxV) * 100}%`, height: "100%", background: C.brand, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.t1, width: 32, textAlign: "right", flexShrink: 0 }}>{dwt[i]}万</span>
              </div>
              {/* 万修正总吨 */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 9, color: C.t3, width: 36, flexShrink: 0 }}>修正吨</span>
                <div style={{ flex: 1, height: 12, borderRadius: 3, overflow: "hidden", background: C.bg }}>
                  <div style={{ width: `${(cgt[i] / maxV) * 100}%`, height: "100%", background: C.success, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.t2, width: 32, textAlign: "right", flexShrink: 0 }}>{cgt[i]}万</span>
              </div>
            </div>
          ))}
        </div>

        {/* X轴刻度 */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingLeft: 42 }}>
          {[0, 25, 50, 75, 100].map(v => (
            <span key={v} style={{ fontSize: 9, color: C.t3 }}>{v}</span>
          ))}
        </div>
      </div>

      {/* 企业明细表 */}
      <div style={{ background: C.card, margin: "8px 10px 8px", borderRadius: 12, padding: "10px 10px 10px", boxShadow: "var(--app-shadow-card)" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.t1, marginBottom: 12 }}>企业交付明细</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 0 }}>
          {["企业", "艘数", "万载重吨", "万修正吨"].map((h, i) => (
            <div key={i} style={{ padding: "6px 4px", background: C.ph, fontSize: 9, fontWeight: 600, color: C.t2, textAlign: "center", borderBottom: `1px solid ${C.border}` }}>{h}</div>
          ))}
          {companies.map((co, i) => [
            <div key={`${i}n`} style={{ padding: "7px 4px", fontSize: 10, color: C.t2, textAlign: "center", borderBottom: `1px solid ${C.divider}` }}>{co}</div>,
            <div key={`${i}s`} style={{ padding: "7px 4px", fontSize: 10, fontWeight: 600, color: C.t1, textAlign: "center", borderBottom: `1px solid ${C.divider}` }}>{Math.round(dwt[i] / 12)}</div>,
            <div key={`${i}d`} style={{ padding: "7px 4px", fontSize: 10, fontWeight: 600, color: C.t1, textAlign: "center", borderBottom: `1px solid ${C.divider}` }}>{dwt[i]}</div>,
            <div key={`${i}c`} style={{ padding: "7px 4px", fontSize: 10, fontWeight: 600, color: C.t2, textAlign: "center", borderBottom: `1px solid ${C.divider}` }}>{cgt[i]}</div>,
          ])}
        </div>
      </div>

      <Footer text="造船交付进度明细 · 截至7.10" />
    </>
  );
}

function PageProdShipTrack() {
  const companies = [
    { name: "扬州重工", total: 17, stages: [4, 4, 7, 2] },
    { name: "南通川崎", total: 11, stages: [2, 3, 5, 1] },
    { name: "启东海工", total: 11, stages: [3, 3, 4, 1] },
    { name: "舟山重工", total: 10, stages: [2, 2, 4, 2] },
    { name: "大连重工", total: 10, stages: [2, 3, 4, 1] },
    { name: "大连川崎", total: 10, stages: [2, 2, 4, 2] },
    { name: "广东重工", total: 3, stages: [1, 1, 1, 0] },
  ];
  return (
    <>
      <StatusBar />
      <NavBar title="生产主题" backLabel="返回造船主题" backPage="prod-ship" />
      <BreadcrumbBar crumbs={["首页", "生产主题", "造船", "生产跟踪"]} period="截至7.10" />

      <div className="production-detail-page ship-track-page">
        <Card title="建造阶段总览" className="production-stage-card ship-detail-title-card">
          <div className="stage-total"><span>在建总数</span><strong>72<small>艘</small></strong><em>重点阶段 <b>码头舾装 29艘</b></em></div>
          <div className="stage-stacked-bar" aria-label="造船在建阶段分布"><i style={{ flex: 16 }}/><i style={{ flex: 18 }}/><i style={{ flex: 29 }}/><i style={{ flex: 9 }}/></div>
          <div className="stage-legend">{[["分段制作",16],["总组搭载",18],["码头舾装",29],["完工待交",9]].map(([label,value],i)=><div key={String(label)}><i data-index={i}/><span>{label}</span><strong>{value}<small>艘</small></strong></div>)}</div>
        </Card>
        <Card title="企业阶段分布" className="production-list-card ship-stage-matrix-card ship-detail-title-card" noPad>
          <div className="ship-stage-matrix" role="table" aria-label="各企业造船在建阶段分布">
            <div className="ship-stage-matrix-head" role="row"><span>企业</span><span>分段</span><span>总组</span><span>舾装</span><span>待交</span><span>合计</span></div>
            {companies.map((row)=><div className="ship-stage-matrix-row" role="row" key={row.name}>
              <strong>{row.name}</strong>
              {row.stages.map((value,index)=><span key={index} className={`is-stage-${index}`}>{value || "—"}</span>)}
              <em>{row.total}</em>
            </div>)}
            <div className="ship-stage-matrix-total" role="row"><strong>合计</strong><span className="is-stage-0">16</span><span className="is-stage-1">18</span><span className="is-stage-2">29</span><span className="is-stage-3">9</span><em>72</em></div>
          </div>
        </Card>
        <div className="production-update-note">按建造阶段统计 · 截至7.10</div>
      </div>

      <Footer text="造船在建按建造阶段分布 · 截至3.16" />
    </>
  );
}

function PageFinance() {
  return (
    <>
      <StatusBar />
      <NavBar title="财务主题" backLabel="返回首页" backPage="home" />
      <BreadcrumbBar crumbs={["首页", "财务主题"]} />

      {/* L5 汇率 — 整卡可点击 */}
      <Card title="汇率（USD/CNY）" extra="走势详情" onExtra={() => nav("finance-rate")} className="mt-3">
        <div onClick={() => nav("finance-rate")} style={{ display: "flex", alignItems: "stretch", gap: 0, cursor: "pointer" }}>
          <div style={{ flex: 1, paddingRight: 14 }}>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 5 }}>实时汇率</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>7.1833</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#D4700A" }}>↑ 0.12%</span>
            </div>
            <div style={{ fontSize: 10, color: C.t3, marginTop: 5 }}>较记账偏升 0.03</div>
          </div>
          <div style={{ width: 1, background: C.divider, alignSelf: "stretch", flexShrink: 0 }} />
          <div style={{ flex: 1, paddingLeft: 14 }}>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 5 }}>月度记账汇率</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>7.1500</span>
            </div>
            <div style={{ fontSize: 10, color: C.t3, marginTop: 5 }}>本月固定记账基准</div>
          </div>
        </div>
      </Card>

      {/* L5 可用资金 — 整卡可点击 */}
      <Card title="可用资金" tag="不含受限资金" extra="分企业明细" onExtra={() => nav("finance-fund")}>
        <div onClick={() => nav("finance-fund")} style={{ display: "flex", gap: 12, cursor: "pointer" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 4 }}>合计（人民币）</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums", lineHeight: 1.3 }}>1,692,871.67</div>
            <div style={{ fontSize: 9, color: C.t3 }}>万</div>
            <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 3 }}>
              {[["人民币", "72.25%"], ["美元", "27.48%"], ["欧元", "0.27%"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.t3 }}>
                  <span>{k}</span><span style={{ fontWeight: 600, color: C.t1 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ width: 90, flexShrink: 0 }}>
            <DonutBox label="币种占比" center={"72.25%\n人民币"} />
          </div>
        </div>
      </Card>

      {/* L7 业务分区 — 各卡可点击下钻 */}
      {[
        { title: "营业收入", v: "567,882.34", prev: "5,678.82", pct: "1.48%", budget: "5,678.82", rate: "56.78%", page: "finance-revenue" },
        { title: "利润总额", v: "567,882.34", prev: "567.88",   pct: "7.48%", budget: "567.88",   rate: "56.78%", page: "finance-revenue" },
      ].map((it) => (
        <Card key={it.title} title={it.title} tag="1-7月累计" extra="趋势分析" onExtra={() => nav(it.page)}>
          <div onClick={() => nav(it.page)} style={{ cursor: "pointer" }}>
            <div style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{it.v}</span>
              <span style={{ fontSize: 10, color: C.t3, marginLeft: 4 }}>万</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, fontSize: 10, color: C.t3 }}>
              <div>去年同期<br /><b style={{ color: C.t1 }}>{it.prev}万</b></div>
              <div>同比<br /><b style={{ color: C.t1 }}>{it.pct}</b></div>
              <div>完成率<br /><b style={{ color: C.t1 }}>{it.rate}</b></div>
            </div>
          </div>
        </Card>
      ))}

      <Card title="成本费用占收入比" tag="1-7月累计" extra="下钻明细" onExtra={() => nav("finance-revenue")}>
        <div style={{ fontSize: 28, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>75.67<span style={{ fontSize: 12, fontWeight: 400 }}>%</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4, fontSize: 10, color: C.t3, marginTop: 6 }}>
          <div>预算<br /><b style={{ color: C.t1 }}>20.67%</b></div>
          <div>去年同期<br /><b style={{ color: C.t1 }}>18.67%</b></div>
          <div>同比<br /><b style={{ color: C.t1 }}>1.48%</b></div>
        </div>
      </Card>

      <Footer text="财务主题 · 总部合并口径 · 月更（久其到数）" />
    </>
  );
}

function PageFinanceFund() {
  const [fundCurrency, setFundCurrency] = useState<"total" | "cny" | "usd" | "eur">("total");
  const [selectedCompany, setSelectedCompany] = useState<number | null>(null);
  // 企业顺序按需求排列
  const companies = ["大连川崎", "扬州重工", "南通船务", "启东海工", "大连重工", "舟山重工", "上海重工", "广东重工", "南通重工装备", "南京船配"];
  const cny = [12800, 9600, 8700, 6200, 18400, 22100, 15300, 11500, 4800, 3200];
  const usd = [4200, 2100, 1800, 900, 6800, 8900, 5600, 3400, 600, 400];
  const eur = [120, 60, 340, 580, 210, 80, 30, 160, 20, 10];
  const totalCny = cny.reduce((s, v) => s + v, 0);
  const totalUsd = usd.reduce((s, v) => s + v, 0);
  const totalEur = eur.reduce((s, v) => s + v, 0);
  const totalByCompany = companies.map((_, index) => Math.round(cny[index] + usd[index] * 7.2 + eur[index] * 7.8));
  const currencyMap = {
    total: { label: "合计", values: totalByCompany, color: "var(--app-primary-900)", unit: "万元" },
    cny: { label: "人民币", values: cny, color: "var(--app-primary)", unit: "万元" },
    usd: { label: "美元", values: usd, color: "var(--app-primary-500)", unit: "万美元" },
    eur: { label: "欧元", values: eur, color: "var(--app-success)", unit: "万欧元" },
  };
  const activeCurrency = currencyMap[fundCurrency];
  const maxValue = Math.max(...activeCurrency.values);
  const rankedCompanies = companies.map((company, index) => ({ company, index, value: activeCurrency.values[index] })).sort((a, b) => b.value - a.value);

  return (
    <>
      <StatusBar />
      <NavBar title="财务主题" backLabel="返回财务主题" backPage="finance" />
      <div className="finance-fund-overview">
        <div className="finance-fund-overview-head"><strong>可用资金总览</strong><StatusBadge tone="primary">不含受限资金</StatusBadge></div>
        <div className="finance-fund-kpis">
          {[
            { label: "人民币", value: totalCny, unit: "万元", color: "var(--app-primary)" },
            { label: "美元", value: totalUsd, unit: "万美元", color: "var(--app-primary-500)" },
            { label: "欧元", value: totalEur, unit: "万欧元", color: "var(--app-success)" },
          ].map((item) => (
            <div key={item.label}><span><i style={{ background: item.color }} />{item.label}</span><strong>{item.value.toLocaleString()}</strong><small>{item.unit}</small></div>
          ))}
        </div>
      </div>

      <Card title="各企业可用资金" tag="企业排名" className="app-production-card finance-fund-chart-card">
        <div className="finance-currency-segmented app-unified-segmented" role="group" aria-label="币种切换">
          {(Object.keys(currencyMap) as Array<keyof typeof currencyMap>).map((key) => (
            <button type="button" key={key} className={fundCurrency === key ? "is-active" : ""} onClick={() => setFundCurrency(key)}>{currencyMap[key].label}</button>
          ))}
        </div>
        <div className="finance-fund-unit">
          单位：{activeCurrency.unit} · 按金额从高到低
          {fundCurrency === "total" && <span> · 人民币折算：USD 7.20 / EUR 7.80</span>}
        </div>
        <div className="finance-fund-ranking">
          {rankedCompanies.map((item, rank) => (
            <button type="button" className="finance-fund-row" key={item.company} onClick={() => setSelectedCompany(item.index)}>
              <span className="finance-fund-rank">{String(rank + 1).padStart(2, "0")}</span>
              <span className="finance-fund-company">{item.company}</span>
              <span className="finance-fund-track"><i style={{ width: `${(item.value / maxValue) * 100}%`, background: activeCurrency.color }} /></span>
              <strong>{item.value.toLocaleString()}</strong>
            </button>
          ))}
        </div>
        <div className="finance-fund-hint">点击企业查看分币种资金明细</div>
      </Card>

      <Sheet open={selectedCompany !== null} onOpenChange={(open) => { if (!open) setSelectedCompany(null); }}>
        <SheetContent side="bottom" className="finance-fund-sheet">
          {selectedCompany !== null && (
            <>
              <SheetHeader>
                <SheetTitle>{companies[selectedCompany]} · 可用资金</SheetTitle>
                <SheetDescription>不含受限资金，按原币金额展示</SheetDescription>
              </SheetHeader>
              <div className="finance-fund-sheet-values">
                <div><span><i className="is-cny" />人民币</span><strong>{cny[selectedCompany].toLocaleString()}<small>万元</small></strong></div>
                <div><span><i className="is-usd" />美元</span><strong>{usd[selectedCompany].toLocaleString()}<small>万美元</small></strong></div>
                <div><span><i className="is-eur" />欧元</span><strong>{eur[selectedCompany].toLocaleString()}<small>万欧元</small></strong></div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Footer text="各企业分币种可用资金（不含受限资金）" />
    </>
  );
}

function PageFinanceRate() {
  const [rateType, setRateType] = useState<"book" | "mid" | "offshore">("book");
  const [rateRange, setRateRange] = useState<"1M" | "3M" | "1Y">("1Y");
  const months = ["2025-09","2025-10","2025-11","2025-12","2026-01","2026-02","2026-03","2026-04"];
  const rateSeries = {
    book: { label: "记账汇率", current: 7.2000, values: [7.08, 7.12, 7.18, 7.24, 7.19, 7.21, 7.26, 7.20] },
    mid: { label: "中间价", current: 7.1833, values: [7.06, 7.10, 7.16, 7.22, 7.17, 7.20, 7.23, 7.1833] },
    offshore: { label: "离岸价", current: 7.1500, values: [7.04, 7.08, 7.14, 7.19, 7.15, 7.18, 7.21, 7.15] },
  };
  const selectedRate = rateSeries[rateType];
  const sliceCount = rateRange === "1M" ? 2 : rateRange === "3M" ? 4 : months.length;
  const visibleMonths = months.slice(-sliceCount);
  const visibleValues = selectedRate.values.slice(-sliceCount);
  const rateHigh = Math.max(...selectedRate.values);
  const rateLow = Math.min(...selectedRate.values);
  return (
    <>
      <StatusBar />
      <NavBar title="财务主题" backLabel="返回财务主题" backPage="finance" />

      <div className="finance-rate-overview">
        <div className="finance-rate-overview-head"><span>美元兑人民币 · 记账汇率</span><StatusBadge tone="primary">USD/CNY</StatusBadge></div>
        <div className="finance-rate-current"><strong>7.2000</strong><span className="is-up">+0.0200　+0.28%</span></div>
        <div className="finance-rate-meta"><span>同比 <b>+0.0500</b></span><span>环比 <b>+0.0200</b></span><span>更新 10:30</span></div>
      </div>

      <Card title="市场汇率" tag="最近更新 10:30" className="app-production-card finance-rate-market-card">
        {[
          { name: "美元兑人民币（中间价）", code: "中间价", value: 7.1833, delta: "+0.0083", pct: "+0.12%", tone: "up", high: 7.2300, low: 7.0600 },
          { name: "美元兑人民币（离岸价）", code: "离岸价", value: 7.1500, delta: "-0.0120", pct: "-0.17%", tone: "down", high: 7.2100, low: 7.0400 },
        ].map((quote) => (
          <div className="finance-rate-quote" key={quote.code}>
            <div className="finance-rate-quote-head"><strong>{quote.name}</strong><StatusBadge tone="muted">{quote.code}</StatusBadge></div>
            <div className="finance-rate-quote-value">
              <div><small>最新</small><strong>{quote.value.toFixed(4)}</strong></div>
              <div><small>涨跌额</small><span className={quote.tone === "up" ? "is-up" : "is-down"}>{quote.delta}</span></div>
              <div><small>涨跌幅</small><span className={quote.tone === "up" ? "is-up" : "is-down"}>{quote.pct}</span></div>
            </div>
            <div className="finance-rate-range"><span>近一年最高 <b>{quote.high.toFixed(4)}</b></span><span>近一年最低 <b>{quote.low.toFixed(4)}</b></span></div>
          </div>
        ))}
      </Card>

      <Card title="美元兑人民币汇率走势" className="app-production-card finance-rate-trend-card">
        <div className="finance-rate-controls">
          <div className="finance-rate-type app-unified-segmented" role="group" aria-label="汇率类型">
            {(Object.keys(rateSeries) as Array<keyof typeof rateSeries>).map((key) => <button type="button" key={key} className={rateType === key ? "is-active" : ""} onClick={() => setRateType(key)}>{rateSeries[key].label}</button>)}
          </div>
          <div className="finance-rate-period app-unified-segmented" role="group" aria-label="时间范围">
            {(["1M", "3M", "1Y"] as const).map((range) => <button type="button" key={range} className={rateRange === range ? "is-active" : ""} onClick={() => setRateRange(range)}>{range}</button>)}
          </div>
        </div>
        <div className="finance-rate-trend-summary"><span>{selectedRate.label}</span><strong>{selectedRate.current.toFixed(4)}</strong><small>最高 {rateHigh.toFixed(4)} · 最低 {rateLow.toFixed(4)}</small></div>
        {(() => {
          const W = 300, H = 132, padL = 38, padR = 12, padT = 18, padB = 24;
          const yMin = Math.min(...visibleValues) - 0.03, yMax = Math.max(...visibleValues) + 0.03;
          const chartW = W - padL - padR, chartH = H - padT - padB;
          const xScale = (i: number) => padL + (visibleValues.length === 1 ? chartW / 2 : (i / (visibleValues.length - 1)) * chartW);
          const yScale = (v: number) => padT + chartH - ((v - yMin) / (yMax - yMin)) * chartH;
          const points = visibleValues.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
          const area = `${padL},${padT + chartH} ${points} ${xScale(visibleValues.length - 1)},${padT + chartH}`;
          const highIndex = visibleValues.indexOf(Math.max(...visibleValues));
          const lowIndex = visibleValues.indexOf(Math.min(...visibleValues));
          return <svg className="finance-rate-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-label={`${selectedRate.label}汇率走势`}>
            {[0, 1, 2].map((tick) => { const value = yMin + ((yMax - yMin) / 2) * tick; return <g key={tick}><line x1={padL} y1={yScale(value)} x2={W - padR} y2={yScale(value)} stroke={C.divider} strokeWidth="0.6" /><text x={padL - 4} y={yScale(value) + 3} textAnchor="end" fontSize="8" fill={C.t3}>{value.toFixed(2)}</text></g>; })}
            <polygon points={area} fill="var(--app-primary-100)" />
            <polyline points={points} fill="none" stroke="var(--app-primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            {visibleValues.map((value, index) => <g key={visibleMonths[index]}><circle cx={xScale(index)} cy={yScale(value)} r="3" fill={index === highIndex ? "var(--app-warning)" : index === lowIndex ? "var(--app-success)" : "var(--app-primary)"} /><text x={xScale(index)} y={H - 7} textAnchor="middle" fontSize="8" fill={C.t3}>{visibleMonths[index].slice(5)}</text>{index === visibleValues.length - 1 && <text x={xScale(index) - 2} y={yScale(value) - 8} textAnchor="end" fontSize="9" fontWeight="700" fill={C.brand}>{value.toFixed(4)}</text>}</g>)}
          </svg>;
        })()}
        <div className="finance-rate-legend"><span><i className="is-current" />当前</span><span><i className="is-high" />区间高点</span><span><i className="is-low" />区间低点</span></div>
      </Card>

      <Footer text="美元兑人民币汇率 · 数据更新时间 2026年7月21日 10:30" />
    </>
  );
}

function PageFinanceRevenue() {
  const [tip, setTip] = useState<number | null>(null);
  const [companyTip, setCompanyTip] = useState<number | null>(null);

  const months  = ["2023-11","2023-12","2024-01","2024-02","2024-03","2024-04","2024-05","2024-06","2024-07","2024-08","2024-09","2024-10"];
  const revenue = [68000, 82000, 45000, 52000, 71000, 75000, 78000, 82000, 79000, 85000, 88000, 91000];
  const profit  = [ 8160,  9840,  4950,  5720,  8520,  9000,  9360, 10660,  9480, 10200, 10560, 12740];
  const margin  = profit.map((p, i) => +(p / revenue[i] * 100).toFixed(1));

  const prevRevenue = [null, ...revenue.slice(0, -1)] as (number | null)[];
  const prevProfit  = [null, ...profit.slice(0, -1)]  as (number | null)[];
  const prevMargin  = [null, ...margin.slice(0, -1)]  as (number | null)[];

  // chart geometry
  const N = months.length;
  const CW = 560;   // total chart width (scrollable)
  const CH = 160;   // chart height
  const PAD_L = 36; const PAD_R = 30; const PAD_T = 8; const PAD_B = 24;
  const plotW = CW - PAD_L - PAD_R;
  const plotH = CH - PAD_T - PAD_B;
  const slotW = plotW / N;
  const barW  = slotW * 0.32;

  const maxRev = 100000;  // left Y max
  const maxMgn = 20;      // right Y max (%)

  const toY  = (v: number) => PAD_T + plotH - (v / maxRev) * plotH;
  const toYR = (v: number) => PAD_T + plotH - (v / maxMgn) * plotH;
  const toX  = (i: number) => PAD_L + slotW * i + slotW / 2;

  // smooth line path through margin points
  const linePts = margin.map((v, i) => [toX(i), toYR(v)] as [number, number]);
  const lineD = linePts.reduce((acc, [x, y], i) => {
    if (i === 0) return `M${x},${y}`;
    const [px, py] = linePts[i - 1];
    const cpx = (px + x) / 2;
    return `${acc} C${cpx},${py} ${cpx},${y} ${x},${y}`;
  }, "");
  const areaD = `${lineD} L${linePts[N-1][0]},${PAD_T + plotH} L${linePts[0][0]},${PAD_T + plotH} Z`;

  const BLUE  = C.brand;
  const LIGHT_BLUE = "#79BBFF";
  const GREEN  = "#39BB82";
  const ORANGE = "#E6A23C";
  const companyRevenueData = [
    { company: "南通川崎", revenue: 98500, profit: 13790, margin: 14.0, revenueMom: 8.6 },
    { company: "大连川崎", revenue: 86200, profit: 11120, margin: 12.9, revenueMom: 5.2 },
    { company: "扬州重工", revenue: 77800, profit: 8940,  margin: 11.5, revenueMom: -2.1 },
    { company: "舟山重工", revenue: 71600, profit: 9380,  margin: 13.1, revenueMom: 6.8 },
    { company: "上海重工", revenue: 65400, profit: 7520,  margin: 11.5, revenueMom: -1.4 },
    { company: "广东重工", revenue: 59800, profit: 7410,  margin: 12.4, revenueMom: 4.3 },
  ];
  const ECW = 470, ECH = 176, EPAD_L = 34, EPAD_R = 32, EPAD_T = 16, EPAD_B = 32;
  const ePlotW = ECW - EPAD_L - EPAD_R;
  const ePlotH = ECH - EPAD_T - EPAD_B;
  const eSlotW = ePlotW / companyRevenueData.length;
  const eAmountMax = 120000;
  const eRateMin = -10;
  const eRateMax = 20;
  const eToX = (index: number) => EPAD_L + eSlotW * index + eSlotW / 2;
  const eToAmountY = (value: number) => EPAD_T + ePlotH - (value / eAmountMax) * ePlotH;
  const eToRateY = (value: number) => EPAD_T + ePlotH - ((value - eRateMin) / (eRateMax - eRateMin)) * ePlotH;
  const companyMarginPoints = companyRevenueData.map((item, index) => [eToX(index), eToRateY(item.margin)] as [number, number]);
  const companyMomPoints = companyRevenueData.map((item, index) => [eToX(index), eToRateY(item.revenueMom)] as [number, number]);
  const toSmoothPath = (points: Array<[number, number]>) => points.reduce((path, [x, y], index) => {
    if (index === 0) return `M${x},${y}`;
    const [previousX, previousY] = points[index - 1];
    const controlX = (previousX + x) / 2;
    return `${path} C${controlX},${previousY} ${controlX},${y} ${x},${y}`;
  }, "");

  return (
    <>
      <StatusBar />
      <NavBar title="财务主题" backLabel="返回财务主题" backPage="finance" />
      <BreadcrumbBar crumbs={["首页", "财务主题", "营业收入"]} />

      <div style={{ background: C.card, borderRadius: 12, margin: "8px 10px 8px", padding: "10px 10px 8px", boxShadow: "var(--app-shadow-card)" }}>
        {/* 标题行 */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>近12个月营业收入月度趋势</span>
          <span style={{ fontSize: 9, color: C.t3 }}>指标趋势分析为总部合并口径</span>
        </div>

        {/* 图例 */}
        <div style={{ display: "flex", gap: 14, marginBottom: 10, flexWrap: "wrap" }}>
          {[
            { label: "营业收入（万元）", color: BLUE,   type: "bar"  },
            { label: "营业毛利（万元）", color: LIGHT_BLUE, type: "bar"  },
            { label: "毛利率（%）",     color: GREEN,  type: "line" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {l.type === "bar"
                ? <div style={{ width: 10, height: 10, background: l.color, borderRadius: 2 }} />
                : <div style={{ width: 14, height: 2, background: l.color, borderRadius: 1 }} />}
              <span style={{ fontSize: 9, color: C.t3 }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* 双轴 Y 标签行 */}
        <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: PAD_L, paddingRight: PAD_R, marginBottom: 2 }}>
          <span style={{ fontSize: 9, color: C.t3 }}>万元</span>
          <span style={{ fontSize: 9, color: GREEN }}>%（毛利率）</span>
        </div>

        {/* 图表横向滚动容器 */}
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", position: "relative" } as React.CSSProperties}>
          <svg width={CW} height={CH} style={{ display: "block", overflow: "visible" }}>
            {/* 网格线（极淡） */}
            {[0, 0.25, 0.5, 0.75, 1].map(f => (
              <line key={f}
                x1={PAD_L} y1={PAD_T + plotH * (1 - f)}
                x2={PAD_L + plotW} y2={PAD_T + plotH * (1 - f)}
                stroke="#F0F0F0" strokeWidth="1" />
            ))}

            {/* 左Y轴刻度 */}
            {[0, 25000, 50000, 75000, 100000].map((v, i) => (
              <text key={v} x={PAD_L - 3} y={toY(v) + 3} textAnchor="end" fontSize="9" fill={C.t3}>
                {v === 0 ? "0" : v >= 10000 ? `${v/10000}w` : v}
              </text>
            ))}

            {/* 右Y轴刻度 */}
            {[0, 5, 10, 15, 20].map(v => (
              <text key={v} x={CW - PAD_R + 4} y={toYR(v) + 3} textAnchor="start" fontSize="9" fill={GREEN}>
                {v}%
              </text>
            ))}

            {/* 面积填充 */}
            <path d={areaD} fill={GREEN} fillOpacity="0.08" />

            {/* 柱状图 */}
            {months.map((_, i) => {
              const cx = toX(i);
              const revH = (revenue[i] / maxRev) * plotH;
              const proH = (profit[i]  / maxRev) * plotH;
              const isActive = tip === i;
              return (
                <g key={i} onClick={() => setTip(tip === i ? null : i)} style={{ cursor: "pointer" }}>
                  {/* 营业收入柱 */}
                  <rect
                    x={cx - barW - 1} y={toY(revenue[i])}
                    width={barW} height={revH}
                    fill={BLUE} fillOpacity={isActive ? 1 : 0.82} rx="2"
                  />
                  {/* 营业毛利柱 */}
                  <rect
                    x={cx + 1} y={toY(profit[i])}
                    width={barW} height={proH}
                    fill={LIGHT_BLUE} fillOpacity={isActive ? 1 : 0.82} rx="2"
                  />
                  {/* 点击热区 */}
                  <rect x={cx - slotW/2} y={PAD_T} width={slotW} height={plotH} fill="transparent" />
                </g>
              );
            })}

            {/* 毛利率折线 */}
            <path d={lineD} fill="none" stroke={GREEN} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            {margin.map((v, i) => (
              <circle key={i} cx={toX(i)} cy={toYR(v)} r={tip === i ? 4 : 2.5}
                fill={tip === i ? GREEN : "#fff"} stroke={GREEN} strokeWidth="1.5" />
            ))}

            {/* X轴月份 */}
            {months.map((m, i) => (
              <text key={i} x={toX(i)} y={CH - 6} textAnchor="middle" fontSize="9" fill={C.t3}>
                {m.slice(5)}
              </text>
            ))}
            {/* X轴年份标注 */}
            <text x={toX(0)} y={CH - 0} textAnchor="middle" fontSize="6" fill={C.t3}>2023</text>
            <text x={toX(2)} y={CH - 0} textAnchor="middle" fontSize="6" fill={C.t3}>2024</text>
          </svg>

          {/* Tooltip */}
          {tip !== null && (() => {
            const i = tip;
            const cx = toX(i);
            const alignRight = i >= N - 3;
            const tipX = alignRight ? cx - 120 : cx - 10;
            const mgDelta = prevMargin[i] !== null ? (margin[i] - (prevMargin[i] as number)).toFixed(1) : null;
            const revDelta = prevRevenue[i] !== null ? (((revenue[i] - (prevRevenue[i] as number)) / (prevRevenue[i] as number)) * 100).toFixed(1) : null;
            return (
              <div style={{
                position: "absolute",
                top: 20,
                left: Math.max(8, Math.min(tipX, CW - 128)),
                background: C.brand, color: "#fff", borderRadius: 8,
                padding: "8px 10px", fontSize: 9.5, whiteSpace: "nowrap",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)", zIndex: 20, pointerEvents: "none",
              }}>
                <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 6 }}>{months[i]}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span style={{ color: "rgba(255,255,255,0.65)" }}>营业收入</span>
                    <span style={{ fontWeight: 700 }}>{revenue[i].toLocaleString()}万</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span style={{ color: "rgba(255,255,255,0.65)" }}>营业毛利</span>
                    <span style={{ fontWeight: 700 }}>{profit[i].toLocaleString()}万
                      {prevProfit[i] !== null && <span style={{ fontWeight: 400, fontSize: 9, marginLeft: 4, color: profit[i] >= (prevProfit[i] as number) ? "#6EE7B7" : "#FCA5A5" }}>
                        {profit[i] >= (prevProfit[i] as number) ? "↑" : "↓"}{Math.abs(profit[i] - (prevProfit[i] as number)).toLocaleString()}
                      </span>}
                    </span>
                  </div>
                  <div style={{ height: 1, background: "rgba(255,255,255,0.12)", margin: "2px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span style={{ color: "rgba(255,255,255,0.65)" }}>毛利率</span>
                    <span style={{ fontWeight: 700, color: GREEN }}>{margin[i]}%
                      {mgDelta !== null && <span style={{ fontWeight: 400, fontSize: 9, marginLeft: 4, color: parseFloat(mgDelta) >= 0 ? "#6EE7B7" : "#FCA5A5" }}>
                        {parseFloat(mgDelta) >= 0 ? "↑" : "↓"}{Math.abs(parseFloat(mgDelta))}pp
                      </span>}
                    </span>
                  </div>
                  {revDelta && (
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                      <span style={{ color: "rgba(255,255,255,0.65)" }}>收入环比</span>
                      <span style={{ fontWeight: 600, color: parseFloat(revDelta) >= 0 ? "#6EE7B7" : "#FCA5A5" }}>
                        {parseFloat(revDelta) >= 0 ? "+" : ""}{revDelta}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        <div style={{ marginTop: 6, fontSize: 9, color: C.t3 }}>点击月份查看当月明细 · 左轴：金额（万元）· 右轴：毛利率（%）</div>
      </div>

      <Card title="各企业营业收入与盈利趋势" tag="企业对比" className="finance-revenue-company-card">
        <div className="finance-revenue-company-legend">
          <span><i style={{ background: BLUE }} />营业收入</span>
          <span><i style={{ background: LIGHT_BLUE }} />营业毛利</span>
          <span><i className="is-line" style={{ background: GREEN }} />毛利率</span>
          <span><i className="is-line" style={{ background: ORANGE }} />收入环比</span>
        </div>
        <div className="finance-revenue-company-axis"><span>万元</span><span>%</span></div>
        <div className="finance-revenue-company-scroll">
          <svg width={ECW} height={ECH} aria-label="各企业营业收入、营业毛利、毛利率和收入环比趋势">
            {[0, 30000, 60000, 90000, 120000].map(value => <g key={value}>
              <line x1={EPAD_L} y1={eToAmountY(value)} x2={ECW - EPAD_R} y2={eToAmountY(value)} stroke="#F0F0F0" strokeWidth="1" />
              <text x={EPAD_L - 4} y={eToAmountY(value) + 3} textAnchor="end" fontSize="8" fill={C.t3}>{value === 0 ? "0" : `${value / 10000}w`}</text>
            </g>)}
            {[eRateMin, 0, 10, eRateMax].map(value => <text key={value} x={ECW - EPAD_R + 4} y={eToRateY(value) + 3} fontSize="8" fill={value < 0 ? C.danger : C.t3}>{value}%</text>)}
            {companyRevenueData.map((item, index) => {
              const x = eToX(index);
              const active = companyTip === index;
              const revenueHeight = ePlotH - (eToAmountY(item.revenue) - EPAD_T);
              const profitHeight = ePlotH - (eToAmountY(item.profit) - EPAD_T);
              return <g key={item.company}>
                <rect x={x - 17} y={eToAmountY(item.revenue)} width="15" height={revenueHeight} rx="3" fill={BLUE} opacity={active ? 1 : .85} />
                <rect x={x + 2} y={eToAmountY(item.profit)} width="15" height={profitHeight} rx="3" fill={LIGHT_BLUE} opacity={active ? 1 : .85} />
                <rect x={x - eSlotW / 2} y={EPAD_T} width={eSlotW} height={ePlotH + EPAD_B} fill="transparent" role="button" tabIndex={0} aria-label={`${item.company}，营业收入${item.revenue}万元，营业毛利${item.profit}万元，毛利率${item.margin}%，收入环比${item.revenueMom}%`} onPointerEnter={event => { if (event.pointerType === "mouse") setCompanyTip(index); }} onPointerLeave={event => { if (event.pointerType === "mouse") setCompanyTip(null); }} onPointerDown={event => { if (event.pointerType !== "mouse") setCompanyTip(index); }} onClick={() => setCompanyTip(index)} onFocus={() => setCompanyTip(index)} onBlur={() => setCompanyTip(null)} />
                <text x={x} y={ECH - 8} textAnchor="middle" fontSize="9" fill={C.t3}>{item.company}</text>
              </g>;
            })}
            <path d={toSmoothPath(companyMarginPoints)} fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d={toSmoothPath(companyMomPoints)} fill="none" stroke={ORANGE} strokeWidth="1.8" strokeDasharray="4 3" strokeLinecap="round" strokeLinejoin="round" />
            {companyRevenueData.map((item, index) => <g key={`rate-${item.company}`}>
              <circle cx={eToX(index)} cy={eToRateY(item.margin)} r={companyTip === index ? 4 : 2.6} fill="#fff" stroke={GREEN} strokeWidth="1.6" />
              <circle cx={eToX(index)} cy={eToRateY(item.revenueMom)} r={companyTip === index ? 4 : 2.6} fill="#fff" stroke={ORANGE} strokeWidth="1.6" />
            </g>)}
          </svg>
          {companyTip !== null && (() => {
            const item = companyRevenueData[companyTip];
            const left = Math.max(8, Math.min(eToX(companyTip) - 46, ECW - 152));
            return <div className="finance-revenue-company-tooltip" style={{ left }}>
              <strong>{item.company}</strong>
              <span>营业收入 <b>{item.revenue.toLocaleString()}万</b></span>
              <span>营业毛利 <b>{item.profit.toLocaleString()}万</b></span>
              <span>毛利率 <b className="is-good">{item.margin}%</b></span>
              <span>收入环比 <b className={item.revenueMom >= 0 ? "is-good" : "is-risk"}>{item.revenueMom >= 0 ? "+" : ""}{item.revenueMom}%</b></span>
            </div>;
          })()}
        </div>
        <div className="finance-revenue-company-note">点击或触摸企业查看四项经营指标 · 左轴：金额（万元）· 右轴：比率（%）</div>
      </Card>

      <Footer text="总部合并口径 · 营业收入趋势与企业经营对比 · 2023-11~2024-10" />
    </>
  );
}

function PagePurchaseSteel() {
  return (
    <>
      <StatusBar />
      <NavBar title="采购主题（钢材锁价）" backLabel="返回首页" backPage="home" />
      <BreadcrumbBar crumbs={["首页", "采购主题", "钢材锁价"]} />

      {/* 顶部4张等宽指标卡 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, padding: "8px 10px 4px" }}>
        {([
          { title: "项目总数量",   value: "53",    unit: "个"  },
          { title: "钢板总数量",   value: "82.58", unit: "万吨" },
          { title: "实际交付数量", value: "0",     unit: "万吨" },
          { title: "待交付钢板数量", value: "82.58", unit: "万吨" },
        ] as const).map((card, i) => (
          <div key={i} style={{
            background: C.brand, borderRadius: 8, padding: "10px 6px 10px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            minHeight: 80,
          }}>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 6, lineHeight: 1.3 }}>{card.title}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{card.value}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{card.unit}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "0 10px 6px", fontSize: 10, color: C.t3, lineHeight: "16px" }}>
        本月船用钢板基价 3804 元/吨（不含税 3366 元/吨），较上期上涨 10 元/吨，涨幅 0.26%。数据来源：我的钢铁网
      </div>

      <Card title="近6个月船用钢板价格分布">
        <div style={{ display: "flex", gap: 12, marginBottom: 8 }}>
          {["板材采购基价", "板材市场基价"].map((l, i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 10, height: 2, background: i === 0 ? C.t1 : C.phDark }} />
              <span style={{ fontSize: 10, color: C.t3 }}>{l}</span>
            </div>
          ))}
        </div>
        {/* Dual line chart: steel plate price */}
        {(() => {
          const months = ["01月","02月","03月","04月","05月","06月"];
          const purchase = [3480, 3510, 3540, 3560, 3590, 3804];
          const market   = [3420, 3450, 3480, 3520, 3560, 3720];
          const yTicks = [3400, 3500, 3600, 3700, 3800];
          const yMin = 3380, yMax = 3850;
          const W = 300, H = 120;
          const padL = 42, padR = 10, padT = 10, padB = 24;
          const chartW = W - padL - padR, chartH = H - padT - padB;
          const xScale = (i: number) => padL + (i / (months.length - 1)) * chartW;
          const yScale = (v: number) => padT + chartH - ((v - yMin) / (yMax - yMin)) * chartH;
          const pPts = purchase.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
          const mPts = market.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
          return (
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", display: "block" }}>
              {yTicks.map(t => (
                <g key={t}>
                  <line x1={padL} y1={yScale(t)} x2={W - padR} y2={yScale(t)} stroke={C.divider} strokeWidth="0.5" />
                  <text x={padL - 3} y={yScale(t) + 3} textAnchor="end" fontSize={9} fill={C.t3}>{t}</text>
                </g>
              ))}
              {months.map((m, i) => (
                <text key={m} x={xScale(i)} y={H - padB + 10} textAnchor="middle" fontSize={9} fill={C.t3}>{m}</text>
              ))}
              <polyline points={mPts} fill="none" stroke={C.phDark} strokeWidth="1.5" />
              {market.map((v, i) => <circle key={i} cx={xScale(i)} cy={yScale(v)} r="2" fill={C.phDark} />)}
              <polyline points={pPts} fill="none" stroke={C.brand} strokeWidth="1.5" />
              {purchase.map((v, i) => <circle key={i} cx={xScale(i)} cy={yScale(v)} r="2" fill={C.brand} />)}
              <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={C.border} strokeWidth="1" />
              <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={C.border} strokeWidth="1" />
            </svg>
          );
        })()}
      </Card>

      <Card title="锁价项目执行概况">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <DonutBox label="环形：执行完毕47% / 履约中53%" center={"191\n总项目"} />
          <div style={{ flex: 1, fontSize: 10, color: C.t3, lineHeight: "18px" }}>
            <div><b style={{ color: C.t1 }}>执行完毕</b> 47%（90）</div>
            <div><b style={{ color: C.t1 }}>锁价履约中</b> 101</div>
            <div style={{ marginTop: 6 }}>锁价项目总数量 53个，钢板锁价总数量 82.58万吨，待交付钢板数量 80万吨</div>
          </div>
        </div>
      </Card>

      <Card title="各企业锁价项目分布" extra="下钻企业分布" onExtra={() => nav("purchase-steel-dist")}>
        {[
          { n: "舟山重工", v: 52 },
          { n: "大连重工", v: 44 },
          { n: "扬州重工", v: 38 },
          { n: "南通/启东", v: 29 },
          { n: "上海重工", v: 14 },
          { n: "广东重工", v: 14 },
        ].map((it) => (
          <div key={it.n} onClick={() => nav("purchase-steel-dist")} style={{ cursor: "pointer" }}>
            <BarRow label={it.n} value={it.v} maxVal={52} />
          </div>
        ))}
      </Card>

      <Card title="锁价成本与预算对比（钢材成本管控）">
        <Grid3 items={[
          { label: "预算金额", value: "42", unit: "亿" },
          { label: "已锁价", value: "31", unit: "亿" },
          { label: "锁价率", value: "74", unit: "%" },
        ]} />
        <div style={{ marginTop: 4, fontSize: 10, color: C.t3 }}>较预算差额 -1.2（亿）</div>
        <GroupedBarChart
          data={[
            { label: "扬州重工", primary: 7.6, secondary: 8.2 },
            { label: "大连重工", primary: 10.8, secondary: 11.5 },
            { label: "舟山重工", primary: 7.2, secondary: 7.8 },
            { label: "上海重工", primary: 3.9, secondary: 4.1 },
            { label: "广东重工", primary: 2.3, secondary: 2.6 },
          ]}
          primaryLabel="锁价成本"
          secondaryLabel="预算成本"
          unit="亿元"
          secondaryColor="#9FCEFF"
          valueSuffix="亿"
          goodWhen="lte"
        />
      </Card>

      <Footer text="钢材锁价 · 价格/成本客观陈列 · 数据来源我的钢铁网" />
    </>
  );
}

function PagePurchaseSteelDist() {
  const [selectedCompany, setSelectedCompany] = useState(0);
  const supplierColors = ["#00508E", "#79BBFF", "#67C23A", "#E6A23C"];
  const supplierNames = ["南钢", "湘钢", "上海建发", "物产中大（含鞍钢）"];
  const detailCompanies = ["扬州重工","启东海工","大连重工","舟山重工","广东海工"];
  const detailValues = [[22,15,8,5],[18,12,6,4],[30,25,14,10],[20,40,18,12],[12,10,5,3]];
  return (
    <>
      <StatusBar />
      <NavBar title="采购主题（钢材锁价）" backLabel="返回钢材采购" backPage="purchase-group-steel" />
      <BreadcrumbBar crumbs={["首页", "采购主题", "钢材锁价", "各企业锁价项目分布"]} />

      <Card title="各企业锁价项目供应商分布" className="mt-3">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
          {supplierNames.map((l, i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 8, height: 8, background: supplierColors[i], borderRadius: 2 }} />
              <span style={{ fontSize: 9, color: C.t3 }}>{l}</span>
            </div>
          ))}
        </div>
        {/* Stacked bar chart: supplier distribution by company */}
        {(() => {
          const companies = ["扬州重工","启东海工","大连重工","舟山重工","广东海工"];
          const shortNames = ["扬州","启东","大连","舟山","广东"];
          const nangangData =  [22, 18, 30, 20, 12];
          const xiangData   =  [15, 12, 25, 40, 10];
          const jianfaData  =  [ 8,  6, 14, 18,  5];
          const wuchanData  =  [ 5,  4, 10, 12,  3];
          const yTicks = [0, 25, 50, 75, 100];
          const yMax = 100;
          const W = 300, H = 150;
          const padL = 28, padR = 10, padT = 10, padB = 22;
          const chartW = W - padL - padR, chartH = H - padT - padB;
          const groupW = chartW / companies.length;
          const barW = groupW * 0.55;
          const yScale = (v: number) => padT + chartH - (v / yMax) * chartH;
          const colors = supplierColors;
          return (
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", display: "block" }}>
              {yTicks.map(t => (
                <g key={t}>
                  <line x1={padL} y1={yScale(t)} x2={W - padR} y2={yScale(t)} stroke={C.divider} strokeWidth="0.5" />
                  <text x={padL - 3} y={yScale(t) + 3} textAnchor="end" fontSize={9} fill={C.t3}>{t}</text>
                </g>
              ))}
              {companies.map((_, ci) => {
                const gx = padL + ci * groupW + (groupW - barW) / 2;
                const segs = [nangangData[ci], xiangData[ci], jianfaData[ci], wuchanData[ci]];
                let cumulative = 0;
                return (
                  <g key={ci} role="button" tabIndex={0} aria-label={`查看${companies[ci]}供应商明细`} onClick={() => setSelectedCompany(ci)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedCompany(ci); }} style={{ cursor: "pointer" }}>
                    {selectedCompany === ci && <rect x={gx - 6} y={padT} width={barW + 12} height={chartH} rx="8" fill="#ECF5FF" opacity=".75" />}
                    {segs.map((val, si) => {
                      const segH = (val / yMax) * chartH;
                      const segY = yScale(cumulative + val);
                      cumulative += val;
                      return <rect key={si} x={gx} y={segY} width={barW} height={segH} fill={colors[si]} />;
                    })}
                    <text x={gx + barW / 2} y={H - padB + 9} textAnchor="middle" fontSize={9} fill={C.t2}>{shortNames[ci]}</text>
                  </g>
                );
              })}
              <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={C.border} strokeWidth="1" />
              <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={C.border} strokeWidth="1" />
            </svg>
          );
        })()}
        <div className="steel-selected-detail" aria-live="polite">
          <strong>{detailCompanies[selectedCompany]}</strong>
          <span>合计 {detailValues[selectedCompany].reduce((sum, value) => sum + value, 0)} 个</span>
          <div>{supplierNames.map((name, index) => <span key={name}><i style={{ background: supplierColors[index] }} />{name} {detailValues[selectedCompany][index]} 个</span>)}</div>
        </div>
      </Card>

      <Footer text="各企业锁价项目按供应商结构分布" />
    </>
  );
}

function PagePurchaseSteelDelivery() {
  const companies = ["扬州重工", "启东海工", "大连重工", "舟山重工", "广东海工"];
  const suppliers = [
    { name: "南钢", color: "#00508E", values: [62, 54, 24, 42, 32] },
    { name: "湘钢", color: "#79BBFF", values: [58, 52, 32, 54, 72] },
    { name: "鞍钢", color: "#67C23A", values: [42, 38, 48, 46, 50] },
    { name: "上海建发", color: "#E6A23C", values: [20, 16, 22, 28, 24] },
    { name: "物产中大", color: "#F56C6C", values: [10, 12, 14, 18, 22] },
  ];
  const totals = companies.map((_, index) => suppliers.reduce((sum, supplier) => sum + supplier.values[index], 0));
  const W=520,H=220,pL=34,pR=10,pT=28,pB=42,max=260,plotH=H-pT-pB,groupW=(W-pL-pR)/companies.length,barW=28;
  const y=(value:number)=>pT+plotH-value/max*plotH;
  return <><StatusBar/><NavBar title="锁价交付明细" backLabel="返回钢材采购" backPage="purchase-group-steel"/><Card title="各企业交付钢板供应商分布" className="mt-2 app-production-card">
    <div className="steel-detail-legend">{suppliers.map(item=><span key={item.name}><i style={{background:item.color}}/>{item.name}</span>)}</div>
    <div className="steel-detail-chart-scroll"><svg viewBox={`0 0 ${W} ${H}`} style={{width:W,height:H}}><text x={pL} y="11" fontSize="9" fill={C.t3}>单位：万吨</text>{[0,50,100,150,200,250].map(t=><g key={t}><line x1={pL} y1={y(t)} x2={W-pR} y2={y(t)} stroke={C.divider}/><text x={pL-5} y={y(t)+3} textAnchor="end" fontSize="9" fill={C.t3}>{t}</text></g>)}{companies.map((company,index)=>{const x=pL+index*groupW+(groupW-barW)/2; let cumulative=0; return <g key={company}>{suppliers.map(supplier=>{const value=supplier.values[index], top=y(cumulative+value),height=value/max*plotH; cumulative+=value; return <rect key={supplier.name} x={x} y={top} width={barW} height={height} fill={supplier.color}/>})}<text x={x+barW/2} y={y(totals[index])-6} textAnchor="middle" fontSize="9" fontWeight="700" fill={C.t1}>{totals[index]}</text><text x={x+barW/2} y={H-17} textAnchor="middle" fontSize="10" fill={C.t2}>{company}</text></g>})}<line x1={pL} y1={pT+plotH} x2={W-pR} y2={pT+plotH} stroke={C.border}/></svg></div>
  </Card><Footer text="钢板交付供应商结构 · 点击企业查看供应商明细"/></>;
}

function PagePurchaseSteelCost() {
  return <><StatusBar/><NavBar title="锁价成本与预算" backLabel="返回钢材采购" backPage="purchase-group-steel"/><Card title="各企业钢板锁价成本差额" className="mt-2 app-production-card"><GroupedBarChart data={[
    {label:"扬州重工",primary:46.2,secondary:52.8},{label:"启东海工",primary:45.7,secondary:51.4},{label:"大连重工",primary:38.9,secondary:43.6},{label:"舟山重工",primary:46.5,secondary:52.1},{label:"广东海工",primary:46.1,secondary:51.6},
  ]} primaryLabel="锁价成本" secondaryLabel="预算成本" unit="亿元" secondaryColor="#9FCEFF" valueSuffix="亿" goodWhen="lte"/></Card><Footer text="钢板锁价成本与预算对比 · 成本低于预算为达标"/></>;
}

function SteelMetricIcon({ type }: { type: "project" | "steel" | "delivered" | "pending" }) {
  const content = {
    project: <><rect x="9" y="7" width="18" height="22" rx="4" fill="url(#steelIconA)"/><path d="M14 7V5h8v2" stroke="#E6A23C" strokeWidth="2.5" strokeLinecap="round"/><path d="M14 14h8M14 19h8M14 24h5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="25" cy="25" r="2" fill="#E6A23C"/></>,
    steel: <><path d="M7 12 18 6l11 6-11 6L7 12Z" fill="url(#steelIconA)"/><path d="M7 12 12 9.3l5 2.7-5 2.7L7 12Z" fill="#67C23A" opacity=".9"/><path d="m7 18 11 6 11-6M7 23l11 6 11-6" stroke="#00508E" strokeWidth="2.2" strokeLinejoin="round"/></>,
    delivered: <><path d="M5 10h17v14H5z" fill="url(#steelIconA)"/><path d="M22 15h5l4 5v4h-9V15Z" fill="#4C80B4"/><path d="M23 16h3.5l2.5 3h-6V16Z" fill="#9FCEFF" opacity=".72"/><circle cx="11" cy="27" r="3" fill="#003A70"/><circle cx="26" cy="27" r="3" fill="#003A70"/><circle cx="15" cy="17" r="5" fill="#67C23A"/><path d="m12.5 17 1.7 1.8 3.3-3.7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/></>,
    pending: <><path d="M7 11 18 6l11 5-11 5L7 11Zm0 6 11 5 11-5-11-5-11 5Z" fill="url(#steelIconA)"/><circle cx="27" cy="26" r="6" fill="#FFF7E8" stroke="#E6A23C" strokeWidth="2"/><path d="M27 23v3l2 1" stroke="#B88230" strokeWidth="1.7" strokeLinecap="round"/></>,
  }[type];
  return <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><defs><linearGradient id="steelIconA" x1="7" y1="6" x2="29" y2="29"><stop stopColor="#4C80B4"/><stop offset=".48" stopColor="#0B69C7"/><stop offset="1" stopColor="#00508E"/></linearGradient></defs>{content}<ellipse cx="18" cy="32" rx="11" ry="2" fill="#003A70" opacity=".16"/></svg>;
}

function PurchaseSteelPanel() {
  const [steelStartMonth, setSteelStartMonth] = useState(3);
  const [steelEndMonth, setSteelEndMonth] = useState(6);
  const [distributionMetric, setDistributionMetric] = useState<"count" | "tonnage">("count");
  const steelMonthOptions = [3, 4, 5, 6];
  const overview = [
    { label: "项目总数量", value: "53", unit: "个", icon: "project" as const },
    { label: "钢板总数量", value: "82.58", unit: "万吨", icon: "steel" as const },
    { label: "累计实际交付", value: "0", unit: "万吨", icon: "delivered" as const },
    { label: "累计待交付钢板", value: "82.58", unit: "万吨", icon: "pending" as const },
  ];
  return <div className="purchase-business-panel">
    <div className="steel-overview-surface">
      <div className="steel-month-range" role="group" aria-label="钢材采购统计时间范围">
        <span className="steel-month-range-label"><CalendarClock size={14} strokeWidth={1.9} />统计时间</span>
        <div className="steel-month-range-fields">
          <select
            aria-label="钢材采购起始月份"
            value={steelStartMonth}
            onChange={(event) => {
              const month = Number(event.target.value);
              setSteelStartMonth(month);
              if (month > steelEndMonth) setSteelEndMonth(month);
            }}
          >
            {steelMonthOptions.map((month) => <option key={month} value={month} disabled={month > steelEndMonth}>2026年{month}月</option>)}
          </select>
          <span>—</span>
          <select
            aria-label="钢材采购结束月份"
            value={steelEndMonth}
            onChange={(event) => {
              const month = Number(event.target.value);
              setSteelEndMonth(month);
              if (month < steelStartMonth) setSteelStartMonth(month);
            }}
          >
            {steelMonthOptions.map((month) => <option key={month} value={month} disabled={month < steelStartMonth}>2026年{month}月</option>)}
          </select>
        </div>
      </div>
      <div className="steel-overview-grid">
        {overview.map((item) => <div key={item.label}><SteelMetricIcon type={item.icon}/><div><span>{item.label}</span><strong>{item.value}<small>{item.unit}</small></strong></div></div>)}
      </div>
      <div className="steel-overview-summary"><span>本月交付进度</span><strong>应交付钢板数量 <b>15万吨</b>，实际交付 <b>10.25万吨</b></strong></div>
    </div>

    <Card title="近6个月船用钢板价格趋势" className="app-production-card steel-price-card">
      <div className="steel-price-summary">本月船用钢板基价 <b>3804元/吨</b>（不含税 <b>3366元/吨</b>），较上期上涨 <em>10元/吨</em>，涨幅 <em>0.26%</em>。<small>数据来源：我的钢铁网</small></div>
      {(() => { const months=["1月","2月","3月","4月","5月","6月"], locked=[3480,3510,3540,3560,3590,3804], market=[3420,3450,3480,3520,3560,3720]; const W=360,H=166,pL=38,pR=10,pT=26,pB=28,min=3380,max=3850; const x=(i:number)=>pL+i*(W-pL-pR)/(months.length-1), y=(v:number)=>pT+(max-v)/(max-min)*(H-pT-pB); return <><div className="steel-price-legend"><span><i/>锁价基价</span><span><i/>市场基价</span></div><svg className="steel-price-chart" viewBox={`0 0 ${W} ${H}`}>{[3400,3500,3600,3700,3800].map(t=><g key={t}><line x1={pL} y1={y(t)} x2={W-pR} y2={y(t)} stroke={C.divider}/><text x={pL-5} y={y(t)+3} textAnchor="end" fontSize="9" fill={C.t3}>{t}</text></g>)}<polyline points={market.map((v,i)=>`${x(i)},${y(v)}`).join(" ")} fill="none" stroke={C.success} strokeWidth="2"/><polyline points={locked.map((v,i)=>`${x(i)},${y(v)}`).join(" ")} fill="none" stroke={C.brand} strokeWidth="2.5"/>{months.map((m,i)=><g key={m}><circle cx={x(i)} cy={y(locked[i])} r={i===5?4:2.5} fill={C.brand}/><circle cx={x(i)} cy={y(market[i])} r="2.5" fill={C.success}/><text className="app-chart-value-label is-primary" x={x(i)} y={y(locked[i])-7} textAnchor="middle">{locked[i]}</text><text className="app-chart-value-label is-secondary" x={x(i)} y={y(market[i])+12} textAnchor="middle">{market[i]}</text><text x={x(i)} y={H-8} textAnchor="middle" fontSize="9" fill={C.t2}>{m}</text></g>)}</svg></>; })()}
    </Card>

    <Card title="锁价执行与企业分布" className="app-production-card steel-execution-card">
      <div className="steel-execution-head"><div><span>已完成锁价项目</span><strong>53<small>个</small></strong></div><b>执行完成</b></div>
      <Progress value={100} />
      <div className="steel-execution-meta"><span>锁价钢板数量 <b>82.58万吨</b></span><span>项目执行率 <b>100%</b></span></div>
      <div className="steel-execution-divider" />
        <div className="steel-company-subhead"><strong>各企业锁价项目分布</strong><button type="button" className="app-drilldown-link" onClick={() => nav("purchase-steel-dist")}>企业明细 <ChevronRight size={13}/></button><div className="purchase-structure-switch app-unified-segmented"><button type="button" className={distributionMetric === "count" ? "is-active" : ""} onClick={() => setDistributionMetric("count")}>项目数</button><button type="button" className={distributionMetric === "tonnage" ? "is-active" : ""} onClick={() => setDistributionMetric("tonnage")}>吨数</button></div></div>
      <div className="steel-company-list">{[{n:"舟山重工",count:52,tonnage:18.8},{n:"大连重工",count:44,tonnage:16.2},{n:"扬州重工",count:38,tonnage:14.5},{n:"南通/启东",count:29,tonnage:12.6},{n:"上海重工",count:14,tonnage:10.4},{n:"广东重工",count:14,tonnage:10.08}].map((item,index)=>{const value=distributionMetric === "count" ? item.count : item.tonnage; const max=distributionMetric === "count" ? 52 : 18.8; const unit=distributionMetric === "count" ? "个" : "万吨"; return <div key={item.n}><span>{String(index+1).padStart(2,"0")}</span><strong>{item.n}</strong><HorizontalBar value={value/max*100} label={`${item.n} ${distributionMetric === "count" ? value : value.toFixed(2)}${unit}`}/><b>{distributionMetric === "count" ? value : value.toFixed(2)}<small>{unit}</small></b></div>})}</div>
    </Card>

    <Card title="锁价交付" extra="各企业明细" onExtra={() => nav("purchase-steel-delivery")} className="app-production-card steel-delivery-card">
      <div className="steel-delivery-toolbar"><span>单位：万吨</span></div>
      <div className="steel-cost-overview steel-delivery-overview"><div className="budget"><span>应交付数量</span><strong>15<small>万吨</small></strong></div><div className="locked"><span>实绩交付数量</span><strong>10.25<small>万吨</small></strong></div><div className="pending"><span>待交付数量</span><strong>4.75<small>万吨</small></strong></div></div><div className="steel-delivery-progress-head"><span>交付比例</span><b>68.3%</b></div><Progress value={68.3} className="steel-delivery-progress" />
    </Card>

    <Card title="锁价成本与预算" extra="各企业明细" onExtra={() => nav("purchase-steel-cost")} className="app-production-card steel-cost-card">
      <div className="steel-cost-toolbar"><span>单位：亿元</span></div>
      <div className="steel-cost-overview">{[
        { label:"预算成本", value:"3.18", tone:"budget" },
        { label:"锁价成本", value:"2.60", tone:"locked" },
        { label:"节约金额", value:"0.58", tone:"saving" },
      ].map(item=><div key={item.label} className={item.tone}><span>{item.label}</span><strong>{item.value}<small>亿</small></strong></div>)}</div>
      <div className="steel-cost-bars">
        {[
          { label: "预算成本", value: 3.18, max: 3.5, tone: "budget" },
          { label: "锁价成本", value: 2.60, max: 3.5, tone: "locked" },
        ].map(item => <div key={item.label}><div><span>{item.label}</span><b>{item.value.toFixed(2)}亿</b></div><i><em className={item.tone} style={{ width: `${item.value / item.max * 100}%` }} /></i></div>)}
      </div>
    </Card>
  </div>;
}

function PurchaseSupplierPanel() {
  const months = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  const trend = [140,145,151,148,154,150,149,148,146,152,147,168];
  const enterprises = [
    { name: "扬州重工", actual: 162, target: 125 }, { name: "南通船务", actual: 118, target: 82 },
    { name: "启东海工", actual: 140, target: 98 }, { name: "大连重工", actual: 162, target: 125 },
    { name: "舟山重工", actual: 204, target: 196 }, { name: "上海重工", actual: 162, target: 125 },
    { name: "广东重工", actual: 134, target: 110 },
  ];
  const W = 480, H = 150, padL = 28, padR = 12, padT = 18, padB = 28;
  const x = (i:number) => padL + i * ((W-padL-padR)/(months.length-1));
  const y = (v:number) => padT + (180-v)/60*(H-padT-padB);
  const pts = trend.map((v,i)=>`${x(i)},${y(v)}`).join(" ");
  return <div className="purchase-business-panel supplier-panel">
    <div className="supplier-overview-card"><div><span>船用物资合格供应商</span><strong>200<small>个</small></strong></div><div><span>同比</span><b className="is-up">+12</b></div><div><span>环比</span><b className="is-down">-2</b></div></div>
    <Card title="近12个月合格供应商趋势" className="app-production-card supplier-trend-card">
      <div className="supplier-chart-scroll"><svg viewBox={`0 0 ${W} ${H}`}>
        {[120,140,160,180].map(t=><g key={t}><line x1={padL} y1={y(t)} x2={W-padR} y2={y(t)} stroke={C.divider}/><text x={padL-5} y={y(t)+3} textAnchor="end" fontSize="9" fill={C.t3}>{t}</text></g>)}
        <polyline points={pts} fill="none" stroke={C.brand} strokeWidth="2.5" strokeLinejoin="round" />
        {trend.map((v,i)=><g key={months[i]}><circle cx={x(i)} cy={y(v)} r={i===11?4:2.5} fill={C.brand}/><text x={x(i)} y={H-8} textAnchor="middle" fontSize="9" fill={C.t2}>{months[i]}</text></g>)}
      </svg></div>
    </Card>
    <Card title="企业供应商数量对标" className="app-production-card supplier-benchmark-card">
      <GroupedBarChart
        data={enterprises.map((item) => ({ label: item.name, primary: item.actual, secondary: item.target }))}
        primaryLabel="实际值"
        secondaryLabel="指标值"
        unit="个"
        secondaryColor="#67C23A"
        valueSuffix="个"
      />
    </Card>
  </div>;
}

function PagePurchaseGroup({ initialSection = "management" }: { initialSection?: PurchaseMode } = {}) {
  const [structureView, setStructureView] = useState<"amount" | "share">("amount");
  const [activeSection, setActiveSection] = useState<PurchaseMode>(initialSection);
  const [structurePeriod, setStructurePeriod] = useState<"month" | "year">("year");
  const [rankingPeriod, setRankingPeriod] = useState<"month" | "year">("year");

  const BLUE  = C.brand;
  const GREEN = C.success;

  const units = [
    { name: "扬州重工",        week: 0.98,  total: 13.80 },
    { name: "南通船务/启东海工", week: 0.71,  total: 9.89  },
    { name: "大连重工",        week: 12.10, total: 14.65 },
    { name: "舟山重工",        week: 4.96,  total: 17.98 },
    { name: "上海重工",        week: 0.10,  total: 2.24  },
    { name: "广东重工",        week: 0.29,  total: 6.88  },
  ];
  const rankedUnits = [...units].sort((a, b) => rankingPeriod === "year" ? b.total - a.total : b.week - a.week);
  const maxTotal = Math.max(...rankedUnits.map(u => rankingPeriod === "year" ? u.total : u.week));

  // 采购金额结构 横向进度条数据
  const structBars = structurePeriod === "year" ? [
    { label: "总采购金额", val: 128, color: BLUE  },
    { label: "大宗集采",   val: 73,  color: "var(--app-primary-500)" },
    { label: "设备集采",   val: 31,  color: GREEN },
  ] : [
    { label: "总采购金额", val: 19.14, color: BLUE  },
    { label: "大宗集采",   val: 12.08, color: "var(--app-primary-500)" },
    { label: "设备集采",   val: 6.06,  color: GREEN },
  ];
  const barMax = structurePeriod === "year" ? 128 : 19.14;

  // 集采构成环形饼图（SVG）
  const pieData = [
    { label: "大宗物资", pct: 56.8, color: BLUE   },
    { label: "设备",     pct: 24.6, color: GREEN  },
    { label: "未集采",   pct: 18.6, color: C.ph   },
  ];
  const cx = 44, cy = 44, r = 32, stroke = 10;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const piePaths = pieData.map(d => {
    const dash = (d.pct / 100) * circ;
    const path = { offset, dash, color: d.color };
    offset += dash;
    return path;
  });

  return (
    <>
      <StatusBar />
      <NavBar title="采购主题" backLabel="返回首页" backPage="home" dateBadge="2026年8月" />
      <div className="repair-mode-shell purchase-mode-shell">
        <PurchaseModeTabs value={activeSection} onValueChange={setActiveSection} />
      </div>

      {activeSection === "management" ? <>
      <Card className="app-production-card purchase-overview-card purchase-mode-first-card attached-overview-card">
        <button type="button" className="attached-overview-heading" onClick={() => nav("purchase-group-rate")}>
          <strong>采购总览</strong>
          <span>集采率明细 <ChevronRight aria-hidden="true" /></span>
        </button>
        <div className="purchase-overview-kpis">
          {[
            { label: "总采购金额（船用物资）", value: "128", unit: "亿", subLabel: "本月新增", subValue: "19.14亿元" },
            { label: "集采金额", value: "104", unit: "亿", subLabel: "本月新增", subValue: "18.14亿元" },
            { label: "集采率", value: "81.3", unit: "%", subLabel: "较上月", subValue: "+1%" },
          ].map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}<small>{item.unit}</small></strong><em>{item.subLabel} <b>{item.subValue}</b></em></div>)}
        </div>
        <div className="purchase-data-source">采购数据来源为EP系统，价格不含税</div>
      </Card>

      <Card title="采购金额构成" className="app-production-card purchase-structure-card" extra={<div className="purchase-structure-switch purchase-title-switch" role="group" aria-label="采购结构视图"><button type="button" className={structureView === "amount" ? "is-active" : ""} onClick={() => setStructureView("amount")}>金额</button><button type="button" className={structureView === "share" ? "is-active" : ""} onClick={() => setStructureView("share")}>占比</button></div>}>
        <div className="purchase-structure-toolbar">
          <span>单位：亿元</span>
          <div className="purchase-period-switch app-unified-segmented" role="group" aria-label="采购金额统计周期">
            <button type="button" className={structurePeriod === "month" ? "is-active" : ""} onClick={() => setStructurePeriod("month")}>本月</button>
            <button type="button" className={structurePeriod === "year" ? "is-active" : ""} onClick={() => setStructurePeriod("year")}>本年</button>
          </div>
        </div>
        {structureView === "amount" ? (
          <div className="purchase-structure-bars">{structBars.map((item) => <div key={item.label}><div><span>{item.label}</span><strong>{item.val.toFixed(2)}<small>亿</small></strong></div><Progress className="purchase-structure-progress" value={(item.val / barMax) * 100} style={{ "--indicator-color": item.color } as React.CSSProperties} /></div>)}</div>
        ) : (
          <div className="purchase-share-view">
            <svg width={104} height={104} viewBox="0 0 88 88">
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.bg} strokeWidth={stroke} />
              {piePaths.map((path, index) => <circle key={index} cx={cx} cy={cy} r={r} fill="none" stroke={path.color} strokeWidth={stroke} strokeDasharray={`${path.dash} ${circ - path.dash}`} strokeDashoffset={-path.offset + circ / 4} style={{ transform: "rotate(-90deg)", transformOrigin: `${cx}px ${cy}px` }} />)}
              <text x={cx} y={cy - 3} textAnchor="middle" fontSize="12" fontWeight="800" fill={C.brand}>81.3%</text><text x={cx} y={cy + 10} textAnchor="middle" fontSize="8" fill={C.t3}>集采率</text>
            </svg>
            <div>{pieData.map((item) => <span key={item.label}><i style={{ background: item.color }} />{item.label}<b>{item.pct}%</b></span>)}</div>
          </div>
        )}
      </Card>

      <Card title="企业采购排名" extra="共6家" className="app-production-card repair-ranking-card purchase-ranking-card">
        <div className="purchase-ranking-toolbar"><span>单位：亿元</span><div className="purchase-period-switch purchase-ranking-period app-unified-segmented" role="group" aria-label="企业采购排名周期">
          <button type="button" className={rankingPeriod === "month" ? "is-active" : ""} onClick={() => setRankingPeriod("month")}>本月</button>
          <button type="button" className={rankingPeriod === "year" ? "is-active" : ""} onClick={() => setRankingPeriod("year")}>本年</button>
        </div></div>
        <div className="purchase-ranking-list">
          {rankedUnits.map((unit, index) => { const value = rankingPeriod === "year" ? unit.total : unit.week; return <div className="purchase-ranking-row" key={unit.name}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{unit.name}</strong>{rankingPeriod === "year" && <small>本月 {unit.week.toFixed(2)}亿</small>}</div><HorizontalBar value={(value / maxTotal) * 100} label={`${unit.name} ${value.toFixed(2)}亿`} /><b>{value.toFixed(2)}<small>亿</small></b></div>; })}
        </div>
      </Card>
      </> : activeSection === "steel" ? <PurchaseSteelPanel /> : <PurchaseSupplierPanel />}

      <div style={{ height: 20 }} />
    </>
  );
}

function PagePurchaseGroupRate() {
  return (
    <>
      <StatusBar />
      <NavBar title="采购主题（集采）" backLabel="返回集采主题" backPage="purchase-group" />
      <BreadcrumbBar crumbs={["首页", "采购主题", "集采", "集采率"]} />

      <Card title="集采率对标管理" className="mt-3">
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 8 }}>
          {["实际集采率", "平均集采率"].map((l, i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              {i === 0 ? (
                <div style={{ width: 8, height: 8, borderRadius: 2, background: C.brand }} />
              ) : (
                <div style={{ width: 14, borderTop: `1.5px dashed ${C.brand}` }} />
              )}
              <span style={{ fontSize: 10, color: C.t2, fontWeight: 550 }}>{l}</span>
            </div>
          ))}
        </div>
        {/* Bar chart + reference line: group procurement rate */}
        {(() => {
          const companies = ["扬州重工","南通船务","启东海工","大连重工","舟山重工","上海重工","广东重工"];
          const shortNames = ["扬州重工","南通船务","启东海工","大连重工","舟山重工","上海重工","广东重工"];
          const rates = [88.2, 54.1, 76.3, 82.5, 79.8, 68.4, 71.6];
          const avg = 74.4;
          const yTicks = [0, 25, 50, 75, 100];
          const yMax = 100;
          const W = 360, H = 168;
          const padL = 28, padR = 10, padT = 16, padB = 34;
          const chartW = W - padL - padR, chartH = H - padT - padB;
          const groupW = chartW / companies.length;
          const barW = groupW * 0.55;
          const yScale = (v: number) => padT + chartH - (v / yMax) * chartH;
          const avgY = yScale(avg);
          return (
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", display: "block" }}>
              {yTicks.map(t => (
                <g key={t}>
                  <line x1={padL} y1={yScale(t)} x2={W - padR} y2={yScale(t)} stroke={C.divider} strokeWidth="0.5" />
                  <text x={padL - 3} y={yScale(t) + 3} textAnchor="end" fontSize={9} fill={C.t3}>{t}</text>
                </g>
              ))}
              {companies.map((_, ci) => {
                const gx = padL + ci * groupW + (groupW - barW) / 2;
                const barH = (rates[ci] / yMax) * chartH;
                return (
                  <g key={ci}>
                    <rect
                      x={gx}
                      y={yScale(rates[ci])}
                      width={barW}
                      height={barH}
                      rx={barW / 2}
                      fill={rates[ci] < avg ? C.warning : C.brand}
                      opacity={0.92}
                    />
                    <text
                      x={gx + barW / 2}
                      y={yScale(rates[ci]) - 4}
                      textAnchor="middle"
                      fontSize={8.5}
                      fontWeight={650}
                      fill={C.brand}
                    >
                      {rates[ci]}%
                    </text>
                    <text
                      x={gx + barW / 2}
                      y={H - padB + 12}
                      textAnchor="middle"
                      fontSize={8.5}
                      fontWeight={550}
                      fill={C.t2}
                    >
                      <tspan x={gx + barW / 2}>{shortNames[ci].slice(0, 2)}</tspan>
                      <tspan x={gx + barW / 2} dy="10">{shortNames[ci].slice(2)}</tspan>
                    </text>
                  </g>
                );
              })}
              <line x1={padL} y1={avgY} x2={W - padR} y2={avgY} stroke={C.brand} strokeWidth="1.5" strokeDasharray="5,4" />
              <text x={W - padR - 2} y={avgY - 3} textAnchor="end" fontSize={9} fontWeight={600} fill={C.brand}>{avg}%</text>
              <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={C.border} strokeWidth="1" />
              <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={C.border} strokeWidth="1" />
            </svg>
          );
        })()}
      </Card>

      <Footer text="各企业集采率与平均集采率对标" />
    </>
  );
}

function PageQuality() {
  type QualityActivity = {
    level: string;
    company: string;
    title: string;
    summary: string;
  };
  type QualityActivityGroup = {
    key: "central" | "heavy" | "theme";
    label: string;
    detailTitle: string;
    columns: [string, string, string];
    overview: string;
    items: QualityActivity[];
  };
  const [activeMetric, setActiveMetric] = useState<"报验" | "RT">("RT");
  const [qualityView, setQualityView] = useState<"ranking" | "attention">("ranking");
  const [activeAwardGroup, setActiveAwardGroup] = useState<"central" | "heavy" | "theme">("central");
  const [awardYear, setAwardYear] = useState("2026");
  const [showAllQualityActivities, setShowAllQualityActivities] = useState(false);
  const [selectedQualityGroup, setSelectedQualityGroup] = useState<QualityActivityGroup["key"] | null>(null);
  const [qualitySheetContainer, setQualitySheetContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setQualitySheetContainer(document.querySelector<HTMLElement>(".app-phone-screen"));
  }, []);

  const baoyansData = [
    ["南通川崎", "造船", "98.8%", "99.8%", "99.7%"],
    ["大连川崎", "造船", "98.7%", "99.5%", "99.6%"],
    ["扬州重工", "造船", "98.7%", "99.7%", "99.6%"],
    ["南通船务", "海工", "97.0%", "97.1%", "97.1%"],
    ["启东海工", "造船", "97.0%", "97.9%", "97.6%"],
    ["启东海工", "海工", "97.0%", "97.0%", "97.9%"],
    ["大连重工", "造船", "99.6%", "98.5%", "99.6%"],
    ["大连重工", "海工", "98.5%", "99.6%", "99.7%"],
    ["舟山重工", "造船", "98.7%", "99.9%", "99.9%"],
    ["上海重工", "海工", "98.0%", "98.9%", "99.3%"],
    ["广东重工", "造船", "98.0%", "98.3%", "98.3%"],
    ["合计",     "—",   "97.5%", "99.0%", "99.2%"],
  ];
  const rtData = [
    ["南通川崎", "造船", "97.0%", "96.8%", "96.5%"],
    ["大连川崎", "造船", "97.0%", "96.5%", "96.9%"],
    ["扬州重工", "造船", "97.0%", "97.3%", "97.1%"],
    ["南通船务", "海工", "96.5%", "95.8%", "96.0%"],
    ["启东海工", "造船", "96.5%", "96.2%", "96.4%"],
    ["启东海工", "海工", "96.5%", "95.9%", "96.1%"],
    ["大连重工", "造船", "97.5%", "96.7%", "97.0%"],
    ["大连重工", "海工", "97.0%", "96.3%", "96.8%"],
    ["舟山重工", "造船", "97.0%", "97.1%", "97.2%"],
    ["上海重工", "海工", "96.5%", "96.0%", "96.2%"],
    ["广东重工", "造船", "96.5%", "95.7%", "95.9%"],
    ["合计",     "—",   "97.0%", "96.2%", "96.5%"],
  ];

  const tableData  = activeMetric === "报验" ? baoyansData : rtData;
  const qualityRows = tableData.filter(row => row[0] !== "合计").map(row => {
    const target = Number(row[2].replace("%", ""));
    const actual = Number(row[4].replace("%", ""));
    return { company: row[0], business: row[1], target, actual, delta: actual - target };
  });
  const visibleQualityRows = (qualityView === "attention"
    ? qualityRows.filter(row => row.delta < 0).sort((a, b) => a.delta - b.delta)
    : qualityRows.sort((a, b) => b.actual - a.actual)).slice(0, qualityView === "attention" ? 6 : qualityRows.length);
  const centralQcOverview = `${awardYear}年9月8日至11日，央企QC小组成果交流活动在广州举办。集团选送的2项模拟成果从多项参赛成果中脱颖而出，分别获得一等奖和二等奖。本次获奖集中体现了船舶绿色建造与精益质量改进成效，并形成可在相关企业推广的经验做法。`;
  const awardGroups: QualityActivityGroup[] = [
    { key: "central", label: "央企QC成果", detailTitle: "央企QC小组成果发表赛", columns: ["获奖等级", "获奖企业", "成果名称"], overview: centralQcOverview, items: [
      { level: "一等奖", company: "南通川崎", title: "甲醇双燃料船锅炉蒸发量提升方法", summary: "绿色船舶关键设备质量改进" },
      { level: "二等奖", company: "大连川崎", title: "LNG双燃料大型油船钢材重量优化", summary: "大型船舶轻量化质量改善" },
    ]},
    { key: "heavy", label: "重工QC评审", detailTitle: "重工QC成果评审", columns: ["获奖等级", "获奖企业", "成果名称"], overview: `${awardYear}年重工QC成果评审围绕建造质量、修船交付和检测流程改善开展，共形成3项模拟获奖成果。评审组重点关注成果的推广价值和现场应用成效，并形成跨企业共享的质量改进清单。`, items: [
      { level: "特等奖", company: "启东海工", title: "海工装备质量风险前置管控", summary: "建立重点工序预警机制" },
      { level: "一等奖", company: "南通船务", title: "修船关键节点质量提升", summary: "提升重点项目交付质量" },
      { level: "二等奖", company: "广东重工", title: "检测流程标准化改善", summary: "统一检验标准与闭环流程" },
    ]},
    { key: "theme", label: "质量月活动", detailTitle: "质量月活动开展情况", columns: ["活动时间", "组织单位", "活动名称"], overview: `${awardYear}年质量月围绕“强化质量意识、推进风险预防”开展3场模拟专题活动，覆盖QC方法培训、年度重点工作部署和质量风险交流。各项活动均形成任务清单和后续跟踪事项，推动质量要求落实到项目和班组。`, items: [
      { level: "03月11–12", company: "大连重工", title: "QC小组活动专题培训班", summary: "112人参与 · 培训完成" },
      { level: "03月10日", company: "上海环境+线上", title: "质量管理年度重点工作部署会", summary: "69人参与 · 形成任务清单" },
      { level: "03月13日", company: "质量管理部", title: "质量风险管控专题交流", summary: "10人参与 · 完成经验交流" },
    ]},
  ];
  const activeAwards = awardGroups.find(group => group.key === activeAwardGroup) ?? awardGroups[0];
  const selectedAwardGroup = awardGroups.find(group => group.key === selectedQualityGroup);

  return (
    <>
      <StatusBar />
      <NavBar title="质量主题" backLabel="返回首页" backPage="home" />
      <BreadcrumbBar crumbs={["首页", "质量主题"]} period="截至7.10" />

      <Card title="质量运营总览" className="mt-3 quality-overview-card">
        <div className="quality-overview-metrics">
          <div><span>报验一次合格率</span><strong>98.6%</strong><small>目标 ≥98%</small><b className="is-good"><ShieldCheck size={12}/>达标</b></div>
          <div><span>RT/PAUT一次合规率</span><strong>96.2%</strong><small>目标 ≥97%</small><b className="is-warning"><AlertTriangle size={12}/>待提升 0.8%</b></div>
        </div>
        <div className="quality-overview-alerts">
          <div className="quality-overview-alert-title"><AlertTriangle size={14}/><strong>重点提醒</strong><span>2项待关注</span></div>
          <div className="quality-overview-alert-items"><span><b>广东重工</b>95.9%</span><i/><span><b>南通船务</b>96.0%</span></div>
        </div>
      </Card>

      <Card title="企业质量表现" className="quality-performance-card" extra="下钻明细" onExtra={() => nav(activeMetric === "报验" ? "quality-inspection" : "quality-rt")}>
        <div className="quality-title-controls"><div className="quality-header-switch app-unified-segmented" role="group" aria-label="质量指标切换"><button type="button" className={activeMetric === "报验" ? "is-active" : ""} onClick={() => setActiveMetric("报验")}>报验一次</button><button type="button" className={activeMetric === "RT" ? "is-active" : ""} onClick={() => setActiveMetric("RT")}>RT/PAUT一次</button></div><div className="quality-view-switch app-unified-segmented" role="group" aria-label="质量排序切换"><button type="button" className={qualityView === "ranking" ? "is-active" : ""} onClick={() => setQualityView("ranking")}>年度排名</button><button type="button" className={qualityView === "attention" ? "is-active" : ""} onClick={() => setQualityView("attention")}>待提升</button></div></div>
        <div className="quality-performance-head"><span>企业 / 业务</span><span>年度累计</span><span>较目标</span></div>
        <div className="quality-performance-list">
          {visibleQualityRows.length ? visibleQualityRows.map((row, index) => {
            const tone = row.delta >= 0 ? "good" : row.delta > -0.5 ? "watch" : "risk";
            return <div key={`${activeMetric}-${row.company}-${row.business}`}><div className="quality-company-cell"><span className="quality-rank">{String(index + 1).padStart(2, "0")}</span><strong>{row.company}</strong><span className={`quality-business-tag is-${row.business}`}>{row.business}</span></div><b>{row.actual.toFixed(1)}%</b><div className="quality-row-status"><em className={`is-${tone}`}>{row.delta >= 0 ? "+" : ""}{row.delta.toFixed(1)}% {tone === "good" ? "达标" : tone === "watch" ? "关注" : "待提升"}</em></div></div>;
          }) : <div className="quality-empty-state"><ShieldCheck size={18}/><span>当前指标暂无待提升企业</span></div>}
        </div>
      </Card>

      <Card title="质量活动分享" className="quality-awards-card" extra={<select className="quality-awards-year" aria-label="质量活动年份" value={awardYear} onChange={event => { setAwardYear(event.target.value); setShowAllQualityActivities(false); }}><option value="2026">2026年</option><option value="2025">2025年</option><option value="2024">2024年</option></select>}>
        <div className="quality-awards-tabs" role="tablist" aria-label="质量获奖类别">
          {awardGroups.map(group => <button key={group.key} type="button" role="tab" aria-selected={activeAwardGroup === group.key} className={activeAwardGroup === group.key ? "is-active" : ""} onClick={() => { setActiveAwardGroup(group.key); setShowAllQualityActivities(false); }}>{group.label}</button>)}
        </div>
        <div className="quality-awards-list">
          {activeAwards.items.slice(0, showAllQualityActivities ? activeAwards.items.length : 2).map((item, index) => <button type="button" className="quality-award-item" key={`${activeAwards.key}-${item.level}-${item.company}`} onClick={() => setSelectedQualityGroup(activeAwards.key)} aria-label={`查看${activeAwards.label}详情`}>
            <span className={`quality-award-rank is-${index + 1}`}>{item.level}</span>
            <div className="quality-award-copy"><strong>{item.title}</strong><span>{item.company} · {item.summary}</span></div>
            <ChevronRight size={14} strokeWidth={2.2} aria-hidden="true" />
          </button>)}
        </div>
        {activeAwards.items.length > 2 && <button type="button" className="quality-awards-more" onClick={() => setShowAllQualityActivities(value => !value)}>{showAllQualityActivities ? "收起" : "查看更多"}<ChevronRight size={13}/></button>}
      </Card>

      <Sheet open={selectedAwardGroup !== undefined} onOpenChange={(open) => { if (!open) setSelectedQualityGroup(null); }}>
        <SheetContent side="bottom" className="quality-activity-sheet" container={qualitySheetContainer}>
          {selectedAwardGroup && <>
            <SheetHeader className="quality-activity-sheet-head quality-qc-group-head">
              <div className="quality-activity-sheet-kicker"><ClipboardList size={15} aria-hidden="true" /><span>成果下钻详情</span></div>
              <SheetTitle>{selectedAwardGroup.detailTitle}</SheetTitle>
              <SheetDescription>{awardYear}年 · 共{selectedAwardGroup.items.length}项记录</SheetDescription>
            </SheetHeader>
            <div className="quality-activity-sheet-body quality-qc-group-body">
              <section className="quality-qc-award-table" aria-label={`${selectedAwardGroup.label}记录`}>
                <div className="quality-qc-award-head">{selectedAwardGroup.columns.map(column => <span key={column}>{column}</span>)}</div>
                {selectedAwardGroup.items.map((item, index) => <div className="quality-qc-award-row" key={`${item.level}-${item.company}`}>
                  <span className={`quality-award-rank is-${index + 1}`}>{item.level}</span>
                  <strong>{item.company}</strong>
                  <p>{item.title}</p>
                </div>)}
              </section>
              <section className="quality-activity-overview quality-qc-shared-overview">
                <h3><ClipboardList size={16} aria-hidden="true" />情况简述</h3>
                <p>{selectedAwardGroup.overview}</p>
              </section>
            </div>
          </>}
        </SheetContent>
      </Sheet>

      <Footer text="质量主题 · 一次合格率含造船/修船/海工分类口径" />
    </>
  );
}

function PageQualityRT() {
  type QualityBusiness = "全部" | "造船" | "修船" | "海工";
  const [business, setBusiness] = useState<QualityBusiness>("全部");
  const rows = [
    ["南通川崎", "造船", "96.7%", "97.2%", "97.9%"], ["大连川崎", "造船", "95.8%", "97.0%", "97.9%"],
    ["扬州重工", "造船", "96.0%", "98.8%", "99.1%"], ["南通船务", "修船", "92.5%", "—", "—"],
    ["南通船务", "海工", "94.5%", "100%", "100%"], ["启东海工", "造船", "95.0%", "98.4%", "99.2%"],
    ["启东海工", "海工", "94.0%", "99.0%", "98.6%"], ["大连重工", "修船", "97.0%", "100%", "—"],
    ["大连重工", "造船", "97.0%", "98.1%", "98.7%"], ["舟山重工", "造船", "97.5%", "97.8%", "98.2%"],
    ["上海重工", "修船", "93.0%", "98.3%", "—"], ["上海重工", "海工", "96.5%", "97.6%", "97.9%"],
    ["广东重工", "修船", "92.0%", "100%", "—"], ["广东重工", "造船", "95.2%", "97.4%", "—"],
  ];
  const visibleRows = business === "全部" ? rows : rows.filter(row => row[1] === business);
  return (
    <>
      <StatusBar />
      <NavBar title="质量-RT/PAUT合规率" backLabel="返回质量主题" backPage="quality" />
      <BreadcrumbBar crumbs={["首页", "质量主题", "质量-RT/PAUT合规率"]} />

      <Card title="结构RT/PAUT一次性合规率总览" className="mt-3 quality-rt-summary-card">
        <div className="quality-rt-summary"><div><span>年度累计</span><strong>98.6%</strong><small className="is-good">高于目标 4.3%</small></div><div><span>本月合格率</span><strong>98.4%</strong></div><div><span>年度目标</span><strong>94.3%</strong></div></div>
        <div className="quality-rt-conclusion"><ShieldCheck size={14}/><span>年度累计与本月合格率均高于目标，整体质量表现稳定</span></div>
      </Card>

      <Card title="企业结构RT/PAUT一次性合规率表现" className="quality-rt-list-card">
        <div className="quality-rt-filter app-unified-segmented" role="tablist" aria-label="RT/PAUT合规率业务筛选">{(["全部","造船","修船","海工"] as QualityBusiness[]).map(item=><button type="button" role="tab" aria-selected={business===item} className={business===item?"is-active":""} key={item} onClick={()=>setBusiness(item)}>{item}</button>)}</div>
        <div className="quality-rt-head"><span>企业 / 业务</span><span>目标</span><span>本月</span><span>年度累计</span></div>
        <div className="quality-rt-list">{visibleRows.map(row=>{const target=Number(row[2].replace("%",""));const annual=row[4]==="—"?null:Number(row[4].replace("%",""));const good=annual!==null&&annual>=target;return <div key={`${row[0]}-${row[1]}`}><div><strong>{row[0]}</strong><span className={`quality-business-tag is-${row[1]}`}>{row[1]}</span></div><span>{row[2]}</span><b>{row[3]}</b><div><strong className={annual===null?"is-empty":good?"is-good":"is-risk"}>{row[4]}</strong><small className={annual===null?"is-empty":good?"is-good":"is-risk"}>{annual===null?"暂无年累":good?"达标":"待提升"}</small></div></div>})}</div>
      </Card>

      <Footer text="RT/PAUT 一次合格率 · 分造船/修船/海工业务口径" />
    </>
  );
}

function PageQualityInspection() {
  const rows = [
    ["南通川崎", "造船", "98.8%", "99.8%", "99.7%"],
    ["大连川崎", "造船", "98.7%", "99.5%", "99.6%"],
    ["扬州重工", "造船", "98.7%", "99.7%", "99.6%"],
    ["大连重工", "海工", "98.5%", "99.6%", "99.7%"],
    ["舟山重工", "造船", "98.7%", "99.9%", "99.9%"],
    ["上海重工", "海工", "98.0%", "98.9%", "99.3%"],
  ];
  return (
    <>
      <StatusBar />
      <NavBar title="质量-报验一次合规率" backLabel="返回质量主题" backPage="quality" />
      <BreadcrumbBar crumbs={["首页", "质量主题", "质量-报验一次合规率"]} />

      <Card title="报验一次合规率总览" className="mt-3 quality-rt-summary-card">
        <div className="quality-rt-summary"><div><span>年度累计</span><strong>99.2%</strong><small className="is-good">高于目标 1.7%</small></div><div><span>本月合规率</span><strong>99.0%</strong></div><div><span>年度目标</span><strong>97.5%</strong></div></div>
        <div className="quality-rt-conclusion"><ShieldCheck size={14}/><span>年度累计及本月报验一次合规率均达标，整体表现稳定</span></div>
      </Card>

      <Card title="企业报验一次合规率表现" className="quality-rt-list-card">
        <div className="quality-rt-head"><span>企业 / 业务</span><span>目标</span><span>本月</span><span>年度累计</span></div>
        <div className="quality-rt-list">{rows.map(row=>{const target=Number(row[2].replace("%",""));const annual=Number(row[4].replace("%",""));const good=annual>=target;return <div key={`${row[0]}-${row[1]}`}><div><strong>{row[0]}</strong><span className={`quality-business-tag is-${row[1]}`}>{row[1]}</span></div><span>{row[2]}</span><b>{row[3]}</b><div><strong className={good?"is-good":"is-risk"}>{row[4]}</strong><small className={good?"is-good":"is-risk"}>{good?"达标":"待提升"}</small></div></div>})}</div>
      </Card>

      <Footer text="报验一次合规率 · 精简展示核心企业指标" />
    </>
  );
}

function PageEnergyLegacy() {
  type Seg = "整体" | "造船" | "修船" | "海工";
  const [seg, setSeg] = useState<Seg>("整体");

  const BLUE = C.brand;

  const data: Record<Seg, {
    feeRatio: string; feeTarget: string; feeTrend: string;
    totalEnergy: string;
    trendLabel: string;
    perVal: string; perTarget: string;
    ranking: [string, string, string, string][];
  }> = {
    整体: {
      feeRatio: "2.08", feeTarget: "3.5", feeTrend: "同比 3.9%",
      totalEnergy: "13,526.83",
      trendLabel: "147,100.83",
      perVal: "0.0345", perTarget: "0.0345",
      ranking: [
        ["1","南通船务","23,439","+1"],["2","启东海工","23,439","-1"],["3","扬州重工","23,439","-1"],
        ["4","舟山重工","23,439","+1"],["5","南通川崎","23,439","-1"],["6","大连川崎","23,439","+4"],
        ["7","大连重工","23,439","-1"],["8","上海重工","23,439","-1"],["9","广东重工","23,439","-1"],
      ],
    },
    造船: {
      feeRatio: "1.92", feeTarget: "3.2", feeTrend: "同比 2.8%",
      totalEnergy: "8,312.40",
      trendLabel: "91,436.20",
      perVal: "0.0298", perTarget: "0.0310",
      ranking: [
        ["1","南通川崎","18,720","+2"],["2","大连川崎","19,340","-1"],["3","扬州重工","20,180","+1"],
        ["4","大连重工","21,050","-1"],["5","舟山重工","22,610","+3"],["6","上海重工","24,390","-2"],
        ["7","广东重工","25,810","-1"],
      ],
    },
    修船: {
      feeRatio: "2.54", feeTarget: "4.0", feeTrend: "同比 4.5%",
      totalEnergy: "3,108.62",
      trendLabel: "34,194.82",
      perVal: "0.0412", perTarget: "0.0400",
      ranking: [
        ["1","舟山重工","21,880","+1"],["2","广东重工","22,460","-1"],["3","大连重工","23,190","+2"],
        ["4","上海重工","24,830","-1"],["5","南通船务","26,710","+1"],
      ],
    },
    海工: {
      feeRatio: "2.31", feeTarget: "3.8", feeTrend: "同比 3.2%",
      totalEnergy: "2,105.81",
      trendLabel: "21,469.81",
      perVal: "0.0387", perTarget: "0.0380",
      ranking: [
        ["1","启东海工","20,310","+1"],["2","南通船务","22,580","-1"],["3","大连重工","24,170","+1"],
        ["4","上海重工","25,490","-1"],
      ],
    },
  };

  const d = data[seg];
  const tabs: Seg[] = ["整体", "造船", "修船", "海工"];

  return (
    <>
      <StatusBar />
      <NavBar title="能源主题" backLabel="返回首页" backPage="home" />
      <BreadcrumbBar crumbs={["首页", "能源主题"]} />

      {/* 口径切换 tab */}
      <div style={{ padding: "8px 10px 0", display: "flex", gap: 6 }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setSeg(t)} style={{
            flex: 1, padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer",
            background: seg === t ? BLUE : C.bg,
            color: seg === t ? "#fff" : C.t2,
            fontSize: 12, fontWeight: seg === t ? 700 : 400,
            transition: "all 0.15s",
          }}>{t}</button>
        ))}
      </div>
      <div style={{ padding: "4px 16px 0", fontSize: 10, color: C.t3 }}>
        当前口径：<b style={{ color: C.t2 }}>{seg}</b>
      </div>

      {/* 综合能耗 */}
      <Card title="综合能耗">
        <div style={{ display: "flex", gap: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 4 }}>能源费用比率</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{d.feeRatio}<span style={{ fontSize: 11 }}>%</span></div>
            <div style={{ fontSize: 10, color: C.t3, marginTop: 3 }}>{d.feeTrend} ｜ 目标 {d.feeTarget}%</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 4 }}>年累综合能耗</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums", lineHeight: 1.3 }}>{d.totalEnergy}</div>
            <div style={{ fontSize: 10, color: C.t3 }}>万吨标煤</div>
          </div>
        </div>
      </Card>

      {/* 综合能耗趋势 */}
      <Card title="综合能耗趋势" tag="近12个月">
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{d.trendLabel} <span style={{ fontSize: 10, fontWeight: 400, color: C.t3 }}>吨标煤</span></span>
        </div>
        {/* Line chart: 12-month energy consumption trend */}
        {(() => {
          const monthLabels = ["9月","10月","11月","12月","1月","2月","3月","4月","5月","6月","7月","8月"];
          const energyData: Record<string, number[]> = {
            "整体": [14200, 13800, 12100, 11500, 12800, 13200, 13600, 14100, 14800, 13900, 13500, 14300],
            "造船": [8800, 8500, 7400, 7100, 7900, 8100, 8400, 8700, 9100, 8600, 8300, 8800],
            "修船": [3200, 3100, 2700, 2600, 2900, 3000, 3100, 3200, 3400, 3200, 3100, 3300],
            "海工": [2200, 2200, 2000, 1800, 2000, 2100, 2100, 2200, 2300, 2100, 2100, 2200],
          };
          const vals = energyData[seg] || energyData["整体"];
          const vMin = Math.min(...vals), vMax = Math.max(...vals);
          const yPad = (vMax - vMin) * 0.2;
          const yMin = vMin - yPad, yMax = vMax + (vMax - vMin) * 0.1;
          const W = 300, H = 110;
          const padL = 46, padR = 10, padT = 10, padB = 20;
          const chartW = W - padL - padR, chartH = H - padT - padB;
          const xScale = (i: number) => padL + (i / (vals.length - 1)) * chartW;
          const yScale = (v: number) => padT + chartH - ((v - yMin) / (yMax - yMin)) * chartH;
          const pts = vals.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
          const area = `${xScale(0)},${padT + chartH} ` + vals.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ") + ` ${xScale(vals.length - 1)},${padT + chartH}`;
          const yGridVals = [yMin, yMin + (yMax - yMin) / 3, yMin + (yMax - yMin) * 2 / 3, yMax];
          return (
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", display: "block" }}>
              {yGridVals.map((t, i) => (
                <g key={i}>
                  <line x1={padL} y1={yScale(t)} x2={W - padR} y2={yScale(t)} stroke={C.divider} strokeWidth="0.5" />
                  <text x={padL - 3} y={yScale(t) + 3} textAnchor="end" fontSize={9} fill={C.t3}>{Math.round(t)}</text>
                </g>
              ))}
              {monthLabels.map((m, i) => i % 2 === 0 ? (
                <text key={i} x={xScale(i)} y={H - padB + 9} textAnchor="middle" fontSize={9} fill={C.t3}>{m}</text>
              ) : null)}
              <polygon points={area} fill={C.ph} fillOpacity="0.25" />
              <polyline points={pts} fill="none" stroke={C.brand} strokeWidth="1.5" />
              {vals.map((v, i) => <circle key={i} cx={xScale(i)} cy={yScale(v)} r="2" fill={C.brand} />)}
              <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={C.border} strokeWidth="1" />
              <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={C.border} strokeWidth="1" />
            </svg>
          );
        })()}
      </Card>

      {/* 万元产值综合能耗 */}
      <Card title="万元产值综合能耗">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 2 }}>年累万元产值综合能耗</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{d.perVal}</div>
            <div style={{ fontSize: 9, color: C.t3 }}>吨标煤/万元</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: C.t3, marginBottom: 2 }}>目标</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.t1, fontVariantNumeric: "tabular-nums" }}>{d.perTarget}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 6 }}>
          {["目标线", "万元产值综合能耗"].map((l, i) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 10, height: 2, background: i === 0 ? C.phDark : C.t1 }} />
              <span style={{ fontSize: 9, color: C.t3 }}>{l}</span>
            </div>
          ))}
        </div>
        {/* Line chart + dashed target: energy intensity trend */}
        {(() => {
          const monthLabels = ["9月","10月","11月","12月","1月","2月","3月","4月","5月","6月","7月","8月"];
          const intensityData: Record<string, number[]> = {
            "整体": [0.0362, 0.0358, 0.0341, 0.0336, 0.0348, 0.0352, 0.0356, 0.0362, 0.0371, 0.0355, 0.0349, 0.0365],
            "造船": [0.0318, 0.0312, 0.0298, 0.0291, 0.0305, 0.0309, 0.0314, 0.0320, 0.0328, 0.0315, 0.0308, 0.0321],
            "修船": [0.0421, 0.0415, 0.0398, 0.0392, 0.0408, 0.0412, 0.0417, 0.0424, 0.0435, 0.0418, 0.0411, 0.0426],
            "海工": [0.0395, 0.0389, 0.0372, 0.0365, 0.0381, 0.0385, 0.0390, 0.0397, 0.0408, 0.0392, 0.0384, 0.0399],
          };
          const vals = intensityData[seg] || intensityData["整体"];
          const targetVal = parseFloat(d.perTarget) || 0.034;
          const allVals = [...vals, targetVal];
          const vMin = Math.min(...allVals), vMax = Math.max(...allVals);
          const range = vMax - vMin || 0.001;
          const yMin = vMin - range * 0.1, yMax = vMax + range * 0.15;
          const W = 300, H = 100;
          const padL = 46, padR = 10, padT = 10, padB = 20;
          const chartW = W - padL - padR, chartH = H - padT - padB;
          const xScale = (i: number) => padL + (i / (vals.length - 1)) * chartW;
          const yScale = (v: number) => padT + chartH - ((v - yMin) / (yMax - yMin)) * chartH;
          const pts = vals.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
          const area = `${xScale(0)},${padT + chartH} ` + vals.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ") + ` ${xScale(vals.length - 1)},${padT + chartH}`;
          const yGridVals = [yMin, yMin + range / 3, yMin + range * 2 / 3, yMax];
          const tY = yScale(targetVal);
          return (
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ width: "100%", display: "block" }}>
              {yGridVals.map((t, i) => (
                <g key={i}>
                  <line x1={padL} y1={yScale(t)} x2={W - padR} y2={yScale(t)} stroke={C.divider} strokeWidth="0.5" />
                  <text x={padL - 3} y={yScale(t) + 3} textAnchor="end" fontSize={9} fill={C.t3}>{t.toFixed(4)}</text>
                </g>
              ))}
              {monthLabels.map((m, i) => i % 2 === 0 ? (
                <text key={i} x={xScale(i)} y={H - padB + 9} textAnchor="middle" fontSize={9} fill={C.t3}>{m}</text>
              ) : null)}
              <polygon points={area} fill={C.ph} fillOpacity="0.25" />
              <polyline points={pts} fill="none" stroke={C.brand} strokeWidth="1.5" />
              {vals.map((v, i) => <circle key={i} cx={xScale(i)} cy={yScale(v)} r="2" fill={C.brand} />)}
              <line x1={padL} y1={tY} x2={W - padR} y2={tY} stroke={C.phDark} strokeWidth="1" strokeDasharray="4,3" />
              <text x={W - padR - 2} y={tY - 2} textAnchor="end" fontSize={9} fill={C.phDark}>{targetVal.toFixed(4)}</text>
              <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke={C.border} strokeWidth="1" />
              <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke={C.border} strokeWidth="1" />
            </svg>
          );
        })()}
      </Card>

      {/* 万元产值综合能耗排名 */}
      <Card title="万元产值综合能耗排名">
        <TRow cells={["排名", "企业名称", "万元产值综合能耗", "排名变化"]} head />
        {d.ranking.map((row, i) => <TRow key={i} cells={row} />)}
      </Card>

      <Footer text={`能源主题 · ${seg}口径 · 综合能耗/万元产值能耗`} />
    </>
  );
}

function EnergyRankMedal({ rank }: { rank: 1 | 2 | 3 }) {
  const palette = rank === 1
    ? { top: "#F7D574", base: "#D9A441", dark: "#A66F18" }
    : rank === 2
      ? { top: "#E8EDF2", base: "#A9B4C0", dark: "#74808D" }
      : { top: "#E9AE83", base: "#C9825A", dark: "#965336" };
  const gradientId = `energy-medal-${rank}`;
  return <svg className="energy-rank-medal" viewBox="0 0 28 28" aria-label={`第${rank}名`} role="img">
    <defs><linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={palette.top}/><stop offset=".58" stopColor={palette.base}/><stop offset="1" stopColor={palette.dark}/></linearGradient></defs>
    <path d="M8 2h5l1 8-4 3z" fill={palette.base}/><path d="M20 2h-5l-1 8 4 3z" fill={palette.dark}/>
    <path d="M14 7 23 12v9l-9 5-9-5v-9z" fill={`url(#${gradientId})`} stroke="#fff" strokeWidth="1"/>
    <path d="M8.5 13.5 14 10.5l5.5 3" fill="none" stroke="#fff" strokeOpacity=".5" strokeWidth="1"/>
    <text x="14" y="20" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="800">{rank}</text>
  </svg>;
}

function PageEnergy() {
  type Seg = EnergyMode;
  type TrendMode = "total" | "intensity" | "carbon";
  const [seg, setSeg] = useState<Seg>("整体");
  const [trendMode, setTrendMode] = useState<TrendMode>("total");
  const data: Record<Seg, { feeRatio:string; feeTarget:string; feeTrend:string; totalEnergy:string; perVal:string; perTarget:string; carbon:string; carbonTarget:string; ranking:[string,string,string,string][] }> = {
    整体:{ feeRatio:"2.08",feeTarget:"3.5",feeTrend:"同比 3.9%",totalEnergy:"13,526.83",perVal:"0.0345",perTarget:"0.0345",carbon:"0.48",carbonTarget:"0.45",ranking:[["1","威海重工科技","0.0028","+1"],["2","南通远洋配套","0.0069","+1"],["3","启东海工","0.0163","+1"],["4","南通船务","0.0191","+1"],["5","大连川崎","0.0195","+1"],["6","南通川崎","0.0225","+1"],["7","舟山重工","0.0237","+1"],["8","大连重工","0.0248","+1"],["9","扬州重工","0.0277","+1"],["10","广东重工","0.0438","+1"],["11","上海重工","0.0462","+1"],["12","南通重工装备","—",""],["13","大连迪施","—",""],["14","市一万度力","—",""]]},
    造船:{ feeRatio:"1.92",feeTarget:"3.2",feeTrend:"同比 2.8%",totalEnergy:"8,312.40",perVal:"0.0298",perTarget:"0.0310",carbon:"0.42",carbonTarget:"0.45",ranking:[["1","南通川崎","18,720","+2"],["2","大连川崎","19,340","-1"],["3","扬州重工","20,180","+1"],["4","大连重工","21,050","-1"],["5","舟山重工","22,610","+3"],["6","上海重工","24,390","-2"],["7","广东重工","25,810","-1"]]},
    修船:{ feeRatio:"2.54",feeTarget:"4.0",feeTrend:"同比 4.5%",totalEnergy:"3,108.62",perVal:"0.0412",perTarget:"0.0400",carbon:"0.56",carbonTarget:"0.50",ranking:[["1","舟山重工","21,880","+1"],["2","广东重工","22,460","-1"],["3","大连重工","23,190","+2"],["4","上海重工","24,830","-1"],["5","南通船务","26,710","+1"]]},
    海工:{ feeRatio:"2.31",feeTarget:"3.8",feeTrend:"同比 3.2%",totalEnergy:"2,105.81",perVal:"0.0387",perTarget:"0.0380",carbon:"0.51",carbonTarget:"0.48",ranking:[["1","启东海工","20,310","+1"],["2","南通船务","22,580","-1"],["3","大连重工","24,170","+1"],["4","上海重工","25,490","-1"]]},
  };
  const trends: Record<TrendMode, Record<Seg, number[]>> = {
    total:{ 整体:[14200,13800,12100,11500,12800,13200,13600,14100,14800,13900,13500,14300],造船:[8800,8500,7400,7100,7900,8100,8400,8700,9100,8600,8300,8800],修船:[3200,3100,2700,2600,2900,3000,3100,3200,3400,3200,3100,3300],海工:[2200,2200,2000,1800,2000,2100,2100,2200,2300,2100,2100,2200]},
    intensity:{ 整体:[.0362,.0358,.0341,.0336,.0348,.0352,.0356,.0362,.0371,.0355,.0349,.0345],造船:[.0318,.0312,.0298,.0291,.0305,.0309,.0314,.0320,.0328,.0315,.0308,.0298],修船:[.0421,.0415,.0398,.0392,.0408,.0412,.0417,.0424,.0435,.0418,.0411,.0412],海工:[.0395,.0389,.0372,.0365,.0381,.0385,.0390,.0397,.0408,.0392,.0384,.0387]},
    carbon:{ 整体:[.52,.51,.49,.47,.48,.46,.47,.49,.51,.50,.49,.48],造船:[.47,.46,.44,.43,.44,.42,.43,.45,.46,.44,.43,.42],修船:[.58,.57,.55,.54,.56,.55,.57,.58,.60,.58,.57,.56],海工:[.54,.53,.51,.50,.52,.51,.52,.54,.55,.53,.52,.51]},
  };
  const d = data[seg];
  const modes:{key:TrendMode;label:string;unit:string}[] = [{key:"total",label:"综合能耗",unit:"吨标煤"},{key:"intensity",label:"万元产值能耗",unit:"吨标煤/万元"},{key:"carbon",label:"碳排放",unit:"吨/万元"}];
  const mode = modes.find(item => item.key === trendMode)!;
  const values = trends[trendMode][seg];
  const min = Math.min(...values), max = Math.max(...values), range = max-min || 1;
  const W=340,H=148,pL=36,pR=10,pT=23,pB=25;
  const x=(i:number)=>pL+i*(W-pL-pR)/(values.length-1);
  const y=(v:number)=>pT+(max-v)/range*(H-pT-pB-10);
  const points=values.map((v,i)=>`${x(i)},${y(v)}`).join(" ");
  const months=["9月","10月","11月","12月","1月","2月","3月","4月","5月","6月","7月","8月"];
  const target = trendMode === "intensity" ? Number(d.perTarget) : trendMode === "carbon" ? Number(d.carbonTarget) : null;
  const targetY = target === null ? null : y(Math.max(min,Math.min(max,target)));
  const ranking = d.ranking;
  return <>
    <StatusBar/><NavBar title="能源主题" backLabel="返回首页" backPage="home"/><BreadcrumbBar crumbs={["首页","能源主题"]}/>
    <div className="energy-mode-shell"><EnergyModeTabs value={seg} onValueChange={setSeg}/>
      <Card className="energy-overview-card attached-overview-card">
        <div className="attached-overview-heading attached-overview-heading-static">
          <strong>能源运营总览</strong>
        </div>
        <div className="energy-kpi-grid">
          <div><span>能源费用比率</span><strong>{d.feeRatio}<small>%</small></strong><em className="is-good">目标≤{d.feeTarget}%</em></div>
          <div><span>年累综合能耗</span><strong>{d.totalEnergy}</strong><em>万吨标煤</em></div>
          <div><span>万元产值综合能耗</span><strong>{d.perVal}</strong><em className={Number(d.perVal)<=Number(d.perTarget)?"is-good":"is-risk"}>目标≤{d.perTarget}</em></div>
          <div><span>万元产值碳排放</span><strong>{d.carbon}<small>吨</small></strong><em className={Number(d.carbon)<=Number(d.carbonTarget)?"is-good":"is-risk"}>目标≤{d.carbonTarget}</em></div>
        </div>
        <div className="energy-alert-strip"><AlertTriangle size={14}/><span>{Number(d.carbon)>Number(d.carbonTarget)?`${seg}万元产值碳排放高于目标 ${(Number(d.carbon)-Number(d.carbonTarget)).toFixed(2)}吨`:`${seg}能源费用与碳排放均处于目标范围内`}</span></div>
      </Card>
    </div>
    <Card title="能效趋势" tag="近12个月" className="energy-trend-card">
      <div className="energy-trend-toolbar"><div className="energy-trend-switch app-unified-segmented">{modes.map(item=><button type="button" key={item.key} className={trendMode===item.key?"is-active":""} onClick={()=>setTrendMode(item.key)}>{item.label}</button>)}</div><span>单位：{mode.unit}</span></div>
      <div className="energy-trend-summary">本月{mode.label} <strong>{values.at(-1)?.toLocaleString()}</strong><span>，较上月 {values.at(-1)!>=values.at(-2)!?"上升":"下降"} {Math.abs((values.at(-1)!/values.at(-2)!-1)*100).toFixed(1)}%</span></div>
      <svg className="energy-line-chart" viewBox={`0 0 ${W} ${H}`}><defs><linearGradient id="energyArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#79BBFF" stopOpacity=".35"/><stop offset="100%" stopColor="#ECF5FF" stopOpacity=".04"/></linearGradient></defs>{[0,.5,1].map((ratio,i)=>{const gy=pT+ratio*(H-pT-pB);return <line key={i} x1={pL} y1={gy} x2={W-pR} y2={gy} stroke={C.divider}/>})}<polygon points={`${x(0)},${H-pB} ${points} ${x(values.length-1)},${H-pB}`} fill="url(#energyArea)"/><polyline points={points} fill="none" stroke={C.brand} strokeWidth="2.4"/>{targetY!==null&&<line x1={pL} y1={targetY} x2={W-pR} y2={targetY} stroke={C.success} strokeWidth="1.2" strokeDasharray="5 4"/>}{values.map((v,i)=><g key={i}><circle cx={x(i)} cy={y(v)} r={i===values.length-1||v===max?3.5:2} fill={C.brand}/>{(i===values.length-1||v===max)&&<text x={x(i)} y={y(v)-7} textAnchor="middle" className="energy-chart-value">{trendMode==="total"?v.toLocaleString():v.toFixed(trendMode==="intensity"?4:2)}</text>}{i%2===0&&<text x={x(i)} y={H-7} textAnchor="middle" className="energy-chart-axis">{months[i]}</text>}</g>)}</svg>
    </Card>
    <Card title="年累计万元产值综合能耗排名" className="energy-ranking-card">
      <div className="energy-ranking-head"><span>排名</span><span>企业名称</span><span>年累计能耗</span><span>排名变化</span></div><div className="energy-ranking-list">{ranking.map(row=>{const displayRank=Number(row[0]);return <div key={`${seg}-${row[1]}`}>{displayRank<=3?<EnergyRankMedal rank={displayRank as 1|2|3}/>:<span className="energy-rank-index">{String(displayRank).padStart(2,"0")}</span>}<strong>{row[1]}</strong><b className={row[2]==="—"?"is-empty":""}>{row[2]}</b><em className={!row[3]?"is-flat":row[3].startsWith("+")?"is-up":"is-down"}>{row[3]&&<>{row[3].replace(/[+-]/,"")}<span>{row[3].startsWith("+")?"▲":"▼"}</span></>}</em></div>})}</div>
    </Card>
    <Footer text={`能源主题 · ${seg}口径 · 综合能耗/万元产值能耗`}/>
  </>;
}

function renderPage(id: string) {
  switch (id) {
    case "home":              return <PageHome />;
    case "biz":               return <PageBiz />;
    case "biz-repair":        return <PageBiz initialTab="修船" />;
    case "biz-shipbuilding":  return <PageBiz initialTab="造船" />;
    case "biz-offshore":      return <PageBiz initialTab="海工" />;
    case "biz-support":       return <PageBiz initialTab="配套" />;
    case "biz-progress":      return <PageBizProgress />;
    case "biz-progress-repair": return <PageBizProgress section="repair" />;
    case "biz-progress-shipbuilding": return <PageBizProgress section="shipbuilding" />;
    case "biz-progress-offshore": return <PageBizProgress section="offshore" />;
    case "biz-progress-support": return <PageBizProgress section="support" />;
    case "biz-overdue":       return <PageBizOverdue />;
    case "biz-collection-plan": return <PageBizCollectionPlan business="海工" />;
    case "biz-collection-plan-repair": return <PageBizCollectionPlan business="修船" />;
    case "biz-collection-plan-shipbuilding": return <PageBizCollectionPlan business="造船" />;
    case "biz-collection-overdue-support": return <PageBizCollectionPlan business="配套" />;
    case "biz-support-revenue-detail": return <PageBizSupportRevenueDetail />;
    case "biz-kpi-progress":  return <PageBizKpiProgress />;
    case "prod-repair":       return <PageProdRepair />;
    case "prod-repair-ships":      return <PageProdRepairShips />;
    case "prod-repair-completion": return <PageProdRepairCompletion />;
    case "prod-repair-daily":      return <PageProdRepairDaily />;
    case "prod-ship":         return <div className="production-ship-scope"><PageProdShip /></div>;
    case "prod-ship-delivery":        return <PageProdShipDelivery />;
    case "prod-ship-delivery-detail": return <PageProdShipDeliveryDetail />;
    case "prod-ship-track":   return <PageProdShipTrack />;
    case "finance":           return <PageFinance />;
    case "finance-fund":      return <PageFinanceFund />;
    case "finance-rate":      return <PageFinanceRate />;
    case "finance-revenue":   return <PageFinanceRevenue />;
    case "purchase-steel-dist": return <PagePurchaseSteelDist />;
    case "purchase-steel-delivery": return <PagePurchaseSteelDelivery />;
    case "purchase-steel-cost": return <PagePurchaseSteelCost />;
    case "purchase-group":    return <PagePurchaseGroup />;
    case "purchase-group-steel": return <PagePurchaseGroup initialSection="steel" />;
    case "purchase-group-rate": return <PagePurchaseGroupRate />;
    case "quality":           return <PageQuality />;
    case "quality-rt":        return <PageQualityRT />;
    case "quality-inspection": return <PageQualityInspection />;
    case "energy":            return <PageEnergy />;
    case "design-tokens":     return <PageDesignTokens />;
    case "atomic-components": return <PageAtomicComponents />;
    case "dashboard-components": return <PageDashboardComponents />;
    case "state-coverage":    return <PageStateCoverage />;
    default: return null;
  }
}

/* ─── Global nav helper (pages dispatch this to jump without prop-drilling) ─── */
function nav(pageId: string) {
  window.dispatchEvent(new CustomEvent("navigate", { detail: pageId }));
}

/* ─── Root App ─── */
export default function App() {
  const [activePage, setActivePage] = useState("home");
  const pageScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: Event) => setActivePage((e as CustomEvent<string>).detail);
    window.addEventListener("navigate", handler);
    return () => window.removeEventListener("navigate", handler);
  }, []);

  useEffect(() => {
    pageScrollRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activePage]);

  return (
    <div className="flex min-h-[100dvh]" style={{ fontFamily: "var(--font-ui, 'Noto Sans SC', 'PingFang SC', -apple-system, sans-serif)", background: "#1A2A3A" }}>

      {/* Left Nav Panel */}
      <div className="w-[200px] shrink-0 overflow-y-auto pt-4" style={{ background: "#00345F", scrollbarWidth: "thin", scrollbarColor: "#1E3A5A #00345F" }}>
        <div className="px-4 pb-4 mb-1" style={{ borderBottom: "1px solid rgba(0,80,142,0.20)" }}>
          <div className="text-[10px] mb-1 tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.60)" }}>COSCO SHIPPING</div>
          <div className="text-[13px] font-bold text-white tracking-tight">重工驾驶舱</div>
          <div className="flex items-center gap-1 mt-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>26 页 · 高保真原型</span>
          </div>
        </div>
        {PAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePage(p.id)}
            className={cn(
              "block w-full text-left py-2 px-4 text-[11px] leading-4 transition-all duration-100 border-none cursor-pointer",
              activePage === p.id
                ? "text-white font-semibold border-l-2 border-primary"
                : "text-white/35 font-normal border-l-2 border-transparent hover:text-white/60"
            )}
            style={{ background: activePage === p.id ? "rgba(0,80,142,0.15)" : "transparent" }}
          >
            {p.label}
          </button>
        ))}
        <div className="h-6" />
      </div>

      {/* Phone Frame */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-6">
        <div className="shrink-0 relative">
          {/* Phone shell */}
          <div className="relative rounded-[40px] p-[10px_8px]" style={{ background: "linear-gradient(145deg, #2A2A2A, #111)", boxShadow: "0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
            {/* Dynamic Island */}
            <div className="absolute top-[20px] left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-black rounded-full z-10" />
            {/* Side buttons */}
            <div className="absolute left-[-3px] top-[110px] w-1 h-8 rounded-l-sm" style={{ background: "#222" }} />
            <div className="absolute left-[-3px] top-[155px] w-1 h-12 rounded-l-sm" style={{ background: "#222" }} />
            <div className="absolute left-[-3px] top-[205px] w-1 h-12 rounded-l-sm" style={{ background: "#222" }} />
            <div className="absolute right-[-3px] top-[145px] w-1 h-16 rounded-r-sm" style={{ background: "#222" }} />
            {/* Screen */}
            <div className="app-phone-screen w-[375px] h-[812px] rounded-[32px] overflow-hidden flex flex-col relative" style={{ background: "linear-gradient(180deg, #F8FBFF 0%, #F1F8FF 14%, #E8F3FC 34%, #EEF5FC 58%, #F4F8FC 100%)" }}>
              {/* Scrollable page content */}
              <div ref={pageScrollRef} className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
                {renderPage(activePage)}
              </div>
            </div>
          </div>
          {/* Page label */}
          <div className="mt-4 text-center">
            <span className="text-[11px] text-white/50 bg-white/10 rounded-full px-3 py-1 tracking-tight">
              {PAGES.find(p => p.id === activePage)?.label}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
