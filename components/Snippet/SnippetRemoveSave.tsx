import {TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';

const SnippetRemoveSave = ({
  isInDB,
  handleRemoveSnippet,
  handleAddingSnippet,
}) => {
  return (
    <View
      style={{
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: !isInDB ? 'orange' : 'transparent',
        padding: 10,
        borderRadius: 10,
      }}>
      {isInDB ? (
        <TouchableOpacity onPress={handleRemoveSnippet}>
          <Text>Remove 🧹</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleAddingSnippet}>
          <Text>Save 🏦</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SnippetRemoveSave;
