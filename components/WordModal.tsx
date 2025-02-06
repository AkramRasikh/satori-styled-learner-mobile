import React, {useState, useEffect, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {getFirebaseAudioURL} from '../hooks/useGetCombinedAudioData';
import useMP3File from '../hooks/useMP3File';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import useHighlightWordToWordBank from '../hooks/useHighlightWordToWordBank';
import SRSToggles from './SRSToggles';
import DeleteWordSection from './DeleteWordSection';
import useLanguageSelector from '../context/LanguageSelector/useLanguageSelector';
import SoundWidget from './SoundWidget';
import {Button, DefaultTheme, Text} from 'react-native-paper';

const WordStudyAudio = ({sentenceData, isMediaContent}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const {languageSelectedState} = useLanguageSelector();

  const soundRef = useRef();

  const id = sentenceData.id;
  const topic = sentenceData.topic;
  const title = sentenceData.fullTitle;
  const audioId = isMediaContent ? title : id;

  const url = getFirebaseAudioURL(audioId, languageSelectedState);

  const {loadFile, filePath} = useMP3File(audioId);

  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
  });

  useEffect(() => {
    if (filePath) {
      triggerLoadURL();
    }
  }, [filePath]);

  const handleLoad = () => {
    loadFile(audioId, url);
  };

  return isLoaded ? (
    <SoundWidget
      soundRef={soundRef}
      url={url}
      topicName={topic}
      sentence={sentenceData}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
      currentTimeState={currentTimeState}
      setCurrentTimeState={setCurrentTimeState}
      isMediaContent={isMediaContent}
    />
  ) : (
    <Button
      onPress={handleLoad}
      mode="outlined"
      style={{
        marginBottom: 10,
      }}>
      Load URL
    </Button>
  );
};

const AnimatedWordModal = ({
  visible,
  onClose,
  deleteWord,
  collapseAnimation,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const id = visible.id;
  const baseForm = visible.baseForm;
  const surfaceForm = visible.surfaceForm;
  const transliteration = visible.transliteration;
  const definition = visible.definition;
  const phonetic = visible.phonetic || transliteration;
  const sentenceExamples = visible?.contextData;
  const reviewData = visible?.reviewData;

  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: [baseForm, surfaceForm],
  });

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
                <WordStudyAudio
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
      </Animated.View>
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
