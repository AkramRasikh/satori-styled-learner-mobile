import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useFormatWordsToStudy from '../../hooks/useFormatWordsToStudy';
import AnimatedModal from '../../components/WordModal';
import {makeArrayUnique} from '../../hooks/useHighlightWordToWordBank';

function WordStudyContainer({
  navigation,
  japaneseWordsState,
  japaneseAdhocLoadedSentences,
  japaneseLoadedContent,
}): React.JSX.Element {
  const [tagsState, setTagsState] = useState([]);
  const [generalTopicState, setGeneralTopicState] = useState([]);
  const [wordStudyState, setWordStudyState] = useState([]);
  const [selectedTopicWords, setSelectedTopicWords] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedWord, setSelectedWord] = useState();

  const wordCategories = makeArrayUnique([...tagsState, ...generalTopicState]);

  useFormatWordsToStudy({
    japaneseWordsState,
    setWordStudyState,
    setTagsState,
    setGeneralTopicState,
    japaneseLoadedContent,
    japaneseAdhocLoadedSentences,
  });

  const handleOpenWordInfo = selectedWordOnClick => {
    setSelectedWord(selectedWordOnClick);
  };

  const handleShowThisCategoriesWords = category => {
    const thisCategoriesWords = wordStudyState.filter(wordData =>
      wordData.thisWordsCategories.some(
        oneCategory => oneCategory === category,
      ),
    );
    setSelectedTopicWords(thisCategoriesWords);
    setSelectedTopic(category);
  };

  const hasSelectedTopicWords = selectedTopic && selectedTopicWords?.length > 0;

  return (
    <SafeAreaView style={{backgroundColor: '#D3D3D3', minHeight: '100%'}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{padding: 10}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 5,
          }}>
          {!hasSelectedTopicWords &&
            wordCategories?.map((wordCategory, index) => {
              return (
                <View
                  key={index}
                  style={{
                    borderBlockColor: 'black',
                    borderWidth: 2,
                    padding: 5,
                    borderRadius: 5,
                  }}>
                  <TouchableOpacity
                    onPress={() => handleShowThisCategoriesWords(wordCategory)}>
                    <Text>{wordCategory}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: 'black',
            marginVertical: 10,
          }}
        />
        {hasSelectedTopicWords ? (
          <View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
                flexWrap: 'wrap',
              }}>
              <View
                style={{
                  alignSelf: 'center',
                }}>
                <Text>{selectedTopic}:</Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: 'gray',
                  padding: 5,
                  borderRadius: 5,
                }}
                onPress={() => setSelectedTopic('')}>
                <Text>Show More</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 5,
              }}>
              {selectedTopicWords?.map((wordData, index) => {
                const listTextNumber = index + 1 + ') ';
                return (
                  <View
                    key={wordData.id}
                    style={{
                      borderBlockColor: 'black',
                      borderWidth: 2,
                      padding: 5,
                      borderRadius: 5,
                    }}>
                    <TouchableOpacity
                      onPress={() => handleOpenWordInfo(wordData)}>
                      <Text>
                        {listTextNumber}
                        {wordData.baseForm}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}
      </ScrollView>
      {selectedWord && (
        <AnimatedModal
          visible={selectedWord}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </SafeAreaView>
  );
}

export default WordStudyContainer;
