import {useState} from 'react';
import {Button, View} from 'react-native';
import AreYouSureSection from './AreYouSureSection';

const DeleteWordSection = ({deleteContent, handleSnooze}) => {
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
        <AreYouSureSection
          handleClose={() => setOpenAreYouSureState(false)}
          handleSnooze={handleSnooze}
          handleYesSure={deleteContent}
        />
      )}
    </View>
  );
};

export default DeleteWordSection;
