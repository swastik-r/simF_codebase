import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAdjustmentDetail } from "../../../../context/DataContext";

export default function SummaryCard({ item, serialNumber, adjustmentReason }) {
   const { sizeMap, reasonMap } = useAdjustmentDetail();
   function sizeString(size) {
      return sizeMap[size];
   }
   function reasonString(reason) {
      return reasonMap[reason];
   }

   const info = [
      {
         title: "Name",
         text: item.info.name,
      },
      {
         title: "Color",
         text:
            item.info.color.charAt(0).toUpperCase() + item.info.color.slice(1),
      },
      {
         title: "Size",
         text: sizeString(item.info.size),
      },
      {
         title: "Quantity",
         text: item.qty,
      },
   ];

   return (
      <View style={styles.cardContainer}>
         <View style={styles.cardHeader}>
            <Text style={styles.serialNumber}>{serialNumber} :</Text>
            <Text style={styles.cardHeaderTitle}>{item.id}</Text>
         </View>
         {info.map((item, index) => (
            <View key={index} style={styles.cardContent}>
               <Text style={styles.cardContentTitle}>{item.title}</Text>
               <Text style={styles.cardContentText}>{item.text}</Text>
            </View>
         ))}
         {adjustmentReason === "multiple" && (
            <View style={styles.cardContent}>
               <Text style={styles.cardContentTitle}>Reason</Text>
               <Text style={styles.cardContentText}>
                  {reasonString(item.reason)}
               </Text>
            </View>
         )}
      </View>
   );
}

const styles = StyleSheet.create({
   cardContainer: {
      backgroundColor: "white",
      // borderWidth: 1,
      borderRadius: 5,
      // borderColor: "silver",
      marginTop: 10,
      marginHorizontal: 10,
      padding: 10,
      elevation: 5,
   },
   cardHeader: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 5,
   },
   cardHeaderTitle: {
      fontSize: 14,
      fontFamily: "Montserrat-Bold",
   },
   serialNumber: {
      fontFamily: "Montserrat-Bold",
      color: "dodgerblue",
      marginRight: 5,
   },
   cardContent: {
      marginBottom: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   cardContentTitle: {
      fontSize: 12,
      fontFamily: "Montserrat-Medium",
   },
   cardContentText: {
      fontSize: 12,
      fontFamily: "Montserrat-Bold",
   },
});
