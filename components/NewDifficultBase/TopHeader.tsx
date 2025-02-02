import React, {Text, TouchableOpacity, View} from 'react-native';
import {IconButton, MD2Colors, MD3Colors} from 'react-native-paper';

const DueColorMarker = ({dueColorState}) => (
  <View
    style={{
      backgroundColor: dueColorState,
      width: 16,
      height: 16,
      borderRadius: 10,
      marginVertical: 'auto',
    }}
  />
);

const TopHeader = ({
  topic,
  handleClickDelete,
  handleNavigateToTopic,
  dueColorState,
}) => {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5,
          alignItems: 'center',
        }}>
        <DueColorMarker dueColorState={dueColorState} />
        <TouchableOpacity onPress={handleNavigateToTopic}>
          <Text
            style={{
              textDecorationLine: 'underline',
              fontStyle: 'italic',
            }}>
            {topic}
          </Text>
        </TouchableOpacity>
      </View>
      <IconButton
        icon="delete"
        containerColor={MD3Colors.error50}
        iconColor={MD2Colors.white}
        size={20}
        onPress={handleClickDelete}
      />
    </View>
  );
};

export default TopHeader;
