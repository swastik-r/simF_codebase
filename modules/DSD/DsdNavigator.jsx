import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";
import DsdListing from "./DsdListing/DsdListing";
import DsdSummary from "./DsdSummary/DsdSummary";
import DsdItemListing from "./AddDSDItem/DsdItemListing";
import AddDsdItem from "./AddDSDItem/AddDetailItem";
import ManualSearchDSD from "./AddDSDItem/ManualSearch";
import { useTheme } from "@rneui/themed";

const Stack = createStackNavigator();

export default function DsdNavigator() {
   const { theme } = useTheme();

   return (
      <Stack.Navigator
         initialRouteName="Direct Store Deliveries"
         screenOptions={{
            headerTitleAlign: "center",
            headerTitleStyle: {
               fontFamily: "Montserrat-Bold",
               fontSize: 16,
            },
            headerShadowVisible: false,
         }}
      >
         {/* Direct Store Delivery */}
         <Stack.Screen
            name="Direct Store Deliveries"
            component={DsdListing}
            options={{ headerShown: false }}
         />
         <Stack.Screen
            name="DSD Summary"
            component={DsdSummary}
            options={(route) => {
               return {
                  title: `DSD Summary`,
               };
            }}
         />
         <Stack.Screen
            name="DSD Item List"
            component={DsdItemListing}
            options={(route) => {
               return {
                  title: `DSD Items : ${route.route.params.dsdId}`,
               };
            }}
         />
         <Stack.Screen
            name="Add DSD Item"
            component={AddDsdItem}
            options={(route) => {
               return {
                  title: `Add Items : DSD ${route.route.params.dsdId}`,
               };
            }}
         />
         <Stack.Screen name="ManualSearch/DSD" component={ManualSearchDSD} />
      </Stack.Navigator>
   );
}

function DefaultScreen() {
   return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
         <Text>Direct Store Delivery</Text>
      </View>
   );
}
