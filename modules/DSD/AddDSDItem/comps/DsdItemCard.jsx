import { Button, Card, Icon, Overlay } from "@rneui/themed";
import { useState } from "react";
import {
   View,
   Text,
   TextInput,
   StyleSheet,
   Pressable,
   Image,
} from "react-native";
import { useAdjustmentDetail } from "../../../../context/DataContext";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

export default function DsdItemCard({ item, dsdId }) {
   // States
   const [damageOverlay, setDamageOverlay] = useState(false);
   const [modifyQtyOverlay, setModifyQtyOverlay] = useState(false);
   const [deleteOverlay, setDeleteOverlay] = useState(false);

   // Functions
   function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
   }

   return (
      <>
         <Card containerStyle={styles.card}>
            <View style={styles.cardHeader}>
               <Text style={styles.id}>{item.id}</Text>
               <Icon
                  name="delete-circle-outline"
                  type="material-community"
                  color="red"
                  onPress={() => {
                     setDeleteOverlay(true);
                  }}
               />
            </View>
            <View style={styles.contentContainer}>
               <View>
                  <Text style={styles.itemName}>{item.info.name}</Text>
                  <Text style={styles.itemDetails}>
                     {capitalizeFirstLetter(item.info.color)} |{" "}
                     {capitalizeFirstLetter(item.info.size)}
                  </Text>
               </View>
               <View style={{ alignItems: "center" }}>
                  <Pressable
                     style={styles.qtyContainer}
                     onPress={() => {
                        setModifyQtyOverlay(true);
                     }}
                  >
                     <Text style={styles.qty}>
                        {item.qty - item.damagedQty}
                     </Text>
                  </Pressable>
                  <Text
                     style={{
                        fontFamily: "Montserrat-Bold",
                        fontSize: 12,
                        marginRight: 5,
                     }}
                  >
                     UNITS
                  </Text>
               </View>
            </View>

            <View
               style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
               }}
            >
               <Button
                  type="outline"
                  buttonStyle={{
                     borderWidth: 1,
                     borderRadius: 10,
                     padding: 4,
                  }}
                  icon={{
                     name: "alert-circle-outline",
                     type: "material-community",
                     color: "red",
                     size: 15,
                  }}
                  title={
                     item.damagedQty > 0
                        ? "Modify Damaged Items"
                        : "Report Damage"
                  }
                  titleStyle={{
                     fontFamily: "Montserrat-Bold",
                     fontSize: 10,
                     color: "black",
                  }}
                  onPress={() => {
                     setDamageOverlay(true);
                  }}
               />
               {item.damagedQty > 0 && (
                  <Text
                     style={{
                        fontFamily: "Montserrat-Regular",
                        fontSize: 15,
                        color: "red",
                     }}
                  >
                     {item.damagedQty} Damaged
                  </Text>
               )}
            </View>
         </Card>

         <ReportDamagedOverlay
            item={item}
            dsdId={dsdId}
            damageOverlay={damageOverlay}
            setDamageOverlay={setDamageOverlay}
         />

         <ModifyQtyOverlay
            itemId={item.id}
            dsdId={dsdId}
            modifyQtyOverlay={modifyQtyOverlay}
            setModifyQtyOverlay={setModifyQtyOverlay}
         />

         <DeleteOverlay
            itemId={item.id}
            dsdId={dsdId}
            deleteOverlay={deleteOverlay}
            setDeleteOverlay={setDeleteOverlay}
         />
      </>
   );
}

function ReportDamagedOverlay({
   item,
   dsdId,
   damageOverlay,
   setDamageOverlay,
}) {
   // States
   const [damagedQty, setDamagedQty] = useState(0);
   const [images, setImages] = useState([]);
   const { dsdData, setDsdData } = useAdjustmentDetail();

   // Functions
   function handleReportDamage(images, damagedQty, item, dsdId) {
      const itemId = item.id;
      const dsd = dsdData.find((dsd) => dsd.id === dsdId);
      if (dsd) {
         if (parseInt(damagedQty) > item.qty) {
            Toast.show({
               type: "error",
               position: "bottom",
               text1: "Invalid Damaged Quantity",
               text2: "Damaged quantity more than quantity",
               visibilityTime: 3000,
            });
            return;
         }

         const updatedItems = dsd.dsdItems.map((item) =>
            item.id === itemId
               ? {
                    ...item,
                    proofImages: images,
                    damagedQty: parseInt(damagedQty),
                 }
               : item
         );
         const updatedDsd = { ...dsd, dsdItems: updatedItems };
         const updatedDsdData = dsdData.map((dsd) =>
            dsd.id === dsdId ? updatedDsd : dsd
         );
         setDsdData(updatedDsdData);
      } else {
         console.error("DSD not found");
      }
   }

   return (
      <Overlay
         isVisible={damageOverlay}
         onBackdropPress={() => {
            setDamageOverlay(false);
         }}
         overlayStyle={[styles.modalContainer, { height: 300 }]}
      >
         <>
            <Text style={styles.modalHeading}>Report Damaged Items</Text>
            <Text style={styles.modalText}>
               Enter the damaged items quantity
            </Text>

            <View
               style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
               }}
            >
               {/* Quantity Input */}
               <TextInput
                  style={[styles.input, { width: 180 }]}
                  placeholder="Damaged Quantity"
                  keyboardType="numeric"
                  onChangeText={(text) =>
                     setDamagedQty(text.replace(/[^0-9]/g, ""))
                  }
               />

               <View>
                  {/* Image Picker */}
                  <Button
                     type="outline"
                     onPress={async () => {
                        const { status } =
                           await ImagePicker.requestMediaLibraryPermissionsAsync();

                        if (status !== "granted") {
                           alert(
                              "Sorry, we need camera roll permissions to make this work!"
                           );
                           return;
                        }

                        const result =
                           await ImagePicker.launchImageLibraryAsync({
                              mediaTypes: ImagePicker.MediaTypeOptions.Images,
                              allowsEditing: true,
                              aspect: [1, 1],
                              quality: 1,
                           });

                        if (!result.canceled) {
                           setImages((prevImages) => [
                              ...prevImages,
                              result.uri,
                           ]);
                           console.log(images);
                        }
                     }}
                     icon={{
                        name: "attach-file",
                        color: "black",
                        size: 20,
                     }}
                     buttonStyle={styles.attachButton}
                  />
                  <Text
                     style={{ fontSize: 12, fontFamily: "Montserrat-Regular" }}
                  >
                     {images.length} Images
                  </Text>
               </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
               <Button
                  title="Cancel"
                  titleStyle={[
                     styles.modalButtonText,
                     styles.modalButtonCancelText,
                  ]}
                  onPress={() => {
                     setDamageOverlay(false);
                     setImages([]);
                  }}
                  buttonStyle={[styles.modalButton, styles.modalButtonCancel]}
               />
               <Button
                  title="Submit"
                  titleStyle={styles.modalButtonText}
                  onPress={() => {
                     handleReportDamage(images, damagedQty, item, dsdId);
                     setDamageOverlay(false);
                  }}
                  buttonStyle={styles.modalButton}
               />
            </View>
         </>
      </Overlay>
   );
}

function ModifyQtyOverlay({
   itemId,
   dsdId,
   modifyQtyOverlay,
   setModifyQtyOverlay,
}) {
   // States
   const [newQty, setNewQty] = useState(null);
   const { dsdData, setDsdData } = useAdjustmentDetail();

   // Functions
   function handleModifyQty(newQty, itemId, dsdId) {
      const targetDsdIndex = dsdData.findIndex((dsd) => dsd.id === dsdId);

      if (targetDsdIndex !== -1) {
         const targetDsd = dsdData[targetDsdIndex];
         const targetItemIndex = targetDsd.dsdItems.findIndex(
            (item) => item.id === itemId
         );

         if (targetItemIndex !== -1) {
            const previousQty = targetDsd.dsdItems[targetItemIndex].qty;

            // Check if the quantity is actually changing
            if (previousQty !== newQty) {
               const updatedDsdItems = [...targetDsd.dsdItems];
               updatedDsdItems[targetItemIndex] = {
                  ...updatedDsdItems[targetItemIndex],
                  qty: newQty,
               };

               const updatedUnits =
                  targetDsd.units - parseInt(previousQty) + parseInt(newQty);

               const updatedDsd = {
                  ...targetDsd,
                  dsdItems: updatedDsdItems,
                  units: updatedUnits,
               };

               const updatedDsdData = [...dsdData];
               updatedDsdData[targetDsdIndex] = updatedDsd;

               setDsdData(updatedDsdData);
            } else {
               console.log(
                  "New quantity is the same as the previous quantity. No update needed."
               );
            }
         } else {
            console.error("Item not found in DSD.");
         }
      } else {
         console.error("DSD not found.");
      }
   }

   return (
      <Overlay
         isVisible={modifyQtyOverlay}
         onBackdropPress={() => {
            setModifyQtyOverlay(false);
         }}
         overlayStyle={styles.modalContainer}
      >
         <>
            <View>
               <Text style={styles.modalHeading}>Modify Quantity</Text>
               <Text style={styles.modalText}>Enter the new quantity</Text>
            </View>

            <TextInput
               style={styles.input}
               placeholder="Quantity"
               keyboardType="numeric"
               onChangeText={(text) => setNewQty(text.replace(/[^0-9]/g, ""))}
            />

            {/* Buttons */}
            <View style={styles.buttonContainer}>
               <Button
                  title="Cancel"
                  titleStyle={[
                     styles.modalButtonText,
                     styles.modalButtonCancelText,
                  ]}
                  onPress={() => {
                     setModifyQtyOverlay(false);
                  }}
                  buttonStyle={[styles.modalButton, styles.modalButtonCancel]}
               />
               <Button
                  title="Submit"
                  titleStyle={styles.modalButtonText}
                  onPress={() => {
                     handleModifyQty(newQty, itemId, dsdId);
                     setModifyQtyOverlay(false);
                  }}
                  buttonStyle={styles.modalButton}
               />
            </View>
         </>
      </Overlay>
   );
}

function DeleteOverlay({ itemId, dsdId, deleteOverlay, setDeleteOverlay }) {
   // States and Vars
   const { dsdData, setDsdData } = useAdjustmentDetail();

   // Functions
   function handleDeleteItem(itemId, dsdId) {
      const dsd = dsdData.find((dsd) => dsd.id === dsdId);
      if (dsd) {
         const updatedItems = dsd.dsdItems.filter((item) => item.id !== itemId);
         const updatedDsd = { ...dsd, dsdItems: updatedItems };
         const updatedDsdData = dsdData.map((dsd) =>
            dsd.id === dsdId ? updatedDsd : dsd
         );
         setDsdData(updatedDsdData);
      } else {
         console.error("DSD not found");
      }
      setDeleteOverlay(false);
   }

   return (
      <Overlay
         isVisible={deleteOverlay}
         onBackdropPress={() => {
            setDeleteOverlay(false);
         }}
         overlayStyle={styles.modalContainer}
      >
         <>
            <Text style={styles.modalHeading}>Delete Item</Text>
            <Text style={styles.modalText}>
               Are you sure you want to delete this item?
            </Text>
            <Text style={styles.modalText}>This action cannot be undone.</Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
               <Button
                  title="Cancel"
                  titleStyle={[
                     styles.modalButtonText,
                     styles.modalButtonCancelText,
                  ]}
                  onPress={() => {
                     setDeleteOverlay(false);
                  }}
                  buttonStyle={[styles.modalButton, styles.modalButtonCancel]}
               />
               <Button
                  title="Delete"
                  titleStyle={styles.modalButtonText}
                  onPress={() => {
                     handleDeleteItem(itemId, dsdId);
                  }}
                  buttonStyle={styles.modalButton}
               />
            </View>
         </>
      </Overlay>
   );
}

const styles = StyleSheet.create({
   card: {
      backgroundColor: "white",
      padding: 20,
      margin: 10,
      elevation: 5,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "rgba(30, 144, 255, 0.1)",
   },
   cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   id: {
      fontSize: 18,
      fontFamily: "Montserrat-Medium",
      color: "dodgerblue",
   },
   contentContainer: {
      marginVertical: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   itemName: {
      fontSize: 16,
      fontFamily: "Montserrat-Bold",
   },
   itemDetails: {
      fontSize: 13,
      fontFamily: "Montserrat-Regular",
   },
   qtyContainer: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "aliceblue",
      borderRadius: 5,
   },
   qty: {
      fontSize: 18,
      fontFamily: "Montserrat-Bold",
      color: "dodgerblue",
   },

   // Modal Styles
   modalContainer: {
      padding: 20,
      height: 250,
      width: "70%",
      justifyContent: "space-between",
      borderRadius: 10,
   },
   modalHeading: {
      fontSize: 20,
      fontFamily: "Montserrat-Bold",
      marginBottom: 10,
   },
   modalText: {
      fontSize: 16,
      fontFamily: "Montserrat-Regular",
      marginBottom: 5,
   },
   input: {
      padding: 10,
      borderWidth: 1,
      borderRadius: 5,
      borderColor: "lightgray",
      fontFamily: "Montserrat-Regular",
      fontSize: 16,
   },
   buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-evenly",
   },
   modalButton: {
      padding: 10,
      borderRadius: 5,
      backgroundColor: "dodgerblue",
      justifyContent: "center",
      alignItems: "center",
   },
   modalButtonCancel: {
      borderWidth: 1,
      borderColor: "darkred",
      backgroundColor: "white",
   },
   modalButtonText: {
      fontSize: 16,
      fontFamily: "Montserrat-Bold",
      color: "white",
   },
   modalButtonCancelText: {
      color: "darkred",
   },
   attachButton: {
      borderWidth: 1,
      borderColor: "black",
      paddingHorizontal: 5,
      paddingVertical: 10,
      borderRadius: 50,
   },
});
