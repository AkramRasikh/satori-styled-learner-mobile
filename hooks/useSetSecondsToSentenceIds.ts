import {useEffect} from 'react';

export const mapSentenceIdsToSeconds = ({
  contentWithTimeStamps,
  duration,
  isVideoModeState,
  realStartTime,
}) => {
  if (!contentWithTimeStamps || !duration) {
    return null;
  }
  const arrOfSecondsMappedIds: string[] = isVideoModeState
    ? Array.from({length: realStartTime}, () => 'placehoddlderId')
    : [];

  contentWithTimeStamps.forEach((item, index) => {
    const isFirst = index === 0;
    const isLast = index + 1 === contentWithTimeStamps.length;

    const startAt = isFirst ? 0 : item.startAt;
    const endAt = isLast ? duration : item.endAt - 1;
    const arrayLength = Math.round(endAt - startAt + 1);
    const secondsArr = Array.from({length: arrayLength}, (_, i) => {
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
  contentWithTimeStamps,
  soundDuration,
  secondsToSentencesMapState,
  setSecondsToSentencesMapState,
  isVideoModeState,
  realStartTime,
}) => {
  useEffect(() => {
    const hasFormattedContent = contentWithTimeStamps.length;
    if (
      soundDuration &&
      hasFormattedContent > 0 &&
      secondsToSentencesMapState?.length === 0
    ) {
      const mappedIds = mapSentenceIdsToSeconds({
        contentWithTimeStamps,
        duration: soundDuration,
        isVideoModeState,
        realStartTime,
      }) as string[];
      setSecondsToSentencesMapState(mappedIds);
    }
  }, [
    realStartTime,
    isVideoModeState,
    soundDuration,
    secondsToSentencesMapState,
    contentWithTimeStamps,
    setSecondsToSentencesMapState,
  ]);
};

export default useSetSecondsToSentenceIds;
