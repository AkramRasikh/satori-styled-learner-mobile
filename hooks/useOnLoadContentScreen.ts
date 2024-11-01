import {useEffect} from 'react';
import {
  checkIsFutureReviewNeeded,
  isUpForReview,
} from '../utils/is-up-for-review';
import {getGeneralTopicName} from '../utils/get-general-topic-name';
import {isMediaContent, isYoutube} from '../utils/is-media-content';

const today = new Date();

const useOnLoadContentScreen = ({
  targetLanguageLoadedContentMaster,
  setTargetLanguageLoadedContentState,
  setGeneralTopicObjKeysState,
  setAllTopicsMetaDataState,
}) => {
  const generalTopicObjKeys = [];
  const generalTopicWithMetaData = [];
  const allTopicsMetaData = [];
  const targetContent = [];

  useEffect(() => {
    const getGeneralTopicDueStatus = generalTopicTitle =>
      targetContent.some(jpContent => {
        const generalTopicName = jpContent.generalTopic;

        if (generalTopicName === generalTopicTitle) {
          const nextReview = jpContent?.nextReview;
          if (nextReview) {
            return isUpForReview({nextReview, todayDate: today});
          }
          return false;
        }
      });

    targetLanguageLoadedContentMaster.forEach(item => {
      const generalTopic = getGeneralTopicName(item.title);
      const isMedia = isMediaContent(item?.origin);
      targetContent.push({
        generalTopic,
        isMedia,
        ...item,
      });

      const topicMetaData = {
        isCore: item.isCore,
        isYoutube: isYoutube(item?.origin),
        hasFutureReview: checkIsFutureReviewNeeded({
          nextReview: item?.nextReview,
          todayDate: today,
        }),
        hasAudio: item.hasAudio,
      };

      if (!generalTopicObjKeys.includes(generalTopic)) {
        generalTopicObjKeys.push(generalTopic);
        generalTopicWithMetaData.push({
          ...topicMetaData,
          title: generalTopic,
          isGeneral: true,
          isDue: getGeneralTopicDueStatus(generalTopic),
        });
      }
      allTopicsMetaData.push({
        ...topicMetaData,
        title: item.title,
        generalTopic: generalTopic,
        isDue: item?.nextReview
          ? isUpForReview({nextReview: item?.nextReview, todayDate: today})
          : false,
        isGeneral: false,
      });
    });

    setTargetLanguageLoadedContentState(
      targetContent.sort((a, b) => {
        return a.isCore === b.isCore ? 0 : a.isCore ? -1 : 1;
      }),
    );

    setGeneralTopicObjKeysState(generalTopicWithMetaData);
    setAllTopicsMetaDataState(allTopicsMetaData);
  }, []);
};

export default useOnLoadContentScreen;
