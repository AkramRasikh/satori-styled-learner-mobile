import {TouchableOpacity, Text, View, Button} from 'react-native';

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

export default MiniSnippetTimeChangeHandlers;
