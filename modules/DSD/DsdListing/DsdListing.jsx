import { useState } from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import DsdCard from "./DsdListingCard";
import { Button, FAB, Input, Overlay } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { useAdjustmentDetail } from "../../../context/DataContext";
import SearchBar_FS from "../../../globalComps/SearchBar_FS";
import Toast from "react-native-toast-message";

export default function DsdListing() {
   const { theme } = useTheme();
   const navigation = useNavigation();
   const { dsdData, createNewDsd } = useAdjustmentDetail();

   // Visibility state and Supplier ID value for the modal
   const [supplierIdModal, setSupplierIdModal] = useState(false);
   const [supplierId, setSupplierId] = useState("");

   function handleNewDsd() {
      setSupplierIdModal(false);
      const newDsdId = createNewDsd(supplierId);
      navigation.navigate("DSD Item List", { dsdId: newDsdId });
   }

   // return a list of cards
   return (
      <View style={{ alignItems: "center", backgroundColor: "white" }}>
         {/* DSD Listing */}
         <FlatList
            data={dsdData}
            keyExtractor={(DsdItem) => DsdItem.id}
            renderItem={({ item }) => <DsdCard info={item} />}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
               paddingBottom: 80,
            }}
            ListHeaderComponent={
               <SearchBar_FS showFilter={true} showSort={true} />
            }
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
               width: "70%",
               backgroundColor: theme.colors.white,
            }}
         >
            <View style={styles.modalContent}>
               <Text style={styles.modalTitle}>Supplier ID</Text>
               <Text style={styles.subTitle}>Optional</Text>
            </View>

            <View style={styles.modalContent}>
               <Input
                  containerStyle={{
                     marginTop: 10,
                  }}
                  inputMode="numeric"
                  placeholder="Supplier ID"
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
               {/* Skip Button */}
               <Button
                  containerStyle={[styles.button, styles.negativeButton]}
                  onPress={handleNewDsd}
                  variant="outline"
                  color="transparent"
                  title="Skip"
                  titleStyle={[styles.buttonTitle, styles.negativeButtonTitle]}
               />

               {/* Confirm Button */}
               <Button
                  containerStyle={styles.button}
                  onPress={handleNewDsd}
                  variant="outline"
                  color={theme.colors.tertiary}
                  title="Confirm"
                  titleStyle={styles.buttonTitle}
               />
            </View>
         </Overlay>
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
      marginHorizontal: 20,
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
