import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {getAllData} from './api/load-content';
import TopicComponent from './components/TopicComponent';
import {makeArrayUnique} from './hooks/useHighlightWordToWordBank';

function App(): React.JSX.Element {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const results = mockData || (await getAllData());
        const results = await getAllData();

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

  const getPureWords = () => {
    let pureWords = [];
    const japaneseLoadedWords = data?.japaneseLoadedWords;

    japaneseLoadedWords?.forEach(wordData => {
      pureWords.push(wordData.baseForm);
      pureWords.push(wordData.surfaceForm);
    });

    const pureWordsUnique =
      pureWords?.length > 0 ? makeArrayUnique(pureWords) : [];
    return pureWordsUnique;
  };

  if (loading || !data || !data?.japaneseLoadedContent) {
    return <Text>Loading...</Text>;
  }

  const japaneseLoadedContent = data.japaneseLoadedContent;
  const japaneseLoadedContentFullMP3s = data.japaneseLoadedContentFullMP3s;

  const topics = Object.keys(japaneseLoadedContent);

  return (
    <SafeAreaView style={{backgroundColor: Colors.white}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        <View
          style={{
            backgroundColor: Colors.white,
          }}>
          <Text>Yah dun know!!</Text>
        </View>
        <View>
          {topics.map(topicName => (
            <TopicComponent
              key={topicName}
              topicName={topicName}
              japaneseLoadedContent={japaneseLoadedContent}
              japaneseLoadedContentFullMP3s={japaneseLoadedContentFullMP3s}
              pureWordsUnique={getPureWords()}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
