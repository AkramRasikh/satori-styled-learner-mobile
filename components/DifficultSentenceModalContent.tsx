import {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {DifficultSentenceContentHeader} from './DifficultSentenceContent';
import HighlightTextZone from './HighlightTextZone';
import SwitchButton from './SwitchButton';
import useData from '../context/Data/useData';

const TargetLanguage = ({getSafeText}) => {
  const text = getSafeText();
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
  getSafeText,
  showThisWordsDefinitions,
}) => {
  const [showReviewSettings, setShowReviewSettings] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const [highlightMode, setHighlightMode] = useState(false);
  const [highlightedIndices, setHighlightedIndices] = useState([]);
  const {saveWordFirebase} = useData();

  const topic = sentenceData.topic;
  const isCore = sentenceData?.isCore;
  const baseLang = sentenceData.baseLang;
  const targetLang = sentenceData.targetLang;

  const getLongPressedWordData = () => {
    return showThisWordsDefinitions.map((word, index) => {
      const surfaceForm = word.surfaceForm;
      const baseForm = word.baseForm;
      const phonetic = word.phonetic;
      const definition = word.definition;

      const isLastInArr = index + 1 === showThisWordsDefinitions.length;

      const newLine = !isLastInArr ? '\n' : '';
      const indexToNumber = index + 1;

      return (
        indexToNumber +
        ') ' +
        surfaceForm +
        ', ' +
        baseForm +
        ', ' +
        phonetic +
        ', ' +
        definition +
        newLine
      );
    });
  };

  const handleLayout = event => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={{width: '100%', overflow: 'hidden'}}>
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'flex-end',
          marginBottom: 10,
        }}>
        <Text
          style={{
            alignSelf: 'center',
          }}>
          Highlight
        </Text>
        <SwitchButton isOn={highlightMode} setIsOn={setHighlightMode} />
      </View>
      <View
        style={{
          marginBottom: 10,
        }}>
        <DifficultSentenceContentHeader
          topic={topic}
          dueColorState={dueColorState}
          isCore={isCore}
          dueText={dueText}
          setShowReviewSettings={() =>
            setShowReviewSettings(!showReviewSettings)
          }
          showReviewSettings={showReviewSettings}
        />
      </View>
      <View>
        {showThisWordsDefinitions?.length > 0 ? (
          <View
            style={{
              marginBottom: 15,
              borderTopColor: 'gray',
              borderTopWidth: 2,
              padding: 5,
            }}>
            <Text>{getLongPressedWordData()}</Text>
          </View>
        ) : null}
      </View>
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
            saveWordFirebase={saveWordFirebase}
            // saveWordFirebase={saveWordFirebase}
            setHighlightMode={setHighlightMode}
            textWidth={containerWidth}
          />
        </View>
      ) : (
        <TargetLanguage getSafeText={getSafeText} />
      )}
      <BaseLanguage text={baseLang} />
      {showReviewSettings && <ReviewSettings />}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
  },
});

export default DifficultSentenceModalContent;
