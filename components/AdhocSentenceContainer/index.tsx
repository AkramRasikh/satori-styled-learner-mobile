import {useEffect, useState} from 'react';
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
} from 'react-native';

import {getGeneralTopicName} from '../../utils/get-general-topic-name';

const AdhocSentenceContainer = ({setShowAdhocSentence, topicName}) => {
  const [topic, setTopic] = useState('');
  const [tags, setTags] = useState('');
  const [adhocText, setAdhocText] = useState('');
  const [context, setContext] = useState('');

  useEffect(() => {
    if (topicName) {
      setTopic(getGeneralTopicName(topicName));
    }
  }, []);

  const handleSubmit = () => {
    // Check that required fields are filled
    if (!topic || !adhocText) {
      Alert.alert(
        'Error',
        'Please fill in both the Topic and AdhocText fields.',
      );
      return;
    }

    // Submit the data (for now, just log it)
    console.log({topic, tags, adhocText, context});
    Alert.alert('Success', 'Form submitted successfully!');
  };

  const isSubmitDisabled = !topic || !adhocText;

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
});

export default AdhocSentenceContainer;
