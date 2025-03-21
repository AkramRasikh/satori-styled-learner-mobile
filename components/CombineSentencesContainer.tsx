import React, {View} from 'react-native';
import {Button, Text} from 'react-native-paper';

const CombineSentencesContainer = ({
  combineWordsListState,
  setCombineWordsListState,
  handleExportListToAI,
  isLoading,
}) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      padding: 10,
      alignItems: 'center',
      flexWrap: 'wrap',
      opacity: isLoading ? 0.5 : 1,
    }}>
    <Text>
      {combineWordsListState.map((item, index) => index + 1 + ') ' + item.word)}
    </Text>
    <Button
      onPress={() => {
        setCombineWordsListState([]);
      }}>
      Clear
    </Button>
    <Button onPress={handleExportListToAI}>DeepSeek</Button>
  </View>
);

export default CombineSentencesContainer;
