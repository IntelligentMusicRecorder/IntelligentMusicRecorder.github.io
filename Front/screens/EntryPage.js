import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Modal,
  Button,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import NewProjectModal from "../Modules/NewProjectModal.js";
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { LogBox } from 'react-native';
LogBox.ignoreAllLogs();
const Item = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <Text style={styles.text}>{item}</Text>
  </TouchableOpacity>
);

export default function EntryPage({ navigation }) {
  const localImage = require("./images/bg1.jpeg");
  const [selectedKey, setSelectedKey] = useState();
  const [allKeys, setAllKeys] = useState({ _z: ["a", "b"] });

  const [modalOpen, setModalOpen] = useState(false);
  const [recordsModalOpen, setRecordsModalOpen] = useState(false);
  const [newProjectModalOpen, setnewProjectModalOpen] = useState(false);
  //const [newProjectName, setNewProjectName] = useState();
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }
  async function getAllItems() {
    const keys = await AsyncStorage.getAllKeys();
    return keys;
  }

  const helperNameProject = async (newProjectName) => {
    //console.log("newProjectName", newProjectName);

    const result = await AsyncStorage.getItem(newProjectName);
    if (result == null) {
      navigation.navigate("Recording", {
        projectName: newProjectName,
        projectId: 9999,
      });
    } else {
      setnewProjectModalOpen(false);
    }

    /*
    if (!newProjectName.trim()) {
      onClose();
    } else {
      navigation.navigate("Recording", {
        projectName: newProjectName,
        projectId: 9999,
      });
    }
    */
  };

  const combinedOnPress = ({ item }) => {
    setSelectedKey(item);
    setTimeout(() => {
      navigation.navigate("Recording", {
        projectName: selectedKey,
        projectId: 86,
      });
    }, 1000);
  };

  const renderItem = ({ item }) => {
    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedKey(item);
        }}
      />
    );
  };

  const combinedSaved = async () => {
    setRecordsModalOpen(true);
    setAllKeys(await AsyncStorage.getAllKeys());
    // allKeys.or
    //AsyncStorage.clear();
    // console.log(allKeys);
  };

  return (
    <ImageBackground
      source={localImage}
      resizeMode="cover"
      style={styles.imageBackground}
    >
      <View style={styles.titlecontainer}>
        <Text style={styles.titletext}>Music Recorder</Text>
      </View>

      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={() => setnewProjectModalOpen(true)}
        /*
        onPress={() =>
          navigation.navigate("Recording", {
            projectName: "Project4",
            projectId: 9999,
          })
        }
        */
      >
        <Text style={styles.text}>New Project</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchableContainer}
        onPress={() => combinedSaved()}
      >
        <Text style={styles.text}>Saved Projects</Text>
      </TouchableOpacity>

      <Modal visible={modalOpen} animationType="slide" transparent={true}>
        <View style={styles.modalContent}>
          <MaterialIcons
            name="close"
            size={24}
            color="#e2dee3"
            style={{ ...styles.modal, ...styles.modalClose }}
            onPress={() => setModalOpen(false)}
          />
          <Text style={styles.modalText}>
            For recording a new project press 'New Project'
          </Text>
          <Text style={styles.modalText}>
            You can access your saved recordings by pressing 'Saved Project'
          </Text>
        </View>
      </Modal>

      
      <NewProjectModal
        visible={newProjectModalOpen}
        onClose={() => setnewProjectModalOpen(false)}
        onSubmit={helperNameProject}

        /*
        onSubmit={(newProjectName) => {
          console.log(newProjectName);
        }}
        */
        /*
        onSubmit={(newProjectName) => {
          setNewProjectName(newProjectName);
        }}
        */
      />

      <Modal visible={recordsModalOpen} animationType="fade" transparent={true}>
        <SafeAreaView style={styles.modalContent}>
          <MaterialIcons
            name="close"
            size={24}
            color="#e2dee3"
            style={{ ...styles.modal, ...styles.modalClose }}
            onPress={() => setRecordsModalOpen(false)}
          />
          <MaterialIcons
            name="forward"
            size={24}
            color="#e2dee3"
            style={{ ...styles.modal, ...styles.modalClose }}
            onPress={() => {
              navigation.navigate("Recording", {
                projectName: selectedKey,
                projectId: 10,
              });
              setRecordsModalOpen(false);
            }}
          />
          <FlatList
            data={allKeys}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            extraData={selectedKey}
          ></FlatList>
        </SafeAreaView>
      </Modal>

      <MaterialIcons
        name="help-outline"
        size={24}
        color="#e2dee3"
        style={styles.modal}
        onPress={() => setModalOpen(true)}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    width: "75%",
    borderRadius: 25,
    backgroundColor:"#e2dee3",
  },
  titlecontainer: {
    //backgroundColor: "rgba(46, 49, 49, 0.3)",
    width: "65%",
    alignSelf: "center",
    borderRadius: 25,
    marginTop: 50,
    // marginLeft: 25,
    // marginRight: 25,
    marginBottom: 50,
    // paddingTop: 20,
    // paddingBottom: 20,
  },
  container: {
    borderRadius: 25,
    marginTop: 20,
    marginLeft: 25,
    marginRight: 25,
    paddingVertical: 20,
  },
  text: {
    fontFamily: 'Poppins_400Regular',
    padding: 10,
    textAlign: "center",
    fontSize: 24,
    color: "#e2dee3",
  },
  titletext: {
    fontFamily: 'Poppins_400Regular',
    padding: 10,
    textAlign: "center",
    fontSize: 42,
    fontWeight: "bold",
    color: "#dfc6f7",
  },
  modal: {
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "rgba(46, 49, 49, 0.8)",
    marginTop: 170,
    borderRadius: 25,
    alignSelf: "center",
  },
  modalClose: {
    marginTop: 25,
    marginBottom: 0,
  },
  modalContent: {
    flex: 1,
    padding: 30,
    backgroundColor: "rgba(0,0,0,0.95)",
    alignSelf: "center",
    width: "98%",
    height: "80%",
    
  },
  modalText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 20,
    padding: 30,
    color: "#e2dee3",
  },
  touchableContainer: {
    backgroundColor: "rgba(128, 0, 128, 0.3)",
    width: "50%",
    alignSelf: "center",
    borderRadius: 25,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    paddingVertical: 20,
  },
  imageBackground: {
    height: "100%",
    width: "100%",
  },
});