import * as React from "react";
import localImage from "./images/bg1.jpeg";
import { useState, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DataModule from "../Modules/DataModule.js";
import Slider from "@react-native-community/slider";
import { pause, play, resume } from "../Modules/PlayerFunctions";
import AudioListPage2 from "./AudioListPage2";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogBox } from 'react-native';
import LottieView from 'lottie-react-native'
import { useFonts, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state.',
]);
const { width } = Dimensions.get("window");

export default function RecordingPage({ route, navigation }) {
  const { projectName, projectId } = route.params;
  const localImage = require("./images/bg1.jpeg");
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [playing, setPlaying] = useState();
  const [message, setMessage] = useState("");
  const [sound, setSound] = useState();
  const [data, setData] = useState([{}]);
  const [isLoading,setLoading] = useState(false);
  const [isDataLoaded,setDataLoaded] = useState(false);
  const [hasRecording,setHasRecording] = useState();
  const [isRecording, setIsRecording] = useState();
  const [recordingDuration, setRecordingDuration] = useState();
  const [indexVal,setIndex] = useState();
  const num = 2;

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
  });
  // if (!fontsLoaded) {
  //   return null;
  // }


  useEffect(() => {
    if (projectId != 9999) {
      loadAudioFilesArray();
    }
  }, []);
  /*
  async function onPressHandler() {
    api_from_python().then(
      navigation.navigate("AudioList2", {
        recordings: recordings,
        recordingName: projectName,
        selectedProject: index,
        data: data,
      })
    );
  }
  async function function2() {
    console.log("function2 works");
  }
  */
  function api_from_python() {
    console.log("in the api from python function")
    var formData = new FormData();
    for(let i=0;i<recordings.length;i++){
      let uri = recordings[i].file;
      let filetype = uri.split(".").pop();
      let filename = uri.split("/").pop();

      formData.append(i,
      {
        uri,
        type: `audio/${filetype}`,
        name: filename,
      }
      );
    }
    //192.168.1.54
   // axios( {
    fetch("http://172.20.151.17:5000/uri-example", {
      //url: "http://192.168.1.101:5000/uri-example",
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      //body: JSON.stringify({ recordings: recordings }),
    })
      .then((res) => res.json()) //[Unhandled promise rejection: SyntaxError: JSON Parse error: Unrecognized token '<'] errorü için değiştirdim
      .then((res) => {
        console.log("api dan gelen array: ",res)
       setData(res)
      })

  }

  const update = (res) => setData(res)
  async function loadAudioFilesArray() {
    const jsonval = await AsyncStorage.getItem(projectName);
    const parsedjsonval = JSON.parse(jsonval);

    let updatedRecordings2 = [...recordings];
    for (var i = 0; i < parsedjsonval.length; i++) {
      const { sound } = await Audio.Sound.createAsync({
        uri: parsedjsonval[i].file,
      });
      setSound(sound);
      
      updatedRecordings2.push({
        sound: sound,
        duration: parsedjsonval[i].duration,
        file: parsedjsonval[i].file,
      });
    }
    setRecordings(updatedRecordings2);
  }
  async function startPlayback(recordingLineParam) {
    api_from_python();
    let status = (await recordingLineParam.sound.getStatusAsync())
    if (status["positionMillis"] >= status["durationMillis"]){
      await recordingLineParam.sound.replayAsync();
    }else{
      await recordingLineParam.sound.playAsync();
    }

  }

  async function pausePlayback(recordingLineParam) {
    await recordingLineParam.sound.pauseAsync();
  }
  function onRecordingStatusUpdate(status){
    setRecordingDuration(getDurationFormatted(status.durationMillis))
    //console.log(getDurationFormatted(status.durationMillis))
  }

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status == "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording,status } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY, 
          onRecordingStatusUpdate
        );
        setIsRecording(true)
        setRecording(recording);
      } else {
        setMessage("Please give permission to app to access microphone");
      }
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setIsRecording(false)
    setRecording(undefined);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    await recording.stopAndUnloadAsync();

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    updatedRecordings.push({
      sound: sound,
      status: status,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    });
    
    if(status.durationMillis < 5000){
      alert("Each recording should be longer than 5 seconds")
    }else{
      setRecordings(updatedRecordings);
      setHasRecording(true)
    }
    
    var str = JSON.stringify(updatedRecordings);
    //await storeAudios(str);
    await DataModule.storeAudioFilesArray(projectName, str);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }
  

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
      
        <View key={index} style={styles.row}>
          <TouchableOpacity
            style={styles.touchableContainer}
            //onPressIn={forceUpdate}
            // onPressIn={api_from_python}
            onPress={() => {
              api_from_python();
              //setLoading(false);
            }
          }
        
          >
            <Text style={styles.replayText}>
              Recording {index + 1} - {recordingLine.duration}
            </Text>
            <TouchableOpacity
              onPress={() =>  startPlayback(recordingLine)}>
                <Text style={styles.button}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pausePlayback(recordingLine)}>
                <Text style={styles.button}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity>
                <MaterialIcons
                  name="forward"
                  size={35}
                  color="rgba(70, 14, 112, 1.0)"
                  style={styles.button}
                  onPress={()=>{
                    console.log("data is: ", data, "the length: ", data.length)
                    if(data.length<=1){
                      alert("Please select a recording")
                    }else{
                      navigation.navigate("AudioList2", {
                        recordings: recordings,
                        recordingName: projectName,
                        selectedProject: index,
                        data:  data,
                      })
                    }
                  }
                    
                  }
                />
              </TouchableOpacity>

            {/* <Button
              style={styles.button}
              onPress={() => Sharing.shareAsync(recordingLine.file)}
              title="Save/Share"
            ></Button> */}
          </TouchableOpacity>
        </View>

     

      );
    });
  }

  return (
    (isLoading ?  
      <ImageBackground
      source={localImage}
      resizeMode="cover"
      style={styles.imageBackground}>

      <LottieView
        source={require('./images/loader_white.json')}
        autoPlay loop
      />

    
    </ImageBackground>
       : 
       <ImageBackground
       source={localImage}
       resizeMode="cover"
       style={styles.imageBackground}>
      <View style={styles.titleContainer}>
        <Text style={styles.text}>Recorder</Text>
      </View>

      <SafeAreaView styles={styles.container}>
        <ScrollView automaticallyAdjustContentInsets="true">
          {/* <Button title="API Debug" onPress={api_from_python} /> */}
          {/* <Button title="Load Debug" onPress={ loadAudioFilesArray} /> */}

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={recording ? stopRecording : startRecording}
          >
            <Ionicons
              size={80}
              color="#e2dee3"
              align="center"
              name={recording ? "stop-circle-outline" : "play-circle-outline"}
            />
          </TouchableOpacity>

          <View style={isRecording ? styles.textContainer: styles.invisible}>
            <Text style={styles.smallerText}>{recordingDuration}</Text>
          </View>

          <View style={hasRecording ? styles.textContainer: styles.invisible}>
            <Text style={styles.smallerText}>Select Recording To Edit</Text>
          </View>
      
          {getRecordingLines()}
        </ScrollView>
      </SafeAreaView> 
      </ImageBackground>)

  );
}

const styles = StyleSheet.create({
  iconStyles: {
    alignSelf: "center",
    size: 24,
    color: "ff00ff",
  },

  text: {
    fontFamily: 'Poppins_400Regular',
    padding: 10,
    textAlign: "center",
    fontSize: 36,
    color: "#dfc6f7",
    fontWeight: "bold",
  },
  smallerText: {
    fontFamily: 'Poppins_400Regular',
    padding: 10,
    textAlign: "center",
    fontSize: 20,
    color: "#dfc6f7",
    fontWeight: "bold",
  },
  textContainer: {
    margin:5
  },

  replayText: {
    fontFamily: 'Poppins_400Regular',
    textAlign: "center",
    fontSize: 20,
    color: "#dfc6f7",
  },
  touchableContainer: {
    backgroundColor: "rgba(46, 49, 49, 0.3)",
    alignItems: "center",
    width: "65%",
    borderRadius: 25,
    alignSelf: "center",
    padding: 10,
    margin: 20,
  },

  titleContainer: {
    //backgroundColor: "rgba(46, 49, 49, 0.3)",
    margin: 10
  },
  imageBackground: {
    height: "100%",
    width: "100%",
  },
  row: {
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    marginTop: 10,
    fontFamily:"Poppins_400Regular", 
    color:"#e2dee3",
    fontSize:18
    
  },
  container: {
    flex: 1,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  loader:{
    justifyContent:"center",
    alignItems:"center",
    zIndex:1
  },
  invisible: {
    //backgroundColor: "rgba(46, 49, 49, 0.3)",
    backgroundColor: "white",
    opacity: 0.0,
    alignItems: "center",
    width: "45%",
    borderRadius: 25,
    margin: 5
  },
  
});
