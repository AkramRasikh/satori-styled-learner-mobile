import React, {View} from 'react-native';
import TopicListButton from '../../components/TopicListButton';

const DifficultSentencesTopics = ({
  generalTopicsAvailableState,
  handleShowThisTopicsSentences,
  selectedGeneralTopicState,
  handleLongPressTopics,
}) => {
  const statesMappedArr = Object.entries(generalTopicsAvailableState);
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
        marginTop: 10,
      }}>
      {statesMappedArr.map(([generalTopic, numberOfSentences]) => {
        const isSelected = generalTopic === selectedGeneralTopicState;
        const label = `${generalTopic} (${numberOfSentences})`;
        return (
          <TopicListButton
            key={generalTopic}
            onLongPress={handleLongPressTopics}
            label={label}
            onPress={() => handleShowThisTopicsSentences(generalTopic)}
            isSelected={isSelected}
          />
        );
      })}
    </View>
  );
};

export default DifficultSentencesTopics;
