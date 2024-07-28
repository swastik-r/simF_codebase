import { getData, postData, storeName } from "../../context/auth";
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

export default function AsnItems({ route }) {
   // States and consts
   const { poItem, asnItem } = route.params;
   let asnId, asnStatus;
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
   async function createAsn() {
      function convertToCreateAsnDto(item) {
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
            imageData: "string",
            upc: "string",
            sku: "string",
            taxPercentage: "string",
            taxCode: "string",
            receivedDate: new Date().toISOString().split("T")[0],
         };

         const convertedData = { ...asnDetails, ...item };
         convertedData.expectedQty = item.qty;
         convertedData.shippedQty = item.qty;
         delete convertedData.qty;
         return convertedData;
      }

      const requestBody = {
         asn: {
            creationDate: new Date().toISOString().split("T")[0],
            receivingDate: new Date().toISOString().split("T")[0],
            status: "Pending",
            supplier: poItem.supplierName,
            totalQty: 0,
            totalSku: 0,
            poNumber: poItem.id,
         },
         asnDetails: tempItems.map(convertToCreateAsnDto),
      };

      try {
         const response = await postData(endpoints.createAsn, requestBody);
         return response.asn.asnNumber;
      } catch (error) {
         console.error("Failed to create ASN: ", error.message);
      }

      navigation.goBack();
   }
   async function saveAsnItems(asnId) {
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
            imageData: "string",
            upc: "string",
            sku: "string",
            taxPercentage: "string",
            taxCode: "string",
            receivedDate: new Date().toISOString().split("T")[0],
         };

         const convertedData = { ...asnDetails, ...item };
         return convertedData;
      }

      const requestBody = {
         asn: {
            creationDate: new Date().toISOString().split("T")[0],
            receivingDate: new Date().toISOString().split("T")[0],
            status: "Saved",
            supplier: poItem.supplierName,
            totalQty: tempItems.reduce(
               (acc, item) => acc + item.expectedQty,
               0
            ),
            totalSku: tempItems.length,
            poNumber: poItem.id,
         },
         asnDetails: tempItems.map(convertItemToSaveAsnDto),
      };

      try {
         await postData(endpoints.saveAsnItems + asnId, requestBody);
         navigation.goBack();
      } catch (error) {
         console.error("Failed to save ASN items.", error);
         throw error;
      }
   }
   async function submitAsnItems(asnId) {
      function convertToSubmitAsnDto(item) {
         console.log("Item:", item);

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
            imageData: "string",
            upc: "string",
            sku: "string",
            taxPercentage: "string",
            taxCode: "string",
            poNumber: "string",
         };

         const convertedData = { ...template, ...item };
         convertedData.poNumber = poItem.id;
         convertedData.expectedQty = item.qty;
         convertedData.receivedQty = item.qty;
         delete convertedData.qty;

         console.log("Converted Data:", convertedData);

         return convertedData;
      }

      const requestBody = {
         attachedImage: "string",
         asnNumber: asnId,
         purchaseOrderItemsdto: tempItems.map(convertToSubmitAsnDto),
      };

      try {
         await postData(endpoints.submitAsnItems + storeName, requestBody);
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
                        title={"Save"}
                        titleStyle={{ fontFamily: "Montserrat-Bold" }}
                        buttonStyle={{
                           marginRight: 40,
                           borderRadius: 20,
                           width: 100,
                        }}
                        onPress={() =>
                           asnId ? saveAsnItems(asnId) : createAsn()
                        }
                     />
                     <Button
                        title={"Submit"}
                        titleStyle={{ fontFamily: "Montserrat-Bold" }}
                        buttonStyle={{
                           borderRadius: 20,
                           width: 100,
                        }}
                        onPress={() =>
                           asnId ? submitAsnItems(asnId) : createAsn()
                        }
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
                     type: "ASN",
                     tempItems,
                     setTempItems,
                     tempSupplier: null,
                  })
               }
               style={{ position: "absolute", bottom: 80, right: 10 }}
            />
         )}
      </ImageBackground>
   );
}
