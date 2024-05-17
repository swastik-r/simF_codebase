import { useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import DsdCard from "./DsdListingCard";
import { Button, FAB, Input, Overlay, Icon } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { useAdjustmentDetail } from "../../../context/DataContext";
import SearchBar_FS from "../../DSD/_comps/SearchBar_FS";
import Toast from "react-native-toast-message";

export default function DsdListing() {
   // States and Vars
   const { theme } = useTheme();
   const navigation = useNavigation();
   const { dsdData, createNewDsd, supplierInfo } = useAdjustmentDetail();
   const [supplierIdModal, setSupplierIdModal] = useState(false);
   const [supplierId, setSupplierId] = useState("");

   // Functions
   function handleNewDsd() {
      setSupplierIdModal(false);
      const isIdValid = supplierInfo.some(
         (supplier) => supplier.id === supplierId
      );
      if (!isIdValid) {
         Toast.show({
            type: "error",
            text1: "Invalid Supplier ID",
            text2: "Please enter a valid Supplier ID",
            position: "bottom",
         });
         return;
      }
      const newDsdId = createNewDsd(supplierId);
      navigation.navigate("DSD Item List", { dsdId: newDsdId });
      setSupplierId("");
   }

   // Render
   return (
      <View style={{ alignItems: "center", backgroundColor: "white", flex: 1 }}>
         {/* DSD Listing */}
         <FlatList
            data={dsdData}
            keyExtractor={(DsdItem) => DsdItem.id}
            renderItem={({ item }) => <DsdCard info={item} />}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
               paddingBottom: 100,
               width: 400,
            }}
            ListHeaderComponent={<SearchBar_FS />}
            ListEmptyComponent={<EmptyPageComponent />}
         />

         {/* FAB */}
         <FAB
            color={theme.colors.tertiary}
            style={styles.fab}
            icon={{
               name: "plus-thick",
               type: "material-community",
               color: "white",
            }}
            onPress={() => {
               setSupplierIdModal(true);
            }}
         />

         {/* Supplier ID Modal */}
         <Overlay
            isVisible={supplierIdModal}
            onBackdropPress={() => setSupplierIdModal(false)}
            overlayStyle={{
               borderRadius: 20,
               width: "80%",
               backgroundColor: theme.colors.white,
            }}
         >
            <View style={styles.modalContent}>
               <Text style={styles.modalTitle}>Supplier ID</Text>
               <Text style={styles.subTitle}>
                  Enter the Supplier ID to create a DSD
               </Text>
            </View>

            <View style={styles.modalContent}>
               <Input
                  // align text and icon to center
                  containerStyle={{
                     marginTop: 20,
                  }}
                  inputMode="numeric"
                  placeholder="Enter Supplier ID"
                  inputStyle={{
                     fontFamily: "Montserrat-Medium",
                     marginLeft: 10,
                  }}
                  leftIcon={{
                     name: "user",
                     type: "feather",
                     color: "gray",
                  }}
                  clearTextOnFocus={true}
                  onChangeText={(text) => {
                     setSupplierId(text);
                  }}
               />
            </View>

            <View style={styles.buttonContainer}>
               {/* Confirm Button */}
               <Button
                  containerStyle={styles.button}
                  onPress={handleNewDsd}
                  variant="outline"
                  color={theme.colors.tertiary}
                  title="Create DSD"
                  titleStyle={styles.buttonTitle}
               />
            </View>
         </Overlay>
      </View>
   );
}

function EmptyPageComponent() {
   const { theme } = useTheme();
   const { setDsdData, initialDsdData } = useAdjustmentDetail();
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
               No DSDs found for you filter criteria
            </Text>
         </View>
         <Button
            title="Reset Filters"
            titleStyle={{ fontFamily: "Montserrat-Bold" }}
            containerStyle={{
               marginVertical: 40,
               borderRadius: 20,
            }}
            onPress={() => setDsdData(initialDsdData)}
         />
      </View>
   );
}

const styles = StyleSheet.create({
   fab: {
      position: "absolute",
      margin: 16,
      right: 0,
      bottom: 0,
   },
   modalContent: {
      alignItems: "flex-start",
      marginVertical: 10,
      marginHorizontal: 20,
   },
   modalTitle: {
      fontFamily: "Montserrat-Bold",
      fontSize: 20,
   },
   subTitle: {
      fontFamily: "Montserrat-Medium",
      color: "grey",
   },
   modalText: {
      fontFamily: "Montserrat-Regular",
      fontSize: 16,
   },
   buttonContainer: {
      flexDirection: "row",
      marginHorizontal: 50,
      marginVertical: 10,
   },
   button: {
      flex: 1,
      marginHorizontal: 5,
      borderWidth: 1,
      borderRadius: 20,
      borderColor: "transparent",
   },
   negativeButton: {
      borderColor: "grey",
   },
   buttonTitle: {
      fontFamily: "Montserrat-Bold",
   },
   negativeButtonTitle: {
      color: "grey",
   },
});
