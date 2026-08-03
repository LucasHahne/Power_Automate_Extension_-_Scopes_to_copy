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
import basicErrorTerminateJson from "../data/errorHandling/basicErrorHandlingTerminate.json";
import errorMailJson from "../data/errorHandling/basicErrorHandlingMail.json";
import errorMailTerminateJson from "../data/errorHandling/basicErrorHandlingMailTerminate.json";
import requestManagerApprovalJson from "../data/sharepoint/requestManagerApproval.json";

import getFilesByNameAndNoFolderTxt from "../data/sharepoint/getFilesByNameAndNoFolder.txt?raw";
import getFilesByNameAndNoFolderJson from "../data/sharepoint/getFilesByNameAndNoFolder.json";
import getFolderByNameTxt from "../data/sharepoint/getFolderByName.txt?raw";
import getFolderByNameJson from "../data/sharepoint/getFolderByName.json";
import getFileByFiletypeJson from "../data/sharepoint/getFileByFiletype.json";
import getFileByFiletypeTxt from "../data/sharepoint/getFileByFiletype.txt?raw";
import sendPicturesEmbeddedViaMailJson from "../data/dataverse/sendPicturesEmbeddedViaMail.json";
import getTableRowsWhichContainDataJson from "../data/excel/getTableRowsWhichContainData.json";
import saveAttachementToSharepointJson from "../data/outlook/saveAttachementToSharepoint.json";
import batchCreateItemsInSharepointListJson from "../data/sharepoint/batchCreateItemsInSharepointList.json";
import batchUpdateItemsInSharepointListJson from "../data/sharepoint/batchUpdateItemsInSharepointList.json";
import batchDeleteItemsInSharepointListJson from "../data/sharepoint/batchDeleteItemsInSharepointList.json";

const dataByPath: Record<string, unknown> = {
  "variables/boolean.json": booleanJson,
  "variables/integer.json": integerJson,
  "variables/float.json": floatJson,
  "variables/string.json": stringJson,
  "variables/object.json": objectJson,
  "variables/array.json": arrayJson,
  "errorHandling/basicErrorHandling.json": basicErrorJson,
  "errorHandling/basicErrorHandlingTerminate.json": basicErrorTerminateJson,
  "errorHandling/basicErrorHandlingMail.json": errorMailJson,
  "errorHandling/basicErrorHandlingMailTerminate.json": errorMailTerminateJson,
  "sharepoint/requestManagerApproval.json": requestManagerApprovalJson,
  "sharepoint/getFilesByNameAndNoFolder.txt": getFilesByNameAndNoFolderTxt,
  "sharepoint/getFilesByNameAndNoFolder.json": getFilesByNameAndNoFolderJson,
  "sharepoint/getFolderByName.txt": getFolderByNameTxt,
  "sharepoint/getFolderByName.json": getFolderByNameJson,
  "sharepoint/getFileByFiletype.json": getFileByFiletypeJson,
  "sharepoint/getFileByFiletype.txt": getFileByFiletypeTxt,
  "dataverse/sendPicturesEmbeddedViaMail.json": sendPicturesEmbeddedViaMailJson,
  "excel/getTableRowsWhichContainData.json": getTableRowsWhichContainDataJson,
  "outlook/saveAttachementToSharepoint.json": saveAttachementToSharepointJson,
  "sharepoint/batchCreateItemsInSharepointList.json":
    batchCreateItemsInSharepointListJson,
  "sharepoint/batchUpdateItemsInSharepointList.json":
    batchUpdateItemsInSharepointListJson,
  "sharepoint/batchDeleteItemsInSharepointList.json":
    batchDeleteItemsInSharepointListJson,
  "": {},
};

function getData(dataPath: string): unknown {
  return dataByPath[dataPath] ?? {};
}

export function getSnippets(): SnippetCategory[] {
  return categories.map((category) => {
    const categorySnippets = snippets.filter(
      (s) => s.categoryId === category.id,
    );
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
      id: category.id,
      title: category.title,
      gradient: category.gradient,
      items,
    };
  });
}

export const availableSnippets: SnippetCategory[] = getSnippets();
