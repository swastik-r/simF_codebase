import React, { useState } from "react";
import {
   FlatList,
   View,
   Text,
   StyleSheet,
   TextInput,
   Platform,
} from "react-native";
import { useNavigation, useTheme } from "@react-navigation/native";
import DsdItemCard from "./comps/DsdItemCard";
import { useAdjustmentDetail } from "../../../context/DataContext";
import { Overlay, Button, FAB, Icon } from "@rneui/themed";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function DsdItemListing({ route }) {
   // States and Vars
   const { dsdId } = route.params;
   const { dsdData, setDsdData, getDsdItems } = useAdjustmentDetail();

   const dsdItems = getDsdItems(dsdId);
   const navigation = useNavigation();
   const supplierName = dsdData.find((dsd) => dsd.id === dsdId).supplier;
   const po = dsdData.find((dsd) => dsd.id === dsdId).po;
   const [invoiceModal, setInvoiceModal] = useState(false);

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

   function handleSubmit(invoiceId, invoiceDate) {
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
            return {
               ...dsd,
               status: "COMPLETE",
               invoiceId: invoiceId,
               invoiceDate: invoiceDate,
            };
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

   const dsdInfo = [
      {
         label: "Supplier",
         value: supplierName,
      },
      {
         label: "PO",
         value: po,
      },
   ];

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
                     {/* Heading: DSD Items */}
                     <Text
                        style={{
                           fontFamily: "Montserrat-Bold",
                           fontSize: 20,
                           marginBottom: 10,
                        }}
                     >
                        DSD Items
                     </Text>

                     {/* DSD Info: Supplier and PO */}
                     {dsdInfo.map((info, index) => (
                        <View key={index} style={{ flexDirection: "row" }}>
                           <Text
                              style={{
                                 fontFamily: "Montserrat-Regular",
                                 fontSize: 14,
                                 marginRight: 5,
                              }}
                           >
                              {info.label}:
                           </Text>
                           <Text
                              style={{
                                 fontFamily: "Montserrat-Bold",
                                 fontSize: 14,
                              }}
                           >
                              {info.value}
                           </Text>
                        </View>
                     ))}
                  </View>

                  {/* Buttons: Delete and Save */}
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
                        onPress={() => setInvoiceModal(true)}
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

         <InvoiceOverlay
            visible={invoiceModal}
            setVisible={setInvoiceModal}
            handleSubmit={handleSubmit}
         />
      </View>
   );
}

function InvoiceOverlay({ visible, setVisible, handleSubmit }) {
   // States and vars
   const [invoiceId, setInvoiceNumber] = useState("");
   const [invoiceDate, setInvoiceDate] = useState(new Date());
   const [showDatePicker, setShowDatePicker] = useState(false);

   // Functions
   function handleInvoiceSubmit() {
      setVisible(false);
      // invoice id must not be empty and invoice date must be in the past
      if (invoiceId === "" || invoiceDate > new Date()) {
         Toast.show({
            type: "error",
            text1: "Missing or incorrect invoice details",
            text2: "Please fill in all fields and select a valid date",
            visibilityTime: 2000,
         });
         return;
      }
      handleSubmit(invoiceId, invoiceDate.toDateString());
   }

   return (
      <Overlay
         isVisible={visible}
         onBackdropPress={() => setVisible(false)}
         overlayStyle={{ padding: 20, width: "70%", borderRadius: 20 }}
      >
         <Text style={{ fontFamily: "Montserrat-Bold", fontSize: 20 }}>
            Invoice Details
         </Text>
         <View style={{ marginVertical: 30 }}>
            <Text style={styles.label}>Invoice ID</Text>
            <TextInput
               autoCapitalize="characters"
               placeholder="Invoice ID"
               style={styles.input}
               onChangeText={(text) => setInvoiceNumber(text)}
            />
            <Text style={styles.label}>Invoice Date</Text>
            <View
               style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
               }}
            >
               <Text
                  style={{ fontFamily: "Montserrat-Medium", marginRight: 10 }}
               >
                  {invoiceDate.toDateString().split(" ").slice(1).join(" ")}
               </Text>
               <Icon
                  name="calendar"
                  type="material-community"
                  onPress={() => setShowDatePicker(true)}
                  color={useTheme().colors.primary}
               />
            </View>
         </View>

         {showDatePicker && (
            <DateTimePicker
               value={invoiceDate}
               mode="date"
               display="default"
               onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (selectedDate) {
                     setInvoiceDate(selectedDate);
                  }
               }}
            />
         )}

         <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Button
               title="Submit Details"
               titleStyle={{ fontFamily: "Montserrat-Bold" }}
               onPress={handleInvoiceSubmit}
               buttonStyle={{
                  borderRadius: 50,
                  backgroundColor: useTheme().colors.primary,
               }}
            />
         </View>
      </Overlay>
   );
}

const styles = StyleSheet.create({
   label: {
      fontFamily: "Montserrat-Bold",
      fontSize: 16,
      marginVertical: 5,
   },
   input: {
      borderBottomWidth: 1,
      borderColor: "silver",
      padding: 5,
      marginVertical: 5,
   },
   fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
   },
   emptyPageContainer: {
      flex: 1,
      marginTop: 200,
      height: 220,
      justifyContent: "space-evenly",
      alignItems: "center",
      opacity: 0.4,
   },
   headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
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
