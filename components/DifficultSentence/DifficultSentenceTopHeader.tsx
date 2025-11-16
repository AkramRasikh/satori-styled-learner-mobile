import {useState} from 'react';
import React, {View} from 'react-native';
import {Button, IconButton, MD2Colors, MD3Colors} from 'react-native-paper';
import useDifficultSentenceContext from './context/useDifficultSentence';
import CircleColor from '../CircleColor';
import AreYouSurePrompt from '../AreYouSurePrompt';

const DifficultSentenceTopHeader = ({
  topic,
  handleNavigateToTopic,
  dueColorState,
}) => {
  const [areYouSureDeleteState, setAreYouSureDeleteState] = useState(false);

  const {handleDeleteContent} = useDifficultSentenceContext();

  const topicText = topic.length > 37 ? `${topic.substring(0, 30)}...` : topic;
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
            alignItems: 'center',
            gap: 5,
          }}>
          <CircleColor backgroundColor={dueColorState} />
          <Button
            onPress={handleNavigateToTopic}
            labelStyle={{
              textDecorationLine: 'underline',
              fontStyle: 'italic',
            }}>
            {topicText}
          </Button>
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
        <AreYouSurePrompt
          yesText="Delete!"
          yesOnPress={handleDeleteContent}
          noText="No"
          noOnPress={() => setAreYouSureDeleteState(false)}
        />
      )}
    </View>
  );
};

export default DifficultSentenceTopHeader;
