import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

const SwitchButton = ({isOn, setIsOn}) => {
  const toggleSwitch = () => {
    setIsOn(prevState => !prevState);
  };

  return (
    <TouchableOpacity style={styles.switchContainer} onPress={toggleSwitch}>
      <View
        style={[
          styles.switchBackground,
          isOn ? styles.switchOn : styles.switchOff,
        ]}>
        <View
          style={[
            styles.switchThumb,
            isOn ? styles.switchThumbOn : styles.switchThumbOff,
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    padding: 10,
    margin: 'auto',
    cursor: 'pointer', // Note: 'cursor' is a web-specific property. It can be omitted in React Native.
  },
  switchBackground: {
    width: 50,
    height: 25,
    borderRadius: 25,
    position: 'relative',
  },
  switchOn: {
    backgroundColor: 'green',
  },
  switchOff: {
    backgroundColor: 'red',
  },
  switchThumb: {
    width: 23,
    height: 23,
    backgroundColor: 'white',
    borderRadius: 15,
    position: 'absolute',
    top: 1,
  },
  switchThumbOn: {
    left: 26,
  },
  switchThumbOff: {
    left: 1,
  },
});

export default SwitchButton;
