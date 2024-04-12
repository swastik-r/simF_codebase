import { StyleSheet, View, Text, Pressable } from "react-native";
import { Card, Chip, Icon } from "@rneui/themed";
import { CardDivider } from "@rneui/base/dist/Card/Card.Divider";
import { useNavigation } from "@react-navigation/native";

export default function AdjustmentCard({ item }) {
   const navigation = useNavigation();
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
                  <Text style={styles.cardData}>{item.reason}</Text>
               </View>
            </View>

            <View style={{ alignItems: "center" }}>
               <Text style={styles.cardTitle}>Total SKU</Text>
               <Text
                  style={[
                     styles.cardData,
                     { fontFamily: "Montserrat-Bold", fontSize: 18 },
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
            />
         </Pressable>
      </Card>
   );
}

// Chip component to display progress
function ProgressChip({ progress }) {
   const chipData = {
      complete: {
         title: "Complete",
         color: "#1a8a01",
         titleColor: "white",
      },
      inProgress: {
         title: "In Progress",
         color: "#ffbb00",
         titleColor: "black",
      },
      pending: {
         title: "Pending",
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
      fontFamily: "Montserrat-Medium",
      fontSize: 18,
      color: "black",
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
      margin: 4,
   },
   cardTitle: {
      color: "black",
      fontFamily: "Montserrat-Medium",
   },
   cardData: {
      fontSize: 16,
      color: "black",
      fontFamily: "Montserrat-Regular",
   },
   chipTitle: {
      fontSize: 12,
      fontFamily: "Montserrat-Bold",
   },
});
