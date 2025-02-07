import React from 'react';
import {IconButton, MD2Colors, MD3Colors} from 'react-native-paper';

export const DeleteButton = ({onPress, size}) => (
  <IconButton
    icon="delete"
    onPress={onPress}
    containerColor={MD3Colors.error50}
    iconColor={MD2Colors.white}
    size={size}
  />
);
