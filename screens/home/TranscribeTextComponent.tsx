import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  Text,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Voice from '@react-native-voice/voice';

export default function TranscribeTextComponent() {
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  // Handle speech results
  useEffect(() => {
    Voice.onSpeechResults = event => {
      if (event.value && event.value.length > 0) {
        setTranscript(event.value[0]);
      }
    };

    Voice.onSpeechError = e => {
      console.error('Speech error:', e.error);
      Alert.alert('Speech Error', e.error.message || 'Unknown error');
      setIsRecording(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Request permission (Android only)
  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Start recording
  const startRecording = async () => {
    // const permissionGranted = await requestPermission();
    // if (!permissionGranted) {
    //   Alert.alert('Permission denied', 'Microphone access is required.');
    //   return;
    // }

    try {
      await Voice.start('en-US');
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start voice recognition:', err);
    }
  };

  // Stop recording
  const stopRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (err) {
      console.error('Failed to stop voice recognition:', err);
    }
  };

  return (
    <View style={{padding: 20}}>
      <Button
        title={isRecording ? 'Stop Listening' : 'Start Listening'}
        onPress={isRecording ? stopRecording : startRecording}
      />
      <Text style={{marginTop: 20, fontSize: 16}}>
        📝 Transcript: {transcript || '(no input yet)'}
      </Text>
    </View>
  );
}
