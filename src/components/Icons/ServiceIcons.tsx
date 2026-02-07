import React from "react";
import variablesLogo from "../../assets/variables_logo.png";
import dataverseLogo from "../../assets/dataverse_logo.png";
import sharepointLogo from "../../assets/sharepoint_logo.png";
import errorhandlingLogo from "../../assets/errorhandling_logo.png";
import outlookLogo from "../../assets/outlook_logo.png";
import office365Logo from "../../assets/office365_logo.png";
import excelLogo from "../../assets/excel_logo.png";

interface IconProps {
  size?: number;
  className?: string;
}

export const VariableIcon: React.FC<IconProps> = ({
  size = 20,
  className = "",
}) => {
  return (
    <img
      src={variablesLogo}
      alt="Variable"
      width={size}
      height={size}
      className={className}
    />
  );
};

export const DataverseIcon: React.FC<IconProps> = ({
  size = 20,
  className = "",
}) => {
  return (
    <img
      src={dataverseLogo}
      alt="Dataverse"
      width={size}
      height={size}
      className={className}
    />
  );
};

export const SharepointIcon: React.FC<IconProps> = ({
  size = 20,
  className = "",
}) => {
  return (
    <img
      src={sharepointLogo}
      alt="Sharepoint"
      width={size}
      height={size}
      className={className}
    />
  );
};

export const OutlookIcon: React.FC<IconProps> = ({
  size = 20,
  className = "",
}) => {
  return (
    <img
      src={outlookLogo}
      alt="Outlook"
      width={size}
      height={size}
      className={className}
    />
  );
};

export const Office365Icon: React.FC<IconProps> = ({
  size = 20,
  className = "",
}) => {
  return (
    <img
      src={office365Logo}
      alt="Office 365"
      width={size}
      height={size}
      className={className}
    />
  );
};

export const ErrorhandlingIcon: React.FC<IconProps> = ({
  size = 20,
  className = "",
}) => {
  return (
    <img
      src={errorhandlingLogo}
      alt="Error Handling"
      width={size}
      height={size}
      className={className}
    />
  );
};

export const ObjectIcon: React.FC<IconProps> = ({
  size = 20,
  className = "",
}) => {
  return (
    <img
      src={variablesLogo}
      alt="Object Variable"
      width={size}
      height={size}
      className={className}
    />
  );
};

export const ArrayIcon: React.FC<IconProps> = ({
  size = 20,
  className = "",
}) => {
  return (
    <img
      src={variablesLogo}
      alt="Array Icon"
      width={size}
      height={size}
      className={className}
    />
  );
};

export const ExcelIcon: React.FC<IconProps> = ({
  size = 20,
  className = "",
}) => {
  return (
    <img
      src={excelLogo}
      alt="Excel Icon"
      width={size}
      height={size}
      className={className}
    />
  );
};
