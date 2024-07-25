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
import saveWordAPI from './api/save-word';
import SongComponent from './components/SongComponent';
import {
  getThisTopicsWordsToStudyAPI,
  getTopicsToStudy,
} from './api/words-to-study';
import useSetupPlayer from './hooks/useSetupPlayer';

function App(): React.JSX.Element {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSetupPlayerLoaded, setIsSetupPlayerLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [structuredUnifiedData, setStructuredUnifiedData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSong, setSelectedSong] = useState('');
  const [masterSnippetState, setMasterSnippetState] = useState([]);
  const [newWordsAdded, setNewWordsAdded] = useState([]);
  const [showOtherTopics, setShowOtherTopics] = useState(true);
  const [topicsToStudyState, setTopicsToStudyState] = useState(null);
  const [japaneseLoadedSongsState, setJapaneseLoadedSongsState] = useState([]);
  const [japaneseWordsToStudyState, setJapaneseWordsToStudyState] = useState(
    {},
  );
  const [generalTopicState, setGeneralTopicState] = useState('');

  useSetupPlayer({isSetupPlayerLoaded, setIsSetupPlayerLoaded});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await getAllData();
        const topicsToStudy = await getTopicsToStudy();
        setTopicsToStudyState(topicsToStudy);
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
    setSelectedSong('');
    if (topic === selectedTopic) {
      setSelectedTopic('');
    } else {
      setSelectedTopic(topic);
    }
    setShowOtherTopics(false);
  };

  const handleShowGeneralTopic = generalTopic => {
    setGeneralTopicState(generalTopic);
  };

  const handleShowMusic = song => {
    setSelectedTopic('');
    if (song === selectedSong) {
      setSelectedSong('');
    } else {
      setSelectedSong(song);
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

  const getThisTopicsWordsFunc = async (topic, isMusic) => {
    try {
      const res = await getThisTopicsWordsToStudyAPI({topic, isMusic});
      setJapaneseWordsToStudyState({
        ...japaneseWordsToStudyState,
        [topic]: res,
      });
    } catch (error) {
      console.log('## getThisTopicsWordsFunc Err:', error);
    }
  };

  const handleOtherTopics = () => {
    setShowOtherTopics(!showOtherTopics);
    setSelectedTopic('');
    setSelectedSong('');
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
    item => item.topicName === selectedTopic || item.topicName === selectedSong,
  );

  const songData = japaneseLoadedSongsState?.find(
    item => item.title === selectedSong,
  );

  const formattedContent = selectedSong
    ? songData.lyrics.map((item, index) => {
        const isLastInArr = index + 1 === songData.lyrics.length;

        return {
          ...item,
          startAt: item.time,
          endAt: isLastInArr ? null : songData.lyrics[index + 1].time,
        };
      })
    : [];

  const topicOrSongSelected = selectedTopic || selectedSong;

  const generalTopicObj = {};
  topics.forEach(item => {
    const numberOfWordsToStudy = topicsToStudyState[item];
    const splitWord = item.split('-').slice(0, -1).join('-');
    const existsInObj = generalTopicObj[splitWord];
    if (existsInObj) {
      const newNumber =
        generalTopicObj[splitWord] +
        (numberOfWordsToStudy ? numberOfWordsToStudy : 0);
      generalTopicObj[splitWord] = newNumber;
    } else {
      generalTopicObj[splitWord] = numberOfWordsToStudy || 0;
    }
  });

  const generalTopicObjKeys = Object.keys(generalTopicObj);

  const topicsToDisplay = topics.filter(topic => {
    const generalTopicName = topic.split('-').slice(0, -1).join('-');
    if (generalTopicName === generalTopicState) {
      return true;
    } else {
      false;
    }
  });

  return (
    <SafeAreaView style={{backgroundColor: '#D3D3D3', minHeight: '100%'}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        {selectedSong || selectedTopic || generalTopicState === '' ? null : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => handleShowGeneralTopic('')}
              style={{
                backgroundColor: '#CCCCCC',
                borderColor: 'black',
                borderRadius: 10,
                padding: 10,
              }}>
              <Text>More Topics</Text>
            </TouchableOpacity>
          </View>
        )}
        {!generalTopicState && !selectedSong && (
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {generalTopicObjKeys?.map(generalTopic => {
              const numberOfWordsToStudy = generalTopicObj[generalTopic];
              return (
                <View key={generalTopic}>
                  <TouchableOpacity
                    onPress={() => handleShowGeneralTopic(generalTopic)}
                    style={{
                      borderWidth: 1,
                      borderColor: '#999999',
                      borderRadius: 20,
                      paddingVertical: 10,
                      paddingHorizontal: 15,
                      margin: 5,
                    }}>
                    <Text>
                      {generalTopic}{' '}
                      {numberOfWordsToStudy ? (
                        <Text>({numberOfWordsToStudy})</Text>
                      ) : null}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
        {!topicOrSongSelected || showOtherTopics ? (
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {topicsToDisplay?.map(topic => {
              const hasUnifiedMP3File = japaneseLoadedContentFullMP3s.some(
                mp3 => mp3.name === topic,
              );
              const numberOfWordsToStudy = topicsToStudyState[topic];

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
                      {topic} {!hasUnifiedMP3File ? '🔕' : ''}{' '}
                      {numberOfWordsToStudy ? (
                        <Text>({numberOfWordsToStudy})</Text>
                      ) : null}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ) : null}
        {!topicOrSongSelected && !generalTopicState ? (
          <View style={{padding: 10}}>
            <Text style={{textDecorationLine: 'underline'}}>Songs:</Text>
          </View>
        ) : null}
        {(!topicOrSongSelected || showOtherTopics) && !generalTopicState ? (
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {japaneseLoadedSongsState?.map(songData => {
              const numberOfWordsToStudy = topicsToStudyState[songData.title];

              return (
                <View key={songData.id}>
                  <TouchableOpacity
                    onPress={() => handleShowMusic(songData.title)}
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
                    <Text>
                      {songData.title}{' '}
                      {numberOfWordsToStudy ? (
                        <Text>({numberOfWordsToStudy})</Text>
                      ) : null}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
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
              handleOtherTopics={handleOtherTopics}
              hasWordsToStudy={topicsToStudyState[selectedTopic]}
              japaneseWordsToStudyState={japaneseWordsToStudyState}
              getThisTopicsWordsFunc={getThisTopicsWordsFunc}
            />
          ) : selectedSong ? (
            <SongComponent
              topicName={selectedSong}
              pureWordsUnique={getPureWords()}
              structuredUnifiedData={structuredUnifiedData}
              setStructuredUnifiedData={setStructuredUnifiedData}
              japaneseLoadedWords={japaneseLoadedWords}
              snippetsForSelectedTopic={snippetsForSelectedTopic}
              addSnippet={addSnippet}
              removeSnippet={removeSnippet}
              saveWordFirebase={saveWordFirebase}
              topicData={formattedContent}
              handleOtherTopics={handleOtherTopics}
              japaneseWordsToStudyState={japaneseWordsToStudyState}
              hasWordsToStudy={topicsToStudyState[selectedSong]}
              getThisTopicsWordsFunc={getThisTopicsWordsFunc}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
