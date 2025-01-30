import React, {View} from 'react-native';
import {FAB, MD2Colors} from 'react-native-paper';

const DifficultSentencesTopics = ({
  generalTopicsAvailableState,
  handleShowThisTopicsSentences,
  selectedGeneralTopicState,
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
          <FAB
            label={label}
            onPress={() => handleShowThisTopicsSentences(generalTopic)}
            customSize={30}
            icon={isSelected ? 'check' : ''}
            style={{
              backgroundColor: isSelected ? MD2Colors.purple100 : '',
            }}
          />
        );
      })}
    </View>
  );
};

export default DifficultSentencesTopics;
