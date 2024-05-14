import React, { useEffect, useState } from "react";
import {
   View,
   TextInput,
   StyleSheet,
   FlatList,
   Text,
   Pressable,
} from "react-native";
import { Button } from "@rneui/themed";
import { useAdjustmentDetail } from "../../../context/DataContext";
import { useNavigation } from "@react-navigation/native";

export default function ManualSearch({ route }) {
   const { sampleDetailItems } = useAdjustmentDetail();
   const [searchStr, setSearchStr] = useState("");
   const [filteredItems, setFilteredItems] = useState([]);
   const { adjustmentId } = route.params;

   function handleDetailItemSearch(searchStr) {
      if (searchStr === "") return setFilteredItems([]);
      const newFilteredItems = sampleDetailItems.filter((item) => {
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
                  <SuggestionTab item={item} adjustmentId={adjustmentId} />
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

function SuggestionTab({ item, adjustmentId }) {
   const { sizeMap, addDetailItem } = useAdjustmentDetail();
   const navigation = useNavigation();
   // capitalise the first letter of the color
   const color =
      item.info.color.charAt(0).toUpperCase() + item.info.color.slice(1);
   const size = sizeMap[item.info.size];

   return (
      <Pressable style={styles.suggestionTab}>
         <Text style={styles.tabTitle}>{item.id}</Text>
         <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
         >
            <View>
               <Text style={styles.tabContent}>{item.info.name}</Text>
               <Text style={styles.tabContent}>
                  {color} / {size}
               </Text>
            </View>

            <Button
               buttonStyle={{ borderRadius: 5 }}
               title="ADD"
               titleStyle={{ fontFamily: "Montserrat-Bold", fontSize: 12 }}
               icon={{
                  name: "plus-circle-outline",
                  size: 18,
                  type: "material-community",
                  color: "white",
               }}
               onPress={() => {
                  addDetailItem(item, adjustmentId),
                     navigation.navigate("Adjustment Detail", {
                        id: adjustmentId,
                     });
               }}
            />
         </View>
      </Pressable>
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
      borderRadius: 5,
      marginVertical: 5,
   },
   tabTitle: {
      fontFamily: "Montserrat-Bold",
   },
   tabContent: {
      fontFamily: "Montserrat-Regular",
   },
});
