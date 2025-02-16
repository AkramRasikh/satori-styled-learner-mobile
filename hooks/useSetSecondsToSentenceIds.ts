import {useEffect} from 'react';

export const mapSentenceIdsToSeconds = ({
  content,
  duration,
  isVideoModeState,
  realStartTime,
}) => {
  if (!content || !duration) {
    return [];
  }
  const arrOfSecondsMappedIds: string[] = isVideoModeState
    ? Array.from({length: realStartTime}, () => 'placeholderId')
    : [];

  content.forEach((item, index) => {
    const isFirst = index === 0;
    const isLast = index + 1 === content.length;

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
  content,
  soundDuration,
  setSecondsToSentencesMapState,
  isVideoModeState,
  realStartTime,
}) => {
  useEffect(() => {
    setSecondsToSentencesMapState(
      mapSentenceIdsToSeconds({
        content,
        duration: soundDuration,
        isVideoModeState,
        realStartTime,
      }),
    );
  }, [isVideoModeState, realStartTime, soundDuration]);
};

export default useSetSecondsToSentenceIds;
