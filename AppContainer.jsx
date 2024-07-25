import { useRef, useEffect } from "react";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
   View,
   TouchableOpacity,
   StyleSheet,
   ImageBackground,
   Animated,
} from "react-native";
import DsdNavigator from "./modules/DirectStoreDelivery/DsdNavigator";
import IaNavigator from "./modules/InventoryAdjustment/IaNavigator";
import PoNavigator from "./modules/PurchaseOrder/PoNavigator";
import { Icon, useTheme, Text } from "@rneui/themed";
import DownloadExcelFile from "./modules/GlobalSearch/GlobalSearch";
import { LinearGradient } from "expo-linear-gradient";

const Tab = createBottomTabNavigator();

export default function AppContainer() {
   const { theme } = useTheme();

   return (
      <Tab.Navigator
         initialRouteName="Purchase Order"
         screenOptions={({ route }) => ({
            headerTitleAlign: "center",
            headerTitleStyle: {
               fontFamily: "Montserrat-Medium",
               fontSize: 15,
               marginBottom: 10,
            },
            headerTintColor: "white",
            headerStyle: {
               height: 30,
               backgroundColor: theme.colors.primary,
               // borderBottomLeftRadius: 20,
               // borderBottomRightRadius: 20,
            },
            tabBarBackground: () => (
               <ImageBackground
                  source={require("./assets/footerBg.png")}
                  style={{ flex: 1 }}
               />
            ),
            tabBarIcon: ({ focused, color }) => {
               const iconData = {
                  "Direct Store Delivery": {
                     focused: "truck",
                     unfocused: "truck-outline",
                  },
                  "Inventory Adjustment": {
                     focused: "book",
                     unfocused: "book-outline",
                  },
                  "Global Search": {
                     focused: "qrcode",
                     unfocused: "qrcode-scan",
                  },
                  "Purchase Order": {
                     focused: "cart",
                     unfocused: "cart-outline",
                  },
                  Transfer: {
                     focused: "swap-horizontal-bold",
                     unfocused: "swap-horizontal",
                  },
               };
               const iconName = focused
                  ? iconData[route.name].focused
                  : iconData[route.name].unfocused;

               return (
                  <AnimatedIcon
                     name={iconName}
                     type="material-community"
                     focused={focused}
                     color={color}
                  />
               );
            },
            tabBarActiveTintColor: "white",
            tabBarStyle: {
               position: "absolute",
               height: 80,
               borderTopWidth: 0,
            },
            tabBarLabel: ({ focused, color }) => {
               let labelName;
               switch (route.name) {
                  case "Direct Store Delivery":
                     labelName = "DSD";
                     break;
                  case "Inventory Adjustment":
                     labelName = "IA";
                     break;
                  case "Global Search":
                     labelName = "GS";
                     break;
                  case "Purchase Order":
                     labelName = "PO";
                     break;
                  case "Transfer":
                     labelName = "Transfer";
                     break;
               }
               return (
                  <Text
                     style={{
                        color: color,
                        fontFamily: focused
                           ? "Montserrat-Bold"
                           : "Montserrat-Regular",
                        fontSize: 12,
                        marginBottom: 8,
                     }}
                  >
                     {labelName}
                  </Text>
               );
            },
         })}
      >
         {/* IA Navigator */}
         <Tab.Screen name="Inventory Adjustment" component={IaNavigator} />

         {/* DSD Navigator */}
         <Tab.Screen name="Direct Store Delivery" component={DsdNavigator} />

         {/* Global Search Navigator */}
         <Tab.Screen
            name="Global Search"
            options={{
               tabBarButton: (props) => (
                  <CustomTabBarButton {...props}>
                     <Icon
                        name="qrcode-scan"
                        type="material-community"
                        color="white"
                        size={30}
                     />
                  </CustomTabBarButton>
               ),
            }}
            listeners={({ navigation }) => ({
               tabPress: () => {
                  navigation.navigate("Global Search");
               },
            })}
         >
            {() => <DownloadExcelFile />}
         </Tab.Screen>

         {/* PO Navigator */}
         <Tab.Screen name="Purchase Order" component={PoNavigator} />

         {/* TSF Navigator */}
         <Tab.Screen
            name="Transfer"
            component={Screen}
            initialParams={{ title: "Transfer" }}
         />
      </Tab.Navigator>
   );
}

const CustomTabBarButton = ({ children, onPress }) => (
   <TouchableOpacity
      style={{
         top: -18,
         left: 0.5,
         justifyContent: "center",
         alignItems: "center",
      }}
      onPress={onPress}
   >
      <LinearGradient
         colors={["#112dbb", "#112d4e"]}
         style={styles.customButton}
      >
         {children}
      </LinearGradient>
   </TouchableOpacity>
);

const AnimatedIcon = ({ name, type, focused, color }) => {
   const iconSize = useRef(new Animated.Value(focused ? 30 : 20)).current;

   useEffect(() => {
      Animated.timing(iconSize, {
         toValue: focused ? 30 : 20,
         duration: 200,
         useNativeDriver: false,
      }).start();
   }, [focused, iconSize]);

   return (
      <Animated.View
         style={{
            transform: [
               {
                  scale: iconSize.interpolate({
                     inputRange: [20, 30],
                     outputRange: [1, 1.4],
                  }),
               },
            ],
         }}
      >
         <Icon
            name={name}
            type={type}
            color={focused ? "white" : color}
            style={{ marginTop: 10 }}
         />
      </Animated.View>
   );
};

function Screen({ route }) {
   return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
         <Text>{route.params?.title}</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   customButton: {
      width: 57,
      height: 57,
      borderRadius: 999,
      justifyContent: "center",
      alignItems: "center",
   },
});
