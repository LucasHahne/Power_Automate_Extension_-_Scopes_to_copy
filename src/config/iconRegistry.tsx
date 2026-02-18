import React from "react";
import {
  DataverseIcon,
  ErrorhandlingIcon,
  Office365Icon,
  OutlookIcon,
  SharepointIcon,
  VariableIcon,
  ExcelIcon,
} from "../components/Icons/ServiceIcons";

export type IconKey =
  | "Variable"
  | "Errorhandling"
  | "Sharepoint"
  | "Excel"
  | "Dataverse"
  | "Outlook"
  | "Office365";

const iconMap: Record<IconKey, React.FC<{ size?: number; className?: string }>> = {
  Variable: VariableIcon,
  Errorhandling: ErrorhandlingIcon,
  Sharepoint: SharepointIcon,
  Excel: ExcelIcon,
  Dataverse: DataverseIcon,
  Outlook: OutlookIcon,
  Office365: Office365Icon,
};

export function getIcon(key: IconKey): React.ReactNode {
  const IconComponent = iconMap[key];
  if (!IconComponent) return null;
  return <IconComponent />;
}

export function hasIcon(key: string): key is IconKey {
  return key in iconMap;
}
