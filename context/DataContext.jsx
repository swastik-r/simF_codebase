import React, { createContext, useContext, useState, useEffect } from "react";

const AdjustmentDetailContext = createContext();
export function useAdjustmentDetail() {
   return useContext(AdjustmentDetailContext);
}

export default function AdjustmentDetailProvider({ children }) {
   // Function to generate data
   function generateData() {
      function randomAdjustmentData(numItems) {
         function getRandomNumUpto(num) {
            return Math.floor(Math.random() * num) + 1;
         }
         function getRandomId() {
            return Math.floor(Math.random() * 10000000) + 1;
         }
         function getRandomDate(
            start = new Date(2024, 0, 1),
            end = new Date()
         ) {
            return new Date(
               start.getTime() +
                  Math.random() * (end.getTime() - start.getTime())
            );
         }
         function getRandomProgress() {
            const progress = ["complete", "inProgress"];
            return progress[Math.floor(Math.random() * progress.length)];
         }

         // let id = getRandomId();
         return Array.from({ length: numItems }, () => {
            const { data, totalSKU, reason } = randomDetailData(
               getRandomNumUpto(20)
            );
            return {
               // id should start from a random number and added 1 for each item
               id: getRandomId(),
               progress: getRandomProgress(),
               date: String(getRandomDate()),
               reason: reason,
               detailItems: data,
               totalSKU: totalSKU,
            };
         });
      }
      return randomAdjustmentData(20);
   }
   function randomDetailData(numItems) {
      function generateRandomId() {
         const characters = "ABCD0123456789";
         let id = "";
         const idLength = 12; // You can adjust the length of the ID here

         for (let i = 0; i < idLength; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            id += characters.charAt(randomIndex);
         }

         return id;
      }

      function randomItem(array) {
         const randomIndex = Math.floor(Math.random() * array.length);
         return array[randomIndex];
      }

      function generateRandomData(numItems) {
         const data = [];
         let totalSKU = 0;

         // Generate random reason for the data
         const reasons = ["Damaged", "Theft", "Stock In", "Stock Out"];
         const reason = randomItem(reasons);

         for (let i = 0; i < numItems; i++) {
            const id = generateRandomId();
            const info = {
               name: randomItem([
                  "Polo T-Shirt",
                  "Slim Fit Jeans",
                  "Oversized Hoodie",
                  "Floral Long Dress",
               ]),
               color: randomItem(["red", "blue", "green", "black", "grey"]),
               size: randomItem(["S", "M", "L", "XL"]),
            };
            const qty = Math.floor(Math.random() * 10) + 1;
            data.push({ id, info, qty, reason });
            totalSKU += qty;
         }
         return { data, totalSKU, reason };
      }

      return generateRandomData(numItems);
   }
   function createNewAdjustment(newId) {
      const newAdjustment = {
         id: newId,
         progress: "inProgress",
         date: new Date(),
         reason: "Undefined",
         detailItems: [],
         totalSKU: 0,
      };
      setData([...data, newAdjustment]);
      console.log("New Adjustment Created");
   }

   // Data and Other Data State
   const [initialData] = useState(generateData());
   const [data, setData] = useState(initialData);
   const [sampleDetailItems, setSampleDetailItems] = useState(
      randomDetailData(20)
   );
   // for all items in sampleDetailItems, set the quantity to 1
   const [sortApplied, setSortApplied] = useState(false);
   const [filterApplied, setFilterApplied] = useState(false);
   const [searchStr, setSearchStr] = useState("");

   // ---------------------- Data Manipulation Functions ----------------------
   function deleteItem(itemId, parentItemId) {
      const updatedData = data.map((item) => {
         if (item.id === parentItemId) {
            // remove the item from the parent item and update the totalSKU
            item.detailItems = item.detailItems.filter(
               (detailItem) => detailItem.id !== itemId
            );
            item.totalSKU = item.detailItems.reduce(
               (acc, curr) => acc + curr.qty,
               0
            );
         }
         return item;
      });

      setData(updatedData);
      console.log("Deleted: " + itemId + " > " + parentItemId);
   }
   function addQty(itemId, parentItemId) {
      // find the item with parentId in the data
      const updatedData = data.map((item) => {
         if (item.id === parentItemId) {
            // find the item with itemId in the detailItems array
            item.detailItems = item.detailItems.map((detailItem) => {
               if (detailItem.id === itemId) {
                  // and add 1 to the qty
                  detailItem.qty += 1;
               }
               return detailItem;
            });
            // update the totalSKU
            item.totalSKU = item.detailItems.reduce(
               (acc, curr) => acc + curr.qty,
               0
            );
         }
         return item; // Ensure to always return item
      });
      setData(updatedData);
      console.log("Added 1 to item with ID: " + itemId);
   }
   function subQty(itemId, parentItemId) {
      // find the item with parentId in the data
      const updatedData = data.map((item) => {
         if (item.id === parentItemId) {
            // find the item with itemId in the detailItems array
            item.detailItems = item.detailItems
               .map((detailItem) => {
                  if (detailItem.id === itemId) {
                     detailItem.qty -= 1;
                     if (detailItem.qty === 0) {
                        // If quantity becomes 0, remove the item from detailItems array
                        return null; // Returning null will filter out the item
                     }
                  }
                  return detailItem;
               })
               .filter(Boolean); // Filter out null values

            // update the totalSKU
            item.totalSKU = item.detailItems.reduce(
               (acc, curr) => acc + curr.qty,
               0
            );
         }
         return item; // Ensure to always return item
      });
      setData(updatedData);
      console.log("Subtracted 1 from item with ID: " + itemId);
   }
   function completeAdjustment(id) {
      const updatedData = data.map((item) => {
         if (item.id === id) {
            item.progress = "complete";
         }
         return item;
      });
      setData(updatedData);
      console.log("Completed Adjustment with ID: " + id);
   }
   function addDetailItem(item, parentItemId) {
      const updatedData = data.map((parentItem) => {
         if (parentItem.id === parentItemId) {
            parentItem.detailItems.push(item);
            parentItem.totalSKU += item.qty;
         }
         return parentItem;
      });
      setData(updatedData);
      console.log("Added Detail Item to Adjustment with ID: " + parentItemId);
   }
   function removeDetailItem(id) {
      // remove the item with the given id from the sampleDetailItems
      const updatedSampleDetailItems = sampleDetailItems.data.filter(
         (item) => item.id !== id
      );
      setSampleDetailItems({ data: updatedSampleDetailItems });
   }
   function setDefaultReasonCode(reasonCode, id) {
      const updatedData = data.map((item) => {
         if (item.id === id) {
            item.reason = reasonCode;
            item.detailItems = item.detailItems.map((detailItem) => {
               detailItem.reason = reasonCode;
               return detailItem;
            });
         }
         return item;
      });
      setData(updatedData);
      console.log("Set Reason Code to: " + reasonCode + " for ID: " + id);
   }

   // ---------------------- Sort and Filter Functions ----------------------
   function handleSearch(text) {
      console.log("Searching for ID: ", text);
      // find all the adjustments that contain the text in their id
      const searchResults = initialData.filter((item) =>
         String(item.id).includes(text)
      );
      setData(searchResults);
   }
   function sortByDate(sortType) {
      if (sortType === "reset") {
         resetSort();
         return;
      }
      const sortedData = [...initialData]; // Make a copy of initialData
      sortedData.sort((a, b) => {
         const dateA = new Date(a.date);
         const dateB = new Date(b.date);
         return sortType === "latest" ? dateB - dateA : dateA - dateB;
      });
      setData(sortedData);
      setSortApplied(true);
      console.log("Sorted by: " + sortType);
   }
   function resetSort() {
      setData(initialData);
      setSortApplied(false);
      console.log("Sort reset");
   }
   function filterData() {
      const filteredData = [...initialData]
         .filter((item) => {
            if (filterParams.reason.length === 0) return true;
            return filterParams.reason.includes(item.reason);
         })
         .filter((item) => {
            if (filterParams.progress.length === 0) return true;
            return filterParams.progress.includes(item.progress);
         });
      setData(filteredData);
      setFilterApplied(true);
   }
   function resetFilter() {
      setFilterParams(filterParamsInitial);
      setFilterApplied(false);
   }

   const filterParamsInitial = {
      reason: [],
      progress: [],
   };
   const [filterParams, setFilterParams] = useState(filterParamsInitial);
   useEffect(() => {
      filterData();
   }, [filterParams]);

   // ---------------------- Bottom Sheet Options ----------------------
   const sortOpts = [
      {
         title: "Sort by latest",
         icon: {
            name: "sort-clock-descending-outline",
            type: "material-community",
            color: "black",
            size: 35,
         },
         titleStyle: styles.sortOpt,
         containerStyle: styles.sortOptContainer,
         sortType: "latest",
      },
      {
         title: "Sort by oldest",
         icon: {
            name: "sort-clock-descending-outline",
            type: "material-community",
            color: "black",
            size: 35,
            containerStyle: {
               transform: [{ scaleY: -1 }],
            },
         },
         titleStyle: styles.sortOpt,
         containerStyle: styles.sortOptContainer,
         sortType: "oldest",
      },
      {
         title: sortApplied ? "Reset Sort" : "Cancel",
         icon: sortApplied
            ? { name: "refresh", type: "material", color: "white" }
            : { name: "cancel", type: "material", color: "white" },
         containerStyle: [
            styles.sortOptContainer,
            { backgroundColor: "darkred" },
         ],
         titleStyle: styles.sortOptCancel,
         sortType: "reset",
      },
   ];
   const filterOpts = [
      {
         title: "Status",
         icon: {
            name: "progress-question",
            type: "material-community",
            color: "black",
            size: 30,
         },
         titleStyle: styles.sortOpt,
         containerStyle: styles.sortOptContainer,
         onPress: () => {
            // navigate to status filter
         },
      },
      {
         title: "Date",
         icon: {
            name: "date-range",
            type: "material",
            color: "black",
            size: 30,
         },
         titleStyle: styles.sortOpt,
         containerStyle: styles.sortOptContainer,
      },
      {
         title: "Reason Code",
         icon: {
            name: "report-problem",
            type: "material",
            color: "black",
            size: 30,
         },
         titleStyle: styles.sortOpt,
         containerStyle: styles.sortOptContainer,
      },
      {
         title: filterApplied ? "Cancel" : "Reset",
         icon: filterApplied
            ? { name: "cancel", type: "material", color: "white" }
            : { name: "refresh", type: "material", color: "white" },
         containerStyle: [
            styles.sortOptContainer,
            filterApplied
               ? { backgroundColor: "darkred" }
               : { backgroundColor: "black" },
         ],
         titleStyle: styles.sortOptCancel,
         onPress: () => resetFilter(),
      },
   ];
   const statusFilterOpts = [
      {
         title: "In Progress",
         icon: {
            name: "progress-question",
            type: "material-community",
            color: "black",
            size: 30,
         },
         titleStyle: styles.sortOpt,
         containerStyle: styles.sortOptContainer,
         onPress: () => {
            // add "pending" to filterParams.reason
            const newFilterParams = filterParams;
            newFilterParams.reason.push("inProgress");
            setFilterParams(newFilterParams);
         },
      },
      {
         title: "Completed",
         icon: {
            name: "progress-check",
            type: "material-community",
            color: "black",
            size: 30,
         },
         titleStyle: styles.sortOpt,
         containerStyle: styles.sortOptContainer,
         onPress: () => {
            // add "pending" to filterParams.reason
            const newFilterParams = filterParams;
            newFilterParams.reason.push("completed");
            setFilterParams(newFilterParams);
         },
      },
   ];
   const reasonFilterOpts = [
      {
         title: "Damaged",
         icon: {
            name: "image-broken-variant",
            type: "material-community",
            color: "black",
            size: 30,
         },
         titleStyle: styles.sortOpt,
         containerStyle: styles.sortOptContainer,
         onPress: () => {
            // add "pending" to filterParams.reason
            const newFilterParams = filterParams;
            newFilterParams.reason.push("damaged");
            setFilterParams(newFilterParams);
         },
      },
      {
         title: "Stock In",
         icon: {
            name: "download",
            type: "font-awesome",
            color: "black",
            size: 30,
         },
         titleStyle: styles.sortOpt,
         containerStyle: styles.sortOptContainer,
         onPress: () => {
            // add "pending" to filterParams.reason
            const newFilterParams = filterParams;
            newFilterParams.reason.push("stockIn");
            setFilterParams(newFilterParams);
         },
      },
      {
         title: "Stock Out",
         icon: {
            name: "upload",
            type: "font-awesome",
            color: "black",
            size: 30,
         },
         titleStyle: styles.sortOpt,
         containerStyle: styles.sortOptContainer,
         onPress: () => {
            // add "pending" to filterParams.reason
            const newFilterParams = filterParams;
            newFilterParams.reason.push("stockOut");
            setFilterParams(newFilterParams);
         },
      },
      {
         title: "Theft",
         icon: {
            name: "shield-lock-open",
            type: "material-community",
            color: "black",
            size: 30,
         },
         titleStyle: styles.sortOpt,
         containerStyle: styles.sortOptContainer,
         onPress: () => {
            // add "pending" to filterParams.reason
            const newFilterParams = filterParams;
            newFilterParams.reason.push("theft");
            setFilterParams(newFilterParams);
         },
      },
   ];

   // ---------------------- Context Values ----------------------
   const value = {
      generateData,
      createNewAdjustment,
      data,
      setData,
      deleteItem,
      searchStr,
      setSearchStr,
      handleSearch,
      sortApplied,
      setSortApplied,
      filterApplied,
      setFilterApplied,
      sortOpts,
      sortByDate,
      filterData,
      filterOpts,
      statusFilterOpts,
      reasonFilterOpts,
      filterParams,
      addQty,
      subQty,
      completeAdjustment,
      addDetailItem,
      removeDetailItem,
      setDefaultReasonCode,
      sampleDetailItems,
   };

   return (
      <AdjustmentDetailContext.Provider value={value}>
         {children}
      </AdjustmentDetailContext.Provider>
   );
}

const styles = {
   sortOpt: {
      fontFamily: "Montserrat-Medium",
   },
   sortOptCancel: {
      fontFamily: "Montserrat-Bold",
      color: "white",
   },
   sortOptContainer: {
      paddingLeft: 20,
   },
};
