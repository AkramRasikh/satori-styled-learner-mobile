import React, {Text, View} from 'react-native';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import {useEffect, useRef, useState} from 'react';
import {getFirebaseAudioURL} from '../hooks/useGetCombinedAudioData';
import DifficultSentenceContent from './DifficultSentenceContent';
import {getDueDateText} from '../utils/get-date-due-status';
import useMP3File from '../hooks/useMP3File';
import {generateRandomId} from '../utils/generate-random-id';
import useData from '../context/Data/useData';
import useLanguageSelector from '../context/LanguageSelector/useLanguageSelector';
import DifficultSentenceAudioContainer from './DifficultSentenceAudioContainer';
import DifficultSentenceSnippetContainer from './DifficultSentenceSnippetContainer';

const TopSection = ({
  thisSentenceIsLoading,
  showThisWordsDefinitions,
  getLongPressedWordData,
}) => {
  return (
    <>
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
    </>
  );
};

const BottomAudioSection = ({sentence, addSnippet, removeSnippet}) => {
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [miniSnippets, setMiniSnippets] = useState([]);

  const {targetLanguageSnippetsState} = useData();
  const {languageSelectedState} = useLanguageSelector();

  useEffect(() => {
    setMiniSnippets(
      targetLanguageSnippetsState.filter(
        snippetData => snippetData.sentenceId === id,
      ),
    );
  }, []);

  const id = sentence.id;
  const topic = sentence.topic;
  const isMediaContent = sentence.isMediaContent;

  const audioId = isMediaContent ? topic : id;
  const soundRef = useRef();

  const url = getFirebaseAudioURL(audioId, languageSelectedState);

  const {loadFile, filePath} = useMP3File(audioId);
  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
  });

  const handleLoad = () => {
    loadFile(audioId, url);
  };

  useEffect(() => {
    if (filePath && !isLoaded) {
      triggerLoadURL();
    }
  }, [filePath, triggerLoadURL, isLoaded]);

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

  return (
    <>
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
      {miniSnippets?.length > 0 && (
        <DifficultSentenceSnippetContainer
          isLoaded={isLoaded}
          soundRef={soundRef}
          snippetsLocalAndDb={miniSnippets}
          setCurrentTimeState={setCurrentTimeState}
          currentTimeState={currentTimeState}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          addSnippet={addSnippet}
          removeSnippet={removeSnippet}
          setMiniSnippets={setMiniSnippets}
          url={url}
        />
      )}
    </>
  );
};

const DifficultSentenceWidget = ({
  sentence,
  updateSentenceData,
  dueStatus,
  addSnippet,
  removeSnippet,
  pureWords,
  sentenceBeingHighlightedState,
  setSentenceBeingHighlightedState,
  dueDate,
  navigation,
}) => {
  const [showReviewSettings, setShowReviewSettings] = useState(false);
  const [showThisWordsDefinitions, setShowThisWordsDefinitions] =
    useState(null);

  const {updatingSentenceState, getThisSentencesWordList} = useData();

  const id = sentence.id;
  const topic = sentence.topic;
  const isCore = sentence?.isCore;
  const baseLang = sentence.baseLang;
  const targetLang = sentence.targetLang;
  const matchedWordList = getThisSentencesWordList(targetLang);

  const handleDeleteContent = () => {
    updateSentenceData({
      isAdhoc: sentence?.isAdhoc,
      topicName: sentence.topic,
      sentenceId: sentence.id,
      fieldToUpdate: {
        reviewData: null,
        nextReview: null,
        reviewHistory: null,
      },
      contentIndex: sentence?.contentIndex,
    });
    setShowReviewSettings(false);
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginBottom: 10,
        opacity: thisSentenceIsLoading ? 0.5 : 1,
      }}>
      <TopSection
        thisSentenceIsLoading={thisSentenceIsLoading}
        showThisWordsDefinitions={showThisWordsDefinitions}
        getLongPressedWordData={getLongPressedWordData}
      />
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
        navigation={navigation}
        handleClose={() => setShowReviewSettings(false)}
        handleYesSure={handleDeleteContent}
        showReviewSettings={showReviewSettings}
      />
      <BottomAudioSection
        sentence={sentence}
        addSnippet={addSnippet}
        removeSnippet={removeSnippet}
      />
    </View>
  );
};

export default DifficultSentenceWidget;
