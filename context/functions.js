import { deleteData, getData, postData } from "../context/auth";
import { endpoints } from "./endpoints";
import { storeName, userName } from "../context/auth";

// Complete list of modules
const modules = {
   IA: "Inventory Adjustment",
   DSD: "Direct Store Delivery",
   PO: "Purchase Order",
   TSFIN: "In Transfer",
   TSFOUT: "Out Transfer",
   SC: "Stock Count",
   RTV: "Return to Vendor",
};

async function fetchData(type) {
   switch (type) {
      case "IA":
         return await getData(endpoints.fetchIa);
      case "DSD":
         return await getData(endpoints.fetchDsd);
      case "PO":
         return await getData(endpoints.fetchPo);
      case "TSFIN":
         return await getData(endpoints.fetchTsfIn + storeName);
      case "TSFOUT":
         return await getData(endpoints.fetchTsfOut + storeName);
      case "SC":
         return await getData(endpoints.fetchSc);
      case "RTV":
         return await getData(endpoints.fetchRtv);
      default:
         console.error("Invalid type for fetching data");
   }
}

async function createEntry(type) {
   switch (type) {
      case "IA":
         return await postData(endpoints.createIA + `${storeName}/${userName}`);
      case "DSD":
         return await postData(
            endpoints.createDSD + `${storeName}/${userName}`
         );
      case "TSFIN":
         return await postData(
            endpoints.createTsf + `${storeName}/${userName}/Ambience Mall`
         );
      default:
         console.error("Invalid type for creating an entry");
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
   switch (type) {
      case "IA":
         return await getData(endpoints.searchIA + str);
      case "DSD":
         return await getData(endpoints.searchDSD + str);
      case "PO":
         return await getData(endpoints.searchPo + str);
      case "TSFIN":
         return await getData(endpoints.searchTsfIn + `${str}/${storeName}`);
      case "TSFOUT":
         return await getData(endpoints.searchTsfOut + `${str}/${storeName}`);
      default:
         console.error("Invalid type for search");
   }
}

async function sortEntry(type, sortType) {
   switch (type) {
      case "IA":
         return await getData(endpoints.sortIA + `${sortType}/adjustments`);
      case "DSD":
         return await getData(endpoints.sortDSD + `${sortType}/Dsd`);
      case "PO":
         return await getData(endpoints.sortPo + `${sortType}/po`);
      case "TSFIN":
         return await getData(
            endpoints.sortTsf + `${sortType}/In/Tsf/${storeName}`
         );
      case "TSFOUT":
         return await getData(
            endpoints.sortTsf + `${sortType}/Out/Tsf/${storeName}`
         );
      case "RTV":
         return await getData(endpoints.sortRtv + `${sortType}/rtv`);
      default:
         console.error("Invalid type for sorting");
   }
}

async function filterEntry(type, filterParam) {
   switch (type) {
      case "IA":
         return await getData(endpoints.filterIA + `${filterParam}`);
      case "DSD":
         return await getData(endpoints.filterDSD + `${filterParam}`);
      case "TSFIN":
         return await getData(
            endpoints.filterTsf + `Out/Tsf/${filterParam}/${storeName}`
         );
      case "TSFOUT":
         return await getData(
            endpoints.filterTsf + `In/Tsf/${filterParam}/${storeName}`
         );
      default:
         console.error("Invalid type for filtering");
   }
}

export {
   fetchData,
   createEntry,
   handleDelete,
   searchEntry,
   sortEntry,
   filterEntry,
};
