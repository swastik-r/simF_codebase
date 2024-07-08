import { Divider, Icon } from "@rneui/themed";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Image, Button } from "@rneui/themed";

export default function PoCard() {
   const contentData = [
      { label: "ASN Quantity", value: "10" },
      { label: "Received Quantity", value: "10" },
   ];
   function ContentLine({ label, value }) {
      return (
         <View
            style={{
               flexDirection: "row",
               alignItems: "center",
            }}
         >
            <Text style={styles.productInfo}>{label}</Text>
            <Button
               onPress={() => {
                  console.log("Button Pressed");
               }}
               title={value}
               type="outline"
               buttonStyle={{
                  borderRadius: 20,
                  borderColor: "black",
                  borderWidth: 1,
                  paddingHorizontal: 10,
                  paddingVertical: 2,
                  marginHorizontal: 10,
               }}
            />
         </View>
      );
   }

   return (
      <View style={styles.card}>
         <View style={styles.cardHeader}>
            <View>
               <Text style={styles.id}>ITEM-D245561O</Text>
               <Text style={styles.productInfo}>
                  Product Name / Color / Size
               </Text>
            </View>
            <Icon
               name="delete-circle-outline"
               type="material-community"
               color={"crimson"}
            />
         </View>

         <View style={styles.contentContainer}>
            <View style={styles.imageContainer} />
            <View style={styles.contentContainerInner}>
               {contentData.map((item, index) => (
                  <ContentLine key={index} {...item} />
               ))}
            </View>
         </View>

         <Divider style={{ marginVertical: 15, marginHorizontal: 10 }} />

         <View style={styles.uploadContainer}>
            <Button
               title={"Upload Proof"}
               icon={{
                  name: "upload",
                  type: "material-community",
                  color: "white",
                  size: 18,
               }}
               titleStyle={{ fontFamily: "Montserrat-Bold", fontSize: 12 }}
               iconContainerStyle={{ margin: 0 }}
               buttonStyle={{
                  backgroundColor: "navy",
                  borderRadius: 20,
               }}
            />
            <Text style={styles.uploadText}>0 Proofs Uploaded</Text>
         </View>
      </View>
   );
}

export function ASNCard() {
   return <View style={styles.card} />;
}

// const styles = StyleSheet.create({

const styles = StyleSheet.create({
   card: {
      backgroundColor: "white",
      borderWidth: 1,
      borderColor: "lightgrey",
      borderRadius: 20,
      padding: 15,
      margin: 10,
      elevation: 3,
   },
   cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
   },
   id: {
      fontFamily: "Montserrat-Bold",
      marginBottom: 3,
   },
   productInfo: {
      fontFamily: "Montserrat-Regular",
   },
   imageContainer: {
      backgroundColor: "crimson",
      width: 80,
      height: 80,
      borderRadius: 10,
   },
   contentContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   contentContainerInner: {
      flex: 1,
      marginLeft: 30,
      alignSelf: "stretch",
      justifyContent: "space-evenly",
   },

   uploadContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
   },
   uploadText: {
      fontFamily: "Montserrat-Bold",
      color: "grey",
      fontSize: 12,
   },
});
