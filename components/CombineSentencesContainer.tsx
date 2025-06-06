import React, {TouchableOpacity, View} from 'react-native';
import {
  ActivityIndicator,
  TextInput,
  IconButton,
  MD2Colors,
  MD3Colors,
  Text,
  Divider,
} from 'react-native-paper';

const CombineSentenceWord = ({
  indexNum,
  item,
  setCombineWordsListState,
  handleShowCardInfo,
}) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    }}>
    <TouchableOpacity onPress={() => handleShowCardInfo?.(item)}>
      <Text>{indexNum + 1 + ') ' + item.word}</Text>
    </TouchableOpacity>
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
  combineSentenceContext,
  setCombineSentenceContext,
  handleShowCardInfo,
}) => (
  <View
    style={{
      padding: 10,
    }}>
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
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
            handleShowCardInfo={handleShowCardInfo}
          />
        ))}
      </Text>
      <View
        style={{
          gap: 10,
          display: 'flex',
          flexDirection: 'row',
        }}>
        <IconButton
          icon="delete-sweep"
          mode="outlined"
          containerColor={MD2Colors.red100}
          size={20}
          onPress={() => {
            setCombineWordsListState([]);
          }}
        />
        <IconButton
          icon="rocket-launch-outline"
          mode="outlined"
          size={20}
          containerColor={MD2Colors.blue200}
          iconColor={MD2Colors.white}
          borderless
          onPress={handleExportListToAI}
        />
      </View>
    </View>
    <View>
      <TextInput
        label="Context (optional)"
        value={combineSentenceContext}
        onChangeText={setCombineSentenceContext}
        mode="outlined"
        style={{
          marginBottom: 8,
        }}
      />
    </View>
    <Divider />
  </View>
);

export default CombineSentencesContainer;
