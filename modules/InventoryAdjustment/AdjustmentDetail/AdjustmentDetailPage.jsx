import { useState } from "react";

// React Native Imports
import { View, StyleSheet, FlatList, Text, Pressable } from "react-native";

// React Navigation Imports
import { useNavigation } from "@react-navigation/native";

// React Native Elements UI Library
import { useTheme, FAB, Overlay, Button, Icon } from "@rneui/themed";

// Custom Components
import DetailCard from "./comps/DetailCard";
import ReasonCodeOverlay from "./comps/ReasonCodeOverlay";
import { useAdjustmentDetail } from "../../../context/DataContext";

import * as ImagePicker from "expo-image-picker";

export default function AdjustmentDetailPage({ route }) {
   const { theme } = useTheme();
   const { data } = useAdjustmentDetail();
   const { id } = route.params;
   const adjustment = data.find((item) => item.id === id);
   const navigation = useNavigation();

   // For Reason Codes Overlay
   const [showReasonCodes, setShowReasonCodes] = useState(
      !adjustment.defaultReason && adjustment.detailItems.length === 0
   );
   // For Submit Overlay
   const [submitVisible, setSubmitVisible] = useState(false);
   // For Image Upload Overlay
   const [uploadVisible, setUploadVisible] = useState(false);

   return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
         <FlatList
            data={adjustment.detailItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <DetailCard
                  item={item}
                  parentItemId={id}
                  setShowReasonCodes={setShowReasonCodes}
               />
            )}
            ListHeaderComponent={
               <ButtonGroup
                  adjustment={adjustment}
                  setShowReasonCodes={setShowReasonCodes}
                  setSubmitVisible={setSubmitVisible}
                  setUploadVisible={setUploadVisible}
               />
            }
            ListEmptyComponent={
               <View
                  style={{
                     marginTop: 200,
                  }}
               >
                  <Text style={styles.emptyListText}>
                     No items in this adjustment
                  </Text>
                  <View
                     style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "start",
                     }}
                  >
                     <Text style={styles.emptyListText}>Click the</Text>
                     <Icon
                        name="plus-thick"
                        type="material-community"
                        size={18}
                        color={theme.colors.primary}
                     />
                     <Text style={styles.emptyListText}>
                        button to add items
                     </Text>
                  </View>
               </View>
            }
         />
         <FAB
            color={theme.colors.primary}
            style={styles.fab}
            icon={{
               name: "plus-thick",
               type: "material-community",
               color: "white",
            }}
            onPress={() => {
               navigation.navigate("Add Detail Item", { id: id });
            }}
         />

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
               setUploadVisible={setUploadVisible}
               setSubmitVisible={setSubmitVisible}
            />
         )}
      </View>
   );
}

function ButtonGroup({ adjustment, setShowReasonCodes, setUploadVisible }) {
   const { theme } = useTheme();
   const { reasonString } = useAdjustmentDetail();

   return (
      <View style={styles.buttonContainer}>
         <View>
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
                     ? "Default: " + reasonString(adjustment.reason)
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
         </View>

         {adjustment.detailItems.length > 0 && (
            <View>
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
                  onPress={() => {
                     setUploadVisible(true);
                  }}
               />
            </View>
         )}
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
   const { theme } = useTheme();
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
                  navigation.navigate("Inventory Adjustment");
               }}
            />
         </View>
      </Overlay>
   );
}

const styles = StyleSheet.create({
   buttonContainer: {
      marginTop: 10,
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
   fabContainer: {
      position: "absolute",
      right: 0,
      bottom: 0,
      margin: 10,
      flexDirection: "row",
   },
   fab: {
      position: "absolute",
      right: 0,
      bottom: 0,
      margin: 10,
   },
});
