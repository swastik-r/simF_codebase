import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, FlatList, Text } from "react-native";
import { Button } from "@rneui/themed";
import { useAdjustmentDetail } from "../../../context/DataContext";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export default function ManualSearch({ route }) {
   const { sampleDsdItems } = useAdjustmentDetail();
   const [searchStr, setSearchStr] = useState("");
   const [filteredItems, setFilteredItems] = useState([]);
   const { dsdId } = route.params;

   function handleDetailItemSearch(searchStr) {
      if (searchStr === "") return setFilteredItems([]);
      const newFilteredItems = sampleDsdItems.filter((item) => {
         return (
            item.id.toLowerCase().includes(searchStr.toLowerCase()) ||
            item.info.name.toLowerCase().includes(searchStr.toLowerCase())
         );
      });
      setFilteredItems(newFilteredItems);
   }

   // to search for the searchStr
   useEffect(() => {
      handleDetailItemSearch(searchStr);
   }, [searchStr]);

   return (
      <View style={styles.searchContainer}>
         <View style={styles.searchBar}>
            <FlatList
               data={filteredItems}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => (
                  <SuggestionTab item={item} dsdId={dsdId} />
               )}
               style={{ width: "100%", marginTop: 20 }}
               ListHeaderComponent={
                  <TextInput
                     style={styles.searchInput}
                     placeholder="Search SKU or Name"
                     onChangeText={(text) => {
                        setSearchStr(text);
                     }}
                  />
               }
            />
         </View>
      </View>
   );
}

function SuggestionTab({ item, dsdId }) {
   // States and Variables
   const { dsdData, setDsdData, sizeMap } = useAdjustmentDetail();
   const navigation = useNavigation();
   const color =
      item.info.color.charAt(0).toUpperCase() + item.info.color.slice(1);
   const size = sizeMap[item.info.size];

   // Functions
   function addDsdItem(item, dsdId) {
      console.log("Adding Item: ", item);
      const updatedDsdData = dsdData.map((dsd) => {
         if (dsd.id === dsdId) {
            const existingItem = dsd.dsdItems.find(
               (dsdItem) => dsdItem.id === item.id
            );
            console.log("Existing Item: ", existingItem);
            if (existingItem) {
               existingItem.qty += item.qty;
               console.log("Existing Item Updated: ", existingItem);
            } else {
               dsd.dsdItems.push(item);
               console.log("New Item Added: ", item);
            }
            dsd.units += item.qty;
            console.log("DSD Units Updated: ", dsd.units);
         }
         return dsd;
      });
      setDsdData(updatedDsdData);
      Toast.show({
         type: "success",
         position: "bottom",
         text1: "Item Added",
         text2: `${item.info.name} added to DSD : ${dsdId}`,
         visibilityTime: 3000,
      });
   }

   return (
      <View style={styles.suggestionTab}>
         <View>
            <Text style={styles.tabTitle}>{item.id}</Text>
            <View>
               <Text style={styles.tabContent}>{item.info.name}</Text>
               <Text style={styles.tabContent}>
                  {color} / {size}
               </Text>
            </View>
         </View>
         <Button
            buttonStyle={{ borderRadius: 50, backgroundColor: "green" }}
            title="ADD"
            titleStyle={{ fontFamily: "Montserrat-Bold", fontSize: 12 }}
            icon={{
               name: "plus-thick",
               size: 18,
               type: "material-community",
               color: "white",
            }}
            onPress={() => {
               addDsdItem(item, dsdId), navigation.goBack();
            }}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   searchContainer: {
      flex: 1,
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
   },
   searchBar: {
      width: "90%",
      height: "90%",
      backgroundColor: "white",
      borderRadius: 10,
   },
   searchInput: {
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
   },
   suggestionTab: {
      padding: 10,
      marginVertical: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   tabTitle: {
      fontFamily: "Montserrat-Bold",
   },
   tabContent: {
      fontFamily: "Montserrat-Regular",
   },
});
