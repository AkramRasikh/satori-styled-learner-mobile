import React, {useEffect, useState, useRef} from 'react';
import {View, Button} from 'react-native';
import TrackPlayer, {State, usePlaybackState} from 'react-native-track-player';

export default function AudioSnippetPlayer({source, start = 0, duration = 5}) {
  const playback = usePlaybackState();
  const timeoutRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setupPlayer();

    return () => {
      cleanup();
    };
  }, []);

  const setupPlayer = async () => {
    // await TrackPlayer.setupPlayer();
    await TrackPlayer.add({
      id: 'snippet',
      url: source,
      title: 'Snippet',
    });
    setIsReady(true);
  };

  const cleanup = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    try {
      await TrackPlayer.reset();
    } catch {}
  };

  const playSnippet = async () => {
    if (!isReady) return;

    // Always stop previous timer & audio
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    await TrackPlayer.pause();

    await TrackPlayer.seekTo(start);
    await TrackPlayer.play();

    timeoutRef.current = setTimeout(async () => {
      await stopSnippet();
    }, duration * 1000);
  };

  const stopSnippet = async () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    await TrackPlayer.pause();
  };

  const togglePlayback = () => {
    if (playback === State.Playing) {
      stopSnippet();
    } else {
      playSnippet();
    }
  };

  return (
    <View>
      <Button
        title={playback === State.Playing ? 'Stop' : 'Play'}
        onPress={togglePlayback}
      />
      <Button title={'stop'} onPress={stopSnippet} />
    </View>
  );
}
