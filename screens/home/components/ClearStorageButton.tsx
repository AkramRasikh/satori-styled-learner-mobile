import React, {View} from 'react-native';
import {FAB} from 'react-native-paper';

const ClearStorageButton = ({handleClearStorage}) => (
  <View
    style={{
      paddingBottom: 50,
    }}>
    <FAB
      icon="backup-restore"
      onPress={handleClearStorage}
      label={'Clear Storage'}
      variant="tertiary"
    />
  </View>
);

export default ClearStorageButton;
