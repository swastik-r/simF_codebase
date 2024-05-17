import SearchBar_FS from "../_comps/SearchBar_FS";
import { useAdjustmentDetail } from "../../../context/DataContext";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { FAB } from "@rneui/themed";
import AdjustmentCard from "../_comps/AdjustmentCard";
import { useNavigation } from "@react-navigation/native";
import { useTheme, Icon, Button } from "@rneui/themed";

export default function InventoryAdjustmentPage() {
   const { theme } = useTheme();
   const { data, createNewAdjustment } = useAdjustmentDetail();
   const navigation = useNavigation();

   return (
      <View style={{ backgroundColor: "white", flex: 1 }}>
         {/* Inventory Adjustment Cards */}
         <FlatList
            data={data}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <AdjustmentCard item={item} />}
            ListHeaderComponent={SearchBar_FS}
            ListEmptyComponent={<EmptyPageComponent />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
               paddingBottom: 100,
               width: 400,
            }}
         />

         {/* FAB: Add a new adjustment */}
         <FAB
            color={theme.colors.tertiary}
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

function EmptyPageComponent() {
   const { theme } = useTheme();
   const { setData, initialData } = useAdjustmentDetail();
   return (
      // Empty DSD Listing
      <View
         style={{
            flex: 1,
            width: 400,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: 50,
         }}
      >
         <View style={{ opacity: 0.5 }}>
            <Icon
               name="file-search"
               type="material-community"
               size={100}
               color={theme.colors.text}
               containerStyle={{ marginBottom: 10 }}
            />
            <Text
               style={{
                  fontFamily: "Montserrat-Regular",
                  color: theme.colors.text,
               }}
            >
               No adjustments found for you filter criteria / search
            </Text>
         </View>
         <Button
            title="Reset Filters"
            titleStyle={{ fontFamily: "Montserrat-Bold" }}
            containerStyle={{
               marginVertical: 40,
               borderRadius: 20,
            }}
            onPress={() => setData(initialData)}
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
