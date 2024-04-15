// React Native Imports
import { SafeAreaView, StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import "react-native-gesture-handler";

// React Native Elements UI Library
import {
   Button,
   createTheme,
   ThemeProvider,
   Icon,
   ButtonGroup,
} from "@rneui/themed";

// Custom Components
import Header from "./comps/Header";
import Footer from "./comps/Footer";

// Page Imports
import InventoryAdjustmentPage from "./page/InventoryAdjustment/InventoryAdjustmentPage";
import AdjustmentDetailPage from "./page/AdjustmentDetail/AdjustmentDetailPage";
import AddDetailItem from "./page/AdjustmentDetail/AddDetailItem";
import AdjustmentSummaryPage from "./page/AdjustmentSummary/AdjustmentSummaryPage";
import { useFonts } from "expo-font";
import AdjustmentDetailProvider from "./context/DataContext";
import CameraView from "./page/AdjustmentDetail/CameraView";
import ManualSearch from "./page/AdjustmentDetail/ManualSearch";
import { VisibilityProvider } from "./context/VisibilityContext";
import { useVisibilityContext } from "./context/VisibilityContext";

const theme = createTheme({
   mode: "light",
   lightColors: {
      primary: "#00338D",
      secondary: "#483698",
      tertiary: "#0091DA",
      white: "#f0f0f0",
      text: "#000000",
   },
});
const Stack = createNativeStackNavigator();

export default function App() {
   // Load Custom Fonts
   const [loaded] = loadFonts();
   if (!loaded) {
      return null;
   }

   function SearchIcon() {
      const { searchVisible, setSearchVisible } = useVisibilityContext();
      return (
         <>
            <Icon
               // name should be "search" when searchVisible is false, and "close" when searchVisible is true
               name={searchVisible ? "search-off" : "search"}
               size={searchVisible ? 20 : 25}
               color={theme.lightColors.secondary}
               containerStyle={{
                  marginLeft: 10,
               }}
               onPress={() => {
                  setSearchVisible(!searchVisible);
               }}
            />

            {
               // If searchVisible is true, show "Close" button, else show "Search" button
               searchVisible && (
                  <Button
                     title="HIDE"
                     type="clear"
                     titleStyle={{
                        color: theme.lightColors.secondary,
                        fontFamily: "Montserrat-Regular",
                        fontSize: 12,
                     }}
                     onPress={() => {
                        setSearchVisible(false);
                     }}
                  />
               )
            }
         </>
      );
   }

   return (
      <ThemeProvider theme={theme}>
         <StatusBar />
         <Header />
         <NavigationContainer>
            <SafeAreaView style={styles.container}>
               <AdjustmentDetailProvider>
                  <VisibilityProvider>
                     <Stack.Navigator
                        initialRouteName="Inventory Adjustment"
                        screenOptions={{
                           headerTintColor: theme.lightColors.secondary,
                           headerStyle: {
                              backgroundColor: "white",
                           },
                           headerTitleStyle: {
                              fontFamily: "Montserrat-Bold",
                           },
                        }}
                     >
                        <Stack.Screen
                           name="Inventory Adjustment"
                           component={InventoryAdjustmentPage}
                        />
                        <Stack.Screen
                           name="Adjustment Detail"
                           component={AdjustmentDetailPage}
                           options={(route) => {
                              return {
                                 title: `Adjustment - ${route.route.params.id}`,
                              };
                           }}
                        />
                        <Stack.Screen
                           name="Adjustment Summary"
                           component={AdjustmentSummaryPage}
                        />
                        <Stack.Screen
                           name="Add Detail Item"
                           component={AddDetailItem}
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
                  </VisibilityProvider>
               </AdjustmentDetailProvider>
            </SafeAreaView>
            <Footer />
         </NavigationContainer>
      </ThemeProvider>
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
