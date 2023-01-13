import React, { Component } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Modal,
  ImageBackground,
} from "react-native";
import { Audio } from "expo-av";
import Slider from "@react-native-community/slider";
import localImage from "./images/bg1.jpeg";
import { Ionicons } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import { MaterialIcons } from "@expo/vector-icons";
const LOOPING_TYPE_ALL = 0;
const LOOPING_TYPE_ONE = 1;
const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get("window");
const BACKGROUND_COLOR = "#FFF8ED";
const DISABLED_OPACITY = 0.5;
const FONT_SIZE = 14;
const LOADING_STRING = "... loading ...";
const BUFFERING_STRING = "...buffering...";
import { useFonts } from 'expo-font';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state. Check:',
]);

export default class AudioListPage2 extends React.Component {
  constructor(props) {
    super(props);
    this.index = 0;
    this.editToAPI = 77;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.playbackInstance = null;
    this.similarBox = null;
    this.window = 5000;
    this.data = null;
    this.resultRecordingURI = null;
    this.state = {
      autoURI: null,
      playbackInstanceName: LOADING_STRING,
      loopingType: LOOPING_TYPE_ALL,
      muted: false,
      playbackInstancePosition: null,
      suggestionInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isPaused: false,
      isBuffering: false,
      isLoading: true,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      audioRecordings: null,
      audioData: null,
      editData: "",
      suggestionInit: 0,
      suggestionInstance: null,
      suggestionPlaying: false,
      selectedSuggestions: [],
      resultRecording: null,
      resultPlaying: null,
      modalOpen: false,
    };
  }

  api_from_python2 = () => {
    var formData = new FormData();
    for(let i=0;i<this.state.audioRecordings.length;i++){
      let uri = this.state.audioRecordings[i].file;
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
    formData.append("editToAPI",JSON.stringify(this.state.selectedSuggestions) )

    fetch("http://172.20.151.17:5000/index-example", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: formData
    })
      .then((res) => res.json())
      .then((data2) => {
        this.setState({ editData: data2 }, () => {
          console.log("******* \n this", this.state.selectedSuggestions);
          //console.log("******* \n this.editData :", this.state.editData);
          console.log("******* \n this.editData :", this.state.editData.data);
        });
      });
  };

  api_auto = () => {
    var formData = new FormData();
    for(let i=0;i<this.state.audioRecordings.length;i++){
      let uri = this.state.audioRecordings[i].file;
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
    formData.append("editToAPI",JSON.stringify(this.state.selectedSuggestions) )
    fetch("http://172.20.151.17:5000/auto-example", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: formData
    })
      .then((res) => res.json())
      .then((data2) => {
        this.setState({ autoURI: data2 }, () => {
          //console.log("******* \n this", this.state.selectedSuggestions);
          console.log("******* \n this.autoURI :", this.state.autoURI.data);
        });
      });
  };

  componentDidMount() {

    const recordings = this.props.route.params;
   
    this.index = recordings.selectedProject;
    this.data = recordings.data;
    //console.log("this.daydjıefjeowı",recordings.data )
    (async () => {
      // await Font.loadAsync({
      //   ...MaterialIcons.font,k
      //   "cutive-mono-regular": require("../assets/fonts/CutiveMono-Regular.ttf"),
      // });
      this.setState({ fontLoaded: true });
      console.log("input array in mount? ", recordings.data )
      await this.setState({ audioRecordings: recordings.recordings, audioData: recordings.data });


    })();
    this.setState({ audioRecordings: recordings.recordings, audioData: recordings.data });
    console.log("input array in mount? not in aysnc", recordings.data )

    //this.setState({ audioRecordings: recordings.recordings, audioData: recordings.data });
    //await this.setState({ audioRecordings: recordings.recordings, audioData: recordings.data });
    // this.setState({ audioData: recordings.data }, () => {
    //   //console.log("******* \n this.state.audioData :", this.state.audioData);
    // });
  }

  // componentWillUnmount = () => {
  //   this.setState({ audioRecordings: null, audioData: null }, () => {
  //     //console.log("1*******\n audioRecordings:", this.state.audioRecordings);
  //   });
  // }
  async _loadNewPlaybackInstance(playing) {
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();
      // this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }
    // const source2 = {
    //   uri: this.state.audioRecordings[this.index+1].file,
    // };
    // const initialStatus2 = {
    //   shouldPlay: playing,
    //   volume: this.state.volume,
    //   isMuted: this.state.muted,
    //   isLooping: this.state.loopingType === LOOPING_TYPE_ONE,
    //   // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
    //   // androidImplementation: 'MediaPlayer',
    // };
    // const {sound2, status2} =  Audio.Sound.createAsync(
    //   source2, initialStatus2,this._onPlaybackStatusUpdate
    // )
    // this.suggestionInstance = sound2

    const source = {
      uri: this.state.audioRecordings[this.index].file,
    };
    const initialStatus = {
      shouldPlay: playing,
      volume: this.state.volume,
      isMuted: this.state.muted,
      isLooping: this.state.loopingType === LOOPING_TYPE_ONE,
      // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
      // androidImplementation: 'MediaPlayer',
    };

    const { sound, status } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate
    );
    this.playbackInstance = sound;

    this._updateScreenForLoading(false);
  }

  _mountAudio = (component) => {
    this._loadNewPlaybackInstance(false);
  };

  _updateScreenForLoading(isLoading) {
    const recordings = this.props.route.params;

    if (isLoading) {
      this.setState({
        isPlaying: false,
        playbackInstanceName: LOADING_STRING,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true,
      });
    } else {
      this.setState({
        playbackInstanceName: recordings.recordingName,
        isLoading: false,
      });
    }
  }

  _onPlaybackStatusUpdate =  (status) => {
    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isBuffering: status.isBuffering,
        muted: status.isMuted,
        volume: status.volume,
        loopingType: status.isLooping ? LOOPING_TYPE_ONE : LOOPING_TYPE_ALL,
      });
      if (status.didJustFinish && !status.isLooping) {
        this.playbackInstance.stopAsync();
      }
    } else {
      if (status.error) {
        console.log(`FATAL PLAYER ERROR: ${status.error}`);
      }
    }
  };

  _onLoadStart = () => {
    console.log(`ON LOAD START`);
  };

  _onLoad = (status) => {
    console.log(`ON LOAD : ${JSON.stringify(status)}`);
  };

  _onError = (error) => {
    console.log(`ON ERROR : ${error}`);
  };

  async _updatePlaybackInstanceForIndex(playing) {
    this._loadNewPlaybackInstance(playing);
  }

  _onPlayPausePressed = () => {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        console.log("paused at: ", this.state.playbackInstancePosition);
        this.playbackInstance.pauseAsync();
        this.setState({
          isPaused: true,
        });
      } else {
        if(this.state.suggestionInstance!=null){
          this.state.suggestionInstance.stopAsync();
          this.setState({suggestionPlaying:false})
        }

        this.playbackInstance.playAsync();
        this.setState({
          isPaused: false,
        });
      }
    }
  };

  _onStopPressed = () => {
    if (this.playbackInstance != null) {
      this.playbackInstance.stopAsync();
    }
  };

  _onMutePressed = () => {
    if (this.playbackInstance != null) {
      this.playbackInstance.setIsMutedAsync(!this.state.muted);
    }
  };

  // _onLoopPressed = () => {
  //   if (this.playbackInstance != null) {
  //     this.playbackInstance.setIsLoopingAsync(
  //       this.state.loopingType !== LOOPING_TYPE_ONE
  //     );
  //   }
  // };

  _onVolumeSliderValueChange = (value) => {
    if (this.playbackInstance != null) {
      this.playbackInstance.setVolumeAsync(value);
    }
  };

  _onSeekSliderValueChange = (value) => {
    if (this.playbackInstance != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.playbackInstance.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async (value) => {
    if (this.playbackInstance != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.playbackInstanceDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.playbackInstance.playFromPositionAsync(seekPosition);
      } else {
        this.playbackInstance.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return (
        this.state.playbackInstancePosition /
        this.state.playbackInstanceDuration
      );
    }
    return 0;
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number) => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  }

  _getTimestamp() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.playbackInstancePosition
      )} / ${this._getMMSSFromMillis(this.state.playbackInstanceDuration)}`;
    }
    return "";
  }

  _suggestionUpdate = async (status) => {
    console.log("position: ", status.positionMillis);
    if (status.positionMillis >= this.state.suggestionInit + this.window || status.positionMillis >= status.durationMillis) {
      this.state.suggestionInstance.stopAsync();
      this.state.suggestionInstance.unloadAsync();
      this.setState({ suggestionPlaying: false });
      //await this.suggestionInstance.setStatusAsync({shouldPlay:false})
    }
    return status.positionMillis;
  };
  _haveSuggestion = async (index) => {
 
    var inputArray = this.state.audioData.data;

    console.log("######## \n inputArray: ", inputArray);

    var stoppedAt = this.state.playbackInstancePosition;
    var stoppedIndex = Math.floor(stoppedAt / this.window);

    var similarBoxArray = inputArray[stoppedIndex];
    let similarBox = similarBoxArray[index];
    console.log("######## \n similarBoxArray: ", similarBoxArray[index]);

    let similarBoxRecordingIndex = similarBox[0][0];
    let similarBoxIndex = similarBox[0][1];
    console.log("similar box index: ", similarBoxIndex * this.window);
    console.log("######## \n similarBoxIndex: ", similarBoxIndex);
    console.log(
      "######## \n similarBoxRecordingIndex: ",
      similarBoxRecordingIndex
    );

    if (this.state.suggestionPlaying == false ) {
      const source2 = {
        uri: this.state.audioRecordings[similarBoxRecordingIndex].file,
      };
      await this.setState({ suggestionInit: this.window * similarBoxIndex });
      console.log("init:", this.state.suggestionInit);
      const initialStatus2 = {
        shouldPlay: true,
        volume: this.state.volume,
        isMuted: this.state.muted,
        isLooping: this.state.loopingType === LOOPING_TYPE_ONE,
        positionMillis: this.state.suggestionInit,
        // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
        // androidImplementation: 'MediaPlayer',
      };

      const sound2 = await Audio.Sound.createAsync(
        source2,
        initialStatus2,
        this._suggestionUpdate
      );
      this.state.suggestionInstance = sound2["sound"];
      //this.state.suggestionInstance.loadAsync();
      await this.setState({ suggestionPlaying: true });
      // suggestionInstance.playAsync()
      // await new Promise(resolve => setTimeout(resolve, 500));
      // suggestionInstance.pauseAsync()
      // suggestionInstance.unloadAsync()

      //this.playbackInstance.loadAsync()
      this.playbackInstance.setPositionAsync(stoppedAt);
    }
  };
  _pickSuggestion = async (index) => {
    var inputArray = this.state.audioData.data;
    var stoppedAt = this.state.playbackInstancePosition;
    var stoppedIndex = Math.floor(stoppedAt / this.window);
    var similarBoxArray = inputArray[stoppedIndex];
    let similarBox = similarBoxArray[index];

    let similarBoxRecordingIndex = similarBox[0][0];
    let similarBoxIndex = similarBox[0][1];

    let toBeSwapped = [
      [this.index, stoppedIndex],
      [similarBoxRecordingIndex, similarBoxIndex],
    ];

    let updatedSuggestions = [...this.state.selectedSuggestions];
    updatedSuggestions.push(toBeSwapped);
    // console.log("hufhru:",updatedSuggestions)
    await this.setState({ selectedSuggestions: updatedSuggestions });
    console.log("selected sug", this.state.selectedSuggestions);
    //data:this.state.selectedSuggestions
  };

  _resultUpdate = async (status) => {
    //console.log("position: ", status.positionMillis);
    if (status.positionMillis >= status.durationMillis) {
      this.setState({ resultPlaying: false });
    }
    return status.positionMillis;
  };

  _createResultSound = async () => {
  
    this.api_from_python2()
    const source2 = {
      uri: this.state.editData.data,
    };

    const initialStatus2 = {
      shouldPlay: true,
      volume: this.state.volume,
      isMuted: this.state.muted,
      isLooping: false,
      // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
      // androidImplementation: 'MediaPlayer',
    };

    const sound2 = await Audio.Sound.createAsync(source2, initialStatus2, this._resultUpdate);
    this.setState({resultPlaying:true})
    //await sound2.pauseAsync()
    console.log("sound", sound2["sound"]);
    await this.setState({ resultRecording: sound2["sound"] });
  };

  _playResult = async () => {
    if(this.state.resultPlaying==false){
      this.setState({resultPlaying:true})
      let resultStatus = await this.state.resultRecording.getStatusAsync();
      
      if(resultStatus["positionMillis"] >= resultStatus["durationMillis"]){
        await this.state.resultRecording.replayAsync();
      }else{
        await this.state.resultRecording.playAsync();
      }
    }

    
  };

  _pauseResult = async () => {
    if(this.state.resultPlaying==true){
      this.setState({resultPlaying:false})
      await this.state.resultRecording.pauseAsync();
    }

  };
  _createAutoSound = async () => {
    //this.setState({resultPlaying:true})
    this.api_auto()
    const source2 = {
      uri: this.state.autoURI.data,
      //uri: "file:///Users/furkankaragoz/Library/Developer/CoreSimulator/Devices/7BBD4F3F-7462-4B30-99BA-7ADCC210D4B7/data/Containers/Data/Application/EDF0CBDC-6F8D-4EE2-A26C-A1D8310613D4/Library/Caches/ExponentExperienceData/%2540anonymous%252FMusicRecorderApp-f36e083a-c33b-4707-894d-a2a77dbb1323/AV/recording-D115859A-E134-4D27-831D-C1816483D4E6999.caf",
      //uri: "file:///Users/furkankaragoz/Library/Developer/CoreSimulator/Devices/7BBD4F3F-7462-4B30-99BA-7ADCC210D4B7/data/Containers/Data/Application/EDF0CBDC-6F8D-4EE2-A26C-A1D8310613D4/Library/Caches/ExponentExperienceData/%2540anonymous%252FMusicRecorderApp-f36e083a-c33b-4707-894d-a2a77dbb1323/AV/recording-0B6BE9FB-97F1-416A-8CA2-6ABC83FF291D.m4a",
      //uri: "file:///Users/furkankaragoz/Library/Developer/CoreSimulator/Devices/7BBD4F3F-7462-4B30-99BA-7ADCC210D4B7/data/Containers/Data/Application/EDF0CBDC-6F8D-4EE2-A26C-A1D8310613D4/Library/Caches/ExponentExperienceData/%2540anonymous%252FMusicRecorderApp-f36e083a-c33b-4707-894d-a2a77dbb1323/AV/recording-D1FB7AE4-8629-4E54-8E0A-7F6A1E165505999.wav",
      //uri: "file:///Users/eceguz/Desktop/alfabe.wav"
    };

    const initialStatus2 = {
      shouldPlay: true,
      volume: this.state.volume,
      isMuted: this.state.muted,
      isLooping: false,
      // // UNCOMMENT THIS TO TEST THE OLD androidImplementation:
      // androidImplementation: 'MediaPlayer',
    };

    const sound2 = await Audio.Sound.createAsync(source2, initialStatus2);
    console.log("sound", sound2["sound"]);
    //await this.setState({ resultRecording: sound2["sound"] });
    await sound2["sound"].playAsync();
  };
  render() {
    return !this.state.fontLoaded ? (
      <View style={styles.emptyContainer} />
    ) : (
      <ImageBackground
        source={localImage}
        resizeMode="cover"
        style={styles.imageBackground}
      >
        <View style={styles.container}>
          {/* <View /> */}
          <View style={styles.nameContainer}>
            <Text style={styles.title}>{this.state.playbackInstanceName}</Text>
          </View>
          {/* <View style={styles.space} /> */}

          <View
            style={[
              styles.playbackContainer,
              {
                opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
              },
            ]}
          >
            <View
              style={
                this.state.isPaused ? styles.modalContainer : styles.invisible
              }
            >
              <Text style={styles.smallerText}>Play/Pick Suggestions</Text>
              <View style={styles.row}>
                <TouchableHighlight onPress={() => this._haveSuggestion(0)}>
                  <Ionicons
                    size={30}
                    color="#e2d4e3"
                    style={styles.playCheckButtons}
                    align="center"
                    name={"play-circle-outline"}
                  />
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this._pickSuggestion(0)}>
                  <Ionicons
                    size={30}
                    color="#e2dee3"
                    style={styles.playCheckButtons}
                    align="center"
                    name={"checkmark-outline"}
                  />
                </TouchableHighlight>
              </View>
              <View style={styles.row}>
                <TouchableHighlight onPress={() => this._haveSuggestion(1)}>
                  <Ionicons
                    size={30}
                    color="#e2dee3"
                    style={styles.playCheckButtons}
                    align="center"
                    name={"play-circle-outline"}
                  />
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this._pickSuggestion(1)}>
                  <Ionicons
                    size={30}
                    color="#e2dee3"
                    style={styles.playCheckButtons}
                    align="center"
                    name={"checkmark-outline"}
                  />
                </TouchableHighlight>
              </View>
              <View style={styles.row}>
                <TouchableHighlight onPress={() => this._haveSuggestion(2)}>
                  <Ionicons
                    size={30}
                    color="#e2dee3"
                    style={styles.playCheckButtons}
                    align="center"
                    name={"play-circle-outline"}
                  />
                </TouchableHighlight>
                <TouchableHighlight onPress={() => this._pickSuggestion(2)}>
                  <Ionicons
                    size={30}
                    color="#e2dee3"
                    style={styles.playCheckButtons}
                    align="center"
                    name={"checkmark-outline"}
                  />
                </TouchableHighlight>
              </View>
            </View>
            <Slider
              ref={this._mountAudio}
              style={styles.playbackSlider}
              value={this._getSeekSliderPosition()}
              onValueChange={this._onSeekSliderValueChange}
              onSlidingComplete={this._onSeekSliderSlidingComplete}
              disabled={this.state.isLoading}
              minimumTrackTintColor="#ffffff"
              maximumTractTintColor="#000000"
            />

            <View style={styles.timestampRow}>
              <Text style={[styles.text, styles.buffering]}>
                {this.state.isBuffering ? BUFFERING_STRING : ""}
              </Text>
              <Text style={[styles.text, styles.timestamp]}>
                {this._getTimestamp()}
              </Text>
            </View>


            <View
            style={[
              styles.buttonsContainerBase,
              styles.buttonsContainerTopRow,
              {
                opacity: this.state.isLoading ? DISABLED_OPACITY : 1.0,
              },
            ]}
          >
            <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              onPress={this._onPlayPausePressed}
              disabled={this.state.isLoading}
            >
              <Ionicons
                size={60}
                color="#e2dee3"
                align="center"
                name={
                  this.state.isPlaying
                    ? "pause-circle-outline"
                    : "play-circle-outline"
                }
              />
            </TouchableHighlight>

            {/* <TouchableHighlight
              underlayColor={BACKGROUND_COLOR}
              style={styles.wrapper}
              //onPress={this._onStopPressed}
              onPress={this.api_from_python2}
              disabled={this.state.isLoading}
            >
              <Ionicons
                size={45}
                color="#e2dee3"
                align="center"
                name={"stop-circle-outline"}
              />
            </TouchableHighlight> */}
          </View>
          
          </View> 
          
          <View style={styles.buttonContainer}>
            {/* <View style={styles.touchableContainer}>
              <TouchableOpacity onPress={this._createResultSound}>
                <Text style={styles.buttonText}>Generate</Text>
              </TouchableOpacity>
            </View> */}
            <View style={styles.line}></View>
            <Text style={styles.text}>Final Recording</Text>
            <View style={styles.touchableContainer}>
              <TouchableOpacity onPress={ ()=>{
                this._createResultSound()
              }}>
                  <Text style={styles.buttonText}>Generate</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.touchableContainer}>

              <TouchableOpacity onPress={this.state.resultPlaying ? this._pauseResult : this._playResult}>
                <Ionicons
                  size={40}
                  color="#e2dee3"
                  align="center"
                  name={
                    this.state.resultPlaying
                      ? "pause-circle-outline"
                      : "play-circle-outline"
                  }
                />
                </TouchableOpacity>
            </View>
            <View style={styles.touchableContainer}>
              <TouchableOpacity  onPress={()=>Sharing.shareAsync(this.state.editData.data)}>
                  <Text style={styles.buttonText}>Share</Text>
                </TouchableOpacity>
            </View>
           

            <MaterialIcons
              name="help-outline"
              size={25}
              color="#e2dee3"
              style={styles.modal}
              onPress={() => this.setState({modalOpen:true})}/>
            
            <Modal visible={this.state.modalOpen} animationType="slide" transparent={true}>
            <View style={styles.modalContent}>
              <MaterialIcons
                name="close"
                size={25}
                color="#e2dee3"
                style={{ ...styles.modal, ...styles.modalClose }}
                onPress={() => this.setState({modalOpen:false})}
              />
              <Text style={styles.helpTitle}>
              How To Use
              </Text>
              <Text style={styles.text}>
                Step 1:
              </Text>
              <Text style={styles.smallerText}>
                To play your raw recording, press the play button with the sideways triangle inside.
              </Text>
              <Text style={styles.smallerText}>
                 
              </Text>
              <Text style={styles.text}>
                Step 2:
              </Text>
              <Text style={styles.smallerText}>
                Pause right before the part you think needs work by pressing on the button from Step 1. 
              </Text>
              <Text style={styles.smallerText}>
                 
              </Text>
              <Text style={styles.text}>
                Step 3:
              </Text>
              <Text style={styles.smallerText}>
              From the three suggestions that appear, listen to each of them by pressing on the play buttons next to the checkmarks.
              </Text>
              <Text style={styles.smallerText}>
                 
              </Text>
              <Text style={styles.text}>
                Step 4:
              </Text>
              <Text style={styles.smallerText}>
              Pick one of the suggestions that you think would better suit the problematic part by pressing on the checkmark.
              </Text>
              <Text style={styles.smallerText}>
                 
              </Text>
              <Text style={styles.text}>
                Step 5:
              </Text>
              <Text style={styles.smallerText}>
              To listen to the altered recording, use the Play and Pause buttons that are located below the Final Recording title. 
              </Text>
              <Text style={styles.smallerText}>
                 
              </Text>
              <Text style={styles.text}>
                Step 6:
              </Text>
              <Text style={styles.smallerText}>
              Apply steps 2 and 3 throughout the whole recording.
              </Text>
              <Text style={styles.smallerText}>
                 
              </Text>
              <Text style={styles.text}>
                Step 7:
              </Text>
              <Text style={styles.smallerText}>
              Press on "share" to save the finalized version of your recording to your phone or share your recording in different platforms!  
              </Text>
            </View>
          </Modal>
          </View>
        

    
        
            {/* <View style={styles.volumeContainer}>
              <TouchableHighlight
                underlayColor={BACKGROUND_COLOR}
                style={styles.wrapper}
                onPress={this._onMutePressed}
              >
                <Ionicons
                  size={30}
                  color="#e2dee3"
                  align="center"
                  name={
                    this.state.muted
                      ? "volume-mute-outline"
                      : "volume-medium-outline"
                  }
                />
              </TouchableHighlight>
              <Slider
                style={styles.volumeSlider}
                value={1}
                onValueChange={this._onVolumeSliderValueChange}
                minimumTrackTintColor="#e2dee3"
                maximumTractTintColor="#000000"
              />
            </View> */}

          <View />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  emptyContainer: {
    alignSelf: "stretch",
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    //backgroundColor: BACKGROUND_COLOR,
  },
  wrapper: {
    
  },
  nameContainer: {
    //backgroundColor: "rgba(46, 49, 49, 0.3)",
    //width: "65%",
    alignSelf: "center",
    borderRadius: 10,
    margin: 10,
  },
  space: {
    height: FONT_SIZE,
  },
  playbackContainer: {
    //flex: 1,
    //backgroundColor:"white",
    flexDirection: "column",
    //justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    height: 0.5 * DEVICE_HEIGHT,
    //minHeight: 81,
    //maxHeight: 81,
    //maxHeight: DEVICE_HEIGHT * 0.5
  },
  playbackSlider: {
    //backgroundColor:"red",
    alignSelf: "stretch",
    //width: 0.9 * DEVICE_WIDTH
  },
  timestampRow: {
    //backgroundColor:"green",
    //flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    minHeight: FONT_SIZE,
  },
  text: {
    fontFamily:'Poppins_400Regular',
    color: "#dfc6f7",
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE,
    fontSize:16
  },
  smallerText: {
    fontFamily:'Poppins_400Regular',
    color: "#dfc6f7",
    fontSize: FONT_SIZE,
    minHeight: FONT_SIZE,
    fontSize:14
  },
  title: {
    fontFamily:'Poppins_400Regular',
    padding: 10,
    textAlign: "center",
    fontSize: 25,
    color: "#dfc6f7",
    fontWeight: "bold",
    
  },
  helpTitle: {
    fontFamily:'Poppins_400Regular',
    padding: 10,
    textAlign: "center",
    fontSize: 20,
    color: "#dfc6f7",
    fontWeight: "bold",
  },
  buffering: {
    textAlign: "left",
    paddingLeft: 20,
  },
  timestamp: {
    textAlign: "right",
    paddingRight: 20,
  },
  button: {
    backgroundColor: BACKGROUND_COLOR,
  },
  buttonsContainerBase: {
    minHeight:70,
    //backgroundColor:"pink",
    //flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", //space-between
  },
  buttonsContainerTopRow: {
    //backgroundColor:"purple",
    maxHeight: 50,
    minWidth: DEVICE_WIDTH / 2.0,
    maxWidth: DEVICE_WIDTH / 2.0,
    //padding: 10
    marginTop: 5
  },
  buttonsContainerMiddleRow: {
    maxHeight: 60,
    alignSelf: "center",
    paddingRight: 20,
  },
  // volumeContainer: {
  //   flex: 1,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   minWidth: DEVICE_WIDTH / 2.0,
  //   maxWidth: DEVICE_WIDTH / 2.0,
  //   padding: 5,
  // },
  volumeSlider: {
    width: DEVICE_WIDTH / 3.0,
  },
  buttonsContainerBottomRow: {
    maxHeight: 25,
    alignSelf: "center",
    paddingRight: 20,
    paddingLeft: 20,
  },
  rateSlider: {
    width: DEVICE_WIDTH / 2.0,
  },
  buttonsContainerTextRow: {
    maxHeight: FONT_SIZE,
    alignItems: "center",
    paddingRight: 20,
    paddingLeft: 20,
    minWidth: DEVICE_WIDTH,
    maxWidth: DEVICE_WIDTH,
  },
  imageBackground: {
    height: "100%",
    width: "100%",
  },
  invisible: {
    //backgroundColor: "rgba(46, 49, 49, 0.3)",
    backgroundColor: "white",
    opacity: 0.0,
    alignItems: "center",
    width: "45%",
    borderRadius: 25,
    //alignSelf: "center",
    padding: 10,
    margin: 20,
  },
  modalContainer: {
    backgroundColor: "rgba(46, 49, 49, 0.3)",
    //backgroundColor: "white",
    display: "grid",
    alignItems: "center",
    width: "45%",
    borderRadius: 25,
    alignSelf: "center",
    padding: 10,
    margin: 20,
  },
  playCheckButtons: {
    marginTop: 5,
    marginRight:5
  },
  suggestionButtons: {
    flex: 1,
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
  },
  buttonContainer:{
    height:DEVICE_HEIGHT/2.0,
    maxHeight:600,
    minHeight:600,
    bottom: 60
    //backgroundColor:"white"
  },
  touchableContainer: {
    backgroundColor: "rgba(46, 49, 49, 0.3)",
    //alignItems: "center",
    width: "60%",
    height:50,
    borderRadius: 25,
    alignSelf: "center",
    padding: 5,
    marginTop:10,
    justifyContent:"center"
    
  },
  buttonText:{
    color:"#e2dee3",
    fontFamily:'Poppins_400Regular',
    fontSize:20,
    //marginTop:5

  }, 
  modal: {
    
    borderColor: "rgba(46, 49, 49, 0.8)",
    marginTop: 60,
    borderRadius: 30,
    bottom: 20,
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
  line:{
    display: "block",
    height: 1,
    border: 0,
    borderTopColor: "#e2dee3",
    borderTopWidth:1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    margin: 10,
    padding: 0,
   }
});
