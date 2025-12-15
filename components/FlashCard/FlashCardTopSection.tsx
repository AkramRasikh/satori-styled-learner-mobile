import React, {useState} from 'react';
import {Text, TouchableOpacity, View, ActivityIndicator} from 'react-native';
import {IconButton, MD2Colors, MD3Colors} from 'react-native-paper';
import {SoundProvider} from '../WordSoundComponent/context/SoundProvider';
import useSound from '../WordSoundComponent/context/useSound';

const FlashCardTopSection = ({
  selectWordWithScroll,
  listTextNumber,
  isSelectedWord,
  handleCloseModal,
  setIsOpenWordOptionsState,
  isOpenWordOptionsState,
  handleCopyText,
  baseForm,
  definiton,
  firstExampleSentence,
}) => {
  const [isShowTargetLangState, setIsShowTargetLangState] = useState(false);

  const wordText = isShowTargetLangState ? baseForm : definiton;

  const AudioButton = () => {
    const {isLoaded, handleLoad, isPlaying, handlePlay} = useSound();
    const [isLoading, setIsLoading] = useState(false);

    const handleLoadClick = async () => {
      setIsLoading(true);
      // Give React time to render the loading state
      await new Promise(resolve => setTimeout(resolve, 50));
      try {
        await handleLoad();
      } catch (error) {
        console.error('Error loading audio:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoading) {
      return (
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: MD3Colors.primary50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="small" color={MD3Colors.primary50} />
        </View>
      );
    }
    if (!isLoaded) {
      return (
        <IconButton
          icon="download"
          iconColor={MD3Colors.primary50}
          size={20}
          onPress={handleLoadClick}
          style={{
            borderWidth: 2,
            borderColor: MD3Colors.primary50,
          }}
        />
      );
    }

    return (
      <IconButton
        icon={isPlaying ? 'pause' : 'play'}
        iconColor={MD3Colors.primary50}
        size={20}
        onPress={handlePlay}
        style={{
          borderWidth: 2,
          borderColor: MD3Colors.primary50,
        }}
      />
    );
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: 'auto',
        justifyContent: 'space-between',
        marginRight: 10,
      }}>
      <TouchableOpacity
        style={{
          flex: 8,
        }}
        onPress={() => setIsShowTargetLangState(!isShowTargetLangState)}>
        <Text
          style={{
            fontSize: 24,
            flexWrap: 'wrap',
            marginVertical: 'auto',
          }}>
          {listTextNumber + wordText}
        </Text>
      </TouchableOpacity>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {firstExampleSentence && (
          <SoundProvider sentenceData={firstExampleSentence}>
            <AudioButton />
          </SoundProvider>
        )}
        <TouchableOpacity
          onPress={selectWordWithScroll}
          onLongPress={handleCopyText}>
          <IconButton
            icon={isSelectedWord ? 'close' : 'dots-vertical'}
            containerColor={
              isSelectedWord ? MD3Colors.error50 : MD2Colors.blueGrey300
            }
            iconColor={isSelectedWord ? 'white' : 'black'}
            onPress={() => {
              selectWordWithScroll();
              setIsOpenWordOptionsState(!isOpenWordOptionsState);
              if (isSelectedWord) {
                handleCloseModal();
              }
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FlashCardTopSection;
