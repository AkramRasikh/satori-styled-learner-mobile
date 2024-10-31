import {Image, Text, TouchableOpacity, View} from 'react-native';

export const TopicTitleButton = ({
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
        backgroundColor: isDue
          ? '#C34A2C'
          : futureReview
          ? '#ADD8E6'
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

const GeneralTopics = ({handleShowGeneralTopic, generalTopicsToDisplay}) => {
  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      {generalTopicsToDisplay?.map(generalTopic => {
        const title = generalTopic.title;
        const isCore = generalTopic.isCore;
        const isDue = generalTopic.isDue;
        const futureReview = generalTopic.hasFutureReview;
        const isYoutube = generalTopic.isYoutube;

        return (
          <TopicTitleButton
            key={title}
            onPress={() => handleShowGeneralTopic(title)}
            testID={title}
            isDue={isDue}
            futureReview={futureReview}
            title={title}
            isCore={isCore}
            isYoutube={isYoutube}
            isGeneral
          />
        );
      })}
    </View>
  );
};

export default GeneralTopics;
