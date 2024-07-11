import {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const WordStudySection = ({wordsToStudy}) => {
  return (
    <View
      style={{
        gap: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10,
      }}>
      {wordsToStudy?.map((wordData, index) => {
        return <WordInfo key={index} wordData={wordData} position={index} />;
      })}
    </View>
  );
};

const WordInfo = ({wordData, position}) => {
  const [showMore, setShowMore] = useState(false);
  const {baseForm, phonetic, definition} = wordData;
  return (
    <View
      style={{
        borderBlockColor: 'grey',
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        width: showMore ? '100%' : 'auto',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}>
      <TouchableOpacity onPress={() => setShowMore(!showMore)}>
        <Text>
          {position + 1}) {baseForm}
        </Text>
      </TouchableOpacity>
      {showMore ? (
        <View>
          <Text>
            {phonetic}, {definition}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default WordStudySection;
