import React, {Text, View} from 'react-native';
import {
  Button,
  DefaultTheme,
  IconButton,
  ProgressBar,
} from 'react-native-paper';
import {useEffect, useState} from 'react';
import {
  getCardDataRelativeToNow,
  getDueDate,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../../srs-algo';
import {getTimeDiffSRS} from '../../utils/getTimeDiffSRS';
import {useSelector} from 'react-redux';
import useDifficultSentenceContext from './context/useDifficultSentence';
import useSoundHook from '../../hooks/useSoundHook';

export const NewSRSToggles = ({sentence}) => {
  const {handleNextReview} = useDifficultSentenceContext();
  const timeNow = new Date();

  const reviewData = sentence?.reviewData;
  const hasDueDate = getDueDate(reviewData);

  const nextReview = sentence?.nextReview;
  const reviewHistory = sentence?.reviewHistory;

  const cardDataRelativeToNow = getCardDataRelativeToNow({
    hasDueDate,
    reviewData,
    nextReview,
    reviewHistory,
  });

  const nextScheduledOptions = getNextScheduledOptions({
    card: cardDataRelativeToNow,
    contentType: srsRetentionKeyTypes.sentences,
  });
  const againDue = nextScheduledOptions['1'].card.due;
  const hardDue = nextScheduledOptions['2'].card.due;
  const goodDue = nextScheduledOptions['3'].card.due;
  const easyDue = nextScheduledOptions['4'].card.due;

  const againText = getTimeDiffSRS({dueTimeStamp: againDue, timeNow}) as string;
  const hardText = getTimeDiffSRS({dueTimeStamp: hardDue, timeNow}) as string;
  const goodText = getTimeDiffSRS({dueTimeStamp: goodDue, timeNow}) as string;
  const easyText = getTimeDiffSRS({dueTimeStamp: easyDue, timeNow}) as string;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
      }}>
      <View style={{display: 'flex', flexDirection: 'row', gap: 5}}>
        <Button
          onPress={() => handleNextReview('1')}
          compact
          mode="outlined"
          buttonColor="transparent"
          textColor={DefaultTheme.colors.onSurface}
          labelStyle={{
            fontSize: 12,
          }}>
          {againText}
        </Button>
        <Button
          onPress={() => handleNextReview('2')}
          compact
          mode="outlined"
          buttonColor="transparent"
          textColor={DefaultTheme.colors.onSurface}
          labelStyle={{
            fontSize: 12,
          }}>
          {hardText}
        </Button>
        <Button
          onPress={() => handleNextReview('3')}
          compact
          mode="outlined"
          buttonColor="transparent"
          textColor={DefaultTheme.colors.onSurface}
          labelStyle={{
            fontSize: 12,
          }}>
          {goodText}
        </Button>
        <Button
          onPress={() => handleNextReview('4')}
          compact
          mode="outlined"
          buttonColor="transparent"
          textColor={DefaultTheme.colors.onSurface}
          labelStyle={{
            fontSize: 12,
          }}>
          {easyText}
        </Button>
      </View>
    </View>
  );
};

export const NewProgressBarComponent = () => {
  const {currentTimeState, soundDuration, isLoaded} =
    useDifficultSentenceContext();

  const progressRate = (isLoaded && currentTimeState / soundDuration) || 0;

  // if (isLoaded) {
  //   console.log('## NewProgressBarComponent', {
  //     currentTimeState,
  //     soundDuration,
  //     isLoaded,
  //   });
  // }

  const audioProgressText = `${currentTimeState?.toFixed(
    2,
  )}/${soundDuration?.toFixed(2)}`;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          width: '75%',
          alignSelf: 'center',
        }}>
        <ProgressBar progress={progressRate} style={{marginVertical: 5}} />
      </View>
      <View>
        <Text>{audioProgressText}</Text>
      </View>
    </View>
  );
};

export const TextActionContainer = ({
  handleSettingHighlightmode,
  isBeingHighlighed,
  handleShowAllMatchedWords,
}) => {
  const {handleCopyText} = useDifficultSentenceContext();

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      <IconButton
        icon="text-search"
        mode="outlined"
        size={15}
        onPress={handleShowAllMatchedWords}
      />
      <IconButton
        icon={isBeingHighlighed ? 'close' : 'format-color-highlight'}
        mode="outlined"
        containerColor={
          isBeingHighlighed && DefaultTheme.colors.tertiaryContainer
        }
        size={15}
        onPress={handleSettingHighlightmode}
      />
      <IconButton
        icon="google-translate"
        mode="outlined"
        size={15}
        onPress={() => {}}
      />
      <IconButton
        icon="content-copy"
        mode="outlined"
        size={15}
        onPress={handleCopyText}
      />
    </View>
  );
};
export const NewAudioControls = ({
  sentence,
  addSnippet,
  removeSnippet,
  indexNum,
}) => {
  const [miniSnippets, setMiniSnippets] = useState([]);

  const {handleLoad, isLoaded, isPlaying, setIsPlaying, soundRef} =
    useDifficultSentenceContext();

  const targetLanguageSnippetsState = useSelector(state => state.snippets);

  const id = sentence.id;

  useEffect(() => {
    setMiniSnippets(
      targetLanguageSnippetsState.filter(
        snippetData => snippetData.sentenceId === id,
      ),
    );
  }, []);

  const {playSound, pauseSound, forwardSound, rewindSound} = useSoundHook({
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName: sentence.topic,
    rewindForwardInterval: 2,
    startTime: sentence?.isMediaContent ? sentence.time : null,
    isMediaContent: sentence?.isMediaContent,
  });

  const handlePlay = () => {
    if (!isLoaded) {
      handleLoad();
    } else {
      if (isPlaying) {
        pauseSound();
      } else {
        playSound();
      }
    }
  };

  // const handleSnippet = currentTime => {
  //   const snippetId = topic + '-' + generateRandomId();
  //   const itemToSave = {
  //     id: snippetId,
  //     sentenceId: id,
  //     pointInAudio: currentTime,
  //     isIsolated: true,
  //     url,
  //     topicName: topic,
  //   };
  //   setMiniSnippets(prev => [...prev, itemToSave]);
  // };

  const playIcon = isLoaded && isPlaying ? 'pause' : 'play';
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      <IconButton
        icon="rewind"
        mode="outlined"
        size={15}
        onPress={rewindSound}
      />
      <IconButton
        icon={playIcon}
        mode="outlined"
        size={15}
        onPress={handlePlay}
      />
      <IconButton
        icon="fast-forward"
        mode="outlined"
        size={15}
        onPress={forwardSound}
      />
      <IconButton
        icon="content-cut"
        mode="outlined"
        size={15}
        onPress={() => {}}
      />
    </View>
  );
};
