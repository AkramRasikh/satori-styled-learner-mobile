import React, {View, Text, TouchableOpacity} from 'react-native';

const LongPressedWord = ({getLongPressedWordData, handleRemoveWords}) => {
  return (
    <View
      style={{
        borderTopColor: 'gray',
        borderTopWidth: 2,
        padding: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <Text>{getLongPressedWordData()}</Text>
      <TouchableOpacity onPress={handleRemoveWords}>
        <Text>❌</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LongPressedWord;
