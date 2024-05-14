import { Icon } from "@rneui/themed";
import { Camera, CameraType } from "expo-camera";
import { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAdjustmentDetail } from "../../../context/DataContext";
import { useNavigation } from "@react-navigation/native";

export default function BarcodeScanner({ route }) {
   const navigation = useNavigation();
   const [type, setType] = useState(CameraType.back);
   const [permission, requestPermission] = Camera.useCameraPermissions();
   const { adjustmentId } = route.params;
   const { data, sampleDetailItems, addDetailItem } = useAdjustmentDetail();

   function handleBarcode({ data }) {
      const item = sampleDetailItems.find((item) => item.id === data);
      // if item found in the sampleDetailItems
      if (item) {
         console.log("Item found", item);
         console.log("Adjustment ID", adjustmentId);
         addDetailItem(item, adjustmentId);
         navigation.navigate("Adjustment Detail", { id: adjustmentId });
      } else {
         console.error("Item not found with ID: ", data);
      }
   }

   if (!permission) {
      // Camera permissions are still loading
      return <View />;
   }

   if (!permission.granted) {
      // Camera permissions are not granted yet
      return (
         <View style={styles.container}>
            <Text style={{ textAlign: "center", marginBottom: 30 }}>
               Allow the Store Inventory Management app to access your camera
            </Text>
            <Button onPress={requestPermission} title="grant permission" />
         </View>
      );
   }

   return (
      <View style={styles.container}>
         <Camera
            style={styles.camera}
            type={CameraType.back}
            onBarCodeScanned={handleBarcode}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: "center",
   },
   camera: {
      flex: 1,
   },
   buttonContainer: {
      flex: 1,
      flexDirection: "row",
      backgroundColor: "transparent",
      margin: 64,
   },
   button: {
      flex: 1,
      alignSelf: "flex-end",
      alignItems: "center",
   },
   text: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
   },
});
