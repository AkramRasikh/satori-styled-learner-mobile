import React, {Text, TouchableOpacity, View} from 'react-native';
import useOpenGoogleTranslate from '../hooks/useOpenGoogleTranslate';
import {Icon, MD2Colors, MD3Colors} from 'react-native-paper';

//
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
}) => {
  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const handleOpenGoogle = () => {
    openGoogleTranslateApp(topicSentence.targetLang);
  };

  const hasSentenceBreakdown = topicSentence?.vocab;

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
          gap: 15,
        }}>
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
      </View>
      <TouchableOpacity onPress={handlePlayThisLine}>
        <Icon
          source={isPlaying && focusThisSentence ? 'pause' : 'play'}
          size={20}
          color={isPlaying && focusThisSentence && MD2Colors.green300}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SatoriLineControls;
