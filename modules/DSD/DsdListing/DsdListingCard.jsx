import { View, Text, StyleSheet, Pressable } from "react-native";
import { Card, Icon } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

export default function DsdCard({ info }) {
   const navigation = useNavigation();

   // get date in "01 Jan 2024" format from timestamp
   function getDate(timestamp) {
      const date = new Date(timestamp);
      // if the date is less than 10, add a 0 before the single digit
      return `${date
         .getDate()
         .toString()
         .padStart(2, "0")} ${date.toLocaleString("default", {
         month: "short",
      })} ${date.getFullYear()}`;
   }

   // get time in "HH:MM AM/PM" format from timestamp
   function getTime(timestamp) {
      const date = new Date(timestamp);
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      return `${hours}:${minutes} ${ampm}`;
   }

   // limit the length of the supplier name to 12 characters
   function limitString(string, length = 6) {
      return string.length > length ? string.slice(0, length) + "..." : string;
   }

   return (
      <Pressable
         onPress={() => {
            if (info.status === "draft") {
               navigation.navigate("DSD Item List", { dsdId: info.id });
            } else {
               navigation.navigate("DSD Summary", { dsdId: info.id });
            }
         }}
      >
         <Card
            containerStyle={
               info.status === "draft" ? styles.draftCard : styles.card
            }
         >
            <View style={styles.cardContent}>
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                  }}
               >
                  <Text style={styles.id}>{info.id}</Text>
                  {info.status === "draft" && (
                     <Icon
                        name="progress-clock"
                        type="material-community"
                        color={"orange"}
                        style={{ marginLeft: 5 }}
                     />
                  )}
               </View>

               <Text style={styles.supplierInfo}>
                  {limitString(info.supplier, 15)}
               </Text>

               <View style={styles.unitContainer}>
                  <Text style={styles.unitCount}>{info.units}</Text>
                  <Text style={styles.unitLabel}>Units</Text>
               </View>

               <View
                  style={{
                     width: "85%",
                     flexDirection: "row",
                     justifyContent: "space-between",
                     alignItems: "center",
                  }}
               >
                  <Icon
                     name="truck-check-outline"
                     type="material-community"
                     color="dodgerblue"
                  />
                  <Text style={styles.date}>{getDate(info.date)}</Text>
               </View>
            </View>
         </Card>
      </Pressable>
   );
}

const styles = StyleSheet.create({
   card: {
      width: 170,
      backgroundColor: "white",
      elevation: 5,
      borderRadius: 15,
   },
   draftCard: {
      width: 170,
      backgroundColor: "white",
      borderRadius: 15,
      borderColor: "orange",
      borderWidth: 2,
   },
   cardContent: {
      justifyContent: "space-between",
      alignItems: "center",
   },
   id: {
      fontSize: 16,
      fontFamily: "Montserrat-Bold",
   },
   supplierInfo: {
      fontSize: 12,
      fontFamily: "Montserrat-Regular",
   },
   unitContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "rgba(30, 144, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 15,
   },
   unitCount: {
      fontSize: 24,
      fontFamily: "Montserrat-Medium",
      color: "dodgerblue",
   },
   unitLabel: {
      fontSize: 12,
      fontFamily: "Montserrat-Regular",
      color: "dodgerblue",
   },
   date: {
      fontSize: 14,
      fontFamily: "Montserrat-Medium",
   },
   time: {
      fontSize: 14,
      fontFamily: "Montserrat-Regular",
   },
});
