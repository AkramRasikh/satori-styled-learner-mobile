import React, {Text, View} from 'react-native';
import SwitchButton from './SwitchButton';
import {DefaultTheme} from 'react-native-paper';

const SettingBlock = ({func, bool, text}) => {
  return (
    <View>
      <Text style={{...DefaultTheme.fonts.labelMedium, alignSelf: 'center'}}>
        {text}
      </Text>
      <SwitchButton isOn={bool} setIsOn={func} />
    </View>
  );
};

const DisplaySettings = ({
  englishOnly,
  setEnglishOnly,
  engMaster,
  setEngMaster,
  handleIsCore,
  isCore,
  isVideoModeState,
  hasVideo,
  handleVideoMode,
}) => {
  let defaultSettingsArr = [
    {func: setEnglishOnly, bool: englishOnly, text: 'Eng only'},
    {func: setEngMaster, bool: engMaster, text: 'Eng Master'},
    {func: handleIsCore, bool: isCore, text: 'Core'},
  ];

  if (hasVideo) {
    defaultSettingsArr.push({
      func: handleVideoMode,
      bool: isVideoModeState,
      text: '🎥',
    });
  }

  return (
    <View
      testID="display-settings"
      style={{
        gap: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}>
      {defaultSettingsArr?.map((settingItem, index) => {
        return <SettingBlock key={index} {...settingItem} />;
      })}
    </View>
  );
};

export default DisplaySettings;
