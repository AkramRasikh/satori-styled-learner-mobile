import {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {DifficultSentenceContentHeader} from './DifficultSentenceContent';
import HighlightTextZone from './HighlightTextZone';

const TargetLanguage = ({text}) => {
  return (
    <View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};
const BaseLanguage = ({text}) => {
  return (
    <View>
      <Text style={styles.text}> {text}</Text>
    </View>
  );
};

const ReviewSettings = () => {
  return (
    <View>
      <Text>ReviewSettings</Text>
    </View>
  );
};

const DifficultSentenceModalContent = ({
  sentenceData,
  dueColorState,
  dueText,
}) => {
  const [showReviewSettings, setShowReviewSettings] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);

  const topic = sentenceData.topic;
  const isCore = sentenceData?.isCore;
  const baseLang = sentenceData.baseLang;
  const targetLang = sentenceData.targetLang;

  const handleLayout = event => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={{width: '100%', overflow: 'hidden'}}>
      <TouchableOpacity onPress={() => setHighlightMode(!highlightMode)}>
        <Text>HighlightMode</Text>
      </TouchableOpacity>
      <DifficultSentenceContentHeader
        topic={topic}
        dueColorState={dueColorState}
        isCore={isCore}
        dueText={dueText}
        setShowReviewSettings={() => setShowReviewSettings(!showReviewSettings)}
        showReviewSettings={showReviewSettings}
      />
      {highlightMode ? (
        <View
          onLayout={handleLayout} // Attach the onLayout event handler
        >
          <HighlightTextZone
            id={sentenceData.id}
            sentenceIndex={0}
            text={targetLang}
            highlightedIndices={highlightedIndices}
            setHighlightedIndices={setHighlightedIndices}
            saveWordFirebase={() => {}}
            // saveWordFirebase={saveWordFirebase}
            setHighlightMode={setHighlightMode}
            textWidth={containerWidth}
          />
        </View>
      ) : (
        <TargetLanguage text={targetLang} />
      )}
      <BaseLanguage text={baseLang} />
      {showReviewSettings && <ReviewSettings />}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});

export default DifficultSentenceModalContent;
