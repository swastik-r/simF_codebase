import { deleteData, getData, postData } from "../context/auth";
import { endpoints } from "./endpoints";
import { storeName, userName } from "../context/auth";

async function fetchData(type) {
   let data;
   if (type === "IA") {
      data = await getData(endpoints.fetchIA);
   } else if (type === "DSD") {
      data = await getData(endpoints.fetchDSD);
   } else if (type === "PO") {
      data = await getData(endpoints.fetchPo);
   } else if (type === "TSFIN") {
      data = await getData(endpoints.fetchTsfIn + storeName);
   } else if (type === "TSFOUT") {
      data = await getData(endpoints.fetchTsfOut + storeName);
   }

   return data;
}

async function createEntry(type) {
   if (type === "IA") {
      return await postData(endpoints.createIA + `${storeName}/${userName}`);
   } else if (type === "DSD") {
      return await postData(endpoints.createDSD + `${storeName}/${userName}`);
   } else if (type === "TSFIN") {
      return await postData(
         endpoints.createTsf + `${storeName}/${userName}/Ambience Mall`
      );
   }
}

async function handleDelete(itemId, type) {
   if (type === "IA") {
      await deleteData(endpoints.deleteIA + itemId);
   } else if (type === "DSD") {
      await deleteData(endpoints.deleteDSD + itemId);
   }
}

async function searchEntry(type, str) {
   let data;
   if (type === "IA") {
      data = await getData(endpoints.searchIA + str);
   } else if (type === "DSD") {
      data = await getData(endpoints.searchDSD + str);
   } else if (type === "PO") {
      data = await getData(endpoints.searchPo + str);
   }
   return data;
}

async function sortEntry(type, sortType) {
   let data;
   if (type === "IA") {
      data = await getData(endpoints.sortIA + `${sortType}/adjustments`);
   } else if (type === "DSD") {
      data = await getData(endpoints.sortDSD + `${sortType}/Dsd`);
   }
   return data;
}

export { fetchData, createEntry, handleDelete, searchEntry, sortEntry };
