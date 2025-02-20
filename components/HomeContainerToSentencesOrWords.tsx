import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';
import useDifficultSentences from '../context/DifficultSentences/useDifficultSentencesProvider';

export const languageEmojiKey = {
  japanese: '🇯🇵',
  chinese: '🇨🇳',
  arabic: '🇸🇩',
};

const HomeContainerToSentencesOrWords = ({navigation}) => {
  const {difficultSentencesState} = useDifficultSentences();

  return (
    <View
      style={{
        gap: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
      }}>
      <Button
        mode="elevated"
        onPress={() => navigation.navigate('DifficultSentences')}
        style={{
          flex: 1,
        }}>
        Sentences ({difficultSentencesState.length})
      </Button>
      <Button
        mode="elevated"
        onPress={() => navigation.navigate('WordStudy')}
        style={{
          flex: 1,
        }}>
        Words
      </Button>
    </View>
  );
};

export default HomeContainerToSentencesOrWords;
