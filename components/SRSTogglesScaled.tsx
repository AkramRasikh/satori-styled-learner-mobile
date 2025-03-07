import React, {View} from 'react-native';
import {Button, DefaultTheme} from 'react-native-paper';

const SRSTogglesScaled = ({
  handleNextReview,
  againText,
  hardText,
  goodText,
  easyText,
  fontSize = 12,
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
      onPress: () => handleNextReview('4'),
      text: easyText,
    },
  ];

  return (
    <View style={{display: 'flex', flexDirection: 'row', gap: 5}}>
      {btnsArr.map((btn, index) => {
        return (
          <Button
            key={index}
            onPress={btn.onPress}
            compact
            mode="outlined"
            textColor={DefaultTheme.colors.onSurface}
            labelStyle={{
              fontSize,
            }}>
            {btn.text}
          </Button>
        );
      })}
    </View>
  );
};

export default SRSTogglesScaled;
