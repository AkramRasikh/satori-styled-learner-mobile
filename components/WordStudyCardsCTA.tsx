import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const WordStudyCardsCTA = ({
  dueCardsState,
  handleShowDueCards,
  handleShowNewRandomCards,
}) => {
  const hasDueCards = dueCardsState.length > 0;
  const btnTxt = hasDueCards
    ? `Due Cards: ${dueCardsState.length}`
    : 'New cards';
  const onPress = hasDueCards ? handleShowDueCards : handleShowNewRandomCards;
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
      }}>
      <TouchableOpacity
        style={{
          backgroundColor: '#CCCCCC',
          borderColor: 'black',
          borderRadius: 10,
          padding: 10,
        }}
        onPress={onPress}>
        <Text>{btnTxt}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default WordStudyCardsCTA;
