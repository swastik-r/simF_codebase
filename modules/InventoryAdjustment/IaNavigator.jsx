import { createStackNavigator } from "@react-navigation/stack";
import InventoryAdjustmentPage from "./AdjustmentListing/InventoryAdjustmentPage";
import AdjustmentDetailPage from "./AdjustmentDetail/AdjustmentDetailPage";
import AddDetailItem from "./AdjustmentDetail/AddDetailItem";
import AdjustmentSummaryPage from "./AdjustmentSummary/AdjustmentSummaryPage";
import { useTheme, Icon, Image } from "@rneui/themed";
import WithBackground from "../../assets/WithBackground";
import { Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Stack = createStackNavigator();

export default function IaNavigator() {
   const { theme } = useTheme();
   const navigation = useNavigation();

   return (
      <Stack.Navigator
         initialRouteName="Adjustment Landing"
         screenOptions={{
            headerStyle: {
               backgroundColor: "rgb(225,225,225)",
               elevation: 0,
               height: 30,
            },
            headerTitleStyle: {
               fontFamily: "Montserrat-Bold",
               fontSize: 14,
               marginLeft: -20,
            },
            headerBackImage: () => (
               <Icon
                  name="arrow-left-thick"
                  type="material-community"
                  size={20}
                  color={theme.colors.primary}
               />
            ),
            headerTintColor: theme.colors.primary,
            headerBackground: () => (
               <Image
                  source={require("../../assets/bg3.jpg")}
                  resizeMode="cover"
                  style={{ width: "100%", height: "100%" }}
               />
            ),
            headerTitle: ({ children }) => (
               <Pressable onPress={() => navigation.goBack()}>
                  <Text style={styles.headerTitle}>{children}</Text>
               </Pressable>
            ),
         }}
      >
         <Stack.Screen
            name="Adjustment Landing"
            component={WithBackground(InventoryAdjustmentPage)}
            options={{ headerShown: false }}
         />
         <Stack.Screen
            name="Adjustment Detail"
            component={WithBackground(AdjustmentDetailPage)}
            options={{
               title: "Details",
            }}
         />
         <Stack.Screen
            name="Adjustment Summary"
            component={WithBackground(AdjustmentSummaryPage)}
            options={{
               title: "Summary",
            }}
         />
         <Stack.Screen
            name="Add Detail Item"
            component={WithBackground(AddDetailItem)}
            options={(route) => {
               return {
                  title: `Add Items`,
               };
            }}
         />
      </Stack.Navigator>
   );
}

const styles = StyleSheet.create({
   headerTitle: {
      fontFamily: "Montserrat-Bold",
      fontSize: 14,
      color: "#000", // Adjust color to match your design
      marginLeft: -20,
   },
});
