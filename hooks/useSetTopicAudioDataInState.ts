import {useEffect} from 'react';

const useSetTopicAudioDataInState = ({
  structuredUnifiedData,

  topicName,
  contentWithTimeStamps,
  topicData,
  hasAlreadyBeenUnified,
  setStructuredUnifiedData,
}) => {
  useEffect(() => {
    if (
      !hasAlreadyBeenUnified &&
      contentWithTimeStamps.length === topicData.length
    ) {
      setStructuredUnifiedData(prevState => ({
        ...prevState,
        [topicName]: {content: contentWithTimeStamps},
      }));
    }
  }, [
    structuredUnifiedData,
    topicName,
    contentWithTimeStamps,
    topicData,
    hasAlreadyBeenUnified,
    setStructuredUnifiedData,
  ]);
};

export default useSetTopicAudioDataInState;
