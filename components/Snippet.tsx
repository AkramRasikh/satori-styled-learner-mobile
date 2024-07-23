import {useEffect, useRef, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import useSoundHook from '../hooks/useSoundHook';
import ProgressBarComponent from './Progress';

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
  const [progress, setProgress] = useState(0);
  const [currentTimeState, setCurrentTimeState] = useState(0);

  const pointInAudio = snippet.pointInAudio;
  const isIsolated = snippet?.isIsolated;
  const snippetStartAtLimit = snippet?.startAt;
  const snippetEndAtLimit = snippet?.endAt;
  const pointOfAudioOnClick = snippet?.pointOfAudioOnClick;

  const startTime = getStartTime(adjustableStartTime, pointInAudio);

  const [progressTime, setProgressTime] = useState(startTime);

  const soundRef = useRef(null);

  const id = snippet.id;
  const url = snippet.url;
  const targetLang = snippet.targetLang;
  const duration = snippet.duration;
  const isInDB = snippet?.saved;
  const topicName = snippet.topicName + '-' + pointInAudio.toFixed(2);

  useEffect(() => {
    if (isPlaying) {
      const newProgressTime =
        currentTimeState === 0 ? startTime : currentTimeState;
      setProgressTime(newProgressTime);
    }
  }, [isPlaying, currentTimeState, startTime]);

  useEffect(() => {
    const getCurrentTimeFunc = () => {
      soundRef.current.getCurrentTime(currentTime => {
        if (isInDB) {
          setProgress((currentTime - pointInAudio) / duration);
        } else {
          setProgress((currentTime - adjustableStartTime) / adjustableDuration);
        }
        setCurrentTimeState(currentTime);
      });
    };
    const interval = setInterval(() => {
      if (soundRef.current && soundRef.current?.isPlaying() && isPlaying) {
        getCurrentTimeFunc();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [
    soundRef,
    pointInAudio,
    duration,
    adjustableStartTime,
    adjustableDuration,
    isInDB,
    isPlaying,
  ]);

  useEffect(() => {
    if (masterAudio && isPlaying) {
      setMasterAudio(false);
    }
  }, [masterAudio, setMasterAudio, isPlaying]);

  useEffect(() => {
    if (!adjustableStartTime) {
      setAdjustableStartTime(pointOfAudioOnClick);
    }
  }, [
    adjustableStartTime,
    pointInAudio,
    pointOfAudioOnClick,
    setAdjustableStartTime,
  ]);

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

  const handleSetEarlierTime = forward => {
    const currentTimeWithPointInAudio = adjustableStartTime;
    const rewind = !forward;
    if (forward) {
      const newForwardedTime = currentTimeWithPointInAudio + 0.5;
      const newForwardWithDuration = newForwardedTime + adjustableDuration;
      if (
        newForwardedTime < snippetEndAtLimit &&
        newForwardWithDuration < snippetEndAtLimit
      ) {
        setAdjustableStartTime(newForwardedTime);
      } else {
        setAdjustableStartTime(snippetEndAtLimit);
      }
    } else if (rewind) {
      const newRewindTime = currentTimeWithPointInAudio - 0.5;
      if (newRewindTime > snippetStartAtLimit) {
        setAdjustableStartTime(newRewindTime);
      } else {
        setAdjustableStartTime(snippetStartAtLimit);
      }
    }
  };

  const handleSetDuration = increase => {
    const decrease = !increase;

    if (increase) {
      const newAdjustableDuration = adjustableDuration + 0.5;
      const newTimeWithDuration = adjustableStartTime + newAdjustableDuration;
      if (newTimeWithDuration < snippetEndAtLimit) {
        setAdjustableDuration(newAdjustableDuration);
      }
    } else if (decrease) {
      const newAdjustableDuration = adjustableDuration - 0.5;
      if (newAdjustableDuration > 0) {
        setAdjustableDuration(newAdjustableDuration);
      } else {
        setAdjustableDuration(0.5);
      }
    }
  };

  const handleDelete = () => {
    deleteSnippet(id);
  };

  const handleAddingSnippet = () => {
    const formattedSnippet = {
      ...snippet,
      index,
      isIsolated,
      pointInAudio: adjustableStartTime,
      duration: adjustableDuration,
    };
    addSnippet(formattedSnippet);
  };
  const handleRemoveSnippet = () => {
    const formattedSnippet = {
      ...snippet,
      pointInAudio: adjustableStartTime,
      duration: adjustableDuration,
    };
    removeSnippet(formattedSnippet);
  };

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
        <View
          style={{
            flex: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: !isInDB ? 'orange' : 'transparent',
            padding: 10,
            borderRadius: 10,
          }}>
          {isInDB ? (
            <TouchableOpacity onPress={handleRemoveSnippet}>
              <Text>Remove 🧹</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleAddingSnippet}>
              <Text>Save 🏦</Text>
            </TouchableOpacity>
          )}
        </View>
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

export const MiniSnippet = ({
  snippet,
  setMasterAudio,
  masterAudio,
  soundRef,
  index,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const pointInAudio = snippet.pointInAudio;
  const [currentTimeState, setCurrentTimeState] = useState(pointInAudio);

  const url = snippet.url;
  const duration = snippet.duration;
  const isInDB = snippet?.saved;
  const topicName = snippet.topicName + '-' + pointInAudio.toFixed(2);

  useEffect(() => {
    const getCurrentTimeFunc = () => {
      soundRef.current.getCurrentTime(currentTime => {
        setCurrentTimeState(currentTime);
      });
    };
    const interval = setInterval(() => {
      if (soundRef.current && soundRef.current?.isPlaying() && isPlaying) {
        getCurrentTimeFunc();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [soundRef, pointInAudio, duration, isInDB, isPlaying]);

  useEffect(() => {
    if (masterAudio && isPlaying) {
      setMasterAudio(false);
    }
  }, [masterAudio, setMasterAudio, isPlaying]);

  const {playSound, pauseSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
    isSnippet: true,
    startTime: pointInAudio,
    duration: duration,
    setCurrentTime: setCurrentTimeState,
    index,
    currentTime: currentTimeState,
  });

  const handlePlay = () => {
    playSound();
  };

  return (
    <View
      style={{
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            backgroundColor: isPlaying ? 'green' : 'red',
            padding: 5,
            borderRadius: 5,
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
      </View>
    </View>
  );
};

export default Snippet;
