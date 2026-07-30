# shadcn/ui 组件一致性审查与优化记录

## 场景

船舶重工企业领导使用的移动端数字化运营驾驶舱。界面需要保持高密度数据浏览效率，同时保证按钮、卡片、标签、分段控件、表格与状态组件的视觉语言统一。

## 本轮已优化

- Button：保留全站 `entry-button` 胶囊形态，但颜色与阴影改为设计 token：`--app-primary`、`--app-primary-hover`、`--primary-foreground`、`--app-shadow-brand`。
- Button 高度：取消 `.app-phone-screen button` 对所有按钮强制 `44px` 的视觉高度，改为按 shadcn `size` 分层控制；普通按钮 `40px`，小按钮/进入按钮 `32px`，图标按钮保持 `44px` 触控尺寸。
- Button 标识：`Button` 组件增加 `data-size` 与 `data-variant`，方便全局 CSS 按层级稳定治理。
- Card：公共 `Card` 包装器已改为 shadcn composition：`Card` + `CardHeader` + `CardTitle` + `CardAction` + `CardContent`。
- Badge / Tag：公共卡片标题内标签继续使用 shadcn `Badge`，统一小字号、胶囊形态与 secondary 语义层级。
- Tabs：公共 `TabCtrl` 已改为 `Tabs` + `TabsList` + `TabsTrigger`，避免手写 tab 结构；视觉高度控制在 `30-32px`。
- Segmented Control：公共 `SegCtrl` 已改为 `ToggleGroup` + `ToggleGroupItem`，用于 2-5 个选项的轻量切换形态；视觉高度控制在 `30-32px`。
- Date Filter：日期筛选仍作为全局头部组件内的语义化 `button`，保持 44px 触控目标。

## 审查结论

- 全站已经具备 shadcn/ui 基础组件库：Button、Card、Badge、Tabs、Dialog、Sheet、Popover、Table、Skeleton、Alert 等均已存在。
- 当前业务页面仍存在大量 inline style 卡片、列表、图表说明与状态标签，这是原型阶段常见形态；后续应优先把重复出现的业务卡片沉淀为公共组件，而不是逐页复制样式。
- 弹层类组件后续必须保证 `DialogTitle` / `SheetTitle` 存在，视觉隐藏也应使用 `sr-only`，避免可访问性缺失。
- 空状态后续应优先使用 `Empty` 或统一空状态组件；若项目未安装 Empty，应先通过 shadcn registry 引入或沉淀本地 `EmptyState`。
- 表格与数据列表应优先使用 `Table`、`Badge`、`Skeleton`、`Alert` 组合，避免手写大量无语义 `div`。

## 后续执行边界

- 不修改业务数据。
- 不改变页面信息架构。
- 不新增重型视觉风格。
- 新增或重构组件时，优先复用 shadcn 已安装组件。
- 需要更新 shadcn upstream 组件时，必须先使用 `--dry-run` 和 `--diff` 检查，不直接覆盖本地组件。
