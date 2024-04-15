import { FlatList } from "react-native";
import { Overlay, ListItem } from "@rneui/themed";
import { useAdjustmentDetail } from "../../../context/DataContext";

export default function ReasonCodeOverlay({
   route,
   type,
   showReasonCodes,
   setShowReasonCodes,
}) {
   const { parentId, childId } = route.params;
   const { itemInfo, reasonMap, setDefaultReasonCode, setItemReasonCode } =
      useAdjustmentDetail();
   const reasonCodes = itemInfo.reasons;

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
      </Overlay>
   );
}
