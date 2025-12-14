import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {IconButton, MD2Colors, MD3Colors} from 'react-native-paper';

const FlashCardTopSection = ({
  selectWordWithScroll,
  listTextNumber,
  isSelectedWord,
  handleCloseModal,
  setIsOpenWordOptionsState,
  isOpenWordOptionsState,
  handleCopyText,
  baseForm,
  definiton,
}) => {
  const [isShowTargetLangState, setIsShowTargetLangState] = useState(false);

  const wordText = isShowTargetLangState ? baseForm : definiton;

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: 'auto',
        justifyContent: 'space-between',
        marginRight: 10,
      }}>
      <TouchableOpacity
        style={{
          flex: 8,
        }}
        onPress={() => setIsShowTargetLangState(!isShowTargetLangState)}>
        <Text
          style={{
            fontSize: 24,
            flexWrap: 'wrap',
            marginVertical: 'auto',
          }}>
          {listTextNumber + wordText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={selectWordWithScroll}
        onLongPress={handleCopyText}
        style={{
          flex: 1,
        }}>
        <IconButton
          icon={isSelectedWord ? 'close' : 'dots-vertical'}
          containerColor={
            isSelectedWord ? MD3Colors.error50 : MD2Colors.blueGrey300
          }
          iconColor={isSelectedWord ? 'white' : 'black'}
          onPress={() => {
            selectWordWithScroll();
            setIsOpenWordOptionsState(!isOpenWordOptionsState);
            if (isSelectedWord) {
              handleCloseModal();
            }
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default FlashCardTopSection;
