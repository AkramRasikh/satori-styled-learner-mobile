import {useEffect} from 'react';

export const mapSentenceIdsToSeconds = ({
  contentArr,
  duration,
  isVideoModeState,
  realStartTime,
}) => {
  if (!contentArr || !duration) {
    return null;
  }
  const arrOfSecondsMappedIds: string[] = isVideoModeState
    ? Array.from({length: realStartTime}, () => 'placehoddlderId')
    : [];

  contentArr.forEach((item, index) => {
    const isFirst = index === 0;
    const isLast = index + 1 === contentArr.length;

    const startAt = isFirst ? 0 : item.startAt;
    const endAt = isLast ? duration : item.endAt - 1;
    const secondsArr = Array.from({length: endAt - startAt + 1}, (_, i) => {
      arrOfSecondsMappedIds.push(item.id);
      return startAt + i;
    });
    return {
      secondsArr,
      id: item.id,
    };
  });

  return arrOfSecondsMappedIds;
};

const useSetSecondsToSentenceIds = ({
  durations,
  soundDuration,
  secondsToSentencesMapState,
  setSecondsToSentencesMapState,
  isVideoModeState,
  realStartTime,
}) => {
  useEffect(() => {
    const durationsLengths = durations.length;
    if (
      soundDuration &&
      durationsLengths > 0 &&
      secondsToSentencesMapState?.length === 0
    ) {
      const mappedIds = mapSentenceIdsToSeconds({
        contentArr: durations,
        duration: soundDuration,
        isVideoModeState,
        realStartTime,
      }) as string[];
      setSecondsToSentencesMapState(mappedIds);
    }
  }, [
    soundDuration,
    secondsToSentencesMapState,
    durations,
    setSecondsToSentencesMapState,
  ]);

  useEffect(() => {
    if (isVideoModeState) {
      const mappedIds = mapSentenceIdsToSeconds({
        contentArr: durations,
        duration: soundDuration,
        isVideoModeState,
        realStartTime,
      }) as string[];
      setSecondsToSentencesMapState(mappedIds);
    }
  }, [isVideoModeState]);
};

export default useSetSecondsToSentenceIds;
