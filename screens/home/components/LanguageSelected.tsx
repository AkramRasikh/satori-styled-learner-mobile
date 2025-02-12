import React from 'react';
import {View} from 'react-native';
import {DefaultTheme, Text} from 'react-native-paper';
import {languageEmojiKey} from '../../../components/HomeContainerToSentencesOrWords';
import LanguageFlag from '../components/LanguageFlag';
import useLanguageSelector from '../../../context/LanguageSelector/useLanguageSelector';

const LanguageSelected = () => {
  const {languageSelectedState} = useLanguageSelector();
  const text = languageSelectedState
    ? languageEmojiKey[languageSelectedState]
    : '🚫';

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Text style={DefaultTheme.fonts.labelLarge}>Selected: </Text>
      <LanguageFlag text={text} />
    </View>
  );
};

export default LanguageSelected;
