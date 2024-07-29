import {Text, TouchableOpacity} from 'react-native';

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
}) => {
  return (
    <>
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
    </>
  );
};

export default SatoriLineControls;
