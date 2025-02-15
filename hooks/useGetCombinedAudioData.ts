import {useEffect} from 'react';
import {FIREBASE_ASSETS_URL, FIREBASE_STORAGE_ID} from '@env';
import Sound from 'react-native-sound';
import useLanguageSelector from '../context/LanguageSelector/useLanguageSelector';
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
  hasAudio,
  content,
  setAudioLoadingProgress,
  isMediaContent,
  soundDuration,
  updateContentMetaDataIsLoadedDispatch,
  isDurationAudioLoaded,
}) => {
  const {languageSelectedState} = useLanguageSelector();

  useEffect(() => {
    const fetchDurations = async () => {
      if (isMediaContent) {
        const sortedAudios = content.map((audioItem, index) => {
          const isLast = index + 1 === content.length;
          const startAt = audioItem.time;
          const thisDuration = !isLast
            ? content[index + 1].time - startAt
            : soundDuration - startAt;
          setAudioLoadingProgress?.(prev => (prev += 1));
          return {
            ...audioItem,
            startAt,
            endAt: startAt + thisDuration,
          };
        });
        updateContentMetaDataIsLoadedDispatch(sortedAudios);
      } else {
        let endAt = 0;

        const durationsPromises = content.map((item, index) => {
          const url = getFirebaseAudioURL(item.id, languageSelectedState);
          return new Promise(resolve => {
            const sound = new Sound(url, '', error => {
              if (error) {
                console.log(
                  'Failed to load the sound (useGetCombinedAudioData)',
                  error,
                );
                resolve({id: item.id});
                return;
              }
              setAudioLoadingProgress?.(prev => (prev += 1));
              const duration = sound.getDuration();
              const startAt = endAt;
              endAt = endAt + duration;
              resolve({
                ...item,
                id: item.id,
                startAt,
                endAt,
              });
              sound.release(); // Release the sound resource
            });
          });
        });
        const durationsResults = await Promise.all(durationsPromises);
        updateContentMetaDataIsLoadedDispatch(durationsResults);
      }
    };
    if (hasAudio && !isDurationAudioLoaded) {
      fetchDurations();
    }
  }, [content, hasAudio, isMediaContent, isDurationAudioLoaded]);
};

export default useGetCombinedAudioData;
