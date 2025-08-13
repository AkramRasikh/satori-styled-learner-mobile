import {useEffect} from 'react';
import {
  checkIsFutureReviewNeeded,
  isUpForReview,
} from '../utils/is-up-for-review';
import {getGeneralTopicName} from '../utils/get-general-topic-name';
import {isMediaContent, isYoutube} from '../utils/is-media-content';

const today = new Date();

const useOnLoadContentScreen = ({
  targetLanguageLoadedContentMasterState,
  setAllTopicsMetaDataState,
  updateMetaDataState,
  languageSelectedState,
}) => {
  const generalTopicObjKeys: string[] = [];
  const allTopicsMetaData = [];
  const targetContent = [];

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

  const getTopicMetaDataAndGeneralTopicKeys = (
    topicMetaData,
    item,
    generalTopic,
  ) => {
    if (!generalTopicObjKeys.includes(generalTopic)) {
      generalTopicObjKeys.push(generalTopic);
      allTopicsMetaData.push({
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
  };

  useEffect(() => {
    targetLanguageLoadedContentMasterState.forEach(item => {
      const generalTopic = getGeneralTopicName(item.title);
      const isMedia = isMediaContent(item?.origin);
      targetContent.push({
        generalTopic,
        isMedia,
        ...item,
      });

      getTopicMetaDataAndGeneralTopicKeys(
        {
          isCore: item.isCore,
          isYoutube: isYoutube(item?.origin),
          isMediaContent:
            isYoutube(item?.origin) ||
            item?.origin === 'netflix' ||
            item?.isArticle,
          hasFutureReview: checkIsFutureReviewNeeded({
            nextReview: item?.nextReview,
            todayDate: today,
          }),
          hasAudio: item.hasAudio,
        },
        item,
        generalTopic,
      );
    });

    // setTargetLanguageLoadedContentState(
    //   targetContent.sort((a, b) => {
    //     return a.isCore === b.isCore ? 0 : a.isCore ? -1 : 1;
    //   }),
    // );
    setAllTopicsMetaDataState(allTopicsMetaData);
  }, [updateMetaDataState, languageSelectedState]);
};

export default useOnLoadContentScreen;
