import {useEffect, useState} from 'react';
import {FIREBASE_ASSETS_URL, FIREBASE_STORAGE_ID} from '@env';
import Sound from 'react-native-sound';
import useLanguageSelector from '../context/Data/useLanguageSelector';
Sound.setCategory('Playback');

export const getFirebaseAudioURL = (mp3FileName: string, language: string) => {
  const languageParam = `${language}-audio%2F`;
  const baseURL = FIREBASE_ASSETS_URL + languageParam;
  const firebaseToken = FIREBASE_STORAGE_ID;
  const url = `${baseURL}${mp3FileName}.mp3?alt=media&token=${firebaseToken}`;

  return url;
};

export const getFirebaseVideoURL = (mp3FileName: string, language: string) => {
  const languageParam = `${language}-video%2F`;
  const baseURL = FIREBASE_ASSETS_URL + languageParam;
  const firebaseToken = FIREBASE_STORAGE_ID;
  const url = `${baseURL}${mp3FileName}.mp4?alt=media&token=${firebaseToken}`;

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
  const {languageSelectedState} = useLanguageSelector();

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
        let endAt = 0;

        const durationsPromises = audioFiles.map((item, index) => {
          const url = getFirebaseAudioURL(item.id, languageSelectedState);
          return new Promise(resolve => {
            const sound = new Sound(url, '', error => {
              if (error) {
                console.log(
                  'Failed to load the sound (useGetCombinedAudioData)',
                  error,
                );
                resolve({id: item.id, duration: 0});
                return;
              }
              setAudioLoadingProgress?.(prev => (prev += 1));
              const duration = sound.getDuration();
              const startAt = endAt;
              endAt = endAt + duration;
              resolve({
                ...item,
                id: item.id,
                position: index,
                duration,
                startAt,
                endAt,
              });
              sound.release(); // Release the sound resource
            });
          });
        });
        const durationsResults = await Promise.all(durationsPromises);
        setDurations(durationsResults);
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
