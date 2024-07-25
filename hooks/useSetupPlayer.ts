import {useEffect} from 'react';
import TrackPlayer, {Capability} from 'react-native-track-player';

const useSetupPlayer = ({isSetupPlayerLoaded, setIsSetupPlayerLoaded}) => {
  useEffect(() => {
    async function setupPlayer() {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
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
      setIsSetupPlayerLoaded(true);
    }

    if (!isSetupPlayerLoaded) {
      setupPlayer();
    }

    return () => {
      TrackPlayer.stop();
    };
  }, [isSetupPlayerLoaded, setIsSetupPlayerLoaded]);
};

export default useSetupPlayer;
