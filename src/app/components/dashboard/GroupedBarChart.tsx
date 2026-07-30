import { useState } from "react";

export type GroupedBarDatum = {
  label: string;
  primary: number;
  secondary: number;
};

export function GroupedBarChart({
  data,
  primaryLabel,
  secondaryLabel,
  unit,
  primaryColor = "#00508E",
  secondaryColor = "#67C23A",
  valueSuffix = "",
  goodWhen = "gte",
}: {
  data: GroupedBarDatum[];
  primaryLabel: string;
  secondaryLabel: string;
  unit: string;
  primaryColor?: string;
  secondaryColor?: string;
  valueSuffix?: string;
  goodWhen?: "gte" | "lte";
}) {
  const [selected, setSelected] = useState(0);
  const maxValue = Math.max(1, ...data.flatMap((item) => [item.primary, item.secondary]));
  const yMax = Math.ceil(maxValue / 50) * 50;
  const ticks = Array.from({ length: 6 }, (_, index) => yMax / 5 * index);
  const width = Math.max(360, 48 + data.length * 74);
  const height = 188;
  const pad = { left: 38, right: 10, top: 24, bottom: 38 };
  const plotWidth = width - pad.left - pad.right;
  const plotHeight = height - pad.top - pad.bottom;
  const groupWidth = plotWidth / data.length;
  const barWidth = 13;
  const barGap = 4;
  const y = (value: number) => pad.top + plotHeight - value / yMax * plotHeight;
  const active = data[selected];
  const isGood = goodWhen === "gte" ? active.primary >= active.secondary : active.primary <= active.secondary;

  return (
    <div className="app-grouped-chart">
      <div className="app-grouped-chart-legend">
        <span><i style={{ background: primaryColor }} />{primaryLabel}</span>
        <span><i style={{ background: secondaryColor }} />{secondaryLabel}</span>
      </div>
      <div className="app-grouped-chart-scroll">
        <svg viewBox={`0 0 ${width} ${height}`} style={{ width, height }} aria-label={`${primaryLabel}与${secondaryLabel}双柱图`}>
          <text x={pad.left} y={10} fontSize="9" fill="var(--app-text-secondary)">单位：{unit}</text>
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={pad.left} y1={y(tick)} x2={width-pad.right} y2={y(tick)} stroke="var(--app-divider)" strokeWidth="1" />
              <text x={pad.left-7} y={y(tick)+3} textAnchor="end" fontSize="9" fill="var(--app-text-secondary)">{Number.isInteger(tick) ? tick : tick.toFixed(1)}</text>
            </g>
          ))}
          {data.map((item, index) => {
            const center = pad.left + groupWidth * index + groupWidth / 2;
            const isActive = selected === index;
            return (
              <g key={item.label} role="button" tabIndex={0} className={isActive ? "is-active" : ""} onClick={() => setSelected(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelected(index); }}>
                {isActive && <rect x={center-groupWidth/2+3} y={pad.top-6} width={groupWidth-6} height={plotHeight+12} rx="8" fill="var(--app-primary-soft)" opacity="0.48" />}
                <rect x={center-barWidth-barGap/2} y={y(item.primary)} width={barWidth} height={pad.top+plotHeight-y(item.primary)} rx="3" fill={primaryColor} />
                <rect x={center+barGap/2} y={y(item.secondary)} width={barWidth} height={pad.top+plotHeight-y(item.secondary)} rx="3" fill={secondaryColor} opacity="0.78" />
                <text x={center-barWidth/2-barGap/2} y={y(item.primary)-5} textAnchor="middle" fontSize="9" fontWeight="650" fill={primaryColor}>{item.primary}</text>
                <text x={center} y={height-pad.bottom+16} textAnchor="middle" fontSize="10" fontWeight="550" fill="var(--app-text-regular)">{item.label}</text>
              </g>
            );
          })}
          <line x1={pad.left} y1={pad.top} x2={pad.left} y2={pad.top+plotHeight} stroke="var(--app-border)" />
          <line x1={pad.left} y1={pad.top+plotHeight} x2={width-pad.right} y2={pad.top+plotHeight} stroke="var(--app-border)" />
        </svg>
      </div>
      <div className="app-grouped-chart-detail">
        <strong>{active.label}</strong>
        <span>{primaryLabel} <b style={{ color: primaryColor }}>{active.primary}{valueSuffix}</b></span>
        <span>{secondaryLabel} <b style={{ color: secondaryColor }}>{active.secondary}{valueSuffix}</b></span>
        <em className={isGood ? "is-good" : "is-warning"}>{isGood ? "达标" : "待提升"}</em>
      </div>
    </div>
  );
}
