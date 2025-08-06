import React from 'react';
import {View, Text} from 'react-native';
import {Card, IconButton} from 'react-native-paper';
import Voice from '@react-native-voice/voice';

export default function TranscribeContextComponent({
  contextState,
  setContextState,
  isRecordingContextState,
  setIsRecordingContextState,
  isRecordingTranscriptRef,
  isRecordingContextRef,
}) {
  // Start recording
  const startRecordingContext = async () => {
    try {
      isRecordingTranscriptRef.current = false;
      isRecordingContextRef.current = true;
      await Voice.start('en-US');
      setIsRecordingContextState(true);
    } catch (error) {
      console.log('## startRecordingContext err', err);
    }
  };

  // Stop recording
  const stopRecordingContext = async () => {
    try {
      await Voice.stop();
      isRecordingContextRef.current = false;
      setIsRecordingContextState(false);
    } catch (err) {
      console.error('Failed to stop voice recognition:', err);
    }
  };

  return (
    <View style={{padding: 20}}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5,
          margin: 'auto',
        }}>
        <View style={{margin: 'auto'}}>
          <Text style={{textDecorationLine: 'underline'}}>Context</Text>
        </View>
        <IconButton
          icon={'record-circle'}
          onPress={
            isRecordingContextState
              ? stopRecordingContext
              : startRecordingContext
          }
          containerColor={isRecordingContextState ? 'red' : ''}
        />
        <IconButton
          icon={'delete-variant'}
          onPress={() => setContextState('')}
        />
      </View>
      <View style={{padding: 10}}>
        <Text style={{textDecorationLine: 'underline', fontStyle: 'italic'}}>
          Output:
        </Text>
        <Text style={{marginTop: 20, fontSize: 16}}>
          {contextState || '(no input yet)'}
        </Text>
      </View>
    </View>
  );
}
