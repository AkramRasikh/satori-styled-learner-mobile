import React, {View} from 'react-native';
import {FAB, MD2Colors} from 'react-native-paper';

const DifficultSentencesWordNavigator = ({
  handleNavigationToWords,
  numberOfWords,
}) => {
  const label = `Words (${numberOfWords})`;
  return (
    <View
      style={{
        marginTop: 5,
        alignSelf: 'flex-start',
      }}>
      <FAB
        label={label}
        onPress={handleNavigationToWords}
        customSize={30}
        style={{
          backgroundColor: MD2Colors.green100,
        }}
      />
    </View>
  );
};

export default DifficultSentencesWordNavigator;
