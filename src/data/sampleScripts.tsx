import React from "react";
import {
  DataverseIcon,
  ErrorhandlingIcon,
  SharepointIcon,
  VariableIcon,
} from "../components/IconComponent/ListIcons";

// Import JSON files
import booleanJson from "./variables/boolean.json";
import integerJson from "./variables/integer.json";
import floatJson from "./variables/float.json";
import stringJson from "./variables/string.json";
import objectJson from "./variables/object.json";
import arrayJson from "./variables/array.json";
import basicErrorJson from "./error handling/basic_error_handling.json";
import errorMailJson from "./error handling/basic_error_handling_mail.json";
import requestManagerApprovalJson from "./sharepoint/requestManagerApproval.json";
export interface ScriptItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  jsonData?: any;
}

export const scriptCategories = [
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
        name: "Arrray variable (Initialize)",
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
    title: "Dataverse",
    gradient: "from-green-800 to-lime-400",
    items: [
      {
        id: "custom-1",
        name: "Custom Agent",
        icon: <DataverseIcon />,
        category: "custom",
      },
      {
        id: "custom-2",
        name: "File Organizer",
        icon: <DataverseIcon />,
        category: "custom",
      },
    ],
  },
  {
    title: "Sharepoint",
    gradient: "from-teal-800 to-cyan-400",
    items: [
      {
        id: "Get attachments",
        name: "Request Manager Approval",
        icon: <SharepointIcon />,
        jsonData: requestManagerApprovalJson,
      },
    ],
  },
];
