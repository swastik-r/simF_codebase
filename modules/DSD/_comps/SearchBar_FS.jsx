import React, { useState } from "react";

// React Native Imports
import { View, Pressable, StyleSheet, Text } from "react-native";

// React Native Elements UI Library
import { Icon, SearchBar, ListItem, Overlay } from "@rneui/themed";

// Custom Components
import { useAdjustmentDetail } from "../../../context/DataContext";
import { BottomSheet, Button } from "@rneui/base";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SearchBar_FS() {
   // States and Vars
   const [searchStr, setSearchStr] = useState("");
   const [sortVisible, setSortVisible] = useState(false);
   const [filterVisible, setFilterVisible] = useState(false);
   const [dateFilterVisible, setDateFilterVisible] = useState(false);
   const [supplierFilterVisible, setSupplierFilterVisible] = useState(false);
   const [statusFilterVisible, setStatusFilterVisible] = useState(false);
   const { dsdData, setDsdData, initialDsdData } = useAdjustmentDetail();

   // Functions
   function handleSearch(text) {
      if (text === "") {
         setDsdData(initialDsdData);
         return;
      }
      // search for the text in the item's supplier name or the id
      const filteredData = dsdData.filter(
         (item) =>
            item.supplier.toLowerCase().includes(text.toLowerCase()) ||
            item.id.toLowerCase().includes(text.toLowerCase())
      );
      setDsdData(filteredData);
   }

   return (
      <>
         <View style={styles.searchBarAndOpts}>
            <SearchBar
               lightTheme={true}
               round={true}
               placeholder="Search an ID or a Supplier"
               containerStyle={{
                  flex: 1,
                  backgroundColor: "transparent",
                  borderTopColor: "transparent",
                  borderBottomColor: "transparent",
               }}
               inputStyle={{
                  fontFamily: "Montserrat-Medium",
                  fontSize: 16,
               }}
               inputContainerStyle={{
                  height: 40,
                  borderRadius: 50,
               }}
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
               <Icon name="filter" type="material-community" />
               <Text
                  style={{
                     fontFamily: "Montserrat-Medium",
                     fontSize: 10,
                  }}
               >
                  FILTER
               </Text>
            </Pressable>

            {/* Sort Button */}
            <Pressable
               style={styles.chipButton}
               color="blue"
               onPress={() => setSortVisible(true)}
            >
               <Icon name="sort" type="materialcommunity" size={25} />
               <Text style={{ fontFamily: "Montserrat-Medium", fontSize: 10 }}>
                  SORT
               </Text>
            </Pressable>
         </View>

         {/* Sort Bottom Sheet */}
         <SortBottomSheet
            sortVisible={sortVisible}
            setSortVisible={setSortVisible}
         />

         {/* Filter Bottom Sheet */}
         {filterVisible && (
            <FilterBottomSheet
               filterVisible={filterVisible}
               setFilterVisible={setFilterVisible}
               setStatusFilterVisible={setStatusFilterVisible}
               setSupplierFilterVisible={setSupplierFilterVisible}
               setDateFilterVisible={setDateFilterVisible}
            />
         )}

         {/* Status Filter Bottom Sheet */}
         {statusFilterVisible && (
            <StatusFilterBottomSheet
               statusFilterVisible={statusFilterVisible}
               setStatusFilterVisible={setStatusFilterVisible}
            />
         )}

         {/* Supplier Filter Bottom Sheet */}
         {supplierFilterVisible && (
            <SupplierFilterBottomSheet
               supplierFilterVisible={supplierFilterVisible}
               setSupplierFilterVisible={setSupplierFilterVisible}
            />
         )}

         {/* Date Filter Bottom Sheet */}
         {dateFilterVisible && (
            <DateFilterBottomSheet
               dateFilterVisible={dateFilterVisible}
               setDateFilterVisible={setDateFilterVisible}
            />
         )}
      </>
   );
}

function SortBottomSheet({ sortVisible, setSortVisible }) {
   // States and Vars
   const sortOpts = [
      {
         title: "Sort by",
         titleStyle: {
            fontFamily: "Montserrat-Regular",
            fontSize: 25,
         },
         containerStyle: [styles.optContainer, { paddingTop: 0 }],
      },
      {
         title: "Sort by latest",
         icon: {
            name: "sort-clock-descending-outline",
            type: "material-community",
            color: "black",
            size: 35,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.optContainer,
         sortType: "latest",
      },
      {
         title: "Sort by oldest",
         icon: {
            name: "sort-clock-descending-outline",
            type: "material-community",
            color: "black",
            size: 35,
            containerStyle: {
               transform: [{ scaleY: -1 }],
            },
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.optContainer,
         sortType: "oldest",
      },
      {
         title: sortApplied ? "Reset Sort" : "Cancel",
         icon: sortApplied
            ? { name: "refresh", type: "material", color: "white" }
            : { name: "cancel", type: "material", color: "white" },
         containerStyle: [styles.optContainer, { backgroundColor: "darkred" }],
         titleStyle: styles.optCancel,
         sortType: "reset",
      },
   ];
   const [sortApplied, setSortApplied] = useState(false);
   const { dsdData, setDsdData, initialDsdData } = useAdjustmentDetail();

   // Functions
   function sortByDate(sortType) {
      if (sortType === "reset") {
         resetSort();
         return;
      }
      const sortedData = [...dsdData];
      sortedData.sort((a, b) => {
         const dateA = new Date(a.date);
         const dateB = new Date(b.date);
         return sortType === "latest" ? dateB - dateA : dateA - dateB;
      });
      setDsdData(sortedData);
      setSortApplied(true);
   }
   function resetSort() {
      setDsdData(initialDsdData);
      setSortApplied(false);
   }

   return (
      <BottomSheet
         isVisible={sortVisible}
         onBackdropPress={() => setSortVisible(false)}
      >
         {sortOpts.map((opt, i) => (
            <ListItem
               key={i}
               containerStyle={opt.containerStyle}
               onPress={() => {
                  sortByDate(opt.sortType);
                  setSortVisible(false);
               }}
            >
               <ListItem.Content>
                  <Icon {...opt.icon} />
                  <ListItem.Title style={opt.titleStyle}>
                     {opt.title}
                  </ListItem.Title>
               </ListItem.Content>
            </ListItem>
         ))}
      </BottomSheet>
   );
}

function FilterBottomSheet({
   filterVisible,
   setFilterVisible,
   setSupplierFilterVisible,
   setDateFilterVisible,
}) {
   // States and Vars
   const { dsdData, setDsdData, initialDsdData } = useAdjustmentDetail();
   const filterOpts = [
      {
         title: "Filter by",
         titleStyle: {
            fontFamily: "Montserrat-Regular",
            fontSize: 25,
         },
         containerStyle: [styles.optContainer, { paddingTop: 0 }],
      },
      {
         title: "Supplier",
         icon: {
            name: "warehouse",
            type: "material-community",
            color: "black",
            size: 30,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.optContainer,
      },
      {
         title: "Date",
         icon: {
            name: "date-range",
            type: "material",
            color: "black",
            size: 30,
         },
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.optContainer,
      },
      {
         title: "Reset Filter",
         icon: { name: "refresh", type: "material", color: "white" },
         containerStyle: [styles.optContainer, { backgroundColor: "darkred" }],
         titleStyle: styles.optCancel,
         type: "reset",
      },
   ];

   // Functions
   function resetFilter() {
      setDsdData(initialDsdData);
   }

   return (
      <BottomSheet
         isVisible={filterVisible}
         onBackdropPress={() => setFilterVisible(false)}
      >
         {filterOpts.map((opt, i) => (
            <ListItem
               key={i}
               containerStyle={opt.containerStyle}
               onPress={() => {
                  setFilterVisible(false);

                  if (opt.title === "Supplier") {
                     setSupplierFilterVisible(true);
                  } else if (opt.title === "Date") {
                     setDateFilterVisible(true);
                  } else if (opt.title === "Reset Filter") {
                     resetFilter();
                  }
               }}
            >
               <ListItem.Content>
                  <Icon {...opt.icon} />
                  <ListItem.Title style={opt.titleStyle}>
                     {opt.title}
                  </ListItem.Title>
               </ListItem.Content>
            </ListItem>
         ))}
      </BottomSheet>
   );
}

// function StatusFilterBottomSheet({
//    statusFilterVisible,
//    setStatusFilterVisible,
// }) {
//    // States and Vars
//    const statusFilterOpts = [
//       {
//          title: "Select a status",
//          titleStyle: {
//             fontFamily: "Montserrat-Regular",
//             fontSize: 25,
//          },
//          containerStyle: [styles.optContainer, { paddingTop: 0 }],
//       },
//       {
//          title: "Draft",
//          icon: {
//             name: "progress-question",
//             type: "material-community",
//             color: "black",
//             size: 30,
//          },
//          titleStyle: styles.bottomSheetOpt,
//          containerStyle: styles.optContainer,
//          filterType: "draft",
//       },
//       {
//          title: "Completed",
//          icon: {
//             name: "progress-check",
//             type: "material-community",
//             color: "black",
//             size: 30,
//          },
//          titleStyle: styles.bottomSheetOpt,
//          containerStyle: styles.optContainer,
//          filterType: "complete",
//       },
//    ];
//    const { dsdData, setDsdData } = useAdjustmentDetail();

//    // Functions
//    function filterStatus(status) {
//       const filteredData = dsdData.filter((item) => item.status === status);
//       setDsdData(filteredData);
//    }

//    return (
//       <BottomSheet
//          isVisible={statusFilterVisible}
//          onBackdropPress={() => setStatusFilterVisible(false)}
//       >
//          {statusFilterOpts.map((opt, i) => (
//             <ListItem
//                key={i}
//                containerStyle={opt.containerStyle}
//                onPress={() => {
//                   filterStatus(opt.filterType);
//                   setStatusFilterVisible(false);
//                }}
//             >
//                <ListItem.Content>
//                   <Icon {...opt.icon} />
//                   <ListItem.Title style={opt.titleStyle}>
//                      {opt.title}
//                   </ListItem.Title>
//                </ListItem.Content>
//             </ListItem>
//          ))}
//       </BottomSheet>
//    );
// }

function SupplierFilterBottomSheet({
   supplierFilterVisible,
   setSupplierFilterVisible,
}) {
   // States and Vars
   const { supplierInfo, dsdData, setDsdData } = useAdjustmentDetail();
   const supplierFilterOpts = [
      {
         title: "Select a supplier",
         titleStyle: {
            fontFamily: "Montserrat-Regular",
            fontSize: 25,
         },
         containerStyle: [styles.optContainer, { paddingTop: 30 }],
      },
      ...supplierInfo.map((supplier) => ({
         title: supplier.name,
         titleStyle: styles.bottomSheetOpt,
         containerStyle: styles.optContainer,
         filterType: supplier.name,
      })),
   ];

   // Functions
   function filterSupplier(supplierName) {
      if (supplierName === "Select a supplier") {
         return;
      }
      const filteredData = dsdData.filter(
         (item) => item.supplier === supplierName
      );
      setDsdData(filteredData);
   }

   return (
      <BottomSheet
         isVisible={supplierFilterVisible}
         onBackdropPress={() => setSupplierFilterVisible(false)}
      >
         {supplierFilterOpts.map((opt, i) => (
            <ListItem
               key={i}
               containerStyle={opt.containerStyle}
               onPress={() => {
                  filterSupplier(opt.filterType);
                  setSupplierFilterVisible(false);
               }}
            >
               <ListItem.Content>
                  <ListItem.Title style={opt.titleStyle}>
                     {opt.title}
                  </ListItem.Title>
               </ListItem.Content>
            </ListItem>
         ))}
      </BottomSheet>
   );
}

function DateFilterBottomSheet({ dateFilterVisible, setDateFilterVisible }) {
   // States and Vars
   const { dsdData, setDsdData } = useAdjustmentDetail();
   const [startDate, setStartDate] = useState(new Date());
   const [endDate, setEndDate] = useState(new Date());
   const [showStartPicker, setShowStartPicker] = useState(false);
   const [showEndPicker, setShowEndPicker] = useState(false);

   // Functions
   function onStartChange(event, selectedDate) {
      setShowStartPicker(false);
      if (selectedDate) {
         setStartDate(selectedDate);
      }
   }
   function onEndChange(event, selectedDate) {
      setShowEndPicker(false);
      if (selectedDate) {
         setEndDate(selectedDate);
      }
   }
   function filterDate(startDate, endDate) {
      const filteredData = dsdData.filter((item) => {
         const itemDate = new Date(item.date);
         return itemDate >= startDate && itemDate <= endDate;
      });
      setDsdData(filteredData);
   }
   function resetFilter() {
      setDsdData(initialData);
   }

   return (
      <BottomSheet
         isVisible={dateFilterVisible}
         onBackdropPress={() => setDateFilterVisible(false)}
      >
         <View style={styles.bottomSheet}>
            <View style={{ flexDirection: "row" }}>
               <View style={styles.container}>
                  <View style={styles.picker}>
                     <Button
                        onPress={() => setShowStartPicker(true)}
                        title="Start Date"
                        titleStyle={{ fontFamily: "Montserrat-Bold" }}
                        icon={{
                           name: "calendar",
                           type: "material-community",
                           color: "white",
                        }}
                     />
                     {showStartPicker && (
                        <DateTimePicker
                           testID="startDateTimePicker"
                           value={startDate}
                           mode="date"
                           display="default"
                           onChange={onStartChange}
                        />
                     )}
                     <Text style={styles.dateText}>
                        {startDate.toDateString()}
                     </Text>
                  </View>
                  <View style={styles.picker}>
                     <Button
                        onPress={() => setShowEndPicker(true)}
                        title="End Date"
                        titleStyle={{ fontFamily: "Montserrat-Bold" }}
                        icon={{
                           name: "calendar",
                           type: "material-community",
                           color: "white",
                        }}
                     />
                     {showEndPicker && (
                        <DateTimePicker
                           testID="endDateTimePicker"
                           value={endDate}
                           mode="date"
                           display="default"
                           onChange={onEndChange}
                        />
                     )}

                     <Text style={styles.dateText}>
                        {endDate.toDateString()}
                     </Text>
                  </View>
               </View>
               <View style={styles.container}>
                  <Button
                     title="Apply Filter"
                     titleStyle={{ fontFamily: "Montserrat-Bold" }}
                     buttonStyle={{ backgroundColor: "green" }}
                     onPress={() => filterDate(startDate, endDate)}
                  />
               </View>
            </View>
         </View>
      </BottomSheet>
   );
}

const styles = StyleSheet.create({
   searchBarAndOpts: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
   },
   chipButton: {
      marginHorizontal: 5,
   },
   optContainer: {
      paddingVertical: 20,
   },
   bottomSheetOpt: {
      fontFamily: "Montserrat-Medium",
      fontSize: 16,
   },
   optCancel: {
      fontFamily: "Montserrat-Medium",
      fontSize: 16,
      color: "white",
   },

   // Date Picker Styles
   container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
   },
   picker: {
      marginVertical: 10,
      alignItems: "center",
   },
   dateText: {
      marginTop: 10,
      fontSize: 16,
      fontFamily: "Montserrat-Medium",
   },

   bottomSheet: {
      backgroundColor: "white",
      padding: 10,
   },
});
