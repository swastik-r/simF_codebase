import { View, StyleSheet, Text } from "react-native";
import { Icon } from "@rneui/themed";

export default function CameraView() {
   return (
      <View style={styles.cameraViewContainer}>
         <View style={styles.cameraView}>
            <Text style={styles.cameraViewText}>Scan a Barcode</Text>
            <Icon
               name="barcode-scan"
               type="material-community"
               size={60}
               color="white"
            />
         </View>
         <Icon
            name="search-circle-sharp"
            type="ionicon"
            size={100}
            color="white"
         />
      </View>
   );
}

const styles = StyleSheet.create({
   cameraViewContainer: {
      flex: 1,
      backgroundColor: "black",
      justifyContent: "space-between",
   },
   cameraView: {
      alignItems: "center",
      marginTop: 50,
   },
   cameraViewText: {
      fontFamily: "Montserrat-Bold",
      color: "white",
      fontSize: 20,
   },
});
