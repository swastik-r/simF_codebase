import React, { useEffect, useState } from "react";
import {
   View,
   Text,
   StyleSheet,
   FlatList,
   ImageBackground,
} from "react-native";
import { FAB, Overlay, Icon, Input, Button } from "@rneui/themed";
import ListingCard from "./ListingCard";
import { useTheme } from "@rneui/themed";
import EmptyPageComponent from "../../globalComps/EmptyPageComp";
import SearchBar from "./SearchBar_FS";
import { fetchData, createEntry } from "../../context/functions";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { postData, storeName, userName } from "../../context/auth";
import { endpoints } from "../../context/endpoints";
import { getData } from "../../context/auth";

export default function ListingPage({ type }) {
   // auto-refresh listing data on focus
   const isFocused = useIsFocused();
   useEffect(() => {
      if (isFocused) {
         foo();
      }
   }, [isFocused]);

   // States and Vars
   const { theme } = useTheme();
   const [listingData, setListingData] = useState([]);
   const navigation = useNavigation();
   const pageMap = {
      IA: {
         "In Progress": "IA Items",
      },
      DSD: {
         "In Progress": "DSD Items",
      },
      TSFIN: {
         "In Progress": "Transfer Items",
      },
   };

   // Functions
   async function foo() {
      setListingData(await fetchData(type));
   }
   async function handleCreate() {
      try {
         if (type !== "TSFIN") {
            const response = await createEntry(type);
            navigation.navigate(pageMap[type][response.status], {
               entryItem: response,
            });
         } else {
            // open the TSF Supplier Search Overlay
            setSupplierOverlay(true);
         }
      } catch (error) {
         console.error("Failed to create entry", error);
      }
   }

   // FAB: No FAB on PO and TSFOUT
   const nonCreatePages = ["PO", "TSFOUT"];
   const showCreateFab = !nonCreatePages.includes(type);

   // Supplier Overlay States
   const [supplierOverlay, setSupplierOverlay] = useState(false);

   return (
      <ImageBackground
         source={require("../../assets/bg3.jpg")}
         style={{ flex: 1 }}
      >
         <FlatList
            data={listingData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ListingCard {...{ item, foo }} />}
            ListHeaderComponent={<SearchBar {...{ type, setListingData }} />}
            ListEmptyComponent={<EmptyPageComponent />}
            contentContainerStyle={{
               paddingTop: 10,
               paddingBottom: 150,
               paddingHorizontal: 15,
            }}
         />

         {/* FAB: Add a new entry */}
         {showCreateFab && (
            <FAB
               title={"Create"}
               titleStyle={{
                  fontFamily: "Montserrat-Bold",
               }}
               color={"#f0f0f0"}
               style={styles.fab}
               icon={{
                  name: "playlist-add-circle",
                  color: "white",
                  size: 32,
               }}
               buttonStyle={{
                  backgroundColor: theme.colors.primary,
                  borderRadius: 20,
                  width: 120,
                  justifyContent: "space-evenly",
               }}
               onPress={handleCreate}
            />
         )}

         {/* Supplier Overlay */}
         {type === "TSFIN" && (
            <TsfSupplierOverlay
               {...{
                  supplierOverlay,
                  setSupplierOverlay,
               }}
            />
         )}
      </ImageBackground>
   );
}

function TsfSupplierOverlay({ supplierOverlay, setSupplierOverlay }) {
   // States and vars
   const navigation = useNavigation();
   const [suggestions, setSuggestions] = useState([]);
   const [tsfSupplier, setTsfSupplier] = useState("");

   // Functions
   async function handleSupplierIdChange(text) {
      try {
         // Trim the input text to remove any leading or trailing whitespace
         const trimmedText = text.trim();

         // Set the supplier ID state
         setTsfSupplier(trimmedText);

         // If the trimmed text is not empty, proceed with fetching data
         if (trimmedText) {
            const data = await getData(
               `${endpoints.fetchStores}${trimmedText}`
            );

            // Check if data is an object and convert it to an array of objects for FlatList
            if (data && typeof data === "object") {
               const formattedSuggestions = Object.entries(data).map(
                  ([key, value]) => ({ id: key, name: value })
               );
               setSuggestions(formattedSuggestions);
            } else {
               setSuggestions([]);
            }
         } else {
            // If the trimmed text is empty, reset suggestions
            setSuggestions([]);
         }
      } catch (error) {
         console.error("Error fetching suppliers:", error);

         // Display an alert to the user in case of an error
         Alert.alert(
            "Error",
            "An error occurred while fetching suppliers. Please try again."
         );

         // Reset suggestions in case of an error
         setSuggestions([]);
      }
   }
   async function handleCreateTsf(tsfSupplier) {
      try {
         const response = await postData(
            `${endpoints.createTsf}${storeName}/${userName}/${tsfSupplier}`
         );
         setSupplierOverlay(false);
         navigation.navigate("Transfer Items", { entryItem: response });
      } catch (error) {
         console.error("Failed to create TSF Request", error);
      }
   }

   return (
      <Overlay
         isVisible={supplierOverlay}
         overlayStyle={{ width: "70%", padding: 20 }}
      >
         <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <Icon
               name="warehouse"
               type="material-community"
               size={28}
               iconStyle={{ marginRight: 10 }}
            />
            <Text
               style={{
                  fontFamily: "Montserrat-Bold",
                  fontSize: 20,
                  marginBottom: 15,
               }}
            >
               Select From Store
            </Text>
         </View>
         <Input
            inputStyle={{
               fontFamily: "Montserrat-Regular",
               fontSize: 16,
               textAlign: "center",
            }}
            placeholder="Enter a store name"
            value={tsfSupplier}
            onChangeText={handleSupplierIdChange}
         />

         {/* Each suggestion should show the info like: Sup101: ABC Industries */}
         <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <Button
                  type="outline"
                  title={`${item.id}: ${item.name}`}
                  titleStyle={styles.buttonTitle}
                  buttonStyle={[styles.button, { width: "100%" }]}
                  containerStyle={{ margin: 10 }}
                  onPress={() => {
                     handleCreateTsf(item.name);
                  }}
               />
            )}
            ListFooterComponent={
               <Button
                  type="clear"
                  title="Cancel"
                  icon={{
                     name: "close",
                     type: "material-community",
                     color: "crimson",
                  }}
                  buttonStyle={[styles.button, { alignSelf: "center" }]}
                  titleStyle={styles.buttonTitle}
                  onPress={() => {
                     setSupplierOverlay(false);
                  }}
               />
            }
         />
      </Overlay>
   );
}

const styles = StyleSheet.create({
   text: {
      color: "white",
      fontFamily: "Montserrat-Regular",
      fontSize: 20,
   },
   fab: {
      position: "absolute",
      right: 15,
      bottom: 90,
   },
});
