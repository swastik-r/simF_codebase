import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { ListItem, Overlay, Icon } from "@rneui/themed";

export default function Dropdown({ staticTitle }) {
   return (
      // <Overlay isVisible={true}>
      //    <ListItem>
      //       <ListItem.Content>
      //          <ListItem.Title>Option 1</ListItem.Title>
      //       </ListItem.Content>
      //    </ListItem>
      //    <ListItem>
      //       <ListItem.Content>
      //          <ListItem.Title>Option 2</ListItem.Title>
      //       </ListItem.Content>
      //    </ListItem>
      //    <ListItem>
      //       <ListItem.Content>
      //          <ListItem.Title>Option 3</ListItem.Title>
      //       </ListItem.Content>
      //    </ListItem>
      // </Overlay>
      <TouchableOpacity style={styles.dropdownButton}>
         <Text style={styles.buttonTitle}>{staticTitle}</Text>
         <Icon name="chevron-down" type="material-community" size={25} />
      </TouchableOpacity>
   );
}

function DropdownListIten() {
   return ListItem;
}

const styles = StyleSheet.create({
   dropdownButton: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "white",
      paddingHorizontal: 7,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: "grey",
   },
   buttonTitle: {
      marginRight: 5,
      fontFamily: "Montserrat-Bold",
      fontSize: 13,
      color: "#00338D",
      paddingLeft: 10,
   },
});
