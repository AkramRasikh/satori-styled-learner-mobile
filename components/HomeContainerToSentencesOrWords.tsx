import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';
import useDifficultSentences from '../context/DifficultSentences/useDifficultSentencesProvider';

export const languageEmojiKey = {
  japanese: '🇯🇵',
  chinese: '🇨🇳',
};

const HomeContainerToSentencesOrWords = ({navigation}) => {
  const {difficultSentencesState} = useDifficultSentences();

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: 10,
        paddingBottom: 10,
      }}>
      <Button
        mode="elevated"
        onPress={() => navigation.navigate('DifficultSentences')}>
        Sentences ({difficultSentencesState.length})
      </Button>
      <Button mode="elevated" onPress={() => navigation.navigate('WordStudy')}>
        Words
      </Button>
    </View>
  );
};

export default HomeContainerToSentencesOrWords;
