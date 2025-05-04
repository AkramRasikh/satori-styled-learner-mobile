import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Icon, IconButton, MD2Colors, MD3Colors} from 'react-native-paper';

const FlashCardTopSection = ({
  selectWordWithScroll,
  wordListText,
  freshCard,
  isSelectedWord,
  handleCloseModal,
  setIsOpenWordOptionsState,
  isOpenWordOptionsState,
  handleCopyText,
}) => (
  <TouchableOpacity
    onPress={selectWordWithScroll}
    onLongPress={handleCopyText}
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
    <View style={{display: 'flex', flexDirection: 'row'}}>
      {isSelectedWord && (
        <IconButton
          icon="close"
          onPress={handleCloseModal}
          mode="outlined"
          iconColor={'white'}
          containerColor={MD3Colors.error50}
        />
      )}
      <IconButton
        icon="dots-vertical"
        containerColor={MD2Colors.blueGrey300}
        onPress={() => setIsOpenWordOptionsState(!isOpenWordOptionsState)}
      />
    </View>
  </TouchableOpacity>
);

export default FlashCardTopSection;
