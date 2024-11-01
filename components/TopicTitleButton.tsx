import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';

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
}) => (
  <View testID={testID}>
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderWidth: 1,
        borderColor: '#999999',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        margin: 5,
        backgroundColor: futureReview
          ? '#ADD8E6'
          : isDue
          ? '#C34A2C'
          : 'transparent',
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 5,
        }}>
        <Text>
          {title}
          {isGeneral ? '' : !hasAudio ? '🔕' : ''}{' '}
        </Text>
        {isCore ? <Text> 🧠</Text> : null}
        {isYoutube ? (
          <Image
            source={require('../assets/images/youtube.png')}
            style={{width: 16, height: 16}}
          />
        ) : null}
      </View>
    </TouchableOpacity>
  </View>
);

export default TopicTitleButton;
