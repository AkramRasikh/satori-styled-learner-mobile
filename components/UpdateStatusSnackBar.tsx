import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Snackbar} from 'react-native-paper';

const UpdateStatusSnackBar = ({updatePromptState}) => {
  const [visible, setVisible] = React.useState(true);

  const onDismissSnackBar = () => setVisible(false);

  return (
    <View style={styles.container}>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={100000}
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
