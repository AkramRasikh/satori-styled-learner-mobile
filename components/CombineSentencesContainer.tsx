import React, {View} from 'react-native';
import {ActivityIndicator, Button, Text} from 'react-native-paper';

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
    {isLoading && (
      <ActivityIndicator
        style={{
          position: 'absolute',
          top: '30%',
          zIndex: 100,
          alignSelf: 'center',
          alignContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      />
    )}
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
