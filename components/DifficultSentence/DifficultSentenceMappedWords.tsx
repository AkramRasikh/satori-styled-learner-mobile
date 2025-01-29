import React, {Text, TouchableOpacity, View} from 'react-native';
import {SRSTogglesQuickComprehensiveDiffSentencesWords} from '../SRSToggles';
import {getHexCode} from '../../utils/get-hex-code';

const seperatedWords = word => {
  const surfaceForm = word.surfaceForm;
  const baseForm = word.baseForm;
  const phonetic = word.phonetic || word.transliteration;
  const definition = word.definition;

  return surfaceForm + ', ' + baseForm + ', ' + phonetic + ', ' + definition;
};

const DifficultSentenceMappedWords = ({
  item,
  handleSelectWord,
  deleteWord,
  handleUpdateWordFinal,
  indexNum,
}) => {
  const noReview = !item?.reviewData;
  const matchedWordText = `${seperatedWords(item)} ${noReview ? '🆕' : ''}`;

  const numberText = `(${indexNum + 1}) `;
  return (
    <View
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
              color: getHexCode(indexNum),
              fontWeight: 'bold',
            }}>
            {numberText}
          </Text>
          {matchedWordText}
        </Text>
      </TouchableOpacity>
      {noReview && (
        <SRSTogglesQuickComprehensiveDiffSentencesWords
          id={item.id}
          reviewData={item?.reviewData}
          baseForm={item?.baseForm}
          updateWordData={handleUpdateWordFinal}
          clearBtns={getHexCode(indexNum)}
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
};

export default DifficultSentenceMappedWords;
