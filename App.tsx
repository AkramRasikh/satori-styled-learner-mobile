import React, {useEffect, useState} from 'react';
import {AppState} from 'react-native';
import RNFS from 'react-native-fs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens'; // Import this line
import {SafeAreaProvider} from 'react-native-safe-area-context';
import DifficultSentences from './screens/DifficultSentences';
import Home from './screens/home';
import {DataProvider} from './context/Data/DataProvider';
import WordStudy from './screens/WordStudy';
import LanguageSelectorScreen from './screens/LanguageSelector';
import {LanguageSelectorProvider} from './context/Data/LanguageSelectorProvider';
import useSetupPlayer from './hooks/useSetupPlayer';
import VideoTestScreen from './screens/VideoTestScreen';

enableScreens();

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  const [isSetupPlayerLoaded, setIsSetupPlayerLoaded] = useState(false);

  useSetupPlayer({isSetupPlayerLoaded, setIsSetupPlayerLoaded});

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = nextAppState => {
    if (nextAppState === 'background') {
      clearTemporaryFiles();
    }
  };

  const clearTemporaryFiles = async () => {
    try {
      const files = await RNFS.readDir(RNFS.TemporaryDirectoryPath);
      files.forEach(async file => {
        await RNFS.unlink(file.path);
      });
      console.log('## App Temporary files cleared');
    } catch (err) {
      console.error('## App Error clearing temporary files:', err);
    }
  };

  return (
    <LanguageSelectorProvider>
      <DataProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="LanguageSelector" // This sets the default screen
              screenOptions={{headerShown: false}} // Optional: Hide headers
            >
              <Stack.Screen name="VideoTestScreen">
                {props => <VideoTestScreen {...props} />}
              </Stack.Screen>
              <Stack.Screen name="LanguageSelector">
                {props => <LanguageSelectorScreen {...props} />}
              </Stack.Screen>
              <Stack.Screen name="Home">
                {props => <Home {...props} />}
              </Stack.Screen>
              <Stack.Screen name="WordStudy">
                {props => <WordStudy {...props} />}
              </Stack.Screen>
              <Stack.Screen name="DifficultSentences">
                {() => <DifficultSentences />}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </DataProvider>
    </LanguageSelectorProvider>
  );
}

export default App;
