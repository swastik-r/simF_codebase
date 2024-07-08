import { useState } from "react";
import { View, Text, Image, Pressable, FlatList } from "react-native";
import { Button, Icon, Overlay, Input } from "@rneui/themed";
import { useDataContext } from "../../context/DataContext2";
import sampleImage from "../../assets/qr.png";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { useAdjustmentDetail } from "../../context/DataContext";

export default function ItemCard({ item, parentId, route }) {
   /* 
    {
       id: string,
       name: string,
       color: string,
       size: string,
       image: string,
       quantity: number,
       proofImages: string[],
    }
    */
   const { deleteIAItem, deleteDSDItem, addProofToIAItem, addProofToDSDItem } =
      useDataContext();
   const { type, status } = route.params;
   const [quantityOverlay, setQuantityOverlay] = useState(false);
   const [proofImagesOverlay, setProofImagesOverlay] = useState(false);

   function uploadProof() {
      ImagePicker.requestMediaLibraryPermissionsAsync()
         .then((res) => {
            console.log("Permission response: ", res);
            if (res.status === "granted") {
               ImagePicker.launchImageLibraryAsync()
                  .then((res) => {
                     console.log("Image Picker response: ", res);
                     if (
                        !res.canceled &&
                        res.assets &&
                        res.assets.length > 0 &&
                        res.assets[0].uri
                     ) {
                        const imageUri = res.assets[0].uri;
                        console.log("Image URI: ", imageUri);
                        // append image to proofImages array
                        if (type === "IA") {
                           addProofToIAItem(parentId, item.id, imageUri);
                        } else {
                           addProofToDSDItem(parentId, item.id, imageUri);
                        }
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
      item.proofImages.length > 0 && setProofImagesOverlay(true);
   }

   return (
      <>
         <View style={styles.card}>
            {status === "In Progress" && (
               <View style={styles.deleteIconContainer}>
                  <Icon
                     onPress={() => {
                        if (type === "IA") {
                           deleteIAItem(parentId, item.id);
                        } else {
                           deleteDSDItem(parentId, item.id);
                        }
                     }}
                     name="close-box"
                     type="material-community"
                     size={22}
                     color="crimson"
                  />
               </View>
            )}
            <View style={styles.imageContainer}>
               <Image source={item.image} style={styles.image} />
            </View>
            <View style={styles.detailsContainer}>
               <View>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.id}>{item.id}</Text>
               </View>
               <View style={styles.variantInfoContainer}>
                  <Text style={styles.size}>{item.color}</Text>
                  <Text style={styles.size}> / </Text>
                  <Text style={styles.color}>{item.size}</Text>
               </View>
            </View>
            <View style={styles.qtyAndUploadContainer}>
               <Pressable
                  style={styles.qtyContainer}
                  // onPress to setQuantityUpdateOverlay if status is "In Progress"
                  onPress={() => {
                     if (status === "In Progress") {
                        setQuantityOverlay(true);
                     }
                  }}
               >
                  <Text
                     style={[
                        styles.qty,
                        status === "In Progress" && {
                           textDecorationLine: "underline",
                        },
                     ]}
                  >
                     {item.quantity}
                  </Text>
               </Pressable>
               <Button
                  // if status is "In Progress", onPress to uploadProof, else onPress to setProofImagesOverlay
                  onPress={status === "In Progress" ? uploadProof : showProof}
                  type="outline"
                  icon={{
                     name: status === "In Progress" ? "upload" : "eye",
                     type: "material-community",
                     color: "white",
                     size: 14,
                  }}
                  iconContainerStyle={{
                     marginRight: 5,
                     marginLeft: 0,
                  }}
                  title={
                     status === "In Progress" ? "Upload Proof" : "View Proof"
                  }
                  titleStyle={styles.uploadButtonTitle}
                  buttonStyle={styles.uploadButton}
               />
            </View>
         </View>

         {status === "In Progress" && (
            <QuantityUpdateOverlay
               {...{
                  id: item.id,
                  parentId,
                  type,
                  quantityOverlay,
                  setQuantityOverlay,
               }}
            />
         )}

         {status === "Completed" && item.proofImages.length > 0 && (
            <ProofImagesOverlay
               {...{
                  id: item.id,
                  parentId,
                  type,
                  proofImagesOverlay,
                  setProofImagesOverlay,
               }}
            />
         )}
      </>
   );
}

function QuantityUpdateOverlay({
   id,
   parentId,
   type,
   quantityOverlay,
   setQuantityOverlay,
}) {
   const { handleUpdateQuantityIA, handleUpdateQuantityDSD } = useDataContext();
   const [newQty, setNewQty] = useState("");

   function isValidQty(qty) {
      return !isNaN(qty) && parseInt(qty) > 0;
   }

   return (
      <Overlay
         isVisible={quantityOverlay}
         onBackdropPress={() => setQuantityOverlay(false)}
         overlayStyle={{
            width: "60%",
            height: "30%",
            padding: 20,
            justifyContent: "space-evenly",
         }}
      >
         {/* Input field */}
         <Input
            label="Enter new quantity"
            value={newQty}
            onChangeText={(text) => setNewQty(text)}
            keyboardType="numeric"
         />

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
                  if (isValidQty(newQty)) {
                     if (type === "IA") {
                        console.log(
                           "Parent ID: ",
                           parentId,
                           "ID: ",
                           id,
                           "New Qty: ",
                           newQty
                        );
                        handleUpdateQuantityIA(parentId, id, Number(newQty));
                     } else {
                        console.log(
                           "Parent ID: ",
                           parentId,
                           "ID: ",
                           id,
                           "New Qty: ",
                           newQty
                        );
                        handleUpdateQuantityDSD(parentId, id, Number(newQty));
                     }
                  } else {
                     // show error message
                     Toast.show({
                        type: "error",
                        text1: "Error",
                        text2: "Please enter a valid quantity",
                     });
                  }
                  setQuantityOverlay(false);
               }}
            />
         </View>
      </Overlay>
   );
}

function ProofImagesOverlay({
   id,
   parentId,
   type,
   proofImagesOverlay,
   setProofImagesOverlay,
}) {
   const { fetchItemImages } = useDataContext();
   const images = fetchItemImages(id, parentId, type);
   console.log("Images fetched: ", images);

   return (
      <Overlay
         isVisible={proofImagesOverlay}
         onBackdropPress={() => setProofImagesOverlay(false)}
      >
         <FlatList
            data={images}
            renderItem={({ item }) => (
               <Image
                  key={item}
                  source={{ uri: item }}
                  style={{ width: 200, height: 200, margin: 5 }}
               />
            )}
            keyExtractor={(item) => item}
         />
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
      backgroundColor: "#112d4e88",
      marginTop: 10,
      marginHorizontal: 0,
      borderRadius: 10,
   },

   imageContainer: {
      backgroundColor: "white",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
      margin: 10,
      borderRadius: 20,
   },
   image: {
      width: 70,
      height: 70,
   },

   detailsContainer: {
      flex: 2,
      justifyContent: "center",
      padding: 10,
      justifyContent: "space-around",
   },
   name: {
      fontFamily: "Montserrat-Medium",
      fontSize: 14,
      color: "white",
   },
   id: {
      fontFamily: "Montserrat-Bold",
      color: "rgba(255, 255, 255, 0.6)",
      fontSize: 12,
   },
   size: {
      fontFamily: "Montserrat-Regular",
      color: "white",
      fontSize: 14,
      marginRight: 3,
   },
   color: {
      fontFamily: "Montserrat-Regular",
      color: "white",
      fontSize: 14,
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
