import { createStackNavigator } from "@react-navigation/stack";
import InventoryAdjustmentPage from "./AdjustmentListing/InventoryAdjustmentPage";
import AdjustmentDetailPage from "./AdjustmentDetail/AdjustmentDetailPage";
import AddDetailItem from "./AdjustmentDetail/AddDetailItem";
import AdjustmentSummaryPage from "./AdjustmentSummary/AdjustmentSummaryPage";
import { useTheme, Icon, Image } from "@rneui/themed";

const Stack = createStackNavigator();

export default function IaNavigator() {
   const { theme } = useTheme();
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
               fontFamily: "Montserrat-Medium",
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
            // headerBackground: () => (
            //    <Image
            //       source={require("../../assets/pageBg.png")}
            //       resizeMode="cover"
            //       style={{ width: "100%", height: "100%" }}
            //    />
            // ),
         }}
      >
         <Stack.Screen
            name="Adjustment Landing"
            component={InventoryAdjustmentPage}
            options={{ headerShown: false }}
         />
         <Stack.Screen
            name="Adjustment Detail"
            component={AdjustmentDetailPage}
            options={{
               title: "Details",
            }}
         />
         <Stack.Screen
            name="Adjustment Summary"
            component={AdjustmentSummaryPage}
            options={{
               title: "Summary",
            }}
         />
         <Stack.Screen
            name="Add Detail Item"
            component={AddDetailItem}
            options={(route) => {
               return {
                  title: `Add Items`,
               };
            }}
         />
      </Stack.Navigator>
   );
}
