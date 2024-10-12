import {Text, View, TouchableOpacity} from 'react-native';

const SelectedCategoriesWordsSection = ({
  wordCategories,
  handleShowThisCategoriesWords,
}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
      }}>
      {wordCategories?.map((wordCategory, index) => {
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
  );
};

export default SelectedCategoriesWordsSection;
