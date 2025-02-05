import React, {Text, View} from 'react-native';
import {DefaultTheme, IconButton, ProgressBar} from 'react-native-paper';

import useSoundHook from '../../hooks/useSoundHook';
import useDifficultSentenceContext from '../NewDifficultBase/context/useDifficultSentence';

export const NewProgressBarComponent = () => {
  const {currentTimeState, soundDuration, isLoaded} =
    useDifficultSentenceContext();

  const progressRate = (isLoaded && currentTimeState / soundDuration) || 0;

  const audioProgressText = `${currentTimeState?.toFixed(
    2,
  )}/${soundDuration?.toFixed(2)}`;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          width: '75%',
          alignSelf: 'center',
        }}>
        <ProgressBar progress={progressRate} style={{marginVertical: 5}} />
      </View>
      <View>
        <Text>{audioProgressText}</Text>
      </View>
    </View>
  );
};

export const TextActionContainer = ({
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
