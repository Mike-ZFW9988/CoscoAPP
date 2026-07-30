# Consumer App Dashboard Visual Language

## Design Read

This product is a mobile enterprise operations cockpit for senior shipbuilding and heavy-industry leaders. It should keep enterprise trust and data density, while borrowing the polish of mature consumer apps: soft surfaces, unified title icons, clear touch entries, and calm visual hierarchy.

## Visual Principles

- Use restrained brand blue as the system accent, not as decoration everywhere.
- Use a soft light-blue app background instead of hard gray page blocks.
- Use white cards with subtle blue-tinted borders and soft shadows.
- Every business card title should use the same title structure: icon capsule, title, optional status badge, optional entry action.
- Avoid mixed title treatments. A card title without an icon should be considered a drift unless it is a purely decorative or legacy Figma import block.
- Use a single icon family for dashboard card titles and actions.
- Keep data compact, but make the hierarchy feel like a polished mobile app, not a backend table.

## Component Rules

### Page Sections

- Background: vertical soft blue app surface.
- Module spacing: compact, but card boundaries should be visually clear.
- Avoid heavy hard dividers between sections.

### Card Header

- Height: about 38px.
- Left: 24px title icon capsule.
- Middle: 13px semibold title.
- Right: status badge or entry button.
- Header background: subtle left-to-right light-blue tint.

### Title Icon

- Size: 24px container, 14px line icon.
- Radius: 9px.
- Stroke: 2px.
- Color: brand primary.
- One family: lucide-react.

### Cards

- Radius: 14px.
- Border: low-opacity brand blue.
- Shadow: soft blue-tinted mobile app shadow.
- Avoid nested card effects.

### Tables

- Row height: 34px.
- Header row: light brand-blue tint.
- Divider: low-opacity brand-blue line.
- Long content uses ellipsis to protect mobile layout.

### Charts

- Container uses the same card surface family.
- Chart body uses soft blue-tinted visual field, not dashed placeholder gray.
- Units, legends, axis text should remain 9-10px.

### Click Entries

- Use unified pill entry button or full-row tap with chevron.
- Press feedback should change background or elevation without layout jitter.
- Do not invent different entry styles page by page.

## Files

- Component primitives: `src/app/components/dashboard/DashboardPrimitives.tsx`
- Global visual tokens: `src/styles/theme.css`
- Card title icon mapping: `src/app/App.tsx`
