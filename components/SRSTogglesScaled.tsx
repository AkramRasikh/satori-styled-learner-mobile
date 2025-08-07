import React, {View} from 'react-native';
import {Button, DefaultTheme, IconButton, MD2Colors} from 'react-native-paper';

const SRSTogglesScaled = ({
  handleNextReview,
  againText,
  hardText,
  goodText,
  easyText,
  fontSize = 12,
  willBeFollowedByDeletion,
  quickDeleteFunc,
}) => {
  const btnsArr = [
    {
      onPress: () => handleNextReview('1'),
      text: againText,
    },
    {
      onPress: () => handleNextReview('2'),
      text: hardText,
    },
    {
      onPress: () => handleNextReview('3'),
      text: goodText,
    },
    {
      bottonColor: willBeFollowedByDeletion
        ? DefaultTheme.colors.errorContainer
        : '',
      onPress: () => handleNextReview('4'),
      text: easyText,
    },
  ];

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        alignContent: 'center',
        alignItems: 'center',
      }}>
      {btnsArr.map((btn, index) => {
        return (
          <Button
            key={index}
            onPress={btn.onPress}
            compact
            mode="outlined"
            textColor={DefaultTheme.colors.onSurface}
            buttonColor={btn?.bottonColor}
            labelStyle={{
              fontSize,
            }}>
            {btn.text}
          </Button>
        );
      })}
      {quickDeleteFunc && (
        <IconButton
          icon={'delete'}
          onPress={quickDeleteFunc}
          iconColor={MD2Colors.white}
          containerColor={MD2Colors.red400}
        />
      )}
    </View>
  );
};

export default SRSTogglesScaled;
