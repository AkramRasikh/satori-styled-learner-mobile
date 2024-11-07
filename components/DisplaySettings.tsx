import React, {Text, TouchableOpacity, View} from 'react-native';
import SwitchButton from './SwitchButton';

const SettingBlock = ({func, bool, text}) => {
  return (
    <View>
      <Text
        style={{
          alignSelf: 'center',
        }}>
        {text}
      </Text>
      <SwitchButton isOn={bool} setIsOn={func} />
    </View>
  );
};

const DisplaySettings = ({
  englishOnly,
  setEnglishOnly,
  isFlowingSentences,
  setIsFlowingSentences,
  engMaster,
  setEngMaster,
  handleIsCore,
  isCore,
  handleAddAdhocSentence,
  isVideoModeState,
  setIsVideoModeState,
  hasVideo,
}) => {
  let defaultSettings = [
    {func: setEnglishOnly, bool: englishOnly, text: 'Eng only'},
    {func: setEngMaster, bool: engMaster, text: 'Eng Master'},
    // {
    //   func: setIsFlowingSentences,
    //   bool: isFlowingSentences,
    //   text: isFlowingSentences ? 'Flowing 🏄🏽' : '1 by 1 🧱',
    // },
    {func: handleIsCore, bool: isCore, text: 'Core'},
  ];

  if (hasVideo) {
    defaultSettings.push({
      func: setIsVideoModeState,
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
      {defaultSettings?.map((settingItem, index) => {
        return <SettingBlock key={index} {...settingItem} />;
      })}
      <View
        style={{
          margin: 10,
        }}>
        <TouchableOpacity
          onPress={handleAddAdhocSentence}
          style={{
            padding: 10,
            backgroundColor: 'grey',
            borderRadius: 50,
          }}>
          <Text>➕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DisplaySettings;
