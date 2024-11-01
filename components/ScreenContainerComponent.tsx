import React from 'react';
import {SafeAreaView} from 'react-native';
import ToastMessage from './ToastMessage';

const ScreenContainerComponent = ({
  updatePromptState,
  marginBottom = 0,
  children,
}) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: '#D3D3D3',
        minHeight: '100%',
        marginBottom: marginBottom,
      }}>
      {updatePromptState ? (
        <ToastMessage toastText={updatePromptState} />
      ) : null}
      {children}
    </SafeAreaView>
  );
};

export default ScreenContainerComponent;
