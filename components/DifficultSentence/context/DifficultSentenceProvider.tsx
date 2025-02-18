import React, {useRef, useState} from 'react';
import {Animated} from 'react-native';
import {createContext, PropsWithChildren} from 'react';
import {
  getCardDataRelativeToNow,
  getDueDate,
  getNextScheduledOptions,
  srsRetentionKeyTypes,
} from '../../../srs-algo';
import Clipboard from '@react-native-clipboard/clipboard';
import useAnimation from '../../../hooks/useAnimation';

export const DifficultSentenceContext = createContext(null);

export const DifficultSentenceProvider = ({
  updateSentenceData,
  sentence,
  openGoogleTranslateApp,
  children,
}: PropsWithChildren<{}>) => {
  const [matchedWordListState, setMatchedWordListState] = useState([]);
  const [isTriggeringReview, setIsTriggeringReview] = useState(false);
  const [showSentenceBreakDown, setShowSentenceBreakDown] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

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

  const hasLegacyReviewSystem = !reviewData?.due && nextReview;

  const cardDataRelativeToNow = getCardDataRelativeToNow({
    hasDueDate,
    reviewData,
    nextReview,
    reviewHistory,
  });

  const handleSentenceBreakDownState = () => {
    setShowSentenceBreakDown(!showSentenceBreakDown);
  };

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
    try {
      setIsTriggeringReview(true);
      await collapseAnimation();
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
    } catch (error) {
    } finally {
      setIsTriggeringReview(false);
    }
  };

  const handleOpenUpGoogle = () => {
    openGoogleTranslateApp(sentence.targetLang);
  };

  const handleNextReview = async difficulty => {
    try {
      setIsTriggeringReview(true);
      const nextScheduledOptions = getNextScheduledOptions({
        card: cardDataRelativeToNow,
        contentType: srsRetentionKeyTypes.sentences,
      });
      const nextReviewData = nextScheduledOptions[difficulty].card;
      await collapseAnimation();
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
    } catch (error) {
    } finally {
      setIsTriggeringReview(true);
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
      }}>
      {children}
    </DifficultSentenceContext.Provider>
  );
};
