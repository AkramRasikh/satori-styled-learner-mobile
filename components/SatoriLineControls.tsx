import {Text, TouchableOpacity, View} from 'react-native';
import {getEmptyCard} from '../srs-algo';
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
  textWidth,
  hasBeenMarkedAsDifficult,
  topicName,
  updateSentenceData,
  highlightMode,
  setHighlightMode,
}) => {
  const {openGoogleTranslateApp} = useOpenGoogleTranslate();

  const handleQuickNextDayReview = async () => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);
    const nextReviewData = {
      ...getEmptyCard(),
      due: newDate,
    };
    try {
      await updateSentenceData({
        topicName,
        sentenceId: topicSentence.id,
        fieldToUpdate: {
          reviewData: nextReviewData,
        },
      });
    } catch (error) {
      console.log('## handleQuickNextDayReview error', error);
    }
  };

  const handleOpenGoogle = () => {
    openGoogleTranslateApp(topicSentence.targetLang);
  };
  return (
    <View
      style={{
        width: textWidth,
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
        {!hasBeenMarkedAsDifficult ? (
          <TouchableOpacity onPress={handleQuickNextDayReview}>
            <Text>➕</Text>
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
