import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Divider, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

export default function AsnCard({ item, entryItem }) {
   const navigation = useNavigation();
   function InfoContainer(label, value) {
      return (
         <View style={poCard.infoContainer}>
            <Text style={poCard.infoLabel}>{label}</Text>
            <Text style={poCard.infoValue}>{value}</Text>
         </View>
      );
   }

   const statusBg = {
      Pending: "crimson",
      Complete: "green",
      Saved: "orange",
   };

   return (
      <View style={poCard.card}>
         {/* Header */}
         <View style={poCard.header}>
            {/* PO ID */}
            <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 15 }}>
               {item.asnNumber}
            </Text>
            {/* Status */}
            <View
               style={[
                  poCard.statusContainer,
                  {
                     backgroundColor:
                        statusBg[item.status] || "rgba(0, 0, 0, 0.2)",
                  },
               ]}
            >
               <Text style={poCard.statusTitle}>{item.status}</Text>
            </View>
         </View>

         {/* Divider */}
         <Divider style={{ marginBottom: 10 }} />

         {/* Body */}
         <TouchableOpacity
            style={poCard.bodyContainer}
            onPress={() =>
               navigation.navigate("Create ASN", {
                  poItem: entryItem,
                  asnItem: item,
               })
            }
         >
            {/* Body Left */}
            <View style={{ flex: 1 }}>
               {InfoContainer("Date of Creation", item.creationDate)}
               {InfoContainer(
                  "Date of Receiving",
                  item.receivingDate || "Yet To Receive"
               )}
            </View>
            {/* Body Right */}
            <View style={{ flex: 1 }}>
               {InfoContainer("Total SKU", item.totalSku)}
               {InfoContainer("Total Quantity", item.totalQty)}
            </View>

            <Icon name="chevron-right" size={50} />
         </TouchableOpacity>
      </View>
   );
}

const poCard = StyleSheet.create({
   card: {
      backgroundColor: "white",
      borderWidth: 2,
      borderColor: "rgba(0, 0, 0, 0.2)",
      borderRadius: 10,
      padding: 15,
      marginVertical: 5,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
   },
   statusContainer: {
      paddingHorizontal: 10,
      paddingVertical: 2,
      alignItems: "center",
   },
   statusTitle: {
      fontFamily: "Montserrat-Regular",
      color: "white",
      textTransform: "uppercase",
   },
   bodyContainer: {
      flexDirection: "row",
      alignItems: "center",
   },
   infoContainer: {
      marginBottom: 10,
   },
   infoLabel: {
      fontFamily: "Montserrat-Regular",
      color: "grey",
   },
   infoValue: {
      fontFamily: "Montserrat-Bold",
   },
});
