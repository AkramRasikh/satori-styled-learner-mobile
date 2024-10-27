import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';

import TopicComponent from '../../components/TopicComponent';
import {makeArrayUnique} from '../../hooks/useHighlightWordToWordBank';
import saveWordAPI from '../../api/save-word';
import SongComponent from '../../components/SongComponent';
import {getThisTopicsWordsToStudyAPI} from '../../api/words-to-study';
import useSetupPlayer from '../../hooks/useSetupPlayer';
import {updateCreateReviewHistory} from '../../api/update-create-review-history';
import MoreTopics from '../../components/MoreTopics';
import GeneralTopics from '../../components/GeneralTopics';
import TopicsToDisplay from '../../components/TopicsToDisplay';
import SongSection from '../../components/SongSection';
import ToastMessage from '../../components/ToastMessage';
import {updateSentenceDataAPI} from '../../api/update-sentence-data';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  checkIsFutureReviewNeeded,
  isUpForReview,
} from '../../utils/is-up-for-review';
import {getGeneralTopicName} from '../../utils/get-general-topic-name';
import useLanguageSelector from '../../context/Data/useLanguageSelector';

function Home({
  navigation,
  homeScreenData,
  targetLanguageLoadedContentMaster,
  targetLanguageSnippetsState,
  addSnippet,
  removeSnippet,
}): React.JSX.Element {
  const [data, setData] = useState<any>(null);
  const [isSetupPlayerLoaded, setIsSetupPlayerLoaded] = useState(false);

  const [structuredUnifiedData, setStructuredUnifiedData] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedSong, setSelectedSong] = useState('');
  const [newWordsAdded, setNewWordsAdded] = useState([]);
  const [showOtherTopics, setShowOtherTopics] = useState(true);
  const [topicsToStudyState, setTopicsToStudyState] = useState(null);
  const [targetLanguageLoadedSongsState, settargetLanguageLoadedSongsState] =
    useState([]);
  const [
    targetLanguageLoadedContentState,
    settargetLanguageLoadedContentState,
  ] = useState([]);
  const [targetLanguageWordsToStudyState, setTargetLanguageWordsToStudyState] =
    useState({});
  const [generalTopicState, setGeneralTopicState] = useState('');
  const [updatePromptState, setUpdatePromptState] = useState('');
  const [triggerSentenceIdUpdate, setTriggerSentenceIdUpdate] = useState('');

  const {languageSelectedState} = useLanguageSelector();

  useSetupPlayer({isSetupPlayerLoaded, setIsSetupPlayerLoaded});

  useEffect(() => {
    if (targetLanguageLoadedContentMaster) {
      settargetLanguageLoadedContentState(targetLanguageLoadedContentMaster);
    }
  }, [targetLanguageLoadedContentMaster]);

  useEffect(() => {
    const results = homeScreenData;
    const topicsToStudy = results.topicsToStudy;
    setTopicsToStudyState(topicsToStudy);
    const targetLanguageLoadedSongs = results?.targetLanguageLoadedSongs.filter(
      item => item !== null,
    );
    const targetLanguageLoadedContent = targetLanguageLoadedContentMaster;
    settargetLanguageLoadedContentState(
      targetLanguageLoadedContent.sort((a, b) => {
        return a.isCore === b.isCore ? 0 : a.isCore ? -1 : 1;
      }),
    );
    settargetLanguageLoadedSongsState(targetLanguageLoadedSongs);
    setData(results);
  }, []);

  const getPureWords = () => {
    let pureWords = [];
    const targetLanguageLoadedWords = [
      ...data?.targetLanguageLoadedWords,
      ...newWordsAdded,
    ];

    targetLanguageLoadedWords?.forEach(wordData => {
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

  const saveWordFirebase = async ({
    highlightedWord,
    highlightedWordSentenceId,
    contextSentence,
    isGoogle = false,
  }) => {
    try {
      const savedWord = await saveWordAPI({
        highlightedWord,
        highlightedWordSentenceId,
        contextSentence,
        isGoogle,
        language: languageSelectedState,
      });
      setNewWordsAdded(prev => [...prev, savedWord]);
    } catch (error) {
      console.log('## saveWordFirebase err', error);
    }
  };

  const getThisTopicsWordsFunc = async (topic, isMusic) => {
    try {
      const res = await getThisTopicsWordsToStudyAPI({
        topic,
        isMusic,
        language: languageSelectedState,
      });
      setTargetLanguageWordsToStudyState({
        ...targetLanguageWordsToStudyState,
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

  const updateTopicMetaData = async ({topicName, fieldToUpdate}) => {
    try {
      const resObj = await updateCreateReviewHistory({
        contentEntry: topicName,
        fieldToUpdate,
        language: languageSelectedState,
      });
      if (resObj) {
        const thisTopicData = targetLanguageLoadedContentState.find(
          topic => topic.title === topicName,
        );
        const filterTopics = targetLanguageLoadedContentState.filter(
          topic => topic.title !== topicName,
        );
        const newTopicState = {...thisTopicData, ...resObj};
        settargetLanguageLoadedContentState([...filterTopics, newTopicState]);
        setUpdatePromptState(`${topicName} updated!`);
        setTimeout(() => setUpdatePromptState(''), 3000);
      }
    } catch (error) {
      console.log('## error updateTopicMetaData', {error});
    }
  };

  const updateSentenceData = async ({topicName, sentenceId, fieldToUpdate}) => {
    try {
      const resObj = await updateSentenceDataAPI({
        topicName,
        sentenceId,
        fieldToUpdate,
        language: languageSelectedState,
      });

      if (resObj) {
        const thisTopicDataIndex = targetLanguageLoadedContentState.findIndex(
          topic => topic.title === topicName,
        );

        const thisTopicData =
          targetLanguageLoadedContentState[thisTopicDataIndex];

        const thisTopicUpdateContent = thisTopicData.content.map(
          sentenceData => {
            if (sentenceData.id === sentenceId) {
              return {
                ...sentenceData,
                ...resObj,
              };
            }
            return sentenceData;
          },
        );

        const newTopicState = {
          ...thisTopicData,
          content: thisTopicUpdateContent,
        };

        const filteredTopics = targetLanguageLoadedContentState.map(topic => {
          if (topic.title !== topicName) {
            return topic;
          }
          return newTopicState;
        });
        settargetLanguageLoadedContentState(filteredTopics);
        setUpdatePromptState(`${topicName} updated!`);
        setTimeout(() => setUpdatePromptState(''), 3000);
        setTriggerSentenceIdUpdate(sentenceId);
      }
    } catch (error) {
      console.log('## updateSentenceData', {error});
    }
  };

  if (
    !data ||
    targetLanguageLoadedContentState?.length === 0 ||
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

  const targetLanguageLoadedWords = [
    ...data?.targetLanguageLoadedWords,
    ...newWordsAdded,
  ];

  const topicKeys = targetLanguageLoadedContentState.map(
    topicData => topicData.title,
  );
  const snippetsForSelectedTopic = targetLanguageSnippetsState?.filter(
    item => item.topicName === selectedTopic || item.topicName === selectedSong,
  );

  const songData = targetLanguageLoadedSongsState?.find(
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

  // quickFix
  const hasAudioCheck = topicKey =>
    targetLanguageLoadedContentState.some(
      key => key.title === topicKey && key.hasAudio,
    );

  const isDueReviewSingular = ({topicOption, isReview}) => {
    const thisData = targetLanguageLoadedContentState.find(
      topicDisplayed => topicDisplayed.title === topicOption,
    );

    const nextReview = thisData?.nextReview;

    return isUpForReview({nextReview, todayDate: today});
    // then check if is upcoming
  };

  const isNeedsFutureReview = ({topicOption, singular}) => {
    const isHobbies = topicOption === 'hobbies-01';
    if (singular) {
      const thisData = targetLanguageLoadedContentState.find(
        topicDisplayed => topicDisplayed.title === topicOption,
      );

      const nextReview = thisData?.nextReview;

      const res = checkIsFutureReviewNeeded({nextReview, todayDate: today});
      if (isHobbies) {
        console.log('## ', {res});
      }
      return res;
    }

    const nextReviewDateDueForGeneralTopicDue =
      targetLanguageLoadedContentState.some(jpContent => {
        const generalTopicName = getGeneralTopicName(jpContent.title);

        if (generalTopicName === topicOption) {
          const nextReview = jpContent?.nextReview;
          return checkIsFutureReviewNeeded({nextReview, todayDate: today});
        }
      });

    return nextReviewDateDueForGeneralTopicDue;
  };

  const isDueReview = (topicOption, singular, isReview) => {
    if (singular) {
      return isDueReviewSingular({topicOption, isReview});
    }
    // change to forLoop
    const nextReviewDateDueForGeneralTopicDue =
      targetLanguageLoadedContentState.some(jpContent => {
        const generalTopicName = getGeneralTopicName(jpContent.title);

        if (generalTopicName === topicOption) {
          const nextReview = jpContent?.nextReview;
          return isUpForReview({nextReview, todayDate: today});
        }
      });

    return nextReviewDateDueForGeneralTopicDue;
  };

  const isCoreContent = (topicOption, singular) => {
    if (singular) {
      const thisData = targetLanguageLoadedContentState.find(
        topicDisplayed => topicDisplayed.title === topicOption,
      );

      const thisDataIsCoreStatus = thisData?.isCore;
      return thisDataIsCoreStatus;
    }

    return targetLanguageLoadedContentState.some(jpContent => {
      if (jpContent.title.split('-').slice(0, -1).join('-') === topicOption) {
        const isCoreStatus = jpContent?.isCore;
        return isCoreStatus;
      }
    });
  };

  const showNaviBtn = !(generalTopicState || selectedSong || selectedTopic);

  return (
    <SafeAreaView style={{backgroundColor: '#D3D3D3', minHeight: '100%'}}>
      {updatePromptState ? (
        <ToastMessage toastText={updatePromptState} />
      ) : null}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        {selectedSong || selectedTopic || generalTopicState === '' ? null : (
          <MoreTopics handleShowGeneralTopic={handleShowGeneralTopic} />
        )}
        {showNaviBtn ? (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 20,
                paddingVertical: 10,
                paddingHorizontal: 15,
                margin: 5,
                backgroundColor: 'transparent',
              }}
              onPress={() => navigation.navigate('DifficultSentences')}>
              <Text style={{textAlign: 'center'}}>Sentences 🤓🏋🏽‍♂️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 20,
                paddingVertical: 10,
                paddingHorizontal: 15,
                margin: 5,
                backgroundColor: 'transparent',
              }}
              onPress={() => navigation.navigate('WordStudy')}>
              <Text style={{textAlign: 'center'}}>Words 🤓🏋🏽‍♂️</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {!generalTopicState && !selectedSong && (
          <GeneralTopics
            handleShowGeneralTopic={handleShowGeneralTopic}
            generalTopicObjKeys={generalTopicObjKeys}
            isDueReview={isDueReview}
            isCoreContent={isCoreContent}
            isNeedsFutureReview={isNeedsFutureReview}
          />
        )}
        {!topicOrSongSelected || showOtherTopics ? (
          <TopicsToDisplay
            topicsToDisplay={topicsToDisplay}
            isDueReview={isDueReview}
            isCoreContent={isCoreContent}
            handleShowTopic={handleShowTopic}
            hasAudioCheck={hasAudioCheck}
            isNeedsFutureReview={isNeedsFutureReview}
          />
        ) : null}
        <SongSection
          topicOrSongSelected={topicOrSongSelected}
          generalTopicState={generalTopicState}
          targetLanguageLoadedSongsState={targetLanguageLoadedSongsState}
          showOtherTopics={showOtherTopics}
          topicsToStudyState={topicsToStudyState}
          selectedTopic={selectedTopic}
          handleShowMusic={handleShowMusic}
        />

        <View>
          {selectedTopic ? (
            <TopicComponent
              topicName={selectedTopic}
              targetLanguageLoadedContent={targetLanguageLoadedContentState}
              pureWordsUnique={getPureWords()}
              structuredUnifiedData={structuredUnifiedData}
              setStructuredUnifiedData={setStructuredUnifiedData}
              targetLanguageLoadedWords={targetLanguageLoadedWords}
              addSnippet={addSnippet}
              snippetsForSelectedTopic={snippetsForSelectedTopic}
              removeSnippet={removeSnippet}
              saveWordFirebase={saveWordFirebase}
              handleOtherTopics={handleOtherTopics}
              hasWordsToStudy={topicsToStudyState[selectedTopic]}
              targetLanguageWordsToStudyState={targetLanguageWordsToStudyState}
              getThisTopicsWordsFunc={getThisTopicsWordsFunc}
              updateTopicMetaData={updateTopicMetaData}
              updateSentenceData={updateSentenceData}
              triggerSentenceIdUpdate={triggerSentenceIdUpdate}
              setTriggerSentenceIdUpdate={setTriggerSentenceIdUpdate}
            />
          ) : selectedSong ? (
            <SongComponent
              topicName={selectedSong}
              pureWordsUnique={getPureWords()}
              structuredUnifiedData={structuredUnifiedData}
              setStructuredUnifiedData={setStructuredUnifiedData}
              targetLanguageLoadedWords={targetLanguageLoadedWords}
              snippetsForSelectedTopic={snippetsForSelectedTopic}
              addSnippet={addSnippet}
              removeSnippet={removeSnippet}
              saveWordFirebase={saveWordFirebase}
              topicData={formattedContent}
              handleOtherTopics={handleOtherTopics}
              targetLanguageWordsToStudyState={targetLanguageWordsToStudyState}
              hasWordsToStudy={topicsToStudyState[selectedSong]}
              getThisTopicsWordsFunc={getThisTopicsWordsFunc}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;
