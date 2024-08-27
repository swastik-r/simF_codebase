import { Divider, Icon } from "@rneui/themed";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { handleDelete } from "../../context/functions";

export default function ListingCard({ item, foo }) {
   // States and Vars
   const navigation = useNavigation();

   // Functions
   function InfoContainer({ title, value }) {
      return (
         <View
            style={{
               flexDirection: "row",
               alignItems: "center",
               marginVertical: 6,
            }}
         >
            <Text style={styles.textRegular}>{title}</Text>
            <Text style={styles.textBold}>{value}</Text>
         </View>
      );
   }
   function ProgressChip({ status }) {
      const chipData = {
         Complete: {
            color: "#4CAF50", // Green
            textColor: "white",
         },
         "In Progress": {
            color: "#FFEB3B", // Yellow
            textColor: "#212121", // Dark grey for better contrast
         },
         Saved: {
            color: "#FFA726", // Orange
            textColor: "white",
         },
         Pending: {
            color: "#F44336", // Red
            textColor: "white",
         },
         Shipped: {
            color: "#3F51B5", // Blue
            textColor: "white",
         },
         Delivered: {
            color: "#8BC34A", // Light Green
            textColor: "white",
         },
         "New Request": {
            color: "#FF7043", // Deep Orange
            textColor: "white",
         },
         Accepted: {
            color: "#E91E63", // Pink
            textColor: "white",
         },
         "Partially Accepted": {
            color: "#9C27B0",
            textColor: "white",
         },
         Rejected: {
            color: "#607D8B",
            textColor: "white",
         },
      };

      return (
         <View
            style={{
               alignSelf: "center",
               paddingHorizontal: 2,
               paddingVertical: 3,
               backgroundColor: chipData[status].color,
               borderRadius: 5,
            }}
         >
            <Text
               style={{
                  fontFamily: "Montserrat-Bold",
                  fontSize: 10,
                  color: chipData[status].textColor,
                  paddingHorizontal: 5,
                  textTransform: "uppercase",
               }}
            >
               {status}
            </Text>
         </View>
      );
   }
   async function deleteEntry(itemId) {
      await handleDelete(itemId, item.type);
      foo();
   }

   // redirection map based on type and status
   const pageMap = {
      IA: {
         "In Progress": "IA Items",
         Saved: "IA Items",
         Complete: "IA Summary",
      },
      DSD: {
         "In Progress": "DSD Items",
         Saved: "DSD Items",
         Complete: "DSD Summary",
      },
      PO: {
         "In Progress": "ASN List",
         Pending: "ASN List",
         Complete: "ASN List",
      },
      TSFIN: {
         // Transfer Items
         "New Request": "Transfer Items",
         "In Progress": "Transfer Items",
         Accepted: "Transfer Items",
         "Partially Accepted": "Transfer Items",
         Rejected: "Transfer Items",
         Shipped: "Transfer Items",
         Delivered: "Transfer Items",
         Saved: "Transfer Items",

         // Transfer Summary
         Pending: "Transfer Summary",
         Complete: "Transfer Summary",
      },
      TSFOUT: {
         // Transfer Items
         "New Request": "Transfer Items",
         "In Progress": "Transfer Items",
         Accepted: "Transfer Items",
         "Partially Accepted": "Transfer Items",
         Rejected: "Transfer Items",
         Shipped: "Transfer Items",
         Delivered: "Transfer Items",
         Saved: "Transfer Items",

         // Transfer Summary
         Pending: "Transfer Summary",
         Complete: "Transfer Summary",
      },
   };

   // module-specific fields
   const fieldMap = {
      IA: {
         field: "reason",
         title: "Reason",
      },
      DSD: {
         field: "supplierId",
         title: "Supplier",
      },
      PO: {
         field: "supplierId",
         title: "Supplier",
      },
      TSFIN: {
         field: "storeId",
         title: "Store ID",
      },
      TSFOUT: {
         field: "storeId",
         title: "Store ID",
      },
   };

   // show delete button for certain statuses
   const deletableStatus = ["In Progress", "Saved", "Pending", "New Request"];
   const deletableTypes = ["IA", "DSD"];
   const showDelete =
      deletableTypes.includes(item.type) &&
      deletableStatus.includes(item.status);

   return (
      <View style={styles.card}>
         {/* Delete button based on STATUS */}
         {showDelete && (
            <View style={styles.deleteButtonContainer}>
               <Icon
                  name="delete-circle-outline"
                  type="material-community"
                  size={22}
                  color={"crimson"}
                  onPress={() => deleteEntry(item.id, item.type)}
               />
            </View>
         )}

         {/* Left info container */}
         <View style={styles.cardLeft}>
            <View style={styles.cardLeftTop}>
               <InfoContainer title={"ID: "} value={item.id} />
               <ProgressChip status={item.status} />
            </View>
            <Divider color={"#112d4ebb"} width={1} />
            <View style={styles.cardLeftBottom}>
               <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <InfoContainer
                     title={fieldMap[item.type].title + ": "}
                     value={item[fieldMap[item.type].field] || "N/A"}
                  />
               </View>
               <InfoContainer title={"Date: "} value={item.date} />
            </View>
         </View>

         {/* Right pressable counts based on type */}
         <Pressable
            onPress={() => {
               navigation.navigate(pageMap[item.type][item.status], {
                  entryItem: item,
               });
            }}
            style={styles.cardRight}
         >
            <View
               style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
               }}
            >
               <Text style={styles.unitCount}>
                  {item.totalSku || item.asnCount || item.units || 0}
               </Text>
               {item.type !== "PO" ? (
                  <Text style={styles.unitLabel}>Units</Text>
               ) : (
                  <Text style={styles.unitLabel}>ASN</Text>
               )}
            </View>
            <Icon
               name="arrow-right-box"
               type="material-community"
               size={25}
               color={"white"}
            />
         </Pressable>
      </View>
   );
}

const styles = StyleSheet.create({
   card: {
      position: "relative",
      marginVertical: 5,
      flexDirection: "row",
      elevation: 5,
      borderRadius: 20,
      backgroundColor: "#ffffff",
   },
   deleteButtonContainer: {
      position: "absolute",
      top: -5,
      right: -5,
      zIndex: 999,
      borderRadius: 999,
      backgroundColor: "white",
   },
   cardLeft: {
      position: "relative",
      width: "80%",
      backgroundColor: "#ffffffbb",
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: "#112d4e33",
   },
   cardLeftTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 5,
   },
   cardLeftBottom: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 5,
      borderColor: "white",
   },
   cardRight: {
      backgroundColor: "#112d4eaa",
      flex: 1,
      padding: 5,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      alignItems: "center",
      justifyContent: "space-around",
   },
   unitCount: {
      fontSize: 18,
      fontFamily: "Montserrat-Bold",
      color: "#ffffff",
   },
   unitLabel: {
      fontSize: 12,
      fontFamily: "Montserrat-Regular",
      color: "#ffffff",
   },
   textRegular: {
      color: "#112d4ebb",
      fontFamily: "Montserrat-Medium",
   },
   textBold: {
      color: "#112d4ebb",
      fontFamily: "Montserrat-Bold",
   },
});
