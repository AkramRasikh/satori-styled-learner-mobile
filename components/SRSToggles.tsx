import {Button, Text, View} from 'react-native';
import {
  getEmptyCard,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../srs-algo';
import useData from '../context/Data/useData';
import {useState} from 'react';
import {getTimeDiffSRS} from '../utils/getTimeDiffSRS';

const SRSToggles = ({reviewData, id, baseForm, limitedOptionsMode}) => {
  const [nextReviewDateState, setNextReviewDateState] = useState('');
  const timeNow = new Date();
  const hasDueDate = reviewData?.due ? new Date(reviewData?.due) : null; // check if due yet

  const cardDataRelativeToNow = hasDueDate ? reviewData : getEmptyCard();
  const data = useData();
  const updateWordData = data.updateWordData;

  const nextScheduledOptions = getNextScheduledOptions({
    card: cardDataRelativeToNow,
    contentType: srsRetentionKeyTypes.vocab,
  });
  const againDue = nextScheduledOptions['1'].card.due;
  const hardDue = nextScheduledOptions['2'].card.due;
  const goodDue = nextScheduledOptions['3'].card.due;
  const easyDue = nextScheduledOptions['4'].card.due;

  const handleNextReview = async difficulty => {
    const nextReviewData = nextScheduledOptions[difficulty].card;
    try {
      await updateWordData({
        wordId: id,
        wordBaseForm: baseForm,
        fieldToUpdate: {reviewData: nextReviewData},
      });
      setNextReviewDateState(nextReviewData.due);
    } catch (error) {
      console.log('## handleNextReview', {error});
    }
  };

  const hasDueDateInFuture = new Date(hasDueDate) > timeNow;
  const againText = getTimeDiffSRS({dueTimeStamp: againDue, timeNow}) as string;
  const hardText = getTimeDiffSRS({dueTimeStamp: hardDue, timeNow}) as string;
  const goodText = getTimeDiffSRS({dueTimeStamp: goodDue, timeNow}) as string;
  const easyText = getTimeDiffSRS({dueTimeStamp: easyDue, timeNow}) as string;

  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {nextReviewDateState ? (
          <Text>
            {getTimeDiffSRS({dueTimeStamp: nextReviewDateState, timeNow})}
          </Text>
        ) : hasDueDateInFuture ? (
          <Text>
            Due in {getTimeDiffSRS({dueTimeStamp: hasDueDate, timeNow})}
          </Text>
        ) : (
          <>
            {!limitedOptionsMode && (
              <>
                <View>
                  <Button
                    title={againText}
                    onPress={() => handleNextReview('1')}
                  />
                </View>
                <View>
                  <Button
                    title={hardText}
                    onPress={() => handleNextReview('2')}
                  />
                </View>
              </>
            )}
            <View>
              <Button title={goodText} onPress={() => handleNextReview('3')} />
            </View>
            <View>
              <Button title={easyText} onPress={() => handleNextReview('4')} />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default SRSToggles;
