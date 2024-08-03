import {
   compareStructure,
   getData,
   postData,
   storeName,
} from "../../context/auth";
import { FlatList } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ImageBackground, View } from "react-native";
import backgroundImg from "../../assets/bg3.jpg";

// Custom Components
import { endpoints } from "../../context/endpoints";
import { Button } from "@rneui/themed";
import { FAB } from "react-native-paper";
import EmptyPageComponent from "../../globalComps/EmptyPageComp";
import ItemCard from "../../page/ItemListing/ItemCard";
import Toast from "react-native-toast-message";

export default function AsnItems({ route }) {
   // States and consts
   const { poItem, asnItem } = route.params;
   let asnId, asnStatus;
   // if asnItem is not null, then load the asnId and asnStatus
   if (asnItem) {
      asnId = asnItem.asnNumber;
      asnStatus = asnItem.status;
   }
   const [tempItems, setTempItems] = useState([]);
   const navigation = useNavigation();

   // Functions
   async function getAsnItems() {
      try {
         const response = await getData(endpoints.fetchAsnItems + asnId);
         setTempItems(response);
      } catch (error) {
         console.error("Failed to fetch ASN items.", error);
      }
   }
   async function saveAsnItems() {
      function convertItemToSaveAsnDto(item) {
         const asnDetails = {
            itemNumber: "string",
            itemName: "string",
            expectedQty: 0,
            shippedQty: 0,
            remainingQty: 0,
            category: "string",
            color: "string",
            price: "string",
            size: "string",
            image: null,
            imageData: "string",
            upc: "string",
            sku: "string",
            taxPercentage: "string",
            taxCode: "string",
            receivedDate: new Date().toISOString().split("T")[0],
         };

         const convertedData = { ...asnDetails, ...item };

         if (item.qty) {
            convertedData.expectedQty = Number(item.qty);
            convertedData.receivedQty = Number(item.qty);
            convertedData.shippedQty = Number(item.qty);
            convertedData.remainingQty = 0;
            delete convertedData.qty;
         }

         return convertedData;
      }

      const convertedItems = tempItems.map(convertItemToSaveAsnDto);

      const requestBody = {
         asn: {
            creationDate: new Date().toISOString().split("T")[0],
            receivingDate: null,
            status: "Saved",
            supplier: poItem.supplierName,
            totalQty: convertedItems.reduce(
               (total, item) => total + Number(item.expectedQty),
               0
            ),
            totalSku: convertedItems.length,
            poNumber: poItem.id,
         },
         asnDetails: convertedItems,
      };

      console.log("Saving this info:", requestBody);

      try {
         let asnId = asnItem?.asnNumber;
         if (!asnId) {
            asnId = await postData(endpoints.createAsn, requestBody);
         }
         await postData(
            endpoints.saveAsnItems + `?asnNumber=${asnId}`,
            requestBody
         );
         navigation.goBack();
      } catch (error) {
         console.error("Failed to save ASN items.", error);
         throw error;
      }
   }
   async function submitAsnItems() {
      function convertToSubmitAsnDto(item) {
         const template = {
            itemNumber: "string",
            itemName: "string",
            expectedQty: 0,
            receivedQty: 0,
            remainingQty: 0,
            damageQty: 0,
            damageImage: "string",
            category: "string",
            color: "string",
            price: "string",
            size: "string",
            image: null,
            imageData: "string",
            upc: "string",
            taxPercentage: "string",
            taxCode: "string",
            poNumber: poItem.id,
         };

         const convertedData = { ...template, ...item };
         // item received from PO-specific search
         if (item.qty) {
            convertedData.expectedQty = Number(item.qty);
            convertedData.receivedQty = Number(item.qty);
            delete convertedData.qty;
         }
         // pre-saved ASN item
         if (item.shippedQty) {
            convertedData.receivedQty = Number(item.shippedQty);
            delete convertedData.shippedQty;
         }

         return convertedData;
      }
      function convertItemToSaveAsnDto(item) {
         const asnDetails = {
            itemNumber: "string",
            itemName: "string",
            expectedQty: 0,
            shippedQty: 0,
            remainingQty: 0,
            receivedQty: 0,
            damageQty: 0,
            damageImage: "string",
            category: "string",
            color: "string",
            price: "string",
            size: "string",
            imageData: "string",
            image: "string",
            upc: "string",
            sku: "string",
            taxPercentage: "string",
            taxCode: "string",
            receivedDate: new Date().toISOString().split("T")[0],
         };

         const convertedData = { ...asnDetails, ...item };
         // if for an item qty exists, set expectedQty and receivedQty, delete qty
         if (item.qty) {
            convertedData.expectedQty = Number(item.qty);
            convertedData.shippedQty = Number(item.qty);
            delete convertedData.qty;
         }
         return convertedData;
      }

      try {
         // Create ASN
         if (!asnId) {
            const createRequestBody = {
               asn: {
                  creationDate: new Date().toISOString().split("T")[0],
                  receivingDate: new Date().toISOString().split("T")[0],
                  status: "Pending",
                  supplier: poItem.supplierName,
                  totalQty: tempItems.reduce(
                     (total, item) => total + Number(item.qty),
                     0
                  ),
                  totalSku: tempItems.length,
                  poNumber: poItem.id,
               },
               asnDetails: tempItems.map(convertItemToSaveAsnDto),
            };
            const saveRequestTemplate = {
               asn: {
                  creationDate: "2024-08-02",
                  receivingDate: "2024-08-02",
                  status: "string",
                  supplier: "string",
                  totalQty: 0,
                  totalSku: 0,
                  poNumber: "string",
               },
               asnDetails: [
                  {
                     itemNumber: "string",
                     itemName: "string",
                     expectedQty: 0,
                     shippedQty: 0,
                     remainingQty: 0,
                     receivedQty: 0,
                     damageQty: 0,
                     damageImage: "string",
                     category: "string",
                     color: "string",
                     price: "string",
                     size: "string",
                     imageData: "string",
                     image: "string",
                     upc: "string",
                     sku: "string",
                     taxPercentage: "string",
                     taxCode: "string",
                     receivedDate: "2024-08-02",
                  },
               ],
            };

            // if the compareStructure function returns true for createRequestBody and saveRequestBody
            if (compareStructure(createRequestBody, saveRequestTemplate)) {
               asnId = await postData(endpoints.createAsn, createRequestBody);
            } else {
               throw new Error("Request body structure mismatch");
            }
         }

         // Submit ASN
         const submitRequestBody = {
            attachedImage: "string",
            asnNumber: asnId,
            purchaseOrderItemsdto: tempItems.map(convertToSubmitAsnDto),
         };
         console.log(
            "Submitting this info:",
            JSON.stringify(submitRequestBody, null, 2)
         );
         await postData(
            endpoints.submitAsnItems + storeName,
            submitRequestBody
         );
         Toast.show({
            type: "success",
            text1: "ASN Submitted",
            text2: "ASN has been successfully submitted.",
         });
      } catch (error) {
         console.error("Failed to save ASN items.", error);
         throw error;
      }

      navigation.goBack();
   }
   function deleteItem(sku) {
      setTempItems(tempItems.filter((item) => item.sku !== sku));
   }

   useEffect(() => {
      asnId && getAsnItems();
   }, []);

   return (
      <ImageBackground source={backgroundImg} style={{ flex: 1 }}>
         <FlatList
            data={tempItems}
            keyExtractor={(item) => item.sku}
            renderItem={({ item }) => (
               <ItemCard {...{ item, status: asnStatus, deleteItem }} />
            )}
            ListHeaderComponent={
               asnStatus !== "Complete" && (
                  <View
                     style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignSelf: "center",
                        marginBottom: 20,
                     }}
                  >
                     <Button
                        disabled={tempItems.length === 0}
                        title={"SAVE"}
                        titleStyle={{ fontFamily: "Montserrat-Medium" }}
                        buttonStyle={{
                           marginRight: 40,
                           borderRadius: 20,
                           width: 100,
                        }}
                        onPress={saveAsnItems}
                     />
                     <Button
                        disabled={tempItems.length === 0}
                        title={"SUBMIT"}
                        titleStyle={{ fontFamily: "Montserrat-Medium" }}
                        buttonStyle={{
                           borderRadius: 20,
                           width: 100,
                        }}
                        onPress={submitAsnItems}
                     />
                  </View>
               )
            }
            ListEmptyComponent={<EmptyPageComponent />}
            contentContainerStyle={{
               paddingTop: 10,
               paddingBottom: 100,
               paddingHorizontal: 15,
            }}
         />

         {/* FAB to add items */}
         {asnStatus !== "Complete" && (
            <FAB
               icon="qrcode-scan"
               onPress={() =>
                  navigation.navigate("Add Items", {
                     type: "PO",
                     tempItems,
                     setTempItems,
                     tempSupplier: null,
                     poItem,
                  })
               }
               style={{ position: "absolute", bottom: 80, right: 10 }}
            />
         )}
      </ImageBackground>
   );
}
