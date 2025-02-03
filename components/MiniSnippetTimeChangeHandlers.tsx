import React, {TouchableOpacity, Text, View, Button} from 'react-native';
import {Icon, IconButton, MD2Colors} from 'react-native-paper';

const RewindForwardToggles = ({handleSetEarlierTime}) => {
  const earlierTimeTitle = '⏪';
  const laterTimeTitle = '⏩';
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}>
      <View>
        <Button
          onPress={() => handleSetEarlierTime(false)}
          title={earlierTimeTitle}
        />
      </View>
      <View>
        <Button
          onPress={() => handleSetEarlierTime(true)}
          title={laterTimeTitle}
        />
      </View>
    </View>
  );
};

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

const DurationToggles = ({handleSetDuration}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}>
      <View>
        <TouchableOpacity onPress={() => handleSetDuration(false)}>
          <Text>(-)</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={() => handleSetDuration(true)}>
          <Text>(+)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
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

//

const MiniSnippetTimeChangeHandlers = ({
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
          backgroundColor: isSavedAndOutsideOfBoundary
            ? 'transparent'
            : isPlaying
            ? 'green'
            : 'red',
          borderRadius: 5,
          alignSelf: 'center',
          padding: 5,
        }}>
        {isSavedAndOutsideOfBoundary ? (
          <Text>🚫</Text>
        ) : isPlaying ? (
          <TouchableOpacity onPress={pauseSound} disabled={!isPlaying}>
            <Text>⏸️</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={playSound}
            disabled={isSavedAndOutsideOfBoundary || isPlaying}>
            <Text>▶️</Text>
          </TouchableOpacity>
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
          {adjustableStartTime?.toFixed(2)} ➡{' '}
          {(adjustableStartTime + adjustableDuration)?.toFixed(2)}
        </Text>
      </View>
      <View
        style={{
          flex: !isSaved ? 2 : undefined,
          marginHorizontal: !isSaved ? 5 : undefined,
          flexDirection: !isSaved ? 'row' : undefined,
          justifyContent: !isSaved ? 'space-between' : undefined,
        }}>
        {!isSaved ? (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
            }}>
            <RewindForwardToggles handleSetEarlierTime={handleSetEarlierTime} />
            <DurationToggles handleSetDuration={handleSetDuration} />
          </View>
        ) : null}
        <View
          style={{
            flex: 1,
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          {!isSaved ? (
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Button onPress={handleSaveSnippet} title="🤙🏽" />
              <Button onPress={handleRemoveFromTempSnippets} title="❌" />
            </View>
          ) : (
            <Button onPress={handleRemoveSnippet} title="❌" />
          )}
        </View>
      </View>
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

export default MiniSnippetTimeChangeHandlers;
