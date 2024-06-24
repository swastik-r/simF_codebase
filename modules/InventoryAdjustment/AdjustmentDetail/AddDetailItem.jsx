import React, { useState } from "react";
import { View, StyleSheet, Text, FlatList } from "react-native";
import { Button, Image, Input, useTheme } from "@rneui/themed";
import BarcodeCamera from "./CameraView";
import { useAdjustmentDetail } from "../../../context/DataContext";
import { useNavigation } from "@react-navigation/native";

export default function AddDetailItem({ route }) {
   const { id } = route.params;
   const { sampleDetailItems } = useAdjustmentDetail();
   const [searchText, setSearchText] = useState("");
   const [suggestions, setSuggestions] = useState([]);
   const [selectedItem, setSelectedItem] = useState(null);

   function handleSearch(text) {
      setSearchText(text);
      if (text.length > 0) {
         const matchedItems = sampleDetailItems.filter((item) =>
            item.id.includes(text)
         );
         setSuggestions(matchedItems);
         setSelectedItem(null);
      } else {
         setSuggestions([]);
      }
   }

   function handleSelectItem(item) {
      setSelectedItem(item);
      setSuggestions([]);
   }

   return (
      <>
         <BarcodeCamera route={{ params: { adjustmentId: id } }} />
         <View style={styles.manualContainer}>
            <View
               style={{
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
               }}
            >
               <Text
                  style={{
                     fontFamily: "Montserrat-Bold",
                     color: "white",
                     fontSize: 15,
                     marginBottom: 10,
                  }}
               >
                  Add items manually
               </Text>
               <Input
                  placeholder="Enter an Item ID"
                  inputStyle={{
                     fontFamily: "Montserrat-Regular",
                     textAlign: "center",
                  }}
                  inputContainerStyle={{
                     backgroundColor: "white",
                     borderRadius: 10,
                  }}
                  onChangeText={handleSearch}
                  value={searchText}
               />
               {selectedItem && <ItemCard item={selectedItem} id={id} />}
            </View>
            <FlatList
               data={suggestions}
               renderItem={({ item }) => <ItemCard item={item} id={id} />}
               keyExtractor={(item) => item.id}
               style={{ width: "100%" }}
               showsVerticalScrollIndicator={false}
               contentContainerStyle={{ paddingBottom: 100 }}
            />
         </View>
      </>
   );
}

function ItemCard({ item, id }) {
   const { theme } = useTheme();
   const { itemImage, addDetailItem, sizeMap } = useAdjustmentDetail();
   const navigation = useNavigation();

   // Function
   function capitalize(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
   }

   return (
      <View style={styles.itemCard}>
         <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
               source={itemImage[item.info.name]}
               resizeMode="cover"
               style={{
                  width: 60,
                  height: 60,
                  marginRight: 20,
               }}
            />
            <View>
               <View style={{ flexDirection: "row", marginBottom: 5 }}>
                  <Text style={styles.label}>ID</Text>
                  <Text style={styles.value}>{item.id}</Text>
               </View>
               <View>
                  <Text style={styles.itemName}>{item.info.name}</Text>
                  <Text style={styles.itemInfo}>
                     Color: {capitalize(item.info.color)}
                  </Text>
                  <Text style={styles.itemInfo}>
                     Size: {sizeMap[item.info.size]}
                  </Text>
               </View>
            </View>
         </View>
         <Button
            type="outline"
            buttonStyle={{
               borderColor: theme.colors.primary,
               borderRadius: 10,
            }}
            title="Add"
            titleStyle={{ fontFamily: "Montserrat-Bold", fontSize: 12 }}
            icon={{
               name: "plus-thick",
               size: 18,
               type: "material-community",
            }}
            containerStyle={{
               alignSelf: "flex-start",
               marginLeft: 10,
            }}
            onPress={() => {
               addDetailItem(item, id);
               navigation.goBack();
            }}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   manualContainer: {
      flex: 1,
      backgroundColor: "#112d4eaa",
      paddingHorizontal: 20,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent: "space-evenly",
   },
   itemCard: {
      flexDirection: "row",
      padding: 10,
      backgroundColor: "white",
      borderRadius: 10,
      marginVertical: 5,
      justifyContent: "space-between",
   },
   label: {
      color: "grey",
      fontFamily: "Montserrat-Regular",
      fontSize: 12,
   },
   value: {
      fontFamily: "Montserrat-Bold",
      fontSize: 12,
      marginLeft: 5,
   },
   itemName: {
      fontFamily: "Montserrat-Medium",
   },
   itemInfo: {
      fontFamily: "Montserrat-Regular",
      fontSize: 12,
      color: "grey",
   },
});
