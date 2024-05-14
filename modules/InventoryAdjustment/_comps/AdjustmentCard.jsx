import { StyleSheet, View, Text, Pressable } from "react-native";
import { Card, Chip, Icon } from "@rneui/themed";
import { CardDivider } from "@rneui/base/dist/Card/Card.Divider";
import { useNavigation } from "@react-navigation/native";
import { useAdjustmentDetail } from "../../../context/DataContext";

export default function AdjustmentCard({ item }) {
   const navigation = useNavigation();
   const { reasonMap } = useAdjustmentDetail();

   function reasonString(reason) {
      return reasonMap[reason];
   }

   function dateString(date) {
      // Convert date string to the format "1 May 2024"
      return new Date(date).toLocaleDateString("en-GB", {
         day: "numeric",
         month: "short",
         year: "numeric",
      });
   }

   return (
      <Card
         containerStyle={{
            borderRadius: 15,
            marginVertical: 10,
            backgroundColor: "white",
            elevation: 5,
         }}
      >
         <View style={styles.cardHeader}>
            <Text style={styles.cardId}>{item.id}</Text>
            <ProgressChip progress={item.progress} />
         </View>

         <CardDivider />

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
            style={styles.cardContentContainer}
         >
            <View>
               <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Date</Text>
                  <Text style={styles.cardData}>{dateString(item.date)}</Text>
               </View>
               <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>Reason</Text>
                  <Text style={styles.cardData}>
                     {reasonString(item.reason)}
                  </Text>
               </View>
            </View>

            <View
               style={{
                  flexDirection: "row",
                  alignItems: "center",
               }}
            >
               <View style={{ alignItems: "center" }}>
                  <Text style={styles.cardTitle}>Quantity</Text>
                  <Text
                     style={[
                        styles.cardData,
                        { fontFamily: "Montserrat-Bold", fontSize: 15 },
                     ]}
                  >
                     {item.totalSKU}
                  </Text>
               </View>

               <Icon
                  name="arrow-forward-ios"
                  type="material"
                  size={25}
                  color="black"
                  style={{ marginLeft: 20 }}
               />
            </View>
         </Pressable>
      </Card>
   );
}

// Chip component to display adjustment's progress
function ProgressChip({ progress }) {
   const chipData = {
      complete: {
         title: "COMPLETE",
         color: "#1a8a01",
         titleColor: "white",
      },
      inProgress: {
         title: "IN PROGRESS",
         color: "#ffbb00",
         titleColor: "black",
      },
      pending: {
         title: "PENDING",
         color: "#ff0000",
         titleColor: "white",
      },
   };

   return (
      <Chip
         title={chipData[progress].title}
         type="solid"
         color={chipData[progress].color}
         titleStyle={[
            {
               color: chipData[progress].titleColor,
            },
            styles.chipTitle,
         ]}
         radius="sm"
         buttonStyle={{
            // Decrease padding for chip
            padding: 2,
         }}
      />
   );
}

const styles = StyleSheet.create({
   cardId: {
      fontFamily: "Montserrat-Bold",
      color: "black",
      fontSize: 16,
   },
   cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
   },
   cardContentContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   cardContent: {
      margin: 2,
   },
   cardTitle: {
      color: "black",
      fontFamily: "Montserrat-Regular",
   },
   cardData: {
      color: "black",
      fontFamily: "Montserrat-Medium",
   },
   chipTitle: {
      fontSize: 10,
      fontFamily: "Montserrat-Bold",
   },
});
