import {Text, View} from 'react-native';
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
  wordTest,
  setWordTest,
  englishOnly,
  setEnglishOnly,
  setOpenTopicWords,
  openTopicWords,
  isFlowingSentences,
  setIsFlowingSentences,
  engMaster,
  setEngMaster,
}) => {
  const settingsArr = [
    {func: setWordTest, bool: wordTest, text: 'Word hint'},
    {func: setEnglishOnly, bool: englishOnly, text: 'Eng only'},
    {func: setEngMaster, bool: engMaster, text: 'Eng Master'},
    {func: setOpenTopicWords, bool: openTopicWords, text: 'Word list'},
    {
      func: setIsFlowingSentences,
      bool: isFlowingSentences,
      text: isFlowingSentences ? 'Flowing 🏄🏽' : '1 by 1 🧱',
    },
  ];
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
      {settingsArr?.map((settingItem, index) => {
        return <SettingBlock key={index} {...settingItem} />;
      })}
    </View>
  );
};

export default DisplaySettings;
