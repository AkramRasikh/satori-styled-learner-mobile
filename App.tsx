import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './screens/Home';
import {enableScreens} from 'react-native-screens'; // Import this line
import {SafeAreaProvider} from 'react-native-safe-area-context';
import DifficultSentences from './screens/DifficultSentences';

enableScreens();

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home" // This sets the default screen
          screenOptions={{headerShown: false}} // Optional: Hide headers
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen
            name="DifficultSentences"
            component={DifficultSentences}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
