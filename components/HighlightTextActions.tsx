import React, {Image, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';

const HighlightTextActions = ({
  getHighlightedText,
  handleSaveWord,
  handleQuickGoogleTranslate,
  handleClose,
  handleCopyText,
  handleOpenUpGoogle,
}) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 15,
      marginTop: 10,
    }}>
    <TouchableOpacity onPress={handleClose}>
      <Text>❌</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleCopyText}>
      <Text>📋</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleOpenUpGoogle}>
      <Text>📚</Text>
    </TouchableOpacity>
    {handleQuickGoogleTranslate && (
      <TouchableOpacity
        onPress={async () =>
          await handleQuickGoogleTranslate(getHighlightedText())
        }>
        <Text>💨</Text>
      </TouchableOpacity>
    )}
    <TouchableOpacity onPress={() => handleSaveWord(true)}>
      <Image
        source={require('../assets/images/google.png')}
        style={{width: 16, height: 16}}
      />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => handleSaveWord(false)}>
      <Image
        source={require('../assets/images/chatgpt.png')}
        style={{width: 16, height: 16}}
      />
    </TouchableOpacity>
  </View>
);

export default HighlightTextActions;
