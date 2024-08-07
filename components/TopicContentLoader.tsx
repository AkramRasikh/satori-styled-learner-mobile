import {Text, View} from 'react-native';
import {ProgressBar} from 'react-native-paper';

const TopicContentLoader = ({audioLoadingProgress, topicDataLengths}) => {
  const loadingProgress = audioLoadingProgress / topicDataLengths;
  return (
    <View
      testID="topic-loader"
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{padding: 10, width: '100%'}}>
        <ProgressBar
          progress={loadingProgress}
          style={{marginTop: 20, height: 10}}
        />
      </View>
      <Text>
        Loading {audioLoadingProgress}/{topicDataLengths}
      </Text>
    </View>
  );
};

export default TopicContentLoader;
