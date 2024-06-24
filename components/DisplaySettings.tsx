import {Text, View} from 'react-native';
import SwitchButton from './SwitchButton';

const DisplaySettings = ({setSeparateLines, seperateLines}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View>
        <Text>Seperate Lines</Text>
        <SwitchButton isOn={seperateLines} setIsOn={setSeparateLines} />
      </View>
      <View>
        <Text>Show English</Text>
      </View>
    </View>
  );
};

export default DisplaySettings;
