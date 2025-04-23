import React, {View} from 'react-native';
import {FAB, MD2Colors} from 'react-native-paper';
import TopicListButton from '../../components/TopicListButton';

const DifficultSentencesWordNavigator = ({
  handleNavigationToWords,
  numberOfWords,
  includeWordsState,
  setIncludeWordsState,
}) => {
  const label = `Words (${numberOfWords})`;
  return (
    <View
      style={{
        marginTop: 5,
        alignSelf: 'flex-start',
        gap: 5,
        display: 'flex',
        flexDirection: 'row',
      }}>
      <FAB
        label={label}
        onPress={handleNavigationToWords}
        customSize={30}
        style={{
          backgroundColor: MD2Colors.green100,
        }}
      />
      <TopicListButton
        label={`With Words ${includeWordsState ? '✅' : '❌'}`}
        onPress={() => setIncludeWordsState(!includeWordsState)}
      />
    </View>
  );
};

export default DifficultSentencesWordNavigator;
