import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens'; // Import this line
import {SafeAreaProvider} from 'react-native-safe-area-context';
import DifficultSentences from './screens/DifficultSentences';
import Home from './screens/home';
import {DataProvider} from './context/Data/DataProvider';

enableScreens();

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <DataProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home" // This sets the default screen
            screenOptions={{headerShown: false}} // Optional: Hide headers
          >
            <Stack.Screen name="Home">
              {props => <Home {...props} />}
            </Stack.Screen>
            <Stack.Screen name="DifficultSentences">
              {() => <DifficultSentences />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </DataProvider>
  );
}

export default App;
