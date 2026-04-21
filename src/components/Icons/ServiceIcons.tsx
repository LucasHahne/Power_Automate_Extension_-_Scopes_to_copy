import variablesLogo from "../../assets/variables_logo.png";
import dataverseLogo from "../../assets/dataverse_logo.png";
import sharepointLogo from "../../assets/sharepoint_logo.png";
import errorhandlingLogo from "../../assets/errorhandling_logo.png";
import outlookLogo from "../../assets/outlook_logo.png";
import office365Logo from "../../assets/office365_logo.png";
import excelLogo from "../../assets/excel_logo.png";

export interface IconProps {
  size?: number;
  className?: string;
}

export function VariableIcon({ size = 20, className = "" }: IconProps) {
  return (
    <img
      src={variablesLogo}
      alt="Variable"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function DataverseIcon({ size = 20, className = "" }: IconProps) {
  return (
    <img
      src={dataverseLogo}
      alt="Dataverse"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function SharepointIcon({ size = 20, className = "" }: IconProps) {
  return (
    <img
      src={sharepointLogo}
      alt="Sharepoint"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function OutlookIcon({ size = 20, className = "" }: IconProps) {
  return (
    <img
      src={outlookLogo}
      alt="Outlook"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function Office365Icon({ size = 20, className = "" }: IconProps) {
  return (
    <img
      src={office365Logo}
      alt="Office 365"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function ErrorhandlingIcon({ size = 20, className = "" }: IconProps) {
  return (
    <img
      src={errorhandlingLogo}
      alt="Error Handling"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function ObjectIcon({ size = 20, className = "" }: IconProps) {
  return (
    <img
      src={variablesLogo}
      alt="Object Variable"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function ArrayIcon({ size = 20, className = "" }: IconProps) {
  return (
    <img
      src={variablesLogo}
      alt="Array Icon"
      width={size}
      height={size}
      className={className}
    />
  );
}

export function ExcelIcon({ size = 20, className = "" }: IconProps) {
  return (
    <img
      src={excelLogo}
      alt="Excel Icon"
      width={size}
      height={size}
      className={className}
    />
  );
}
