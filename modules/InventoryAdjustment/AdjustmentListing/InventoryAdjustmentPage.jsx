import SearchBar_FS from "../../../globalComps/SearchBar_FS";
import { useAdjustmentDetail } from "../../../context/DataContext";
import { View, StyleSheet, FlatList } from "react-native";
import { FAB } from "@rneui/themed";
import AdjustmentCard from "../_comps/AdjustmentCard";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@rneui/themed";

export default function InventoryAdjustmentPage() {
   const { theme } = useTheme();
   const { data, createNewAdjustment } = useAdjustmentDetail();
   const navigation = useNavigation();

   return (
      <View style={{ backgroundColor: "white" }}>
         {/* Inventory Adjustment Cards */}
         <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AdjustmentCard item={item} />}
            ListHeaderComponent={SearchBar_FS}
         />

         {/* FAB: Add a new adjustment */}
         <FAB
            color={theme.colors.primary}
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
      </View>
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
