import React, {TouchableOpacity, View} from 'react-native';
import {Icon, MD2Colors, Text} from 'react-native-paper';

const BilingualLineSettings = ({
  highlightMode,
  setIsSettingsOpenState,
  hasBeenMarkedAsDifficult,
  handlePlayThisLine,
  isPlaying,
  focusThisSentence,
}) => (
  <View
    style={{
      width: '100%',
      marginBottom: highlightMode ? 3 : 0,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    }}>
    <TouchableOpacity
      onPress={() => setIsSettingsOpenState(true)}
      style={{
        backgroundColor: hasBeenMarkedAsDifficult
          ? MD2Colors.red600
          : 'transparent',
        borderRadius: 5,
      }}>
      <Icon
        source="menu"
        size={20}
        color={
          hasBeenMarkedAsDifficult ? MD2Colors.grey100 : MD2Colors.amber800
        }
      />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={handlePlayThisLine}
      style={{
        marginRight: 15,
      }}>
      <Text>{isPlaying && focusThisSentence ? '⏸' : '▶️'}</Text>
    </TouchableOpacity>
  </View>
);

export default BilingualLineSettings;
