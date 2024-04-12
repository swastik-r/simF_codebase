import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SummaryCard({ item }) {
   return (
      <View style={styles.cardContainer}>
         <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderTitle}>ID: {item.id}</Text>
            <Text style={styles.cardHeaderTitle}>Qty: {item.qty}</Text>
         </View>
         <View style={styles.cardContent}>
            <Text style={styles.cardContentTitle}>{item.itemInfo[0]}</Text>
            <Text style={styles.cardContentText}>{item.itemInfo[1]}</Text>
            <Text style={styles.cardContentText}>{item.itemInfo[2]}</Text>
            <Text style={styles.cardContentText}>{item.reason}</Text>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   cardContainer: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 10,
      justifyContent: "space-between",
   },
   cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
   },
   cardHeaderTitle: {
      fontSize: 16,
      fontWeight: "700",
   },
   cardContent: {
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
   },
   cardContentTitle: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 10,
   },
   cardContentText: {
      fontSize: 16,
      marginBottom: 5,
   },
});
