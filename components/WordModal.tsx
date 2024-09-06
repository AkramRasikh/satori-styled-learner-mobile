import React, {useState, useEffect, useRef} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {getFirebaseAudioURL} from '../hooks/useGetCombinedAudioData';
import useMP3File from '../hooks/useMP3File';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import {SoundWidget} from './DifficultSentenceWidget';

const WordStudyAudio = ({sentenceData}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeState, setCurrentTimeState] = useState(0);

  const soundRef = useRef();

  const id = sentenceData.id;
  const topic = sentenceData.topic;
  // const isCore = sentenceData?.isCore;
  // const baseLang = sentenceData.baseLang;
  // const targetLang = sentenceData.targetLang;
  // const nextReview = sentenceData?.nextReview;
  // const isAdhoc = sentenceData?.isAdhoc;
  // const hasBeenReviewed = sentenceData?.reviewHistory?.length > 0;

  const url = getFirebaseAudioURL(id);

  const {loadFile, filePath} = useMP3File(id);

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
    loadFile(id, url);
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
      noSnips
    />
  ) : (
    <View>
      <TouchableOpacity onPress={handleLoad}>
        <Text>Load URL</Text>
      </TouchableOpacity>
    </View>
  );
};

const AnimatedModal = ({visible, onClose}) => {
  const [showModal, setShowModal] = useState(visible);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
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
    } else {
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
      ]).start(() => setShowModal(false));
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  const baseForm = visible.baseForm;
  const surfaceForm = visible.surfaceForm;
  const transliteration = visible.transliteration;
  const definition = visible.definition;
  const phonetic = visible.phonetic;
  const sentenceExamples = visible?.contextData;

  return (
    <Modal transparent visible={showModal} animationType="none">
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
          <Text style={styles.modalTitle}>{baseForm}</Text>
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
              return (
                <View key={index}>
                  <Text style={styles.modalContent}>
                    {exampleNumber} {baseLang}
                  </Text>
                  <Text style={styles.modalContent}>{targetLang}</Text>
                  <WordStudyAudio sentenceData={exampleSentence} />
                </View>
              );
            })}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxWidth: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalContent: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AnimatedModal;
