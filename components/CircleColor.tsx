import React, {View} from 'react-native';

const CircleColor = ({backgroundColor, size, borderRadius}) => (
  <View
    style={{
      backgroundColor: backgroundColor,
      width: size || 16,
      height: size || 16,
      borderRadius: borderRadius || 10,
      marginVertical: 'auto',
    }}
  />
);

export default CircleColor;
