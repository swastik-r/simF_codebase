import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { Text, View, TouchableOpacity } from "react-native";

export default function SortModal({ visible, setVisible }) {
   return (
      <Modal
         isVisible={visible}
         onBackdropPress={() => setVisible(false)}
         onBackButtonPress={() => setVisible(false)}
         backdropOpacity={0.5}
         backdropColor="#000000"
         animationIn="fadeIn"
         animationOut="fadeOut"
         animationInTiming={300}
         animationOutTiming={300}
         backdropTransitionInTiming={300}
         backdropTransitionOutTiming={300}
         style={styles.modalContainer}
      >
         <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>
            <TouchableOpacity style={styles.sortOption}>
               <Text style={styles.sortOptionText}>ID</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortOption}>
               <Text style={styles.sortOptionText}>Item Name</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortOption}>
               <Text style={styles.sortOptionText}>Quantity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sortOption}>
               <Text style={styles.sortOptionText}>Reason</Text>
            </TouchableOpacity>
         </View>
      </Modal>
   );
}

const styles = StyleSheet.create({
   modalContainer: {
      margin: 0,
      justifyContent: "flex-end",
   },
   modalContent: {
      backgroundColor: "white",
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
   },
   modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 20,
   },
   sortOption: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#E0E0E0",
   },
   sortOptionText: {
      fontSize: 16,
   },
});
