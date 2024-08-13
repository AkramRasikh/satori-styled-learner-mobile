import React from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import DifficultSentenceWidget from '../../components/DifficultSentenceWidget';

const DifficultSentencesContainer = ({
  difficultSentencesState,
}): React.JSX.Element => {
  return (
    <SafeAreaView style={{backgroundColor: '#D3D3D3', minHeight: '100%'}}>
      <View style={{padding: 10}}>
        <View>
          <Text>Difficult Sentences: ({difficultSentencesState.length})</Text>
        </View>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={{marginTop: 10}}>
            {difficultSentencesState.map(sentence => {
              return (
                <DifficultSentenceWidget
                  key={sentence.id}
                  sentence={sentence}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DifficultSentencesContainer;
