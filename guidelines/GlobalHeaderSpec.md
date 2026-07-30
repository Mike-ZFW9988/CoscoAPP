# 全局头部组件规范

## 使用范围

全站所有业务页面、主题页、详情页、列表页、报表页统一复用 `GlobalHeader`，不得在页面内重新编写品牌头部结构。

当前代码入口：

```tsx
import { GlobalHeader } from "./components/GlobalHeader";

<GlobalHeader dateLabel="2026年8月8日" />
```

兼容层：

```tsx
function NavBar({ dateBadge }: NavBarProps) {
  return <GlobalHeader dateLabel={dateBadge ?? DEFAULT_GLOBAL_DATE} />;
}
```

## 结构标准

- 系统状态栏：由页面保留现有 `StatusBar`，紧贴全局头部，形成一体化白色顶部区域。
- 品牌区：左上固定显示 COSCO Shipping + `重工数字化运营平台` 官方图片资产，不允许拉伸、裁切、换色。
- 日期筛选：左下固定显示日历图标、日期文案、下拉箭头，默认文案为 `2026年8月8日`。
- 用户信息：右侧固定显示 `小重 / Xiao Zhong` 信息卡片。
- IP 形象：右侧固定显示熊猫形象，不随页面切换隐藏或替换。

## 尺寸与位置

- 头部高度：`112px`，由 `.brand-nav.brand-nav-home` 统一控制。
- Logo：宽 `258px`，按 `759 / 200` 原始比例等比渲染。
- Logo 位置：`left: -26px; top: -10px`。
- 日期筛选点击热区：`44px` 高，满足移动端触控要求。
- 日期胶囊：高 `36px`，圆角 `14px`，内边距 `0 14px`。
- 用户卡片：`76px × 38px`，圆角 `16px`。
- 熊猫形象：`88px × 110px`，右侧 `2px`，底部 `0px`。

## 视觉标准

- 主色：`#00508E`。
- 深品牌色：`#00345F`。
- 头部背景：渐变必须由手机画布最外层 `.app-phone-screen` 承载，从手机安全区最底部自然接入，极浅近白蓝 `#F8FBFF` 向下缓慢过渡到低饱和浅品牌蓝 `#E9F2FC`，并延伸到首页订单 KPI 卡片底部，不允许状态栏、品牌导航或 KPI 容器各自重新起独立渐变。
- 手机画布背景：`linear-gradient(180deg, #F8FBFF 0%, #F3F8FE 12%, #EEF5FC 25%, #E9F2FC 38%, #F5F5F5 56%, #F5F5F5 100%)`。
- 首页 KPI 承接背景：`linear-gradient(180deg, #E9F2FC 0%, #EDF5FC 34%, #F5F5F5 86%)`。
- 状态栏背景：`transparent`。
- 品牌导航背景：`transparent`。
- 日期胶囊背景：`rgba(238,245,252,0.62)`，需与头部渐变融合，不做独立白色块。
- 用户信息卡片背景：`rgba(238,245,252,0.52)`，保持轻透明玻璃感。
- 边框：统一使用浅灰蓝 `rgba(191,219,238,0.28~0.32)`。
- 阴影：只允许轻量蓝灰阴影，避免厚重投影影响首屏数据密度。

## 交互标准

- 日期筛选器必须使用语义化 `button`。
- 点击区域不得小于 `44px`。
- 日期筛选作为全局时间入口，各页面共享同一日期来源。
- 子页面不得使用自定义小导航栏替代全局头部。

## 维护规则

- 全局头部只允许在 `src/app/components/GlobalHeader.tsx` 中维护。
- 页面调用层继续使用 `NavBar` 或直接使用 `GlobalHeader` 均可，但不得复制内部 JSX。
- 修改 Logo、日期、用户卡片、熊猫位置时，需要同步更新本规范。
