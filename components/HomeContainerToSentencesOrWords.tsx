import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';

const HomeContainerToSentencesOrWords = ({navigation}) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      gap: 10,
      paddingBottom: 10,
    }}>
    <Button
      mode="elevated"
      onPress={() => navigation.navigate('DifficultSentences')}>
      Sentences 🤓🏋🏽‍♂️
    </Button>
    <Button mode="elevated" onPress={() => navigation.navigate('WordStudy')}>
      Words 🤓🏋🏽‍♂️
    </Button>
  </View>
);

export default HomeContainerToSentencesOrWords;
