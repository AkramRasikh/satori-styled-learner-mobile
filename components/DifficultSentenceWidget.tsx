import {Text, TouchableOpacity, View} from 'react-native';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import {useRef, useState} from 'react';
import {getFirebaseAudioURL} from '../hooks/useGetCombinedAudioData';
import useSoundHook from '../hooks/useSoundHook';
import SoundComponent from './Sound';
import DifficultSentenceContent from './DifficultSentenceContent';

const SoundWidget = ({soundRef, url, topicName}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const {playSound, pauseSound, forwardSound, rewindSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
  });

  return (
    <SoundComponent
      soundRef={soundRef}
      isPlaying={isPlaying}
      playSound={playSound}
      pauseSound={pauseSound}
      rewindSound={() => rewindSound(2)}
      forwardSound={() => forwardSound(2)}
      jumpAudioValue={2}
    />
  );
};

const DifficultSentenceWidget = ({sentence, todayDateObj}) => {
  const id = sentence.id;
  const topic = sentence.topic;
  const isCore = sentence?.isCore;
  const baseLang = sentence.baseLang;
  const targetLang = sentence.targetLang;
  const nextReview = sentence?.nextReview;

  const soundRef = useRef();
  const url = getFirebaseAudioURL(id);

  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url,
  });

  return (
    <View
      key={id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginBottom: 10,
      }}>
      <DifficultSentenceContent
        topic={topic}
        isCore={isCore}
        targetLang={targetLang}
        baseLang={baseLang}
        nextReview={nextReview}
        todayDateObj={todayDateObj}
      />
      {isLoaded ? (
        <SoundWidget soundRef={soundRef} url={url} topicName={topic} />
      ) : (
        <View>
          <TouchableOpacity onPress={triggerLoadURL}>
            <Text>Load URL</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DifficultSentenceWidget;
