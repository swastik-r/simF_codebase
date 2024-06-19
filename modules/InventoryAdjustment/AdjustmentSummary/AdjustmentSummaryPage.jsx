import React, { useState, useEffect } from "react";
import {
   Text,
   FlatList,
   StyleSheet,
   View,
   ImageBackground,
} from "react-native";
import DetailCard2 from "../AdjustmentDetail/comps/DetailCard2";
import { useAdjustmentDetail } from "../../../context/DataContext";
import SearchBar_FS from "./comps/SearchBar_FS";

export default function AdjustmentSummaryPage({ route }) {
   const { data } = useAdjustmentDetail();
   const { id } = route.params;
   const adjustment = data.find((item) => item.id === id);
   const [searchResults, setSearchResults] = useState(adjustment.detailItems);
   const [searchText, setSearchText] = useState("");

   // useEffect: handle search results and reset when text changes
   useEffect(() => {
      if (searchText === "") {
         setSearchResults(adjustment.detailItems);
      } else {
         const results = adjustment.detailItems.filter(
            (item) =>
               item.info.name
                  .toLowerCase()
                  .includes(searchText.toLowerCase()) ||
               item.id.toLowerCase().includes(searchText.toLowerCase())
         );
         setSearchResults(results);
      }
   }, [searchText, adjustment.detailItems]);

   function search(text) {
      setSearchText(text);
   }

   return (
      // <ImageBackground
      //    source={require("../../../assets/pageBg.png")}
      //    style={{ flex: 1 }}
      // >
      <View style={{ flex: 0.9, backgroundColor: "rgb(225,225,225)" }}>
         <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <DetailCard2
                  item={item}
                  adjustmentReason={adjustment.reason}
                  route={route}
               />
            )}
            ListHeaderComponent={
               <>
                  <SummaryDetails adjustment={adjustment} />
                  <SearchBar_FS search={search} adjustmentId={id} />
               </>
            }
         />
      </View>
      // </ImageBackground>
   );
}

export function SummaryDetails({ adjustment }) {
   const { reasonMap } = useAdjustmentDetail();

   function dateString(date) {
      return new Date(date).toLocaleDateString("en-GB", {
         day: "numeric",
         month: "numeric",
         year: "numeric",
      });
   }

   function reasonString(reason) {
      return reasonMap[reason];
   }

   const info1 = [
      {
         title: "ID",
         text: adjustment.id,
      },
      {
         title: "Date",
         text: dateString(adjustment.date),
      },
   ];
   const info2 = [
      {
         title: "Reason Code",
         text: reasonString(adjustment.reason),
      },
      {
         title: "User",
         text: "amit003",
      },
   ];

   return (
      <View style={detailStyles.detailsContainer}>
         <View style={{ width: "45%" }}>
            {info1.map((item, index) => (
               <View key={index} style={detailStyles.infoContainer}>
                  <Text style={detailStyles.detailTitle}>{item.title}</Text>
                  <Text style={detailStyles.detailText}>{item.text}</Text>
               </View>
            ))}
         </View>

         <View style={{ width: "45%" }}>
            {info2.map((item, index) => (
               <View key={index} style={detailStyles.infoContainer}>
                  <Text style={detailStyles.detailTitle}>{item.title}</Text>
                  <Text style={detailStyles.detailText}>{item.text}</Text>
               </View>
            ))}
         </View>
      </View>
   );
}

const detailStyles = StyleSheet.create({
   detailsContainer: {
      backgroundColor: "#112d4eaa",
      marginHorizontal: 20,
      marginVertical: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: "white",
      borderRadius: 10,
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
   },
   infoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 2,
   },
   detailTitle: {
      fontFamily: "Montserrat-Regular",
      fontSize: 12,
      color: "white",
      marginRight: 5,
   },
   detailText: {
      fontFamily: "Montserrat-Bold",
      fontSize: 12,
      color: "white",
   },
});
