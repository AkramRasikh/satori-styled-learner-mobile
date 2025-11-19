import React, {TouchableOpacity, View} from 'react-native';
import {getHexCode} from '../../utils/get-hex-code';
import {
  DefaultTheme,
  IconButton,
  MD2Colors,
  MD3Colors,
  Text,
} from 'react-native-paper';

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
  indexNum,
  combineWordsListState,
  setCombineWordsListState,
  deleteWord,
  overrideReview,
  handleUpdateWordFinal,
}) => {
  const noReview = !item?.reviewData;
  const matchedWordText = `${seperatedWords(item)} ${noReview ? '🆕' : ''}`;
  const isInCombineWordList = combineWordsListState?.some(
    i => i.id === item.id,
  );

  const numberText = `(${indexNum + 1}) `;

  const addFlexContainer = {
    display: setCombineWordsListState && 'flex',
    flexDirection: setCombineWordsListState && 'row',
    justifyContent: setCombineWordsListState && 'space-between',
    alignItems: setCombineWordsListState && 'center',
  };

  return (
    <View
      style={{
        paddingTop: 5,
        gap: 5,
        ...addFlexContainer,
      }}>
      <TouchableOpacity
        onPress={() => handleSelectWord?.(item)}
        style={{
          maxWidth: '80%',
        }}>
        <Text style={DefaultTheme.fonts.bodyLarge}>
          <Text
            style={{
              color: getHexCode(indexNum),
              fontWeight: 'bold',
            }}>
            {numberText}
          </Text>
          {matchedWordText}
          <Text style={{fontStyle: 'italic'}}>({item.contexts.length})</Text>
        </Text>
      </TouchableOpacity>
      {setCombineWordsListState && (
        <View style={{}}>
          {isInCombineWordList ? (
            <IconButton
              icon="minus"
              containerColor={MD3Colors.error30}
              iconColor={MD2Colors.white}
              size={10}
              onPress={() => {
                setCombineWordsListState(prev =>
                  prev.filter(i => i.id !== item.id),
                );
              }}
            />
          ) : (
            setCombineWordsListState && (
              <IconButton
                icon="plus"
                containerColor={MD3Colors.tertiary60}
                iconColor={MD2Colors.white}
                size={10}
                onPress={() =>
                  setCombineWordsListState(prev => [
                    ...prev,
                    {
                      id: item.id,
                      word: item.baseForm,
                      definition: item.definition,
                    },
                  ])
                }
              />
            )
          )}
        </View>
      )}
    </View>
  );
};

export default DifficultSentenceMappedWords;
