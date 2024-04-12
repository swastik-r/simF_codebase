import React, { useEffect, useState } from "react";

// React Native Imports
import { View } from "react-native";

// Custom Components
import AdjustmentCard from "./comps/AdjustmentCard";
import SearchBar_FS from "../../comps/SearchBar_FS";
import { useAdjustmentDetail } from "../../context/DataContext";

export default function InventoryAdjustmentPage() {
   const { data } = useAdjustmentDetail();

   return (
      <>
         {/* Search Bar & Filter/Sort */}
         <SearchBar_FS />

         {/* Inventory Adjustment Cards */}
         <View>
            {data.map((item) => (
               <AdjustmentCard key={item.id} item={item} />
            ))}
         </View>
      </>
   );
}
