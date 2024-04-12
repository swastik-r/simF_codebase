import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import barcodeIllustration from "../../assets/barcodeIllustration.jpg";
import { useTheme } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

export default function AddDetailItem({ route }) {
   const { theme } = useTheme();
   const { id } = route.params;
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
         redirectTo: "Manual Search",
      },
   ];
   return (
      <View style={styles.page}>
         <Text
            style={{
               fontFamily: "Montserrat-Bold",
               fontSize: 16,
               textAlign: "center",
               color: theme.colors.secondary,
            }}
         >
            Scan or manually enter the barcode
         </Text>

         <Image
            source={barcodeIllustration}
            style={{ height: "60%", resizeMode: "contain" }}
         />

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
                  iconPosition="right"
                  buttonStyle={{
                     backgroundColor: theme.colors.primary,
                  }}
                  containerStyle={{
                     borderRadius: 10,
                  }}
                  onPress={() => {
                     navigation.navigate(button.redirectTo, {
                        parentItemId: id,
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
      padding: 20,
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
