import {Button, View} from 'react-native';

const SRSToggles = () => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View>
        <Button title="Again" onPress={() => console.log('## Again')} />
      </View>
      <View>
        <Button title="Hard" onPress={() => console.log('## Hard')} />
      </View>
      <View>
        <Button title="Good" onPress={() => console.log('## Good')} />
      </View>
      <View>
        <Button title="Easy 🔥" onPress={() => console.log('## Easy')} />
      </View>
    </View>
  );
};

export default SRSToggles;
