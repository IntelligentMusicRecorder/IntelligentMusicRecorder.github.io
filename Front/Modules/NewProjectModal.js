import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';



const NewProjectModal = ({ visible, onClose, onSubmit }) => {
  const [newProjectName, setNewProjectName] = useState("");
  
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });
  
  if (!fontsLoaded) {
    return null;
  }
  const helperSubmit = () => {
    if(newProjectName.length==0){
      alert("Enter a project name")
    }
    if (!newProjectName.trim()) {
      onClose();
    } else {
      onSubmit(newProjectName);
      setNewProjectName("");
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <Text style={{ color: "rgba(70, 14, 112, 1.0)", fontFamily:"Poppins_400Regular", fontSize:20 }}>Create New Project</Text>
          <TextInput
            value={newProjectName}
            onChangeText={(text) => setNewProjectName(text)}
            style={styles.input}
          />
          <MaterialIcons
            name="forward"
            size={24}
            color="rgba(70, 14, 112, 1.0)"
            style={{ ...styles.icon }}
            onPress={helperSubmit}
          />
        </View>
      </View>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[StyleSheet.absoluteFillObject, styles.modalBG]} />
      </TouchableWithoutFeedback>
    </Modal>
  );
};
const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: width - 20,
    height: 200,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: width - 40,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    fontSize: 18,
    paddingVertical: 5,
    fontFamily:"Poppins_400Regular"
  },
  icon: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    marginTop: 15,
  },
  modalBG: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: -1,
  },
});
/*
APP_BG: '#fff',
FONT: '#303d49',
FONT_MEDIUM: '#636363',
FONT_LIGHT: '#b6b8b9',
MODAL_BG: 'rgba(0, 0, 0, 0.2)',
ACTIVE_BG: '#5252ad',
ACTIVE_FONT: '#fff',
*/
export default NewProjectModal;
