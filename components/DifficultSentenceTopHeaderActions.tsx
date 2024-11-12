import {Text, TouchableOpacity, View} from 'react-native';
import SRSTogglesMini from './SRSTogglesMini';
import {srsRetentionKeyTypes} from '../srs-algo';

const DifficultSentenceTopHeaderActions = ({
  isDueNow,
  updateSentenceData,
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
          setShowReviewSettings={setShowReviewSettings}
          contentType={srsRetentionKeyTypes.sentences}
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
