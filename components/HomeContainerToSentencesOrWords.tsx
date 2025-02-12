import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';
import useLanguageSelector from '../context/LanguageSelector/useLanguageSelector';

export const languageEmojiKey = {
  japanese: '🇯🇵',
  chinese: '🇨🇳',
};

const HomeContainerToSentencesOrWords = ({navigation}) => {
  const {languageSelectedState} = useLanguageSelector();
  const emojiFlag = languageEmojiKey[languageSelectedState];
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
        Sentences 🤓{emojiFlag}
      </Button>
      <Button mode="elevated" onPress={() => navigation.navigate('WordStudy')}>
        Words 🤓{emojiFlag}
      </Button>
    </View>
  );
};

export default HomeContainerToSentencesOrWords;
