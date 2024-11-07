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
  englishOnly,
  setEnglishOnly,
  isFlowingSentences,
  setIsFlowingSentences,
  engMaster,
  setEngMaster,
  handleIsCore,
  isCore,
}) => {
  const settingsArr = [
    {func: setEnglishOnly, bool: englishOnly, text: 'Eng only'},
    {func: setEngMaster, bool: engMaster, text: 'Eng Master'},
    {
      func: setIsFlowingSentences,
      bool: isFlowingSentences,
      text: isFlowingSentences ? 'Flowing 🏄🏽' : '1 by 1 🧱',
    },
    {func: handleIsCore, bool: isCore, text: 'Core'},
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
