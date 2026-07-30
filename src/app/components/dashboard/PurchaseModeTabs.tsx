import { ClipboardList, PackageCheck, ShieldCheck, type LucideIcon } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

export type PurchaseMode = "management" | "steel" | "supplier";

type PurchaseModeTabsProps = {
  value: PurchaseMode;
  onValueChange: (value: PurchaseMode) => void;
};

const modes: Array<{
  value: PurchaseMode;
  label: string;
  icon: LucideIcon;
}> = [
  { value: "management", label: "采购管理", icon: ClipboardList },
  { value: "steel", label: "钢材采购", icon: PackageCheck },
  { value: "supplier", label: "供应商管理", icon: ShieldCheck },
];

export function PurchaseModeTabs({ value, onValueChange }: PurchaseModeTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue as PurchaseMode)}
      className="purchase-mode-tabs"
    >
      <TabsList aria-label="采购主题业务导航" className="purchase-mode-nav">
        {modes.map(({ value: mode, label, icon: Icon }) => (
          <TabsTrigger
            key={mode}
            value={mode}
            data-slot="purchase-mode-trigger"
            className="purchase-mode-trigger"
          >
            <Icon aria-hidden="true" />
            <strong>{label}</strong>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
