import React, {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {Divider, Text} from 'react-native-paper';
import {getHexCode} from '../utils/get-hex-code';
import {Fragment, useEffect, useState} from 'react';

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
  const [isLoadingState, setIsLoadingState] = useState(false);

  const handleSaveWord = async arg => {
    try {
      setIsLoadingState(true);
      await handleSaveWordInBreakdown(arg);
    } catch (error) {
    } finally {
      setIsLoadingState(false);
    }
  };

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
          <Fragment key={index}>
            {isLoadingState && (
              <ActivityIndicator
                style={{
                  position: 'absolute',
                  alignSelf: 'center',
                  top: '30%',
                  left: '50%',
                  zIndex: 100,
                }}
              />
            )}
            <View
              style={{
                display: 'flex',
                gap: 10,
                flexDirection: 'row',
                paddingVertical: 5,
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 10,
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
              {!textSegmentSavedWordsState.includes(surfaceForm) && (
                <>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: 15,
                      opacity: isLoadingState ? 0.5 : 1,
                    }}>
                    <TouchableOpacity
                      disabled={isLoadingState}
                      onPress={async () => {
                        await handleSaveWord({
                          surfaceForm,
                          meaning,
                          isGoogle: true,
                        });
                      }}>
                      <Image
                        source={require('../assets/images/google.png')}
                        style={{width: 16, height: 16}}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={isLoadingState}
                      onPress={async () => {
                        await handleSaveWord({
                          surfaceForm,
                          meaning,
                          isGoogle: true,
                        });
                      }}>
                      <Image
                        source={require('../assets/images/chatgpt.png')}
                        style={{width: 16, height: 16}}
                      />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
            {!isLast && <Divider />}
          </Fragment>
        );
      })}
      <Text>{sentenceStructure}</Text>
      <Text>{meaning}</Text>
    </View>
  );
};

export default SentenceBreakdown;
