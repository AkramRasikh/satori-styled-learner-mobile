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
import {addSnippetAPI, deleteSnippetAPI} from './api/snippet';
import TrackPlayer, {Capability} from 'react-native-track-player';
import saveWordAPI from './api/save-word';

function App(): React.JSX.Element {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [structuredUnifiedData, setStructuredUnifiedData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [masterSnippetState, setMasterSnippetState] = useState([]);
  const [newWordsAdded, setNewWordsAdded] = useState([]);
  const [showOtherTopics, setShowOtherTopics] = useState(true);
  const [japaneseLoadedSongsState, setJapaneseLoadedSongsState] = useState([]);

  useEffect(() => {
    async function setupPlayer() {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        stopWithApp: false,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SeekTo,
          Capability.JumpForward,
          Capability.JumpBackward,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SeekTo,
          Capability.JumpForward,
          Capability.JumpBackward,
        ],
      });
    }

    setupPlayer();

    return () => {
      TrackPlayer.stop();
      console.log('## unmount background APP');
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await getAllData();
        const japaneseLoadedSongs = results?.japaneseLoadedSongs.filter(
          item => item !== null,
        );
        setJapaneseLoadedSongsState(japaneseLoadedSongs);
        setData(results);
        const japaneseLoadedSnippetsWithSavedTag =
          results.japaneseLoadedSnippets?.map(item => ({
            ...item,
            saved: true,
          }));
        setMasterSnippetState(japaneseLoadedSnippetsWithSavedTag);
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
    const japaneseLoadedWords = [
      ...data?.japaneseLoadedWords,
      ...newWordsAdded,
    ];

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
    setShowOtherTopics(false);
  };

  const addSnippet = async snippetData => {
    try {
      const res = await addSnippetAPI({contentEntry: snippetData});
      setMasterSnippetState(prev => [...prev, {...res, saved: true}]);
    } catch (error) {
      console.log('## error adding snippet (App.tsx)');
    }
  };

  const saveWordFirebase = async ({
    highlightedWord,
    highlightedWordSentenceId,
  }) => {
    try {
      const savedWord = await saveWordAPI({
        highlightedWord,
        highlightedWordSentenceId,
      });
      setNewWordsAdded(prev => [...prev, savedWord]);
    } catch (error) {
      console.log('## saveWordFirebase err', error);
    }
  };

  const handleOtherTopics = () => {
    setShowOtherTopics(!showOtherTopics);
    setSelectedTopic('');
  };
  const removeSnippet = async snippetData => {
    try {
      const res = await deleteSnippetAPI({contentEntry: snippetData});
      const updatedSnippets = masterSnippetState.filter(
        item => item.id !== res.id,
      );
      setMasterSnippetState(updatedSnippets);
    } catch (error) {
      console.log('## error adding snippet (App.tsx)');
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
        <Text style={{fontStyle: 'italic', fontSize: 30, fontWeight: 'bold'}}>
          Loading data...
        </Text>
      </View>
    );
  }

  const japaneseLoadedContent = data.japaneseLoadedContent;
  const japaneseLoadedContentFullMP3s = data.japaneseLoadedContentFullMP3s;
  const japaneseLoadedWords = [...data?.japaneseLoadedWords, ...newWordsAdded];

  const topics = Object.keys(japaneseLoadedContent);
  const snippetsForSelectedTopic = masterSnippetState?.filter(
    item => item.topicName === selectedTopic,
  );

  return (
    <SafeAreaView style={{backgroundColor: '#D3D3D3'}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        {selectedTopic ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              margin: 'auto',
              padding: 10,
              backgroundColor: '#CCCCCC',
              borderColor: 'black',
              borderRadius: 10,
            }}>
            <TouchableOpacity onPress={handleOtherTopics}>
              <Text>More Topics</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {!selectedTopic || showOtherTopics ? (
          <>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {topics?.map(topic => {
                const hasUnifiedMP3File = japaneseLoadedContentFullMP3s.some(
                  mp3 => mp3.name === topic,
                );
                return (
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
                        backgroundColor:
                          selectedTopic === topic ? 'green' : 'transparent',
                      }}>
                      <Text>
                        {topic} {!hasUnifiedMP3File ? '🔕' : ''}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
            {japaneseLoadedSongsState?.map(songData => {
              return (
                <View key={songData.id}>
                  <View key={songData.id}>
                    <TouchableOpacity
                      onPress={() => handleShowTopic(songData.title)}
                      style={{
                        borderWidth: 1,
                        borderColor: '#999999',
                        borderRadius: 20,
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        margin: 5,
                        backgroundColor:
                          selectedTopic === songData.title
                            ? 'green'
                            : 'transparent',
                      }}>
                      <Text>{songData.title}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </>
        ) : null}

        <View>
          {selectedTopic ? (
            <TopicComponent
              topicName={selectedTopic}
              japaneseLoadedContent={japaneseLoadedContent}
              japaneseLoadedContentFullMP3s={japaneseLoadedContentFullMP3s}
              pureWordsUnique={getPureWords()}
              structuredUnifiedData={structuredUnifiedData}
              setStructuredUnifiedData={setStructuredUnifiedData}
              japaneseLoadedWords={japaneseLoadedWords}
              addSnippet={addSnippet}
              snippetsForSelectedTopic={snippetsForSelectedTopic}
              removeSnippet={removeSnippet}
              saveWordFirebase={saveWordFirebase}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
