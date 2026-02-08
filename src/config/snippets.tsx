import {
  DataverseIcon,
  ErrorhandlingIcon,
  Office365Icon,
  OutlookIcon,
  SharepointIcon,
  VariableIcon,
  ExcelIcon,
} from "../components/Icons/ServiceIcons";
import type { SnippetCategory } from "../types";

// Import JSON files
import booleanJson from "../data/variables/boolean.json";
import integerJson from "../data/variables/integer.json";
import floatJson from "../data/variables/float.json";
import stringJson from "../data/variables/string.json";
import objectJson from "../data/variables/object.json";
import arrayJson from "../data/variables/array.json";
import basicErrorJson from "../data/errorhandling/basicErrorHandling.json";
import errorMailJson from "../data/errorhandling/basicErrorHandlingMail.json";
import requestManagerApprovalJson from "../data/sharepoint/requestManagerApproval.json";
import getFilesByNameAndNoFolderTxt from "../data/sharepoint/getFilesByNameAndNoFolder.txt?raw";
import getFilesByNameAndNoFolderJson from "../data/sharepoint/getFilesByNameAndNoFolder.json";
import getFolderByNameTxt from "../data/sharepoint/getFolderByName.txt?raw";
import getFolderByNameJson from "../data/sharepoint/getFolderByName.json";
import sendPicturesEmbeddedViaMailJson from "../data/dataverse/sendPicturesEmbeddedViaMail.json";
import getTableRowsWhichContainDataJson from "../data/excel/getTableRowsWhichContainData.json";
import saveAttachementToSharepointJson from "../data/outlook/saveAttachementToSharepoint.json";

export const availableSnippets: SnippetCategory[] = [
  {
    title: "Variables",
    gradient: "from-violet-800 to-purple-400",
    items: [
      {
        id: "variables-1",
        name: "Boolean variable (Initialize)",
        icon: <VariableIcon />,
        data: booleanJson,
        fileType: "json",
      },
      {
        id: "variables-2",
        name: "Integer variable (Initialize)",
        icon: <VariableIcon />,
        data: integerJson,
        fileType: "json",
      },
      {
        id: "variables-4",
        name: "Float variable (Initialize)",
        icon: <VariableIcon />,
        data: floatJson,
        fileType: "json",
      },
      {
        id: "variables-5",
        name: "String variable (Initialize)",
        icon: <VariableIcon />,
        data: stringJson,
        fileType: "json",
      },
      {
        id: "variables-6",
        name: "Object variable (Initialize)",
        icon: <VariableIcon />,
        data: objectJson,
        fileType: "json",
      },
      {
        id: "variables-7",
        name: "Array variable (Initialize)",
        icon: <VariableIcon />,
        data: arrayJson,
        fileType: "json",
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
        data: basicErrorJson,
        fileType: "json",
      },
      {
        id: "error-2",
        name: "Basic Error Handler with mail",
        icon: <ErrorhandlingIcon />,
        data: errorMailJson,
        fileType: "json",
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
        data: requestManagerApprovalJson,
        fileType: "json",
      },
      {
        id: "sharepoint-2",
        name: "Search for file by name",
        icon: <SharepointIcon />,
        data: getFilesByNameAndNoFolderJson,
        fileType: "json",
      },
      {
        id: "sharepoint-3",
        name: "Search for file by name (Filter Query only)",
        icon: <SharepointIcon />,
        data: getFilesByNameAndNoFolderTxt,
        fileType: "txt",
      },
      {
        id: "sharepoint-4",
        name: "Search for folder by name",
        icon: <SharepointIcon />,
        data: getFolderByNameJson,
        fileType: "json",
      },
      {
        id: "sharepoint-5",
        name: "Search for folder by name (Filter Query only)",
        icon: <SharepointIcon />,
        data: getFolderByNameTxt,
        fileType: "txt",
      },
    ],
  },
  {
    title: "Excel Online (Business)",
    gradient: "from-green-900 to-green-600",
    items: [
      {
        id: "excelonline-1",
        name: "Filter Tablerows which are not empty",
        icon: <ExcelIcon />,
        data: getTableRowsWhichContainDataJson,
        fileType: "json",
      },
    ],
  },

  {
    title: "Dataverse",
    gradient: "from-green-800 to-lime-400",
    items: [
      {
        id: "dataverse-1",
        name: "Send picture embedded via mail",
        icon: <DataverseIcon />,
        data: sendPicturesEmbeddedViaMailJson,
        fileType: "json",
      },
    ],
  },
  {
    title: "Outlook",
    gradient: "from-blue-800 to-blue-400",
    items: [
      {
        id: "outlook-1",
        name: "Save attachment to Sharepoint",
        icon: <OutlookIcon />,
        data: saveAttachementToSharepointJson,
        fileType: "json",
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
        data: {},
        fileType: "txt",
      },
    ],
  },
];
