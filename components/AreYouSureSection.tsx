import React, {Button, Text, View} from 'react-native';

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
