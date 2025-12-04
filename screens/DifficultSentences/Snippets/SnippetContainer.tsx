import React, {useEffect, useMemo, useRef, useState} from 'react';
import {PanResponder, Text, View} from 'react-native';
import useData from '../../../context/Data/useData';
import DifficultSentenceMappedWords from '../../../components/DifficultSentence/DifficultSentenceMappedWords';
import SRSTogglesScaled from '../../../components/SRSTogglesScaled';
import {
  isMoreThanADayAhead,
  setToFiveAM,
  srsRetentionKeyTypes,
} from '../../../srs-algo';
import {srsCalculationAndText} from '../../../utils/srs/srs-calculation-and-text';
import FlashCardLoadingSpinner from '../../../components/FlashCard/FlashCardLoadingSpinner';
import {Divider, IconButton} from 'react-native-paper';
import TextSegment from '../../../components/TextSegment';
import {translateText} from '../../../api/google-translate';
import useLanguageSelector from '../../../context/LanguageSelector/useLanguageSelector';
import HighlightTextZone from '../../../components/HighlightTextZone';
import {DoubleClickButton} from '../../../components/Button';

function highlightApprox(
  fullText,
  slicedText,
  startIndexKeyState,
  endIndexKeyState,
) {
  function findApproxIndex(text, query) {
    // If exact match exists, return it
    const exact = text.indexOf(query);
    if (exact !== -1) return exact;

    // Otherwise fuzzy: sliding window + similarity scoring
    let bestIndex = 0;
    let bestScore = 0;

    const qLen = query.length;

    for (let i = 0; i <= text.length - qLen; i++) {
      const chunk = text.slice(i, i + qLen);

      // similarity = proportion of matching characters
      let score = 0;
      for (let j = 0; j < qLen; j++) {
        if (chunk[j] === query[j]) score++;
      }
      score = score / qLen;

      if (score > bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    return bestScore > 0.4 ? bestIndex : -1;
    // threshold can be tuned
  }

  const index = findApproxIndex(fullText, slicedText);
  if (index === -1) return fullText; // no suitable match

  const match = fullText.slice(
    index + startIndexKeyState,
    index + endIndexKeyState + slicedText.length,
  );

  return {
    textMatch: match,
    matchStartKey: index + startIndexKeyState,
    matchEndKey: index + endIndexKeyState + slicedText.length,
  };
}

const SnippetContainer = ({
  item,
  isPlaying,
  setIsPlaying,
  soundRef,
  updateContentSnippetsDataScreenLevel,
  isLoaded,
  setSelectedIndexState,
  selectedIndexState,
  playThisSnippet,
  underlineWordsInSentence,
}) => {
  const [isCollapsingState, setIsCollapsingState] = useState(false);
  const [matchedWordListState, setMatchedWordListState] = useState([]);
  const [startIndexKeyState, setStartIndexKeyState] = useState(0);
  const [isLoadingSaveSnippetState, setIsLoadingSaveSnippetState] =
    useState(false);
  const [endIndexKeyState, setEndIndexKeyState] = useState(0);
  const [quickTranslationArr, setQuickTranslationArr] = useState([]);
  const [isHighlightMode, setHighlightMode] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);

  const {languageSelectedState} = useLanguageSelector();
  const focusedText = item.focusedText || item.suggestedFocusText;

  const targetLang = item.targetLang;
  const isPreSnippet = item?.isPreSnippet;
  const baseLang = item.baseLang;

  const snippetMovementChanged =
    endIndexKeyState !== 0 || startIndexKeyState !== 0;

  const {getThisSentencesWordList} = useData();
  const timeNow = new Date();

  const reviewData = item?.reviewData;

  const onMoveLeft = () => {
    setStartIndexKeyState(startIndexKeyState - 1);
    setEndIndexKeyState(endIndexKeyState - 1);
  };

  const onMoveRight = () => {
    setStartIndexKeyState(startIndexKeyState + 1);
    setEndIndexKeyState(endIndexKeyState + 1);
  };

  const onReset = () => {
    setStartIndexKeyState(0);
    setEndIndexKeyState(0);
  };

  const {textMatch, matchStartKey, matchEndKey} = useMemo(() => {
    return highlightApprox(
      targetLang,
      focusedText,
      startIndexKeyState,
      endIndexKeyState,
    );
  }, [targetLang, startIndexKeyState, endIndexKeyState, focusedText]);

  const handleQuickGoogleTranslate = async text => {
    const result = await translateText({
      text,
      language: languageSelectedState,
    });
    setQuickTranslationArr(prev => [...prev, result]);
  };

  const {againText, hardText, goodText, easyText, nextScheduledOptions} =
    srsCalculationAndText({
      reviewData,
      contentType: srsRetentionKeyTypes.snippet,
      timeNow,
    });

  function expandWordsIntoChunks(words) {
    let globalIdx = 0;

    return words.flatMap(word => {
      const underline = word.style?.textDecorationLine === 'underline';

      return word.text.split('').map((char, index) => {
        const chunk = {
          text: char,
          style: word.style,
          index: globalIdx,
        };

        // Only if this word has underline, attach its full text
        if (underline) {
          chunk.originalText = word.text;
        }

        globalIdx++;
        return chunk;
      });
    });
  }

  const handleSettingHighlightmode = () => {
    setHighlightMode(!isHighlightMode);
  };

  const displayedText = useMemo(() => {
    const textSegments = underlineWordsInSentence(targetLang);

    const granularFormattedSentence = expandWordsIntoChunks(textSegments);

    return (
      <DoubleClickButton onPress={handleSettingHighlightmode}>
        <TextSegment
          textSegments={granularFormattedSentence}
          matchStartKey={matchStartKey}
          matchEndKey={matchEndKey}
        />
      </DoubleClickButton>
    );
  }, [targetLang, underlineWordsInSentence, matchStartKey, matchEndKey]);

  useEffect(() => {
    const matchedWordList = getThisSentencesWordList(focusedText).map(
      (item, index) => ({
        ...item,
        colorIndex: index,
      }),
    );
    setMatchedWordListState(matchedWordList);
  }, [focusedText]);

  const stopAudioOnUnmount = () => {
    if (isPlaying && soundRef?.current) {
      soundRef?.current.stop(() => {
        setIsPlaying(false);
      });
    }
  };

  const handleNextReview = async difficulty => {
    try {
      stopAudioOnUnmount();
      const nextReviewData = nextScheduledOptions[difficulty].card;
      const isMoreThanADayAheadBool = isMoreThanADayAhead(
        nextReviewData.due,
        new Date(),
      );

      const formattedToBe5am = isMoreThanADayAheadBool
        ? {...nextReviewData, due: setToFiveAM(nextReviewData.due)}
        : nextReviewData;

      setIsCollapsingState(true);
      await updateContentSnippetsDataScreenLevel({
        snippetId: item.id,
        fieldToUpdate: {reviewData: formattedToBe5am},
        contentIndex: item.contentIndex,
      });
      if (soundRef?.current) {
        soundRef?.current.stop(() => {
          setIsPlaying(false);
        });
      }
    } catch (error) {
    } finally {
      setIsCollapsingState(false);
    }
  };

  const quickDeleteFunc = async () => {
    try {
      stopAudioOnUnmount();
      setIsCollapsingState(true);
      await updateContentSnippetsDataScreenLevel({
        snippetId: item.id,
        contentIndex: item.contentIndex,
        isRemove: true,
      });
      if (soundRef?.current) {
        soundRef?.current.stop(() => {
          setIsPlaying(false);
        });
      }
    } catch (error) {
    } finally {
      // setIsLoadingState(false);
      setIsCollapsingState(false);
    }
  };

  const onUpdateSnippet = async () => {
    if (!textMatch) {
      return;
    }
    try {
      setIsLoadingSaveSnippetState(true);
      await updateContentSnippetsDataScreenLevel({
        snippetId: item.id,
        fieldToUpdate: {isPreSnippet: false, focusedText: textMatch},
        contentIndex: item.contentIndex,
      });
    } catch (error) {
      console.log('## onUpdateSnippet error', error);
    } finally {
      setIsLoadingSaveSnippetState(false);
    }
  };

  const handlePlayThisSnippet = () => {
    if (selectedIndexState === item.id && isPlaying) {
      stopAudioOnUnmount();
    } else if (selectedIndexState === item.id && !isPlaying) {
      playThisSnippet(item.time);
    } else {
      setSelectedIndexState(item.id);
      playThisSnippet(item.time);
    }
  };

  const thisIsPlaying = item.id === selectedIndexState && isLoaded && isPlaying;
  const hasQuickTranslation = quickTranslationArr.length > 0;

  const swipeDistance = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        swipeDistance.current = 0;
        return Math.abs(gestureState.dx) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        swipeDistance.current += gestureState.dx; // Accumulate swipe distance
      },
    }),
  ).current;

  const spreadHandler = isHighlightMode ? {} : panResponder.panHandlers;

  const hideAllTogetherStateMemoized = useMemo(() => {
    if (isCollapsingState) {
      return setTimeout(() => true, 400);
    }
    return false;
  }, [isCollapsingState]);

  if (hideAllTogetherStateMemoized) {
    return null;
  }
  if (isCollapsingState) {
    return <FlashCardLoadingSpinner />;
  }

  return (
    <View>
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            marginBottom: 10,
          }}>
          {isHighlightMode ? (
            <View {...spreadHandler}>
              <HighlightTextZone
                id={item.id}
                text={targetLang}
                highlightedIndices={highlightedIndices}
                setHighlightedIndices={setHighlightedIndices}
                saveWordFirebase={() => {}}
                setHighlightMode={setHighlightMode}
                handleQuickGoogleTranslate={handleQuickGoogleTranslate}
              />
            </View>
          ) : (
            <Text>{displayedText}</Text>
          )}
          <Text>{baseLang}</Text>
          {hasQuickTranslation && (
            <View style={{gap: 5, marginVertical: 5}}>
              {quickTranslationArr.map((translationItem, key) => {
                const countNumber = key + 1 + ') ';
                return (
                  <View key={key}>
                    <Text>
                      {countNumber}
                      {translationItem.text}, {translationItem.transliteration}
                      {', '}
                      {translationItem.translation}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
          {isPreSnippet && (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 5,
                justifyContent: 'center',
              }}>
              <IconButton
                onPress={onMoveLeft}
                icon="arrow-left-bold"
                size={15}
              />
              <IconButton onPress={onReset} icon="undo-variant" size={15} />
              <IconButton
                onPress={onMoveRight}
                icon="arrow-right-bold"
                size={15}
              />
              <IconButton
                onPress={onUpdateSnippet}
                disabled={!snippetMovementChanged || isLoadingSaveSnippetState}
                icon="content-save"
                containerColor={
                  isLoadingSaveSnippetState
                    ? 'red'
                    : snippetMovementChanged
                    ? '#FFBF00'
                    : ''
                }
                size={15}
              />
            </View>
          )}
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}>
          <IconButton
            icon={thisIsPlaying ? 'pause' : 'play'}
            mode="outlined"
            size={20}
            onPress={handlePlayThisSnippet}
          />
          <SRSTogglesScaled
            handleNextReview={handleNextReview}
            againText={againText}
            hardText={hardText}
            goodText={goodText}
            easyText={easyText}
            fontSize={10}
            quickDeleteFunc={quickDeleteFunc}
          />
        </View>
        <View style={{width: '100%'}}>
          {matchedWordListState.map((item, index) => {
            return (
              <DifficultSentenceMappedWords
                key={index}
                item={item}
                handleSelectWord={() => {}}
                deleteWord={() => {}}
                handleUpdateWordFinal={() => {}}
                indexNum={index}
                combineWordsListState={[]}
                setCombineWordsListState={() => {}}
              />
            );
          })}
        </View>
      </View>
      <Divider bold style={{marginTop: 5}} />
    </View>
  );
};

export default SnippetContainer;
