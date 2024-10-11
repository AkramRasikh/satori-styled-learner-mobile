import {useState} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';

const DeleteWordSection = ({deleteWord}) => {
  const [openAreYouSureState, setOpenAreYouSureState] = useState(false);
  return (
    <View>
      <View
        style={{
          marginHorizontal: 'auto',
        }}>
        <Button title="Delete" onPress={() => setOpenAreYouSureState(true)} />
      </View>
      {openAreYouSureState && (
        <View
          style={{
            paddingVertical: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderTopWidth: 1,
          }}>
          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 5,
              backgroundColor: 'grey',
            }}
            onPress={() => setOpenAreYouSureState(false)}>
            <Text>No</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              padding: 10,
              borderRadius: 5,
              backgroundColor: 'red',
            }}
            onPress={deleteWord}>
            <Text>Yes</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DeleteWordSection;
