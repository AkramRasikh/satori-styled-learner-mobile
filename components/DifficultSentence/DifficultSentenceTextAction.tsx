import React, {View} from 'react-native';
import {DefaultTheme, IconButton} from 'react-native-paper';
import useDifficultSentenceContext from './context/useDifficultSentence';

const DifficultSentenceTextAction = ({
  handleSettingHighlightmode,
  isBeingHighlighed,
  handleShowAllMatchedWords,
}) => {
  const {handleCopyText, handleOpenUpGoogle} = useDifficultSentenceContext();

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      <IconButton
        icon="text-search"
        mode="outlined"
        size={15}
        onPress={handleShowAllMatchedWords}
      />
      <IconButton
        icon={isBeingHighlighed ? 'close' : 'format-color-highlight'}
        mode="outlined"
        containerColor={
          isBeingHighlighed && DefaultTheme.colors.tertiaryContainer
        }
        size={15}
        onPress={handleSettingHighlightmode}
      />
      <IconButton
        icon="google-translate"
        mode="outlined"
        size={15}
        onPress={handleOpenUpGoogle}
      />
      <IconButton
        icon="content-copy"
        mode="outlined"
        size={15}
        onPress={handleCopyText}
      />
    </View>
  );
};

export default DifficultSentenceTextAction;
