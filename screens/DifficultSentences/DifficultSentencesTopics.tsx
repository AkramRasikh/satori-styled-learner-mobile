import React, {Text, TouchableOpacity, View} from 'react-native';

const DifficultSentencesTopics = ({
  generalTopicsAvailableState,
  handleShowThisTopicsSentences,
  selectedGeneralTopicState,
}) => (
  <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
    {Object.entries(generalTopicsAvailableState).map(
      ([generalTopic, numberOfSentences]) => {
        return (
          <View
            key={generalTopic}
            style={{
              backgroundColor:
                generalTopic === selectedGeneralTopicState ? '#ff9999' : 'grey',
              margin: 5,
              padding: 5,
              borderRadius: 5,
            }}>
            <TouchableOpacity
              onPress={() => handleShowThisTopicsSentences(generalTopic)}>
              <Text>
                {generalTopic} ({numberOfSentences})
              </Text>
            </TouchableOpacity>
          </View>
        );
      },
    )}
  </View>
);

export default DifficultSentencesTopics;
