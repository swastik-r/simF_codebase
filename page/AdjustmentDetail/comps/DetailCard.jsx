import React, { useState } from "react";
import { Card, Icon, Overlay, Button } from "@rneui/themed";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import { useAdjustmentDetail } from "../../../context/DataContext";
import { useTheme } from "@rneui/themed";
import ReasonCodeOverlay from "./ReasonCodeOverlay";

export default function DetailCard({ item, parentItemId }) {
   const { theme } = useTheme();
   const [deleteOverlay, setDeleteOverlay] = useState(false);
   const { sizeMap, reasonMap, addQty, subQty, deleteItem } =
      useAdjustmentDetail();
   const [showReasonCodes, setShowReasonCodes] = useState(false);

   function toggleOverlay() {
      setDeleteOverlay(!deleteOverlay);
   }
   function handleDelete(itemId) {
      toggleOverlay();
      deleteItem(itemId, parentItemId);
   }
   function handleAddQty(itemId) {
      addQty(itemId, parentItemId);
   }
   function handleSubQty(itemId) {
      subQty(itemId, parentItemId);
   }
   function sizeString(size) {
      return sizeMap[size];
   }
   function reasonString(reason) {
      return reasonMap[reason];
   }

   return (
      <>
         <Card containerStyle={styles.card}>
            <View style={styles.cardTitleContainer}>
               <Text style={styles.cardTitleText}>{item.id}</Text>
               <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity
                     onPress={() => setDeleteOverlay(!deleteOverlay)}
                  >
                     <Icon
                        name="delete"
                        type="feather"
                        size={25}
                        color="#C80815"
                     />
                  </TouchableOpacity>
               </View>
            </View>

            <View style={styles.itemInfoContainer1}>
               <Text style={styles.itemInfo}>{item.info.name}</Text>
               <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon
                     name="circle"
                     size={15}
                     color={item.info.color}
                     containerStyle={{ marginRight: 5 }}
                  />
                  <Text style={styles.itemInfo}>
                     {item.info.color.charAt(0).toUpperCase() +
                        item.info.color.slice(1)}
                  </Text>
                  <Text style={[styles.itemInfo, { borderRightWidth: 0 }]}>
                     {"/ "}
                     {sizeString(item.info.size)}
                  </Text>
               </View>
            </View>

            <View style={styles.itemInfoContainer2}>
               <TouchableOpacity
                  style={[
                     styles.dropdownButton,
                     { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => setShowReasonCodes(true)}
               >
                  <Text style={styles.buttonTitle}>
                     {reasonString(item.reason)}
                  </Text>
                  <Icon
                     name="chevron-down"
                     type="material-community"
                     color={"white"}
                     size={25}
                  />
               </TouchableOpacity>
               <View style={styles.qtyContainer}>
                  <TouchableOpacity onPress={() => handleSubQty(item.id)}>
                     <Icon name="minus" type="material-community" size={30} />
                  </TouchableOpacity>

                  <View style={styles.qtyNumContainer}>
                     <Text style={styles.qtyNum}>{item.qty}</Text>
                  </View>

                  <TouchableOpacity onPress={() => handleAddQty(item.id)}>
                     <Icon name="plus" type="material-community" size={30} />
                  </TouchableOpacity>
               </View>
            </View>

            <Card.Divider />

            <View style={styles.itemInfoContainer3}>
               <Text style={{ fontFamily: "Montserrat-Regular" }}>
                  Document Upload
               </Text>
               <TouchableOpacity>
                  <Icon
                     name="upload"
                     type="material-community"
                     size={25}
                     color="#00338D"
                  />
               </TouchableOpacity>
            </View>
         </Card>

         <ReasonCodeOverlay
            route={{ params: { parentId: parentItemId, childId: item.id } }}
            type="item"
            showReasonCodes={showReasonCodes}
            setShowReasonCodes={setShowReasonCodes}
         />

         {/* Delete Confirmation Modal */}
         <Overlay
            isVisible={deleteOverlay}
            onBackdropPress={toggleOverlay}
            overlayStyle={styles.deleteModal}
         >
            <Text style={styles.textPrimary}>Are you sure?</Text>
            <Text style={styles.textSecondary}>
               {item.qty} {item.qty === 1 ? "item" : "items"} of{" "}
               {item.info.name} will be deleted.
            </Text>
            <Text style={styles.textSecondary}>
               This action cannot be undone.
            </Text>
            <View style={{ flexDirection: "row" }}>
               <Button
                  title="Cancel"
                  type="outline"
                  containerStyle={styles.modalButton}
                  titleStyle={{
                     fontFamily: "Montserrat-Medium",
                     color: "grey",
                     marginHorizontal: 20,
                  }}
                  onPress={() => toggleOverlay()}
               />
               <Button
                  title="Delete"
                  buttonStyle={{ backgroundColor: "rgba(214, 61, 57, 1)" }}
                  containerStyle={styles.modalButton}
                  titleStyle={{
                     fontFamily: "Montserrat-Medium",
                     color: "white",
                     marginHorizontal: 20,
                  }}
                  onPress={() => handleDelete(item.id)}
               />
            </View>
         </Overlay>
      </>
   );
}

const styles = StyleSheet.create({
   card: {
      borderRadius: 10,
      paddingVertical: 5,
      backgroundColor: "white",
      elevation: 5,
   },
   cardTitleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
   },
   cardTitleText: {
      fontSize: 15,
      fontFamily: "Montserrat-Bold",
      color: "darkblue",
   },
   itemInfoContainer1: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
   },
   itemInfoContainer2: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
   },
   itemInfoContainer3: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5,
   },
   itemInfo: {
      fontSize: 15,
      marginRight: 5,
      fontFamily: "Montserrat-Medium",
   },
   qtyContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   qtyNumContainer: {
      marginHorizontal: 10,
   },
   qtyNum: {
      fontFamily: "Montserrat-Bold",
      fontSize: 18,
   },
   dropdownButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 5,
      borderRadius: 10,
      borderColor: "grey",
   },
   buttonTitle: {
      fontFamily: "Montserrat-Bold",
      color: "white",
      fontSize: 14,
      marginHorizontal: 5,
   },

   // Delete Confirmation Modal
   deleteModal: {
      width: "90%",
      height: "35%",
      paddingVertical: 20,
      borderRadius: 15,
      justifyContent: "space-between",
      alignItems: "center",
   },
   textPrimary: {
      fontFamily: "Montserrat-Bold",
      fontSize: 18,
   },
   textSecondary: {
      fontFamily: "Montserrat-Regular",
      fontSize: 15,
      textAlign: "center",
   },
   modalButton: {
      marginHorizontal: 5,
      marginVertical: 10,
   },
   modalButtonTitle: {
      fontFamily: "Montserrat-Medium",
      marginHorizontal: 20,
   },
});
