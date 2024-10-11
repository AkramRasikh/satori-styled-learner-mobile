import {Button, Text, View} from 'react-native';
import {
  getEmptyCard,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../srs-algo';
import useData from '../context/Data/useData';
import {useState} from 'react';

const SRSToggles = ({reviewData, id, baseForm}) => {
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

  const getTimeDiff = dueTimeStamp => {
    const timeDifference = dueTimeStamp - timeNow; // Difference in milliseconds
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    if (days) {
      return `${days} days`;
    }

    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );

    if (hours) {
      return `${hours} hrs`;
    }
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    );

    if (minutes) {
      return `${minutes} mins`;
    }
  };

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
  const againText = getTimeDiff(againDue) as string;
  const hardText = getTimeDiff(hardDue) as string;
  const goodText = getTimeDiff(goodDue) as string;
  const easyText = getTimeDiff(easyDue) as string;

  return (
    <View>
      {/* {hasDueDate && (
        <View>
          <Text>Due in {getTimeDiff(hasDueDate)}</Text>
        </View>
      )} */}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {nextReviewDateState ? (
          <Text>Due in {getTimeDiff(nextReviewDateState)}</Text>
        ) : hasDueDateInFuture ? (
          <Text>Due in {getTimeDiff(hasDueDate)}</Text>
        ) : (
          <>
            <View>
              <Button title={againText} onPress={() => handleNextReview('1')} />
            </View>
            <View>
              <Button title={hardText} onPress={() => handleNextReview('2')} />
            </View>
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
