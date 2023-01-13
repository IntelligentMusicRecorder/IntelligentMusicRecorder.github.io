
import EntryPage from "./screens/EntryPage";
import RecordingPage from "./screens/RecordingPage";
import SavePage from "./screens/SavePage";
import AudioListPage from "./screens/AudioListPage";
import AudioListPage2 from "./screens/AudioListPage2";
//import "react-native-url-polyfill/auto"

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Entry">
        <Stack.Screen
          name="Entry"
          component={EntryPage}
          options={{
            title: " ",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Recording"
          component={RecordingPage}
          options={{
            title: " ",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="AudioList"
          component={AudioListPage}
          options={{
            title: " ",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="AudioList2"
          component={AudioListPage2}
          options={{
            title: " ",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
          }}
        />
  
        <Stack.Screen
          name="Save"
          component={SavePage}
          options={{
            title: " ",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerTintColor: "#fff",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
