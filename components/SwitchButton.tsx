import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Switch} from 'react-native-paper';

const SwitchButton = ({isOn, setIsOn}) => {
  const toggleSwitch = () => {
    setIsOn(!isOn);
  };

  return (
    <View style={styles.switchContainer}>
      <Switch value={isOn} onValueChange={toggleSwitch} />
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    padding: 10,
    margin: 'auto',
    cursor: 'pointer',
  },
});

export default SwitchButton;
