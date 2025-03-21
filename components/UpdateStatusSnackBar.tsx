import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
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
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    position: 'static',
    bottom: 40,
  },
});

export default UpdateStatusSnackBar;
