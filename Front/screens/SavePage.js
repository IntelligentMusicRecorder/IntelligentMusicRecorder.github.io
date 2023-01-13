import localImage from "./images/bg1.jpeg";
import {ImageBackground, StyleSheet, Text, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";


export default function SavePage() {

    const localImage = require("./images/bg1.jpeg");

    return (
        <ImageBackground
            source={localImage}
            resizeMode="cover"
            style={styles.imageBackground}
        >
            <TouchableOpacity
                style = {styles.titleContainer}>
            <Text style = {styles.text}>New Project</Text>
            </TouchableOpacity>
            <TouchableOpacity
             style = {styles.touchableContainer}
            >
            <Ionicons
                  size = {20}
                  color = "white"
                  align = "center"
                  name = "download-outline"/>
            </TouchableOpacity>
            <TouchableOpacity
                style = {styles.touchableContainer}
            >
            <Ionicons
                  size = {20}
                  color = "white"
                  align = "center"
                  name = "share-social-outline"/>
            </TouchableOpacity>

        </ImageBackground>

    )
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
        color: 'white'
    },

    touchableContainer: {
        backgroundColor: 'rgba(46, 49, 49, 0.3)',
        alignItems: 'center',
        width: '15%',
        borderRadius: 25,
        alignSelf: "center",
        padding: 10,
        margin: 20
    },

    titleContainer: {
        backgroundColor: 'rgba(46, 49, 49, 0.3)',
        width: '65%',
        alignSelf: 'center',
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
    
    


});
