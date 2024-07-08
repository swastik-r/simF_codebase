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

export default function PoNavigator() {
   const { iaData } = useDataContext();

   return (
      <Stack.Navigator
         initialRouteName="PO Listing"
         screenOptions={screenOptions}
      >
         <Stack.Screen
            name="PO Listing"
            children={() => <ListingPage data={iaData} />}
            options={{ headerShown: false }}
         />
         <Stack.Screen
            name="PO Items"
            component={ItemListing}
            options={{
               title: "Items",
            }}
         />
         <Stack.Screen
            name="PO Summary"
            component={ItemListing}
            options={{
               title: "Summary",
            }}
         />
         <Stack.Screen
            name="Add Items"
            component={AddItem}
            options={{
               title: "ADD ITEMS",
            }}
         />
      </Stack.Navigator>
   );
}
