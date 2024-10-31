import GeneralTopics from './GeneralTopics';
import TopicsToDisplay from './TopicsToDisplay';

const Topics = ({
  allTopicsMetaDataState,
  selectedGeneralTopicState,
  handleShowGeneralTopic,
  generalTopicObjKeysState,
  handleShowTopic,
}) => {
  return (
    <>
      {!selectedGeneralTopicState ? (
        <GeneralTopics
          handleShowGeneralTopic={handleShowGeneralTopic}
          generalTopicsToDisplay={generalTopicObjKeysState}
        />
      ) : (
        <TopicsToDisplay
          allTopicsMetaDataState={allTopicsMetaDataState}
          handleShowTopic={handleShowTopic}
          selectedGeneralTopicState={selectedGeneralTopicState}
        />
      )}
    </>
  );
};

export default Topics;
