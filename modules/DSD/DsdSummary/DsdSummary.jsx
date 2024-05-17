import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { LinearProgress, Icon, Chip, Button } from "@rneui/themed";
import { useAdjustmentDetail } from "../../../context/DataContext";

export default function DsdSummary({ route }) {
   const { dsdId } = route.params;
   const { getDsdItems } = useAdjustmentDetail();
   const data = getDsdItems(dsdId);

   return (
      <View style={{ alignItems: "center", backgroundColor: "white", flex: 1 }}>
         <FlatList
            data={data}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
               <SummaryCard serialNum={index + 1} item={item} />
            )}
            ListHeaderComponent={
               <>
                  <SummaryDetails dsdId={dsdId} />
                  {/* <SummaryPageButtons /> */}
               </>
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ width: 400 }}
         />
      </View>
   );
}

function SummaryDetails({ dsdId }) {
   // States and constants
   const { dsdData } = useAdjustmentDetail();
   const dsd = dsdData.find((dsd) => dsd.id === dsdId);
   const totalItems = dsd.units;
   const damagedItems = dsd.dsdItems.reduce(
      (acc, item) => acc + item.damagedQty,
      0
   );

   // Functions
   function renderDate(date) {
      const dateObj = new Date(date);
      return `${dateObj.getDate()} ${dateObj.toLocaleString("default", {
         month: "short",
      })} ${dateObj.getFullYear()}`;
   }

   return (
      <View style={styles.summaryContainer}>
         <View style={styles.summaryContentContainer}>
            <View
               style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
               }}
            >
               <View>
                  <Text style={styles.summaryHeading}>{dsd.id}</Text>
                  <Text style={styles.summarySubHeading}>{dsd.supplier}</Text>
               </View>

               <Chip
                  buttonStyle={{ padding: 5 }}
                  type="clear"
                  icon={{
                     name: "calendar-check",
                     type: "material-community",
                     size: 20,
                  }}
                  title={renderDate(dsd.date)}
                  titleStyle={styles.chipDate}
               />
            </View>
         </View>

         <View style={styles.summaryContentContainer}>
            <Text style={{ fontFamily: "Montserrat-Regular", fontSize: 25 }}>
               Total Units:{" "}
               <Text style={{ fontFamily: "Montserrat-Bold" }}>
                  {totalItems}
               </Text>
            </Text>
         </View>
         <View style={styles.summaryContentContainer}>
            <Text style={styles.summaryText}>
               Total Sellable:{" "}
               <Text style={{ fontFamily: "Montserrat-Bold" }}>
                  {totalItems - damagedItems}
               </Text>
            </Text>
            <Text style={styles.summaryText}>
               Total Damaged:{" "}
               <Text style={{ fontFamily: "Montserrat-Bold" }}>
                  {damagedItems}
               </Text>
            </Text>
         </View>

         <View style={styles.summaryContentContainer}>
            <Text style={styles.summaryText}>
               PO Number:{" "}
               <Text style={{ fontFamily: "Montserrat-Bold" }}>{dsd.po}</Text>
            </Text>
            <Text style={styles.summaryText}>
               Invoice ID:{" "}
               <Text style={{ fontFamily: "Montserrat-Bold" }}>
                  {dsd.invoiceId}
               </Text>
            </Text>
         </View>

         {/* STATUS BAR */}
         <View style={styles.summaryContentContainer}>
            <View
               style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
               }}
            >
               <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                     name="check-circle"
                     type="material-community"
                     color="green"
                     size={20}
                     style={{ marginRight: 5 }}
                  />
                  <Text style={{ fontFamily: "Montserrat-Bold" }}>
                     {totalItems - damagedItems}
                  </Text>
               </View>

               <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                     name="image-broken-variant"
                     type="material-community"
                     color="crimson"
                     size={20}
                     style={{ marginRight: 5 }}
                  />
                  <Text style={{ fontFamily: "Montserrat-Bold" }}>
                     {damagedItems}
                  </Text>
               </View>
            </View>
            <LinearProgress
               value={(totalItems - damagedItems) / totalItems}
               color="green"
               style={{ height: 10 }}
            />
            <View style={{ flexDirection: "row", justifyContent: "center" }}>
               <Text style={{ fontFamily: "Montserrat-Regular" }}>
                  <Text style={{ fontFamily: "Montserrat-Bold" }}>
                     {totalItems}
                  </Text>{" "}
                  Units
               </Text>
            </View>
         </View>
      </View>
   );
}

function SummaryPageButtons() {
   const buttonList = [
      {
         title: "Email",
         icon: "email",
         iconType: "material",
      },
      {
         title: "Print",
         icon: "print",
         iconType: "material",
      },
   ];

   return (
      <>
         <View style={styles.buttonContainer}>
            {buttonList.map((button, index) => (
               <Button
                  key={index}
                  icon={{
                     name: button.icon,
                     type: button.iconType,
                     color: "white",
                  }}
                  title={button.title}
                  titleStyle={{
                     fontFamily: "Montserrat-Bold",
                  }}
                  buttonStyle={{
                     backgroundColor: "dodgerblue",
                     borderRadius: 10,
                  }}
               />
            ))}
         </View>
      </>
   );
}

function SummaryCard({ serialNum, item }) {
   // serialNum not used yet
   const damaged = item.damagedQty > 0;
   function compressText(text, size) {
      return text.length > size ? text.slice(0, size) + "..." : text;
   }

   return (
      <View style={damaged ? styles.damagedCard : styles.card}>
         <Text style={styles.cardTitle}>
            {compressText(item.info.name, 15)}
         </Text>

         <Text style={styles.cardId}>{item.id}</Text>

         <View style={styles.cardContent}>
            <Text style={styles.cardContentText}>
               Units:{" "}
               <Text style={{ fontFamily: "Montserrat-Bold" }}>{item.qty}</Text>
            </Text>
            <Text style={styles.cardContentText}>
               Damaged:{" "}
               <Text
                  style={{
                     fontFamily: "Montserrat-Bold",
                     color: damaged && "red",
                  }}
               >
                  {item.damagedQty}
               </Text>
            </Text>
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   // Summary Styles
   summaryHeading: {
      fontSize: 20,
      fontFamily: "Montserrat-Bold",
      color: "black",
   },
   summarySubHeading: {
      fontSize: 15,
      fontFamily: "Montserrat-Bold",
      color: "grey",
   },
   chipDate: {
      fontSize: 15,
      fontFamily: "Montserrat-Bold",
      color: "grey",
   },
   summaryText: {
      fontSize: 15,
      fontFamily: "Montserrat-Medium",
      color: "black",
   },
   summaryContainer: {
      backgroundColor: "white",
      margin: 10,
      padding: 10,
   },
   summaryContentContainer: {
      marginHorizontal: 5,
      marginVertical: 10,
   },

   // Card Styles
   card: {
      backgroundColor: "white",
      width: 180,
      padding: 15,
      margin: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "silver",
      elevation: 5,
   },
   damagedCard: {
      backgroundColor: "white",
      width: 180,
      padding: 15,
      margin: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "crimson",
      elevation: 5,
   },
   dmgChipText: {
      fontFamily: "Montserrat-Regular",
      fontSize: 8,
   },
   cardTitle: {
      fontSize: 15,
      fontFamily: "Montserrat-Bold",
      color: "black",
   },
   cardId: {
      fontSize: 14,
      fontFamily: "Montserrat-Regular",
      color: "black",
   },
   cardContent: {
      marginTop: 10,
   },
   cardContentText: {
      fontSize: 14,
      fontFamily: "Montserrat-Regular",
      color: "black",
   },

   // Button Styles
   buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      padding: 10,
   },
});
