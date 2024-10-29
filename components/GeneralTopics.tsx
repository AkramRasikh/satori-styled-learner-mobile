import {Image, Text, TouchableOpacity, View} from 'react-native';

const GeneralTopics = ({
  handleShowGeneralTopic,
  generalTopicObjKeys,
  isDueReview,
  isCoreContent,
  isNeedsFutureReview,
  isYoutubeVideo,
}) => {
  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {generalTopicObjKeys?.map(generalTopic => {
        const isCoreStatus = isCoreContent(generalTopic, false);
        const hasReviewDue = isDueReview(generalTopic, false, true);
        const thisTopicIsUpcoming = isNeedsFutureReview({
          topicOption: generalTopic,
          singular: false,
        });
        const isYoutube = isYoutubeVideo(generalTopic);

        return (
          <View key={generalTopic} testID={generalTopic}>
            <TouchableOpacity
              onPress={() => handleShowGeneralTopic(generalTopic)}
              style={{
                borderWidth: 1,
                borderColor: '#999999',
                borderRadius: 20,
                paddingVertical: 10,
                paddingHorizontal: 15,
                margin: 5,
                backgroundColor: hasReviewDue
                  ? '#C34A2C'
                  : thisTopicIsUpcoming
                  ? '#ADD8E6'
                  : 'transparent',
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 5,
                }}>
                <Text>{generalTopic}</Text>
                {isCoreStatus ? <Text> 🧠</Text> : null}
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
      })}
    </View>
  );
};

export default GeneralTopics;
