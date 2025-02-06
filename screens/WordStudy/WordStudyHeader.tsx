import React, {Text, View} from 'react-native';

import PillButton from '../../components/PillButton';
import {Button, Icon, MD3Colors} from 'react-native-paper';
import {useSelector} from 'react-redux';

const WordStudyHeader = ({
  setShowDueCardsState,
  setShowCategories,
  showDueCardsState,
  selectedTopic,
  showCategories,
  setSelectedTopic,
  setDueCardsState,
  wordStudyState,
  wordCategories,
  realCapacity,
}) => {
  const handleRemoveSelectedTopic = () => {
    setSelectedTopic('');
    setDueCardsState(wordStudyState);
  };

  const targetLanguageWordsState = useSelector(state => state.words);

  const fullCapacity = targetLanguageWordsState.length;

  const numOfCategories = wordCategories.length;

  return (
    <View
      style={{
        flexWrap: 'wrap',
        paddingBottom: 10,
      }}>
      <PillButton
        isShowDueOnly={showDueCardsState}
        isDueLabel={`Due only (${realCapacity})`}
        setIsShowDueOnly={setShowDueCardsState}
        isNotDueLabel={`All (${fullCapacity})`}
      />
      <View
        style={{
          margin: 5,
        }}>
        {!selectedTopic ? (
          <Button
            onPress={() => setShowCategories(!showCategories)}
            mode="outlined"
            icon={
              showCategories
                ? () => (
                    <Icon
                      source="filter-variant-remove"
                      color={MD3Colors.error50}
                    />
                  )
                : ''
            }>
            <Text>Categories ({numOfCategories})</Text>
          </Button>
        ) : (
          <Button
            onPress={handleRemoveSelectedTopic}
            mode="outlined"
            icon={() => (
              <Icon source="filter-variant-remove" color={MD3Colors.error50} />
            )}
            buttonColor="yellow">
            <Text> {selectedTopic}</Text>
          </Button>
        )}
      </View>
    </View>
  );
};
export default WordStudyHeader;
