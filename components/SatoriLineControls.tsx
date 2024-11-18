import {Text, TouchableOpacity, View} from 'react-native';
import useOpenGoogleTranslate from './useOpenGoogleTranslate';

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
  setShowWordHintState,
  showWordHintState,
  hasWordHint,
}) => {
  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const handleOpenGoogle = () => {
    openGoogleTranslateApp(topicSentence.targetLang);
  };
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
          gap: 10,
        }}>
        <TouchableOpacity onPress={() => setShowEng(!showEng)}>
          <Text>🇬🇧</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={copySentence}>
          <Text>📋</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openReviewPortal}>
          <Text>😓</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleOpenGoogle}>
          <Text>📚</Text>
        </TouchableOpacity>
        {topicSentence.notes ? (
          <TouchableOpacity onPress={() => setShowNotes(!showNotes)}>
            <Text>☝🏽</Text>
          </TouchableOpacity>
        ) : null}
        {hasWordHint ? (
          <TouchableOpacity
            onPress={() => setShowWordHintState(!showWordHintState)}>
            <Text>🔍</Text>
          </TouchableOpacity>
        ) : null}
        {highlightMode ? (
          <TouchableOpacity onPress={() => setHighlightMode(false)}>
            <Text>❌</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setHighlightMode(true)}>
            <Text>🖌️</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={handlePlayThisLine}>
        {isPlaying && focusThisSentence ? <Text>⏸️</Text> : <Text>▶️</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default SatoriLineControls;
