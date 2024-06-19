import { FlatList } from "react-native";
import { Overlay, Button } from "@rneui/themed";
import { useAdjustmentDetail } from "../../../../context/DataContext";

export default function ReasonCodeOverlay({
   route,
   showReasonCodes,
   setShowReasonCodes,
}) {
   const { parentId } = route.params;
   const { itemInfo, reasonMap, setDefaultReasonCode } = useAdjustmentDetail();
   const reasonCodes = itemInfo.reasons;

   function reasonString(reason) {
      return reasonMap[reason];
   }

   return (
      <Overlay
         isVisible={showReasonCodes}
         onBackdropPress={() => setShowReasonCodes(false)}
         overlayStyle={{
            width: "60%",
         }}
      >
         <FlatList
            data={reasonCodes}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
               <Button
                  title={reasonString(item)}
                  titleStyle={{
                     fontFamily: "Montserrat-Bold",
                     color: "#112d4e",
                  }}
                  buttonStyle={{
                     margin: 15,
                     paddingBottom: 1,
                     borderBottomWidth: 0.5,
                     backgroundColor: "white",
                  }}
                  containerStyle={{
                     alignItems: "center",
                  }}
                  onPress={() => {
                     setDefaultReasonCode(parentId, item);
                     setShowReasonCodes(false);
                  }}
               />
            )}
         />
         <Button
            type="clear"
            title={"CLOSE"}
            titleStyle={{ fontFamily: "Montserrat-Regular", color: "maroon" }}
            icon={{ name: "close", color: "maroon", size: 22 }}
            buttonStyle={{
               margin: 15,
            }}
            onPress={() => {
               setShowReasonCodes(false);
            }}
         />
      </Overlay>
   );
}
