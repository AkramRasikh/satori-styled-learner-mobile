import React, {View} from 'react-native';
import {Button, MD2Colors, MD3Colors} from 'react-native-paper';

const AreYouSurePrompt = ({yesText, yesOnPress, noText, noOnPress}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        gap: 10,
      }}>
      <Button
        mode="elevated"
        buttonColor={MD3Colors.error50}
        textColor={MD2Colors.white}
        onPress={yesOnPress}>
        {yesText}
      </Button>
      <Button mode="elevated" onPress={noOnPress}>
        {noText}
      </Button>
    </View>
  );
};

export default AreYouSurePrompt;
