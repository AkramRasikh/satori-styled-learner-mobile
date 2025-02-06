import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, MD3Colors} from 'react-native-paper';
import AreYouSurePrompt from './AreYouSurePrompt';

const DeleteWordSection = ({deleteContent}) => {
  const [openAreYouSureState, setOpenAreYouSureState] = useState(false);
  return (
    <View
      style={{
        marginTop: 5,
        gap: 10,
      }}>
      <Button
        onPress={() => setOpenAreYouSureState(true)}
        mode="outlined"
        textColor={MD3Colors.error50}>
        Delete
      </Button>

      {openAreYouSureState && (
        <AreYouSurePrompt
          yesText="Delete!"
          yesOnPress={deleteContent}
          noText="No"
          noOnPress={() => setOpenAreYouSureState(false)}
        />
      )}
    </View>
  );
};

export default DeleteWordSection;
