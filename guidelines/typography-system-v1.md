# 移动端驾驶舱字体层级规范 V1

## 目标

面向船舶重工企业高层领导的移动端驾驶舱，字体系统采用“数字优先、标题稳定、辅助信息弱化”的层级。页面应接近 C 端航旅 App 的清晰扫读体验，同时保留企业经营数据的稳重感。

## 全局 Token

字体族统一使用 `--app-font-family`，优先使用 `Inter + PingFang SC + Noto Sans SC + system-ui`。

| Token | 值 | 使用场景 |
|---|---:|---|
| `--app-type-brand-title` | 18px | 品牌标题 |
| `--app-type-page-title` | 18px | 页面主标题 |
| `--app-type-section-title` | 17px | 首页模块标题、卡片主标题 |
| `--app-type-card-title` | 16px | 图表/表格卡片标题 |
| `--app-type-body` | 15px | 重点正文 |
| `--app-type-body-sm` | 14px | 列表正文、业务名称 |
| `--app-type-meta` | 13px | 日期、辅助指标、操作入口 |
| `--app-type-caption` | 13px | 单位、图例、说明 |
| `--app-type-micro` | 12px | 极弱辅助信息、紧凑标签，不承载关键业务信息 |
| `--app-type-kpi-hero` | 42px | 首页年度目标主数字 |
| `--app-type-kpi-main` | 24px | 一级 KPI 数字 |
| `--app-type-kpi` | 20px | 卡片内 KPI 数字 |
| `--app-type-data` | 18px | 表格/列表重点数字 |
| `--app-type-unit` | 13px | KPI 单位 |

## 使用规则

1. 页面和模块标题使用 `--app-type-section-title`，字重使用 `--app-weight-title`。
2. KPI 数字只使用 `--app-type-kpi-hero`、`--app-type-kpi-main`、`--app-type-kpi`、`--app-type-data` 四档，避免随意新增 17px、19px、22px。
3. 正文使用 `#252A31`，次级正文使用 `#404854`，辅助说明使用 `#5B6470`；品牌蓝只用于交互、选中态和重点数字。
4. 单位和说明文字使用 `--app-type-caption` 或 `--app-type-meta`，不得使用低对比浅灰承载有效信息。
5. 状态标签使用 `--app-type-micro`，只表达状态，不抢数字焦点；绿色、橙色和红色仅用于小面积语义强调。
6. 图表轴线文字和表格辅助说明使用 `--app-type-caption`，表头使用 `--app-type-meta`。
7. 移动端需要阅读的业务文字不得低于 13px，紧凑布局通过减少重复文案和间距实现，不通过缩小字号实现。
