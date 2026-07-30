import type React from "react";
import { AlertTriangle, CheckCircle2, Clock3, Database, LockKeyhole, RefreshCw, SearchX } from "lucide-react";

type StateKind = "default" | "loading" | "empty" | "error" | "permission" | "expired" | "partial";

type StateAction = {
  label: string;
  onClick?: () => void;
};

type StateProps = {
  state?: StateKind;
  title?: string;
  description?: string;
  action?: StateAction;
  secondaryAction?: StateAction;
  children?: React.ReactNode;
  minHeight?: number;
};

const C = {
  bg: "#F2F3F5",
  card: "#FFFFFF",
  border: "#DCDFE6",
  divider: "#EBEEF5",
  t1: "#303133",
  t2: "#606266",
  t3: "#909399",
  brand: "#00508E",
  brandSoft: "var(--app-primary-soft)",
  success: "#67C23A",
  warning: "#E6A23C",
  danger: "#F56C6C",
};

const stateConfig = {
  loading: {
    icon: RefreshCw,
    tone: C.brand,
    bg: C.brandSoft,
    title: "数据加载中",
    description: "正在同步经营运行数据，请稍候。",
  },
  empty: {
    icon: SearchX,
    tone: C.t3,
    bg: "#F7F8FA",
    title: "暂无数据",
    description: "当前筛选条件下没有可展示内容。",
  },
  error: {
    icon: AlertTriangle,
    tone: C.danger,
    bg: "var(--app-danger-soft)",
    title: "数据获取失败",
    description: "接口返回异常或网络超时，请刷新重试。",
  },
  permission: {
    icon: LockKeyhole,
    tone: C.warning,
    bg: "var(--app-warning-soft)",
    title: "暂无查看权限",
    description: "当前账号未开通该经营域数据权限。",
  },
  expired: {
    icon: Clock3,
    tone: C.warning,
    bg: "var(--app-pending-soft)",
    title: "数据已过期",
    description: "本页数据超过约定刷新时效，请确认后再用于决策。",
  },
  partial: {
    icon: Database,
    tone: C.brand,
    bg: "#F0F7FF",
    title: "部分数据同步中",
    description: "部分企业数据尚未回传，当前结果仅供趋势判断。",
  },
};

function StatePanel({
  state = "empty",
  title,
  description,
  action,
  secondaryAction,
  minHeight = 148,
  compact = false,
}: StateProps & { compact?: boolean }) {
  const cfg = stateConfig[state === "default" ? "empty" : state];
  const Icon = cfg.icon;

  return (
    <div
      style={{
        minHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: compact ? "18px 14px" : "28px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 260 }}>
        <div
          style={{
            width: compact ? 40 : 48,
            height: compact ? 40 : 48,
            margin: "0 auto 10px",
            borderRadius: 14,
            background: cfg.bg,
            color: cfg.tone,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={compact ? 19 : 22} strokeWidth={2.2} />
        </div>
        <div style={{ fontSize: compact ? 13 : 15, fontWeight: 700, color: C.t1, lineHeight: 1.35 }}>
          {title ?? cfg.title}
        </div>
        <div style={{ fontSize: 11, color: C.t3, lineHeight: 1.6, marginTop: 5 }}>
          {description ?? cfg.description}
        </div>
        {(action || secondaryAction) && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                style={{
                  height: 30,
                  padding: "0 12px",
                  borderRadius: 999,
                  border: `1px solid ${C.border}`,
                  background: C.card,
                  color: C.t2,
                  fontSize: 11,
                  fontWeight: 600,
                }}
              >
                {secondaryAction.label}
              </button>
            )}
            {action && (
              <button
                onClick={action.onClick}
                style={{
                  height: 30,
                  padding: "0 14px",
                  borderRadius: 999,
                  border: "none",
                  background: C.brand,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(0,80,142,0.22)",
                }}
              >
                {action.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div style={{ padding: 16 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: i === rows - 1 ? 0 : 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EEF2F7" }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: `${82 - i * 9}%`, height: 10, borderRadius: 99, background: "#EEF2F7", marginBottom: 7 }} />
            <div style={{ width: `${56 - i * 6}%`, height: 8, borderRadius: 99, background: "#F4F6F9" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageStateContainer({ state = "default", children, ...rest }: StateProps) {
  if (state === "default") return <>{children}</>;
  return (
    <div style={{ background: C.bg, minHeight: "100%", padding: "12px 16px 24px" }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
        {state === "loading" ? <LoadingSkeleton rows={6} /> : <StatePanel state={state} minHeight={420} {...rest} />}
      </div>
    </div>
  );
}

export function CardStateContainer({ state = "default", children, ...rest }: StateProps) {
  if (state === "default") return <>{children}</>;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
      {state === "loading" ? <LoadingSkeleton rows={3} /> : <StatePanel state={state} compact minHeight={rest.minHeight ?? 156} {...rest} />}
    </div>
  );
}

export function ChartStateContainer({ state = "default", children, ...rest }: StateProps) {
  if (state === "default") return <>{children}</>;
  return (
    <div style={{ border: `1px dashed ${C.border}`, borderRadius: 12, background: "#FAFBFC", overflow: "hidden" }}>
      {state === "loading" ? <LoadingSkeleton rows={3} /> : <StatePanel state={state} compact minHeight={rest.minHeight ?? 168} {...rest} />}
    </div>
  );
}

export function TableStateContainer({ state = "default", children, ...rest }: StateProps) {
  if (state === "default") return <>{children}</>;
  return (
    <div style={{ border: `1px solid ${C.divider}`, borderRadius: 12, background: C.card, overflow: "hidden" }}>
      {state === "loading" ? <LoadingSkeleton rows={5} /> : <StatePanel state={state} compact minHeight={rest.minHeight ?? 188} {...rest} />}
    </div>
  );
}

export function PermissionStateBlock({ title = "暂无查看权限", description, action }: Omit<StateProps, "state">) {
  return <StatePanel state="permission" title={title} description={description} action={action} minHeight={180} compact />;
}

export function DataFreshnessBanner({
  state = "fresh",
  updatedAt,
  nextAt,
}: {
  state?: "fresh" | "expired" | "partial";
  updatedAt: string;
  nextAt?: string;
}) {
  const expired = state === "expired";
  const partial = state === "partial";
  const tone = expired ? C.warning : partial ? C.brand : C.success;
  const bg = expired ? "var(--app-pending-soft)" : partial ? "#F0F7FF" : "var(--app-success-soft)";
  const Icon = expired ? Clock3 : partial ? Database : CheckCircle2;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 10,
        background: bg,
        color: tone,
        border: `1px solid ${tone}24`,
      }}
    >
      <Icon size={15} strokeWidth={2.2} />
      <div style={{ flex: 1, minWidth: 0, fontSize: 10, lineHeight: 1.45 }}>
        <span style={{ fontWeight: 700 }}>
          {expired ? "数据过期" : partial ? "部分同步" : "数据有效"}
        </span>
        <span style={{ color: C.t2 }}> · 更新于 {updatedAt}{nextAt ? ` · 下次 ${nextAt}` : ""}</span>
      </div>
    </div>
  );
}

export const STATE_SPEC_ROWS = [
  { name: "页面级状态容器", condition: "首屏核心接口 loading / error / permission / expired", visual: "全页白色状态面板，保留顶部导航", action: "刷新、返回首页、申请权限" },
  { name: "卡片级状态容器", condition: "单卡接口失败、无数据、部分同步", visual: "卡片内居中状态，不挤压邻近模块", action: "重试、查看口径、切换筛选" },
  { name: "图表空错态", condition: "series 为空、全 0、接口超时", visual: "保留图表高度，用虚线容器承载状态", action: "刷新、切换时间范围" },
  { name: "表格空错态", condition: "rows 为空、分页越界、权限过滤后为空", visual: "保留表头或表格边界，中心提示", action: "重置筛选、申请权限" },
  { name: "权限态", condition: "用户没有经营域、企业、指标权限", visual: "黄色权限状态，不暴露敏感字段", action: "申请权限、返回上级" },
  { name: "数据过期态", condition: "updatedAt 超过 SLA 或存在未回传企业", visual: "模块顶部信息条，过期时进入警示色", action: "刷新、查看同步明细" },
];
