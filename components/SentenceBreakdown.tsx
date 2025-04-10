import React, {Image, TouchableOpacity, View} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import {getHexCode} from '../utils/get-hex-code';
import {useEffect, useState} from 'react';

const SentenceBreakdown = ({
  vocab,
  sentenceStructure,
  meaning,
  textSegments,
  handleSaveWordInBreakdown,
}) => {
  const [textSegmentSavedWordsState, setTextSegmentSavedWordsState] = useState(
    [],
  );

  useEffect(() => {
    if (textSegments) {
      setTextSegmentSavedWordsState(
        textSegments?.filter(i => i?.id === 'targetWord')?.map(i => i?.text),
      );
    }
  }, [textSegments]);

  return (
    <View
      style={{
        display: 'flex',
        gap: 5,
      }}>
      {vocab.map(({surfaceForm, meaning}, index) => {
        const listNumber = index + 1 + ') ';
        const isLast = index + 1 === vocab.length;
        return (
          <>
            <View
              key={index}
              style={{
                display: 'flex',
                gap: 10,
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                paddingVertical: 5,
                flexWrap: 'wrap',
              }}>
              <Text
                style={{
                  color: getHexCode(index),
                }}>
                {listNumber}
                {surfaceForm}:
              </Text>
              <Text>{meaning}</Text>
              {!textSegmentSavedWordsState.includes(surfaceForm) && (
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 15,
                  }}>
                  <TouchableOpacity
                    onPress={() => handleSaveWordInBreakdown(true)}>
                    <Image
                      source={require('../assets/images/google.png')}
                      style={{width: 16, height: 16}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSaveWordInBreakdown(false)}>
                    <Image
                      source={require('../assets/images/chatgpt.png')}
                      style={{width: 16, height: 16}}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {!isLast && <Divider />}
          </>
        );
      })}
      <Text>{sentenceStructure}</Text>
      <Text>{meaning}</Text>
    </View>
  );
};

export default SentenceBreakdown;
