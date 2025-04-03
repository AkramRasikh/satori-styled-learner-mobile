import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Button,
  TextInput,
  Checkbox,
  Text,
  HelperText,
  IconButton,
  ActivityIndicator,
} from 'react-native-paper';
import useData from '../context/Data/useData';
import useLanguageSelector from '../context/LanguageSelector/useLanguageSelector';

const AddSentenceContainer = ({setShowAddSentenceState}) => {
  const [mode, setMode] = useState('inquiry'); // 'inquiry' or 'translation'
  const [inquiry, setInquiry] = useState('');
  const [sentence, setSentence] = useState('');
  const [context, setContext] = useState('');
  const [includeVariations, setIncludeVariations] = useState(false);
  const [isLoadingState, setIsLoadingState] = useState(false);

  const {addAdhocSentences} = useData();
  const {languageSelectedState} = useLanguageSelector();

  const handleSubmit = async () => {
    const payload = {
      context,
      includeVariations,
    };

    if (mode === 'inquiry') {
      payload.inquiry = inquiry;
    } else {
      payload.sentence = sentence;
    }

    try {
      setIsLoadingState(true);
      await addAdhocSentences({
        ...payload,
        mode,
        language: languageSelectedState,
      });
      console.log('## payload', payload, mode);
    } catch (error) {
    } finally {
      setIsLoadingState(false);
      setShowAddSentenceState(false);
    }
  };

  return (
    <View style={{...styles.container, opacity: isLoadingState ? 0.5 : 1}}>
      {isLoadingState && (
        <ActivityIndicator
          style={{
            position: 'absolute',
            alignSelf: 'center',
            top: '30%',
            zIndex: 100,
          }}
        />
      )}
      <View style={styles.switchContainer}>
        <Button
          mode={mode === 'inquiry' ? 'contained' : 'outlined'}
          onPress={() => setMode('inquiry')}
          style={styles.pillButton}
          labelStyle={styles.pillButtonLabel}>
          Inquiry
        </Button>
        <Button
          mode={mode === 'translation' ? 'contained' : 'outlined'}
          onPress={() => setMode('translation')}
          style={styles.pillButton}
          labelStyle={styles.pillButtonLabel}>
          Translation
        </Button>
      </View>

      <View style={styles.formContainer}>
        {mode === 'inquiry' ? (
          <>
            <TextInput
              label="Inquiry"
              value={inquiry}
              onChangeText={setInquiry}
              mode="outlined"
              style={styles.input}
              multiline
            />
            <HelperText type="info" style={styles.helperText}>
              What would you like to know?
            </HelperText>
          </>
        ) : (
          <>
            <TextInput
              label="Sentence"
              value={sentence}
              onChangeText={setSentence}
              mode="outlined"
              style={styles.input}
              multiline
            />
            <HelperText type="info" style={styles.helperText}>
              Enter the sentence to translate
            </HelperText>
          </>
        )}

        <TextInput
          label="Context"
          value={context}
          onChangeText={setContext}
          mode="outlined"
          style={styles.input}
          multiline
        />
        <HelperText type="info" style={styles.helperText}>
          Provide any relevant context (optional)
        </HelperText>

        <View style={styles.checkboxContainer}>
          <Checkbox.Android
            status={includeVariations ? 'checked' : 'unchecked'}
            onPress={() => setIncludeVariations(!includeVariations)}
          />
          <Text style={styles.checkboxLabel}>Include variations</Text>
        </View>

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={mode === 'inquiry' ? !inquiry : !sentence}>
          Submit
        </Button>
        <View
          style={{
            display: 'flex',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <IconButton
            onPress={() => setShowAddSentenceState(false)}
            icon="close"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  pillButton: {
    borderRadius: 20,
    marginHorizontal: 5,
    minWidth: 120,
  },
  pillButtonLabel: {
    fontSize: 14,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 8,
  },
  helperText: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  submitButton: {
    marginTop: 10,
  },
});

export default AddSentenceContainer;
