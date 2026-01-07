import {
  DataverseIcon,
  ErrorhandlingIcon,
  Office365Icon,
  OutlookIcon,
  SharepointIcon,
  VariableIcon,
} from "../components/IconComponent/ListIcons";
import type { SnippetCategory } from "../types";

// Import JSON files
import booleanJson from "./variables/boolean.json";
import integerJson from "./variables/integer.json";
import floatJson from "./variables/float.json";
import stringJson from "./variables/string.json";
import objectJson from "./variables/object.json";
import arrayJson from "./variables/array.json";
import basicErrorJson from "./errorhandling/basic_error_handling.json";
import errorMailJson from "./errorhandling/basic_error_handling_mail.json";
import requestManagerApprovalJson from "./sharepoint/requestManagerApproval.json";

export const availableSnippets: SnippetCategory[] = [
  {
    title: "Variables",
    gradient: "from-violet-800 to-purple-400",
    items: [
      {
        id: "variables-1",
        name: "Boolean variable (Initialize)",
        icon: <VariableIcon />,
        jsonData: booleanJson,
      },
      {
        id: "variables-2",
        name: "Integer variable (Initialize)",
        icon: <VariableIcon />,
        jsonData: integerJson,
      },
      {
        id: "variables-4",
        name: "Float variable (Initialize)",
        icon: <VariableIcon />,
        jsonData: floatJson,
      },
      {
        id: "variables-5",
        name: "String variable (Initialize)",
        icon: <VariableIcon />,
        jsonData: stringJson,
      },
      {
        id: "variables-6",
        name: "Object variable (Initialize)",
        icon: <VariableIcon />,
        jsonData: objectJson,
      },
      {
        id: "variables-7",
        name: "Array variable (Initialize)",
        icon: <VariableIcon />,
        jsonData: arrayJson,
      },
    ],
  },
  {
    title: "Error Handling",
    gradient: "from-red-600 to-amber-600",
    items: [
      {
        id: "error-1",
        name: "Basic Error Handler",
        icon: <ErrorhandlingIcon />,
        jsonData: basicErrorJson,
      },
      {
        id: "error-2",
        name: "Basic Error Handler with mail",
        icon: <ErrorhandlingIcon />,
        jsonData: errorMailJson,
      },
    ],
  },
  {
    title: "Sharepoint",
    gradient: "from-teal-800 to-cyan-400",
    items: [
      {
        id: "sharepoint-1",
        name: "Request Manager Approval",
        icon: <SharepointIcon />,
        jsonData: requestManagerApprovalJson,
      },
    ],
  },
  {
    title: "Dataverse",
    gradient: "from-green-800 to-lime-400",
    items: [
      {
        id: "dataverse-1",
        name: "This could be your flow",
        icon: <DataverseIcon />,
        category: "custom",
      },
    ],
  },
  {
    title: "Outlook",
    gradient: "from-blue-800 to-blue-400",
    items: [
      {
        id: "outlook-1",
        name: "This could be your flow",
        icon: <OutlookIcon />,
        category: "custom",
      },
    ],
  },
  {
    title: "Office 365",
    gradient: "from-violet-600 to-orange-500",
    items: [
      {
        id: "office365-1",
        name: "This could be your flow",
        icon: <Office365Icon />,
        category: "custom",
      },
    ],
  },
];
