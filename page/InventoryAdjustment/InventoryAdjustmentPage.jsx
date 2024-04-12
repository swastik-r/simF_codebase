import SearchBar_FS from "../../comps/SearchBar_FS";
import { useAdjustmentDetail } from "../../context/DataContext";
import { StyleSheet, FlatList } from "react-native";
import { FAB } from "@rneui/themed";
import AdjustmentCard from "./comps/AdjustmentCard";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@rneui/themed";
import { useVisibilityContext } from "../../context/VisibilityContext";

export default function InventoryAdjustmentPage() {
   const { theme } = useTheme();
   const { data, createNewAdjustment } = useAdjustmentDetail();
   const { searchVisible } = useVisibilityContext();
   const navigation = useNavigation();

   return (
      <>
         {/* Inventory Adjustment Cards */}
         <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AdjustmentCard item={item} />}
            ListHeaderComponent={searchVisible && SearchBar_FS}
         />
         {/* FAB: Add a new adjustment */}
         <FAB
            color={theme.colors.primary}
            size="small"
            style={styles.fab}
            icon={{
               name: "plus-thick",
               type: "material-community",
               color: "white",
            }}
            onPress={() => {
               const newId = data[data.length - 1].id + 1;
               createNewAdjustment(newId);
               navigation.navigate("Adjustment Detail", { id: newId });
            }}
         />
      </>
   );
}

const styles = StyleSheet.create({
   text: {
      color: "white",
      fontFamily: "Montserrat-Regular",
      fontSize: 20,
   },
   fab: {
      position: "absolute",
      right: 0,
      bottom: 0,
      margin: 20,
   },
});
