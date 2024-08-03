import { useEffect, useState } from "react";
import {
   FlatList,
   View,
   ImageBackground,
   Text,
   StyleSheet,
   Alert,
} from "react-native";
import backgroundImg from "../../assets/bg3.jpg";
import ItemCard from "./ItemCard";
import { useNavigation } from "@react-navigation/native";
import { Button, Overlay, Input, Image, Icon } from "@rneui/themed";
import { PaperProvider, Portal, FAB } from "react-native-paper";
import SearchBar from "./SearchBar_FS";
import EmptyPageComponent from "../../globalComps/EmptyPageComp";
import { getData, postData, storeName } from "../../context/auth";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import XLSX from "xlsx";
import uploadImage from "../../assets/uploadImage.png";
import { handleDelete } from "../../context/functions";
import { endpoints } from "../../context/endpoints";
import { useIsFocused } from "@react-navigation/native";
import { AsnCard2 } from "../../modules/PurchaseOrder/AsnCard";

export default function EntryItemDetailPage({ route }) {
   const { entryItem } = route.params;
   const { type, status } = entryItem;
   const [tempItems, setTempItems] = useState([]);
   const [tempReason, setTempReason] = useState("");
   const [tempSupplier, setTempSupplier] = useState("");
   const [headerItem, setHeaderItem] = useState({});

   const typesList1 = ["IA", "DSD"];
   const typesList2 = ["PO"];

   // Fetch the items
   async function getHeaderItem() {
      if (type === "PO") {
         const response = await getData(endpoints.fetchPO);
         setHeaderItem(response.find((po) => po.id === entryItem.id));
      }
   }
   async function getItemsAndReason() {
      if (status !== "In Progress") {
         if (type === "IA") {
            const response = await getData(
               endpoints.fetchItemsIA + entryItem.id
            );
            setTempItems(response.items);
            setTempReason(response.reason);
         } else if (type === "DSD") {
            const response = await getData(
               endpoints.fetchItemsDSD + entryItem.id
            );
            setTempItems(response.items);
            setTempSupplier(response.supplierName);
         }
      }
   }
   async function getASNItems() {
      const response = await getData(endpoints.fetchASNForPO + entryItem.id);
      setTempItems(response);
   }
   function deleteItem(sku) {
      setTempItems(tempItems.filter((item) => item.sku !== sku));
   }

   const isFocused = useIsFocused();
   useEffect(() => {
      if (typesList1.includes(type)) {
         if (status !== "In Progress") {
            getItemsAndReason();
         }
      } else if (typesList2.includes(type)) {
         getHeaderItem();
         getASNItems();
      }
   }, [isFocused]);

   // Show overlay for reason or supplier based on the fetched data
   const [reasonsOverlay, setReasonsOverlay] = useState(
      isFocused && type === "IA" && !tempReason && !entryItem.reason
   );
   const [supplierOverlay, setSupplierOverlay] = useState(
      isFocused && type === "DSD" && !tempSupplier && !entryItem.supplierName
   );

   return (
      <ImageBackground source={backgroundImg} style={{ flex: 1 }}>
         <PaperProvider>
            <FlatList
               data={tempItems}
               keyExtractor={
                  // if type is IA or DSD, use sku as key
                  // if type is PO, use asnNumber as key
                  ({ sku, asnNumber }) =>
                     ({
                        IA: sku,
                        DSD: sku,
                        PO: asnNumber,
                     }[type])
               }
               renderItem={
                  // if type is IA or DSD, render ItemCard
                  // if type is PO, render AsnCard
                  ({ item }) =>
                     ({
                        IA: <ItemCard {...{ item, status, deleteItem }} />,
                        DSD: <ItemCard {...{ item, status, deleteItem }} />,
                        PO: (
                           // <AsnCard {...{ item, entryItem }} />
                           <AsnCard2 {...{ item, entryItem }} />
                        ),
                     }[type])
               }
               ListHeaderComponent={() => (
                  <>
                     <DetailsTab
                        {...{
                           type,
                           entryItem,
                           tempItems,
                           tempReason,
                           tempSupplier,
                           headerItem,
                        }}
                     />

                     {status !== "Complete" && type !== "PO" && (
                        <ButtonGroup
                           {...{
                              entryItem,
                              tempItems,
                              tempReason,
                              setTempReason,
                              tempSupplier,
                              setTempSupplier,
                           }}
                        />
                     )}

                     {status === "Complete" && type !== "PO" && (
                        <SearchBar {...{ setTempItems, entryItem }} />
                     )}

                     <ReasonsOverlay
                        {...{
                           setTempReason,
                           reasonsOverlay,
                           setReasonsOverlay,
                        }}
                     />

                     <SupplierOverlay
                        {...{
                           setTempSupplier,
                           supplierOverlay,
                           setSupplierOverlay,
                        }}
                     />
                  </>
               )}
               ListFooterComponent={
                  status !== "Complete" && (
                     <MyFabGroup
                        {...{
                           entryItem,
                           tempItems,
                           setTempItems,
                           tempSupplier,
                           getASNItems,
                        }}
                     />
                  )
               }
               ListEmptyComponent={<EmptyPageComponent />}
               contentContainerStyle={{
                  paddingTop: 10,
                  paddingBottom: 100,
                  paddingHorizontal: 15,
               }}
            />
         </PaperProvider>
      </ImageBackground>
   );
}

export function DetailsTab({
   type,
   entryItem,
   tempItems,
   tempReason,
   tempSupplier,
   headerItem,
}) {
   function Detail({ label, value }) {
      return (
         <View
            style={{
               marginVertical: 5,
               flexDirection: "row",
            }}
         >
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
         </View>
      );
   }
   function DetailRight({ label, value }) {
      return (
         <View
            style={{
               marginVertical: 5,
               flexDirection: "row",
               justifyContent: "flex-end",
            }}
         >
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
         </View>
      );
   }
   // Conditionally add the supplier or reason based on the entryItem type
   const details = {
      IA: [
         { label: "ID", value: entryItem.id },
         {
            label: "Reason",
            value: entryItem.reason || tempReason,
         },
         { label: "Date", value: entryItem.date },
         { label: "Total SKU", value: tempItems.length || entryItem.totalSku },
      ],
      DSD: [
         { label: "ID", value: entryItem.id },
         {
            label: "Supplier",
            value: entryItem.reason || tempSupplier,
         },
         { label: "Date", value: entryItem.date },
         { label: "Total SKU", value: tempItems.length || entryItem.totalSku },
      ],
      PO: [
         { label: "ID", value: headerItem.id },
         { label: "Date", value: headerItem.date },
         { label: "Total SKU", value: headerItem.totalSku },
         { label: "Supplier", value: headerItem.supplierId },
         { label: "Ordered Quantity", value: headerItem.expectedQty },
         { label: "Received Quantity", value: headerItem.receivedQty },
         {
            label: "Pending Quantity",
            value: headerItem.pendingQty,
         },
         {
            label: "Damaged Quantity",
            value: headerItem.damageQty,
         },
      ],
   };

   return (
      <>
         <View style={styles.detailCard}>
            {/* if there are odd number of baseDetails items, center the last one vertically */}
            <View style={{ flexDirection: "row" }}>
               <View style={{ flex: 1 }}>
                  {details[type]
                     .slice(0, Math.ceil(details[type].length / 2))
                     .map((detail) => (
                        <Detail key={detail.label} {...detail} />
                     ))}
               </View>
               <View style={{ flex: 1 }}>
                  {details[type]
                     .slice(Math.ceil(details[type].length / 2))
                     .map((detail) => (
                        <Detail key={detail.label} {...detail} />
                     ))}
               </View>
            </View>
         </View>

         {/* ASN Count for PO */}
         {type === "PO" && (
            <View style={styles.asnCountContainer}>
               <Text style={styles.asnCountLabel}>ASN Count:</Text>
               <Text style={styles.asnCount}>{headerItem.asnCount}</Text>
            </View>
         )}
      </>
   );
}

function ButtonGroup({ entryItem, tempItems, tempReason, tempSupplier }) {
   // States and vars
   const canSaveOrSubmit =
      tempItems.length > 0 && (tempReason !== "" || tempSupplier !== "");

   // Overlay states
   const [dropdownMenu, setDropdownMenu] = useState(false);
   const [proofOverlay, setProofOverlay] = useState(false);

   return (
      <View
         style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginVertical: 10,
         }}
      >
         {/* Save Button */}
         <Button
            // disabled={!canSaveOrSubmit}
            title="Save"
            titleStyle={styles.buttonTitle}
            icon={{
               name: "content-save-outline",
               type: "material-community",
               color: "white",
            }}
            buttonStyle={styles.button}
            onPress={() => setProofOverlay(true)}
         />
         {/* Submit Button */}
         <Button
            // disabled={!canSaveOrSubmit}
            title="Submit"
            titleStyle={styles.buttonTitle}
            icon={{
               name: "content-save-outline",
               type: "material-community",
               color: "white",
            }}
            buttonStyle={styles.button}
            onPress={() => setProofOverlay(true)}
         />

         {/* Proof Overlay */}
         <ProofOverlay
            {...{
               entryItem,
               tempReason,
               tempSupplier,
               tempItems,

               proofOverlay,
               setProofOverlay,
            }}
         />
      </View>
   );
}

function ReasonsOverlay({ setTempReason, reasonsOverlay, setReasonsOverlay }) {
   // USEEFFECT: Fetch the reasons
   useEffect(() => {
      fetchReasons().then((data) => setReasons(data));
   }, []);

   // States and vars
   const [reasons, setReasons] = useState([]);
   const navigation = useNavigation();

   // Functions
   async function fetchReasons() {
      return await getData(endpoints.fetchReasons);
   }
   function setReason(item) {
      setTempReason(item);
      setReasonsOverlay(false);
      Toast.show({
         type: "success",
         text1: "Success",
         text2: "Reason selected successfully",
      });
   }
   function cancelSelection() {
      setReasonsOverlay(false);
      navigation.goBack();
   }

   // Render the overlay
   return (
      <Overlay
         isVisible={reasonsOverlay}
         overlayStyle={{ width: "60%", borderRadius: 20 }}
      >
         <FlatList
            data={reasons}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
               <Button
                  title={item}
                  titleStyle={styles.buttonTitle}
                  buttonStyle={styles.button}
                  containerStyle={{ margin: 10 }}
                  onPress={() => setReason(item)}
               />
            )}
            ListHeaderComponent={
               <Text
                  style={{
                     fontFamily: "Montserrat-Bold",
                     fontSize: 20,
                     marginVertical: 15,
                     alignSelf: "center",
                  }}
               >
                  Select a Reason
               </Text>
            }
            ListFooterComponent={
               <Button
                  type="clear"
                  title="CANCEL"
                  icon={{
                     name: "close",
                     type: "material-community",
                     color: "crimson",
                  }}
                  buttonStyle={[styles.button, { marginVertical: 10 }]}
                  titleStyle={[styles.buttonTitle, { color: "crimson" }]}
                  onPress={cancelSelection}
               />
            }
         />
      </Overlay>
   );
}

function SupplierOverlay({
   setTempSupplier,
   supplierOverlay,
   setSupplierOverlay,
}) {
   // States and vars
   const [suggestions, setSuggestions] = useState([]);
   const [supplierId, setSupplierId] = useState("");
   const navigation = useNavigation();

   async function handleSupplierIdChange(text) {
      try {
         // Trim the input text to remove any leading or trailing whitespace
         const trimmedText = text.trim();

         // Set the supplier ID state
         setSupplierId(trimmedText);

         // If the trimmed text is not empty, proceed with fetching data
         if (trimmedText) {
            const data = await getData(
               `${endpoints.fetchSupplierByNameOrId}${trimmedText}`
            );

            // Check if data is an object and convert it to an array of objects for FlatList
            if (data && typeof data === "object") {
               const formattedSuggestions = Object.entries(data).map(
                  ([key, value]) => ({ id: key, name: value })
               );
               setSuggestions(formattedSuggestions);
            } else {
               setSuggestions([]);
            }
         } else {
            // If the trimmed text is empty, reset suggestions
            setSuggestions([]);
         }
      } catch (error) {
         console.error("Error fetching suppliers:", error);

         // Display an alert to the user in case of an error
         Alert.alert(
            "Error",
            "An error occurred while fetching suppliers. Please try again."
         );

         // Reset suggestions in case of an error
         setSuggestions([]);
      }
   }

   return (
      <Overlay
         isVisible={supplierOverlay}
         overlayStyle={{ width: "70%", padding: 20 }}
      >
         <View style={{ flexDirection: "row" }}>
            <Icon
               name="person-search"
               type="material"
               size={30}
               iconStyle={{ marginRight: 10 }}
            />
            <Text
               style={{
                  fontFamily: "Montserrat-Bold",
                  fontSize: 20,
                  marginBottom: 15,
               }}
            >
               Search Supplier
            </Text>
         </View>
         <Input
            placeholder="Enter a Supplier Name or ID"
            value={supplierId}
            onChangeText={handleSupplierIdChange}
         />

         {/* Each suggestion should show the info like: Sup101: ABC Industries */}
         <FlatList
            data={suggestions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
               <Button
                  type="outline"
                  title={`${item.id}: ${item.name}`}
                  titleStyle={styles.buttonTitle}
                  buttonStyle={styles.button}
                  containerStyle={{ margin: 10 }}
                  onPress={() => {
                     setTempSupplier(item.id);
                     setSupplierOverlay(false);
                  }}
               />
            )}
            ListFooterComponent={
               <Button
                  type="clear"
                  title="Cancel"
                  icon={{
                     name: "close",
                     type: "material-community",
                     color: "crimson",
                  }}
                  buttonStyle={[styles.button, { alignSelf: "center" }]}
                  titleStyle={styles.buttonTitle}
                  onPress={() => {
                     setSupplierOverlay(false);
                     navigation.goBack();
                  }}
               />
            }
         />
      </Overlay>
   );
}

function ProofOverlay({
   entryItem,
   tempReason,
   tempSupplier,
   tempItems,
   proofOverlay,
   setProofOverlay,
}) {
   const navigation = useNavigation();
   const [image, setImage] = useState("");

   // Functions
   async function pickImage() {
      const result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Images,
         allowsEditing: true,
         aspect: [1, 1],
         quality: 1,
      });
      if (!result.canceled) {
         setImage(result.uri);
      }
   }
   async function handleSubmit() {
      const data = {
         id: entryItem.id,
         totalSku: tempItems.reduce((acc, item) => acc + item.qty, 0),
         status: "Complete",
         items: tempItems,
         imageData: image,
      };

      if (entryItem.type === "IA") {
         data.reason = tempReason;
         console.log("SUBMIT DATA", data);
         await postData(endpoints.submitIA, data);
      } else if (entryItem.type === "DSD") {
         data.supplierName = tempSupplier;
         console.log("SUBMIT DATA", data);
         await postData(endpoints.submitDSD, data);
      }

      navigation.goBack();
   }

   return (
      <Overlay
         isVisible={proofOverlay}
         onBackdropPress={() => setProofOverlay(false)}
         overlayStyle={{ width: "50%", alignItems: "center", borderRadius: 20 }}
      >
         <Text
            style={{
               fontFamily: "Montserrat-Bold",
               fontSize: 16,
            }}
         >
            Upload Proof
         </Text>

         <Image source={uploadImage} style={{ width: 200, height: 200 }} />

         <View
            style={{
               width: "100%",
               flexDirection: "row",
               justifyContent: "space-evenly",
            }}
         >
            <Button
               title="Upload"
               buttonStyle={styles.button}
               titleStyle={styles.buttonTitle}
               onPress={() => {
                  pickImage();
                  handleSubmit();
               }}
            />
            <Button
               title="Skip"
               buttonStyle={styles.button}
               titleStyle={styles.buttonTitle}
               onPress={handleSubmit}
            />
         </View>
      </Overlay>
   );
}

function MyFabGroup({
   entryItem,
   tempItems,
   setTempItems,
   tempSupplier,
   getASNItems,
}) {
   // FAB Group States and Properties
   const [state, setState] = useState({ open: false });
   const { open } = state;

   // Additional States and Functions
   const navigation = useNavigation();
   const { type } = entryItem;

   function onStateChange({ open }) {
      setState({ open });
   }
   async function handleExcelUpload() {
      try {
         console.log("Opening document picker...");

         const res = await DocumentPicker.getDocumentAsync({
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
         });

         if (!res.canceled && res.assets && res.assets.length > 0) {
            const fileUri = res.assets[0].uri;

            // Read the file as a base64 string
            const fileContent = await FileSystem.readAsStringAsync(fileUri, {
               encoding: FileSystem.EncodingType.Base64,
            });

            // Parse the file using XLSX
            const wb = XLSX.read(fileContent, {
               type: "base64",
               cellDates: true,
            });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(ws);

            const items = [];
            const errors = [];

            for (const [index, item] of data.entries()) {
               // Data validation
               if (!item.SKU || !item.Quantity) {
                  errors.push(
                     `Row ${index + 1}: Missing item SKU or quantity.`
                  );
                  continue;
               }
               if (!item.SKU.startsWith("sku")) {
                  errors.push(
                     `Row ${index + 1}: Item ID must start with "sku".`
                  );
                  continue;
               }
               if (item.Quantity <= 0) {
                  errors.push(
                     `Row ${index + 1}: Quantity must be greater than 0.`
                  );
                  continue;
               }

               try {
                  const response = await getData(
                     `/product/findbysku/${item.SKU}/${storeName}`
                  );
                  const foundItem = response.items ? response.items[0] : null;

                  if (!foundItem) {
                     errors.push(`Row ${index + 1}: Item not found.`);
                     continue;
                  }

                  // if item already exists, update the quantity
                  // else push the item to the tempItems with

                  const existingItem = tempItems.find(
                     (i) => i.sku === foundItem.sku
                  );
                  if (existingItem) {
                     existingItem.qty += item.Quantity;
                  } else {
                     items.push({
                        ...foundItem,
                        qty: item.Quantity,
                     });
                  }
               } catch (e) {
                  errors.push(`Row ${index + 1}: Error fetching item.`);
                  continue;
               }
            }

            // If errors exist, console.log and return
            if (errors.length > 0) {
               Alert.alert("Invalid data found", errors.join("\n"));
               Toast.show({
                  type: "error",
                  text1: "Error!",
                  text2: "There were errors in the data!",
               });
               return;
            }

            // Add the items to the tempItems
            setTempItems([...tempItems, ...items]);

            // Show a success toast
            Toast.show({
               type: "success",
               text1: "Success",
               text2: "Items added successfully",
            });
         }
      } catch (error) {
         console.log("Error reading file:", error);
         Toast.show({
            type: "error",
            text1: "Error",
            text2: "Error reading the file",
         });
      }
   }
   function navigateToCreateASN() {
      navigation.navigate("Create ASN", {
         poItem: entryItem,
         asnId: null,
      });
   }

   const validActions = [
      {
         icon: "file-excel",
         label: "Upload Excel Data",
         onPress: () => {
            handleExcelUpload();
            setState({ open: false });
         },
      },
      {
         icon: "qrcode-scan",
         label: "Add Item",
         onPress: () =>
            navigation.navigate("Add Items", {
               type: entryItem.type,
               tempItems,
               setTempItems,
               tempSupplier,
            }),
      },
   ];
   const actionsIA = validActions;
   const actionsDSD = validActions.filter(
      (action) => action.label !== "Upload Excel Data"
   );
   const actionsPO = [
      {
         icon: "plus",
         label: "Create ASN",
         onPress: navigateToCreateASN,
      },
   ];

   // Select the actions based on the TYPE
   const selectedActions = {
      IA: actionsIA,
      DSD: actionsDSD,
      PO: actionsPO,
   }[type];

   // use FAB for single action, FAB.Group for multiple actions
   return selectedActions.length === 1 ? (
      <Portal>
         <FAB
            style={{ position: "absolute", bottom: 80, right: 10 }}
            icon={selectedActions[0].icon}
            onPress={selectedActions[0].onPress}
         />
      </Portal>
   ) : (
      <Portal>
         <FAB.Group
            style={{ marginBottom: 70 }}
            open={open}
            visible
            icon={open ? "close" : "plus"}
            iconColor="white"
            actions={selectedActions}
            onStateChange={onStateChange}
         />
      </Portal>
   );
}

const styles = StyleSheet.create({
   detailCard: {
      backgroundColor: "#465B73AA",
      marginTop: 10,
      marginBottom: 10,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
   },
   label: {
      fontFamily: "Montserrat-Regular",
      fontSize: 13,
      color: "white",
      marginRight: 10,
   },
   value: {
      fontFamily: "Montserrat-Bold",
      fontSize: 13,
      color: "white",
   },

   button: {
      borderRadius: 10,
      width: 120,
      alignSelf: "center",
   },
   buttonTitle: {
      fontFamily: "Montserrat-Bold",
      fontSize: 14,
   },

   asnCountContainer: {
      flexDirection: "row",
      marginVertical: 10,
   },
   asnCountLabel: {
      fontFamily: "Montserrat-Regular",
      fontSize: 20,
      color: "black",
      marginRight: 5,
   },
   asnCount: {
      fontFamily: "Montserrat-Bold",
      fontSize: 20,
      color: "black",
   },
});
