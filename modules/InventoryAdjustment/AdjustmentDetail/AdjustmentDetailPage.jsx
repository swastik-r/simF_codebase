import { useState, useEffect } from "react";

// React Native Imports
import { View, StyleSheet, FlatList, Text, Pressable } from "react-native";

// React Native Paper Imports
import { FAB, Portal, Provider } from "react-native-paper";

// React Navigation Imports
import { useNavigation } from "@react-navigation/native";

// React Native Elements UI Library
import { useTheme, Overlay, Button, Icon } from "@rneui/themed";

// Custom Components
import DetailCard2 from "./comps/DetailCard2";
import ReasonCodeOverlay from "./comps/ReasonCodeOverlay";
import { useAdjustmentDetail } from "../../../context/DataContext";
import SearchBar_FS from "./comps/SearchBar_FS";
import { SummaryDetails } from "../AdjustmentSummary/AdjustmentSummaryPage";

import * as ImagePicker from "expo-image-picker";

export default function AdjustmentDetailPage({ route }) {
   // States and vars
   const { data } = useAdjustmentDetail();
   const { id } = route.params;
   const adjustment = data.find((item) => item.id === id);
   const navigation = useNavigation();
   const [showReasonCodes, setShowReasonCodes] = useState(
      !adjustment.defaultReason && adjustment.detailItems.length === 0
   );
   const [submitVisible, setSubmitVisible] = useState(false);
   const [uploadVisible, setUploadVisible] = useState(false);
   const [excelUploadVisible, setExcelUploadVisible] = useState(false);
   const [searchResults, setSearchResults] = useState(adjustment.detailItems);
   const [searchText, setSearchText] = useState("");

   // useEffect to handle search results and reset when text changes
   useEffect(() => {
      if (searchText === "") {
         setSearchResults(adjustment.detailItems);
      } else {
         const results = adjustment.detailItems.filter(
            (item) =>
               item.info.name
                  .toLowerCase()
                  .includes(searchText.toLowerCase()) ||
               item.id.toLowerCase().includes(searchText.toLowerCase())
         );
         setSearchResults(results);
      }
   }, [searchText, adjustment.detailItems]);

   function search(text) {
      setSearchText(text);
   }

   return (
      <Provider>
         <View style={{ flex: 0.89 }}>
            <FlatList
               data={searchResults}
               keyExtractor={(item) => item.id}
               renderItem={({ item }) => (
                  <DetailCard2 item={item} parentItemId={id} route={route} />
               )}
               ListHeaderComponent={
                  <>
                     <SummaryDetails adjustment={adjustment} />
                     <ButtonGroup
                        adjustment={adjustment}
                        setShowReasonCodes={setShowReasonCodes}
                        setSubmitVisible={setSubmitVisible}
                        setUploadVisible={setUploadVisible}
                     />
                     <SearchBar_FS search={search} />
                  </>
               }
               ListEmptyComponent={<EmptyPage />}
            />
            <CustomFAB navigation={navigation} id={id} />
         </View>

         {/* Reason selection overlay */}
         <ReasonCodeOverlay
            route={{ params: { parentId: id } }}
            type="adjustment"
            showReasonCodes={showReasonCodes}
            setShowReasonCodes={setShowReasonCodes}
         />

         {/* Proof Upload Overlay */}
         {uploadVisible && (
            <ProofUploadOverlay
               id={id}
               uploadVisible={uploadVisible}
               setUploadVisible={setUploadVisible}
               setSubmitVisible={setSubmitVisible}
            />
         )}

         {/* Submission Overlay */}
         {submitVisible && (
            <SubmitOverlay
               id={id}
               submitVisible={submitVisible}
               setSubmitVisible={setSubmitVisible}
            />
         )}

         {/* Excel Upload Modal */}
         <ExcelUploadModal
            excelUploadVisible={excelUploadVisible}
            setExcelUploadVisible={setExcelUploadVisible}
         />
      </Provider>
   );
}

function CustomFAB({ navigation, id }) {
   const [open, setOpen] = useState(false);
   const onStateChange = ({ open }) => setOpen(open);

   return (
      <Portal>
         <FAB.Group
            fabStyle={{
               width: 60,
               height: 60,
               borderRadius: 50,
               backgroundColor: "white",
               justifyContent: "center",
               alignItems: "center",
            }}
            open={open}
            icon={open ? "close" : "plus"}
            actions={[
               {
                  icon: "qrcode-scan",
                  label: "Scan",
                  onPress: () => navigation.navigate("Add Detail Item", { id }),
               },
               {
                  icon: "upload",
                  label: "Upload XLSX",
                  onPress: () => console.log("Pressed upload"),
               },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
               if (open) {
                  // Do something if the speed dial is open
               }
            }}
            style={styles.fab}
         />
      </Portal>
   );
}

function ExcelUploadModal({ excelUploadVisible, setExcelUploadVisible }) {
   return (
      <Overlay
         isVisible={excelUploadVisible}
         onBackdropPress={() => {
            setExcelUploadVisible(false);
         }}
         overlayStyle={{
            width: "80%",
            height: "35%",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: 20,
         }}
      >
         <Pressable onPress={() => {}} style={{ alignItems: "center" }}>
            <Icon
               name="cloud-upload-outline"
               type="material-community"
               color={"lightblue"}
               size={100}
            />
            <Text
               style={{
                  fontFamily: "Montserrat-Bold",
                  fontSize: 18,
                  color: "grey",
               }}
            >
               Upload Adjustment Proof
            </Text>
            <Text
               style={{
                  fontFamily: "Montserrat-Regular",
                  marginVertical: 10,
                  textAlign: "center",
               }}
            >
               Do you want to upload a proof of this adjustment?
            </Text>
         </Pressable>

         <View style={{ flexDirection: "row" }}>
            <Button
               buttonStyle={[
                  styles.button,
                  {
                     backgroundColor: "transparent",
                     borderWidth: 1,
                     borderColor: "grey",
                  },
               ]}
               title="Skip"
               titleStyle={{ color: "grey", fontFamily: "Montserrat-Medium" }}
               onPress={() => {
                  setExcelUploadVisible(false);
               }}
            />
            <Button
               buttonStyle={styles.button}
               title="Upload"
               titleStyle={{ fontFamily: "Montserrat-Medium" }}
               onPress={() => {}}
            />
         </View>
      </Overlay>
   );
}

function EmptyPage() {
   return (
      <View
         style={{
            marginTop: 120,
         }}
      >
         <Icon
            name="file-document"
            type="material-community"
            size={100}
            iconStyle={{
               opacity: 0.5,
            }}
         />
         <Text style={styles.emptyListText}>
            No items added to this adjustment yet
         </Text>
      </View>
   );
}

function ButtonGroup({ adjustment, setShowReasonCodes, setUploadVisible }) {
   const { theme } = useTheme();
   const { reasonString } = useAdjustmentDetail();

   return (
      <View style={styles.buttonContainer}>
         <Button
            buttonStyle={
               adjustment.defaultReason
                  ? {
                       backgroundColor: theme.colors.secondary,
                       borderRadius: 10,
                    }
                  : {
                       backgroundColor: "white",
                       borderWidth: 1,
                       borderColor: theme.colors.secondary,
                       borderRadius: 10,
                    }
            }
            icon={
               adjustment.defaultReason
                  ? {
                       name: "form-select",
                       type: "material-community",
                       color: "white",
                    }
                  : {
                       name: "form-select",
                       type: "material-community",
                       color: theme.colors.secondary,
                    }
            }
            title={
               adjustment.defaultReason
                  ? "Reason: " + reasonString(adjustment.reason)
                  : "Select Default Reason"
            }
            titleStyle={[
               adjustment.defaultReason
                  ? { color: "white" }
                  : {
                       color: theme.colors.secondary,
                    },
               { fontFamily: "Montserrat-Bold", fontSize: 14 },
            ]}
            onPress={() => {
               setShowReasonCodes(true);
            }}
         />

         <Button
            buttonStyle={{
               backgroundColor: theme.colors.tertiary,
               borderRadius: 10,
            }}
            title="Submit"
            titleStyle={{
               fontFamily: "Montserrat-Bold",
               fontSize: 14,
               color: "white",
            }}
            icon={{
               name: "check-circle",
               type: "material-community",
               color: "white",
            }}
            disabled={adjustment.detailItems.length === 0}
            onPress={() => {
               setUploadVisible(true);
            }}
         />
      </View>
   );
}

function ProofUploadOverlay({
   id,
   uploadVisible,
   setUploadVisible,
   setSubmitVisible,
}) {
   const { addItemProof } = useAdjustmentDetail();
   async function handleImageUpload() {
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [1, 1],
         quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
         addItemProof(result.assets[0].uri, id);
      }
   }

   return (
      <Overlay
         isVisible={uploadVisible}
         onBackdropPress={() => {
            setUploadVisible(false);
         }}
         overlayStyle={{
            width: "80%",
            height: "35%",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: 20,
         }}
      >
         <Pressable
            onPress={handleImageUpload}
            style={{ alignItems: "center" }}
         >
            <Icon
               name="cloud-upload-outline"
               type="material-community"
               color={"lightblue"}
               size={100}
            />
            <Text
               style={{
                  fontFamily: "Montserrat-Bold",
                  fontSize: 18,
                  color: "grey",
               }}
            >
               Upload Adjustment Proof
            </Text>
            <Text
               style={{
                  fontFamily: "Montserrat-Regular",
                  marginVertical: 10,
                  textAlign: "center",
               }}
            >
               Do you want to upload a proof of this adjustment?
            </Text>
         </Pressable>

         <View style={{ flexDirection: "row" }}>
            <Button
               buttonStyle={[
                  styles.button,
                  {
                     backgroundColor: "transparent",
                     borderWidth: 1,
                     borderColor: "grey",
                  },
               ]}
               title="Skip"
               titleStyle={{ color: "grey", fontFamily: "Montserrat-Medium" }}
               onPress={() => {
                  setUploadVisible(false), setSubmitVisible(true);
               }}
            />
            <Button
               buttonStyle={styles.button}
               title="Upload"
               titleStyle={{ fontFamily: "Montserrat-Medium" }}
               onPress={() => {
                  handleImageUpload(),
                     setUploadVisible(false),
                     setSubmitVisible(true);
               }}
            />
         </View>
      </Overlay>
   );
}

function SubmitOverlay({ id, submitVisible, setSubmitVisible }) {
   const navigation = useNavigation();
   const { completeAdjustment } = useAdjustmentDetail();

   return (
      <Overlay
         isVisible={submitVisible}
         onBackdropPress={() => setSubmitVisible(false)}
         overlayStyle={{
            width: "80%",
            height: "20%",
            justifyContent: "space-evenly",
            borderRadius: 20,
         }}
      >
         <Text
            style={{
               fontFamily: "Montserrat-Medium",
               textAlign: "center",
            }}
         >
            Are you sure you want to submit this adjustment?
         </Text>
         <View
            style={{
               flexDirection: "row",
               justifyContent: "space-evenly",
               marginTop: 20,
            }}
         >
            <Button
               type="outline"
               title="Cancel"
               buttonStyle={{
                  backgroundColor: "transparent",
                  borderColor: "black",
                  padding: 10,
               }}
               titleStyle={{
                  fontFamily: "Montserrat-Bold",
                  color: "black",
                  fontSize: 12,
               }}
               onPress={() => setSubmitVisible(false)}
            />
            <Button
               title="Submit"
               buttonStyle={{
                  padding: 10,
               }}
               titleStyle={{
                  fontFamily: "Montserrat-Bold",
                  fontSize: 12,
               }}
               onPress={() => {
                  completeAdjustment(id);
                  setSubmitVisible(false);
                  navigation.goBack();
               }}
            />
         </View>
      </Overlay>
   );
}

const styles = StyleSheet.create({
   buttonContainer: {
      marginVertical: 10,
      marginHorizontal: 20,
      flexDirection: "row",
      justifyContent: "space-evenly",
   },
   button: {
      marginHorizontal: 10,
      borderRadius: 10,
   },
   emptyListText: {
      fontFamily: "Montserrat-Medium",
      textAlign: "center",
      color: "gray",
      marginBottom: 10,
   },
   emptyPageContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 210,
   },
   fab: {
      right: 10,
      bottom: 70,
   },
});
