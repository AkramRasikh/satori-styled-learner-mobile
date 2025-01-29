import {Text, TouchableOpacity, View} from 'react-native';
import SRSTogglesMini from '../SRSTogglesMini';
import {srsRetentionKeyTypes} from '../../srs-algo';

const DifficultSentenceActions = ({
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
  handleShowWords,
}) => {
  const handleCloseHighlighting = () => {
    setHighlightedIndices([]);
    setSentenceBeingHighlightedState('');
  };
  return (
    <View
      style={{
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
          flexDirection: 'row',
          gap: 15,
          marginVertical: 'auto',
          alignSelf: 'flex-end',
        }}>
        <TouchableOpacity onPress={handleShowWords}>
          <Text>📖</Text>
        </TouchableOpacity>
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

export default DifficultSentenceActions;
