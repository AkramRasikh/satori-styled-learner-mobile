import {Text, View} from 'react-native';

const SnippetTimeRange = ({pointInAudio, duration}) => {
  return (
    <View
      style={{
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>
        {pointInAudio.toFixed(2)} ➾ {(pointInAudio + duration).toFixed(2)}
      </Text>
    </View>
  );
};

export default SnippetTimeRange;
