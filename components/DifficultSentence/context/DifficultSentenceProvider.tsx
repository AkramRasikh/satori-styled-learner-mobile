import React, {useRef, useState, createContext, PropsWithChildren} from 'react';
import {Animated} from 'react-native';
import {
  getCardDataRelativeToNow,
  getDueDate,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../../../srs-algo';
import Clipboard from '@react-native-clipboard/clipboard';
import useAnimation from '../../../hooks/useAnimation';
import {srsCalculationAndText} from '../../../utils/srs/srs-calculation-and-text';

export const DifficultSentenceContext = createContext(null);

export const DifficultSentenceProvider = ({
  updateSentenceData,
  sentence,
  openGoogleTranslateApp,
  children,
}: PropsWithChildren<{}>) => {
  const [matchedWordListState, setMatchedWordListState] = useState([]);
  const [isTriggeringReview, setIsTriggeringReview] = useState(false);
  const [isCollapsingState, setIsCollapsingState] = useState(false);
  const [showSentenceBreakDown, setShowSentenceBreakDown] = useState(false);
  const [quickTranslationArr, setQuickTranslationArr] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const soundRef = useRef();

  const {collapseAnimation} = useAnimation({
    fadeAnim,
    scaleAnim,
  });

  const reviewData = sentence?.reviewData;
  const isAdhoc = sentence?.isAdhoc;

  const hasDueDate = getDueDate(reviewData);

  const nextReview = sentence?.nextReview;
  const reviewHistory = sentence?.reviewHistory;

  const hasSentenceBreakdown = sentence?.vocab;
  const revealSentenceBreakdown = showSentenceBreakDown && hasSentenceBreakdown;

  const cardDataRelativeToNow = getCardDataRelativeToNow({
    hasDueDate,
    reviewData,
    nextReview,
    reviewHistory,
  });

  const isEasyFollowedByDeletion = () => {
    const nextScheduledOptions = getNextScheduledOptions({
      card: cardDataRelativeToNow,
      contentType: srsRetentionKeyTypes.sentences,
    });
    const nextReviewData = nextScheduledOptions['4'].card;
    const futureReviewData = srsCalculationAndText({
      reviewData: nextReviewData,
      contentType: srsRetentionKeyTypes.sentences,
      timeNow: new Date(),
    });

    return futureReviewData.isScheduledForDeletion;
  };

  const handleSentenceBreakDownState = () => {
    setShowSentenceBreakDown(!showSentenceBreakDown);
  };

  const stopAudioOnUnmount = () => {
    if (soundRef?.current) {
      soundRef?.current.stop(() => {});
    }
  };

  const handleDeleteContent = async () => {
    try {
      stopAudioOnUnmount();
      setIsTriggeringReview(true);
      await collapseAnimation();
      setIsCollapsingState(true);
      updateSentenceData({
        isAdhoc: sentence?.isAdhoc,
        topicName: sentence.topic,
        sentenceId: sentence.id,
        fieldToUpdate: sentence?.isAdhoc
          ? {
              reviewData: {},
            }
          : {
              removeReview: true,
            },
        contentIndex: sentence?.contentIndex,
        indexKey: sentence?.indexKey,
      });
    } catch (error) {
    } finally {
      setIsTriggeringReview(false);
      setIsCollapsingState(false);
    }
  };

  const handleOpenUpGoogle = () => {
    openGoogleTranslateApp(sentence.targetLang);
  };

  const handleNextReview = async difficulty => {
    try {
      stopAudioOnUnmount();
      setIsTriggeringReview(true);
      const nextScheduledOptions = getNextScheduledOptions({
        card: cardDataRelativeToNow,
        contentType: srsRetentionKeyTypes.sentences,
      });
      const nextReviewData = nextScheduledOptions[difficulty].card;
      const futureReviewData = srsCalculationAndText({
        reviewData: nextReviewData,
        contentType: srsRetentionKeyTypes.sentences,
        timeNow: new Date(),
      });

      await collapseAnimation();
      setIsCollapsingState(true);
      if (futureReviewData.isScheduledForDeletion) {
        await updateSentenceData({
          isAdhoc: sentence?.isAdhoc,
          topicName: sentence.topic,
          sentenceId: sentence.id,
          fieldToUpdate: sentence?.isAdhoc
            ? {
                reviewData: {},
              }
            : {
                removeReview: true,
              },
          contentIndex: sentence?.contentIndex,
          indexKey: sentence?.indexKey,
        });
      } else {
        await updateSentenceData({
          isAdhoc,
          topicName: sentence.topic,
          sentenceId: sentence.id,
          fieldToUpdate: {
            reviewData: nextReviewData,
          },
          contentIndex: sentence?.contentIndex,
          indexKey: sentence?.indexKey,
        });
      }
    } catch (error) {
    } finally {
      setIsTriggeringReview(true);
      setIsCollapsingState(false);
    }
  };

  const handleCopyText = () => {
    Clipboard.setString(sentence.targetLang);
  };

  return (
    <DifficultSentenceContext.Provider
      value={{
        handleNextReview,
        handleCopyText,
        handleDeleteContent,
        fadeAnim,
        scaleAnim,
        handleOpenUpGoogle,
        matchedWordListState,
        setMatchedWordListState,
        isTriggeringReview,
        handleSentenceBreakDownState,
        revealSentenceBreakdown,
        hasSentenceBreakdown,
        quickTranslationArr,
        setQuickTranslationArr,
        collapseAnimation,
        isEasyFollowedByDeletion,
        isCollapsingState,
        soundRef,
      }}>
      {children}
    </DifficultSentenceContext.Provider>
  );
};
