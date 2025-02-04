import React from 'react';
import {Image} from 'react-native';
import {Button, MD2Colors} from 'react-native-paper';

const TopicTitleButton = ({
  onPress,
  testID,
  isDue,
  futureReview,
  title,
  isCore,
  isYoutube,
  hasAudio,
  isGeneral,
  isNetflix,
}) => {
  const freshContent = !futureReview && !isDue;
  return (
    <Button
      onPress={onPress}
      testID={testID}
      mode="outlined"
      buttonColor={
        futureReview
          ? MD2Colors.green100
          : isDue
          ? MD2Colors.purple100
          : 'transparent'
      }
      icon={
        isYoutube
          ? () => (
              <Image
                source={require('../assets/images/youtube.png')}
                style={{
                  width: 16,
                  height: 16,
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              />
            )
          : isNetflix
          ? 'netflix'
          : ''
      }
      style={
        freshContent && {
          borderColor: 'black',
          borderWidth: 1,
        }
      }>
      {isCore ? '🧠' : null}
      {isGeneral ? '' : !hasAudio ? '🔕' : ''} {title}
    </Button>
  );
};

export default TopicTitleButton;
