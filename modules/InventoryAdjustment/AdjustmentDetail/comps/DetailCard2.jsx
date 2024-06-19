import React, { useState } from "react";
import { Icon, Overlay, Button, Input, Divider } from "@rneui/themed";
import {
   Text,
   StyleSheet,
   View,
   Image,
   Pressable,
   FlatList,
} from "react-native";
import { useAdjustmentDetail } from "../../../../context/DataContext";
import { useTheme } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import IconImage from "../../../../assets/icon.png";

export default function DetailCard({ item, parentItemId, route }) {
   // Theme
   const { theme } = useTheme();

   // Imports from DataContext
   const {
      sizeMap,
      reasonMap,
      deleteItem,
      addItemProof,
      removeItemProof,
      changeItemQty,
   } = useAdjustmentDetail();

   // For Quantity Change Overlay
   const [qtyOverlay, setQtyOverlay] = useState(false);
   const [qtyModItem, setQtyModItem] = useState(item);
   const [newQty, setNewQty] = useState(item.qty);

   // For Image Preview
   const [imagePreview, setImagePreview] = useState(false);
   const [selectedImages, setSelectedImages] = useState(null);

   // For Delete Confirmation Modal
   const [deleteOverlay, setDeleteOverlay] = useState(false);

   // Misc Functions
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
   function capitaliseString(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
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
         <View style={styles.card}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
               {/* Item Image */}
               <Image source={item.info.image} style={styles.itemImage} />

               <View style={{ flex: 1 }}>
                  {/* ID */}
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                     <Text style={styles.idLabel}>ID:</Text>
                     <Text style={styles.id}>{item.id}</Text>
                  </View>

                  <Divider style={{ marginVertical: 10 }} />

                  <View>
                     {/* Item Name */}
                     <Text style={styles.itemName}>{item.info.name}</Text>
                     {/* Item Variant Info: Color and Size */}
                     <Text style={styles.itemVariant}>
                        {capitaliseString(item.info.color)} /{" "}
                        {sizeString(item.info.size)}
                     </Text>
                  </View>
               </View>

               {/* Quantity */}
               <View style={{ marginHorizontal: 10 }}>
                  <Pressable
                     style={styles.qtyContainer}
                     // if route is Adjustment Detail, show the quantity change overlay
                     onPress={() => {
                        if (route.name === "Adjustment Detail") {
                           setQtyModItem(item);
                           setQtyOverlay(true);
                        }
                     }}
                  >
                     <Text
                        style={[
                           styles.qty,
                           route.name === "Adjustment Detail" && {
                              textDecorationLine: "underline",
                           },
                        ]}
                     >
                        {item.qty}
                     </Text>
                  </Pressable>
                  <Button
                     title={
                        route.name === "Adjustment Detail"
                           ? "Upload Proof (" + item.proofImages.length + ")"
                           : "View Proof (" + item.proofImages.length + ")"
                     }
                     titleStyle={{
                        fontFamily: "Montserrat-Bold",
                        fontSize: 10,
                        color: "silver",
                     }}
                     type="outline"
                     icon={
                        route.name === "Adjustment Detail"
                           ? {
                                name: "upload",
                                type: "font-awesome",
                                color: "silver",
                                size: 15,
                             }
                           : {
                                name: "eye",
                                type: "material-community",
                                color: "silver",
                                size: 15,
                             }
                     }
                     buttonStyle={{
                        padding: 2,
                        borderColor: "silver",
                        borderRadius: 5,
                     }}
                     onPress={() => {
                        if (route.name === "Adjustment Detail") {
                           handleImageUpload();
                        } else if (item.proofImages.length > 0) {
                           setSelectedImages(item.proofImages);
                           setImagePreview(true);
                        }
                     }}
                  />
               </View>
            </View>

            {/* Delete Button */}
            {route.name === "Adjustment Detail" && (
               <Icon
                  name="circle-with-cross"
                  type="entypo"
                  size={25}
                  color="crimson"
                  onPress={() => setDeleteOverlay(!deleteOverlay)}
                  containerStyle={{
                     position: "absolute",
                     right: -7,
                     top: -7,
                     backgroundColor: "white",
                     borderRadius: 999,
                  }}
               />
            )}
         </View>

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
               <Text style={[styles.textPrimary, {}]}>{qtyModItem.qty}</Text>
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
            overlayStyle={{ height: "80%" }}
         >
            <FlatList
               data={selectedImages}
               keyExtractor={(item, index) => index.toString()}
               renderItem={({ item }) => (
                  <>
                     <Image
                        source={{ uri: item }}
                        style={{
                           width: 200,
                           height: 200,
                           borderRadius: 10,
                           marginBottom: 10,
                        }}
                     />
                  </>
               )}
               contentContainerStyle={{
                  justifyContent: "center",
                  alignItems: "center",
               }}
            />

            <Button
               title="Close"
               titleStyle={{ fontFamily: "Montserrat-Bold" }}
               onPress={() => setImagePreview(false)}
            />
         </Overlay>

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

const styles = StyleSheet.create({
   // Misc Styles
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

   // Card Styles
   card: {
      backgroundColor: "#112d4eCC",
      borderRadius: 20,
      marginHorizontal: 20,
      marginVertical: 2,
   },
   idLabel: {
      fontFamily: "Montserrat-Regular",
      fontSize: 12,
      color: "white",
   },
   id: {
      fontFamily: "Montserrat-Bold",
      fontSize: 12,
      color: "white",
      marginLeft: 5,
   },
   itemImage: {
      width: 80,
      height: 100,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      marginRight: 10,
   },
   itemName: {
      fontFamily: "Montserrat-Bold",
      fontSize: 13,
      color: "white",
   },
   itemVariant: {
      fontFamily: "Montserrat-Regular",
      fontSize: 10,
      color: "white",
   },
   qtyContainer: {
      minWidth: 50,
      backgroundColor: "#f0f0f0",
      borderRadius: 10,
      paddingVertical: 8,
      paddingHorizontal: 10,
      marginBottom: 10,
      alignItems: "center",
      alignSelf: "center",
   },
   qty: {
      fontFamily: "Montserrat-Bold",
      fontSize: 20,
      color: "#112d4e",
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
