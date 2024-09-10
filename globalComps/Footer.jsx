import {
   View,
   Text,
   TouchableOpacity,
   StyleSheet,
   ImageBackground,
} from "react-native";
import { Icon } from "@rneui/base";
import { useTheme } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

export default function Footer() {
   const { theme } = useTheme();
   const navigation = useNavigation();
   const footerItems = [
      {
         icon: {
            name: "transfer",
            type: "material-community",
         },
         title: "TSF",
         redirectTo: "Transfer",
      },
      {
         icon: {
            name: "book-settings",
            type: "material-community",
         },
         title: "IA",
         redirectTo: "Inventory Adjustment",
      },
      {
         icon: {
            name: "magnify",
            type: "material-community",
         },
         title: "Search",
         redirectTo: "Item Lookup",
      },
      {
         icon: {
            name: "cart-arrow-down",
            type: "material-community",
         },
         title: "PO",
         redirectTo: "Purchase Order",
      },
      {
         icon: {
            name: "truck-delivery",
            type: "material-community",
         },
         title: "DSD",
         redirectTo: "Direct Store Delivery",
      },
   ];

   return (
      // <ImageBackground
      //    source={require("../assets/bg1.jpg")}
      //    style={{
      //       ...styles.footer,
      //       backgroundColor: theme.colors.primary,
      //    }}
      // >
      <View
         style={{
            ...styles.footer,
            backgroundColor: "#112d4e",
         }}
      >
         {footerItems.map((item, index) => (
            <TouchableOpacity
               key={index}
               style={styles.footerButton}
               onPress={() => navigation.navigate(item.redirectTo)}
            >
               <Icon
                  color="white"
                  size={25}
                  {...item.icon}
                  iconStyle={{
                     marginBottom: 5,
                  }}
               />
               <Text style={styles.footerContent}>{item.title}</Text>
            </TouchableOpacity>
         ))}
      </View>
      // </ImageBackground>
   );
}

const styles = StyleSheet.create({
   footer: {
      padding: 10,
      flexDirection: "row",
      justifyContent: "space-around",
   },
   footerContent: {
      fontFamily: "Montserrat-Medium",
      color: "white",
      fontSize: 10,
   },
   footerButton: {
      minWidth: 60,
      alignItems: "center",
   },
});
