import {Text, TouchableOpacity, View} from 'react-native';

const DueColorMarker = ({dueColorState}) => (
  <View
    style={{
      backgroundColor: dueColorState,
      width: 16,
      height: 16,
      borderRadius: 10,
      marginVertical: 'auto',
    }}
  />
);

export const DifficultSentenceContentHeader = ({
  topic,
  dueColorState,
  isCore,
  dueText,
  handleNavigation,
}) => {
  return (
    <View style={{display: 'flex', flexDirection: 'row', gap: 5}}>
      <DueColorMarker dueColorState={dueColorState} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}>
        <TouchableOpacity onPress={handleNavigation}>
          <Text
            style={{
              fontStyle: 'italic',
              textDecorationLine: 'underline',
            }}>
            {topic} {isCore ? '🧠' : ''}
          </Text>
        </TouchableOpacity>
        <Text>{dueText} 😓</Text>
      </View>
    </View>
  );
};

export default DifficultSentenceContentHeader;
