# KPI Density Compact Spec

## Purpose

This mobile cockpit is used by senior leaders to scan company operations quickly. KPI cards should show more first-screen information without becoming crowded.

## Current Compact Standard

- Public card spacing: section cards use a tighter `mb-2.5` rhythm, compact headers, and `px-3.5 py-2.5` content padding.
- KPI hero card: the annual order target card keeps the visual shipbuilding illustration, but uses a lower card height, smaller hero number, and shorter progress bar.
- Horizontal KPI cards: shipbuilding and repair summary cards use smaller icon boxes, tighter grid padding, and 22px key figures.
- Metric pairs: use 18px key figures, `p-2` padding, and compact target text.
- Scroll KPI cards: use 102px card width, smaller icons, and reduced vertical padding.
- Charts: default chart placeholder height is 96px to keep trend information visible without dominating the viewport.
- Lists and tables: alert rows, matrix rows, and table rows use compact vertical padding while keeping text line height readable.

## Design Rules

- Do not reduce KPI text below 18px for primary numbers.
- Keep secondary labels at 9-11px with clear color contrast.
- Prefer reducing empty padding before reducing content size.
- Keep row hit areas readable; compact list rows should not feel like dense desktop tables.
- Preserve business data and page logic when tuning density.

## Backup

- Before this change: `backups/make2-before-kpi-density-compact-20260716-220058.zip`
