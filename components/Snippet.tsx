import {useRef, useState} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import useSoundHook from '../hooks/useSoundHook';
import ProgressBarComponent from './Progress';
import useSnippetHook from '../hooks/useSnippetHook';
import useSnippetControls from '../hooks/useSnippetControls';
import SnippetRemoveSave from './Snippet/SnippetRemoveSave';
import SnippetPlayControls from './Snippet/SnippetPlayControls';
import SnippetDelete from './Snippet/SnippetDelete';
import SnippetTimeRange from './Snippet/SnippetTimeRange';
import SnippetTimeChangeHandlers from './Snippet/SnippetTimeChangeHandlers';
import useSnippetManageAudioStop from '../hooks/useSnippetManageAudioStop';

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
  const pointInAudioOnClick = snippet?.pointInAudioOnClick;

  const startTime = getStartTime(adjustableStartTime, pointInAudio);

  const soundRef = useRef(null);

  const url = snippet.url;
  const targetLang = snippet.targetLang;
  const duration = snippet.duration;
  const isInDB = snippet?.saved;
  const topicName = snippet.topicName + '-' + pointInAudio.toFixed(2);

  const {progress, progressTime} = useSnippetHook({
    startTime,
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
    pointInAudioOnClick,
  });

  const {playSound, pauseSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
    isSnippet: true,
    startTime: isInDB ? pointInAudio : adjustableStartTime,
    setCurrentTime: setCurrentTimeState,
  });

  useSnippetManageAudioStop({
    soundRef,
    isPlaying,
    setIsPlaying,
    startTime,
    duration,
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
    if (adjustableStartTime) {
      const tempStateProgress = (
        adjustableStartTime + adjustableDuration
      ).toFixed(2);
      return tempStateProgress;
    }

    return null;
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
        <SnippetPlayControls
          isPlaying={isPlaying}
          pauseSound={pauseSound}
          handlePlay={handlePlay}
        />
        {!isInDB ? <SnippetDelete handleDelete={handleDelete} /> : null}
        {isInDB ? (
          <SnippetTimeRange pointInAudio={pointInAudio} duration={duration} />
        ) : null}
      </View>
      <Text style={{padding: 10}}>{targetLang}</Text>
      {!isInDB ? (
        <SnippetTimeChangeHandlers
          handleSetEarlierTime={handleSetEarlierTime}
          adjustableDuration={adjustableDuration}
          handleSetDuration={handleSetDuration}
          adjustableStartTime={adjustableStartTime}
        />
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
