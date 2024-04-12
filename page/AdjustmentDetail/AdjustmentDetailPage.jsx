// React Native Imports
import { View, ScrollView, StyleSheet } from "react-native";

// Custom Components
import SearchBar_FS from "../../comps/SearchBar_FS";
import DetailCard from "./comps/DetailCard";
import { useAdjustmentDetail } from "../../context/DataContext";

export default function AdjustmentDetailPage() {
   const { sampleData, deleteItem, sortbyQty, sortOpts } =
      useAdjustmentDetail();
   return (
      <>
         {/* Search Bar & Filter/Sort */}
         <SearchBar_FS />

         {/* Adjustment Detail Cards */}
         <>
            {sampleData.map((item, index) => (
               <DetailCard key={index} item={item} deleteFun={deleteItem} />
            ))}
         </>
      </>
   );
}

const styles = StyleSheet.create({
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
});
