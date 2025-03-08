import React, {TouchableOpacity, View} from 'react-native';
import {Divider, Text} from 'react-native-paper';

const HighlightTextHover = ({
  getHighlightedText,
  handleQuickGoogleTranslate,
  handleClose,
}) => {
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
        }}>
        <TouchableOpacity
          onPress={async () =>
            await handleQuickGoogleTranslate(getHighlightedText())
          }>
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
