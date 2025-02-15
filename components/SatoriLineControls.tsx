import React, {Text, TouchableOpacity, View} from 'react-native';
import {Icon, MD2Colors, MD3Colors} from 'react-native-paper';

const SatoriLineControls = ({
  handlePlayThisLine,
  isPlaying,
  focusThisSentence,
  copySentence,
  openReviewPortal,
  topicSentence,
  setShowEng,
  showEng,
  setShowNotes,
  showNotes,
  highlightMode,
  setHighlightMode,
  showSentenceBreakdown,
  setShowSentenceBreakdown,
  getSentenceBreakdown,
  setShowMatchedTranslation,
  showMatchedTranslation,
  handleOpenGoogle,
  setIsSettingsOpenState,
}) => {
  const hasSentenceBreakdown = topicSentence?.vocab;
  const matchedWords = topicSentence?.matchedWords.length > 0;

  return (
    <View
      style={{
        width: '100%',
        marginBottom: highlightMode ? 3 : 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 20,
        }}>
        <TouchableOpacity onPress={() => setIsSettingsOpenState(false)}>
          <Icon source="menu-open" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowEng(!showEng)}>
          <Text>🇬🇧</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={copySentence}>
          <Icon source="content-copy" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={openReviewPortal}>
          <Icon source="calendar-clock" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenGoogle}>
          <Icon source="google-translate" size={20} color={MD2Colors.blue600} />
        </TouchableOpacity>
        {topicSentence.notes ? (
          <TouchableOpacity onPress={() => setShowNotes(!showNotes)}>
            <Icon source="notebook" size={20} />
          </TouchableOpacity>
        ) : null}
        {highlightMode ? (
          <TouchableOpacity onPress={() => setHighlightMode(false)}>
            <Icon source="close" size={20} color={MD3Colors.error50} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setHighlightMode(true)}>
            <Icon source="format-color-highlight" size={20} />
          </TouchableOpacity>
        )}
        {hasSentenceBreakdown ? (
          <TouchableOpacity
            onPress={() => setShowSentenceBreakdown(!showSentenceBreakdown)}>
            <Icon source="glasses" size={20} color={MD2Colors.green700} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={getSentenceBreakdown}>
            <Icon source="glasses" size={20} color={MD3Colors.error50} />
          </TouchableOpacity>
        )}
        {matchedWords && (
          <TouchableOpacity
            onPress={() => setShowMatchedTranslation(!showMatchedTranslation)}>
            <Icon source="book-open-variant" size={20} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        onPress={handlePlayThisLine}
        style={{
          marginRight: 15,
        }}>
        <Text>{isPlaying && focusThisSentence ? '⏸' : '▶️'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SatoriLineControls;
