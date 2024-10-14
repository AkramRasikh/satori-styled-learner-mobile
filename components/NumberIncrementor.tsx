import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export const setFutureReviewDate = (today, daysToAdd) => {
  const futureDateWithDays = new Date(
    today.setDate(today.getDate() + daysToAdd),
  );

  return futureDateWithDays;
};

const NumberIncrementor = ({
  futureDaysState,
  setFutureDaysState,
  handleSetManualTime,
}) => {
  const increment = () => {
    setFutureDaysState(futureDaysState + 1);
  };

  const decrement = () => {
    if (futureDaysState >= 1) {
      setFutureDaysState(futureDaysState - 1);
    }
  };

  return (
    <View
      style={{
        gap: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View style={styles.buttonContainer}>
        <Button title="(+)" onPress={increment} />

        <TouchableOpacity
          style={{
            alignSelf: 'center',
            backgroundColor: '#6082B6',
            padding: 5,
            borderRadius: 10,
          }}
          onPress={() => handleSetManualTime(futureDaysState)}>
          <Text>{futureDaysState} days</Text>
        </TouchableOpacity>

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
    gap: 5,
    alignItems: 'center',
  },
});

export default NumberIncrementor;
