import { createStackNavigator } from "@react-navigation/stack";
import ListingPage from "../../page/Listing/Listing";
import ItemListing from "../../page/ItemListing/ItemListing";
import AddItem from "../../page/AddItem/AddItem";
import { screenOptions } from "../../screenOptions";

import { View, Text, StyleSheet } from "react-native";
import { Divider, Icon, Image } from "@rneui/themed";

const Stack = createStackNavigator();

export default function PoNavigator() {
   return (
      <Stack.Navigator
         initialRouteName="PO Listing"
         screenOptions={screenOptions}
      >
         <Stack.Screen
            name="PO Listing"
            children={() => <ListingPage type={"PO"} />}
            options={{ headerShown: false }}
         />
         <Stack.Screen
            name="PO Items"
            component={ItemListing}
            options={{
               title: "ITEMS",
            }}
         />
         <Stack.Screen
            name="PO Summary"
            component={ItemListing}
            options={{
               title: "SUMMARY",
            }}
         />
         <Stack.Screen
            name="Add Items"
            component={AddItem}
            options={{
               title: "Add Items to IA",
            }}
         />
      </Stack.Navigator>
   );
}

// export default function PoNavigator() {
//    return (
//       <>
//          <PoCard />
//          <AsnCard />
//       </>
//    );
// }

function PoCard() {
   const data = {
      id: "PO123456789",
      status: "Received",
      dateOfCreation: "2021-09-01",
      dateOfReceiving: "2021-09-02",
      totalItems: 10,
      totalQuantity: 100,
   };

   function InfoContainer(label, value) {
      return (
         <View style={poCard.infoContainer}>
            <Text style={poCard.infoLabel}>{label}</Text>
            <Text style={poCard.infoValue}>{value}</Text>
         </View>
      );
   }

   return (
      <View style={poCard.card}>
         {/* Header */}
         <View style={poCard.header}>
            {/* PO ID */}
            <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 15 }}>
               {data.id}
            </Text>
            {/* Status */}
            <View style={poCard.statusContainer}>
               <Text style={poCard.statusTitle}>Received</Text>
            </View>
         </View>

         {/* Divider */}
         <Divider style={{ marginBottom: 10 }} />

         {/* Body */}
         <View style={poCard.bodyContainer}>
            {/* Body Left */}
            <View style={{ flex: 1 }}>
               {InfoContainer("Date of Creation", data.dateOfCreation)}
               {InfoContainer("Date of Receiving", data.dateOfReceiving)}
            </View>
            {/* Body Right */}
            <View style={{ flex: 1 }}>
               {InfoContainer("Total Items", data.totalItems)}
               {InfoContainer("Total Quantity", data.totalQuantity)}
            </View>
         </View>
      </View>
   );
}

function AsnCard() {
   const data = {
      // id, name, color, size, image, ASN Quantity, scanned quantity
      id: "ITEM-123456789",
      name: "Item Name",
      color: "Black",
      size: "XL",
      image: "https://5.imimg.com/data5/VZ/QH/TT/SELLER-55797890/mens-square-check-shirt-1000x1000.jpg",
      asnQuantity: 100,
      scannedQuantity: 99,
   };
   const bodyInfo = {
      Expected: "asnQuantity",
      Received: "scannedQuantity",
   };

   const isComplete = data.asnQuantity === data.scannedQuantity;

   return (
      <View style={asnCard.card}>
         <View
            style={{
               flexDirection: "row",
               justifyContent: "space-between",
               alignItems: "center",
            }}
         >
            <View>
               <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 15 }}>
                  {data.id}
               </Text>
               <View style={{ flexDirection: "row", marginTop: 0 }}>
                  <Text
                     style={{ fontFamily: "Montserrat-Medium", fontSize: 15 }}
                  >
                     {data.name} |
                  </Text>
                  <Text
                     style={{
                        fontFamily: "Montserrat-Medium",
                        marginLeft: 5,
                        fontSize: 15,
                     }}
                  >
                     {data.color} |
                  </Text>
                  <Text
                     style={{
                        fontFamily: "Montserrat-Medium",
                        marginLeft: 5,
                        fontSize: 15,
                     }}
                  >
                     {data.size}
                  </Text>
               </View>
            </View>

            <View>
               {isComplete ? (
                  <Icon
                     name="check-circle"
                     type="material-community"
                     color={"green"}
                     size={30}
                  />
               ) : (
                  <Icon
                     name="progress-clock"
                     type="material-community"
                     color={"orange"}
                     size={30}
                  />
               )}
            </View>
         </View>

         <Divider style={{ marginVertical: 15 }} />

         <View style={{ flexDirection: "row" }}>
            {/* Item Image */}
            <Image
               source={{ uri: data.image }}
               containerStyle={asnCard.imageContainer}
               style={{ width: 100, height: 100 }}
            />

            {/* Item Info */}
            <View></View>
            <View style={{ flexDirection: "row", flex: 1 }}>
               <View
                  style={{
                     flex: 1,
                     alignItems: "center",
                  }}
               >
                  <Text
                     style={{
                        fontFamily: "Montserrat-Medium",
                        fontSize: 18,
                     }}
                  >
                     Expected
                  </Text>
                  <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 23 }}>
                     {data.asnQuantity}
                  </Text>
               </View>
               <View style={{ flex: 1, alignItems: "center" }}>
                  <Text
                     style={{
                        fontFamily: "Montserrat-Medium",
                        fontSize: 18,
                     }}
                  >
                     Received
                  </Text>
                  <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 23 }}>
                     {data.scannedQuantity}
                  </Text>
               </View>
            </View>
         </View>
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
      margin: 15,
   },
   header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
   },
   statusContainer: {
      backgroundColor: "green",
      paddingHorizontal: 5,
      paddingVertical: 2,
      width: 100,
      alignItems: "center",
   },
   statusTitle: {
      fontFamily: "Montserrat-Regular",
      color: "white",
      textTransform: "uppercase",
   },
   bodyContainer: {
      flexDirection: "row",
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

const asnCard = StyleSheet.create({
   card: {
      backgroundColor: "white",
      borderWidth: 2,
      borderColor: "rgba(0, 0, 0, 0.2)",
      borderRadius: 10,
      padding: 15,
      margin: 15,
   },
   imageContainer: {
      marginRight: 10,
      borderWidth: 1,
      borderColor: "grey",
      borderRadius: 20,
   },
});
