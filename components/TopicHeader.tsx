import {Text, TouchableOpacity, View} from 'react-native';

const TopicHeader = ({topicName, handleOtherTopics}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          margin: 10,
        }}>
        {topicName}
      </Text>
      <View>
        <TouchableOpacity
          onPress={handleOtherTopics}
          style={{
            backgroundColor: '#CCCCCC',
            borderColor: 'black',
            borderRadius: 10,
            padding: 10,
          }}>
          <Text>More Topics</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopicHeader;
