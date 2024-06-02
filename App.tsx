import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {getAllData} from './api/load-content';
import {mockData} from './mockData';
import useGetCombinedAudioData from './hooks/useGetCombinedAudioData';
import TopicComponent from './components/TopicComponent';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const results = mockData || (await getAllData());
        const results = await getAllData();
        console.log('## results: ', results);

        setData(results);
      } catch (error) {
        console.log('## App error: ', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  useGetCombinedAudioData;
  if (loading || !data) {
    return <Text>Loading...</Text>;
  }

  const japaneseLoadedContent = data.japaneseLoadedContent;
  const japaneseLoadedContentFullMP3s = data.japaneseLoadedContentFullMP3s;

  const topics = Object.keys(japaneseLoadedContent);

  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Text>Yah dun know!</Text>
        </View>
        <View>
          {topics.map(topicName => (
            <TopicComponent
              topicName={topicName}
              japaneseLoadedContent={japaneseLoadedContent}
              japaneseLoadedContentFullMP3s={japaneseLoadedContentFullMP3s}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
