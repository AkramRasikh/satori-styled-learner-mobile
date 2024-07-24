import {TouchableOpacity, Text, View} from 'react-native';

const SnippetTimeChangeHandlers = ({
  handleSetEarlierTime,
  adjustableDuration,
  handleSetDuration,
  adjustableStartTime,
}) => {
  return (
    <View
      style={{
        marginHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => handleSetEarlierTime(false)}>
          <Text>-1 ⏪</Text>
        </TouchableOpacity>
      </View>
      <Text>{adjustableStartTime?.toFixed(2)}</Text>
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => handleSetEarlierTime(true)}>
          <Text>+1 ⏩ </Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, borderLeftWidth: 1, borderLeftColor: 'black'}}>
        <TouchableOpacity onPress={() => handleSetDuration(false)}>
          <Text>(-1)</Text>
        </TouchableOpacity>
      </View>
      <Text>duration: {adjustableDuration}</Text>
      <View style={{flex: 1, borderLeftWidth: 1, borderLeftColor: 'black'}}>
        <TouchableOpacity onPress={() => handleSetDuration(true)}>
          <Text>(+1)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SnippetTimeChangeHandlers;
