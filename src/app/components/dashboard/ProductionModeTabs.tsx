import { Ship, Wrench, type LucideIcon } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export type ProductionMode = "ship" | "repair";

type ProductionModeTabsProps = {
  value: ProductionMode;
  onValueChange: (value: ProductionMode) => void;
};

const modes: Array<{ value: ProductionMode; label: string; icon: LucideIcon }> = [
  { value: "repair", label: "修船", icon: Wrench },
  { value: "ship", label: "新造", icon: Ship },
];

export function ProductionModeTabs({ value, onValueChange }: ProductionModeTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as ProductionMode)}
      className="production-mode-tabs"
    >
      <TabsList aria-label="生产主题业务导航" className="production-mode-nav">
        {modes.map(({ value: mode, label, icon: Icon }) => (
          <TabsTrigger
            key={mode}
            value={mode}
            data-slot="production-mode-trigger"
            className="production-mode-trigger"
          >
            <Icon aria-hidden="true" />
            <strong>{label}</strong>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
