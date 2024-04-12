import { useState } from "react";

// React Native Imports
import { View, StyleSheet, FlatList, Text } from "react-native";

// React Navigation Imports
import { useNavigation } from "@react-navigation/native";

// React Native Elements UI Library
import { useTheme, FAB, Overlay, Button, Icon, ListItem } from "@rneui/themed";

// Custom Components
import DetailCard from "./comps/DetailCard";
import { useAdjustmentDetail } from "../../context/DataContext";

export default function AdjustmentDetailPage({ route }) {
   const { theme } = useTheme();
   const { data, setDefaultReasonCode } = useAdjustmentDetail();
   const { id } = route.params;
   const adjustment = data.find((item) => item.id === id);
   const navigation = useNavigation();
   const [submitVisible, setSubmitVisible] = useState(false);
   const [showDefaultReasonCodes, setShowDefaultReasonCodes] = useState(false);
   const reasonCodes = ["Damaged", "Stock In", "Stock Out", "Theft"];

   return (
      <>
         <FlatList
            data={adjustment.detailItems}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <DetailCard item={item} parentItemId={id} />
            )}
            ListHeaderComponent={
               <>
                  <Button
                     title="Default Reason Code"
                     icon={{
                        name: "chevron-down",
                        type: "material-community",
                        color: "white",
                     }}
                     iconPosition="right"
                     buttonStyle={{
                        backgroundColor: theme.colors.secondary,
                        padding: 10,
                     }}
                     titleStyle={{
                        fontFamily: "Montserrat-Bold",
                        fontSize: 12,
                     }}
                     onPress={() => {
                        setShowDefaultReasonCodes(!showDefaultReasonCodes);
                     }}
                  />
                  {/* Create a list of selectable reason codes */}
                  {showDefaultReasonCodes && (
                     <FlatList
                        data={reasonCodes}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                           <ListItem
                              bottomDivider
                              onPress={() => {
                                 setDefaultReasonCode(item, id);
                                 setShowDefaultReasonCodes(false);
                              }}
                              containerStyle={{ backgroundColor: "white" }}
                           >
                              <ListItem.Content>
                                 <ListItem.Title
                                    style={{ fontFamily: "Montserrat-Medium" }}
                                 >
                                    {item}
                                 </ListItem.Title>
                              </ListItem.Content>
                           </ListItem>
                        )}
                     />
                  )}
               </>
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
               size="small"
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
            {adjustment.detailItems.length > 0 && (
               <FAB
                  color={theme.colors.primary}
                  size="small"
                  style={styles.fab}
                  title="Submit"
                  titleStyle={{
                     fontFamily: "Montserrat-Bold",
                     fontSize: 12,
                  }}
                  icon={{
                     name: "check",
                     type: "material-community",
                     color: "white",
                  }}
                  onPress={() => {
                     setSubmitVisible(true);
                  }}
               />
            )}
         </View>

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
