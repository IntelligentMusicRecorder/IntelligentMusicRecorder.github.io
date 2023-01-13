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
} from "react-native";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";

const { width } = Dimensions.get("window");

export default function AudioListPage({ route, navigation }) {
  const { recordings } = route.params;
  const [playbackObject, setplaybackObject] = useState();
  const [soundObject, setsoundObject] = useState();
  const [isPlaying, setisPlaying] = useState();

  //does not work properly !!!
  async function startPlayback(recordingLineParam) {
    //console.log("the recordingLineParam is : ", recordingLineParam);
  }
  async function handleAudioPress(audio) {
    //console.log("#####\n soundObject: ", soundObject);

    //load and play audio first time
    //if (soundObject === null) {
    const playbackObj = new Audio.Sound();
    const status = await playbackObj.loadAsync(
      { uri: audio.file },
      { shouldPlay: true }
    );
    setplaybackObject(playbackObj);
    setsoundObject(status);
    console.log("#####\n status: ", status);

    // }

    //pause audio
    /*
    else if (soundObject.isLoaded && soundObject.isPlaying) {
      console.log("#####\n playing");
    }
    */
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.replayText}>
            Recording {index + 1} - {recordingLine.duration}
          </Text>
          <Button
            style={styles.button}
            //onPress={() => recordingLine.sound.replayAsync()}
            onPress={() => handleAudioPress(recordingLine)}
            title="Play"
          ></Button>

          <Button
            style={styles.button}
            onPress={() => Sharing.shareAsync(recordingLine.file)}
            title="Save/Share"
          ></Button>
        </View>
      );
    });
  }

  return (
    <ImageBackground
      source={localImage}
      resizeMode="cover"
      style={styles.imageBackground}
    >
      {getRecordingLines()}

      <Slider
        style={{ width: 0.9 * width, height: 40, alignSelf: "center" }}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#ffffff"
        maximumTractTintColor="#000000"
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  iconStyles: {
    alignSelf: "center",
    size: 24,
    color: "ff00ff",
  },

  text: {
    padding: 10,
    textAlign: "center",
    fontSize: 24,
    color: "white",
  },

  replayText: {
    textAlign: "center",
    fontSize: 16,
    color: "white",
  },
  touchableContainer: {
    backgroundColor: "rgba(46, 49, 49, 0.3)",
    alignItems: "center",
    width: "24%",
    borderRadius: 25,
    alignSelf: "center",
    padding: 10,
    margin: 20,
  },

  titleContainer: {
    backgroundColor: "rgba(46, 49, 49, 0.3)",
    width: "65%",
    alignSelf: "center",
    borderRadius: 10,
    marginTop: 100,
    marginLeft: 25,
    marginRight: 25,
    marginBottom: 250,
    paddingTop: 10,
    paddingBottom: 10,
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
    margin: 16,
  },
});
