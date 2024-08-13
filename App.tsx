import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens'; // Import this line
import {SafeAreaProvider} from 'react-native-safe-area-context';
import DifficultSentences from './screens/DifficultSentences';
import {getAllData} from './api/load-content';
import Home from './screens/home';
import {loadDifficultSentences} from './api/load-difficult-sentences';

enableScreens();

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  const [homeScreenData, setHomeScreenData] = useState(null);
  const [difficultSentencesState, setDifficultSentencesState] = useState([]);
  const [appError, setAppError] = useState(null);
  const [appIsLoading, setAppIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allStudyDataRes = await getAllData();
        const allDifficultSentencesRes = await loadDifficultSentences();

        setHomeScreenData(allStudyDataRes);
        setDifficultSentencesState(allDifficultSentencesRes);
      } catch (error) {
        console.log('## App error: ', error);
        setAppError(error);
      } finally {
        setAppIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home" // This sets the default screen
          screenOptions={{headerShown: false}} // Optional: Hide headers
        >
          <Stack.Screen name="Home">
            {props => (
              <Home
                {...props}
                homeScreenData={homeScreenData}
                appIsLoading={appIsLoading}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="DifficultSentences">
            {props => (
              <DifficultSentences
                {...props}
                difficultSentencesState={difficultSentencesState}
                appIsLoading={appIsLoading}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
