import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DifficultSentenceWidget from '../../components/DifficultSentenceWidget';
import LoadingScreen from '../../components/LoadingScreen';
import {sortByDueDate} from '../../utils/sort-by-due-date';

const DifficultSentencesContainer = ({
  difficultSentencesState,
  saveAudioInstance,
  audioTempState,
}): React.JSX.Element => {
  const [toggleableSentencesState, setToggleableSentencesState] = useState([]);
  const todayDateObj = new Date();
  const [isSortedByDue, setIsSortedByDue] = useState(false);

  const sortSentencesByDueDate = () => {
    if (!isSortedByDue) {
      const sortedByDueDate = [...toggleableSentencesState].sort(sortByDueDate);
      setToggleableSentencesState(sortedByDueDate);
      setIsSortedByDue(true);
    } else {
      setToggleableSentencesState(difficultSentencesState);
      setIsSortedByDue(false);
    }
  };

  const btnText = isSortedByDue ? '↕ In Due order ✅' : '↕ In Core order 🧠';

  useEffect(() => {
    if (difficultSentencesState?.length > 0) {
      setToggleableSentencesState(difficultSentencesState);
    }
  }, [difficultSentencesState]);

  if (toggleableSentencesState.length === 0) {
    return <LoadingScreen>Getting ready!</LoadingScreen>;
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: '#D3D3D3',
        minHeight: '100%',
        marginBottom: 30,
      }}>
      <View style={{padding: 10}}>
        <View>
          <Text>Difficult Sentences: ({difficultSentencesState.length})</Text>
        </View>
        <View
          style={{
            padding: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            style={{
              padding: 5,
              borderRadius: 10,
            }}
            onPress={sortSentencesByDueDate}>
            <Text>{btnText}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{paddingBottom: 30}}>
          <View style={{marginTop: 10}}>
            {toggleableSentencesState.map(sentence => {
              return (
                <DifficultSentenceWidget
                  key={sentence.id}
                  sentence={sentence}
                  todayDateObj={todayDateObj}
                  saveAudioInstance={saveAudioInstance}
                  audioTempState={audioTempState}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DifficultSentencesContainer;
