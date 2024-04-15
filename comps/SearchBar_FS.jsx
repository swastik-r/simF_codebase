import React, { useState } from "react";

// React Native Imports
import { View, Pressable } from "react-native";
import { StyleSheet } from "react-native";

// React Native Elements UI Library
import { Icon, SearchBar } from "@rneui/themed";

// Custom Components
import SortBottomSheet, { CustomBottomSheet } from "./CustomBottomSheet";
import FilterBottomSheet from "./CustomBottomSheet";
import { useAdjustmentDetail } from "../context/DataContext";

export default function SearchBar_FS() {
   const [filterVisible, setFilterVisible] = useState(false);
   const [sortVisible, setSortVisible] = useState(false);
   const {
      searchStr,
      setSearchStr,
      handleSearch,
      sortByDate,
      sortOpts,
      filterData,
      filterOpts,
      reasonFilterOpts,
      statusFilterOpts,
   } = useAdjustmentDetail();

   return (
      <>
         <View style={styles.searchBarAndOpts}>
            <SearchBar
               lightTheme={true}
               round={true}
               placeholder="Search here..."
               containerStyle={{
                  flex: 1,
                  backgroundColor: "transparent",
                  borderBottomColor: "transparent",
               }}
               inputContainerStyle={{
                  height: 40,
               }}
               inputStyle={{ fontFamily: "Montserrat-Medium", fontSize: 16 }}
               searchIcon={{ size: 20 }}
               value={searchStr}
               onChangeText={(text) => {
                  setSearchStr(text), handleSearch(text);
               }}
            />
            {/* Filter Button */}
            <Pressable
               style={styles.chipButton}
               onPress={() => setFilterVisible(true)}
            >
               <Icon name="filter" type="antdesign" size={25} />
            </Pressable>

            {/* Sort Button */}
            <Pressable
               style={styles.chipButton}
               color="blue"
               onPress={() => setSortVisible(true)}
            >
               <Icon name="sort" type="materialcommunity" size={28} />
            </Pressable>
         </View>

         {/* Sort Bottom Sheet */}
         {sortVisible && (
            <CustomBottomSheet
               isVisible={sortVisible}
               setIsVisible={setSortVisible}
               opts={sortOpts}
               func={sortByDate}
            />
         )}

         {/* Filter Bottom Sheet */}
         {filterVisible && (
            <CustomBottomSheet
               isVisible={filterVisible}
               setIsVisible={setFilterVisible}
               opts={statusFilterOpts}
               func={filterData}
            />
         )}
      </>
   );
}

const styles = StyleSheet.create({
   searchBarAndOpts: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      paddingHorizontal: 10,
   },
   chipButton: {
      marginHorizontal: 5,
   },
});
