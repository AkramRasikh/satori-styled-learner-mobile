import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Icon, IconButton, MD2Colors, MD3Colors} from 'react-native-paper';

const FlashCardTopSection = ({
  setSelectedDueCardState,
  wordData,
  wordListText,
  freshCard,
  isSelectedWord,
  handleCloseModal,
}) => (
  <TouchableOpacity
    onPress={() => setSelectedDueCardState(wordData)}
    style={{
      alignSelf: 'flex-start',
      marginVertical: 5,
      width: '100%',
      justifyContent: 'space-between',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    }}>
    <Text
      style={{
        fontSize: 24,
        flexWrap: 'wrap',
      }}>
      {wordListText}
      {freshCard && (
        <Icon source={'new-box'} size={24} color={MD2Colors.green500} />
      )}
    </Text>
    {isSelectedWord && (
      <IconButton
        icon="close"
        onPress={handleCloseModal}
        mode="outlined"
        iconColor={'white'}
        containerColor={MD3Colors.error50}
      />
    )}
  </TouchableOpacity>
);

export default FlashCardTopSection;
