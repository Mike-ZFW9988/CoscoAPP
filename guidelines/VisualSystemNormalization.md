# Visual System Normalization

## Scenario

Mobile digital operations cockpit for senior leaders in a shipbuilding and heavy-industry enterprise. The interface must support dense first-screen scanning, stable executive decision-making, and consistent drill-down behavior.

## Design Direction

- Product type: mobile enterprise dashboard.
- Visual density: high, but not cramped.
- Motion: subtle only, used for state feedback.
- Style: data-dense dashboard with restrained brand-blue surfaces.
- Primary color: `#00508E`.

## Component Standards

### KPI Card

- Radius: `10px`.
- Border: brand-blue transparent border.
- Primary number: `20-22px`, bold, tabular numbers.
- Unit: `11px`, muted text.
- Label: `10px`, muted text.
- Padding: compact `8px`.

### Chart Panel

- Radius: `12px`.
- Header height: about `30px`.
- Chart body default height: `96px`.
- Chart title: `12px`, semibold.
- Unit/legend text: `9-10px`.
- Background: same token family as cards, no isolated gray blocks.

### Data Table Card

- Radius: `12px`.
- Row height: `34px`.
- Header row: subtle brand-blue fill.
- Divider: brand-blue low-opacity divider.
- Table text: `10px`, tabular where numeric.
- Long text: ellipsis instead of breaking layout.

### Risk List Item

- Row minimum height: `40px`.
- Severity stripe: 3px rounded vertical bar.
- Category: `9px`.
- Priority badge: unified `StatusBadge`.
- Main text: `12px / 16px`.

### Status Badge

- Height: `16px`.
- Radius: `4px`.
- Font size: `9px`, semibold.
- Tone set: primary, success, warning, danger, muted.

### Section Header

- Title: `13px`, bold.
- Decorative rule: only a small brand-blue vertical marker.
- Avoid heavy blocks or oversized headings inside compact dashboard surfaces.

## Implementation Notes

- Public primitives are located in `src/app/components/dashboard/DashboardPrimitives.tsx`.
- Visual tokens are centralized in `src/styles/theme.css`.
- Existing business data and page routing are unchanged.
- Table-like cards are normalized by shared table row and data table container rules.
- KPI, chart placeholder, risk list, badge, and section header rendering now use shared primitives.

## Backup

- Before this change: `backups/make2-before-visual-system-normalize-20260716-*.zip`
# Drill-down card titles

- All cards with a clickable detail action use the shared `app-detail-entry-card` contract.
- Use `--app-type-detail-card-title` (`14px`) with `19px` line height, matching the production repair ranking card.
- The complete inventory and exclusions are maintained in `DrilldownCardTitleSpec.md`.
