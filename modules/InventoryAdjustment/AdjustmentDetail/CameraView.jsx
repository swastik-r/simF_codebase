import { Camera, CameraType } from "expo-camera";
import { Button, StyleSheet, Text, View } from "react-native";
import { useAdjustmentDetail } from "../../../context/DataContext";
import { useNavigation } from "@react-navigation/native";

export default function BarcodeCamera({ route }) {
   const navigation = useNavigation();
   const [permission, requestPermission] = Camera.useCameraPermissions();
   const { adjustmentId } = route.params;
   const { sampleDetailItems, addDetailItem } = useAdjustmentDetail();

   function searchBarcode({ data }) {
      const item = sampleDetailItems.find((item) => item.id === data);
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
      return <View />;
   }

   if (!permission.granted) {
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
      <Camera
         style={styles.camera}
         type={CameraType.back}
         onBarCodeScanned={searchBarcode}
      />
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
   scanHelperText: {
      fontFamily: "Montserrat-Bold",
      textAlign: "center",
      color: "white",
      padding: 10,
      borderRadius: 10,
      margin: 20,
   },
});
