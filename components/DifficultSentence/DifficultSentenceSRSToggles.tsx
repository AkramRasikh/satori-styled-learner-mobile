import React, {View} from 'react-native';
import {srsRetentionKeyTypes} from '../../srs-algo';
import useDifficultSentenceContext from './context/useDifficultSentence';
import SRSTogglesScaled from '../SRSTogglesScaled';
import {srsCalculationAndText} from '../../utils/srs/srs-calculation-and-text';

const DifficultSentenceSRSToggles = ({reviewData}) => {
  const {handleNextReview, handleDeleteContent, isEasyFollowedByDeletion} =
    useDifficultSentenceContext();
  const timeNow = new Date();

  const {againText, hardText, goodText, easyText, isScheduledForDeletion} =
    srsCalculationAndText({
      reviewData,
      contentType: srsRetentionKeyTypes.sentences,
      timeNow,
    });

  const willBeFollowedByDeletion = isEasyFollowedByDeletion();

  return (
    <View
      style={{
        alignSelf: 'center',
      }}>
      <SRSTogglesScaled
        handleNextReview={handleNextReview}
        againText={againText}
        hardText={hardText}
        goodText={goodText}
        easyText={easyText}
        quickDeleteFunc={isScheduledForDeletion ? handleDeleteContent : null}
        willBeFollowedByDeletion={willBeFollowedByDeletion}
      />
    </View>
  );
};
export default DifficultSentenceSRSToggles;
