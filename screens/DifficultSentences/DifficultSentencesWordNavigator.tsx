import React, {View} from 'react-native';
import {FAB, MD2Colors} from 'react-native-paper';
import TopicListButton from '../../components/TopicListButton';

const DifficultSentencesWordNavigator = ({
  handleNavigationToWords,
  numberOfWords,
  includeWordsState,
  setIncludeWordsState,
  includeContentState,
  setIncludeContentState,
  includeSnippetsState,
  setIncludeSnippetsState,
}) => {
  const label = `Words (${numberOfWords})`;
  return (
    <View>
      <View
        style={{
          marginTop: 5,
          alignSelf: 'flex-start',
          gap: 5,
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        <TopicListButton
          label={`Words ${includeWordsState ? '✅' : '❌'}`}
          onPress={() => setIncludeWordsState(!includeWordsState)}
        />
        <TopicListButton
          label={`Content ${includeContentState ? '✅' : '❌'}`}
          onPress={() => setIncludeContentState(!includeContentState)}
        />
        <TopicListButton
          label={`Snippets ${includeSnippetsState ? '✅' : '❌'}`}
          onPress={() => setIncludeSnippetsState(!includeSnippetsState)}
        />
      </View>

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
      </View>
    </View>
  );
};

export default DifficultSentencesWordNavigator;
