import React, {useEffect, useRef} from 'react';
import {Animated} from 'react-native';
import {createContext, PropsWithChildren} from 'react';
import {
  getCardDataRelativeToNow,
  getDueDate,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../../../srs-algo';
import Clipboard from '@react-native-clipboard/clipboard';
import useOpenGoogleTranslate from '../../useOpenGoogleTranslate';

export const DifficultSentenceContext = createContext(null);

export const DifficultSentenceProvider = ({
  updateSentenceData,
  sentence,
  children,
}: PropsWithChildren<{}>) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const collapseCard = async () => {
    return new Promise(resolve => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.8,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start(() => resolve());
    });
  };

  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const reviewData = sentence?.reviewData;
  const isAdhoc = sentence?.isAdhoc;

  const hasDueDate = getDueDate(reviewData);

  const nextReview = sentence?.nextReview;
  const reviewHistory = sentence?.reviewHistory;

  const hasLegacyReviewSystem = !reviewData?.due && nextReview;

  const cardDataRelativeToNow = getCardDataRelativeToNow({
    hasDueDate,
    reviewData,
    nextReview,
    reviewHistory,
  });

  const getShouldRemoveLegacyFields = () => {
    if (hasLegacyReviewSystem) {
      return {
        nextReview: null,
        reviewHistory: null,
      };
    }
    return {};
  };

  const handleDeleteContent = async () => {
    await collapseCard();
    updateSentenceData({
      isAdhoc: sentence?.isAdhoc,
      topicName: sentence.topic,
      sentenceId: sentence.id,
      fieldToUpdate: {
        reviewData: null,
        nextReview: null,
        reviewHistory: null,
      },
      contentIndex: sentence?.contentIndex,
    });
  };

  const handleOpenUpGoogle = () => {
    openGoogleTranslateApp(sentence.targetLang);
  };

  const handleNextReview = async difficulty => {
    const nextScheduledOptions = getNextScheduledOptions({
      card: cardDataRelativeToNow,
      contentType: srsRetentionKeyTypes.sentences,
    });
    const nextReviewData = nextScheduledOptions[difficulty].card;
    await collapseCard();
    await updateSentenceData({
      isAdhoc,
      topicName: sentence.topic,
      sentenceId: sentence.id,
      fieldToUpdate: {
        reviewData: nextReviewData,
        ...getShouldRemoveLegacyFields(),
      },
      contentIndex: sentence.contentIndex,
    });
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
      }}>
      {children}
    </DifficultSentenceContext.Provider>
  );
};
