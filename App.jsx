// React Native Imports
import { SafeAreaView, StyleSheet, Pressable } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-gesture-handler";

// React Native Elements UI Library
import { createTheme, Icon, ThemeProvider } from "@rneui/themed";

// Custom Components
import Header from "./globalComps/Header";
import Footer from "./globalComps/Footer";
import Toast, { BaseToast } from "react-native-toast-message";

// IA Imports
import InventoryAdjustmentPage from "./modules/InventoryAdjustment/AdjustmentListing/InventoryAdjustmentPage";
import AdjustmentDetailPage from "./modules/InventoryAdjustment/AdjustmentDetail/AdjustmentDetailPage";
import AddDetailItem from "./modules/InventoryAdjustment/AdjustmentDetail/AddDetailItem";
import AdjustmentSummaryPage from "./modules/InventoryAdjustment/AdjustmentSummary/AdjustmentSummaryPage";
import { useFonts } from "expo-font";
import AdjustmentDetailProvider from "./context/DataContext";
import { VisibilityProvider } from "./context/VisibilityContext";
import CameraView from "./modules/InventoryAdjustment/AdjustmentDetail/CameraView";
import ManualSearch from "./modules/InventoryAdjustment/AdjustmentDetail/ManualSearch";

// DSD Imports
import DsdListing from "./modules/DSD/DsdListing/DsdListing";
import DsdSummary from "./modules/DSD/DsdSummary/DsdSummary";
import DsdItemListing from "./modules/DSD/AddDSDItem/DsdItemListing";
import AddDsdItem from "./modules/DSD/AddDSDItem/AddDetailItem";
import ManualSearchDSD from "./modules/DSD/AddDSDItem/ManualSearch";

// Theme
const theme = createTheme({
   mode: "light",
   lightColors: {
      primary: "#00338D",
      secondary: "#483698",
      tertiary: "#0091DA",
      white: "#f0f0f0",
      text: "#000000",
   },
   fonts: {
      regular: "Montserrat-Regular",
      medium: "Montserrat-Medium",
      bold: "Montserrat-Bold",
   },
});

// Toast Config
const toastConfig = {
   success: (props) => (
      <BaseToast
         {...props}
         style={{ borderLeftColor: "green" }}
         text1Style={{
            fontFamily: "Montserrat-Bold",
            fontSize: 17,
         }}
         text2Style={{
            fontFamily: "Montserrat-Regular",
            fontSize: 14,
         }}
      />
   ),
   error: (props) => (
      <BaseToast
         {...props}
         style={{ borderLeftColor: "red" }}
         text1Style={{
            fontFamily: "Montserrat-Bold",
            fontSize: 17,
         }}
         text2Style={{
            fontFamily: "Montserrat-Regular",
            fontSize: 14,
         }}
      />
   ),
};

const Stack = createNativeStackNavigator();

export default function App() {
   // Load Custom Fonts
   const [loaded] = loadFonts();
   if (!loaded) {
      return null;
   }

   return (
      <>
         <ThemeProvider theme={theme}>
            <Header />
            <AdjustmentDetailProvider>
               <VisibilityProvider>
                  <NavigationContainer>
                     <SafeAreaView style={styles.container}>
                        <Stack.Navigator
                           initialRouteName="Direct Store Deliveries"
                           screenOptions={{
                              headerTitleAlign: "center",
                              headerTintColor: theme.lightColors.primary,
                              headerTitleStyle: {
                                 fontFamily: "Montserrat-Bold",
                                 // fontSize: 16,
                              },
                              headerShadowVisible: false,
                           }}
                        >
                           {/* Direct Store Delivery */}
                           <Stack.Screen
                              name="Direct Store Deliveries"
                              component={DsdListing}
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
                           <Stack.Screen
                              name="ManualSearch/DSD"
                              component={ManualSearchDSD}
                           />

                           {/* Inventory Adjustment */}
                           <Stack.Screen
                              name="Inventory Adjustment"
                              component={InventoryAdjustmentPage}
                           />
                           <Stack.Screen
                              name="Adjustment Detail"
                              component={AdjustmentDetailPage}
                              options={({ route }) => ({
                                 title: `Adjustment ${route.params.id}`,
                              })}
                           />
                           <Stack.Screen
                              name="Adjustment Summary"
                              component={AdjustmentSummaryPage}
                           />
                           <Stack.Screen
                              name="Add Detail Item"
                              component={AddDetailItem}
                              options={(route) => {
                                 return {
                                    title: `Add Item - Adjustment ${route.route.params.id}`,
                                 };
                              }}
                           />
                           <Stack.Screen
                              name="Capture Barcode"
                              component={CameraView}
                           />
                           <Stack.Screen
                              name="Manual Search"
                              component={ManualSearch}
                           />
                        </Stack.Navigator>
                     </SafeAreaView>
                     <Footer />
                  </NavigationContainer>
               </VisibilityProvider>
            </AdjustmentDetailProvider>
         </ThemeProvider>
         <Toast config={toastConfig} />
      </>
   );
}

function loadFonts() {
   return useFonts({
      "Montserrat-Regular": require("./assets/fonts/Montserrat-Regular.ttf"),
      "Montserrat-Medium": require("./assets/fonts/Montserrat-Medium.ttf"),
      "Montserrat-Bold": require("./assets/fonts/Montserrat-Bold.ttf"),
   });
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
});
