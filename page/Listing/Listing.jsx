import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, ImageBackground } from "react-native";
import { FAB } from "@rneui/themed";
import ListingCard from "./ListingCard";
import { useTheme } from "@rneui/themed";
import EmptyPageComponent from "../../globalComps/EmptyPageComp";
import SearchBar from "./SearchBar_FS";
import { fetchData, createEntry } from "../../context/functions";
import { useIsFocused } from "@react-navigation/native";

export default function ListingPage({ type }) {
   // auto-refresh on focus
   const isFocused = useIsFocused();
   useEffect(() => {
      if (isFocused) {
         foo();
      }
   }, [isFocused]);

   // States and Vars
   const { theme } = useTheme();
   const [listingData, setListingData] = useState([]);

   // Functions
   async function foo() {
      setListingData(await fetchData(type));
   }
   async function handleCreate() {
      await createEntry(type);
      foo();
   }

   const showCreateFab = type != "PO";

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

         {/* FAB: Add a new adjustment */}
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
      </ImageBackground>
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
