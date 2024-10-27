import {Text, TouchableOpacity, View} from 'react-native';

const SongSection = ({
  topicOrSongSelected,
  generalTopicState,
  targetLanguageLoadedSongsState,
  showOtherTopics,
  topicsToStudyState,
  selectedTopic,
  handleShowMusic,
}) => {
  return (
    <>
      {!topicOrSongSelected && !generalTopicState ? (
        <View style={{padding: 10}}>
          <Text style={{textDecorationLine: 'underline'}}>Songs:</Text>
        </View>
      ) : null}
      {(!topicOrSongSelected || showOtherTopics) && !generalTopicState ? (
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {targetLanguageLoadedSongsState?.map(songData => {
            const numberOfWordsToStudy = topicsToStudyState[songData.title];

            return (
              <View key={songData.id}>
                <TouchableOpacity
                  onPress={() => handleShowMusic(songData.title)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#999999',
                    borderRadius: 20,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    margin: 5,
                    backgroundColor:
                      selectedTopic === songData.title
                        ? 'green'
                        : 'transparent',
                  }}>
                  <Text>
                    {songData.title}{' '}
                    {numberOfWordsToStudy ? (
                      <Text>({numberOfWordsToStudy})</Text>
                    ) : null}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      ) : null}
    </>
  );
};

export default SongSection;
