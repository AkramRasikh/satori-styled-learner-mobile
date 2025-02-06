import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import useHighlightWordToWordBank from '../hooks/useHighlightWordToWordBank';
import SRSToggles from './SRSToggles';
import DeleteWordSection from './DeleteWordSection';

import {DefaultTheme, Text} from 'react-native-paper';
import FlashCardAudio from './FlashCard/FlashCardAudio';

const AnimatedWordModal = ({
  wordData,
  onClose,
  deleteWord,
  collapseAnimation,
}) => {
  const id = wordData.id;
  const baseForm = wordData.baseForm;
  const surfaceForm = wordData.surfaceForm;
  const transliteration = wordData.transliteration;
  const definition = wordData.definition;
  const phonetic = wordData.phonetic || transliteration;
  const sentenceExamples = wordData?.contextData;
  const reviewData = wordData?.reviewData;

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: [baseForm, surfaceForm],
  });

  const getSafeText = targetText => {
    const textSegments = underlineWordsInSentence(targetText);
    return textSegments.map((segment, index) => {
      return (
        <Text key={index} id={segment.id} style={[segment.style]}>
          {segment.text}
        </Text>
      );
    });
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.background}
        onPress={onClose}
        activeOpacity={1}
      />
      <View style={[styles.modalContainer]}>
        <Text style={styles.modalContent}>Surface Form: {surfaceForm}</Text>
        <Text style={styles.modalContent}>Definition: {definition}</Text>
        <Text style={styles.modalContent}>Phonetic: {phonetic}</Text>
        <Text style={styles.modalContent}>
          Transliteration: {transliteration}
        </Text>
        <View>
          {sentenceExamples?.map((exampleSentence, index) => {
            const exampleNumber = index + 1 + ') ';
            const baseLang = exampleSentence.baseLang;
            const targetLang = exampleSentence.targetLang;
            const isMediaContent = exampleSentence.isMediaContent;
            return (
              <View key={index}>
                <Text style={styles.modalContent}>
                  {exampleNumber} {baseLang}
                </Text>
                <Text style={styles.modalContent}>
                  {getSafeText(targetLang)}
                </Text>
                <FlashCardAudio
                  sentenceData={exampleSentence}
                  isMediaContent={isMediaContent}
                />
              </View>
            );
          })}
        </View>
        <DeleteWordSection deleteContent={deleteWord} />
        <SRSToggles
          reviewData={reviewData}
          id={id}
          baseForm={baseForm}
          onCloseModal={onClose}
          collapseAnimation={collapseAnimation}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    padding: 10,
    borderRadius: 10,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    width: '100%',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  modalContent: {
    ...DefaultTheme.fonts.bodyLarge,
    marginBottom: 10,
  },
  closeButton: {
    padding: 5,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    textAlign: 'right',
    color: '#fff',
    fontSize: 16,
  },
});

export default AnimatedWordModal;
