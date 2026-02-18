import type { ListItem, SnippetCategory } from "../types";
import { categories, snippets } from "./snippetManifest";
import { getIcon, hasIcon } from "./iconRegistry";

// Static imports for all snippet data (path key must match manifest dataPath)
import booleanJson from "../data/variables/boolean.json";
import integerJson from "../data/variables/integer.json";
import floatJson from "../data/variables/float.json";
import stringJson from "../data/variables/string.json";
import objectJson from "../data/variables/object.json";
import arrayJson from "../data/variables/array.json";
import basicErrorJson from "../data/errorHandling/basicErrorHandling.json";
import errorMailJson from "../data/errorHandling/basicErrorHandlingMail.json";
import requestManagerApprovalJson from "../data/sharepoint/requestManagerApproval.json";
import getFilesByNameAndNoFolderTxt from "../data/sharepoint/getFilesByNameAndNoFolder.txt?raw";
import getFilesByNameAndNoFolderJson from "../data/sharepoint/getFilesByNameAndNoFolder.json";
import getFolderByNameTxt from "../data/sharepoint/getFolderByName.txt?raw";
import getFolderByNameJson from "../data/sharepoint/getFolderByName.json";
import sendPicturesEmbeddedViaMailJson from "../data/dataverse/sendPicturesEmbeddedViaMail.json";
import getTableRowsWhichContainDataJson from "../data/excel/getTableRowsWhichContainData.json";
import saveAttachementToSharepointJson from "../data/outlook/saveAttachementToSharepoint.json";

const dataByPath: Record<string, unknown> = {
  "variables/boolean.json": booleanJson,
  "variables/integer.json": integerJson,
  "variables/float.json": floatJson,
  "variables/string.json": stringJson,
  "variables/object.json": objectJson,
  "variables/array.json": arrayJson,
  "errorHandling/basicErrorHandling.json": basicErrorJson,
  "errorHandling/basicErrorHandlingMail.json": errorMailJson,
  "sharepoint/requestManagerApproval.json": requestManagerApprovalJson,
  "sharepoint/getFilesByNameAndNoFolder.txt": getFilesByNameAndNoFolderTxt,
  "sharepoint/getFilesByNameAndNoFolder.json": getFilesByNameAndNoFolderJson,
  "sharepoint/getFolderByName.txt": getFolderByNameTxt,
  "sharepoint/getFolderByName.json": getFolderByNameJson,
  "dataverse/sendPicturesEmbeddedViaMail.json": sendPicturesEmbeddedViaMailJson,
  "excel/getTableRowsWhichContainData.json": getTableRowsWhichContainDataJson,
  "outlook/saveAttachementToSharepoint.json": saveAttachementToSharepointJson,
  "": {},
};

function getData(dataPath: string): unknown {
  return dataByPath[dataPath] ?? {};
}

export function getSnippets(): SnippetCategory[] {
  return categories.map((category) => {
    const categorySnippets = snippets.filter((s) => s.categoryId === category.id);
    const items: ListItem[] = categorySnippets.map((snippet) => {
      const icon = hasIcon(snippet.iconKey) ? getIcon(snippet.iconKey) : null;
      const data = getData(snippet.dataPath);
      return {
        id: snippet.id,
        name: snippet.name,
        icon: icon ?? <span />,
        data,
        fileType: snippet.fileType,
      };
    });
    return {
      title: category.title,
      gradient: category.gradient,
      items,
    };
  });
}

export const availableSnippets: SnippetCategory[] = getSnippets();
