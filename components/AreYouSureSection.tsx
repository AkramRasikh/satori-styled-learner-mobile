import {Button, Text, TouchableOpacity, View} from 'react-native';

export const QuickAreYouSureSection = ({handleClose, handleYesSure}) => (
  <View
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      borderTopWidth: 1,
      alignItems: 'center',
    }}>
    <Text>Are you sure?</Text>
    <Button title="No" onPress={handleClose} />
    <Button title="Yes" onPress={handleYesSure} color="red" />
  </View>
);
const AreYouSureSection = ({handleSnooze, handleClose, handleYesSure}) => (
  <View
    style={{
      paddingVertical: 10,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
    }}>
    <TouchableOpacity
      style={{
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'grey',
      }}
      onPress={handleClose}>
      <Text>No</Text>
    </TouchableOpacity>
    {handleSnooze && (
      <TouchableOpacity
        style={{
          padding: 10,
          borderRadius: 5,
          backgroundColor: 'gold',
        }}
        onPress={handleSnooze}>
        <Text>Snooze</Text>
      </TouchableOpacity>
    )}
    <TouchableOpacity
      style={{
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'red',
      }}
      onPress={handleYesSure}>
      <Text>Yes</Text>
    </TouchableOpacity>
  </View>
);

export default AreYouSureSection;
