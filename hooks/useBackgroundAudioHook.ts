import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import Sound from 'react-native-sound';
import TrackPlayer, {Capability, State} from 'react-native-track-player';

Sound.setCategory('Playback');

const useBackgroundAudioHook = ({soundInstance, topicName, url, soundRef}) => {
  const trackAddedRef = useRef(false);
  const setTrackPlayerCurrentTime = async () => {
    try {
      // Ensure TrackPlayer is ready and track is loaded before seeking
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
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        stopWithApp: false,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SeekTo,
          Capability.JumpForward,
          Capability.JumpBackward,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SeekTo,
          Capability.JumpForward,
          Capability.JumpBackward,
        ],
      });

      await TrackPlayer.add({
        id: topicName,
        title: topicName,
        url,
      });

      trackAddedRef.current = true;
    }

    setupPlayer();
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      TrackPlayer.stop();
      trackAddedRef.current = false;
      AppState.removeEventListener('change', handleAppStateChange);
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
    if (topicName) {
      addTrack();
    }
  }, [topicName, url, trackAddedRef]);

  const handleAppStateChange = async nextAppState => {
    if (nextAppState === 'background' && soundRef.current?.isPlaying()) {
      setTrackPlayerCurrentTime();
      soundInstance.play(success => {
        console.log('## playback success ✅');
        if (!success) {
          console.log('## playback failed due to audio decoding errors ❌');
        }
      });
    }
  };
};

export default useBackgroundAudioHook;
