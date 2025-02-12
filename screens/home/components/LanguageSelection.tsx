import React, {View} from 'react-native';
import LanguageSelected from './LanguageSelected';
import LanguagesAvailable from './LanguagesAvailable';

const LanguageSelection = ({handleLanguageSelection}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
      }}>
      <LanguageSelected />
      <LanguagesAvailable handleLanguageSelection={handleLanguageSelection} />
    </View>
  );
};

export default LanguageSelection;
