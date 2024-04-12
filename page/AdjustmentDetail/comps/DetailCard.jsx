import React, { useState, useRef } from "react";
import { Card, Icon, Overlay, Button } from "@rneui/themed";
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import Dropdown from "../../../comps/Dropdown";
import { useAdjustmentDetail } from "../../../context/DataContext";

export default function DetailCard({ item, deleteFun }) {
   const [deleteOverlay, setDeleteOverlay] = useState(false);
   const { addQty, subQty } = useAdjustmentDetail();
   function toggleOverlay() {
      setDeleteOverlay(!deleteOverlay);
   }
   function deleteItem(id) {
      deleteFun(id);
      toggleOverlay();
   }

   return (
      <>
         <Card containerStyle={styles.card}>
            <View style={styles.cardTitleContainer}>
               <Text style={styles.cardTitleText}>{item.id}</Text>
               <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <TouchableOpacity onPress={() => toggleOverlay()}>
                     <Icon
                        name="delete-circle-outline"
                        type="material-community"
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
                     {item.info.size}
                  </Text>
               </View>
            </View>

            <View style={styles.itemInfoContainer2}>
               <Dropdown staticTitle={item.reason} />
               <View style={styles.qtyContainer}>
                  <TouchableOpacity onPress={() => subQty(item.id)}>
                     <Icon name="minus" type="material-community" size={30} />
                  </TouchableOpacity>

                  <View style={styles.qtyNumContainer}>
                     <Text style={styles.qtyNum}>{item.qty}</Text>
                  </View>
                  <TouchableOpacity onPress={() => addQty(item.id)}>
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
                  onPress={() => deleteItem(item.id)}
               />
            </View>
         </Overlay>
      </>
   );
}

const styles = StyleSheet.create({
   card: {
      borderRadius: 10,
      // paddingVertical: 10,
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
