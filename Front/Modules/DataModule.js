import * as React from "react";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

//import DataModules from "./DataModules.js";
//import { multiply, selam } from "./DataModules.js";

export async function storeAudioFilesArray(projectName, stringified) {
  try {
    await AsyncStorage.setItem(projectName, stringified);
  } catch (error) {
    console.log(error);
  }
}

export function selam() {
  console.log("Selamın Aleykummm");
}

export function multiply(a, b) {
  return a * b;
}

/*
  async function getAudioFiles() {
    const jsonval = await AsyncStorage.getItem(projectName);
    const parsedjsonval = JSON.parse(jsonval);

    const { sound } = await Audio.Sound.createAsync({
      uri: parsedjsonval[parsedjsonval.length - 1].file,
    });
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
  }
  */
