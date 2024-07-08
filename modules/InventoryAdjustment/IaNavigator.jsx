// Screens
import ListingPage from "../../page/Listing/Listing";
import ItemListing from "../../page/ItemListing/ItemListing";
import AddItem from "../../page/AddItem/AddItem";
// Context / Navigation
import { useDataContext } from "../../context/DataContext2";
import { createStackNavigator } from "@react-navigation/stack";
// Screen Options
import { screenOptions } from "../../screenOptions";

const Stack = createStackNavigator();

export default function IaNavigator() {
   const { iaData } = useDataContext();

   return (
      <Stack.Navigator
         initialRouteName="IA Listing"
         screenOptions={screenOptions}
      >
         <Stack.Screen
            name="IA Listing"
            children={() => <ListingPage data={iaData} />}
            options={{ headerShown: false }}
         />
         <Stack.Screen
            name="IA Items"
            component={ItemListing}
            options={{
               title: "ITEMS",
            }}
         />
         <Stack.Screen
            name="IA Summary"
            component={ItemListing}
            options={{
               title: "SUMMARY",
            }}
         />
         <Stack.Screen
            name="Add Items"
            component={AddItem}
            options={{
               title: "Add Items to IA",
            }}
         />
      </Stack.Navigator>
   );
}
