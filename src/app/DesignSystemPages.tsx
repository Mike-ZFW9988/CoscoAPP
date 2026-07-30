import { useState } from 'react';
import {
  CardStateContainer,
  ChartStateContainer,
  DataFreshnessBanner,
  PageStateContainer,
  PermissionStateBlock,
  STATE_SPEC_ROWS,
  TableStateContainer,
} from './StateContainers';

/* ─── COSCO Design Tokens (mirror of App.tsx C constant) ─── */
const C = {
  bg: '#F2F3F5', card: '#FFFFFF', border: '#DCDFE6', divider: '#EBEEF5',
  t1: '#303133', t2: '#606266', t3: '#909399', ph: '#F0F2F5', phDark: '#B1B3B8',
  brand: '#00508E', brandHover: '#00508E', brandDark: '#00508E',
  success: '#67C23A', warning: '#E6A23C', danger: '#F56C6C', disabled: '#C0C4CC',
  chart: ['#00508E','#79BBFF','#67C23A','#E6A23C','#F56C6C','#909399','#9FCEFF','#B1B3B8'],
};

function StatusBar() {
  return (
    <div style={{ height: 44, background: '#00345F', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 20px', flexShrink: 0 }}>
      <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>9:41</span>
      <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>●●●</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ✦  Design Token System Page
   ══════════════════════════════════════════════════════════ */
function PageDesignTokens() {
  const [tab, setTab] = useState<"Color"|"Typography"|"Spacing"|"Radius"|"Shadow"|"Motion">("Color");
  const tabs = ["Color","Typography","Spacing","Radius","Shadow","Motion"] as const;

  /* ── Color tokens ── */
  const colorGroups = [
    {
      name: "品牌主色 Brand",
      tokens: [
        { name: "brand.primary",    val: "#00508E", css: "--color-primary",      use: "主操作·导航栏·按钮" },
        { name: "brand.hover",      val: "#00467C", css: "--brand-hover",        use: "Hover 状态" },
        { name: "brand.dark",       val: "#00345F", css: "--brand-dark",         use: "深色背景·StatusBar" },
        { name: "brand.chart",      val: "#79BBFF", css: "--color-chart-2",      use: "辅助图表色" },
      ],
    },
    {
      name: "语义色 Semantic",
      tokens: [
        { name: "semantic.success", val: "#67C23A", css: "--success",            use: "完成·正常·绿色" },
        { name: "semantic.warning", val: "#E6A23C", css: "--warning",            use: "预警·延期" },
        { name: "semantic.error",   val: "#F56C6C", css: "--destructive",        use: "风险·错误·危险" },
        { name: "semantic.info",    val: "#00508E", css: "--info",               use: "信息·提示" },
      ],
    },
    {
      name: "填充色 Fill",
      tokens: [
        { name: "fill.page",        val: "#F2F3F5", css: "--background",         use: "页面底色" },
        { name: "fill.card",        val: "#FFFFFF", css: "--card",               use: "卡片背景" },
        { name: "fill.placeholder", val: "#E8E8E8", css: "--ph",                 use: "占位·禁用背景" },
        { name: "fill.divider",     val: "#E5E5E5", css: "--divider",            use: "分割线" },
      ],
    },
    {
      name: "文字色 Text",
      tokens: [
        { name: "text.primary",     val: "#303133", css: "--foreground",         use: "主标题·关键数字" },
        { name: "text.secondary",   val: "#606266", css: "--text-secondary",     use: "正文·副标题" },
        { name: "text.tertiary",    val: "#909399", css: "--muted-foreground",   use: "辅助·标签·说明" },
        { name: "text.disabled",    val: "#BFBFBF", css: "--disabled",           use: "禁用文字" },
      ],
    },
    {
      name: "图表色板 Chart",
      tokens: C.chart.map((val, i) => ({
        name: `chart.${i+1}`, val, css: `--color-chart-${i+1}`, use: `图表色 ${i+1}`,
      })),
    },
  ];

  /* ── Typography tokens ── */
  const typographyTokens = [
    { name: "displayMetric",  size: 28, weight: 700, lh: 1.2,  sample: "12.8亿",       use: "核心指标大数字" },
    { name: "displaySmall",   size: 20, weight: 700, lh: 1.3,  sample: "48艘",         use: "次级指标数字" },
    { name: "heading1",       size: 17, weight: 600, lh: 1.4,  sample: "经营主题概览",  use: "页面主标题" },
    { name: "heading2",       size: 15, weight: 600, lh: 1.4,  sample: "修船在厂动态",  use: "卡片标题" },
    { name: "heading3",       size: 13, weight: 600, lh: 1.5,  sample: "本月完工趋势",  use: "节标题" },
    { name: "body1",          size: 14, weight: 400, lh: 1.6,  sample: "今日共完成出坞3艘，在厂48艘。",  use: "正文内容" },
    { name: "body2",          size: 13, weight: 400, lh: 1.6,  sample: "船期跟踪 · 生产进度",           use: "副文本" },
    { name: "caption",        size: 11, weight: 400, lh: 1.5,  sample: "2026-07-15  •  已更新",         use: "说明·时间戳" },
    { name: "label",          size: 10, weight: 600, lh: 1.4,  sample: "正常  ·  延期  ·  完工",        use: "Badge·标签文字" },
    { name: "micro",          size: 9,  weight: 400, lh: 1.4,  sample: "单位：亿元  单位：艘",          use: "图表注释·单位" },
  ];

  /* ── Spacing tokens ── */
  const spacingTokens = [
    { name: "spacing.0",  val: 0,  px: "0px",   use: "边框·分割线无缝贴合" },
    { name: "spacing.1",  val: 4,  px: "4px",   use: "icon 与文字间距" },
    { name: "spacing.2",  val: 8,  px: "8px",   use: "行内元素间距·pill padding" },
    { name: "spacing.3",  val: 12, px: "12px",  use: "卡片内节间距" },
    { name: "spacing.4",  val: 16, px: "16px",  use: "卡片内 padding·列间距" },
    { name: "spacing.5",  val: 20, px: "20px",  use: "页面左右 margin" },
    { name: "spacing.6",  val: 24, px: "24px",  use: "卡片间距·底部安全区" },
    { name: "spacing.8",  val: 32, px: "32px",  use: "区块间距·section gap" },
    { name: "spacing.10", val: 40, px: "40px",  use: "导航栏高度·Hero 内边距" },
    { name: "spacing.12", val: 48, px: "48px",  use: "Tab Bar 高度·最小触控区" },
    { name: "spacing.14", val: 56, px: "56px",  use: "NavBar 高度" },
  ];

  /* ── Radius tokens ── */
  const radiusTokens = [
    { name: "radius.xs",   val: 4,   use: "Badge·Tag·小按钮" },
    { name: "radius.sm",   val: 6,   use: "输入框·select" },
    { name: "radius.md",   val: 8,   use: "按钮·pill 选项" },
    { name: "radius.lg",   val: 12,  use: "卡片·Card" },
    { name: "radius.xl",   val: 16,  use: "底部 Sheet·模态框" },
    { name: "radius.2xl",  val: 24,  use: "大浮层·全屏弹窗" },
    { name: "radius.full", val: 999, use: "圆形按钮·全圆角 pill" },
  ];

  /* ── Shadow tokens ── */
  const shadowTokens = [
    { name: "shadow.xs",   css: "0 1px 2px rgba(0,0,0,0.05)",              use: "hover 微提升" },
    { name: "shadow.sm",   css: "0 1px 4px rgba(0,0,0,0.08)",              use: "输入框·行内元素" },
    { name: "shadow.card", css: "var(--app-shadow-card)",              use: "卡片默认阴影" },
    { name: "shadow.md",   css: "0 4px 12px rgba(0,0,0,0.10)",             use: "Dropdown·Popover" },
    { name: "shadow.lg",   css: "0 8px 24px rgba(0,0,0,0.12)",             use: "Sheet·Dialog" },
    { name: "shadow.xl",   css: "0 16px 48px rgba(0,0,0,0.18)",            use: "全屏弹窗·高优先面板" },
    { name: "shadow.brand","css": "0 4px 16px rgba(0,80,142,0.22)",       use: "主操作按钮品牌阴影" },
  ];

  /* ── Motion tokens ── */
  const motionTokens = [
    { name: "duration.instant", val: "0ms",   use: "即时反馈·状态切换" },
    { name: "duration.fast",    val: "100ms",  use: "hover·focus·微交互" },
    { name: "duration.normal",  val: "200ms",  use: "面板展开·slide in" },
    { name: "duration.slow",    val: "300ms",  use: "页面转场·大面积动效" },
    { name: "duration.xslow",   val: "500ms",  use: "引导动画·数字滚动" },
    { name: "easing.standard",  val: "cubic-bezier(0.4,0,0.2,1)", use: "大多数场景" },
    { name: "easing.decelerate",val: "cubic-bezier(0,0,0.2,1)",   use: "元素进场" },
    { name: "easing.accelerate",val: "cubic-bezier(0.4,0,1,1)",   use: "元素离场" },
    { name: "easing.spring",    val: "cubic-bezier(0.34,1.56,0.64,1)", use: "弹性出现·按钮反馈" },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100%" }}>
      <StatusBar />
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, #00345F 0%, #00508E 100%)`, padding: "16px 16px 12px" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 2 }}>中远海运重工</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>Design Token System</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>V1.0 · 2026 · Mobile Dashboard</div>
      </div>
      {/* Tab strip */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, overflowX: "auto", display: "flex", scrollbarWidth: "none" as const }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flexShrink: 0, padding: "10px 14px", fontSize: 12, fontWeight: tab === t ? 600 : 400,
              color: tab === t ? C.brand : C.t3, background: "none", border: "none",
              borderBottom: `2px solid ${tab === t ? C.brand : "transparent"}`,
              cursor: "pointer", transition: "all 150ms" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: "12px 0 32px" }}>

        {/* ── COLOR TAB ── */}
        {tab === "Color" && colorGroups.map(group => (
          <div key={group.name} style={{ margin: "0 16px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>{group.name}</div>
            <div style={{ background: C.card, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
              {group.tokens.map((tok, i) => (
                <div key={tok.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  borderBottom: i < group.tokens.length - 1 ? `1px solid ${C.divider}` : "none" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: tok.val, flexShrink: 0,
                    border: tok.val === "#FFFFFF" || tok.val === "#F2F3F5" ? `1px solid ${C.border}` : "none",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.t1, fontFamily: "monospace" }}>{tok.name}</div>
                    <div style={{ fontSize: 9, color: C.t3, marginTop: 1 }}>{tok.use}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.t2, fontFamily: "monospace" }}>{tok.val}</div>
                    <div style={{ fontSize: 9, color: C.t3, marginTop: 1, fontFamily: "monospace" }}>{tok.css}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* ── TYPOGRAPHY TAB ── */}
        {tab === "Typography" && (
          <div style={{ margin: "0 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Type Scale</div>
            {typographyTokens.map((tok, i) => (
              <div key={tok.name} style={{ background: C.card, borderRadius: 12, padding: "12px 14px", marginBottom: 8,
                border: `1px solid ${C.border}`, overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: C.brand, fontFamily: "monospace", background: "var(--app-primary-soft)", padding: "2px 6px", borderRadius: 4 }}>{tok.name}</span>
                    <span style={{ fontSize: 9, color: C.t3, marginLeft: 6 }}>{tok.use}</span>
                  </div>
                  <div style={{ fontSize: 9, color: C.t3, textAlign: "right", fontFamily: "monospace" }}>
                    {tok.size}px · w{tok.weight} · lh{tok.lh}
                  </div>
                </div>
                <div style={{ fontSize: tok.size, fontWeight: tok.weight, lineHeight: tok.lh, color: C.t1,
                  borderTop: `1px solid ${C.divider}`, paddingTop: 8, wordBreak: "break-all" }}>
                  {tok.sample}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SPACING TAB ── */}
        {tab === "Spacing" && (
          <div style={{ margin: "0 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Spacing Scale</div>
            <div style={{ background: C.card, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
              {spacingTokens.map((tok, i) => (
                <div key={tok.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                  borderBottom: i < spacingTokens.length - 1 ? `1px solid ${C.divider}` : "none" }}>
                  {/* Visual bar */}
                  <div style={{ width: Math.min(tok.val * 2.5, 80), height: 10, background: C.brand,
                    borderRadius: 3, flexShrink: 0, opacity: 0.7, minWidth: tok.val === 0 ? 2 : undefined }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.t1, fontFamily: "monospace" }}>{tok.name}</div>
                    <div style={{ fontSize: 9, color: C.t3 }}>{tok.use}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.t2, fontFamily: "monospace", flexShrink: 0 }}>{tok.px}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RADIUS TAB ── */}
        {tab === "Radius" && (
          <div style={{ margin: "0 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Border Radius</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {radiusTokens.map(tok => (
                <div key={tok.name} style={{ background: C.card, borderRadius: 12, padding: "14px 12px",
                  border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 48, height: 48, background: `linear-gradient(135deg, #00508E, #79BBFF)`,
                    borderRadius: Math.min(tok.val, 24), boxShadow: "0 2px 8px rgba(0,80,142,0.22)" }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.t1, fontFamily: "monospace" }}>{tok.name}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.brand, marginTop: 1 }}>{tok.val === 999 ? "9999px" : `${tok.val}px`}</div>
                    <div style={{ fontSize: 9, color: C.t3, marginTop: 2 }}>{tok.use}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SHADOW TAB ── */}
        {tab === "Shadow" && (
          <div style={{ margin: "0 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Elevation & Shadow</div>
            {shadowTokens.map(tok => (
              <div key={tok.name} style={{ background: C.card, borderRadius: 12, padding: "14px 14px", marginBottom: 10,
                boxShadow: tok.css, border: `1px solid ${C.divider}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.t1, fontFamily: "monospace" }}>{tok.name}</span>
                  <span style={{ fontSize: 9, color: C.t3 }}>{tok.use}</span>
                </div>
                <div style={{ fontSize: 9, color: C.t3, fontFamily: "monospace", wordBreak: "break-all" }}>{tok.css}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── MOTION TAB ── */}
        {tab === "Motion" && (
          <div style={{ margin: "0 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Duration</div>
            <div style={{ background: C.card, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, marginBottom: 16 }}>
              {motionTokens.filter(t => t.name.startsWith("duration")).map((tok, i, arr) => (
                <div key={tok.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none" }}>
                  {/* Animated bar */}
                  <div style={{ position: "relative", width: 60, height: 6, background: C.ph, borderRadius: 3, overflow: "hidden", flexShrink: 0 }}>
                    <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${C.brand}, #79BBFF)`,
                      borderRadius: 3, animation: `pulse ${tok.val} ease-in-out infinite alternate`,
                      opacity: 0.85 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, color: C.t1, fontFamily: "monospace" }}>{tok.name}</div>
                    <div style={{ fontSize: 9, color: C.t3 }}>{tok.use}</div>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.brand, fontFamily: "monospace" }}>{tok.val}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Easing</div>
            <div style={{ background: C.card, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
              {motionTokens.filter(t => t.name.startsWith("easing")).map((tok, i, arr) => (
                <div key={tok.name} style={{ padding: "10px 12px", borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: C.t1, fontFamily: "monospace" }}>{tok.name}</span>
                    <span style={{ fontSize: 9, color: C.t3 }}>{tok.use}</span>
                  </div>
                  <div style={{ fontSize: 9, color: C.brand, fontFamily: "monospace" }}>{tok.val}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ✦  Atomic Components Page
   ══════════════════════════════════════════════════════════ */
function PageAtomicComponents() {
  const [atomTab, setAtomTab] = useState<"Button"|"Form"|"Data"|"Overlay"|"Nav">("Button");
  const [checked, setChecked] = useState(true);
  const [radio, setRadio] = useState("A");
  const [inputVal, setInputVal] = useState("深圳蛇口船厂");
  const [toastVisible, setToastVisible] = useState(false);
  const atomTabs = ["Button","Form","Data","Overlay","Nav"] as const;

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 0.8, margin: "16px 16px 8px" }}>{children}</div>
  );

  const TokenTag = ({ children }: { children: React.ReactNode }) => (
    <span style={{ fontSize: 9, fontFamily: "monospace", background: "var(--app-primary-soft)", color: C.brand, padding: "2px 5px", borderRadius: 3, marginLeft: 4 }}>{children}</span>
  );

  const ComponentRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px",
      borderBottom: `1px solid ${C.divider}` }}>
      <span style={{ fontSize: 11, color: C.t2 }}>{label}</span>
      {children}
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100%" }}>
      <StatusBar />
      <div style={{ background: `linear-gradient(135deg, #00345F 0%, #00508E 100%)`, padding: "16px 16px 12px" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>中远海运重工</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>Atomic Components</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>375px 移动端 · 触控 ≥44px · COSCO Token</div>
      </div>

      {/* Tab strip */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, overflowX: "auto", display: "flex", scrollbarWidth: "none" as const }}>
        {atomTabs.map(t => (
          <button key={t} onClick={() => setAtomTab(t)}
            style={{ flexShrink: 0, padding: "10px 14px", fontSize: 12, fontWeight: atomTab === t ? 600 : 400,
              color: atomTab === t ? C.brand : C.t3, background: "none", border: "none",
              borderBottom: `2px solid ${atomTab === t ? C.brand : "transparent"}`, cursor: "pointer" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ paddingBottom: 32 }}>

        {/* ── BUTTON TAB ── */}
        {atomTab === "Button" && (<>
          <SectionLabel>Variant × State</SectionLabel>
          <div style={{ background: C.card, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, margin: "0 16px" }}>
            <ComponentRow label="Primary  default"><TokenTag>brand.primary</TokenTag>
              <button style={{ height: 40, padding: "0 20px", background: C.brand, color: "#fff", borderRadius: 8,
                fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,80,142,0.22)" }}>提交审批</button>
            </ComponentRow>
            <ComponentRow label="Primary  hover"><TokenTag>brand.hover</TokenTag>
              <button style={{ height: 40, padding: "0 20px", background: C.brandHover, color: "#fff", borderRadius: 8,
                fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>提交审批</button>
            </ComponentRow>
            <ComponentRow label="Primary  disabled"><TokenTag>disabled</TokenTag>
              <button disabled style={{ height: 40, padding: "0 20px", background: C.disabled, color: "#fff", borderRadius: 8,
                fontSize: 14, fontWeight: 600, border: "none", cursor: "not-allowed", opacity: 0.7 }}>提交审批</button>
            </ComponentRow>
            <ComponentRow label="Secondary"><TokenTag>fill.card</TokenTag>
              <button style={{ height: 40, padding: "0 18px", background: "#fff", color: C.brand, borderRadius: 8,
                fontSize: 14, fontWeight: 600, border: `1.5px solid ${C.brand}`, cursor: "pointer" }}>查看详情</button>
            </ComponentRow>
            <ComponentRow label="Ghost / text"><TokenTag>text.primary</TokenTag>
              <button style={{ height: 40, padding: "0 12px", background: "transparent", color: C.brand,
                fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>重置筛选 ›</button>
            </ComponentRow>
            <ComponentRow label="Danger"><TokenTag>semantic.error</TokenTag>
              <button style={{ height: 40, padding: "0 18px", background: C.danger, color: "#fff", borderRadius: 8,
                fontSize: 14, fontWeight: 600, border: "none", cursor: "pointer" }}>删除记录</button>
            </ComponentRow>
          </div>

          <SectionLabel>Size Scale</SectionLabel>
          <div style={{ background: C.card, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, margin: "0 16px" }}>
            {[
              { label: "XS  h-7  text-11", h: 28, px: 10, fs: 11 },
              { label: "SM  h-9  text-12", h: 36, px: 14, fs: 12 },
              { label: "MD  h-10 text-14", h: 40, px: 18, fs: 14 },
              { label: "LG  h-12 text-15", h: 48, px: 22, fs: 15 },
            ].map(s => (
              <ComponentRow key={s.label} label={s.label}>
                <button style={{ height: s.h, padding: `0 ${s.px}px`, background: C.brand, color: "#fff",
                  borderRadius: 8, fontSize: s.fs, fontWeight: 600, border: "none", cursor: "pointer" }}>操作</button>
              </ComponentRow>
            ))}
          </div>

          <SectionLabel>Full-width CTA</SectionLabel>
          <div style={{ margin: "0 16px 8px" }}>
            <button style={{ width: "100%", height: 50, background: `linear-gradient(90deg, #00508E, #79BBFF)`,
              color: "#fff", borderRadius: 12, fontSize: 16, fontWeight: 700, border: "none", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,80,142,0.28)", letterSpacing: 0.3 }}>
              进入工作台
            </button>
          </div>
        </>)}

        {/* ── FORM TAB ── */}
        {atomTab === "Form" && (<>
          <SectionLabel>Input</SectionLabel>
          <div style={{ background: C.card, borderRadius: 12, padding: "12px 14px", margin: "0 16px", border: `1px solid ${C.border}` }}>
            {[
              { label: "Default", val: inputVal, border: C.border, bg: C.card },
              { label: "Focus",   val: "深圳蛇口船厂", border: C.brand, bg: "#fafcff" },
              { label: "Error",   val: "输入值非法！", border: C.danger, bg: "#fff5f5" },
              { label: "Disabled",val: "已禁用字段",   border: C.border, bg: C.ph },
            ].map((item, i) => (
              <div key={item.label} style={{ marginBottom: i < 3 ? 10 : 0 }}>
                <div style={{ fontSize: 10, color: C.t3, marginBottom: 4 }}>{item.label} <TokenTag>spacing.2</TokenTag></div>
                <div style={{ height: 40, background: item.bg, border: `1.5px solid ${item.border}`, borderRadius: 8,
                  display: "flex", alignItems: "center", padding: "0 12px" }}>
                  <span style={{ fontSize: 13, color: item.label === "Disabled" ? C.disabled : C.t1 }}>{item.val}</span>
                </div>
                {item.label === "Error" && <div style={{ fontSize: 10, color: C.danger, marginTop: 3 }}>● 请输入有效的船厂名称</div>}
              </div>
            ))}
          </div>

          <SectionLabel>Checkbox &amp; Radio</SectionLabel>
          <div style={{ background: C.card, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, margin: "0 16px" }}>
            {[
              { label: "修船项目", type: "cb", val: true },
              { label: "造船项目", type: "cb", val: false },
              { label: "全部类型", type: "cb", val: null },
            ].map((item, i) => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                borderBottom: i < 2 ? `1px solid ${C.divider}` : "none", minHeight: 44 }}>
                <div onClick={() => setChecked(!checked)}
                  style={{ width: 20, height: 20, borderRadius: 5,
                    background: item.val === true ? C.brand : item.val === null ? C.brand : C.card,
                    border: `2px solid ${item.val === false ? C.border : C.brand}`,
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
                  {item.val === true && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4l3 3 6-6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                  {item.val === null && <div style={{ width: 10, height: 2, background: "#fff", borderRadius: 1 }} />}
                </div>
                <span style={{ fontSize: 14, color: C.t1 }}>{item.label}</span>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, margin: "8px 16px 0" }}>
            {["修船", "造船", "海工"].map((opt, i, arr) => (
              <div key={opt} onClick={() => setRadio(opt)}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                  borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none", minHeight: 44, cursor: "pointer" }}>
                <div style={{ width: 20, height: 20, borderRadius: 10,
                  border: `2px solid ${radio === opt ? C.brand : C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {radio === opt && <div style={{ width: 10, height: 10, borderRadius: 5, background: C.brand }} />}
                </div>
                <span style={{ fontSize: 14, color: C.t1 }}>{opt}项目</span>
                {radio === opt && <span style={{ marginLeft: "auto", fontSize: 10, color: C.brand, fontWeight: 600 }}>已选</span>}
              </div>
            ))}
          </div>
        </>)}

        {/* ── DATA TAB ── */}
        {atomTab === "Data" && (<>
          <SectionLabel>Badge / Tag</SectionLabel>
          <div style={{ background: C.card, borderRadius: 12, padding: "14px 14px", margin: "0 16px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { label: "正常", bg: "var(--app-success-soft)", color: C.success, border: "#B7EB8F" },
                { label: "延期", bg: "var(--app-warning-soft)", color: C.warning, border: "#FFD591" },
                { label: "风险", bg: "var(--app-danger-soft)", color: C.danger, border: "#FFA39E" },
                { label: "完工", bg: "#F0F5FF", color: "#2F54EB", border: "#ADC6FF" },
                { label: "待审", bg: "var(--app-pending-soft)", color: "#D48806", border: "#FFE58F" },
                { label: "停工", bg: "#F2F3F5", color: C.t3, border: C.border },
                { label: "修船", bg: "var(--app-primary-soft)", color: C.brand, border: "#91CAFF" },
                { label: "海工", bg: "#F9F0FF", color: "#9254DE", border: "#D3ADF7" },
              ].map(b => (
                <div key={b.label} style={{ padding: "3px 10px", borderRadius: 999, background: b.bg,
                  color: b.color, fontSize: 11, fontWeight: 600, border: `1px solid ${b.border}` }}>
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          <SectionLabel>Progress Bar</SectionLabel>
          <div style={{ background: C.card, borderRadius: 12, padding: "14px 14px", margin: "0 16px", border: `1px solid ${C.border}` }}>
            {[
              { label: "年度产值完成率", pct: 78, color: C.brand },
              { label: "安全检查通过率", pct: 95, color: C.success },
              { label: "材料到货及时率", pct: 62, color: C.warning },
              { label: "质量缺陷率",     pct: 18, color: C.danger },
            ].map(row => (
              <div key={row.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: C.t2 }}>{row.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: row.color }}>{row.pct}%</span>
                </div>
                <div style={{ height: 6, background: C.ph, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${row.pct}%`, background: row.color, borderRadius: 3, transition: "width 400ms ease" }} />
                </div>
              </div>
            ))}
          </div>

          <SectionLabel>Skeleton Loader</SectionLabel>
          <div style={{ background: C.card, borderRadius: 12, padding: "14px 14px", margin: "0 16px", border: `1px solid ${C.border}` }}>
            {[100, 85, 70, 60].map((w, i) => (
              <div key={i} style={{ height: i === 0 ? 16 : 12, width: `${w}%`, background: C.ph,
                borderRadius: 6, marginBottom: i < 3 ? 8 : 0,
                backgroundImage: `linear-gradient(90deg, ${C.ph} 0%, ${C.phDark} 50%, ${C.ph} 100%)`,
                backgroundSize: "200% 100%", animation: "shimmer 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        </>)}

        {/* ── OVERLAY TAB ── */}
        {atomTab === "Overlay" && (<>
          <SectionLabel>Toast / Notification</SectionLabel>
          <div style={{ margin: "0 16px" }}>
            {[
              { icon: "✓", label: "操作成功", sub: "审批已提交，等待上级处理", bg: "var(--app-success-soft)", border: "#B7EB8F", color: C.success },
              { icon: "!", label: "延期预警", sub: "3艘船只超过计划节点48h", bg: "var(--app-warning-soft)", border: "#FFD591", color: C.warning },
              { icon: "✕", label: "提交失败", sub: "网络异常，请检查连接后重试", bg: "var(--app-danger-soft)", border: "#FFA39E", color: C.danger },
              { icon: "i", label: "系统通知", sub: "驾驶舱数据已于 09:30 更新", bg: "#F0F8FF", border: "#91CAFF", color: C.brand },
            ].map(t => (
              <div key={t.label} style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 10,
                background: t.bg, border: `1px solid ${t.border}`, marginBottom: 8, alignItems: "flex-start" }}>
                <div style={{ width: 24, height: 24, borderRadius: 12, background: t.color,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{t.icon}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.t1 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: C.t2, marginTop: 2 }}>{t.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <SectionLabel>Empty State</SectionLabel>
          <div style={{ background: C.card, borderRadius: 12, padding: "28px 14px", margin: "0 16px", border: `1px solid ${C.border}`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
            {/* Simple ship illustration */}
            <svg width="64" height="52" viewBox="0 0 64 52" fill="none">
              <rect x="16" y="24" width="32" height="16" rx="4" fill={C.ph}/>
              <path d="M12 40 Q32 52 52 40" stroke={C.phDark} strokeWidth="2" fill="none"/>
              <rect x="26" y="14" width="12" height="12" rx="2" fill={C.phDark}/>
              <rect x="30" y="8" width="4" height="8" rx="1" fill={C.phDark}/>
              <circle cx="18" cy="28" r="2" fill={C.card}/>
              <circle cx="26" cy="28" r="2" fill={C.card}/>
            </svg>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.t2 }}>暂无数据</div>
            <div style={{ fontSize: 12, color: C.t3, textAlign: "center", maxWidth: 200 }}>当前条件下无匹配记录，请调整筛选条件后重试。</div>
            <button style={{ marginTop: 4, height: 36, padding: "0 18px", background: C.brand, color: "#fff",
              borderRadius: 8, fontSize: 13, fontWeight: 600, border: "none", cursor: "pointer" }}>重新加载</button>
          </div>
        </>)}

        {/* ── NAV TAB ── */}
        {atomTab === "Nav" && (<>
          <SectionLabel>Bottom Navigation</SectionLabel>
          <div style={{ background: C.card, borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}`, margin: "0 16px" }}>
            <div style={{ display: "flex", borderBottom: `1px solid ${C.divider}`, padding: "6px 0" }}>
              {[
                { icon: "⊞", label: "首页", active: true },
                { icon: "📊", label: "经营", active: false },
                { icon: "🔧", label: "生产", active: false },
                { icon: "💰", label: "财务", active: false },
                { icon: "👤", label: "我的", active: false },
              ].map(item => (
                <div key={item.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                  gap: 3, padding: "6px 0", cursor: "pointer" }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 9, fontWeight: item.active ? 700 : 400,
                    color: item.active ? C.brand : C.t3 }}>{item.label}</span>
                  {item.active && <div style={{ width: 4, height: 4, borderRadius: 2, background: C.brand }} />}
                </div>
              ))}
            </div>
            <div style={{ padding: "8px 12px" }}>
              <div style={{ fontSize: 9, color: C.t3 }}>5-tab pattern · h-16 · pb-safe · token: fill.card / brand.primary</div>
            </div>
          </div>

          <SectionLabel>Tabs (Segmented)</SectionLabel>
          <div style={{ background: C.card, borderRadius: 12, padding: "14px 14px", margin: "0 16px", border: `1px solid ${C.border}` }}>
            {/* Pill tabs */}
            <div style={{ display: "flex", background: C.bg, borderRadius: 10, padding: 3, marginBottom: 12 }}>
              {["修船", "造船", "海工"].map((t, i) => (
                <div key={t} style={{ flex: 1, textAlign: "center", padding: "7px 0", borderRadius: 8, fontSize: 12, fontWeight: i === 0 ? 600 : 400,
                  background: i === 0 ? C.card : "transparent", color: i === 0 ? C.t1 : C.t3,
                  boxShadow: i === 0 ? "0 1px 4px rgba(0,0,0,0.08)" : "none", cursor: "pointer" }}>
                  {t}
                </div>
              ))}
            </div>
            {/* Underline tabs */}
            <div style={{ display: "flex", borderBottom: `1px solid ${C.border}` }}>
              {["月度趋势", "区域分布", "船型占比"].map((t, i) => (
                <div key={t} style={{ padding: "8px 0", marginRight: 20, fontSize: 12, fontWeight: i === 0 ? 600 : 400,
                  color: i === 0 ? C.t1 : C.t3, borderBottom: `2px solid ${i === 0 ? C.brand : "transparent"}`,
                  cursor: "pointer" }}>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </>)}

      </div>

      {/* keyframe for skeleton shimmer */}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ✦  Dashboard Components Page
   ══════════════════════════════════════════════════════════ */
function PageDashboardComponents() {
  const [dashTab, setDashTab] = useState<"KPI"|"Chart"|"Project"|"Risk"|"Grid">("KPI");
  const dashTabs = ["KPI","Chart","Project","Risk","Grid"] as const;

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontSize: 10, fontWeight: 600, color: C.t3, textTransform: "uppercase", letterSpacing: 0.8, margin: "16px 16px 8px" }}>{children}</div>
  );

  /* Mini line chart SVG helper */
  const MiniLine = ({ pts, color, h = 36 }: { pts: number[]; color: string; h?: number }) => {
    const max = Math.max(...pts), min = Math.min(...pts);
    const range = max - min || 1;
    const w = 80;
    const points = pts.map((v, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - ((v - min) / range) * (h * 0.8) - h * 0.1;
      return `${x},${y}`;
    }).join(" ");
    const last = points.split(" ").pop()!;
    const [lx, ly] = last.split(",").map(Number);
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block" }}>
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={lx} cy={ly} r="2.5" fill={color} />
      </svg>
    );
  };

  /* Mini bar chart SVG helper */
  const MiniBar = ({ vals, color }: { vals: number[]; color: string }) => {
    const max = Math.max(...vals);
    const w = 80, h = 36, gap = 3;
    const barW = (w - gap * (vals.length - 1)) / vals.length;
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {vals.map((v, i) => {
          const bh = (v / max) * (h - 4);
          const x = i * (barW + gap);
          return <rect key={i} x={x} y={h - bh} width={barW} height={bh} rx="2" fill={color} opacity={i === vals.length - 1 ? 1 : 0.5} />;
        })}
      </svg>
    );
  };

  return (
    <div style={{ background: C.bg, minHeight: "100%" }}>
      <StatusBar />
      <div style={{ background: `linear-gradient(135deg, #00345F 0%, #00467C 100%)`, padding: "16px 16px 12px" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>中远海运重工</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>Dashboard Components</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>业务组件库 · Enterprise Mobile</div>
      </div>

      {/* Tab strip */}
      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, overflowX: "auto", display: "flex", scrollbarWidth: "none" as const }}>
        {dashTabs.map(t => (
          <button key={t} onClick={() => setDashTab(t)}
            style={{ flexShrink: 0, padding: "10px 14px", fontSize: 12, fontWeight: dashTab === t ? 600 : 400,
              color: dashTab === t ? C.brand : C.t3, background: "none", border: "none",
              borderBottom: `2px solid ${dashTab === t ? C.brand : "transparent"}`, cursor: "pointer" }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ paddingBottom: 32 }}>

        {/* ── KPI CARDS ── */}
        {dashTab === "KPI" && (<>
          <SectionLabel>KpiTrendCard — 关键指标趋势</SectionLabel>
          {/* Hero dark metric card */}
          <div style={{ margin: "0 16px 10px", borderRadius: 14, overflow: "hidden",
            background: "linear-gradient(135deg, #00345F 0%, #00508E 60%, #00345F 100%)",
            padding: "16px 16px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>年度累计产值</div>
                <div style={{ fontSize: 32, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>12.8<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 3 }}>亿元</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <span style={{ fontSize: 10, background: "rgba(82,196,26,0.2)", color: "#73D13D", padding: "2px 7px", borderRadius: 10, fontWeight: 600 }}>▲ 8.3%</span>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>同比去年</span>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>vs 年度目标</div>
                <svg width="52" height="52" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                  <circle cx="26" cy="26" r="20" fill="none" stroke="#79BBFF" strokeWidth="8"
                    strokeDasharray={`${(0.71)*125.7} ${125.7}`} strokeDashoffset="31.4" strokeLinecap="round"/>
                  <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">71%</text>
                </svg>
              </div>
            </div>
            <MiniLine pts={[6.2, 7.1, 8.4, 9.2, 10.5, 11.8, 12.8]} color="rgba(255,255,255,0.7)" h={40} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
              {["1月","2月","3月","4月","5月","6月","7月"].map(m => (
                <span key={m} style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>{m}</span>
              ))}
            </div>
          </div>

          {/* Light KPI metric row */}
          <div style={{ margin: "0 16px 10px", background: C.card, borderRadius: 14, padding: "14px 16px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: C.t3 }}>在厂艘数</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: C.t1, lineHeight: 1.2 }}>48<span style={{ fontSize: 12, fontWeight: 400, color: C.t3, marginLeft: 2 }}>艘</span></div>
              </div>
              <div style={{ background: "var(--app-primary-soft)", borderRadius: 10, padding: "6px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 9, color: C.brand, fontWeight: 600 }}>完工率</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.brand }}>83%</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: "在坞", val: 12, color: C.brand },
                { label: "浮泊", val: 22, color: "#79BBFF" },
                { label: "试航", val: 8,  color: C.success },
                { label: "完工", val: 6,  color: C.t3 },
              ].map(item => (
                <div key={item.label} style={{ flex: 1, background: C.bg, borderRadius: 8, padding: "6px 0", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: item.color }}>{item.val}</div>
                  <div style={{ fontSize: 9, color: C.t3 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <SectionLabel>ProgressMetric — 指标进度</SectionLabel>
          <div style={{ margin: "0 16px", background: C.card, borderRadius: 14, padding: "14px 16px", border: `1px solid ${C.border}` }}>
            {[
              { label: "修船产值完成率", val: 78, target: 85, color: C.brand },
              { label: "交船及时率",     val: 91, target: 90, color: C.success },
              { label: "集采覆盖率",     val: 62, target: 80, color: C.warning },
              { label: "RT探伤合格率",   val: 96, target: 95, color: C.success },
            ].map(row => (
              <div key={row.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.t1 }}>{row.label}</span>
                  <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: row.val >= row.target ? C.success : C.warning }}>{row.val}%</span>
                    <span style={{ fontSize: 9, color: C.t3 }}>目标{row.target}%</span>
                  </div>
                </div>
                <div style={{ position: "relative", height: 6, background: C.ph, borderRadius: 3 }}>
                  <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${row.val}%`, background: row.color, borderRadius: 3, transition: "width 400ms" }} />
                  {/* target marker */}
                  <div style={{ position: "absolute", left: `${row.target}%`, top: -2, width: 2, height: 10, background: C.t3, borderRadius: 1 }} />
                </div>
              </div>
            ))}
          </div>
        </>)}

        {/* ── CHART TAB ── */}
        {dashTab === "Chart" && (<>
          <SectionLabel>MiniLineChart × 6 sparklines</SectionLabel>
          <div style={{ margin: "0 16px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              { label: "月度产值", unit: "亿元", val: "12.8", trend: "+8.3%", pts: [6,7,8,9,11,12,13], color: C.brand },
              { label: "在厂艘数", unit: "艘",   val: "48",   trend: "+3艘",  pts: [38,41,43,42,45,47,48], color: "#79BBFF" },
              { label: "RT合格率", unit: "%",    val: "96.2", trend: "↑0.5%", pts: [92,93,94,94,95,96,96], color: C.success },
              { label: "集采率",   unit: "%",    val: "62",   trend: "-2.1%", pts: [68,66,65,64,63,63,62], color: C.warning },
              { label: "能耗指数", unit: "GJ",   val: "1240", trend: "↓3.2%", pts: [1400,1380,1350,1320,1300,1260,1240], color: "#909399" },
              { label: "可用资金", unit: "亿",   val: "4.2",  trend: "↑0.8",  pts: [3.2,3.5,3.8,3.6,3.9,4.0,4.2], color: "#67C23A" },
            ].map(card => (
              <div key={card.label} style={{ background: C.card, borderRadius: 12, padding: "10px 12px", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 10, color: C.t3, marginBottom: 2 }}>{card.label}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 18, fontWeight: 700, color: C.t1 }}>{card.val}</span>
                    <span style={{ fontSize: 9, color: C.t3, marginLeft: 2 }}>{card.unit}</span>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: card.trend.startsWith("-") ? C.danger : C.success,
                    background: card.trend.startsWith("-") ? "var(--app-danger-soft)" : "var(--app-success-soft)", padding: "2px 5px", borderRadius: 5 }}>
                    {card.trend}
                  </span>
                </div>
                <MiniLine pts={card.pts} color={card.color} />
              </div>
            ))}
          </div>

          <SectionLabel>MiniBarChart × 3 histograms</SectionLabel>
          <div style={{ margin: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "近7月修船产值（亿元）", vals: [6.2, 7.1, 8.4, 9.2, 10.5, 11.8, 12.8], color: C.brand },
              { label: "船型完工分布（艘）",     vals: [16, 12, 8, 6, 6],  color: "#79BBFF" },
              { label: "质量缺陷分类（项）",     vals: [4, 7, 12, 3, 8, 6], color: C.warning },
            ].map(card => (
              <div key={card.label} style={{ background: C.card, borderRadius: 12, padding: "12px 14px", border: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.t1, marginBottom: 8 }}>{card.label}</div>
                <div style={{ width: "100%" }}>
                  {(() => {
                    const max = Math.max(...card.vals);
                    return (
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 48 }}>
                        {card.vals.map((v, i) => (
                          <div key={i} style={{ flex: 1, height: `${(v/max)*100}%`, background: card.color,
                            borderRadius: "3px 3px 0 0", opacity: i === card.vals.length - 1 ? 1 : 0.5 }} />
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </>)}

        {/* ── PROJECT TAB ── */}
        {dashTab === "Project" && (<>
          <SectionLabel>ProjectProgressCard — 项目进度</SectionLabel>
          <div style={{ margin: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { ship: "长荣宝石号", type: "修船", no: "R2024-087", pct: 78, status: "正常", statusColor: C.success,
                plan: "2026-07-22", phases: [100,100,85,78,20,0] },
              { ship: "太平洋胜利号", type: "修船", no: "R2024-091", pct: 45, status: "延期", statusColor: C.warning,
                plan: "2026-08-05", phases: [100,100,45,10,0,0] },
              { ship: "COSCO GLORY", type: "造船", no: "N2024-012", pct: 62, status: "正常", statusColor: C.success,
                plan: "2026-10-30", phases: [100,100,100,62,0,0] },
            ].map(p => (
              <div key={p.no} style={{ background: C.card, borderRadius: 14, padding: "13px 14px", border: `1px solid ${C.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{p.ship}</span>
                      <span style={{ fontSize: 9, background: "var(--app-primary-soft)", color: C.brand, padding: "2px 6px", borderRadius: 4, fontWeight: 600 }}>{p.type}</span>
                    </div>
                    <div style={{ fontSize: 10, color: C.t3 }}>{p.no} · 计划完工 {p.plan}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, fontWeight: 600, color: p.statusColor, background: p.statusColor + "1A", padding: "2px 8px", borderRadius: 10 }}>{p.status}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.t1, marginTop: 2 }}>{p.pct}%</div>
                  </div>
                </div>
                {/* Phase bar */}
                <div style={{ display: "flex", gap: 3, marginBottom: 6 }}>
                  {["进坞","检验","主修","设备","油漆","出坞"].map((ph, i) => (
                    <div key={ph} style={{ flex: 1 }}>
                      <div style={{ height: 5, borderRadius: 3, background: p.phases[i] >= 100 ? C.brand : p.phases[i] > 0 ? "#79BBFF" : C.ph,
                        opacity: p.phases[i] === 0 ? 0.4 : 1 }} />
                      <div style={{ fontSize: 9, color: C.t3, textAlign: "center", marginTop: 2 }}>{ph}</div>
                    </div>
                  ))}
                </div>
                <div style={{ height: 5, background: C.ph, borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${p.pct}%`, background: `linear-gradient(90deg, ${C.brand}, #79BBFF)`, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </div>
        </>)}

        {/* ── RISK TAB ── */}
        {dashTab === "Risk" && (<>
          <SectionLabel>RiskAlertCard — 风险预警</SectionLabel>
          <div style={{ margin: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { level: "高", bg: "var(--app-danger-soft)", border: "#FFA39E", levelBg: C.danger,
                title: "长荣宝石号主机配件延误", sub: "预计影响出坞时间 72h · 船东已知会",
                tags: ["修船 R2024-087", "设备采购"], time: "2小时前" },
              { level: "中", bg: "var(--app-warning-soft)", border: "#FFD591", levelBg: C.warning,
                title: "7月焊接材料到货及时率低", sub: "当月到货率 62%，低于目标 80%·建议启动备货",
                tags: ["采购", "材料管理"], time: "昨日 18:30" },
              { level: "中", bg: "var(--app-warning-soft)", border: "#FFD591", levelBg: C.warning,
                title: "太平洋胜利号进度偏差", sub: "累计落后计划 3.2天 · 主要原因：坞位冲突",
                tags: ["修船 R2024-091", "生产调度"], time: "今日 09:15" },
              { level: "低", bg: "var(--app-success-soft)", border: "#B7EB8F", levelBg: C.success,
                title: "RT探伤合格率稳定上升", sub: "本月合格率 96.2% ↑0.5%，超出目标值",
                tags: ["质量管理"], time: "今日 08:00" },
            ].map((alert, i) => (
              <div key={i} style={{ background: alert.bg, borderRadius: 12, padding: "12px 14px",
                border: `1px solid ${alert.border}`, borderLeft: `4px solid ${alert.levelBg}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 999, background: alert.levelBg, boxShadow: `0 0 0 3px ${alert.levelBg}1F`, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.t1 }}>{alert.title}</span>
                  </div>
                  <span style={{ fontSize: 9, color: C.t3, flexShrink: 0, marginLeft: 6 }}>{alert.time}</span>
                </div>
                <div style={{ fontSize: 11, color: C.t2, marginBottom: 8, paddingLeft: 20 }}>{alert.sub}</div>
                <div style={{ display: "flex", gap: 5, paddingLeft: 20 }}>
                  {alert.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 9, background: "rgba(0,80,142,0.08)", color: C.t3,
                      padding: "2px 7px", borderRadius: 4 }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>)}

        {/* ── GRID TAB ── */}
        {dashTab === "Grid" && (<>
          <SectionLabel>BusinessEntryGrid — 功能入口</SectionLabel>
          <div style={{ margin: "0 16px 12px", background: C.card, borderRadius: 14, padding: "14px 14px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
              {[
                { icon: "▦", label: "经营主题", color: "var(--app-primary-soft)", iconColor: C.brand },
                { icon: "🔧", label: "修船生产", color: "#f0f9ff", iconColor: "#00508E" },
                { icon: "🚢", label: "造船交付", color: "#f6ffed", iconColor: C.success },
                { icon: "💰", label: "财务资金", color: "#fff7e6", iconColor: C.warning },
                { icon: "📦", label: "采购集采", color: "#f9f0ff", iconColor: "#9254DE" },
                { icon: "✅", label: "质量管理", color: "#fff1f0", iconColor: C.danger },
                { icon: "⚡", label: "能源管控", color: "#fcffe6", iconColor: "#7CB305" },
                { icon: "👤", label: "个人中心", color: "#f5f5f5", iconColor: C.t3 },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: item.color,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {item.icon}
                  </div>
                  <span style={{ fontSize: 9, color: C.t2, textAlign: "center", lineHeight: 1.3 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <SectionLabel>DashboardHeader — 页头</SectionLabel>
          <div style={{ margin: "0 16px 12px", borderRadius: 14, overflow: "hidden",
            background: "linear-gradient(135deg, #00345F 0%, #00508E 100%)" }}>
            <div style={{ padding: "14px 16px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>中远海运重工  ·  数字化运营平台</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>早上好，王总监 👋</div>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 20, background: "rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>👤</div>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                {[
                  { label: "待处理", val: 5, color: C.warning },
                  { label: "风险项", val: 3, color: C.danger },
                  { label: "在厂船", val: 48, color: "#79BBFF" },
                ].map(chip => (
                  <div key={chip.label} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "5px 10px",
                    display: "flex", gap: 4, alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: chip.color }}>{chip.val}</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.55)" }}>{chip.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "rgba(0,0,0,0.15)", padding: "7px 16px", fontSize: 9, color: "rgba(255,255,255,0.4)" }}>
              数据更新于 2026-07-15 09:30  ·  下次更新 10:30
            </div>
          </div>

          <SectionLabel>TodoListCard — 待办事项</SectionLabel>
          <div style={{ margin: "0 16px", background: C.card, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.border}` }}>
            {[
              { done: true,  text: "审批长荣宝石号出坞申请", tag: "生产", time: "已完成" },
              { done: false, text: "签署7月集采框架协议", tag: "采购", time: "今日截止", urgent: true },
              { done: false, text: "确认太平洋胜利号进度偏差报告", tag: "修船", time: "明日" },
              { done: false, text: "参加8月排坞计划评审会", tag: "会议", time: "7月16日 14:00" },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "11px 14px",
                borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : "none",
                background: item.urgent ? "var(--app-pending-soft)" : undefined }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${item.done ? C.success : C.border}`,
                  background: item.done ? C.success : C.card, flexShrink: 0, marginTop: 1,
                  display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {item.done && <svg width="10" height="8" viewBox="0 0 10 8"><path d="M1 4l2.5 2.5L9 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: item.done ? C.t3 : C.t1,
                    textDecoration: item.done ? "line-through" : "none" }}>{item.text}</div>
                  <div style={{ display: "flex", gap: 5, marginTop: 3, alignItems: "center" }}>
                    <span style={{ fontSize: 9, background: "var(--app-primary-soft)", color: C.brand, padding: "1px 5px", borderRadius: 3 }}>{item.tag}</span>
                    <span style={{ fontSize: 9, color: item.urgent ? C.warning : C.t3, fontWeight: item.urgent ? 600 : 400 }}>{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>)}
      </div>
    </div>
  );
}

function PageStateCoverage() {
  const [tab, setTab] = useState<"Page"|"Card"|"Chart"|"Table"|"Access"|"SLA">("Page");
  const tabs = ["Page","Card","Chart","Table","Access","SLA"] as const;

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{ margin: "0 16px 8px", fontSize: 10, fontWeight: 700, color: C.t3, textTransform: "uppercase", letterSpacing: 0.8 }}>
      {children}
    </div>
  );

  const SpecRow = ({ row }: { row: typeof STATE_SPEC_ROWS[number] }) => (
    <div style={{ padding: "10px 12px", borderBottom: `1px solid ${C.divider}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.t1 }}>{row.name}</div>
        <div style={{ fontSize: 9, color: C.brand, background: "var(--app-primary-soft)", borderRadius: 999, padding: "2px 7px", whiteSpace: "nowrap" }}>
          必补
        </div>
      </div>
      <div style={{ fontSize: 10, color: C.t3, lineHeight: 1.55, marginTop: 5 }}>出现条件：{row.condition}</div>
      <div style={{ fontSize: 10, color: C.t3, lineHeight: 1.55 }}>页面表现：{row.visual}</div>
      <div style={{ fontSize: 10, color: C.t3, lineHeight: 1.55 }}>可操作项：{row.action}</div>
    </div>
  );

  const Rule = ({ title, text }: { title: string; text: string }) => (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "10px 12px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: C.t1, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 10, color: C.t3, lineHeight: 1.6 }}>{text}</div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100%" }}>
      <StatusBar />
      <div style={{ background: `linear-gradient(135deg, ${C.brandDark} 0%, ${C.brand} 100%)`, padding: "16px 16px 12px" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.62)", marginBottom: 2 }}>中远海运重工 · 研发实现规范</div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>State Coverage System</div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.48)", marginTop: 3 }}>
          页面级状态 / 卡片状态 / 图表表格空错态 / 权限态 / 数据过期态
        </div>
      </div>

      <div style={{ background: C.card, borderBottom: `1px solid ${C.border}`, overflowX: "auto", display: "flex", scrollbarWidth: "none" as const }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ flexShrink: 0, padding: "10px 14px", fontSize: 12, fontWeight: tab === t ? 700 : 500,
              color: tab === t ? C.brand : C.t3, background: "none", border: "none",
              borderBottom: `2px solid ${tab === t ? C.brand : "transparent"}` }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: "12px 0 32px" }}>
        <SectionLabel>Implementation Matrix</SectionLabel>
        <div style={{ margin: "0 16px 14px", background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          {STATE_SPEC_ROWS.map(row => <SpecRow key={row.name} row={row} />)}
        </div>

        {tab === "Page" && (
          <>
            <SectionLabel>PageStateContainer</SectionLabel>
            <div style={{ margin: "0 16px 14px" }}>
              <PageStateContainer
                state="error"
                title="经营首页加载失败"
                description="首屏经营总览接口未返回，需保留顶部导航并提供刷新入口。"
                action={{ label: "刷新页面" }}
                secondaryAction={{ label: "返回首页" }}
              />
            </div>
            <div style={{ margin: "0 16px", display: "grid", gap: 8 }}>
              <Rule title="触发条件" text="首屏核心接口失败、整页无权限、全量数据过期或路由参数无效时启用页面级状态。" />
              <Rule title="研发要求" text="页面级状态不隐藏品牌导航栏；状态容器最小高度不低于 420px；主操作仅保留 1 个，次操作最多 1 个。" />
            </div>
          </>
        )}

        {tab === "Card" && (
          <>
            <SectionLabel>CardStateContainer</SectionLabel>
            <div style={{ margin: "0 16px 14px", display: "grid", gap: 10 }}>
              <CardStateContainer state="loading" />
              <CardStateContainer state="partial" title="广东重工数据同步中" description="当前经营指标不含广东重工，汇总口径已标注。" action={{ label: "查看口径" }} />
              <CardStateContainer state="empty" title="暂无风险事项" description="当前筛选条件下没有待处理风险。" />
            </div>
            <div style={{ margin: "0 16px", display: "grid", gap: 8 }}>
              <Rule title="触发条件" text="单个卡片数据缺失、局部接口失败、筛选后为空、部分企业未回传时启用卡片级状态。" />
              <Rule title="研发要求" text="卡片状态不改变卡片外间距；默认最小高度 156px；状态文案必须说明数据口径或下一步动作。" />
            </div>
          </>
        )}

        {tab === "Chart" && (
          <>
            <SectionLabel>ChartStateContainer</SectionLabel>
            <div style={{ margin: "0 16px 14px", display: "grid", gap: 10 }}>
              <ChartStateContainer state="empty" title="暂无趋势数据" description="该时间范围内没有可绘制的月度数据。" action={{ label: "切换时间" }} />
              <ChartStateContainer state="error" title="图表加载失败" description="趋势接口超时，保留图表高度避免页面跳动。" action={{ label: "重试" }} />
            </div>
            <div style={{ margin: "0 16px", display: "grid", gap: 8 }}>
              <Rule title="边界情况" text="series 为空、仅 1 个点、全 0、含 null、单位切换失败、横轴标签过长时必须进入图表状态或降级展示。" />
              <Rule title="研发要求" text="空错态保留原图表高度；不得直接隐藏图表标题和单位；图例可保留，但数据区域必须提示状态。" />
            </div>
          </>
        )}

        {tab === "Table" && (
          <>
            <SectionLabel>TableStateContainer</SectionLabel>
            <div style={{ margin: "0 16px 14px", display: "grid", gap: 10 }}>
              <TableStateContainer state="empty" title="暂无企业明细" description="权限或筛选条件导致当前表格没有记录。" action={{ label: "重置筛选" }} />
              <TableStateContainer state="loading" />
            </div>
            <div style={{ margin: "0 16px", display: "grid", gap: 8 }}>
              <Rule title="边界情况" text="rows 为空、分页越界、排序字段不存在、企业名称过长、数值为 null 或单位缺失时必须有明确降级规则。" />
              <Rule title="研发要求" text="表格空错态保留表格边界；数值缺失统一展示 --；无权限字段不展示真实值，改用权限态说明。" />
            </div>
          </>
        )}

        {tab === "Access" && (
          <>
            <SectionLabel>PermissionStateBlock</SectionLabel>
            <div style={{ margin: "0 16px 14px", background: C.card, borderRadius: 14, border: `1px solid ${C.border}` }}>
              <PermissionStateBlock
                title="暂无财务资金权限"
                description="该模块包含资金余额与汇率敏感信息，仅集团领导与授权财务角色可见。"
                action={{ label: "申请权限" }}
              />
            </div>
            <div style={{ margin: "0 16px", display: "grid", gap: 8 }}>
              <Rule title="权限分级" text="页面级无权限使用 PageStateContainer；卡片级无权限使用 PermissionStateBlock；字段级无权限统一展示 -- 并附权限提示。" />
              <Rule title="安全要求" text="权限态不得先渲染敏感数据再遮罩；接口需返回 permissionCode，前端按权限码选择状态文案。" />
            </div>
          </>
        )}

        {tab === "SLA" && (
          <>
            <SectionLabel>DataFreshnessBanner</SectionLabel>
            <div style={{ margin: "0 16px 14px", display: "grid", gap: 8 }}>
              <DataFreshnessBanner state="fresh" updatedAt="2026-07-16 09:30" nextAt="10:30" />
              <DataFreshnessBanner state="partial" updatedAt="2026-07-16 09:30" nextAt="10:30" />
              <DataFreshnessBanner state="expired" updatedAt="2026-07-15 18:00" />
            </div>
            <div style={{ margin: "0 16px", display: "grid", gap: 8 }}>
              <Rule title="SLA 规则" text="经营、生产、采购、质量、能源主题超过 2 小时未更新标记为过期；财务敏感指标按业务口径单独配置。" />
              <Rule title="展示规则" text="新鲜度信息条放在卡片标题下方或模块顶部；过期态不阻断查看，但必须提示不建议作为最终决策依据。" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}


export { PageDesignTokens, PageAtomicComponents, PageDashboardComponents, PageStateCoverage };
