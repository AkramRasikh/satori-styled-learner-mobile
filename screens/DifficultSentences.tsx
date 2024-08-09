import {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {loadDifficultSentences} from '../api/load-difficult-sentences';
import DifficultSentenceWidget from '../components/DifficultSentenceWidget';

const DifficultSentences = (): React.JSX.Element => {
  const [difficultSentencesState, setDifficultSentencesState] = useState([]);
  // const [audiosLoaded, setAudiosLoaded] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await loadDifficultSentences();

        setDifficultSentencesState(res);
      } catch (error) {
        console.log('## DifficultSentences', {error});
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading || !difficultSentencesState.length) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontStyle: 'italic', fontSize: 30, fontWeight: 'bold'}}>
          Loading difficult sentences...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{backgroundColor: '#D3D3D3', minHeight: '100%'}}>
      <View style={{padding: 10}}>
        <View>
          <Text>Difficult Sentences:</Text>
        </View>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View style={{marginTop: 10}}>
            {difficultSentencesState.map(sentence => {
              return (
                <DifficultSentenceWidget
                  key={sentence.id}
                  sentence={sentence}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DifficultSentences;
