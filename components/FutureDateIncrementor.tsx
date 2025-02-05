import React, {View, StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';

const FutureDateIncrementor = ({futureDaysState, setFutureDaysState}) => {
  const increment = () => {
    setFutureDaysState(futureDaysState + 1);
  };

  const decrement = () => {
    if (futureDaysState >= 1) {
      setFutureDaysState(futureDaysState - 1);
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <IconButton icon={'plus'} onPress={increment} mode="contained" />
      <IconButton icon={'minus'} onPress={decrement} mode="contained" />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default FutureDateIncrementor;
