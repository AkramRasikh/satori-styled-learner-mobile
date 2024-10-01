import {useEffect, useState} from 'react';
import {
  FIREBASE_AUDIO_URL,
  FIREBASE_STORAGE_ID,
  FIREBASE_AUDIO_SONGS_URL,
} from '@env';
import Sound from 'react-native-sound';
Sound.setCategory('Playback');

export const getFirebaseAudioURL = (mp3FileName: string) => {
  const baseURL = FIREBASE_AUDIO_URL;
  const firebaseToken = FIREBASE_STORAGE_ID;
  const url = `${baseURL}${mp3FileName}.mp3?alt=media&token=${firebaseToken}`;

  return url;
};

export const getFirebaseSongURL = (mp3FileName: string) => {
  const baseURL = FIREBASE_AUDIO_SONGS_URL;
  const firebaseToken = FIREBASE_STORAGE_ID;
  const url = `${baseURL}${mp3FileName}.mp3?alt=media&token=${firebaseToken}`;

  return url;
};

const useGetCombinedAudioData = ({
  hasUnifiedMP3File,
  audioFiles,
  hasAlreadyBeenUnified,
  setAudioLoadingProgress,
  isMediaContent,
  soundDuration,
}) => {
  const [durations, setDurations] = useState([]);
  const [dataHasBeenFetched, setDataHasBeenFetch] = useState(false);

  useEffect(() => {
    const fetchDurations = async () => {
      if (isMediaContent) {
        const sortedAudios = audioFiles.map((audioItem, index) => {
          const isLast = index + 1 === audioFiles.length;
          const startAt = audioItem.time;
          const thisDuration = !isLast
            ? audioFiles[index + 1].time - startAt
            : soundDuration - startAt;
          setAudioLoadingProgress?.(prev => (prev += 1));
          return {
            ...audioItem,
            thisDuration,
            startAt,
            endAt: startAt + thisDuration,
          };
        });
        setDurations(sortedAudios);
      } else {
        const durationsPromises = audioFiles.map(item => {
          const url = getFirebaseAudioURL(item.id);
          return new Promise(resolve => {
            const sound = new Sound(url, '', error => {
              if (error) {
                console.log('Failed to load the sound', error);
                resolve({id: item.id, duration: 0});
                return;
              }
              setAudioLoadingProgress?.(prev => (prev += 1));
              const duration = sound.getDuration();

              resolve({
                id: item.id,
                duration,
              });
              sound.release(); // Release the sound resource
            });
          });
        });

        const durationsResults = await Promise.all(durationsPromises);

        let endAt = 0;

        const sortedAudios = audioFiles.map(audioItem => {
          const thisDuration = durationsResults.find(
            item => item.id === audioItem.id,
          ).duration;
          const startAt = endAt;
          endAt = endAt + thisDuration;
          return {
            ...audioItem,
            thisDuration,
            startAt,
            endAt,
          };
        });
        setDurations(sortedAudios);
      }
    };

    if (
      hasUnifiedMP3File &&
      audioFiles?.length > 0 &&
      !(durations?.length > 0) &&
      !hasAlreadyBeenUnified &&
      !dataHasBeenFetched
    ) {
      fetchDurations();
      setDataHasBeenFetch(true);
    }
  }, [
    audioFiles,
    hasUnifiedMP3File,
    dataHasBeenFetched,
    durations,
    hasAlreadyBeenUnified,
    isMediaContent,
  ]);

  if (hasAlreadyBeenUnified?.length > 1) {
    return hasAlreadyBeenUnified;
  } else {
    return durations;
  }
};

export default useGetCombinedAudioData;
