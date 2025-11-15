import React, {View} from 'react-native';
import TopicListButton from '../../components/TopicListButton';
import {useState} from 'react';
import AreYouSurePrompt from '../../components/AreYouSurePrompt';

const SpecificTopicContainer = ({
  generalTopic,
  numberOfSentences,
  handleShowThisTopicsSentences,
  selectedGeneralTopicState,
  handleLongPressTopics,
}) => {
  const [areYouSurePromptOpen, setAreYouSurePromptOpen] = useState(false);

  const isSelected = generalTopic === selectedGeneralTopicState;
  const label = `${generalTopic.slice(0, 30)} (${numberOfSentences})`;
  const shadowStyles = areYouSurePromptOpen
    ? {
        shadowOffset: {
          width: 3,
          height: 3,
        },
        shadowColor: 'grey',
        shadowOpacity: 1,
      }
    : {};
  return (
    <View
      style={{
        display: 'flex',
        gap: 5,
        ...shadowStyles,
      }}>
      <TopicListButton
        onLongPress={() => setAreYouSurePromptOpen(true)}
        label={label}
        onPress={() => handleShowThisTopicsSentences(generalTopic)}
        isSelected={isSelected}
      />
      {areYouSurePromptOpen && (
        <AreYouSurePrompt
          yesOnPress={() => handleLongPressTopics(generalTopic)}
          yesText={'remove!'}
          noText={'cancel'}
          noOnPress={() => setAreYouSurePromptOpen(false)}
        />
      )}
    </View>
  );
};

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
        return (
          <SpecificTopicContainer
            key={generalTopic}
            generalTopic={generalTopic}
            numberOfSentences={numberOfSentences}
            handleShowThisTopicsSentences={handleShowThisTopicsSentences}
            selectedGeneralTopicState={selectedGeneralTopicState}
            handleLongPressTopics={handleLongPressTopics}
          />
        );
      })}
    </View>
  );
};

export default DifficultSentencesTopics;
