import React, {View} from 'react-native';
import {IconButton, MD2Colors} from 'react-native-paper';
import useDifficultSentenceContext from './context/useDifficultSentence';

const DifficultSentenceTextAction = () => {
  const {handleCopyText, handleOpenUpGoogle} = useDifficultSentenceContext();
  const btnArr = [
    {
      icon: 'google-translate',
      onPress: handleOpenUpGoogle,
      iconColor: MD2Colors.blue600,
    },
    {
      icon: 'content-copy',
      onPress: handleCopyText,
    },
  ];

  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      {btnArr.map((btn, index) => {
        return (
          <IconButton
            key={index}
            icon={btn.icon}
            mode="outlined"
            size={15}
            onPress={btn.onPress}
            iconColor={btn?.iconColor}
          />
        );
      })}
    </View>
  );
};

export default DifficultSentenceTextAction;
