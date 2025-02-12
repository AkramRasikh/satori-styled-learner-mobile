import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {DefaultTheme, Text} from 'react-native-paper';
import {languageEmojiKey} from '../../../components/HomeContainerToSentencesOrWords';
import LanguageFlag from '../components/LanguageFlag';
import useLanguageSelector from '../../../context/LanguageSelector/useLanguageSelector';

const LanguagesAvailable = ({handleLanguageSelection}) => {
  const {languageSelectedState, languagesAvailable} = useLanguageSelector();

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
      }}>
      <Text style={DefaultTheme.fonts.labelMedium}>Options:</Text>
      {languagesAvailable.map(item => {
        if (item !== languageSelectedState) {
          const emojiFlag = languageEmojiKey[item];

          return (
            <TouchableOpacity
              key={item}
              onPress={async () => {
                await handleLanguageSelection(item);
              }}>
              <LanguageFlag text={emojiFlag} />
            </TouchableOpacity>
          );
        }
        return null;
      })}
    </View>
  );
};

export default LanguagesAvailable;
