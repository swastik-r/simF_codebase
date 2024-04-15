import { Text, FlatList, StyleSheet, View } from "react-native";
import SummaryCard from "./comps/SummaryCard";
import { useAdjustmentDetail } from "../../context/DataContext";
import { Button, Icon } from "@rneui/themed";

export default function AdjustmentSummaryPage({ route }) {
   const { data } = useAdjustmentDetail();
   const { id } = route.params;
   const adjustment = data.find((item) => item.id === id);
   const listData = adjustment.detailItems;

   return (
      <FlatList
         data={listData}
         keyExtractor={(item) => item.id}
         renderItem={({ item, index }) => (
            <SummaryCard item={item} serialNumber={index + 1} />
         )}
         ListHeaderComponent={
            <>
               <SummaryDetails adjustment={adjustment} />
               <SummaryPageButtons />
            </>
         }
      />
   );
}

function SummaryDetails({ adjustment }) {
   const { reasonMap } = useAdjustmentDetail();

   function dateString(date) {
      // Convert date string to the format "1 May 2024"
      return new Date(date).toLocaleDateString("en-GB", {
         day: "numeric",
         month: "short",
         year: "numeric",
      });
   }

   function reasonString(reason) {
      return reasonMap[reason];
   }

   const info = [
      {
         title: "ID",
         text: adjustment.id,
      },
      {
         title: "Total SKU",
         text: adjustment.totalSKU,
      },
      {
         title: "Reason Code",
         text: reasonString(adjustment.reason),
      },
      {
         title: "Adjustment Date",
         text: dateString(adjustment.date),
      },
   ];

   return (
      <View style={styles.detailsContainer}>
         {info.map((item, index) => (
            <View key={index} style={styles.infoContainer}>
               <Text style={styles.detailTitle}>{item.title}</Text>
               <Text style={styles.detailText}>{item.text}</Text>
            </View>
         ))}
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
                  size="sm"
                  icon={
                     <Icon
                        name={button.icon}
                        type={button.iconType}
                        color="white"
                     />
                  }
                  title={button.title}
                  titleStyle={{
                     fontFamily: "Montserrat-Medium",
                     marginHorizontal: 5,
                  }}
                  buttonStyle={{
                     backgroundColor: "dodgerblue",
                  }}
               />
            ))}
         </View>
      </>
   );
}

const styles = StyleSheet.create({
   buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      padding: 10,
   },
   detailsContainer: {
      margin: 15,
      padding: 10,
      borderWidth: 1,
      borderRadius: 5,
   },
   infoContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 2,
   },
   detailTitle: {
      fontFamily: "Montserrat-Bold",
      fontSize: 12,
      color: "rgba(0, 0, 0, 0.8)",
   },
   detailText: {
      fontFamily: "Montserrat-Medium",
      fontSize: 15,
      color: "rgba(0, 0, 0, 0.8)",
   },
});
