import React, {useState} from 'react';
import {View} from 'react-native';
import AreYouSureSection from './AreYouSureSection';
import {Button, MD3Colors} from 'react-native-paper';

const DeleteWordSection = ({deleteContent}) => {
  const [openAreYouSureState, setOpenAreYouSureState] = useState(false);
  return (
    <View
      style={{
        marginTop: 5,
      }}>
      <Button
        onPress={() => setOpenAreYouSureState(true)}
        mode="outlined"
        textColor={MD3Colors.error50}>
        Delete
      </Button>

      {openAreYouSureState && (
        <AreYouSureSection
          handleClose={() => setOpenAreYouSureState(false)}
          handleYesSure={deleteContent}
        />
      )}
    </View>
  );
};

export default DeleteWordSection;
