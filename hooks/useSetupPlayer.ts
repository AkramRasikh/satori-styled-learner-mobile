import {useEffect} from 'react';
import TrackPlayer, {Capability} from 'react-native-track-player';

const useSetupPlayer = () => {
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
    }

    setupPlayer();

    return () => {
      TrackPlayer.stop();
      console.log('## unmount background APP');
    };
  }, []);
};

export default useSetupPlayer;
