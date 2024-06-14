import {useEffect, useRef, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import useSoundHook from '../hooks/useSoundHook';

const Snippet = ({
  snippet,
  setMasterAudio,
  masterAudio,
  deleteSnippet,
  addSnippet,
  removeSnippet,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [adjustableStartTime, setAdjustableStartTime] = useState();
  const [adjustableDuration, setAdjustableDuration] = useState(4);

  const soundRef = useRef();

  const id = snippet.id;
  const url = snippet.url;
  const targetLang = snippet.targetLang;
  const pointInAudio = snippet.pointInAudio;
  const duration = snippet.duration;
  const isInDB = snippet?.saved;
  const topicName = snippet.topicName + '-' + pointInAudio.toFixed(2);

  useEffect(() => {
    if (masterAudio && isPlaying) {
      setMasterAudio(false);
    }
  }, [masterAudio, setMasterAudio, isPlaying]);

  useEffect(() => {
    if (!adjustableStartTime) {
      const provStartTime = pointInAudio - 0.5;
      setAdjustableStartTime(provStartTime < 0 ? pointInAudio : provStartTime);
    }
  }, [adjustableStartTime, pointInAudio, setAdjustableStartTime]);

  const {playSound, pauseSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
    isSnippet: true,
    startTime: isFinite(adjustableStartTime)
      ? adjustableStartTime
      : pointInAudio,
    duration: adjustableDuration,
  });

  const handleSetEarlierTime = forward => {
    const newAdjustableTime = forward
      ? adjustableStartTime - 1
      : adjustableStartTime + 1;
    setAdjustableStartTime(newAdjustableTime);
  };

  const handleSetDuration = increase => {
    const newAdjustableDuration = increase
      ? adjustableDuration + 1
      : adjustableDuration - 1;
    setAdjustableDuration(newAdjustableDuration);
  };

  const handleDelete = () => {
    deleteSnippet(id);
  };

  const handleAddingSnippet = () => {
    const formattedSnippet = {
      ...snippet,
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
            <TouchableOpacity onPress={playSound}>
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
            <TouchableOpacity onPress={() => handleSetEarlierTime(true)}>
              <Text>-1 ⏪</Text>
            </TouchableOpacity>
          </View>
          <Text>{adjustableStartTime?.toFixed(2)}</Text>
          <View style={{flex: 1}}>
            <TouchableOpacity onPress={() => handleSetEarlierTime(false)}>
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
    </View>
  );
};

export default Snippet;
