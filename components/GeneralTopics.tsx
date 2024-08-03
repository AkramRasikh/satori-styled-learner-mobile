import {Text, TouchableOpacity, View} from 'react-native';

const GeneralTopics = ({
  handleShowGeneralTopic,
  generalTopicObjKeys,
  generalTopicObj,
  isDueReview,
  isCoreContent,
}) => {
  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {generalTopicObjKeys?.map(generalTopic => {
        const numberOfWordsToStudy = generalTopicObj[generalTopic];

        const hasReviewDue = isDueReview(generalTopic, false, true);
        const isCoreStatus = isCoreContent(generalTopic, false);
        const thisTopicIsUpcoming = isDueReview(generalTopic, false, false);
        return (
          <View key={generalTopic}>
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
              <Text>
                {generalTopic}{' '}
                {numberOfWordsToStudy ? (
                  <Text>({numberOfWordsToStudy})</Text>
                ) : null}
                {isCoreStatus ? <Text> 🧠</Text> : null}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default GeneralTopics;
