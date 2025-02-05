import React, {View} from 'react-native';

const CircleColor = ({backgroundColor, size = 16, borderRadius = 10}) => (
  <View
    style={{
      backgroundColor: backgroundColor,
      width: size,
      height: size,
      borderRadius,
      marginVertical: 'auto',
    }}
  />
);

export default CircleColor;
