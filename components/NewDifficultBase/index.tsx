import React, {TouchableOpacity, Text, View} from 'react-native';
import {
  Button,
  DefaultTheme,
  IconButton,
  MD2Colors,
  MD3Colors,
  ProgressBar,
} from 'react-native-paper';
import DifficultSentenceTextContainer from '../DifficultSentence/DifficultSentenceTextContainer';
import {useState} from 'react';
import useHighlightWordToWordBank from '../../hooks/useHighlightWordToWordBank';
import useData from '../../context/Data/useData';
import TextSegment from '../TextSegment';
import {
  getCardDataRelativeToNow,
  getDueDate,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../../srs-algo';
import {getTimeDiffSRS} from '../../utils/getTimeDiffSRS';

const props = {
  toggleableSentencesStateLength: 30,
  addSnippet: () => {},
  updateSentenceData: () => {},
  removeSnippet: () => {},
  setSentenceBeingHighlightedState: () => {},
  updatingSentenceState: () => {},
  setSliceArrState: () => {},
  deleteWord: () => {},
  realCapacity: 100,
  sentenceBeingHighlightedState: '',
  navigation: {},
  baseLang: 'The most important thing for Japan in the Meiji era.',
  contentIndex: 25,
  generalTopic: 'meiji-era-intro',
  id: '4321434a-2e92-47e7-bafb-b10da8c38140',
  isCore: undefined,
  isMediaContent: true,
  reviewData: {
    difficulty: 4.12000823,
    due: '2025-01-29T16:34:19.994Z',
    ease: 2.5,
    elapsed_days: 37,
    interval: 0,
    lapses: 0,
    last_review: '2024-12-26T16:34:19.994Z',
    reps: 6,
    scheduled_days: 34,
    stability: 128.83281866,
    state: 2,
  },
  targetLang: 'まず何よりも大切だったことは国としての独立を維持強化すること',
  time: 6,
  tokenised: [
    'まず',
    '何',
    'より',
    'も',
    '大切',
    'だっ',
    'た',
    'こと',
    'は',
    '国',
    'として',
    'の',
    '独立',
    'を',
    '維持',
    '強化',
    'する',
    'こと',
  ],
  topic: 'meiji-era-intro-1',
};

const DueColorMarker = ({dueColorState}) => (
  <View
    style={{
      backgroundColor: dueColorState,
      width: 16,
      height: 16,
      borderRadius: 10,
      marginVertical: 'auto',
    }}
  />
);

const NewSRSToggles = ({sentence, updateSentenceData, contentIndex}) => {
  const timeNow = new Date();

  const reviewData = sentence?.reviewData;
  const isAdhoc = sentence?.isAdhoc;

  const hasDueDate = getDueDate(reviewData);

  const nextReview = sentence?.nextReview;
  const reviewHistory = sentence?.reviewHistory;

  const hasLegacyReviewSystem = !reviewData?.due && nextReview;

  const cardDataRelativeToNow = getCardDataRelativeToNow({
    hasDueDate,
    reviewData,
    nextReview,
    reviewHistory,
  });

  const getShouldRemoveLegacyFields = () => {
    if (hasLegacyReviewSystem) {
      return {
        nextReview: null,
        reviewHistory: null,
      };
    }
    return {};
  };

  const handleClose = async () => {
    // setShowReviewSettings(true);
    // if (deleteFix) {
    //   const hasBeenUpdated = await updateSentenceData({
    //     isAdhoc,
    //     topicName: sentence.topic,
    //     sentenceId: sentence.id,
    //     fieldToUpdate: {
    //       reviewData: null,
    //       ...getShouldRemoveLegacyFields(),
    //     },
    //     contentIndex: contentIndex ?? sentence.contentIndex,
    //   });
    //   if (hasBeenUpdated) {
    //     setShowReviewSettings(false);
    //   }
    // }
  };

  const nextScheduledOptions = getNextScheduledOptions({
    card: cardDataRelativeToNow,
    contentType: srsRetentionKeyTypes.sentences,
  });
  const againDue = nextScheduledOptions['1'].card.due;
  const hardDue = nextScheduledOptions['2'].card.due;
  const goodDue = nextScheduledOptions['3'].card.due;
  const easyDue = nextScheduledOptions['4'].card.due;

  const handleNextReview = async difficulty => {
    // const nextReviewData = nextScheduledOptions[difficulty].card;
    // const hasBeenUpdated = await updateSentenceData({
    //   isAdhoc,
    //   topicName: sentence.topic,
    //   sentenceId: sentence.id,
    //   fieldToUpdate: {
    //     reviewData: nextReviewData,
    //     ...getShouldRemoveLegacyFields(),
    //   },
    //   contentIndex: contentIndex ?? sentence.contentIndex,
    // });
    // if (hasBeenUpdated) {
    //   setShowReviewSettings(false);
    // }
  };

  const againText = getTimeDiffSRS({dueTimeStamp: againDue, timeNow}) as string;
  const hardText = getTimeDiffSRS({dueTimeStamp: hardDue, timeNow}) as string;
  const goodText = getTimeDiffSRS({dueTimeStamp: goodDue, timeNow}) as string;
  const easyText = getTimeDiffSRS({dueTimeStamp: easyDue, timeNow}) as string;

  const handleSRSClick = () => {};
  // mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';

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
          onPress={handleSRSClick}
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
          onPress={handleSRSClick}
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
          onPress={handleSRSClick}
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
          onPress={handleSRSClick}
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

const ProgressBarComponent = ({progress = 0.5}) => {
  const audioProgressText = '4.20/30';

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
        <ProgressBar progress={progress} style={{marginVertical: 5}} />
      </View>
      <View>
        <Text>{audioProgressText}</Text>
      </View>
    </View>
  );
};

const TextActionContainer = () => {
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
        onPress={() => {}}
      />
      <IconButton
        icon="format-color-highlight"
        mode="outlined"
        size={15}
        onPress={() => {}}
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
        onPress={() => {}}
      />
    </View>
  );
};
const AudioControls = () => {
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      <IconButton icon="rewind" mode="outlined" size={15} onPress={() => {}} />
      <IconButton icon="play" mode="outlined" size={15} onPress={() => {}} />
      <IconButton
        icon="fast-forward"
        mode="outlined"
        size={15}
        onPress={() => {}}
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

const TopHeader = ({handleClickDelete, handleNavigateToTopic}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5,
          alignItems: 'center',
        }}>
        <DueColorMarker dueColorState={'#FFBF00'} />
        <TouchableOpacity onPress={handleNavigateToTopic}>
          <Text
            style={{
              textDecorationLine: 'underline',
              fontStyle: 'italic',
            }}>
            {props.topic}
          </Text>
        </TouchableOpacity>
      </View>
      <IconButton
        icon="delete"
        containerColor={MD3Colors.error50}
        iconColor={MD2Colors.white}
        size={20}
        onPress={handleClickDelete}
      />
    </View>
  );
};
const NewDifficultBase = () => {
  const [sentenceBeingHighlightedState, setSentenceBeingHighlightedState] =
    useState('');

  const [highlightedIndices, setHighlightedIndices] = useState([]);

  const {pureWords} = useData();
  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: pureWords,
  });
  const handleClickDelete = () => {
    console.log('## handleClickDelete');
  };
  const handleNavigateToTopic = () => {
    console.log('## handleClickDelete');
  };
  const safeTextFunc = targetLang => {
    const textSegments = underlineWordsInSentence(targetLang);
    return <TextSegment textSegments={textSegments} />;
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        marginBottom: 100,
      }}>
      <TopHeader
        handleClickDelete={handleClickDelete}
        handleNavigateToTopic={handleNavigateToTopic}
      />
      <DifficultSentenceTextContainer
        targetLang={props.targetLang}
        baseLang={props.baseLang}
        sentenceBeingHighlightedState={sentenceBeingHighlightedState}
        setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
        sentenceId={props.id}
        safeTextFunc={safeTextFunc}
        highlightedIndices={highlightedIndices}
        setHighlightedIndices={setHighlightedIndices}
        saveWordFirebase={() => {}}
      />
      <NewSRSToggles
        sentence={props}
        updateSentenceData={props.updateSentenceData}
        contentIndex={props.contentIndex}
      />
      <ProgressBarComponent />
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}>
        <TextActionContainer />
        <View
          style={{
            backgroundColor: DefaultTheme.colors?.backdrop,
            width: 1,
            borderRadius: 5,
          }}
        />
        <AudioControls />
      </View>
    </View>
  );
};

export default NewDifficultBase;
