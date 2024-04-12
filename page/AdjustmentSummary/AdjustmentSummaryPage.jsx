import React, { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Button, ListItem } from "@rneui/themed";
import PageHeader from "../../comps/PageHeader";
import SearchBar_FS from "../../comps/SearchBar_FS";
import SummaryCard from "./comps/SummaryCard";
import SortModal from "./comps/SortModal";

export default function AdjustmentSummaryPage() {
   function randomData() {
      function generateRandomData(numItems) {
         const data = [];

         for (let i = 0; i < numItems; i++) {
            const id = generateRandomId();
            const itemInfo = [
               randomItem(["Polo T-Shirt", "Jeans", "Hoodie", "Dress"]),
               randomItem(["Red", "Blue", "Green", "Black"]),
               randomItem(["Size S", "Size M", "Size L"]),
            ];
            const qty = Math.floor(Math.random() * 50) + 1;
            const reason = randomItem([
               "Damaged",
               "Theft",
               "Sellable",
               "Stock - In",
               "Stock - Out",
            ]);

            data.push({ id, itemInfo, qty, reason });
         }

         return data;
      }

      function generateRandomId() {
         const characters = "ABCD0123456789";
         let id = "";
         const idLength = 10;

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

      return generateRandomData(10);
   }

   const [sortVisible, setSortVisible] = useState(false);

   return (
      <>
         {/* Page Title */}
         <PageHeader title="Adjustment Summary" />

         {/* Search Bar */}
         <SearchBar_FS
            placeholder="Search for an item..."
            onSearch={() => {}}
            onClear={() => {}}
         />

         {/* Adjustment Summary List */}
         <FlatList
            data={randomData()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SummaryCard item={item} />}
         />

         {/* Sort Modal */}
         <SortModal
            visible={sortVisible}
            // onClose={() => setSortVisible(false)}
         />
      </>
   );
}

const styles = StyleSheet.create({
   sortButton: {
      marginVertical: 10,
   },
});
