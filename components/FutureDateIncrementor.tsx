import {View, Text, Button, StyleSheet} from 'react-native';

const FutureDateIncrementor = ({futureDaysState, setFutureDaysState}) => {
  const increment = () => {
    setFutureDaysState(futureDaysState + 1);
  };

  const decrement = () => {
    if (futureDaysState > 1) {
      setFutureDaysState(futureDaysState - 1);
    }
  };

  return (
    <View>
      <Text style={styles.countText}>{futureDaysState}</Text>
      <View style={styles.buttonContainer}>
        <Button title="(+)" onPress={increment} />
        <Button title="(-)" onPress={decrement} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  countText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
});

export default FutureDateIncrementor;
