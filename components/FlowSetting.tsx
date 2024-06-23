import {TouchableOpacity, Text, View} from 'react-native';

const FlowSetting = ({isFlowingSentences, setIsFlowingSentences}) => {
  return (
    <View style={{margin: 'auto', padding: 10}}>
      <TouchableOpacity
        onPress={() => setIsFlowingSentences(!isFlowingSentences)}>
        <Text>{isFlowingSentences ? 'Flowing 🏄🏽' : 'One By One 🧱'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FlowSetting;
