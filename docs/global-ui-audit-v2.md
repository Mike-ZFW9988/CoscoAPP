# 移动端驾驶舱全局 UI 审计 V2

## 设计定位

船舶重工高层移动驾驶舱：采用 C 端航旅 App 的高密度浏览效率，保留企业数据产品的可信、克制和可追溯性。页面不追求大屏式装饰，不使用嵌套卡片堆叠信息。

## 扫描基线

- 业务页面：28 个
- `App.tsx`：4,810 行
- 内联样式：635 处
- 原生按钮：55 处
- 公共 `Card`：64 处
- 内联 SVG：46 处
- `theme.css`：5,235 行
- 硬编码字号：293 处
- 硬编码圆角：113 处
- 阴影声明：71 处
- 独立 Hex 色值：60 种

## P0 违规清单

1. 635 处内联样式绕开 Token，导致字号、间距、圆角和颜色无法全局升级。
2. 原生 `button`、自制 segmented control、Radix Tabs 三套交互组件并存，高度覆盖 26/28/32/36/40/44/50px。
3. 页面内联 SVG、Lucide 和业务 3D SVG 并存，缺少“功能图标/业务插画”边界。
4. 柱图、折线图、进度条存在 CSS div、手写 SVG、GroupedBarChart 多套实现，轴线、图例和高度不一致。
5. `Card` 已桥接 shadcn，但仍有大量 `div + background + borderRadius + shadow` 模拟卡片。
6. `App.tsx` 同时承担路由、数据、页面、图表和样式决策，无法可靠批量标准化。
7. 表格自动套用 `DataTableCard` 外框，部分页面又在内部增加边框，形成嵌套框线。
8. 状态色存在无判断规则使用红绿橙的问题；品牌色与业务语义色边界不清。

## 全局 Token 标准

```css
:root {
  --app-font-family: "Inter", "PingFang SC", "Noto Sans SC", system-ui, sans-serif;
  --type-page: 18px;
  --type-section: 16px;
  --type-card: 14px;
  --type-body: 13px;
  --type-meta: 11px;
  --type-kpi: 24px;
  --type-data: 16px;

  --space-page-x: 10px;
  --space-section: 10px;
  --space-card-x: 12px;
  --space-card-y: 10px;
  --space-row: 8px;

  --radius-control: 8px;
  --radius-card: 12px;
  --radius-pill: 999px;

  --control-sm: 32px;
  --control-md: 40px;
  --touch-target: 44px;

  --icon-sm: 14px;
  --icon-md: 18px;
  --icon-lg: 24px;
  --icon-stroke: 2;

  --chart-sm: 128px;
  --chart-md: 160px;
  --chart-lg: 188px;
}
```

品牌主色固定 `#00508E`。品牌色表示选择、链接、主数据；绿色仅表示明确达成，橙色仅表示临界，红色仅表示异常。没有业务判断规则时，数值使用品牌蓝或中性色。

## 公共 TSX 标准

```tsx
type PageShellProps = { children: React.ReactNode; className?: string };
export function PageShell({ children, className }: PageShellProps) {
  return <main className={cn("app-page-shell", className)}>{children}</main>;
}

export function AppCard(props: React.ComponentProps<typeof Card>) {
  return <Card className={cn("app-card", props.className)} {...props} />;
}

export function AppSegmented<T extends string>({ value, items, onChange }: {
  value: T;
  items: readonly T[];
  onChange: (value: T) => void;
}) {
  return (
    <Tabs value={value} onValueChange={(next) => onChange(next as T)}>
      <TabsList className="app-segmented-list">
        {items.map((item) => <TabsTrigger key={item} value={item}>{item}</TabsTrigger>)}
      </TabsList>
    </Tabs>
  );
}

export function AppIcon({ icon: Icon, size = "md" }: {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
}) {
  return <Icon className={`app-icon app-icon-${size}`} strokeWidth={2} aria-hidden />;
}

export function ChartCard({ title, unit, controls, children }: {
  title: string;
  unit?: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AppCard>
      <CardHeader className="app-card-header">
        <CardTitle>{title}</CardTitle>
        {controls && <CardAction>{controls}</CardAction>}
      </CardHeader>
      <CardContent>
        {unit && <div className="app-chart-unit">单位：{unit}</div>}
        <div className="app-chart-body">{children}</div>
      </CardContent>
    </AppCard>
  );
}

export function DataList({ children }: { children: React.ReactNode }) {
  return <div className="app-data-list">{children}</div>;
}
```

## 组件硬性规范

| 组件 | 标准 |
|---|---|
| 主按钮 | 40px，高度固定；触控热区至少44px |
| Segmented | 32px；选中品牌蓝底白字 |
| 图标按钮 | 40px视觉容器，44px热区 |
| Card | 12px圆角；外距10px；内边距12px；边框和阴影二选一 |
| Badge | 20px；胶囊；只表达状态或分类 |
| 进度条 | 8px常规、12px重点；圆角full |
| 图表 | 128/160/188px三级高度；单位在图表上方 |
| 图例 | 10px色块 + 11px文字，单行水平排列 |
| 数据列表 | 44–48px行高；仅行间分割线，无外框 |
| 空错态 | shadcn Alert + 公共 StateContainer |

## 图标治理

- 功能图标只使用 Lucide，`strokeWidth={2}`，尺寸仅14/18/24px。
- 首页频道和业务板块的轻3D图标属于品牌插画资产，可保留SVG，但不得用于按钮、表格或状态标签。
- 删除手写功能SVG；用 `AppIcon` 替换。
- 同一标题区域不得混用线性Lucide与3D业务图标。

## 图表治理

- 所有双柱图迁移到 `GroupedBarChart`，补充 `height`、`showValues`、`scrollable` 参数。
- 所有单柱图新增 `BarChart` 公共组件；禁止页面内用 `div` 高度模拟柱子。
- 所有折线图新增 `LineChartPanel`；强制显示数据点、单位、横纵轴。
- 所有进度条使用 shadcn `Progress`；业务色由 `tone` 决定。
- 图表色固定：主值品牌蓝、对比值绿色或浅蓝；橙红只用于明确异常。

## 页面迁移顺序

### P0：高频入口

首页、经营主题、生产修船、生产造船、采购管理、质量主题、能源主题。

### P1：核心下钻

经营指标进度、逾期收款、修船今日动态、在厂艘数、完工明细、造船生产跟踪、钢材采购、质量RT。

### P2：长尾详情和设计系统

财务汇率/资金/收入、交付明细、供应商、状态覆盖、DesignSystemPages。

## 页面迁移模板

```tsx
export function StandardDetailPage() {
  const [period, setPeriod] = useState<"月度" | "累计">("月度");
  return (
    <>
      <StatusBar />
      <NavBar title="页面标题" backPage="parent" />
      <PageShell>
        <AppCard>
          <SectionHeader title="运营总览" icon={<AppIcon icon={Gauge} />} />
          <div className="app-kpi-grid">{/* KpiCard */}</div>
        </AppCard>
        <ChartCard
          title="趋势分析"
          unit="艘"
          controls={<AppSegmented value={period} items={["月度", "累计"]} onChange={setPeriod} />}
        >
          {/* 标准图表组件 */}
        </ChartCard>
        <AppCard>
          <SectionHeader title="企业明细" icon={<AppIcon icon={Factory} />} />
          <DataList>{/* 标准行 */}</DataList>
        </AppCard>
      </PageShell>
    </>
  );
}
```

## 验收门槛

- `App.tsx` 内联样式从635降至50以下。
- 原生按钮仅允许特殊画布交互，业务按钮全部使用 Button/Tabs。
- 页面运行时横向溢出为0。
- 任一页面最多使用3级卡片层次，禁止卡片嵌套。
- 任一图表必须有标题、单位、轴/标签、图例或明确单系列说明。
- 375px宽度正文不小于12px，关键数据不小于16px。
- 颜色、字号、圆角、间距不得新增页面私有值。
