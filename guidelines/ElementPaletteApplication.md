# Element Palette Application V1.1

This project uses the Element Plus palette as the single global color source for the mobile operations cockpit.

## Core Tokens

- Primary: `#00508E` for brand, primary actions, selected tabs, key KPI numbers, and major chart emphasis.
- Primary tint: `#79BBFF`, `#9FCEFF`, `#C6E2FF`, `#D9ECFF`, `#ECF5FF` for chart secondary series, icon surfaces, selected backgrounds, and soft header fills.
- Success: `#67C23A` with `#F0F9EB` for normal, completed, healthy, and positive operating states.
- Warning: `#E6A23C` with `#FCF6EC` for pending, overdue warning, and attention states.
- Error: `#F56C6C` with `#FEF0F0` for high-risk, failure, blocking, and exception states.
- Info/neutral: `#909399` with `#F4F4F5` for secondary status, disabled-light status, and low-emphasis metadata.
- Text: `#303133`, `#606266`, `#909399`, `#A8ABB2`, `#C0C4CC`.
- Border: `#DCDFE6`, `#E4E7ED`, `#EBEEF5`, `#F2F5FC`.
- Fill/background: `#F2F3F5`, `#F5F7FA`, `#FAFAFA`, `#FFFFFF`.

## Component Mapping

- Buttons: primary buttons use `--app-primary`; ghost/secondary buttons use `--app-primary-soft` with `--app-primary` text.
- Cards and KPI cards: card background uses `--card`; borders use `--app-border-lighter`; soft surfaces use `--app-fill-light`.
- Page background: use `--background`; header gradients may use `--app-primary-200` to `--background`.
- Titles and main values: use `--foreground`; supporting copy uses `--app-ink-muted`; captions use `--muted-foreground`.
- Charts: use `--chart-1` to `--chart-8` only; avoid ad-hoc blue, green, orange, purple values.
- Tables: headers use `--app-fill-light`; row dividers use `--app-border-lighter`; empty/error states use semantic soft tokens.
- Risk lists and status badges: use `--app-danger`, `--app-warning`, `--app-success`, `--app-info` with matching soft backgrounds.

## Status labels

- Use the triplet tokens defined in `StatusLabelSpec.md`: semantic text, border, and background must come from the same hue family.
- Blue communicates information or classification; green communicates healthy completion; orange communicates attention; red communicates risk or failure.
- Neutral gray is reserved for non-semantic metadata and must not replace a business status color.
- All product pages must render status labels through the shared `StatusBadge` component.

## Guardrails

- Do not introduce new hardcoded semantic colors in page files.
- Prefer CSS variables from `src/styles/theme.css` over Tailwind generic color classes such as `green-50`, `amber-700`, or `slate-900`.
- Black should not be used for interface text; use the neutral text ladder instead.
- Brand blue is for leadership focus and action priority, not for every decorative element.
