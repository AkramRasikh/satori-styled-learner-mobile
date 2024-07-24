import {TouchableOpacity, Text, View} from 'react-native';

const SnippetPlayControls = ({isPlaying, pauseSound, handlePlay}) => {
  return (
    <View
      style={{
        backgroundColor: isPlaying ? 'green' : 'red',
        padding: 10,
        borderRadius: 10,
      }}>
      {isPlaying ? (
        <TouchableOpacity onPress={pauseSound}>
          <Text>⏸️ Pause</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handlePlay}>
          <Text>▶️ Play</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SnippetPlayControls;
