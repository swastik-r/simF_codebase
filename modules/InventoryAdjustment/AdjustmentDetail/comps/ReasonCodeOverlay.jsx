import { View, FlatList } from "react-native";
import { Overlay, ListItem, Button } from "@rneui/themed";
import { useAdjustmentDetail } from "../../../../context/DataContext";
import { useNavigation } from "@react-navigation/native";

export default function ReasonCodeOverlay({
   route,
   type,
   showReasonCodes,
   setShowReasonCodes,
   setShowSellable,
}) {
   const { parentId, childId } = route.params;
   const { itemInfo, reasonMap, setDefaultReasonCode, setItemReasonCode } =
      useAdjustmentDetail();
   const navigation = useNavigation();

   // if type="adjustment", remove "sellable" from the reason codes
   const reasonCodes =
      type === "adjustment"
         ? itemInfo.reasons.filter((reason) => reason !== "sellable")
         : itemInfo.reasons;

   function reasonString(reason) {
      return reasonMap[reason];
   }

   return (
      <Overlay
         isVisible={showReasonCodes}
         onBackdropPress={() => setShowReasonCodes(false)}
         overlayStyle={{
            width: "50%",
         }}
      >
         <FlatList
            data={reasonCodes}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
               <ListItem
                  onPress={() => {
                     type === "adjustment"
                        ? setDefaultReasonCode(item, parentId)
                        : item === "sellable"
                        ? setShowSellable(true)
                        : setItemReasonCode(item, parentId, childId);
                     setShowReasonCodes(false);
                  }}
               >
                  <ListItem.Content
                     style={{
                        alignItems: "center",
                     }}
                  >
                     <ListItem.Title style={{ fontFamily: "Montserrat-Bold" }}>
                        {reasonString(item)}
                     </ListItem.Title>
                  </ListItem.Content>
               </ListItem>
            )}
         />
         <View style={{ flexDirection: "row" }}>
            <Button
               title="Cancel"
               titleStyle={{ fontFamily: "Montserrat-Bold", color: "darkred" }}
               buttonStyle={{
                  margin: 10,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "darkred",
                  backgroundColor: "white",
               }}
               onPress={() => {
                  setShowReasonCodes(false), navigation.goBack();
               }}
            />
            <Button
               title="Skip"
               titleStyle={{ fontFamily: "Montserrat-Bold", color: "grey" }}
               buttonStyle={{
                  margin: 10,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "silver",
                  backgroundColor: "white",
               }}
               onPress={() => setShowReasonCodes(false)}
            />
         </View>
      </Overlay>
   );
}
