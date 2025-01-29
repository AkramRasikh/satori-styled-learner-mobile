import React, {Text, TouchableOpacity, View} from 'react-native';

const DifficultSentencesWordNavigator = ({
  handleNavigationToWords,
  numberOfWords,
}) => (
  <View
    style={{
      alignSelf: 'flex-start',
      backgroundColor: '#90EE90',
      margin: 5,
      padding: 5,
      borderRadius: 5,
    }}>
    <TouchableOpacity onPress={handleNavigationToWords}>
      <Text>Words ({numberOfWords})</Text>
    </TouchableOpacity>
  </View>
);

export default DifficultSentencesWordNavigator;
