import React, { useState } from "react";
import { FlatList, View, Text, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DsdItemCard from "./comps/DsdItemCard";
import { useAdjustmentDetail } from "../../../context/DataContext";
import { Overlay, Button, FAB, Icon } from "@rneui/themed";
import Toast from "react-native-toast-message";

export default function DsdItemListing({ route }) {
   // States and Vars
   const { dsdId } = route.params;
   const { dsdData, setDsdData, getDsdItems } = useAdjustmentDetail();

   const dsdItems = getDsdItems(dsdId);
   const navigation = useNavigation();
   const supplierName = dsdData.find((dsd) => dsd.id === dsdId).supplier;
   const [visible, setVisible] = useState(false);

   // Functions
   function handleDelete() {
      setDsdData(dsdData.filter((dsd) => dsd.id !== dsdId));
      Toast.show({
         type: "success",
         text1: "DSD " + dsdId + " Deleted",
         visibilityTime: 2000,
      });
      navigation.goBack();
   } // Delete DSD

   function handleSubmit() {
      if (dsdItems.length === 0) {
         Toast.show({
            type: "error",
            text1: "No DSD Items",
            text2: "Please add items to this DSD",
            visibilityTime: 2000,
         });
         return;
      }
      const newDsdData = dsdData.map((dsd) => {
         if (dsd.id === dsdId) {
            return { ...dsd, status: "COMPLETE" };
         }
         return dsd;
      });
      Toast.show({
         type: "success",
         text1: "DSD Items Saved",
         visibilityTime: 2000,
      });
      setDsdData(newDsdData);
      navigation.goBack();
   } // Submit DSD

   return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
         <FlatList
            data={dsdItems}
            renderItem={({ item }) => <DsdItemCard item={item} dsdId={dsdId} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
               paddingHorizontal: 10,
               paddingBottom: 80,
            }}
            ListHeaderComponent={
               <View style={styles.headerContainer}>
                  <View>
                     <Text
                        style={{ fontFamily: "Montserrat-Bold", fontSize: 20 }}
                     >
                        DSD Items
                     </Text>
                     <Text
                        style={{
                           fontFamily: "Montserrat-Regular",
                           fontSize: 16,
                        }}
                     >
                        Supplier: {supplierName}
                     </Text>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                     <Button
                        title={"Delete"}
                        titleStyle={{
                           fontFamily: "Montserrat-Bold",
                           fontSize: 14,
                        }}
                        icon={{
                           name: "delete",
                           type: "material-community",
                           color: "white",
                           size: 20,
                        }}
                        buttonStyle={styles.deleteButton}
                        onPress={handleDelete}
                     />
                     <Button
                        title={"Save"}
                        titleStyle={{
                           fontFamily: "Montserrat-Bold",
                           fontSize: 14,
                        }}
                        icon={{
                           name: "content-save",
                           type: "material-community",
                           color: "white",
                           size: 20,
                        }}
                        buttonStyle={styles.submitButton}
                        onPress={handleSubmit}
                     >
                        Save
                     </Button>
                  </View>
               </View>
            }
            ListEmptyComponent={
               <View style={styles.emptyPageContainer}>
                  <Icon
                     name="book-plus-outline"
                     type="material-community"
                     size={100}
                  />
                  <Text
                     style={{ fontFamily: "Montserrat-Regular", fontSize: 18 }}
                  >
                     Add items to this DSD
                  </Text>
               </View>
            }
         />

         <FAB
            style={styles.fab}
            icon={{
               name: "plus-thick",
               type: "material-community",
               color: "white",
            }}
            onPress={() => {
               navigation.navigate("Add DSD Item", { dsdId: dsdId });
            }}
         />

         {/* <InvoiceOverlay visible={visible} setVisible={setVisible} /> */}
      </View>
   );
}

// function InvoiceOverlay({ visible, setVisible }) {
//    return (
//       <Overlay
//          isVisible={visible}
//          onBackdropPress={() => setVisible(false)}
//          overlayStyle={{ padding: 20 }}
//       >
//          <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 20 }}>
//             Add DSD Item
//          </Text>
//          <TextInput
//             placeholder="Invoice Number"
//             style={styles.input}
//             onChangeText={(text) => setItemName(text)}
//          />

//          <Button
//             title="Add Item"
//             onPress={handleSubmit}
//             buttonStyle={{ borderRadius: 50, backgroundColor: "green" }}
//          />
//       </Overlay>
//    );
// }

const styles = StyleSheet.create({
   input: {
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 10,
      padding: 5,
      margin: 5,
   },
   fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
   },
   emptyPageContainer: {
      flex: 1,
      // ----> not working, to be checked, added custom margin top
      marginTop: 200,
      height: 220,
      justifyContent: "space-evenly",
      alignItems: "center",
      opacity: 0.4,
   },
   headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
   },
   deleteButton: {
      backgroundColor: "crimson",
      borderRadius: 50,
      marginRight: 10,
   },
   submitButton: {
      backgroundColor: "green",
      borderRadius: 50,
   },
});
