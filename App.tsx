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
import {getThisTopicsWordsToStudyAPI} from './api/words-to-study';
import useSetupPlayer from './hooks/useSetupPlayer';
import {updateCreateReviewHistory} from './api/update-create-review-history';
import {tempContent} from './refs';
import MoreTopics from './components/MoreTopics';

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
  const [japaneseLoadedContentState, setJapaneseLoadedContentState] = useState(
    [],
  );
  const [japaneseWordsToStudyState, setJapaneseWordsToStudyState] = useState(
    {},
  );
  const [generalTopicState, setGeneralTopicState] = useState('');

  useSetupPlayer({isSetupPlayerLoaded, setIsSetupPlayerLoaded});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await getAllData();
        const topicsToStudy = results.topicsToStudy;
        setTopicsToStudyState(topicsToStudy);
        const japaneseLoadedSongs = results?.japaneseLoadedSongs.filter(
          item => item !== null,
        );
        setJapaneseLoadedContentState(results.japaneseLoadedContent);
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

  const updateTopicMetaData = async ({topicName, fieldToUpdate}) => {
    try {
      const resObj = await updateCreateReviewHistory({
        ref: tempContent,
        contentEntry: topicName,
        fieldToUpdate,
      });
      if (resObj) {
        const thisTopicData = japaneseLoadedContentState.find(
          topic => topic.title === topicName,
        );
        const filterTopics = japaneseLoadedContentState.filter(
          topic => topic.title !== topicName,
        );
        const newTopicState = {...thisTopicData, ...resObj};
        setJapaneseLoadedContentState([...filterTopics, newTopicState]);
      }
    } catch (error) {
      console.log('## error updateTopicMetaData', {error});
    }
  };

  if (
    loading ||
    !data ||
    japaneseLoadedContentState?.length === 0 ||
    !topicsToStudyState
  ) {
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

  const today = new Date();

  const japaneseLoadedContentFullMP3s = data.japaneseLoadedContentFullMP3s;
  const japaneseLoadedWords = [...data?.japaneseLoadedWords, ...newWordsAdded];

  const topicKeys = japaneseLoadedContentState.map(
    topicData => topicData.title,
  );
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
  topicKeys.forEach(item => {
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

  const topicsToDisplay = topicKeys.filter(topic => {
    const generalTopicName = topic.split('-').slice(0, -1).join('-');
    if (generalTopicName === generalTopicState) {
      return true;
    } else {
      false;
    }
  });

  const nextReviewCalculation = nextReview => {
    const differenceInMilliseconds = today - new Date(nextReview);

    const differenceInDays = Math.floor(
      differenceInMilliseconds / (1000 * 60 * 60 * 24),
    );

    return differenceInDays;
  };

  const isDueReview = (topicOption, singular) => {
    if (singular) {
      const thisData = japaneseLoadedContentState.find(
        topicDisplayed => topicDisplayed.title === topicOption,
      );

      const thisDataNextReview = thisData?.nextReview;
      if (thisDataNextReview) {
        const differenceInDays = nextReviewCalculation(thisDataNextReview);

        if (differenceInDays > 0) {
          return true;
        }
      }

      return false;
    }
    let subTopicDue: number;
    // change to forLoop
    const nextReviewDateDue = japaneseLoadedContentState.some(jpContent => {
      if (jpContent.title.split('-').slice(0, -1).join('-') === topicOption) {
        const nextReview = jpContent?.nextReview;
        if (nextReview) {
          const differenceInDays = nextReviewCalculation(nextReview);
          if (differenceInDays) {
            subTopicDue = differenceInDays;
            return true;
          }
        }
      }
    });

    if (!nextReviewDateDue) {
      return false;
    }

    if (subTopicDue > 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: '#D3D3D3', minHeight: '100%'}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        {selectedSong || selectedTopic || generalTopicState === '' ? null : (
          <MoreTopics handleShowGeneralTopic={handleShowGeneralTopic} />
        )}
        {!generalTopicState && !selectedSong && (
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {generalTopicObjKeys?.map(generalTopic => {
              const numberOfWordsToStudy = generalTopicObj[generalTopic];

              const hasReviewDue = isDueReview(generalTopic, false);
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
                      backgroundColor: hasReviewDue ? '#C34A2C' : 'transparent',
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

              const thisTopicIsDue = isDueReview(topic, true);

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
                      backgroundColor: thisTopicIsDue
                        ? '#C34A2C'
                        : 'transparent',
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
              japaneseLoadedContent={japaneseLoadedContentState}
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
              updateTopicMetaData={updateTopicMetaData}
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
