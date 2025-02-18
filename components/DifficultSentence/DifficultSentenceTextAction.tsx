import React from 'react-native';
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
    <>
      {btnArr.map((btn, index) => {
        return (
          <IconButton
            key={index}
            icon={btn.icon}
            mode="outlined"
            size={20}
            onPress={btn.onPress}
            iconColor={btn?.iconColor}
          />
        );
      })}
    </>
  );
};

export default DifficultSentenceTextAction;
