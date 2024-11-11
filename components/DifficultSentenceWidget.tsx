import {Text, View} from 'react-native';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import {useEffect, useMemo, useRef, useState} from 'react';
import {getFirebaseAudioURL} from '../hooks/useGetCombinedAudioData';
import DifficultSentenceContent from './DifficultSentenceContent';
import {getDueDateText} from '../utils/get-date-due-status';
import useMP3File from '../hooks/useMP3File';
import {generateRandomId} from '../utils/generate-random-id';
import {mergeAndRemoveDuplicates} from '../utils/merge-and-remove-duplicates';
import useData from '../context/Data/useData';
import useLanguageSelector from '../context/Data/useLanguageSelector';
import DifficultSentenceAudioContainer from './DifficultSentenceAudioContainer';
import DifficultSentenceSnippetContainer from './DifficultSentenceSnippetContainer';
import AreYouSureSection from './AreYouSureSection';

const DifficultSentenceWidget = ({
  sentence,
  updateSentenceData,
  isLastEl,
  dueStatus,
  addSnippet,
  removeSnippet,
  pureWords,
  sentenceBeingHighlightedState,
  setSentenceBeingHighlightedState,
  dueDate,
  setToggleableSentencesState,
}) => {
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [showReviewSettings, setShowReviewSettings] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [miniSnippets, setMiniSnippets] = useState([]);
  const [showThisWordsDefinitions, setShowThisWordsDefinitions] =
    useState(null);

  const {getThisSentencesWordList, updatingSentenceState} = useData();
  const {languageSelectedState} = useLanguageSelector();

  const id = sentence.id;
  const topic = sentence.topic;
  const isCore = sentence?.isCore;
  const baseLang = sentence.baseLang;
  const targetLang = sentence.targetLang;
  const isMediaContent = sentence.isMediaContent;

  const audioId = isMediaContent ? topic : id;
  const soundRef = useRef();

  const matchedWordList = getThisSentencesWordList(targetLang);
  const snippetsLocalAndDb = useMemo(() => {
    return mergeAndRemoveDuplicates(
      sentence?.snippets?.sort((a, b) => a.pointInAudio - b.pointInAudio),
      miniSnippets,
    );
  }, [sentence, miniSnippets]);

  const handleSnippet = currentTime => {
    const snippetId = topic + '-' + generateRandomId();
    const itemToSave = {
      id: snippetId,
      sentenceId: id,
      pointInAudio: currentTime,
      isIsolated: true,
      url,
      topicName: topic,
    };
    setMiniSnippets(prev => [...prev, itemToSave]);
  };

  const url = getFirebaseAudioURL(audioId, languageSelectedState);

  // filePath iccorrectingly has previous
  const {loadFile, filePath} = useMP3File(audioId);

  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
  });

  useEffect(() => {
    // if (filePath?.includes(audioId) && !isLoaded) {
    if (filePath && !isLoaded) {
      triggerLoadURL();
    }
  }, [filePath, triggerLoadURL, isLoaded]);
  // }, [filePath, triggerLoadURL, audioId, isLoaded]);

  const handleLoad = () => {
    loadFile(audioId, url);
  };

  const handleDeleteContent = async () => {
    try {
      setToggleableSentencesState(prev =>
        prev.filter(sentenceData => sentenceData.id !== sentence.id),
      );
      await updateSentenceData({
        isAdhoc: sentence?.isAdhoc,
        topicName: sentence.topic,
        sentenceId: sentence.id,
        fieldToUpdate: {
          reviewData: null,
          nextReview: null,
          reviewHistory: null,
        },
      });
      setShowReviewSettings(false);
    } catch (error) {
      console.log('## handleDeleteContent', {error});
    }
  };

  const thisSentenceIsLoading = updatingSentenceState === sentence.id;

  const getLongPressedWordData = () => {
    if (!showThisWordsDefinitions) {
      return;
    }
    return showThisWordsDefinitions.map((word, index) => {
      const surfaceForm = word.surfaceForm;
      const baseForm = word.baseForm;
      const phonetic = word.phonetic || word.transliteration;
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

  const generalLongPress = text => {
    const longPressedTexts = matchedWordList.filter(word =>
      text.includes(word.surfaceForm),
    );
    return longPressedTexts;
  };

  const onLongPress = text => {
    const longPressedTexts = generalLongPress(text);
    if (longPressedTexts.length > 0) {
      setShowThisWordsDefinitions(longPressedTexts);
    }
  };

  const {dueColorState} = getDueDateText(dueStatus);

  return (
    <View
      key={id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginBottom: 10,
        paddingBottom: isLastEl ? 100 : 0,
        opacity: thisSentenceIsLoading ? 0.5 : 1,
      }}>
      {thisSentenceIsLoading && (
        <View
          style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            right: '50%',
            top: '50%',
            opacity: 1,
            zIndex: 100,
          }}>
          <Text
            style={{
              fontSize: 30,
            }}>
            ⏳
          </Text>
        </View>
      )}
      <View>
        {showThisWordsDefinitions?.length > 0 ? (
          <View
            style={{
              paddingTop: 5,
              borderTopColor: 'gray',
              borderTopWidth: 1,
            }}>
            <Text>{getLongPressedWordData()}</Text>
          </View>
        ) : null}
      </View>
      <DifficultSentenceContent
        topic={topic}
        isCore={isCore}
        targetLang={targetLang}
        baseLang={baseLang}
        sentenceId={id}
        setShowReviewSettings={setShowReviewSettings}
        dueText={dueDate}
        dueColorState={dueColorState}
        pureWords={pureWords}
        onLongPress={onLongPress}
        sentenceBeingHighlightedState={sentenceBeingHighlightedState}
        setSentenceBeingHighlightedState={setSentenceBeingHighlightedState}
        updateSentenceData={updateSentenceData}
        sentence={sentence}
      />
      <DifficultSentenceAudioContainer
        isLoaded={isLoaded}
        soundRef={soundRef}
        url={url}
        topic={topic}
        handleSnippet={handleSnippet}
        sentence={sentence}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentTimeState={currentTimeState}
        setCurrentTimeState={setCurrentTimeState}
        handleLoad={handleLoad}
        isMediaContent={isMediaContent}
      />
      {showReviewSettings ? (
        <AreYouSureSection
          handleClose={() => setShowReviewSettings(false)}
          handleYesSure={handleDeleteContent}
        />
      ) : null}
      <DifficultSentenceSnippetContainer
        isLoaded={isLoaded}
        soundRef={soundRef}
        snippetsLocalAndDb={snippetsLocalAndDb}
        setCurrentTimeState={setCurrentTimeState}
        currentTimeState={currentTimeState}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        addSnippet={addSnippet}
        removeSnippet={removeSnippet}
        setMiniSnippets={setMiniSnippets}
        url={url}
      />
    </View>
  );
};

export default DifficultSentenceWidget;
