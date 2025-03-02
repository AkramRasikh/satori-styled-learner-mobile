import React, {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';

const HighlightTextHover = ({
  getHighlightedText,
  handleQuickGoogleTranslate,
}) => {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 100,
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
      <TouchableOpacity
        style={{alignContent: 'center', alignItems: 'center'}}
        onPress={async () =>
          await handleQuickGoogleTranslate(getHighlightedText())
        }>
        <Text>💨</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HighlightTextHover;
