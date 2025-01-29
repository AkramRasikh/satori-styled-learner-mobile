import React, {Button, Text, View} from 'react-native';
import PillButton from '../../components/PillButton';

const DifficultSentencesHeaderSection = ({
  isShowDueOnly,
  setIsShowDueOnly,
  toggleableSentencesState,
  difficultSentencesState,
  handleRefreshFunc,
}) => (
  <View>
    <View>
      <Text>
        Difficult Sentences: ({toggleableSentencesState.length}/
        {difficultSentencesState.length})
      </Text>
    </View>
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 5,
      }}>
      <PillButton
        isShowDueOnly={isShowDueOnly}
        setIsShowDueOnly={setIsShowDueOnly}
      />
      <View>
        <Button title="↺" onPress={handleRefreshFunc} />
      </View>
    </View>
  </View>
);

export default DifficultSentencesHeaderSection;
