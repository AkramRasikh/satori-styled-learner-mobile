import {TouchableOpacity, Text, View} from 'react-native';

const SnippetDelete = ({handleDelete}) => {
  return (
    <View style={{padding: 10}}>
      <TouchableOpacity onPress={handleDelete}>
        <Text>❌</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SnippetDelete;
