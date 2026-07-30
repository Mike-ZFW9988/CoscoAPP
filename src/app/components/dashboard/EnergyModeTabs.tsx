import { Anchor, Gauge, Ship, Wrench, type LucideIcon } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export type EnergyMode = "整体" | "造船" | "修船" | "海工";

type EnergyModeTabsProps = {
  value: EnergyMode;
  onValueChange: (value: EnergyMode) => void;
};

const modes: Array<{
  value: EnergyMode;
  label: string;
  icon: LucideIcon;
}> = [
  { value: "整体", label: "整体", icon: Gauge },
  { value: "造船", label: "造船", icon: Ship },
  { value: "修船", label: "修船", icon: Wrench },
  { value: "海工", label: "海工", icon: Anchor },
];

export function EnergyModeTabs({ value, onValueChange }: EnergyModeTabsProps) {
  const activeIndex = modes.findIndex((mode) => mode.value === value);

  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as EnergyMode)}
      className="energy-mode-tabs"
    >
      <TabsList
        aria-label="能源业务口径"
        data-active-index={activeIndex}
        className="energy-mode-tabs-list w-full rounded-full"
      >
        {modes.map(({ value: mode, label, icon: Icon }) => (
          <TabsTrigger
            key={mode}
            value={mode}
            data-slot="energy-tabs-trigger"
            className="energy-mode-tabs-trigger flex-1"
          >
            <Icon aria-hidden="true" />
            <strong>{label}</strong>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
