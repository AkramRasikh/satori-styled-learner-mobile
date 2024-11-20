import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import LoadingScreen from '../../components/LoadingScreen';
import PillButton from '../../components/PillButton';
import ScreenContainerComponent from '../../components/ScreenContainerComponent';
import useLoadDifficultSentences from '../../hooks/useLoadDifficultSentences';
import useData from '../../context/Data/useData';
import DifficultSentenceMapContainer from '../../components/DifficultSentenceMapContainer';

const todayDateObj = new Date();

const DifficultSentencesContainer = ({navigation}): React.JSX.Element => {
  const [difficultSentencesState, setDifficultSentencesState] = useState([]);
  const [toggleableSentencesState, setToggleableSentencesState] = useState([]);
  const [sentenceBeingHighlightedState, setSentenceBeingHighlightedState] =
    useState('');
  const [isShowDueOnly, setIsShowDueOnly] = useState(false);

  const {
    updateSentenceData,
    updatePromptState,
    addSnippet,
    removeSnippet,
    pureWords,
    adhocTargetLanguageSentencesState,
    targetLanguageLoadedContentMasterState,
    targetLanguageSnippetsState,
  } = useData();

  const {getAllDataReady} = useLoadDifficultSentences({
    adhocTargetLanguageSentencesState,
    targetLanguageLoadedContentMasterState,
    targetLanguageSnippetsState,
  });

  const showDueInit = arr => {
    const filteredForDueOnly = [...arr].filter(sentence => {
      if (sentence?.nextReview) {
        return sentence.nextReview < todayDateObj;
      } else {
        return new Date(sentence?.reviewData?.due) < todayDateObj;
      }
    });
    if (filteredForDueOnly?.length > 0) {
      setToggleableSentencesState(filteredForDueOnly);
      setIsShowDueOnly(!isShowDueOnly);
    } else {
      setToggleableSentencesState(difficultSentencesState);
    }
  };

  const handleRemoveSnippet = async ({snippetId, sentenceId}) => {
    const deletedSnippetId = await removeSnippet({
      snippetId,
      sentenceId,
    });
    if (deletedSnippetId) {
      const updatedDifficultSentencesWithSnippet = difficultSentencesState.map(
        diffSentence => {
          if (diffSentence.id === sentenceId) {
            const hasSnippets = diffSentence?.snippets?.length > 0;
            return {
              ...diffSentence,
              snippets: hasSnippets
                ? diffSentence.snippets.filter(
                    nestedSnippet => nestedSnippet.id !== deletedSnippetId,
                  )
                : [],
            };
          }
          return diffSentence;
        },
      );

      setDifficultSentencesState(updatedDifficultSentencesWithSnippet);
      if (isShowDueOnly) {
        const updatedDueSentencesWithSnippets = toggleableSentencesState.map(
          diffSentence => {
            if (diffSentence.id === sentenceId) {
              const hasSnippets = diffSentence?.snippets?.length > 0;
              return {
                ...diffSentence,
                snippets: hasSnippets
                  ? diffSentence.snippets.filter(
                      nestedSnippet => nestedSnippet.id !== deletedSnippetId,
                    )
                  : [],
              };
            }
            return diffSentence;
          },
        );
        setToggleableSentencesState(updatedDueSentencesWithSnippets);
      }
    }
  };

  const updateNestedSnippetData = (diffSentence, snippetDataFromAPI) => {
    const hasSnippets = diffSentence?.snippets?.length > 0;

    const updatedSnippets = hasSnippets
      ? [...diffSentence.snippets, {...snippetDataFromAPI, saved: true}]
      : [{...snippetDataFromAPI, saved: true}];

    return {
      ...diffSentence,
      snippets: updatedSnippets,
    };
  };

  const handleAddSnippet = async snippetData => {
    const snippetDataFromAPI = await addSnippet(snippetData);
    if (snippetDataFromAPI) {
      const thisSnippetsSentence = snippetDataFromAPI.sentenceId;
      const updatedDifficultSentencesWithSnippet = difficultSentencesState.map(
        diffSentence => {
          if (diffSentence.id === thisSnippetsSentence) {
            return updateNestedSnippetData(diffSentence, snippetDataFromAPI);
          }
          return diffSentence;
        },
      );
      setDifficultSentencesState(updatedDifficultSentencesWithSnippet);
      if (isShowDueOnly) {
        const updatedDueSentencesWithSnippets = toggleableSentencesState.map(
          diffSentence => {
            if (diffSentence.id === thisSnippetsSentence) {
              return updateNestedSnippetData(diffSentence, snippetDataFromAPI);
            }
            return diffSentence;
          },
        );
        setToggleableSentencesState(updatedDueSentencesWithSnippets);
      }
    }
  };

  const updateSentenceDataScreenLevel = async ({
    isAdhoc,
    topicName,
    sentenceId,
    fieldToUpdate,
    contentIndex,
  }) => {
    const isRemoveFromDifficultSentences =
      !isAdhoc && fieldToUpdate?.nextReview === null;

    const updateDataRes = await updateSentenceData({
      isAdhoc,
      topicName,
      sentenceId,
      fieldToUpdate,
      contentIndex,
    });
    if (updateDataRes) {
      setToggleableSentencesState(prev =>
        prev.filter(sentenceData => sentenceData.id !== sentenceId),
      );
      if (isRemoveFromDifficultSentences) {
        const updatedDifficultSentences = difficultSentencesState.filter(
          sentenceData => sentenceData.id !== sentenceId,
        );
        setDifficultSentencesState(updatedDifficultSentences);
      } else {
        const updatedDifficultSentences = difficultSentencesState.map(
          sentenceData => {
            if (sentenceData.id === sentenceId) {
              return {
                ...sentenceData,
                ...updateDataRes,
              };
            }
            return sentenceData;
          },
        );
        setDifficultSentencesState(updatedDifficultSentences);
      }
    }
  };

  const showDueOnlyFunc = () => {
    if (!isShowDueOnly) {
      showDueInit(toggleableSentencesState);
    } else {
      setToggleableSentencesState(difficultSentencesState);
      setIsShowDueOnly(!isShowDueOnly);
    }
  };

  useEffect(() => {
    const difficultSentencesData = getAllDataReady();
    if (difficultSentencesData?.length > 0) {
      setDifficultSentencesState(difficultSentencesData);
      showDueInit(difficultSentencesData);
    }
  }, []);

  if (difficultSentencesState.length === 0) {
    return <LoadingScreen>Getting ready!</LoadingScreen>;
  }

  return (
    <ScreenContainerComponent
      updatePromptState={updatePromptState}
      marginBottom={30}>
      <View style={{padding: 10, paddingBottom: 30}}>
        <View>
          <Text>
            Difficult Sentences: ({toggleableSentencesState.length}/
            {difficultSentencesState.length})
          </Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: 5,
          }}>
          <PillButton
            isShowDueOnly={isShowDueOnly}
            showDueOnlyFunc={showDueOnlyFunc}
          />
        </View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{paddingBottom: 30}}>
          <DifficultSentenceMapContainer
            toggleableSentencesState={toggleableSentencesState}
            addSnippet={handleAddSnippet}
            updateSentenceData={updateSentenceDataScreenLevel}
            removeSnippet={handleRemoveSnippet}
            pureWords={pureWords}
            sentenceBeingHighlightedState={sentenceBeingHighlightedState}
            setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
            navigation={navigation}
          />
        </ScrollView>
      </View>
    </ScreenContainerComponent>
  );
};

export default DifficultSentencesContainer;
