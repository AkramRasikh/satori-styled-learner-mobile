import React, {View} from 'react-native';
import SwitchButton from './SwitchButton';
import {Text, DefaultTheme} from 'react-native-paper';

export const SettingBlock = ({func, bool, text}) => {
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
  engMaster,
  setEngMaster,
  isVideoModeState,
  hasVideo,
  handleVideoMode,
  isAutoScrollingMode,
  setisAutoScrollingMode,
  showOnlyReviewState,
  setShowOnlyReviewState,
  dueSentences,
}) => {
  let defaultSettingsArr = [
    {func: setEngMaster, bool: engMaster, text: 'Eng Master'},
    {
      func: setisAutoScrollingMode,
      bool: isAutoScrollingMode,
      text: 'Auto scroll',
    },
  ];

  if (hasVideo) {
    defaultSettingsArr.push({
      func: handleVideoMode,
      bool: isVideoModeState,
      text: '🎥',
    });
  }

  if (dueSentences) {
    defaultSettingsArr.push({
      func: setShowOnlyReviewState,
      bool: showOnlyReviewState,
      text: 'fitler',
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
