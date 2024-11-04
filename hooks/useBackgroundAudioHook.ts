import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import Sound from 'react-native-sound';
import TrackPlayer from 'react-native-track-player';

Sound.setCategory('Playback');

const useBackgroundAudioHook = ({
  // soundInstance,
  topicName,
  url,
  soundRef,
  isSnippet,
  masterSetIsPlaying,
}) => {
  const trackAddedRef = useRef(false);

  const setTrackPlayerCurrentTime = async () => {
    try {
      const currentTrack = await TrackPlayer.getActiveTrack();
      if (currentTrack !== null) {
        soundRef.current.getCurrentTime(async currentTime => {
          await TrackPlayer.seekTo(currentTime);
        });
        soundRef.current.pause();
        // await TrackPlayer.play();
      } else {
        console.log('## No track is currently loaded');
      }
    } catch (error) {
      console.log('## Error setting current time:', error);
    }
  };

  useEffect(() => {
    async function setupPlayer() {
      await TrackPlayer.add({
        id: topicName,
        title: topicName,
        url,
      });

      trackAddedRef.current = true;
    }

    if (!isSnippet) {
      setupPlayer();
      AppState.addEventListener('change', handleAppStateChange);
    }

    return () => {
      TrackPlayer.stop();
      trackAddedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const addTrack = async () => {
      await TrackPlayer.reset(); // Reset to update track
      await TrackPlayer.add({
        id: topicName,
        title: topicName,
        url,
      });
    };
    if (topicName && !isSnippet) {
      addTrack();
    }
  }, [topicName, url, trackAddedRef, isSnippet]);

  const handleAppStateChange = async nextAppState => {
    const isPlaying = soundRef.current?.isPlaying();
    if (nextAppState === 'background' && isPlaying) {
      setTrackPlayerCurrentTime();
      // soundInstance.play(success => {
      //   console.log('## playback success ✅');
      //   if (!success) {
      //     console.log('## playback failed due to audio decoding errors ❌');
      //   }
      // });
    } else if (nextAppState === 'active' && !isPlaying) {
      const progress = await TrackPlayer.getProgress();
      const position = progress.position;
      TrackPlayer.pause();
      masterSetIsPlaying(false);
      soundRef.current.setCurrentTime(position);
    }
  };
};

export default useBackgroundAudioHook;
