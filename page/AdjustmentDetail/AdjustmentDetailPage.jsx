import { useState } from "react";

// React Native Imports
import { View, StyleSheet, FlatList, Text } from "react-native";

// React Navigation Imports
import { useNavigation } from "@react-navigation/native";

// React Native Elements UI Library
import { useTheme, FAB, Overlay, Button, ListItem } from "@rneui/themed";

// Custom Components
import DetailCard from "./comps/DetailCard";
import ReasonCodeOverlay from "./comps/ReasonCodeOverlay";
import { useAdjustmentDetail } from "../../context/DataContext";

export default function AdjustmentDetailPage({ route }) {
   const { theme } = useTheme();
   const { data } = useAdjustmentDetail();
   const { id } = route.params;
   const adjustment = data.find((item) => item.id === id);
   const navigation = useNavigation();
   const [showReasonCodes, setShowReasonCodes] = useState(false);
   const [submitVisible, setSubmitVisible] = useState(false);

   return (
      <>
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
               />
            }
            ListEmptyComponent={
               <View style={styles.emptyPageContainer}>
                  <Text style={styles.emptyListText}>No items added yet</Text>
                  <Text style={styles.emptyListText}>
                     Click the + button to add an item
                  </Text>
               </View>
            }
         />
         <View style={styles.fabContainer}>
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
         </View>

         {/* Reason selection overlay */}
         <ReasonCodeOverlay
            route={{ params: { parentId: id } }}
            type="adjustment"
            showReasonCodes={showReasonCodes}
            setShowReasonCodes={setShowReasonCodes}
         />

         {/* Submission Overlay */}
         {submitVisible && (
            <SubmitOverlay
               route={route}
               submitVisible={submitVisible}
               setSubmitVisible={setSubmitVisible}
            />
         )}
      </>
   );
}

function ButtonGroup({ adjustment, setShowReasonCodes, setSubmitVisible }) {
   const { theme } = useTheme();

   return (
      <View style={styles.buttonContainer}>
         <View>
            <Button
               title="Default Reason Code"
               buttonStyle={{
                  backgroundColor: theme.colors.secondary,
                  borderRadius: 10,
               }}
               icon={{
                  name: "chevron-down",
                  type: "material-community",
                  color: "white",
               }}
               iconPosition="right"
               titleStyle={{
                  fontFamily: "Montserrat-Bold",
                  fontSize: 14,
               }}
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
                  iconPosition="right"
                  onPress={() => {
                     setSubmitVisible(true);
                  }}
               />
            </View>
         )}
      </View>
   );
}

function SubmitOverlay({ route, submitVisible, setSubmitVisible }) {
   const navigation = useNavigation();
   const { theme } = useTheme();
   const { completeAdjustment } = useAdjustmentDetail();
   const { id } = route.params;

   return (
      <Overlay
         isVisible={submitVisible}
         onBackdropPress={() => setSubmitVisible(false)}
         overlayStyle={{
            width: "80%",
            height: "20%",
            justifyContent: "space-evenly",
         }}
      >
         <View>
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
                  title="Cancel"
                  buttonStyle={{
                     backgroundColor: theme.colors.secondary,
                     padding: 10,
                  }}
                  titleStyle={{
                     fontFamily: "Montserrat-Bold",
                     fontSize: 12,
                  }}
                  onPress={() => setSubmitVisible(false)}
               />
               <Button
                  title="Submit"
                  buttonStyle={{
                     backgroundColor: theme.colors.tertiary,
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
      margin: 5,
   },
});
