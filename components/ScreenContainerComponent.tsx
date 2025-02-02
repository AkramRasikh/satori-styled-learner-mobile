import React from 'react';
import {SafeAreaView} from 'react-native';
import UpdateStatusSnackBar from './UpdateStatusSnackBar';

const ScreenContainerComponent = ({
  updatePromptState,
  marginBottom = 0,
  children,
}) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#FFEEEE',
        minHeight: '100%',
        marginBottom,
      }}>
      {children}
      {updatePromptState && (
        <UpdateStatusSnackBar updatePromptState={updatePromptState} />
      )}
    </SafeAreaView>
  );
};

export default ScreenContainerComponent;
