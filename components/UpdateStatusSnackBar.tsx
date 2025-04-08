import React, {useCallback} from 'react';
import {View} from 'react-native';
import {Snackbar} from 'react-native-paper';

const UpdateStatusSnackBar = ({
  updatePromptState,
  setUpdatePromptState,
  duration = 1500,
  bottom = 130,
}) => {
  const [visible, setVisible] = React.useState(true);

  const onDismissSnackbar = useCallback(() => {
    setUpdatePromptState(null);
    setVisible(false);
  }, []);

  return (
    <View
      style={{
        position: 'static',
        bottom,
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
