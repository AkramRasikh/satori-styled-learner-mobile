import React, {Text, TouchableOpacity, View} from 'react-native';
import {useEffect, useState} from 'react';
import DifficultSentenceTextContainer from './DifficultSentence/DifficultSentenceTextContainer';
import {getDueDateText} from '../utils/get-date-due-status';
import useData from '../context/Data/useData';
import {SRSTogglesQuickComprehensiveDiffSentencesWords} from './SRSToggles';
import useHighlightWordToWordBank from '../hooks/useHighlightWordToWordBank';
import {checkOverlap} from '../utils/check-word-overlap';
import DifficultSentenceTitleAndStatus from './DifficultSentence/DifficultSentenceTitleAndStatus';
import DifficultSentenceActions from './DifficultSentence/DifficultSentenceActions';
import Clipboard from '@react-native-clipboard/clipboard';
import useOpenGoogleTranslate from './useOpenGoogleTranslate';
import AreYouSureSection from './AreYouSureSection';
import DifficultSentenceAudio from './DifficultSentence/DifficultSentenceAudioSection';

const NestedwordsWithHyphens = ({
  segment,
  nestedCoordinates,
  colorIndex,
  getHexCode,
}) => {
  const [textWidth, setTextWidth] = useState(0);

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          maxWidth: textWidth,
        }}>
        {nestedCoordinates.map(item => {
          return (
            <Text
              key={item}
              style={{
                color: getHexCode(item),
                fontSize: 8,
                fontWeight: 'bold',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              ({item + 1})
            </Text>
          );
        })}
      </View>
      <Text
        style={{
          ...segment.style,
          fontSize: 20,
          lineHeight: 24,
          color: getHexCode(colorIndex),
        }}
        onLayout={event => {
          const {width} = event.nativeEvent.layout;
          setTextWidth(width);
        }}>
        {segment.text}
      </Text>
    </View>
  );
};

const getHexCode = index => {
  const hexCodeArr = [
    '#E04E2E', //- Muted Orange-Red
    '#D6AB00', //- Soft Yellow
    '#2EBF4D', //- Calmer Green
    '#2D4FCB', //- Mellow Blue
    '#E02C8E', //- Gentle Pink
    '#2EDBC8', //- Subtle Aqua
    '#E07A2E', //- Soft Warm Orange
    '#9E2CCE', //- Muted Purple
    '#E02C2C', //- Softer Red
    '#2ECC70', //- Subdued Mint Green
  ];

  return hexCodeArr[index % hexCodeArr.length];
};

const DifficultSentenceWidget = ({
  sentence,
  updateSentenceData,
  dueStatus,
  addSnippet,
  removeSnippet,
  pureWords,
  sentenceBeingHighlightedState,
  setSentenceBeingHighlightedState,
  dueDate,
  navigation,
  indexNum,
  handleSelectWord,
  handleWordUpdate,
  deleteWord,
}) => {
  const [showReviewSettings, setShowReviewSettings] = useState(false);
  const [showAllMatchedWordsState, setShowAllMatchedWordsState] =
    useState(false);
  const [matchedWordListState, setMatchedWordListState] = useState([]);
  const [highlightedIndices, setHighlightedIndices] = useState([]);

  const {getThisSentencesWordList} = useData();

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: pureWords,
  });

  const id = sentence.id;
  const topic = sentence.topic;
  const isCore = sentence?.isCore;
  const baseLang = sentence.baseLang;
  const targetLang = sentence.targetLang;
  const numberOfWords = pureWords.length;

  const handleShowAllMatchedWords = () => {
    setShowAllMatchedWordsState(!showAllMatchedWordsState);
  };

  const handleUpdateWordFinal = wordData => {
    handleWordUpdate(wordData);
    const updatedMatchedWordListState = matchedWordListState.map(item => {
      if (item.id === wordData.wordId) {
        console.log('### handleUpdateWordFinal 3');
        return {
          ...item,
          ...wordData.fieldToUpdate,
        };
      }
      return item;
    });
    setMatchedWordListState(updatedMatchedWordListState);
  };

  useEffect(() => {
    const matchedWordList = getThisSentencesWordList(targetLang).map(
      (item, index) => ({
        ...item,
        colorIndex: index,
      }),
    );
    setMatchedWordListState(matchedWordList);
  }, [numberOfWords]);

  const handleDeleteContent = () => {
    updateSentenceData({
      isAdhoc: sentence?.isAdhoc,
      topicName: sentence.topic,
      sentenceId: sentence.id,
      fieldToUpdate: {
        reviewData: null,
        nextReview: null,
        reviewHistory: null,
      },
      contentIndex: sentence?.contentIndex,
    });
    setShowReviewSettings(false);
  };

  const seperatedWords = word => {
    const surfaceForm = word.surfaceForm;
    const baseForm = word.baseForm;
    const phonetic = word.phonetic || word.transliteration;
    const definition = word.definition;

    return surfaceForm + ', ' + baseForm + ', ' + phonetic + ', ' + definition;
  };
  const matchedWordsMap = () => {
    if (matchedWordListState?.length === 0) {
      return null;
    }

    return matchedWordListState.map((item, index) => {
      const noReview = !item?.reviewData;
      return (
        <View
          key={index}
          style={{
            paddingTop: 5,
            borderTopColor: 'gray',
            borderTopWidth: 1,
            gap: 5,
          }}>
          <TouchableOpacity onPress={() => handleSelectWord(item)}>
            <Text>
              <Text
                style={{
                  color: getHexCode(index),
                  fontWeight: 'bold',
                }}>
                ({index + 1 + ') '}
              </Text>
              {seperatedWords(item)} {noReview ? '🆕' : ''}
            </Text>
          </TouchableOpacity>
          {noReview && (
            <SRSTogglesQuickComprehensiveDiffSentencesWords
              id={item.id}
              reviewData={item?.reviewData}
              baseForm={item?.baseForm}
              updateWordData={handleUpdateWordFinal}
              clearBtns={getHexCode(index)}
              deleteWord={async () =>
                await deleteWord({
                  wordId: item.id,
                  wordBaseForm: item.baseForm,
                })
              }
            />
          )}
        </View>
      );
    });
  };

  const getSafeTextDefault = targetText => {
    const textSegments = underlineWordsInSentence(targetText);
    return (
      <Text>
        {textSegments.map((segment, index) => {
          return (
            <Text
              key={index}
              id={segment.id}
              selectable={true}
              style={[
                segment.style,
                {
                  fontSize: 20,
                  lineHeight: 24,
                },
              ]}>
              {segment.text}
            </Text>
          );
        })}
      </Text>
    );
  };

  const getUIWithNestedWords = (nestedCoordinates, segment, colorIndex) => {
    return (
      <NestedwordsWithHyphens
        segment={segment}
        nestedCoordinates={nestedCoordinates}
        colorIndex={colorIndex}
        getHexCode={getHexCode}
      />
    );
  };

  const getSafeText = targetText => {
    if (!showAllMatchedWordsState) {
      return getSafeTextDefault(targetLang);
    }

    const textSegments = underlineWordsInSentence(targetText);
    const wordsInOverlapCheck = checkOverlap(matchedWordListState);
    return (
      <Text>
        {textSegments.map((segment, index) => {
          const isPartOfPerfectlyMatchedWord = wordsInOverlapCheck?.find(
            item =>
              item.surfaceForm === segment.text ||
              item.baseForm === segment.text,
          );
          const isPartOfMatchedWordIndex = wordsInOverlapCheck?.findIndex(
            item =>
              item.surfaceForm === segment.text ||
              item.baseForm === segment.text,
          );

          const thisWordsNestedWords =
            isPartOfPerfectlyMatchedWord &&
            wordsInOverlapCheck?.filter(
              item => item?.nestedIn === isPartOfPerfectlyMatchedWord?.id,
            );

          const nestedCoordinates = thisWordsNestedWords?.map(item => {
            const nestedValueIndex = matchedWordListState.find(nestedItem => {
              if (
                nestedItem.surfaceForm === item.surfaceForm ||
                nestedItem.baseForm === item.baseForm
              ) {
                return true;
              }
              return false;
            });
            return nestedValueIndex.colorIndex;
          });

          return (
            <Text
              key={index}
              id={segment.id}
              selectable={true}
              style={[
                segment.style,
                {
                  fontSize: 20,
                  lineHeight: nestedCoordinates?.length === 0 && 24,
                  color:
                    nestedCoordinates?.length === 0 &&
                    isPartOfMatchedWordIndex > -1
                      ? getHexCode(isPartOfPerfectlyMatchedWord.colorIndex)
                      : 'black',
                },
              ]}>
              {nestedCoordinates?.length > 0
                ? getUIWithNestedWords(
                    nestedCoordinates,
                    segment,
                    isPartOfPerfectlyMatchedWord.colorIndex,
                  )
                : segment.text}
            </Text>
          );
        })}
      </Text>
    );
  };

  const handleNavigation = () => {
    const isSentenceHelper = sentence?.isSentenceHelper;

    if (!isSentenceHelper) {
      navigation.navigate('ContentScreen', {
        selectedTopicIndex: sentence.contentIndex,
        targetSentenceId: sentence.id,
      });
    }
  };

  const handleSettingHighlightmode = () => {
    if (sentence.id === sentenceBeingHighlightedState) {
      setSentenceBeingHighlightedState('');
    } else {
      setSentenceBeingHighlightedState(sentence.id);
    }
  };

  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const handleOpenGoogleTranslate = () => {
    openGoogleTranslateApp(targetLang);
  };

  const {dueColorState} = getDueDateText(dueStatus);

  const handleCopyText = () => {
    Clipboard.setString(targetLang);
  };
  const isDueNow =
    sentence?.nextReview || new Date(sentence.reviewData.due) < new Date();

  return (
    <View
      style={{
        gap: 10,
        marginBottom: 10,
      }}>
      <DifficultSentenceTitleAndStatus
        topic={topic}
        dueColorState={dueColorState}
        isCore={isCore}
        dueText={dueDate}
        handleNavigation={handleNavigation}
      />
      <DifficultSentenceActions
        isDueNow={isDueNow}
        updateSentenceData={updateSentenceData}
        sentence={sentence}
        sentenceBeingHighlightedState={sentenceBeingHighlightedState}
        handleSettingHighlightmode={handleSettingHighlightmode}
        setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
        handleCopyText={handleCopyText}
        handleOpenGoogleTranslate={handleOpenGoogleTranslate}
        setHighlightedIndices={setHighlightedIndices}
        setShowReviewSettings={setShowReviewSettings}
        handleShowWords={handleShowAllMatchedWords}
      />
      {showReviewSettings ? (
        <AreYouSureSection
          handleClose={() => setShowReviewSettings(false)}
          handleYesSure={handleDeleteContent}
        />
      ) : null}
      <DifficultSentenceTextContainer
        targetLang={targetLang}
        baseLang={baseLang}
        sentenceId={id}
        sentenceBeingHighlightedState={sentenceBeingHighlightedState}
        setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
        safeTextFunc={getSafeText}
        highlightedIndices={highlightedIndices}
        setHighlightedIndices={setHighlightedIndices}
      />
      <DifficultSentenceAudio
        sentence={sentence}
        addSnippet={addSnippet}
        removeSnippet={removeSnippet}
        indexNum={indexNum}
      />
      {showAllMatchedWordsState && matchedWordsMap()}
    </View>
  );
};

export default DifficultSentenceWidget;
