import {Text, TouchableOpacity, View} from 'react-native';

const MoreTopics = ({handleShowGeneralTopic}) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => handleShowGeneralTopic('')}
        style={{
          backgroundColor: '#CCCCCC',
          borderColor: 'black',
          borderRadius: 10,
          padding: 10,
        }}>
        <Text>More Topics</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MoreTopics;
