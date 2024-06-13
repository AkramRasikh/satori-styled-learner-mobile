import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {getAllData} from './api/load-content';
import TopicComponent from './components/TopicComponent';
import {makeArrayUnique} from './hooks/useHighlightWordToWordBank';

function App(): React.JSX.Element {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [structuredUnifiedData, setStructuredUnifiedData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');

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

  const handleShowTopic = topic => {
    if (topic === selectedTopic) {
      setSelectedTopic('');
    } else {
      setSelectedTopic(topic);
    }
  };

  if (loading || !data || !data?.japaneseLoadedContent) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text>Loading init data...</Text>
      </View>
    );
  }

  const japaneseLoadedContent = data.japaneseLoadedContent;
  const japaneseLoadedContentFullMP3s = data.japaneseLoadedContentFullMP3s;

  const topics = Object.keys(japaneseLoadedContent);

  return (
    <SafeAreaView style={{backgroundColor: '#D3D3D3'}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        <View>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            Yah dun know!!
          </Text>
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {topics?.map(topic => (
            <View key={topic}>
              <TouchableOpacity
                onPress={() => handleShowTopic(topic)}
                style={{
                  borderWidth: 1,
                  borderColor: '#999999',
                  borderRadius: 20,
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  margin: 5,
                  backgroundColor: selectedTopic === topic ? 'green' : 'auto',
                }}>
                <Text>{topic}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View>
          {selectedTopic ? (
            <TopicComponent
              topicName={selectedTopic}
              japaneseLoadedContent={japaneseLoadedContent}
              japaneseLoadedContentFullMP3s={japaneseLoadedContentFullMP3s}
              pureWordsUnique={getPureWords()}
              structuredUnifiedData={structuredUnifiedData}
              setStructuredUnifiedData={setStructuredUnifiedData}
              japaneseLoadedWords={data?.japaneseLoadedWords}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
