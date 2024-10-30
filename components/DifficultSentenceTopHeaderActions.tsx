import {Text, TouchableOpacity, View} from 'react-native';
import SRSTogglesMini from './SRSTogglesMini';

const DifficultSentenceTopHeaderActions = ({
  isDueNow,
  updateSentenceData,
  setToggleableSentencesState,
  sentence,
  sentenceBeingHighlightedState,
  handleSettingHighlightmode,
  setSentenceBeingHighlightedState,
  handleCopyText,
  handleOpenGoogleTranslate,
  setHighlightedIndices,
  setShowReviewSettings,
}) => {
  const handleCloseHighlighting = () => {
    setHighlightedIndices([]);
    setSentenceBeingHighlightedState('');
  };
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 5,
        justifyContent: isDueNow ? 'space-between' : 'flex-end',
      }}>
      {isDueNow ? (
        <SRSTogglesMini
          sentence={sentence}
          updateSentenceData={updateSentenceData}
          setToggleableSentencesState={setToggleableSentencesState}
          setShowReviewSettings={setShowReviewSettings}
        />
      ) : null}
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
          marginVertical: 'auto',
        }}>
        {sentence.id !== sentenceBeingHighlightedState ? (
          <TouchableOpacity onPress={handleSettingHighlightmode}>
            <Text>🖌️</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleCloseHighlighting}>
            <Text>❌</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleCopyText}>
          <Text>📋</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenGoogleTranslate}>
          <Text>📚</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DifficultSentenceTopHeaderActions;
