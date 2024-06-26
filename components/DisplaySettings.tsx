import {Text, View} from 'react-native';
import SwitchButton from './SwitchButton';

const DisplaySettings = ({
  setSeparateLines,
  seperateLines,
  wordTest,
  setWordTest,
  englishOnly,
  setEnglishOnly,
  highlightMode,
  setHighlightMode,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View>
        <Text>Seperate</Text>
        <SwitchButton isOn={seperateLines} setIsOn={setSeparateLines} />
      </View>
      <View>
        <Text>Word test</Text>
        <SwitchButton isOn={wordTest} setIsOn={setWordTest} />
      </View>
      <View>
        <Text>English only</Text>
        <SwitchButton isOn={englishOnly} setIsOn={setEnglishOnly} />
      </View>
      <View>
        <Text>Highlight</Text>
        <SwitchButton isOn={highlightMode} setIsOn={setHighlightMode} />
      </View>
    </View>
  );
};

export default DisplaySettings;
