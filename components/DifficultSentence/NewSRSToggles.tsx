import React, {View} from 'react-native';
import {Button, DefaultTheme} from 'react-native-paper';
import {
  getCardDataRelativeToNow,
  getDueDate,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../../srs-algo';
import {getTimeDiffSRS} from '../../utils/getTimeDiffSRS';
import useDifficultSentenceContext from '../NewDifficultBase/context/useDifficultSentence';

const NewSRSToggles = ({sentence}) => {
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
export default NewSRSToggles;
