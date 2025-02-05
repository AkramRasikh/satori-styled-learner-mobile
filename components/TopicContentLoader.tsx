import React, {View} from 'react-native';
import {DefaultTheme, ProgressBar, Text} from 'react-native-paper';
import {ActivityIndicator, MD2Colors} from 'react-native-paper';

const TopicContentLoader = ({
  topicName,
  audioLoadingProgress,
  topicDataLengths,
  isMediaContent,
}) => {
  const loadingProgress = audioLoadingProgress / topicDataLengths;
  return (
    <View
      testID="topic-loader"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
      }}>
      <Text style={DefaultTheme.fonts.titleMedium}>{topicName}</Text>
      <Text>
        Loading {audioLoadingProgress}/{topicDataLengths}
      </Text>
      {isMediaContent ? (
        <ActivityIndicator
          animating={true}
          color={MD2Colors.red800}
          size="large"
        />
      ) : (
        <View style={{padding: 10, width: '100%'}}>
          <ProgressBar
            progress={loadingProgress}
            style={{marginTop: 20, height: 10}}
          />
        </View>
      )}
    </View>
  );
};

export default TopicContentLoader;
