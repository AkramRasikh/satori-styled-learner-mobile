import {Text, TouchableOpacity, View} from 'react-native';
import {getEmptyCard} from '../srs-algo';

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
}) => {
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
  return (
    <View
      style={{
        width: textWidth,
        display: 'flex',
        flexDirection: 'row',
        gap: 10,
      }}>
      <TouchableOpacity onPress={handlePlayThisLine}>
        {isPlaying && focusThisSentence ? (
          <Text style={{marginRight: 5}}>⏸️</Text>
        ) : (
          <Text style={{marginRight: 5}}>▶️</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowEng(!showEng)}>
        <Text style={{marginRight: 5}}>🇬🇧</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={copySentence}>
        <Text style={{marginRight: 5}}>📋</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={openReviewPortal}>
        <Text style={{marginRight: 5}}>😓</Text>
      </TouchableOpacity>
      {topicSentence.notes ? (
        <TouchableOpacity onPress={() => setShowNotes(!showNotes)}>
          <Text style={{marginRight: 5}}>☝🏽</Text>
        </TouchableOpacity>
      ) : null}
      {!hasBeenMarkedAsDifficult ? (
        <TouchableOpacity onPress={handleQuickNextDayReview}>
          <Text style={{marginRight: 5}}>➕</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SatoriLineControls;
