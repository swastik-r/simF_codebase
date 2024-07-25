import { deleteData, getData, postData } from "../context/auth";
import { endpoints } from "./endpoints";
import { storeName, userName } from "../context/auth";

async function fetchData(type) {
   let data;
   if (type === "IA") {
      data = await getData(endpoints.fetchIA);
   } else if (type === "DSD") {
      data = await getData(endpoints.fetchDSD);
   }
   else if (type === "PO") {
      data = await getData(endpoints.fetchPO);
   }
   return data;
}

async function createEntry(type) {
   if (type === "IA") {
      await postData(endpoints.createIA + `${storeName}/${userName}`);
   } else if (type === "DSD") {
      await postData(endpoints.createDSD + `${storeName}/${userName}`);
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

async function handleSaveAsDraft(type) {}

export { fetchData, createEntry, handleDelete, searchEntry, sortEntry };
