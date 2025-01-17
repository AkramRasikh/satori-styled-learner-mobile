import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const PillButton = ({isShowDueOnly, setIsShowDueOnly}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isShowDueOnly ? styles.activeButton : styles.inactiveButton,
          styles.leftButton,
        ]}
        onPress={() => setIsShowDueOnly(true)}>
        <Text style={styles.text}>
          {isShowDueOnly && <Text>✅</Text>} Due only
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          !isShowDueOnly ? styles.activeButton : styles.inactiveButton,
          styles.rightButton,
        ]}
        onPress={() => setIsShowDueOnly(false)}>
        <Text style={styles.text}>All {!isShowDueOnly && <Text>✅</Text>}</Text>
      </TouchableOpacity>
    </View>
  );
};

export const PillButtonScaled = ({
  isShowOptionA,
  toggleOption,
  textA,
  textB,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          isShowOptionA ? styles.activeButton : styles.inactiveButton,
          styles.leftButton,
        ]}
        onPress={toggleOption}>
        <Text style={styles.text}>
          {isShowOptionA && <Text>✅</Text>} {textA}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          !isShowOptionA ? styles.activeButton : styles.inactiveButton,
          styles.rightButton,
        ]}
        onPress={toggleOption}>
        <Text style={styles.text}>
          {textB} {!isShowOptionA && <Text>✅</Text>}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center', // Centers the buttons inside the container
    maxWidth: '60%',
  },
  button: {
    flex: 1, // Ensures equal width
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    marginLeft: 10,
  },
  rightButton: {
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginRight: 10,
  },
  activeButton: {
    backgroundColor: '#a3d5a2', // Faded green color
  },
  inactiveButton: {
    backgroundColor: '#e0e0e0', // Gray color for inactive button
  },
  text: {
    fontWeight: 'bold',
  },
});

export default PillButton;
