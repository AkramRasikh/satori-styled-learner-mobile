import {useState} from 'react';
import {Dimensions, Text, TouchableOpacity, View} from 'react-native';
import AnimatedWordModal from './WordModal';

const FlashcardsWordsSection = ({dueCardsState}) => {
  const [selectedDueCardState, setSelectedDueCardState] = useState();
  const {width} = Dimensions?.get('window');

  const handleDeleteWord = () => {};

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
      }}>
      {dueCardsState?.map((wordData, index) => {
        const listTextNumber = index + 1 + ') ';
        const isSelectedWord = selectedDueCardState?.id === wordData.id;
        const isCardDue = wordData?.isCardDue;
        if (index === 0) {
          console.log('## ', {wordData});
        }

        return (
          <View
            key={wordData.id}
            style={{
              borderBlockColor: 'black',
              borderWidth: 2,
              padding: 5,
              borderRadius: 5,
              width: isSelectedWord ? width * 0.9 : 'auto',
              backgroundColor: isCardDue && 'pink',
            }}>
            <TouchableOpacity onPress={() => setSelectedDueCardState(wordData)}>
              <Text
                style={{
                  fontSize: 24,
                }}>
                {listTextNumber}
                {wordData.baseForm}
              </Text>
            </TouchableOpacity>
            {isSelectedWord && (
              <AnimatedWordModal
                visible={wordData}
                onClose={() => setSelectedDueCardState(null)}
                deleteWord={handleDeleteWord}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

export default FlashcardsWordsSection;
