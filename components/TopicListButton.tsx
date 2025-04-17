import React from 'react';
import {FAB, MD2Colors} from 'react-native-paper';

const sentenceHelper = 'sentence-helper';

const TopicListButton = ({label, onPress, onLongPress, isSelected}) => (
  <FAB
    label={label}
    onPress={onPress}
    customSize={30}
    icon={isSelected ? 'check' : ''}
    onLongPress={() => {
      const generalTopic = label.split(' ')[0];
      if (sentenceHelper !== generalTopic) {
        onLongPress(label.split(' ')[0]);
      }
    }}
    style={{
      backgroundColor: isSelected ? MD2Colors.purple100 : '',
    }}
  />
);

export default TopicListButton;
