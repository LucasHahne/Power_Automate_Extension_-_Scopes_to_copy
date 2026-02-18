import type { CategoryManifestItem, SnippetManifestItem } from "../types";

export const categories: CategoryManifestItem[] = [
  { id: "variables", title: "Variables", gradient: "from-violet-800 to-purple-400", iconKey: "Variable" },
  { id: "error", title: "Error Handling", gradient: "from-red-600 to-amber-600", iconKey: "Errorhandling" },
  { id: "sharepoint", title: "Sharepoint", gradient: "from-teal-800 to-cyan-400", iconKey: "Sharepoint" },
  { id: "excelonline", title: "Excel Online (Business)", gradient: "from-green-900 to-green-600", iconKey: "Excel" },
  { id: "dataverse", title: "Dataverse", gradient: "from-green-800 to-lime-400", iconKey: "Dataverse" },
  { id: "outlook", title: "Outlook", gradient: "from-blue-800 to-blue-400", iconKey: "Outlook" },
  { id: "office365", title: "Office 365", gradient: "from-violet-600 to-orange-500", iconKey: "Office365" },
];

export const snippets: SnippetManifestItem[] = [
  { id: "variables-1", categoryId: "variables", name: "Boolean variable (Initialize)", iconKey: "Variable", dataPath: "variables/boolean.json", fileType: "json" },
  { id: "variables-2", categoryId: "variables", name: "Integer variable (Initialize)", iconKey: "Variable", dataPath: "variables/integer.json", fileType: "json" },
  { id: "variables-4", categoryId: "variables", name: "Float variable (Initialize)", iconKey: "Variable", dataPath: "variables/float.json", fileType: "json" },
  { id: "variables-5", categoryId: "variables", name: "String variable (Initialize)", iconKey: "Variable", dataPath: "variables/string.json", fileType: "json" },
  { id: "variables-6", categoryId: "variables", name: "Object variable (Initialize)", iconKey: "Variable", dataPath: "variables/object.json", fileType: "json" },
  { id: "variables-7", categoryId: "variables", name: "Array variable (Initialize)", iconKey: "Variable", dataPath: "variables/array.json", fileType: "json" },
  { id: "error-1", categoryId: "error", name: "Basic Error Handler", iconKey: "Errorhandling", dataPath: "errorHandling/basicErrorHandling.json", fileType: "json" },
  { id: "error-2", categoryId: "error", name: "Basic Error Handler with mail", iconKey: "Errorhandling", dataPath: "errorHandling/basicErrorHandlingMail.json", fileType: "json" },
  { id: "sharepoint-1", categoryId: "sharepoint", name: "Request Manager Approval", iconKey: "Sharepoint", dataPath: "sharepoint/requestManagerApproval.json", fileType: "json" },
  { id: "sharepoint-2", categoryId: "sharepoint", name: "Search for file by name", iconKey: "Sharepoint", dataPath: "sharepoint/getFilesByNameAndNoFolder.json", fileType: "json" },
  { id: "sharepoint-3", categoryId: "sharepoint", name: "Search for file by name (Filter Query only)", iconKey: "Sharepoint", dataPath: "sharepoint/getFilesByNameAndNoFolder.txt", fileType: "txt" },
  { id: "sharepoint-4", categoryId: "sharepoint", name: "Search for folder by name", iconKey: "Sharepoint", dataPath: "sharepoint/getFolderByName.json", fileType: "json" },
  { id: "sharepoint-5", categoryId: "sharepoint", name: "Search for folder by name (Filter Query only)", iconKey: "Sharepoint", dataPath: "sharepoint/getFolderByName.txt", fileType: "txt" },
  { id: "excelonline-1", categoryId: "excelonline", name: "Filter Tablerows which are not empty", iconKey: "Excel", dataPath: "excel/getTableRowsWhichContainData.json", fileType: "json" },
  { id: "dataverse-1", categoryId: "dataverse", name: "Send picture embedded via mail", iconKey: "Dataverse", dataPath: "dataverse/sendPicturesEmbeddedViaMail.json", fileType: "json" },
  { id: "outlook-1", categoryId: "outlook", name: "Save attachment to Sharepoint", iconKey: "Outlook", dataPath: "outlook/saveAttachementToSharepoint.json", fileType: "json" },
  { id: "office365-1", categoryId: "office365", name: "This could be your flow", iconKey: "Office365", dataPath: "", fileType: "txt" },
];
