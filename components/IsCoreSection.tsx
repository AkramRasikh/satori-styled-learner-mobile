import {Text, View} from 'react-native';
import SwitchButton from './SwitchButton';

const IsCoreSection = ({updateTopicMetaData, topicName, isCore}) => {
  const handleIsCore = () => {
    const fieldToUpdate = {
      isCore: !Boolean(isCore),
    };

    updateTopicMetaData({
      topicName,
      fieldToUpdate,
    });
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 10,
      }}>
      <View>
        <Text style={{fontSize: 20, fontStyle: 'italic'}}>Core topic</Text>
      </View>
      <SwitchButton isOn={isCore} setIsOn={handleIsCore} />
    </View>
  );
};

export default IsCoreSection;
