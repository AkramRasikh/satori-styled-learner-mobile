import {View, Text} from 'react-native';

const LongPressedWord = ({getLongPressedWordData}) => {
  return (
    <View
      style={{
        marginBottom: 15,
        borderTopColor: 'gray',
        borderTopWidth: 2,
        padding: 5,
      }}>
      <Text>{getLongPressedWordData()}</Text>
    </View>
  );
};

export default LongPressedWord;
