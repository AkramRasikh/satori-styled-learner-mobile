import {useState} from 'react';
import React, {Text, TouchableOpacity, View} from 'react-native';
import {Button, IconButton, MD2Colors, MD3Colors} from 'react-native-paper';
import useDifficultSentenceContext from '../NewDifficultBase/context/useDifficultSentence';

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

const DifficultSentenceTopHeader = ({
  topic,
  handleNavigateToTopic,
  dueColorState,
}) => {
  const [areYouSureDeleteState, setAreYouSureDeleteState] = useState(false);

  const {handleDeleteContent} = useDifficultSentenceContext();
  return (
    <View>
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
          onPress={() => setAreYouSureDeleteState(!areYouSureDeleteState)}
        />
      </View>

      {areYouSureDeleteState && (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'flex-end',
            gap: 10,
          }}>
          <Button
            mode="elevated"
            buttonColor={MD3Colors.error50}
            textColor={MD2Colors.white}
            onPress={handleDeleteContent}>
            Delete!
          </Button>
          <Button
            mode="elevated"
            onPress={() => setAreYouSureDeleteState(false)}>
            No
          </Button>
        </View>
      )}
    </View>
  );
};

export default DifficultSentenceTopHeader;
