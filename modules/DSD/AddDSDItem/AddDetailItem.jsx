import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import barcodeIllustration from "../../../assets/barcodeIllustration.jpg";
import { useTheme } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

export default function AddDetailItem({ route }) {
   const { theme } = useTheme();
   const { dsdId } = route.params;
   const navigation = useNavigation();
   const buttons = [
      {
         title: "Scan",
         icon: "barcode-scan",
         type: "material-community",
         color: "white",
         redirectTo: "Capture Barcode",
      },
      {
         title: "Manual Entry",
         icon: "keyboard",
         type: "material-community",
         color: "white",
         redirectTo: "ManualSearch/DSD",
      },
   ];
   return (
      <View style={styles.page}>
         <Image
            source={barcodeIllustration}
            style={{ height: "50%", resizeMode: "contain" }}
         />
         <Text
            style={{
               fontFamily: "Montserrat-Bold",
               fontSize: 18,
               textAlign: "center",
               color: theme.colors.primary,
            }}
         >
            Scan or manually enter the barcode
         </Text>

         <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
               <Button
                  key={index}
                  title={button.title}
                  titleStyle={{
                     fontFamily: "Montserrat-Medium",
                  }}
                  icon={{
                     name: button.icon,
                     type: button.type,
                     color: button.color,
                  }}
                  buttonStyle={{
                     backgroundColor: theme.colors.primary,
                  }}
                  containerStyle={{
                     borderRadius: 10,
                  }}
                  onPress={() => {
                     navigation.navigate(button.redirectTo, {
                        dsdId: dsdId,
                     });
                  }}
               />
            ))}
         </View>
      </View>
   );
}

const styles = StyleSheet.create({
   page: {
      flex: 1,
      backgroundColor: "white",
      justifyContent: "space-evenly",
      alignItems: "center",
      padding: 10,
   },
   imageContainer: {
      justifyContent: "center",
      alignItems: "center",
   },
   buttonContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      backgroundColor: "white",
   },
});
