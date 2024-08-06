import { useState } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { Button, Icon, Overlay, Input, Divider } from "@rneui/themed";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

export default function ItemCard({ item, status, deleteItem }) {
   // States and Constants
   const [quantityOverlay, setQuantityOverlay] = useState(false);
   const [proofImagesOverlay, setProofImagesOverlay] = useState(false);
   const isComplete = status === "Complete";

   // Functions
   function uploadProof() {
      ImagePicker.requestMediaLibraryPermissionsAsync()
         .then((res) => {
            console.log("Permission response: ", res);
            if (res.status === "granted") {
               ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 1,
               })
                  .then((res) => {
                     console.log("Image Picker response: ", res);
                     if (
                        !res.canceled &&
                        res.assets &&
                        res.assets.length > 0 &&
                        res.assets[0].uri
                     ) {
                        const imageUri = res.assets[0].uri;
                        // append image to proofImages array
                        item.image = imageUri;
                        // show success message
                        Toast.show({
                           type: "success",
                           text1: "Success",
                           text2: "Proof uploaded successfully",
                        });
                     } else {
                        console.log("Image Picker canceled or no URI found");
                     }
                  })
                  .catch((error) => {
                     console.error("Error launching image library: ", error);
                  });
            } else {
               console.log("Media library permissions not granted");
            }
         })
         .catch((error) => {
            console.error(
               "Error requesting media library permissions: ",
               error
            );
         });
   }
   function showProof() {
      item.imageData && setProofImagesOverlay(true);
   }

   return (
      <>
         <View style={styles.card}>
            {!isComplete && (
               <View style={styles.deleteIconContainer}>
                  <Icon
                     onPress={() => {
                        deleteItem(item.sku);
                     }}
                     name="close-box"
                     type="material-community"
                     size={22}
                     color="crimson"
                  />
               </View>
            )}
            <View style={styles.imageContainer}>
               <Image src={item.imageData} style={styles.image} />
            </View>
            <View style={styles.detailsContainer}>
               <View style={styles.variantInfoContainer}>
                  <Text style={styles.idLabel}>SKU: </Text>
                  <Text style={styles.id}>{item.sku.toUpperCase()}</Text>
               </View>
               <Divider width={1} />
               <View>
                  <Text style={styles.name}>{item.itemName}</Text>
                  <View style={styles.variantInfoContainer}>
                     <Text style={styles.size}>{item.color}</Text>
                     <Text style={styles.size}> / </Text>
                     <Text style={styles.color}>{item.size}</Text>
                  </View>
               </View>
            </View>
            <View style={styles.qtyAndUploadContainer}>
               <Pressable
                  style={styles.qtyContainer}
                  onPress={() => {
                     if (!isComplete) {
                        console.log("Not yet complete, open the qty overlay");
                        setQuantityOverlay(true);
                     }
                  }}
               >
                  <Text
                     style={[
                        styles.qty,
                        !isComplete && {
                           textDecorationLine: "underline",
                        },
                     ]}
                  >
                     {item.qty || item.shippedQty}
                  </Text>
               </Pressable>
               <Button
                  onPress={!isComplete ? uploadProof : showProof}
                  type="outline"
                  icon={{
                     name: !isComplete ? "upload" : "eye",
                     type: "material-community",
                     color: "white",
                     size: 14,
                  }}
                  iconContainerStyle={{
                     marginRight: 5,
                     marginLeft: 0,
                  }}
                  title={!isComplete ? "Upload Proof" : "View Proof"}
                  titleStyle={styles.uploadButtonTitle}
                  buttonStyle={styles.uploadButton}
               />
            </View>
         </View>

         {!isComplete &&
            {
               IA: (
                  <QuantityUpdateOverlay
                     {...{
                        item,
                        quantityOverlay,
                        setQuantityOverlay,
                     }}
                  />
               ),
               DSD: (
                  <QuantityUpdateOverlay
                     {...{
                        item,
                        quantityOverlay,
                        setQuantityOverlay,
                     }}
                  />
               ),
               PO: (
                  <QuantityUpdateOverlay2
                     {...{
                        item,
                        quantityOverlay,
                        setQuantityOverlay,
                     }}
                  />
               ),
            }[item.type]}

         {status === "Complete" && (
            <ProofImagesOverlay
               {...{
                  item,
                  proofImagesOverlay,
                  setProofImagesOverlay,
               }}
            />
         )}
      </>
   );
}

function QuantityUpdateOverlay({ item, quantityOverlay, setQuantityOverlay }) {
   const [newQty, setNewQty] = useState("");

   function isValidQty(qty) {
      return !isNaN(qty) && parseInt(qty) > 0;
   }
   function updateQuantity(item, newQty) {
      if (!isValidQty(newQty)) {
         Toast.show({
            type: "error",
            text1: "Error",
            text2: "Invalid quantity, numeric value required",
         });
         return;
      }

      if (item.expectedQty && newQty > item.expectedQty) {
         Toast.show({
            type: "info",
            text1: "OVER-RECEIVED",
            text2: "This item is being over-received",
         });
      }

      item.qty = newQty;
   }

   return (
      <Overlay
         isVisible={quantityOverlay}
         onBackdropPress={() => setQuantityOverlay(false)}
         overlayStyle={{
            width: "60%",
            padding: 20,
            justifyContent: "space-evenly",
         }}
      >
         {/* Heading */}
         <Text
            style={{
               fontFamily: "Montserrat-Bold",
               fontSize: 16,
               marginBottom: 10,
            }}
         >
            Update Quantity
         </Text>

         {/* Input field */}
         <Input
            value={newQty}
            onChangeText={(text) => setNewQty(text)}
            keyboardType="numeric"
         />

         {/*  */}
         <View style={{ flexDirection: "row" }}>
            <Button
               type="outline"
               title="Cancel"
               titleStyle={{ fontFamily: "Montserrat-Bold", color: "crimson" }}
               buttonStyle={{ alignSelf: "center" }}
               containerStyle={{ margin: 10 }}
               onPress={() => setQuantityOverlay(false)}
            />
            <Button
               title="Submit"
               titleStyle={{ fontFamily: "Montserrat-Bold" }}
               buttonStyle={{ alignSelf: "center" }}
               containerStyle={{ margin: 10 }}
               onPress={() => {
                  updateQuantity(item, newQty);
                  setQuantityOverlay(false);
               }}
            />
         </View>
      </Overlay>
   );
}

function QuantityUpdateOverlay2({ item, quantityOverlay, setQuantityOverlay }) {
   const [newQty, setNewQty] = useState(0);
   const [damageQty, setDamageQty] = useState(0);
   const [damageImage, setDamageImage] = useState(null);

   function isValidQty(qty) {
      return !isNaN(qty) && parseInt(qty) >= 0;
   }

   function updateQuantity(item, newQty, damageQty) {
      if (!isValidQty(newQty) || !isValidQty(damageQty)) {
         Toast.show({
            type: "error",
            text1: "Error",
            text2: "Invalid quantities",
         });
         return;
      }

      if (item.expectedQty && newQty > item.expectedQty) {
         Toast.show({
            type: "info",
            text1: "Over-Received",
            text2: "This item is being over-received",
         });
      }

      item.qty = newQty;
      item.damageQty = damageQty;

      if (damageImage) {
         item.damageImage = damageImage;
      }
   }

   async function uploadDamageProof() {
      ImagePicker.requestMediaLibraryPermissionsAsync()
         .then((res) => {
            console.log("Permission response: ", res);
            if (res.status === "granted") {
               ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 1,
               })
                  .then((res) => {
                     console.log("Image Picker response: ", res);
                     if (
                        !res.canceled &&
                        res.assets &&
                        res.assets.length > 0 &&
                        res.assets[0].uri
                     ) {
                        const imageUri = res.assets[0].uri;
                        // append image to proofImages array
                        setDamageImage(imageUri);
                        // show success message
                        Toast.show({
                           type: "success",
                           text1: "Success",
                           text2: "Damage proof uploaded successfully",
                        });
                     } else {
                        console.log("Image Picker canceled or no URI found");
                     }
                  })
                  .catch((error) => {
                     console.error("Error launching image library: ", error);
                  });
            } else {
               console.log("Media library permissions not granted");
            }
         })
         .catch((error) => {
            console.error(
               "Error requesting media library permissions: ",
               error
            );
         });
   }

   return (
      <Overlay
         isVisible={quantityOverlay}
         onBackdropPress={() => setQuantityOverlay(false)}
         overlayStyle={{
            width: "80%",
            padding: 20,
            justifyContent: "space-evenly",
         }}
      >
         {/* Heading */}
         <Text
            style={{
               fontFamily: "Montserrat-Bold",
               fontSize: 17,
               marginBottom: 10,
               alignSelf: "center",
               marginBottom: 20,
            }}
         >
            Received & Damaged Quantity
         </Text>

         {/* Received Qty Input */}
         <Input
            value={newQty.toString()}
            onChangeText={(text) => setNewQty(Number(text))}
            keyboardType="numeric"
            placeholder="Received Quantity"
         />

         {/* Damage Qty Input */}
         <Input
            value={damageQty.toString()}
            onChangeText={(text) => setDamageQty(Number(text))}
            keyboardType="numeric"
            placeholder="Damaged Quantity"
         />

         {/* Button to add image proof for damage */}
         <Button
            title="Add Damage Proof"
            titleStyle={{ fontFamily: "Montserrat-Bold", fontSize: 12 }}
            buttonStyle={{ alignSelf: "center" }}
            onPress={uploadDamageProof}
         />

         {/*  */}
         <View
            style={{ flexDirection: "row", alignSelf: "center", marginTop: 10 }}
         >
            <Button
               type="outline"
               title="Cancel"
               titleStyle={{ fontFamily: "Montserrat-Bold", color: "crimson" }}
               buttonStyle={{ alignSelf: "center" }}
               containerStyle={{ margin: 10 }}
               onPress={() => setQuantityOverlay(false)}
            />
            <Button
               title="Submit"
               titleStyle={{ fontFamily: "Montserrat-Bold" }}
               buttonStyle={{ alignSelf: "center" }}
               containerStyle={{ margin: 10 }}
               onPress={() => {
                  updateQuantity(item, newQty, damageQty);
                  setQuantityOverlay(false);
               }}
            />
         </View>
      </Overlay>
   );
}

function ProofImagesOverlay({
   item,
   proofImagesOverlay,
   setProofImagesOverlay,
}) {
   return (
      <Overlay
         isVisible={proofImagesOverlay}
         onBackdropPress={() => setProofImagesOverlay(false)}
         overlayStyle={{
            width: 400,
            height: 400,
            padding: 10,
            justifyContent: "space-evenly",
         }}
      >
         <Image src={item.image} style={{ width: "100%", height: "100%" }} />
         {/* <Image src={item.damageImage} style={{ width: 200, height: 200 }} /> */}
      </Overlay>
   );
}

const styles = {
   deleteIconContainer: {
      position: "absolute",
      top: -10,
      right: -10,
      backgroundColor: "white",
      padding: 0,
      borderRadius: 5,
   },

   card: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "silver",
      backgroundColor: "#112d4eBB",
      marginTop: 10,
      marginHorizontal: 0,
      borderRadius: 10,
   },

   imageContainer: {
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      // margin: 10,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
   },
   image: {
      width: 80,
      height: 80,
   },

   detailsContainer: {
      flex: 2,
      justifyContent: "center",
      paddingVertical: 10,
      justifyContent: "space-around",
      marginLeft: 10,
   },
   name: {
      fontFamily: "Montserrat-Medium",
      fontSize: 14,
      color: "white",
   },
   idLabel: {
      fontFamily: "Montserrat-Regular",
      color: "white",
      fontSize: 12,
   },
   id: {
      fontFamily: "Montserrat-Bold",
      color: "white",
      fontSize: 12,
   },
   size: {
      fontFamily: "Montserrat-Regular",
      color: "white",
      fontSize: 12,
      marginRight: 3,
   },
   color: {
      fontFamily: "Montserrat-Regular",
      color: "white",
      fontSize: 12,
   },

   variantInfoContainer: {
      flexDirection: "row",
   },

   qtyAndUploadContainer: {
      flex: 1.5,
      paddingHorizontal: 10,
      justifyContent: "space-evenly",
      alignItems: "center",
   },
   qtyContainer: {
      backgroundColor: "silver",
      minWidth: 40,
      minHeight: 40,
      borderRadius: 10,
      paddingHorizontal: 10,
      justifyContent: "center",
      alignItems: "center",
   },
   qty: {
      fontFamily: "Montserrat-Bold",
      fontSize: 18,
      color: "white",
   },
   uploadContainer: {
      justifyContent: "center",
      alignItems: "center",
   },
   uploadButton: {
      borderRadius: 10,
      padding: 3,
      borderColor: "white",
   },
   uploadButtonTitle: {
      fontFamily: "Montserrat-Regular",
      fontSize: 10,
      color: "white",
   },
};
