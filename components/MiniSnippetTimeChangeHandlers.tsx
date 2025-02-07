import React, {Text, View} from 'react-native';
import {Icon, IconButton, MD2Colors} from 'react-native-paper';

const NewRewindForwardToggles = ({handleSetEarlierTime}) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
    }}>
    <IconButton
      icon="rewind"
      mode="outlined"
      size={15}
      onPress={() => handleSetEarlierTime(false)}
    />
    <IconButton
      icon="fast-forward"
      mode="outlined"
      size={15}
      onPress={() => handleSetEarlierTime(true)}
    />
  </View>
);

const NewDurationToggles = ({handleSetDuration}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}>
      <IconButton
        icon="minus"
        mode="outlined"
        size={15}
        onPress={() => handleSetDuration(false)}
      />
      <IconButton
        icon="plus"
        mode="outlined"
        size={15}
        onPress={() => handleSetDuration(true)}
      />
    </View>
  );
};

export const SnippetHandlersDifficultSentence = ({
  handleSetEarlierTime,
  adjustableDuration,
  handleSetDuration,
  adjustableStartTime,
  handleSaveSnippet,
  handleRemoveSnippet,
  handleRemoveFromTempSnippets,
  pauseSound,
  playSound,
  isPlaying,
  indexList,
  isSaved,
  isSavedAndOutsideOfBoundary,
}) => {
  const listText = indexList + 1 + ') ';
  const playIcon = isPlaying ? 'pause' : 'play';

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          alignSelf: 'center',
          opacity: isSavedAndOutsideOfBoundary ? 0.5 : 1,
        }}>
        <Text>{listText}</Text>
      </View>
      <View
        style={{
          alignSelf: 'center',
        }}>
        {isSavedAndOutsideOfBoundary ? (
          <Icon size={15} source={'minus-circle-off-outline'} />
        ) : isPlaying ? (
          <IconButton
            icon={playIcon}
            mode="outlined"
            disabled={!isPlaying}
            size={15}
            onPress={pauseSound}
            iconColor={MD2Colors.white}
            containerColor={MD2Colors.green700}
          />
        ) : (
          <IconButton
            icon={playIcon}
            mode="outlined"
            disabled={isSavedAndOutsideOfBoundary || isPlaying}
            size={15}
            onPress={playSound}
          />
        )}
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          opacity: isSavedAndOutsideOfBoundary ? 0.5 : 1,
        }}>
        <Text
          style={{
            marginHorizontal: 5,
            fontStyle: 'italic',
          }}>
          {adjustableStartTime?.toFixed(2)}{' '}
          <Icon size={15} source={'arrow-right'} />
          {(adjustableStartTime + adjustableDuration)?.toFixed(2)}
        </Text>
      </View>
      <View
        style={{
          flexDirection: !isSaved ? 'row' : undefined,
        }}>
        {!isSaved ? (
          <View>
            <NewRewindForwardToggles
              handleSetEarlierTime={handleSetEarlierTime}
            />
            <NewDurationToggles handleSetDuration={handleSetDuration} />
          </View>
        ) : null}
        <View
          style={{
            alignSelf: 'center',
          }}>
          {!isSaved ? (
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <IconButton
                icon={'content-save'}
                mode="outlined"
                size={15}
                onPress={handleSaveSnippet}
              />
              <IconButton
                icon={'delete'}
                mode="outlined"
                size={15}
                onPress={handleRemoveFromTempSnippets}
              />
            </View>
          ) : (
            <IconButton
              icon={'delete'}
              mode="outlined"
              size={15}
              onPress={handleRemoveSnippet}
            />
          )}
        </View>
      </View>
    </View>
  );
};
