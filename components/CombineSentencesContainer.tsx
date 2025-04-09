import React, {View} from 'react-native';
import {
  ActivityIndicator,
  Button,
  IconButton,
  MD2Colors,
  MD3Colors,
  Text,
} from 'react-native-paper';

const CombineSentenceWord = ({indexNum, item, setCombineWordsListState}) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    }}>
    <Text>{indexNum + 1 + ') ' + item.word}</Text>
    <IconButton
      icon="minus"
      containerColor={MD3Colors.error30}
      iconColor={MD2Colors.white}
      size={8}
      onPress={() => {
        setCombineWordsListState(prev => prev.filter(i => i.id !== item.id));
      }}
    />
  </View>
);

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
      {combineWordsListState.map((item, index) => (
        <CombineSentenceWord
          key={index}
          setCombineWordsListState={setCombineWordsListState}
          indexNum={index}
          item={item}
        />
      ))}
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
