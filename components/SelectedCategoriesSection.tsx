import React, {View} from 'react-native';
import TopicListButton from './TopicListButton';

const SelectedCategoriesWordsSection = ({
  generalTopicState,
  handleShowThisCategoriesWords,
}) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 5,
    }}>
    {generalTopicState?.map((wordCategory, index) => (
      <TopicListButton
        key={index}
        label={wordCategory}
        onPress={() => handleShowThisCategoriesWords(wordCategory)}
      />
    ))}
  </View>
);

export default SelectedCategoriesWordsSection;
