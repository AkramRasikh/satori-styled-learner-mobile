import React, {useRef} from 'react';
import {IconButton, MD2Colors, MD3Colors} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';

export const DeleteButton = ({onPress, size}) => (
  <IconButton
    icon="delete"
    onPress={onPress}
    containerColor={MD3Colors.error50}
    iconColor={MD2Colors.white}
    size={size}
  />
);

export const DoubleClickButton = ({onLongPress, onPress, children}) => {
  const lastTapRef = useRef(null);

  const handleDoubleClick = ({}) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTapRef.current && now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      onPress?.();
    }

    lastTapRef.current = now;
  };

  return (
    <TouchableOpacity onLongPress={onLongPress} onPress={handleDoubleClick}>
      {children}
    </TouchableOpacity>
  );
};
