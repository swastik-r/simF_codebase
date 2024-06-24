import { Divider, Icon } from "@rneui/themed";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAdjustmentDetail } from "../../../context/DataContext";

export default function AdjustmentCard2({ item }) {
   // States and Vars
   const navigation = useNavigation();
   const { reasonMap } = useAdjustmentDetail();

   // Functions
   function dateString(date) {
      // Convert date string to the format "1 May / 24"
      const newDate = new Date(date);
      const month = newDate.toLocaleString("default", { month: "short" });
      // only last two digits of the year required
      const year = newDate.getFullYear().toString().slice(-2);
      return `${newDate.getDate()} ${month} / ${year}`;
   }
   function getReason(reason) {
      return reasonMap[reason];
   }

   return (
      <View style={styles.card}>
         <View style={styles.cardLeft}>
            <View style={styles.cardLeftTop}>
               <InfoContainer title={"ID: "} value={item.id} />
               <InfoContainer title={"Date: "} value={dateString(item.date)} />
            </View>
            <Divider color={"white"} width={1} />
            <View style={styles.cardLeftBottom}>
               <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <InfoContainer title={"Status: "} />
                  <ProgressChip progress={item.progress} />
               </View>
               <InfoContainer
                  title={"Reason: "}
                  value={getReason(item.reason)}
               />
            </View>
         </View>
         <Pressable
            onPress={
               item.progress === "complete"
                  ? () => {
                       navigation.navigate("Adjustment Summary", {
                          id: item.id,
                       });
                    }
                  : () => {
                       navigation.navigate("Adjustment Detail", {
                          id: item.id,
                       });
                    }
            }
            style={styles.cardRight}
         >
            <Text style={styles.unitCount}>{item.totalSKU}</Text>
            <Text style={styles.unitLabel}>Units</Text>
            <Icon
               name="arrow-right-box"
               type="material-community"
               size={25}
               color={"#112d4e"}
               containerStyle={{ marginTop: 5 }}
            />
         </Pressable>
      </View>
   );
}

function InfoContainer({ title, value }) {
   return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
         <Text style={styles.textRegular}>{title}</Text>
         <Text style={styles.textBold}>{value}</Text>
      </View>
   );
}

function ProgressChip({ progress }) {
   const chipData = {
      complete: {
         icon: "check",
         color: "#228B22",
         textColor: "white",
      },
      inProgress: {
         icon: "progress-clock",
         color: "#fce205",
         textColor: "#000011",
      },
   };

   return (
      <View
         style={{
            padding: 2,
            borderRadius: 999,
            backgroundColor: chipData[progress].color,
         }}
      >
         <Text
            style={{
               fontFamily: "Montserrat-Medium",
               fontSize: 12,
               color: chipData[progress].textColor,
               paddingHorizontal: 5,
            }}
         >
            {progress === "complete" ? "Complete" : "In Progress"}
         </Text>
      </View>
   );
}

const styles = StyleSheet.create({
   card: {
      marginHorizontal: 10,
      marginVertical: 3,
      flexDirection: "row",
   },
   cardLeft: {
      width: "80%",
      backgroundColor: "#112d4ebb",
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      justifyContent: "space-between",
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
      backgroundColor: "#ffffffcc",
      flex: 1,
      padding: 5,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      alignItems: "center",
   },
   unitCount: {
      fontSize: 18,
      fontFamily: "Montserrat-Bold",
      color: "#112d4e",
   },
   unitLabel: {
      fontSize: 12,
      fontFamily: "Montserrat-Regular",
      color: "#112d4e",
   },
   textRegular: {
      color: "white",
      fontFamily: "Montserrat-Regular",
   },
   textBold: {
      color: "white",
      fontFamily: "Montserrat-Bold",
   },
});
