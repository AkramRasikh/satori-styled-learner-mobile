import React, {View} from 'react-native';
import {Text} from 'react-native-paper';
import {getHexCode} from '../utils/get-hex-code';

const SentenceBreakdown = ({vocab, sentenceStructure}) => (
  <View>
    {vocab.map(({surfaceForm, meaning}, index) => {
      const listNumber = index + 1 + ') ';
      return (
        <View
          key={index}
          style={{
            display: 'flex',
            gap: 10,
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: getHexCode(index),
            }}>
            {listNumber}
            {surfaceForm}:
          </Text>
          <Text>{meaning}</Text>
        </View>
      );
    })}
    <Text>{sentenceStructure}</Text>
  </View>
);

export default SentenceBreakdown;
