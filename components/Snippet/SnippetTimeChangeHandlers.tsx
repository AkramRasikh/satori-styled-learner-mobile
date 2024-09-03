import {TouchableOpacity, Text, View, Button} from 'react-native';

export const MiniSnippetTimeChangeHandlers = ({
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
}) => {
  const listText = indexList + 1 + ') ';
  const earlierTimeTitle = '⏪';
  const laterTimeTitle = '⏩';
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          alignSelf: 'center',
        }}>
        <Text>{listText}</Text>
      </View>
      <View
        style={{
          backgroundColor: isPlaying ? 'green' : 'red',
          borderRadius: 5,
          alignSelf: 'center',
          padding: 5,
        }}>
        {isPlaying ? (
          <TouchableOpacity onPress={pauseSound} disabled={!isPlaying}>
            <Text>⏸️</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={playSound} disabled={isPlaying}>
            <Text>▶️</Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
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
          flex: 2,
          marginHorizontal: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        {!isSaved ? (
          <>
            <View style={{flex: 1}}>
              <Button
                onPress={() => handleSetEarlierTime(false)}
                title={earlierTimeTitle}
              />
            </View>
            <View style={{flex: 1}}>
              <Button
                onPress={() => handleSetEarlierTime(true)}
                title={laterTimeTitle}
              />
            </View>
            <View style={{flex: 1, alignSelf: 'center'}}>
              <TouchableOpacity onPress={() => handleSetDuration(false)}>
                <Text>(-)</Text>
              </TouchableOpacity>
            </View>
            <View style={{flex: 1, alignSelf: 'center'}}>
              <TouchableOpacity onPress={() => handleSetDuration(true)}>
                <Text>(+)</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
        <View style={{flex: 1, alignSelf: 'center'}}>
          {!isSaved ? (
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Button onPress={handleSaveSnippet} title="📌" />
              <Button onPress={handleRemoveFromTempSnippets} title="❌" />
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleRemoveSnippet}
              style={{
                alignItems: 'flex-end',
              }}>
              <Text>❌</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const SnippetTimeChangeHandlers = ({
  handleSetEarlierTime,
  adjustableDuration,
  handleSetDuration,
  adjustableStartTime,
}) => {
  return (
    <View
      style={{
        marginHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => handleSetEarlierTime(false)}>
          <Text>-1 ⏪</Text>
        </TouchableOpacity>
      </View>
      <Text>{adjustableStartTime?.toFixed(2)}</Text>
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => handleSetEarlierTime(true)}>
          <Text>+1 ⏩ </Text>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, borderLeftWidth: 1, borderLeftColor: 'black'}}>
        <TouchableOpacity onPress={() => handleSetDuration(false)}>
          <Text>(-1)</Text>
        </TouchableOpacity>
      </View>
      <Text>duration: {adjustableDuration}</Text>
      <View style={{flex: 1, borderLeftWidth: 1, borderLeftColor: 'black'}}>
        <TouchableOpacity onPress={() => handleSetDuration(true)}>
          <Text>(+1)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SnippetTimeChangeHandlers;
