import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

const languageKey = {
  japanese: 'japanese',
  chinese: 'chinese',
};

const LanguageSelector = (): React.JSX.Element => {
  const handleLanguageSelection = selectedLanguage => {
    console.log('## handleLanguageSelection', {selectedLanguage});
  };
  return (
    <View>
      <View
        style={{
          marginTop: 70,
          alignSelf: 'center',
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
        }}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            marginBottom: 20,
          }}>
          Select Language
        </Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignSelf: 'center',
          alignItems: 'center',
          gap: 10,
        }}>
        <View>
          <TouchableOpacity
            onPress={() => handleLanguageSelection(languageKey.chinese)}>
            <Image
              style={{height: 100, resizeMode: 'contain'}}
              source={require(`../../assets/images/chinese-flag.png`)}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => handleLanguageSelection(languageKey.japanese)}>
            <Image
              style={{height: 100, resizeMode: 'contain'}}
              source={require(`../../assets/images/japanese-flag.png`)}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LanguageSelector;
