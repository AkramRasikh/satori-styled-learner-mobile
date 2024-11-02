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
}) => {
  useEffect(() => {
    if (!hasAlreadyBeenUnified && durationsLengths === topicDataLengths) {
      setStructuredUnifiedData(prevState => ({
        ...prevState,
        [topicName]: {content: durations},
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
  ]);
};

export default useSetTopicAudioDataInState;
