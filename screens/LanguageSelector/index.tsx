import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import useLanguageSelector from '../../context/Data/useLanguageSelector';
import {LanguageEnum} from '../../context/Data/LanguageSelectorProvider';
import {clearStorage} from '../../api/load-content';

const LanguageSelector = ({navigation}): React.JSX.Element => {
  const {setLanguageSelectedState} = useLanguageSelector();
  const handleLanguageSelection = (selectedLanguage: LanguageEnum) => {
    setLanguageSelectedState(selectedLanguage);
    navigation.navigate('Home');
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
            onPress={() => handleLanguageSelection(LanguageEnum.Chinese)}>
            <Image
              style={{height: 100, resizeMode: 'contain'}}
              source={require(`../../assets/images/chinese-flag.png`)}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => handleLanguageSelection(LanguageEnum.Japanese)}>
            <Image
              style={{height: 100, resizeMode: 'contain'}}
              source={require(`../../assets/images/japanese-flag.png`)}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 40,
            backgroundColor: 'grey',
            padding: 10,
            borderRadius: 10,
          }}>
          <TouchableOpacity onPress={clearStorage}>
            <Text>Clear Storage 🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LanguageSelector;
