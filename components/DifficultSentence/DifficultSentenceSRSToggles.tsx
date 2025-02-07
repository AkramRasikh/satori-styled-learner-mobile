import React, {View} from 'react-native';
import {srsRetentionKeyTypes} from '../../srs-algo';
import useDifficultSentenceContext from './context/useDifficultSentence';
import SRSTogglesScaled from '../SRSTogglesScaled';
import {srsCalculationAndText} from '../../utils/srs/srs-calculation-and-text';

const DifficultSentenceSRSToggles = ({reviewData}) => {
  const {handleNextReview} = useDifficultSentenceContext();
  const timeNow = new Date();

  const {againText, hardText, goodText, easyText} = srsCalculationAndText({
    reviewData,
    contentType: srsRetentionKeyTypes.sentences,
    timeNow,
  });

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
      />
    </View>
  );
};
export default DifficultSentenceSRSToggles;
