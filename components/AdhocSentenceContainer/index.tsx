import {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import {getGeneralTopicName} from '../../utils/get-general-topic-name';
import useData from '../../context/Data/useData';
import SatoriLineReviewSection from '../SatoriLineReviewSection';
import useLoadAudioInstance from '../../hooks/useLoadAudioInstance';
import useMP3File from '../../hooks/useMP3File';
import {getFirebaseAudioURL} from '../../hooks/useGetCombinedAudioData';
import {SoundWidget} from '../DifficultSentenceWidget';

const AdhocSentenceResponse = ({
  topic,
  tags,
  context,
  adhocObjectData,
  setShowAdhocSentence,
}) => {
  const [futureDaysState, setFutureDaysState] = useState(3);

  const id = adhocObjectData.id;
  const hasAudio = adhocObjectData?.hasAudio;
  const notes = adhocObjectData?.notes;
  const targetLang = adhocObjectData.targetLang;
  const baseLang = adhocObjectData.baseLang;
  const nextReview = adhocObjectData.nextReview;

  const soundRef = useRef();
  const url = getFirebaseAudioURL(id);

  const {loadFile, filePath} = useMP3File(id);

  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
  });

  useEffect(() => {
    if (filePath && hasAudio) {
      triggerLoadURL();
    }
  }, [filePath]);

  const handleLoad = () => {
    loadFile(id, url);
  };

  const updateSentenceData = () => {
    Alert.alert('Oops', 'Yet to implement this');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <Button onPress={() => setShowAdhocSentence(false)} title="❌" />
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.label}>Base Language:</Text>
        <Text style={styles.value}>{baseLang}</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.label}>Target Language:</Text>
        <Text style={styles.value}>{targetLang}</Text>
      </View>
      {topic && (
        <View style={styles.itemContainer}>
          <Text style={styles.label}>Topic:</Text>
          <Text style={styles.value}>{topic}</Text>
        </View>
      )}
      {context && (
        <View style={styles.itemContainer}>
          <Text style={styles.label}>Context:</Text>
          <Text style={styles.value}>{context}</Text>
        </View>
      )}
      {notes && (
        <View style={styles.itemContainer}>
          <Text style={styles.label}>Notes:</Text>
          <Text style={styles.value}>{notes}</Text>
        </View>
      )}
      {tags && (
        <View style={styles.itemContainer}>
          <Text style={styles.label}>tags:</Text>
          <Text style={styles.value}>{tags}</Text>
        </View>
      )}
      <SatoriLineReviewSection
        nextReview={nextReview}
        futureDaysState={futureDaysState}
        setFutureDaysState={setFutureDaysState}
        setNextReviewDate={updateSentenceData}
      />
      {isLoaded ? (
        <SoundWidget soundRef={soundRef} url={url} topicName={topic} />
      ) : (
        <View>
          <TouchableOpacity onPress={handleLoad}>
            <Text>Load URL</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const AdhocSentenceContainer = ({setShowAdhocSentence, topicName}) => {
  const [topic, setTopic] = useState('');
  const [tags, setTags] = useState('');
  const [adhocText, setAdhocText] = useState('');
  const [context, setContext] = useState('');
  // {
  //   id: '7ef64c2f-9ec2-45dd-9d89-2610428bd1e6',
  //   hasAudio: '7ef64c2f-9ec2-45dd-9d89-2610428bd1e6',
  //   notes: 'notes',
  //   targetLang: 'target ting',
  //   baseLang: 'base ting',
  //   nextReview: '2024-09-18T16:52:41.965Z',
  // }
  const [adhocObjectData, setAdhocObjectData] = useState(null);
  const {addAdhocSentenceFunc, isAdhocDataLoading} = useData();

  useEffect(() => {
    if (topicName) {
      setTopic(getGeneralTopicName(topicName));
    }
  }, []);

  const handleSubmit = async () => {
    if (!topic || !adhocText) {
      Alert.alert(
        'Error',
        'Please fill in both the Topic and AdhocText fields.',
      );
      return;
    }

    try {
      const res = await addAdhocSentenceFunc({
        baseLang: adhocText,
        context,
        topic,
        tags,
      });
      setAdhocObjectData(res);
    } catch (error) {
      console.log('## Error handleSubmit (AdhocSentenceContainer)', error);
    }

    // Submit the data (for now, just log it)
    Alert.alert('Success', 'Form submitted successfully!');
  };

  const isSubmitDisabled = !topic || !adhocText;

  if (adhocObjectData && !isAdhocDataLoading) {
    return (
      <AdhocSentenceResponse
        topic={topic}
        tags={tags}
        context={context}
        adhocObjectData={adhocObjectData}
        setShowAdhocSentence={setShowAdhocSentence}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={100}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
        }}>
        <Button onPress={() => setShowAdhocSentence(false)} title="❌" />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Topic</Text>
          <TextInput
            style={styles.input}
            value={topic}
            onChangeText={setTopic}
            placeholder="Enter topic"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tags</Text>
          <TextInput
            style={styles.input}
            value={tags}
            onChangeText={setTags}
            placeholder='E.g. "coffee" "food" "ancedote"'
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Adhoc Text</Text>
          <TextInput
            style={styles.input}
            value={adhocText}
            onChangeText={setAdhocText}
            placeholder="Enter adhoc text"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Context</Text>
          <TextInput
            style={styles.input}
            value={context}
            onChangeText={setContext}
            placeholder="Enter context"
          />
        </View>

        <Button
          title="Submit"
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
        />
      </ScrollView>
      {isAdhocDataLoading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 4,
    fontSize: 16,
  },
  itemContainer: {
    marginBottom: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Slightly opaque background
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
});

export default AdhocSentenceContainer;
