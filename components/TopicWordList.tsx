import {View, Text} from 'react-native';

const TopicWordList = ({thisTopicsWords}) => {
  const getThisTopicsWordsEach = word => {
    const surfaceForm = word.surfaceForm;
    const baseForm = word.baseForm;
    const phonetic = word.phonetic;
    const definition = word.definition;
    return surfaceForm + ', ' + baseForm + ', ' + phonetic + ', ' + definition;
  };

  return (
    <View>
      {thisTopicsWords?.map((topicsWords, index) => {
        const listNumber = index + 1 + ') ';
        return (
          <View
            key={index}
            style={{
              padding: 5,
            }}>
            <Text>
              {listNumber}
              {getThisTopicsWordsEach(topicsWords)}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default TopicWordList;
