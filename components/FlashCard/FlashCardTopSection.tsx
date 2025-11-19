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
      }}>
      <TouchableOpacity
        style={{
          flex: 6,
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
          alignSelf: 'flex-start',
          marginVertical: 5,
          justifyContent: 'space-between',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        }}>
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
            onPress={() => {
              selectWordWithScroll();
              setIsOpenWordOptionsState(!isOpenWordOptionsState);
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default FlashCardTopSection;
