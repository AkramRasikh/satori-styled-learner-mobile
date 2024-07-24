import {useRef, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import useSoundHook from '../hooks/useSoundHook';
import ProgressBarComponent from './Progress';
import useSnippetHook from '../hooks/useSnippetHook';
import useSnippetControls from '../hooks/useSnippetControls';
import SnippetRemoveSave from './Snippet/SnippetRemoveSave';

const getStartTime = (adjustableStartTime, pointInAudio) => {
  if (isFinite(adjustableStartTime)) {
    return adjustableStartTime;
  }
  return pointInAudio;
};

const Snippet = ({
  snippet,
  setMasterAudio,
  masterAudio,
  deleteSnippet,
  addSnippet,
  removeSnippet,
  index,
  instance,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [adjustableStartTime, setAdjustableStartTime] = useState();
  const [adjustableDuration, setAdjustableDuration] = useState(4);
  const [currentTimeState, setCurrentTimeState] = useState(0);

  const pointInAudio = snippet.pointInAudio;
  const snippetStartAtLimit = snippet?.startAt;
  const snippetEndAtLimit = snippet?.endAt;
  const pointOfAudioOnClick = snippet?.pointOfAudioOnClick;

  const startTime = getStartTime(adjustableStartTime, pointInAudio);

  const soundRef = useRef(null);

  const url = snippet.url;
  const targetLang = snippet.targetLang;
  const duration = snippet.duration;
  const isInDB = snippet?.saved;
  const topicName = snippet.topicName + '-' + pointInAudio.toFixed(2);

  const {progress, progressTime} = useSnippetHook({
    startTime,
    pointOfAudioOnClick,
    currentTimeState,
    setCurrentTimeState,
    soundRef,
    setMasterAudio,
    masterAudio,
    isPlaying,
    isInDB,
    pointInAudio,
    adjustableStartTime,
    duration,
    adjustableDuration,
    setAdjustableStartTime,
  });

  const {playSound, pauseSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
    isSnippet: true,
    startTime: isInDB ? pointInAudio : adjustableStartTime,
    duration: isInDB ? duration : adjustableDuration,
    setCurrentTime: setCurrentTimeState,
    index,
    currentTime: currentTimeState,
  });

  const {
    handleDelete,
    handleAddingSnippet,
    handleRemoveSnippet,
    handleSetEarlierTime,
    handleSetDuration,
  } = useSnippetControls({
    adjustableStartTime,
    adjustableDuration,
    setAdjustableStartTime,
    setAdjustableDuration,
    snippetEndAtLimit,
    snippetStartAtLimit,
    deleteSnippet,
    addSnippet,
    removeSnippet,
    snippet,
  });

  const getEndTimeProgress = () => {
    if (isInDB) {
      return (pointInAudio + duration).toFixed(2);
    }
    const tempStateProgress = (
      adjustableStartTime + adjustableDuration
    ).toFixed(2);
    return tempStateProgress;
  };

  const handlePlay = () => {
    soundRef.current = instance;
    playSound();
  };

  return (
    <View
      style={{
        alignItems: 'center',
        padding: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          padding: 10,
        }}>
        <SnippetRemoveSave
          isInDB={isInDB}
          handleRemoveSnippet={handleRemoveSnippet}
          handleAddingSnippet={handleAddingSnippet}
        />
        <View
          style={{
            backgroundColor: isPlaying ? 'green' : 'red',
            padding: 10,
            borderRadius: 10,
          }}>
          {isPlaying ? (
            <TouchableOpacity onPress={pauseSound}>
              <Text>⏸️ Pause</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handlePlay}>
              <Text>▶️ Play</Text>
            </TouchableOpacity>
          )}
        </View>
        {!isInDB ? (
          <View style={{padding: 10}}>
            <TouchableOpacity onPress={handleDelete}>
              <Text>❌</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        {isInDB ? (
          <View
            style={{
              flex: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>
              {pointInAudio.toFixed(2)} ➾ {(pointInAudio + duration).toFixed(2)}
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={{padding: 10}}>{targetLang}</Text>
      {!isInDB ? (
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
      ) : null}
      <ProgressBarComponent
        progress={progress}
        time={(progressTime || startTime).toFixed(2)}
        endTime={getEndTimeProgress()}
      />
    </View>
  );
};

export default Snippet;
