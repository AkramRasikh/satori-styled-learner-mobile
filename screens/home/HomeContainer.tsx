import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';

import TopicComponent from '../../components/TopicComponent';
import {makeArrayUnique} from '../../hooks/useHighlightWordToWordBank';
import saveWordAPI from '../../api/save-word';
import useSetupPlayer from '../../hooks/useSetupPlayer';
import {updateCreateReviewHistory} from '../../api/update-create-review-history';
import MoreTopics from '../../components/MoreTopics';
import GeneralTopics from '../../components/GeneralTopics';
import TopicsToDisplay from '../../components/TopicsToDisplay';
import ToastMessage from '../../components/ToastMessage';
import {updateSentenceDataAPI} from '../../api/update-sentence-data';
import {
  checkIsFutureReviewNeeded,
  isUpForReview,
} from '../../utils/is-up-for-review';
import {getGeneralTopicName} from '../../utils/get-general-topic-name';
import useLanguageSelector from '../../context/Data/useLanguageSelector';
import LoadingScreen from '../../components/LoadingScreen';
import HomeContainerToSentencesOrWords from '../../components/HomeContainerToSentencesOrWords';

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
  const [newWordsAdded, setNewWordsAdded] = useState([]);
  const [showOtherTopics, setShowOtherTopics] = useState(true);

  const [
    targetLanguageLoadedContentState,
    settargetLanguageLoadedContentState,
  ] = useState([]);
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
    const targetLanguageLoadedContent = targetLanguageLoadedContentMaster.map(
      item => {
        return {
          generalTopic: item.title.split('-').slice(0, -1).join('-'),
          ...item,
        };
      },
    );
    settargetLanguageLoadedContentState(
      targetLanguageLoadedContent.sort((a, b) => {
        return a.isCore === b.isCore ? 0 : a.isCore ? -1 : 1;
      }),
    );
    setData(results);
  }, []);

  const getPureWords = () => {
    let pureWords = [];
    const targetLanguageLoadedWords = [
      ...data?.targetLanguageLoadedWords,
      ...newWordsAdded,
    ];

    targetLanguageLoadedWords?.forEach(wordData => {
      if (wordData?.baseForm) {
        pureWords.push(wordData.baseForm);
      }
      if (wordData?.surfaceForm) {
        pureWords.push(wordData.surfaceForm);
      }
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

  const handleShowGeneralTopic = generalTopic => {
    setGeneralTopicState(generalTopic);
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
      setUpdatePromptState(`Error saving ${highlightedWord}!`);
      setTimeout(() => setUpdatePromptState(''), 1000);
    }
  };

  const handleOtherTopics = () => {
    setShowOtherTopics(!showOtherTopics);
    setSelectedTopic('');
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
      setUpdatePromptState(`Error updating ${topicName}!`);
      setTimeout(() => setUpdatePromptState(''), 1000);
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

  if (!data || targetLanguageLoadedContentState?.length === 0) {
    return <LoadingScreen>Loading data...</LoadingScreen>;
  }

  const today = new Date();

  const targetLanguageLoadedWords = [
    ...data?.targetLanguageLoadedWords,
    ...newWordsAdded,
  ];

  const snippetsForSelectedTopic = targetLanguageSnippetsState?.filter(
    item => item.topicName === selectedTopic,
  );

  const topicsToDisplay = [];
  const generalTopicObjKeys = [];

  targetLanguageLoadedContentState.forEach(item => {
    if (item?.generalTopic === generalTopicState) {
      topicsToDisplay.push(item.title);
    }
    if (!generalTopicObjKeys.includes(item.generalTopic)) {
      generalTopicObjKeys.push(item.generalTopic);
    }
  });

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
  };

  const isNeedsFutureReview = ({topicOption, singular}) => {
    if (singular) {
      const thisData = targetLanguageLoadedContentState.find(
        topicDisplayed => topicDisplayed.title === topicOption,
      );

      const nextReview = thisData?.nextReview;

      const res = checkIsFutureReviewNeeded({nextReview, todayDate: today});
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

  const isYoutubeVideo = topicOption => {
    return targetLanguageLoadedContentState.some(
      topicDisplayed =>
        topicDisplayed?.origin === 'youtube' &&
        topicDisplayed.title.split('-').slice(0, -1).join('-') === topicOption,
    );
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

  const showNaviBtn = !(generalTopicState || selectedTopic);

  return (
    <SafeAreaView style={{backgroundColor: '#D3D3D3', minHeight: '100%'}}>
      {updatePromptState ? (
        <ToastMessage toastText={updatePromptState} />
      ) : null}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        {selectedTopic || generalTopicState === '' ? null : (
          <MoreTopics handleShowGeneralTopic={handleShowGeneralTopic} />
        )}
        {showNaviBtn ? (
          <HomeContainerToSentencesOrWords navigation={navigation} />
        ) : null}
        {!generalTopicState && (
          <GeneralTopics
            handleShowGeneralTopic={handleShowGeneralTopic}
            generalTopicsToDisplay={generalTopicObjKeys}
            isDueReview={isDueReview}
            isCoreContent={isCoreContent}
            isNeedsFutureReview={isNeedsFutureReview}
            isYoutubeVideo={isYoutubeVideo}
          />
        )}
        {!selectedTopic ? (
          <TopicsToDisplay
            topicsToDisplay={topicsToDisplay}
            isDueReview={isDueReview}
            isCoreContent={isCoreContent}
            handleShowTopic={handleShowTopic}
            hasAudioCheck={hasAudioCheck}
            isNeedsFutureReview={isNeedsFutureReview}
          />
        ) : null}
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
              updateTopicMetaData={updateTopicMetaData}
              updateSentenceData={updateSentenceData}
              triggerSentenceIdUpdate={triggerSentenceIdUpdate}
              setTriggerSentenceIdUpdate={setTriggerSentenceIdUpdate}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Home;
