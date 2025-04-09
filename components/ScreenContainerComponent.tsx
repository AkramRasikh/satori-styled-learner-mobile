import React from 'react';
import {SafeAreaView} from 'react-native';
import UpdateStatusSnackBar from './UpdateStatusSnackBar';
import useData from '../context/Data/useData';

const ScreenContainerComponent = ({marginBottom = 0, children}) => {
  const {updatePromptState, setUpdatePromptState} = useData();

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#FFEEEE',
        minHeight: '100%',
        marginBottom,
      }}>
      {children}
      {updatePromptState && (
        <UpdateStatusSnackBar
          updatePromptState={updatePromptState}
          setUpdatePromptState={setUpdatePromptState}
        />
      )}
    </SafeAreaView>
  );
};

export default ScreenContainerComponent;
