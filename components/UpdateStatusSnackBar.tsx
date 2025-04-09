import React, {useCallback} from 'react';
import {View} from 'react-native';
import {Snackbar} from 'react-native-paper';

const UpdateStatusSnackBar = ({
  updatePromptState,
  setUpdatePromptState,
  duration = 1500,
}) => {
  const [visible, setVisible] = React.useState(true);

  const onDismissSnackbar = useCallback(() => {
    setUpdatePromptState(null);
    setVisible(false);
  }, []);

  return (
    <View
      style={{
        position: 'absolute',
        zIndex: 9999, // works on iOS
        elevation: 10, // works on Android
        bottom: 70,
        left: 20,
        right: 20,
      }}>
      <Snackbar
        visible={visible}
        duration={duration}
        onDismiss={onDismissSnackbar}
        action={{
          label: 'Close',
          onPress: () => {
            setVisible(false);
          },
        }}>
        {updatePromptState}
      </Snackbar>
    </View>
  );
};

export default UpdateStatusSnackBar;
