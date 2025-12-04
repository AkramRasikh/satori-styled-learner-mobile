import React, {useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';
import {FocusedTextHighlighted} from '../DifficultSentencesSnippet';
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
}) => {
  const [isCollapsingState, setIsCollapsingState] = useState(false);
  const [matchedWordListState, setMatchedWordListState] = useState([]);

  const focusedText = item.focusedText;
  const targetLang = item.targetLang;
  const baseLang = item.baseLang;

  const {getThisSentencesWordList} = useData();
  const timeNow = new Date();

  const reviewData = item?.reviewData;

  const {againText, hardText, goodText, easyText, nextScheduledOptions} =
    srsCalculationAndText({
      reviewData,
      contentType: srsRetentionKeyTypes.snippet,
      timeNow,
    });

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
        <FocusedTextHighlighted
          focusedText={focusedText}
          targetLang={targetLang}
        />
        <Text>{baseLang}</Text>
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
