import { Button, Overlay } from "@rneui/themed";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, FlatList } from "react-native";
import { Divider } from "@rneui/themed";
import { getData, storeName } from "../../context/auth";
import { endpoints } from "../../context/endpoints";
import { useNavigation } from "@react-navigation/native";

export default function ItemStock({ route }) {
   const { item } = route.params;
   const navigation = useNavigation();

   return (
      <View style={styles.page}>
         {/* Product Name */}
         <Text style={styles.productName}>{item.itemName}</Text>

         {/* Product Image Carousel */}
         <Image style={styles.productImage} source={{ uri: item.imageData }} />

         {/* Product Detail Card */}
         <DetailCard {...{ item }} />

         {/* Buddy Stock Check Button */}
         <Button
            icon={{
               name: "text-box-search",
               type: "material-community",
               color: "white",
               size: 20,
            }}
            title="Check Buddy Stock"
            titleStyle={{ fontFamily: "Montserrat-Regular" }}
            onPress={() => {
               navigation.navigate("Buddy Stock", { item });
            }}
         />
      </View>
   );
}

function DetailCard({ item }) {
   // States and Constants
   const [currentItem, setCurrentItem] = useState(item || {});
   const [sizes, setSizes] = useState([]);
   const [colors, setColors] = useState([]);
   const [selectedSize, setSelectedSize] = useState(item.size || "N/A");
   const [selectedColor, setSelectedColor] = useState(item.color || "N/A");
   const [sizesOverlay, setSizesOverlay] = useState(false);
   const [colorsOverlay, setColorsOverlay] = useState(false);

   // Components
   function ProductInfoContainer({ label, value }) {
      return (
         <View style={{ flexDirection: "row" }}>
            <Text style={styles.productInfoLabel}>{label}</Text>
            <Text style={styles.productInfoValue}>{value}</Text>
         </View>
      );
   }

   function VariantInfoContainer({ label, value }) {
      return (
         <View>
            <Text style={styles.variantInfoLabel}>{label}</Text>
            <Text style={styles.variantInfoValue}>{value}</Text>
         </View>
      );
   }

   // Sync Functions
   function changeSize(size) {
      setSelectedSize(size);
      setSizesOverlay(false);
      fetchCurrentDetails(size, selectedColor);
   }
   function changeColor(color) {
      setSelectedColor(color);
      setColorsOverlay(false);
      fetchCurrentDetails(selectedSize, color);
   }

   // Async Functions
   async function getVariants() {
      try {
         const response = await getData(
            `${endpoints.fetchVariants}${item.itemNumber}`
         );
         setSizes(response.sizes || []);
         setColors(response.colors || []);
      } catch (error) {
         console.error("Error fetching variants:", error);
      }
   }
   async function fetchCurrentDetails(size, color) {
      try {
         const response = await getData(
            `${endpoints.fetchCurrentDetails}/${size}/${color}/${item.itemNumber}/${storeName}`
         );
         setCurrentItem(response || {});
      } catch (error) {
         console.error("Error fetching current details:", error);
      }
   }

   // useEffect: Fetch Variants
   useEffect(() => {
      getVariants();
   }, []);

   // useEffect: Fetch Current Details
   useEffect(() => {
      fetchCurrentDetails(selectedSize, selectedColor);
   }, [selectedSize, selectedColor]);

   // Ensure fallback values for productInfo and variantInfo
   const productInfo = [
      {
         label: "ID",
         value: currentItem.itemNumber || "N/A",
      },
      {
         label: "SKU",
         value: currentItem.sku || "N/A",
      },
   ];

   const variantInfo = [
      {
         label: "color",
         value: currentItem.color || "N/A",
      },
      {
         label: "price",
         value: `₹ ${currentItem.price || "N/A"}`,
      },
      {
         label: "size",
         value: currentItem.size || "N/A",
      },
      {
         label: "promo price",
         value: `₹ ${currentItem.price || "N/A"}`,
      },
   ];

   // Avoid rendering if currentItem is undefined
   if (!currentItem.itemNumber) {
      return <Text>Loading...</Text>;
   } else {
      return (
         <>
            {/* Product Detail Card */}
            <View style={styles.cardContainer}>
               <View style={styles.cardLeft}>
                  {/* ID and Supplier */}
                  <View style={styles.cardLeftTop}>
                     <ProductInfoContainer {...productInfo[0]} />
                     <ProductInfoContainer {...productInfo[1]} />
                  </View>

                  {/* Divider */}
                  <Divider width={2} />

                  {/* Variant Info */}
                  <View style={styles.cardLeftBottom}>
                     <View style={styles.variantLeft}>
                        <VariantInfoContainer {...variantInfo[0]} />
                        <VariantInfoContainer {...variantInfo[1]} />
                     </View>
                     <View style={styles.variantRight}>
                        <VariantInfoContainer {...variantInfo[2]} />
                        <VariantInfoContainer {...variantInfo[3]} />
                     </View>
                  </View>
               </View>

               <View style={styles.cardRight}>
                  <View style={styles.qtyContainer}>
                     <Text style={styles.qty}>
                        {currentItem.sellableStock || "N/A"}
                     </Text>
                  </View>

                  <View>
                     <Button
                        title={selectedSize}
                        titleStyle={{
                           fontFamily: "Montserrat-Regular",
                           fontSize: 14,
                           color: "#112d4e",
                           textTransform: "uppercase",
                        }}
                        icon={{
                           name: "chevron-right",
                           type: "material-community",
                           color: "#112d4e",
                           size: 20,
                        }}
                        iconRight={true}
                        buttonStyle={{
                           backgroundColor: "white",
                           borderRadius: 5,
                        }}
                        onPress={() => setSizesOverlay(true)}
                     />
                     <Button
                        title={selectedColor}
                        titleStyle={{
                           fontFamily: "Montserrat-Regular",
                           fontSize: 14,
                           color: "#112d4e",
                           textTransform: "uppercase",
                        }}
                        icon={{
                           name: "chevron-right",
                           type: "material-community",
                           color: "#112d4e",
                           size: 20,
                        }}
                        iconRight={true}
                        buttonStyle={{
                           backgroundColor: "white",
                           borderRadius: 5,
                           marginTop: 10,
                        }}
                        onPress={() => setColorsOverlay(true)}
                     />
                  </View>
               </View>
            </View>

            {/* Sizes Overlay */}
            <SizesOverlay
               selectedSize={selectedSize}
               changeSize={changeSize}
               sizes={sizes}
               sizesOverlay={sizesOverlay}
               setSizesOverlay={setSizesOverlay}
            />

            {/* Colors Overlay */}
            <ColorsOverlay
               selectedColor={selectedColor}
               changeColor={changeColor}
               colors={colors}
               colorsOverlay={colorsOverlay}
               setColorsOverlay={setColorsOverlay}
            />
         </>
      );
   }
}

function SizesOverlay({
   selectedSize,
   changeSize,
   sizes,
   sizesOverlay,
   setSizesOverlay,
}) {
   return (
      <Overlay
         isVisible={sizesOverlay}
         overlayStyle={{ width: "50%" }}
         onBackdropPress={() => setSizesOverlay(false)}
      >
         <FlatList
            data={sizes}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
               <Button
                  disabled={item === selectedSize}
                  title={item}
                  titleStyle={{
                     fontFamily: "Montserrat-Regular",
                     color: "#112d4e",
                  }}
                  buttonStyle={{
                     backgroundColor: "white",
                     borderRadius: 10,
                     marginBottom: 10,
                  }}
                  onPress={() => changeSize(item)}
               />
            )}
            ListHeaderComponent={
               <Text
                  style={{
                     fontFamily: "Montserrat-Bold",
                     fontSize: 18,
                     color: "#112d4e",
                     opacity: 0.8,
                     marginVertical: 20,
                     textAlign: "center",
                  }}
               >
                  Select a Size
               </Text>
            }
            ListFooterComponent={<CloseButton setState={setSizesOverlay} />}
         />
      </Overlay>
   );
}

function ColorsOverlay({
   selectedColor,
   changeColor,
   colors,
   colorsOverlay,
   setColorsOverlay,
}) {
   return (
      <Overlay
         isVisible={colorsOverlay}
         overlayStyle={{ width: "50%" }}
         onBackdropPress={() => setColorsOverlay(false)}
      >
         <FlatList
            data={colors}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
               <Button
                  title={item}
                  disabled={item === selectedColor}
                  titleStyle={{
                     fontFamily: "Montserrat-Regular",
                     color: "#112d4e",
                  }}
                  buttonStyle={{
                     backgroundColor: "white",
                     borderRadius: 10,
                     marginBottom: 10,
                  }}
                  onPress={() => changeColor(item)}
               />
            )}
            ListHeaderComponent={
               <Text
                  style={{
                     fontFamily: "Montserrat-Bold",
                     fontSize: 18,
                     color: "#112d4e",
                     opacity: 0.8,
                     marginVertical: 20,
                     textAlign: "center",
                  }}
               >
                  Select a Color
               </Text>
            }
            ListFooterComponent={<CloseButton setState={setColorsOverlay} />}
         />
      </Overlay>
   );
}

function CloseButton({ setState }) {
   return (
      <Button
         type="clear"
         title="Close"
         titleStyle={{
            fontFamily: "Montserrat-Regular",
            color: "crimson",
         }}
         icon={{
            name: "close",
            type: "material-community",
            color: "crimson",
            size: 20,
         }}
         buttonStyle={{ marginVertical: 20 }}
         onPress={() => setState(false)}
      />
   );
}

const styles = StyleSheet.create({
   page: {
      flex: 0.89,
      backgroundColor: "white",
      alignItems: "center",
      justifyContent: "space-evenly",
   },
   productName: {
      fontFamily: "Montserrat-Medium",
      fontSize: 20,
      color: "#112d4e",
      textTransform: "uppercase",
   },
   imageContainer: {
      width: 280,
      height: 280,
      justifyContent: "center",
      alignItems: "center",
   },
   productImage: {
      width: 250,
      height: 250,
   },
   cardContainer: {
      width: "90%",
      height: "30%",
      backgroundColor: "#112d4e",
      opacity: 0.8,
      borderRadius: 25,
      padding: 20,
      flexDirection: "row",
   },
   cardLeft: {
      flex: 0.65,
      justifyContent: "space-between",
   },
   cardLeftTop: {
      flex: 0.35,
      justifyContent: "space-evenly",
   },
   cardLeftBottom: {
      flex: 0.6,
      flexDirection: "row",
   },
   cardRight: {
      flex: 0.35,
      justifyContent: "space-between",
      alignItems: "flex-end",
   },
   variantLeft: {
      flex: 0.5,
      justifyContent: "space-evenly",
   },
   variantRight: {
      flex: 0.5,
      justifyContent: "space-evenly",
   },
   productInfoLabel: {
      fontFamily: "Montserrat-Regular",
      fontSize: 14,
      color: "white",
      marginRight: 10,
   },
   productInfoValue: {
      fontFamily: "Montserrat-Bold",
      fontSize: 14,
      color: "white",
   },
   variantInfoLabel: {
      fontFamily: "Montserrat-Bold",
      fontSize: 10,
      color: "white",
      opacity: 0.5,
      textTransform: "uppercase",
   },
   variantInfoValue: {
      fontFamily: "Montserrat-Bold",
      fontSize: 16,
      color: "white",
   },
   qty: {
      fontFamily: "Montserrat-Bold",
      fontSize: 18,
      color: "#112d4e",
   },
   qtyContainer: {
      width: 50,
      height: 50,
      backgroundColor: "white",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
   },
});
