import React, { useState } from "react";
import { Card, Icon, Overlay, Button, ButtonGroup, Input } from "@rneui/themed";
import {
   Text,
   StyleSheet,
   View,
   TouchableOpacity,
   Image,
   Pressable,
} from "react-native";
import { useAdjustmentDetail } from "../../../../context/DataContext";
import { useTheme } from "@rneui/themed";
import ReasonCodeOverlay from "./ReasonCodeOverlay";
import * as ImagePicker from "expo-image-picker";

export default function DetailCard({ item, parentItemId }) {
   const { theme } = useTheme();
   const [deleteOverlay, setDeleteOverlay] = useState(false);
   const {
      sizeMap,
      reasonMap,
      deleteItem,
      addItemProof,
      removeItemProof,
      changeItemQty,
   } = useAdjustmentDetail();
   const [showReasonCodes, setShowReasonCodes] = useState(false);

   // For Quantity Change Overlay
   const [qtyOverlay, setQtyOverlay] = useState(false);
   const [qtyModItem, setQtyModItem] = useState(item);
   const [newQty, setNewQty] = useState(item.qty);

   // For Sellable Overlay
   const [showSellable, setShowSellable] = useState(false);

   // For Image Preview
   const [imagePreview, setImagePreview] = useState(false);
   const [selectedImage, setSelectedImage] = useState(null);

   function toggleOverlay() {
      setDeleteOverlay(!deleteOverlay);
   }
   function handleDelete(itemId) {
      toggleOverlay();
      deleteItem(itemId, parentItemId);
   }
   function sizeString(size) {
      return sizeMap[size];
   }
   function reasonString(reason) {
      return reasonMap[reason];
   }
   async function handleImageUpload() {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [1, 1],
         quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
         addItemProof(result.assets[0].uri, item.id, parentItemId);
      }
   }

   return (
      <>
         <Card containerStyle={styles.card}>
            <View style={styles.cardTitleContainer}>
               <Text style={styles.cardTitleText}>{item.id}</Text>
               <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                     onPress={() => setDeleteOverlay(!deleteOverlay)}
                  >
                     <Icon
                        name="delete-circle-outline"
                        type="material-community"
                        size={25}
                        color="#C80815"
                     />
                  </TouchableOpacity>
               </View>
            </View>

            <View style={styles.itemInfoContainer1}>
               <Text style={styles.itemInfo}>{item.info.name}</Text>
               <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                     name="circle"
                     size={12}
                     color={item.info.color}
                     containerStyle={{ marginRight: 5 }}
                  />
                  <Text style={styles.itemInfo}>
                     {item.info.color.toUpperCase()}
                  </Text>
                  <Text style={styles.itemInfo}>
                     {"/ "}
                     {sizeString(item.info.size)}
                  </Text>
               </View>
            </View>

            <View style={styles.itemInfoContainer2}>
               <TouchableOpacity
                  style={[
                     styles.dropdownButton,
                     { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => setShowReasonCodes(true)}
               >
                  <Text style={styles.buttonTitle}>
                     {reasonString(item.reason)}
                  </Text>
                  <Icon
                     name="chevron-down"
                     type="material-community"
                     color={"white"}
                     size={25}
                  />
               </TouchableOpacity>
               <Pressable
                  style={styles.qtyContainer}
                  onPress={() => {
                     setQtyOverlay(true), setQtyModItem(item);
                  }}
               >
                  <View style={styles.qtyNumContainer}>
                     <Text style={styles.qtyNum}>{item.qty}</Text>
                  </View>
               </Pressable>
            </View>

            <Card.Divider />

            <View style={styles.itemInfoContainer3}>
               <View style={{ flexDirection: "row" }}>
                  {item.proofImages.length > 0 ? (
                     item.proofImages.map((image, index) => (
                        <Pressable
                           key={index}
                           onPress={() => {
                              setSelectedImage(image);
                              setImagePreview(true);
                           }}
                           style={styles.imageContainer}
                        >
                           <View
                              style={{
                                 flexDirection: "row",
                                 backgroundColor: "aliceblue",
                                 borderWidth: 0.5,
                                 borderColor: "blue",
                              }}
                           >
                              <Image
                                 source={{ uri: image }}
                                 style={{
                                    width: 50,
                                    height: 50,
                                    marginVertical: 5,
                                    marginLeft: 5,
                                 }}
                              />
                              <Icon
                                 name="close"
                                 type="material-community"
                                 size={20}
                                 color="#C80815"
                                 style={styles.cross}
                                 onPress={() =>
                                    removeItemProof(
                                       index,
                                       item.id,
                                       parentItemId
                                    )
                                 }
                              />
                           </View>
                        </Pressable>
                     ))
                  ) : (
                     <View
                        style={{
                           flexDirection: "column",
                           alignItems: "flex-start",
                        }}
                     >
                        <Text style={{ fontFamily: "Montserrat-Regular" }}>
                           Upload Proof Images
                        </Text>
                        <Text style={styles.helperText}>MAX 4</Text>
                     </View>
                  )}
               </View>

               {item.proofImages.length < 4 && (
                  <TouchableOpacity onPress={handleImageUpload}>
                     <Icon
                        name="upload"
                        type="material-community"
                        size={25}
                        color="#00338D"
                     />
                  </TouchableOpacity>
               )}
            </View>
         </Card>

         {/* Quantity Change Overlay */}
         <Overlay
            isVisible={qtyOverlay}
            onBackdropPress={() => {
               setQtyOverlay(false);
            }}
            overlayStyle={{ width: "80%" }}
         >
            <Text style={styles.textPrimary}>Change Quantity</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
               <Text style={styles.textSecondary}>Current Quantity: </Text>
               <Text style={styles.textPrimary}>{qtyModItem.qty}</Text>
            </View>
            <View
               style={{
                  flexDirection: "row",
                  marginTop: 20,
               }}
            >
               <Input
                  containerStyle={{ width: "60%" }}
                  placeholder="Enter new quantity"
                  style={{ fontFamily: "Montserrat-Regular", fontSize: 16 }}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                     setNewQty(Number(text));
                  }}
               />
               <Button
                  title="Submit"
                  onPress={() => {
                     if (
                        // should not be less than 1
                        newQty <= 0 ||
                        // should not be the same as the current quantity
                        newQty === qtyModItem.qty ||
                        // should not be empty or NaN
                        !newQty ||
                        isNaN(newQty)
                     ) {
                        alert("Please enter a different valid quantity.");
                     } else {
                        changeItemQty(newQty, qtyModItem, parentItemId);
                        setQtyOverlay(false);
                     }
                  }}
               />
            </View>
         </Overlay>

         {/* Image Preview Overlay */}
         <Overlay
            isVisible={imagePreview}
            onBackdropPress={() => setImagePreview(false)}
         >
            <Image
               source={{ uri: selectedImage }}
               style={{ width: 300, height: 300, borderRadius: 10 }}
            />
            <Button
               title="Close Preview"
               titleStyle={{ fontFamily: "Montserrat-Bold" }}
               onPress={() => setImagePreview(false)}
            />
         </Overlay>

         {/* Reason Code Overlay */}
         <ReasonCodeOverlay
            route={{ params: { parentId: parentItemId, childId: item.id } }}
            type="item"
            showReasonCodes={showReasonCodes}
            setShowReasonCodes={setShowReasonCodes}
            setShowSellable={setShowSellable}
         />

         {/* Sellable Overlay */}
         <SellableOverlay
            item={item}
            parentItemId={parentItemId}
            showSellable={showSellable}
            setShowSellable={setShowSellable}
         />

         {/* Delete Confirmation Modal */}
         <Overlay
            isVisible={deleteOverlay}
            onBackdropPress={toggleOverlay}
            overlayStyle={styles.deleteModal}
         >
            <Text style={styles.textPrimary}>Are you sure?</Text>
            <Text style={styles.textSecondary}>
               {item.qty} {item.qty === 1 ? "item" : "items"} of{" "}
               {item.info.name} will be deleted.
            </Text>
            <Text style={styles.textSecondary}>
               This action cannot be undone.
            </Text>
            <View style={{ flexDirection: "row" }}>
               <Button
                  title="Cancel"
                  type="outline"
                  containerStyle={styles.modalButton}
                  titleStyle={{
                     fontFamily: "Montserrat-Medium",
                     color: "grey",
                     marginHorizontal: 20,
                  }}
                  onPress={() => toggleOverlay()}
               />
               <Button
                  title="Delete"
                  buttonStyle={{ backgroundColor: "rgba(214, 61, 57, 1)" }}
                  containerStyle={styles.modalButton}
                  titleStyle={{
                     fontFamily: "Montserrat-Medium",
                     color: "white",
                     marginHorizontal: 20,
                  }}
                  onPress={() => handleDelete(item.id)}
               />
            </View>
         </Overlay>
      </>
   );
}

function SellableOverlay({
   item,
   parentItemId,
   showSellable,
   setShowSellable,
}) {
   const { sellableAdjustment } = useAdjustmentDetail();
   const [sellableQty, setSellableQty] = useState(0);

   return (
      <Overlay
         isVisible={showSellable}
         onBackdropPress={() => setShowSellable(false)}
         overlayStyle={{
            width: "60%",
            justifyContent: "center",
            alignItems: "center",
         }}
      >
         <Text style={styles.textPrimary}>Sellable Adjustment</Text>
         <Input
            placeholder="Enter quantity"
            keyboardType="numeric"
            style={{
               fontFamily: "Montserrat-Regular",
               fontSize: 16,
               textAlign: "center",
            }}
            onChangeText={(text) => {
               setSellableQty(Number(text));
            }}
         />
         <View style={styles.buttonContainer}>
            {/* Cancel Button */}
            <Button
               buttonStyle={styles.negativeResponseButton}
               title="Cancel"
               titleStyle={styles.negativeResponseButtonTitle}
               onPress={() => setShowSellable(false)}
            />
            {/* Submit Button */}
            <Button
               title="Submit"
               buttonStyle={{
                  borderRadius: 10,
               }}
               titleStyle={{
                  fontFamily: "Montserrat-Bold",
               }}
               onPress={() =>
                  // should not be less than 1 or more than item qty
                  sellableQty <= 0 || sellableQty > item.qty
                     ? alert("Invalid quantity.")
                     : (setShowSellable(false),
                       sellableAdjustment(sellableQty, item.id, parentItemId))
               }
            />
         </View>
      </Overlay>
   );
}

const styles = StyleSheet.create({
   negativeResponseButton: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "rgba(0,0,0,0.3)",
   },
   negativeResponseButtonTitle: {
      fontFamily: "Montserrat-Bold",
      color: "gray",
   },
   buttonContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-evenly",
   },
   card: {
      paddingVertical: 10,
      backgroundColor: "white",
      borderRadius: 10,
      elevation: 3,
   },
   cardTitleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
   },
   cardTitleText: {
      fontSize: 14,
      fontFamily: "Montserrat-Bold",
      color: "darkblue",
   },
   itemInfoContainer1: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
   },
   itemInfoContainer2: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
   },
   itemInfoContainer3: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5,
   },
   itemInfo: {
      fontSize: 14,
      marginRight: 5,
      fontFamily: "Montserrat-Medium",
   },
   qtyContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 5,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "grey",
   },
   qtyNumContainer: {
      marginHorizontal: 10,
   },
   qtyNum: {
      fontFamily: "Montserrat-Bold",
      fontSize: 18,
   },
   dropdownButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 2,
   },
   buttonTitle: {
      fontFamily: "Montserrat-Bold",
      color: "white",
      fontSize: 12,
      marginHorizontal: 5,
   },
   helperText: {
      fontFamily: "Montserrat-Bold",
      fontSize: 10,
      color: "rgba(0,0,0,0.4)",
   },
   imageContainer: {
      marginHorizontal: 5,
   },

   // Delete Confirmation Modal
   deleteModal: {
      width: "80%",
      paddingVertical: 20,
      borderRadius: 15,
      justifyContent: "space-between",
      alignItems: "center",
   },
   textPrimary: {
      fontFamily: "Montserrat-Bold",
      fontSize: 18,
      margin: 10,
   },
   textSecondary: {
      fontFamily: "Montserrat-Regular",
      fontSize: 15,
      textAlign: "center",
      margin: 10,
   },
   modalButton: {
      marginHorizontal: 5,
      marginVertical: 10,
   },
   modalButtonTitle: {
      fontFamily: "Montserrat-Medium",
      marginHorizontal: 20,
   },
});
