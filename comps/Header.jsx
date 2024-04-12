import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";
import { Header as HeaderRNE, Icon } from "@rneui/themed";

function Header() {
   return (
      <HeaderRNE
         containerStyle={styles.header}
         leftContainerStyle={styles.headerContainer}
         centerContainerStyle={styles.headerContainer}
         rightContainerStyle={styles.headerContainer}
         leftComponent={
            <TouchableOpacity>
               <Icon name="menu" color="#f0f0f0" size={25} />
            </TouchableOpacity>
         }
         centerComponent={
            <Image
               source={require("../assets/kpmgLogo.png")}
               style={styles.logo}
            />
         }
         rightComponent={
            <View>
               <TouchableOpacity
                  style={{ flexDirection: "row", alignItems: "center" }}
               >
                  <Icon
                     name="storefront"
                     type="ionicons"
                     color="#fff"
                     size={25}
                  />
                  <View style={styles.storeInfoContainer}>
                     <Text style={styles.storeId}>101</Text>
                     <Text style={styles.storeName}>Delhi</Text>
                  </View>
               </TouchableOpacity>
            </View>
         }
      />
   );
}

const styles = StyleSheet.create({
   headerContainer: {
      marginTop: 10,
   },
   logo: {
      height: 25,
      marginRight: 10,
      resizeMode: "contain",
   },
   storeInfoContainer: {
      marginHorizontal: 5,
   },
   storeId: {
      fontFamily: "Montserrat-Bold",
      color: "white",
      fontSize: 10,
   },
   storeName: {
      fontFamily: "Montserrat-Regular",
      color: "white",
      fontSize: 9,
   },
});

export default Header;
