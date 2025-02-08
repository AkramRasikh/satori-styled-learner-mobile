import React, {View} from 'react-native';
import {DefaultTheme, IconButton, MD2Colors} from 'react-native-paper';
import useDifficultSentenceContext from './context/useDifficultSentence';

const DifficultSentenceTextAction = ({
  handleSettingHighlightmode,
  isBeingHighlighed,
  handleShowAllMatchedWords,
}) => {
  const {handleCopyText, handleOpenUpGoogle, matchedWordListState} =
    useDifficultSentenceContext();
  const btnArr = [
    {
      icon: 'text-search',
      onPress: handleShowAllMatchedWords,
      disabled: matchedWordListState.length === 0,
    },
    {
      icon: isBeingHighlighed ? 'close' : 'format-color-highlight',
      onPress: handleSettingHighlightmode,
      containerColor:
        isBeingHighlighed && DefaultTheme.colors.tertiaryContainer,
    },
    {
      icon: 'google-translate',
      onPress: handleOpenUpGoogle,
      iconColor: MD2Colors.blue600,
    },
    {
      icon: 'content-copy',
      onPress: handleCopyText,
    },
  ];

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      {btnArr.map((btn, index) => {
        return (
          <IconButton
            key={index}
            icon={btn.icon}
            mode="outlined"
            size={15}
            onPress={btn.onPress}
            containerColor={btn?.containerColor}
            disabled={btn?.disabled}
            iconColor={btn?.iconColor}
          />
        );
      })}
    </View>
  );
};

export default DifficultSentenceTextAction;
