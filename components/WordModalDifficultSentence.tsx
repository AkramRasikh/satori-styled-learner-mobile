import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import useHighlightWordToWordBank from '../hooks/useHighlightWordToWordBank';
import {DifficultSentencesSRSToggles} from './SRSToggles';
import DeleteWordSection from './DeleteWordSection';

const useFadeInModal = ({fadeAnim, scaleAnim}) => {
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

    return () => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.8,
          friction: 8,
          useNativeDriver: true,
        }),
      ]);
    };
  }, []);
};

const ModalBaseUI = ({
  onClose,
  baseForm,
  surfaceForm,
  definition,
  phonetic,
  transliteration,
  mnemonic,
}) => {
  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}>
        <Text style={styles.modalTitle}>{baseForm}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.modalContent}>Surface Form: {surfaceForm}</Text>
      <Text style={styles.modalContent}>Definition: {definition}</Text>
      <Text style={styles.modalContent}>Phonetic: {phonetic}</Text>
      <Text style={styles.modalContent}>
        Transliteration: {transliteration}
      </Text>
      <Text style={styles.modalContent}>Mnemonic: {mnemonic}</Text>
    </>
  );
};

const WordModalDifficultSentence = ({
  visible,
  onClose,
  deleteWord,
  updateWordData,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const id = visible.id;
  const baseForm = visible.baseForm;
  const surfaceForm = visible.surfaceForm;
  const transliteration = visible.transliteration;
  const definition = visible.definition;
  const mnemonic = visible?.mnemonic;
  const phonetic = visible.phonetic || transliteration;
  const sentenceExamples = visible?.contextData;
  const reviewData = visible?.reviewData;

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: [baseForm, surfaceForm],
  });

  useFadeInModal({fadeAnim, scaleAnim});

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
      <Animated.View
        style={[
          styles.modalContainer,
          {opacity: fadeAnim, transform: [{scale: scaleAnim}]},
        ]}>
        <ModalBaseUI
          onClose={onClose}
          baseForm={baseForm}
          surfaceForm={surfaceForm}
          definition={definition}
          phonetic={phonetic}
          transliteration={transliteration}
          mnemonic={mnemonic}
        />
        <View>
          {sentenceExamples?.map((exampleSentence, index) => {
            const exampleNumber = index + 1 + ') ';
            const baseLang = exampleSentence.baseLang;
            const targetLang = exampleSentence.targetLang;
            // const isMediaContent = exampleSentence.isMediaContent;
            return (
              <View key={index}>
                <Text style={styles.modalContent}>
                  {exampleNumber} {baseLang}
                </Text>
                <Text style={styles.modalContent}>
                  {getSafeText(targetLang)}
                </Text>
                {/* <WordStudyAudio
                  sentenceData={exampleSentence}
                  isMediaContent={isMediaContent}
                /> */}
              </View>
            );
          })}
        </View>
        {!reviewData ? (
          <View>
            <Text style={{fontStyle: 'italic'}}>Not yet reviewed</Text>
          </View>
        ) : null}
        <DifficultSentencesSRSToggles
          id={id}
          reviewData={reviewData}
          baseForm={baseForm}
          updateWordData={updateWordData}
        />
        <DeleteWordSection deleteContent={deleteWord} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: '20%',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: 10,
  },
  background: {},
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
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
    fontSize: 16,
    marginBottom: 20,
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

export default WordModalDifficultSentence;
