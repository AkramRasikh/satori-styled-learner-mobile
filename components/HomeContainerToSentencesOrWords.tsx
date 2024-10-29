import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';

const HomeContainerToSentencesOrWords = ({navigation}) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
    }}>
    <TouchableOpacity
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: '#999999',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 5,
        backgroundColor: 'transparent',
      }}
      onPress={() => navigation.navigate('DifficultSentences')}>
      <Text style={{textAlign: 'center'}}>Sentences 🤓🏋🏽‍♂️</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={{
        flex: 1,
        borderWidth: 1,
        borderColor: '#999999',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 5,
        backgroundColor: 'transparent',
      }}
      onPress={() => navigation.navigate('WordStudy')}>
      <Text style={{textAlign: 'center'}}>Words 🤓🏋🏽‍♂️</Text>
    </TouchableOpacity>
  </View>
);

export default HomeContainerToSentencesOrWords;
