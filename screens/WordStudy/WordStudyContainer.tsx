import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {getGeneralTopicName} from '../../utils/get-general-topic-name';

function WordStudyContainer({
  navigation,
  japaneseWordsState,
  japaneseAdhocLoadedSentences,
  japaneseLoadedContent,
}): React.JSX.Element {
  const [tagsState, setTagsState] = useState([]);
  const [generalTopicState, setGeneralTopicState] = useState([]);
  const [wordStudyState, setWordStudyState] = useState([]);

  useEffect(() => {
    const tagsAvailable = [];
    const generalTopics = [];
    const wordsForState = [];

    const formattedJapaneseWordData = japaneseWordsState.map(wordData => {
      const thisWordsContext = wordData.contexts;

      const contextData = [];

      thisWordsContext.forEach(contextId => {
        japaneseLoadedContent.forEach(contentData => {
          const content = contentData.content;
          const generalTopicTitle = getGeneralTopicName(contentData.title);
          const tags = content?.tags;

          const contextIdMatchesSentence = content.find(
            contentSentence => contentSentence.id === contextId,
          );
          if (contextIdMatchesSentence) {
            contextData.push({
              ...contextIdMatchesSentence,
              title: generalTopicTitle,
              tags,
            });
            generalTopics.push(generalTopicTitle);

            if (tags) {
              tagsAvailable.push(tags);
            }
          }
        });
        // conditionally
        japaneseAdhocLoadedSentences.forEach(adhocSentenceData => {
          const generalTopicTitle = adhocSentenceData.topic;
          const tags = adhocSentenceData?.tags;

          const adhocSentenceDataId = adhocSentenceData.id;

          const matchingContextID = contextId === adhocSentenceDataId;

          if (matchingContextID) {
            contextData.push({
              ...adhocSentenceData,
              title: generalTopicTitle,
              tags,
            });
            generalTopics.push(generalTopicTitle);

            if (tags) {
              tagsAvailable.push(...tags); // in array
            }
          }
        });
      });

      return {
        ...wordData,
        contextData,
      };
    });
    setWordStudyState(formattedJapaneseWordData);
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: '#D3D3D3', minHeight: '100%'}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        <View>
          <Text>SIuuuuu</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default WordStudyContainer;
