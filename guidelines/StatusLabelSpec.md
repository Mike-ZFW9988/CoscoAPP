# Status Label Specification V1.0

全站状态标签统一使用“同色文字 + 同色浅背景 + 同色浅边框”，保证移动端快速识别，同时避免大面积高饱和色干扰业务数据。

## Semantic mapping

| Tone | Meaning | Text | Border | Background |
| --- | --- | --- | --- | --- |
| Blue | 信息、处理中、业务分类、普通提示 | `--app-tag-blue-text` | `--app-tag-blue-border` | `--app-tag-blue-bg` |
| Green | 正常、完成、达成、按期 | `--app-tag-green-text` | `--app-tag-green-border` | `--app-tag-green-bg` |
| Orange | 预警、待处理、关注、低于计划 | `--app-tag-orange-text` | `--app-tag-orange-border` | `--app-tag-orange-bg` |
| Red | 高风险、失败、阻断、严重逾期 | `--app-tag-red-text` | `--app-tag-red-border` | `--app-tag-red-bg` |
| Neutral | 无业务语义的编码、只读元信息 | `--app-tag-neutral-text` | `--app-tag-neutral-border` | `--app-tag-neutral-bg` |

## Component contract

- 统一使用 `StatusBadge`，业务页面不得自行组合文字色、背景色和边框色。
- `primary` / `info` 映射蓝色，`success` 映射绿色，`warning` 映射橙色，`danger` 映射红色。
- 高度 `20px`，字号 `11px`，字重 `650`，水平内边距 `7px`，圆角 `6px`。
- 标签不使用阴影，不使用渐变，不使用纯色大面积背景。
- 标签文案必须包含状态含义，颜色不能成为唯一的信息载体。
- 灰色仅用于编号、币种代码等中性元信息，不用于“正常、预警、风险”等业务状态。

## Examples

```tsx
<StatusBadge tone="info">在建</StatusBadge>
<StatusBadge tone="success">达成</StatusBadge>
<StatusBadge tone="warning">待关注</StatusBadge>
<StatusBadge tone="danger">高优先级</StatusBadge>
```
