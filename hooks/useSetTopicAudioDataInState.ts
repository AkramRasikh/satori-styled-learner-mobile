import {useEffect} from 'react';

const useSetTopicAudioDataInState = ({
  structuredUnifiedData,
  durationsLengths,
  topicName,
  durations,
  topicData,
  hasAlreadyBeenUnified,
  setStructuredUnifiedData,
  topicDataLengths,
  audioInstance,
}) => {
  useEffect(() => {
    if (
      !hasAlreadyBeenUnified &&
      durationsLengths === topicDataLengths &&
      audioInstance?.isLoaded()
    ) {
      setStructuredUnifiedData(prevState => ({
        ...prevState,
        [topicName]: {content: durations, audioInstance},
      }));
    }
  }, [
    structuredUnifiedData,
    durationsLengths,
    topicName,
    durations,
    topicData,
    hasAlreadyBeenUnified,
    setStructuredUnifiedData,
    topicDataLengths,
    audioInstance,
  ]);
};

export default useSetTopicAudioDataInState;
