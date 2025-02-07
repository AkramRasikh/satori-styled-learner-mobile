import React from 'react';
import {FAB, MD2Colors} from 'react-native-paper';

const TopicListButton = ({label, onPress, isSelected}) => (
  <FAB
    label={label}
    onPress={onPress}
    customSize={30}
    icon={isSelected ? 'check' : ''}
    style={{
      backgroundColor: isSelected ? MD2Colors.purple100 : '',
    }}
  />
);

export default TopicListButton;
