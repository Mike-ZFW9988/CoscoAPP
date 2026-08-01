import { useEffect, useRef, useState } from "react";
import { cn } from "./ui/utils";

const DEFAULT_GLOBAL_DATE = "2026年8月";
const GLOBAL_MONTH_OPTIONS = Array.from({ length: 8 }, (_, index) => `2026年${index + 1}月`);
const GLOBAL_MONTH_STORAGE_KEY = "cosco-dashboard-global-month";

function normalizeMonthLabel(label: string) {
  const match = label.match(/^(\d{4})年(\d{1,2})月/);
  return match ? `${match[1]}年${Number(match[2])}月` : DEFAULT_GLOBAL_DATE;
}

type GlobalHeaderProps = {
  dateLabel?: string;
  pageTitle?: string;
  pageSubtitle?: string;
  onBack?: () => void;
  badgeMode?: "date" | "freshness";
  badgeExpanded?: boolean;
  onBadgeClick?: () => void;
};

function GlobalHeader({
  dateLabel = DEFAULT_GLOBAL_DATE,
  pageTitle,
  pageSubtitle,
  onBack,
  badgeMode = "date",
  badgeExpanded = false,
  onBadgeClick,
}: GlobalHeaderProps) {
  const hasPageChrome = Boolean(pageTitle && onBack);
  const isFreshnessBadge = badgeMode === "freshness";
  const monthPickerRef = useRef<HTMLDivElement | null>(null);
  const monthTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    if (typeof window === "undefined") return normalizeMonthLabel(dateLabel);
    const savedMonth = window.sessionStorage.getItem(GLOBAL_MONTH_STORAGE_KEY);
    return savedMonth && GLOBAL_MONTH_OPTIONS.includes(savedMonth) ? savedMonth : normalizeMonthLabel(dateLabel);
  });
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);

  useEffect(() => {
    if (!isFreshnessBadge && !GLOBAL_MONTH_OPTIONS.includes(selectedMonth)) {
      setSelectedMonth(normalizeMonthLabel(dateLabel));
    }
  }, [dateLabel, isFreshnessBadge, selectedMonth]);

  useEffect(() => {
    if (!monthPickerOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!monthPickerRef.current?.contains(event.target as Node)) setMonthPickerOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMonthPickerOpen(false);
        monthTriggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [monthPickerOpen]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setMonthPickerOpen(false);
    window.sessionStorage.setItem(GLOBAL_MONTH_STORAGE_KEY, month);
    window.dispatchEvent(new CustomEvent("global-month-change", { detail: month }));
    requestAnimationFrame(() => monthTriggerRef.current?.focus());
  };

  const focusMonthOption = (month: string) => {
    requestAnimationFrame(() => {
      monthPickerRef.current?.querySelector<HTMLButtonElement>(`[data-month="${month}"]`)?.focus();
    });
  };

  const handleMonthTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    setMonthPickerOpen(true);
    focusMonthOption(selectedMonth);
  };

  const handleMonthOptionKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const step = event.key === "ArrowDown" ? 4 : event.key === "ArrowUp" ? -4 : event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = Math.max(0, Math.min(GLOBAL_MONTH_OPTIONS.length - 1, index + step));
    focusMonthOption(GLOBAL_MONTH_OPTIONS[nextIndex]);
  };
  return (
    <header
      className={cn("brand-nav brand-nav-home shrink-0 relative overflow-visible", hasPageChrome && "brand-nav-page", monthPickerOpen && "month-picker-open")}
      style={{
        background: "transparent",
        borderBottom: "none",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-full pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(248,251,255,0.10) 0%, rgba(238,245,252,0.16) 58%, rgba(233,242,252,0.20) 100%)",
        }}
      />
      <div
        className="absolute right-0 top-[8px] w-[138px] h-[74px] pointer-events-none"
        style={{
          background: "linear-gradient(180deg, rgba(233,242,252,0.16) 0%, rgba(233,242,252,0.00) 100%)",
          clipPath: "polygon(0 100%, 18% 42%, 32% 72%, 50% 24%, 66% 70%, 82% 34%, 100% 100%)",
          opacity: 0.22,
        }}
      />
      <div
        className="absolute left-3 right-3 bottom-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, rgba(0,80,142,0), rgba(0,80,142,0.00), rgba(0,80,142,0))" }}
      />

      {hasPageChrome && (
        <div className="brand-page-chrome">
          <button type="button" className="brand-page-back" aria-label="Back" onClick={onBack}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M9.75 3.5L5.25 8l4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="brand-page-copy">
            <div className="brand-page-title">{pageTitle}</div>
            {pageSubtitle && <div className="brand-page-subtitle">{pageSubtitle}</div>}
          </div>
        </div>
      )}

      <div
        className="absolute right-[58px] top-[44px] w-[76px] h-[38px] rounded-2xl pointer-events-none"
        style={{
          background: "rgba(238,245,252,0.52)",
          border: "1px solid rgba(191,219,238,0.28)",
          boxShadow: "0 8px 22px rgba(18,58,99,0.035)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, color: "#00508E", lineHeight: "18px", padding: "7px 0 0 10px" }}>小重</div>
        <div style={{ fontSize: 8, fontWeight: 600, color: "rgba(47,64,83,0.48)", lineHeight: "10px", paddingLeft: 10 }}>Xiao Zhong</div>
      </div>

      <img
        src="/assets/brand/mascot.png"
        alt=""
        aria-hidden="true"
        className="absolute object-contain pointer-events-none select-none right-[2px] bottom-[0px] w-[88px] h-[110px]"
        style={{ filter: "drop-shadow(0 10px 18px rgba(0,52,95,0.16))" }}
      />

      <div className={cn("relative h-full px-3 flex items-center pr-[92px] py-2")}>
        <div className="w-full h-full relative">
          <div className={cn("absolute left-[-26px] min-w-0", hasPageChrome ? "top-[17px]" : "top-[-10px]")}>
            <div className="h-[60px] w-[258px] max-w-none flex items-center overflow-visible">
              <img
                src="/assets/brand/platform-logo.png"
                alt="重工数字化运营平台"
                className="block object-contain select-none"
                style={{ width: 258, height: "auto", aspectRatio: "759 / 200" }}
                draggable={false}
              />
            </div>
          </div>

          <div className={cn("absolute left-[4px]", hasPageChrome ? "bottom-[-11px]" : "bottom-[8px]")}>
            {isFreshnessBadge ? (
              <button
                type="button"
                aria-label="查看数据更新时间说明"
                aria-haspopup="dialog"
                aria-expanded={badgeExpanded}
                onClick={onBadgeClick}
                className="inline-flex items-center justify-start border-none cursor-pointer p-0"
                style={{ minHeight: 44, height: 44, background: "transparent", color: "#00508E" }}
              >
              <span
                className="whitespace-nowrap"
                style={{
                  maxWidth: 172,
                  height: 36,
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0 14px",
                  borderRadius: 14,
                  background: "rgba(238,245,252,0.62)",
                  color: "#2F4053",
                  fontSize: 12,
                  lineHeight: "16px",
                  fontWeight: 700,
                  boxShadow: "0 8px 20px rgba(18,58,99,0.04), inset 0 0 0 1px rgba(191,219,238,0.32)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginRight: 8, flexShrink: 0, color: "#00508E" }}>
                  {isFreshnessBadge ? (
                    <>
                      <circle cx="8" cy="8" r="5.75" stroke="currentColor" strokeWidth="1.4" opacity="0.72" />
                      <path d="M8 4.75v3.4l2.25 1.35" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </>
                  ) : (
                    <>
                      <rect x="2.25" y="3.5" width="11.5" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" opacity="0.72"/>
                      <path d="M5 2.25v2.5M11 2.25v2.5M2.75 6.5h10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.72"/>
                    </>
                  )}
                </svg>
                {dateLabel}
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 8, flexShrink: 0, color: "#6F7F90" }}>
                  {isFreshnessBadge ? (
                    <>
                      <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.1" opacity="0.65" />
                      <path d="M5 4.5v2.2M5 3.1v.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </>
                  ) : (
                    <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                  )}
                </svg>
              </span>
              </button>
            ) : (
              <div className="global-month-select-wrap" ref={monthPickerRef}>
                <button
                  ref={monthTriggerRef}
                  type="button"
                  className={cn("global-month-select-shell", monthPickerOpen && "is-open")}
                  aria-label={`月份筛选，当前${selectedMonth}`}
                  aria-haspopup="listbox"
                  aria-expanded={monthPickerOpen}
                  onClick={() => setMonthPickerOpen((open) => !open)}
                  onKeyDown={handleMonthTriggerKeyDown}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <rect x="2.25" y="3.5" width="11.5" height="10" rx="2" stroke="currentColor" strokeWidth="1.4" opacity="0.72"/>
                    <path d="M5 2.25v2.5M11 2.25v2.5M2.75 6.5h10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity="0.72"/>
                  </svg>
                  <span>{selectedMonth}</span>
                  <svg className="global-month-chevron" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M2.5 3.75L5 6.25L7.5 3.75" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                  </svg>
                </button>
                {monthPickerOpen && (
                  <div className="global-month-popover" role="listbox" aria-label="选择月份">
                    <div className="global-month-popover-head">
                      <span>选择月份</span>
                      <strong>2026年</strong>
                    </div>
                    <div className="global-month-option-grid">
                      {GLOBAL_MONTH_OPTIONS.map((month, index) => (
                        <button
                          key={month}
                          type="button"
                          role="option"
                          aria-selected={selectedMonth === month}
                          className={cn("global-month-option", selectedMonth === month && "is-selected")}
                          data-month={month}
                          onClick={() => handleMonthChange(month)}
                          onKeyDown={(event) => handleMonthOptionKeyDown(event, index)}
                        >
                          {index + 1}月
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export { GlobalHeader, DEFAULT_GLOBAL_DATE };
