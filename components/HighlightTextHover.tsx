import {useState} from 'react';
import React, {TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Divider, Text} from 'react-native-paper';

const HighlightTextHover = ({
  getHighlightedText,
  handleQuickGoogleTranslate,
  handleClose,
}) => {
  const [isLoadingState, setIsLoadingState] = useState(false);
  const quickTrnaslate = async () => {
    try {
      setIsLoadingState(true);
      await handleQuickGoogleTranslate(getHighlightedText());
    } catch (error) {
    } finally {
      setIsLoadingState(false);
    }
  };
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 2,
        backgroundColor: '#FFFFC5',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 10,
        borderRadius: 10,
      }}>
      <Text style={{fontSize: 20}}>{getHighlightedText()}</Text>
      <Divider />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignSelf: 'center',
          gap: 10,
          opacity: isLoadingState ? 0.5 : 1,
        }}>
        {isLoadingState && (
          <ActivityIndicator
            style={{
              position: 'absolute',
              alignSelf: 'center',
              bottom: '50%',
              zIndex: 100,
            }}
          />
        )}
        <TouchableOpacity onPress={quickTrnaslate}>
          <Text>💨</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleClose()}>
          <Text>❌</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HighlightTextHover;
