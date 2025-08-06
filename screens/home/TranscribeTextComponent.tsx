import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Alert} from 'react-native';
import {Card, Divider, IconButton} from 'react-native-paper';
import Voice from '@react-native-voice/voice';
import TranscribeContextComponent from './TranscribeContextComponent';

export default function TranscribeTextComponent() {
  const [transcriptState, setTranscriptState] = useState('');
  const [isRecordingTranscriptState, setIsRecordingTranscriptState] =
    useState(false);
  const [contextState, setContextState] = useState('');
  const [isRecordingContextState, setIsRecordingContextState] = useState(false);

  const isRecordingTranscriptRef = useRef(false); // 👈 live state tracker
  const isRecordingContextRef = useRef(false); // 👈 live state tracker

  // Handle speech results
  useEffect(() => {
    Voice.onSpeechResults = event => {
      if (event.value && event.value.length > 0) {
        if (isRecordingTranscriptRef.current) {
          setTranscriptState(event.value[0]);
        } else if (isRecordingContextRef.current) {
          setContextState(event.value[0]);
        }
      }
    };

    Voice.onSpeechError = e => {
      console.error('## Speech error:', e.error);
      Alert.alert('Speech Error', e.error.message || 'Unknown error');
      setIsRecordingTranscriptState(false);
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // Start recording
  const startRecordingTranscript = async () => {
    try {
      isRecordingTranscriptRef.current = true;
      await Voice.start('en-US');
      setIsRecordingTranscriptState(true);
    } catch (err) {
      console.error('Failed to start voice recognition:', err);
    }
  };

  // Stop recording
  const stopRecordingTranscript = async () => {
    try {
      isRecordingTranscriptRef.current = false;
      await Voice.stop();
      setIsRecordingTranscriptState(false);
    } catch (err) {
      console.error('Failed to stop voice recognition:', err);
    }
  };

  return (
    <View style={{padding: 20}}>
      <Card>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 5,
            margin: 'auto',
          }}>
          <View style={{margin: 'auto'}}>
            <Text style={{textDecorationLine: 'underline'}}>Transcript</Text>
          </View>
          <IconButton
            icon={'record-circle'}
            onPress={
              isRecordingTranscriptState
                ? stopRecordingTranscript
                : startRecordingTranscript
            }
            containerColor={isRecordingTranscriptState ? 'red' : ''}
          />
          <IconButton
            icon={'delete-variant'}
            onPress={() => setTranscriptState('')}
          />
        </View>
        <View style={{padding: 10}}>
          <Text style={{textDecorationLine: 'underline', fontStyle: 'italic'}}>
            Output:
          </Text>
          <Text style={{marginTop: 20, fontSize: 16}}>
            {transcriptState || '(no input yet)'}
          </Text>
        </View>
        {transcriptState && !isRecordingTranscriptState && (
          <>
            <Divider
              bold
              style={{
                backgroundColor: 'gray',
                width: '80%',
                margin: 'auto',
                opacity: 0.8,
              }}
            />
            <TranscribeContextComponent
              contextState={contextState}
              setContextState={setContextState}
              isRecordingContextState={isRecordingContextState}
              setIsRecordingContextState={setIsRecordingContextState}
              isRecordingTranscriptRef={isRecordingTranscriptRef}
              isRecordingContextRef={isRecordingContextRef}
            />
          </>
        )}
      </Card>
    </View>
  );
}
