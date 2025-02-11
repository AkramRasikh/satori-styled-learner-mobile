import React from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import useLanguageSelector from '../../context/LanguageSelector/useLanguageSelector';
import {LanguageEnum} from '../../context/LanguageSelector/LanguageSelectorProvider';
import {clearStorage} from '../../helper-functions/local-storage-utils';
import {Button, DefaultTheme, Text} from 'react-native-paper';
import useData from '../../context/Data/useData';

const LanguageSelector = ({navigation}): React.JSX.Element => {
  const {setLanguageSelectedState} = useLanguageSelector();
  const {fetchData} = useData();
  const handleLanguageSelection = async (selectedLanguage: LanguageEnum) => {
    setLanguageSelectedState(selectedLanguage);
    await fetchData(selectedLanguage);
    navigation.navigate('Home');
  };
  return (
    <View
      style={{
        marginTop: 70,
      }}>
      <Text
        style={{
          ...DefaultTheme.fonts.headlineLarge,
          alignSelf: 'center',
        }}>
        Select Language
      </Text>
      <View
        style={{
          alignItems: 'center',
          gap: 30,
          marginTop: 30,
        }}>
        <TouchableOpacity
          onPress={() => handleLanguageSelection(LanguageEnum.Chinese)}>
          <Image
            style={{height: 100, resizeMode: 'contain'}}
            source={require(`../../assets/images/chinese-flag.png`)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleLanguageSelection(LanguageEnum.Japanese)}>
          <Image
            style={{height: 100, resizeMode: 'contain'}}
            source={require(`../../assets/images/japanese-flag.png`)}
          />
        </TouchableOpacity>
        <Button
          icon="backup-restore"
          mode="contained-tonal"
          onPress={clearStorage}>
          Clear Storage
        </Button>
      </View>
    </View>
  );
};

export default LanguageSelector;
