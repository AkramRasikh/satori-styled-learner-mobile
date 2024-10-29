import {Text, TouchableOpacity, View} from 'react-native';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import {useEffect, useMemo, useRef, useState} from 'react';
import {getFirebaseAudioURL} from '../hooks/useGetCombinedAudioData';
import useSoundHook from '../hooks/useSoundHook';
import DifficultSentenceContent from './DifficultSentenceContent';
import SoundSmallSize from './SoundSmallSize';
import {getDueDateText} from '../utils/get-date-due-status';
import useMP3File from '../hooks/useMP3File';
import ProgressBarComponent from './Progress';
import {generateRandomId} from '../utils/generate-random-id';
import useSnippetControls from '../hooks/useSnippetControls';
import useSnippetManageAudioStop from '../hooks/useSnippetManageAudioStop';
import {mergeAndRemoveDuplicates} from '../utils/merge-and-remove-duplicates';
import MiniSnippetTimeChangeHandlers from './MiniSnippetTimeChangeHandlers';
import useData from '../context/Data/useData';
import SRSTogglesSentences from './SRSTogglesSentences';
import DeleteWordSection from './DeleteWordSection';
import useLanguageSelector from '../context/Data/useLanguageSelector';
import SoundWidget from './SoundWidget';

const hasBeenSnippedFromCollectiveURL = snippet => {
  const snippetURL = snippet.url;
  return snippetURL.includes(snippet.topicName);
};

const DifficultSentenceSnippetContainer = ({
  isLoaded,
  soundRef,
  snippetsLocalAndDb,
  setCurrentTimeState,
  currentTimeState,
  isPlaying,
  setIsPlaying,
  addSnippet,
  removeSnippet,
  setMiniSnippets,
  url,
}) => {
  return isLoaded && snippetsLocalAndDb?.length > 0
    ? snippetsLocalAndDb?.map((snippetData, index) => {
        return (
          <ThisSnippetContainer
            key={snippetData.id}
            index={index}
            soundRef={soundRef}
            snippet={snippetData}
            setCurrentTimeState={setCurrentTimeState}
            currentTimeState={currentTimeState}
            masterAudio={isPlaying}
            setMasterAudio={setIsPlaying}
            addSnippet={addSnippet}
            removeSnippet={removeSnippet}
            setMiniSnippets={setMiniSnippets}
            url={url}
          />
        );
      })
    : null;
};

const ThisSnippetContainer = ({
  soundRef,
  setCurrentTimeState,
  currentTimeState,
  snippet,
  url,
  masterAudio,
  setMasterAudio,
  index,
  addSnippet,
  removeSnippet,
  setMiniSnippets,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [adjustableStartTime, setAdjustableStartTime] = useState(undefined);
  const [adjustableDuration, setAdjustableDuration] = useState(4);

  const soundDuration = soundRef.current._duration;
  const isSaved = snippet?.saved;

  const isFromUnifiedURL = hasBeenSnippedFromCollectiveURL(snippet);

  const getStartTime = () => {
    if (isFromUnifiedURL && snippet.startAt) {
      return snippet.pointInAudio - snippet.startAt;
    }
    return snippet.pointInAudio;
  };

  const isSavedAndOutsideOfBoundary =
    isSaved && adjustableStartTime > soundDuration;

  useEffect(() => {
    setAdjustableStartTime(getStartTime());
  }, []);

  useEffect(() => {
    if (masterAudio && isPlaying) {
      setMasterAudio(false);
    }
  }, [masterAudio, setMasterAudio, isPlaying]);

  const handleSaveSnippet = async () => {
    const formattedSnippet = {
      ...snippet,
      pointOfAudioOnClick: undefined,
      endAt: undefined,
      pointInAudio: adjustableStartTime,
      duration: adjustableDuration,
    };
    try {
      const thisSnippetDataFromAPI = await addSnippet(formattedSnippet);
      setMiniSnippets(prev =>
        prev.filter(
          snippetData => snippetData.id !== thisSnippetDataFromAPI.id,
        ),
      );
    } catch (error) {
      console.log('## handleSaveSnippet', error);
    }
  };

  const handleRemoveFromTempSnippets = () => {
    setMiniSnippets(prev =>
      prev.filter(snippetData => snippetData.id !== snippet.id),
    );
  };

  const handleRemoveSnippet = async () => {
    try {
      await removeSnippet({
        snippetId: snippet.id,
        sentenceId: snippet.sentenceId,
      });
    } catch (error) {
      console.log('## handleRemoveSnippet', error);
    }
  };

  const {handleSetEarlierTime, handleSetDuration} = useSnippetControls({
    adjustableStartTime,
    adjustableDuration,
    setAdjustableStartTime,
    setAdjustableDuration,
    snippetEndAtLimit: soundDuration,
    snippetStartAtLimit: 0,
    deleteSnippet: () => {},
    addSnippet: () => {},
    removeSnippet: () => {},
    snippet,
  });

  const {playSound, pauseSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName: snippet.topicName,
    isSnippet: true,
    startTime: isSaved ? getStartTime() : adjustableStartTime,
    setCurrentTime: setCurrentTimeState,
  });

  useSnippetManageAudioStop({
    soundRef,
    isPlaying,
    setIsPlaying,
    startTime: isSaved ? getStartTime() : adjustableStartTime,
    duration: isSaved ? snippet.duration : adjustableDuration,
    currentTime: currentTimeState,
  });

  return (
    <MiniSnippetTimeChangeHandlers
      handleSetEarlierTime={handleSetEarlierTime}
      handleSaveSnippet={handleSaveSnippet}
      handleRemoveSnippet={handleRemoveSnippet}
      handleRemoveFromTempSnippets={handleRemoveFromTempSnippets}
      adjustableDuration={isSaved ? snippet.duration : adjustableDuration}
      handleSetDuration={handleSetDuration}
      adjustableStartTime={adjustableStartTime}
      playSound={playSound}
      pauseSound={pauseSound}
      isPlaying={isPlaying}
      indexList={index}
      isSaved={isSaved}
      isSavedAndOutsideOfBoundary={isSavedAndOutsideOfBoundary}
    />
  );
};

const AudioComponent = ({
  isLoaded,
  soundRef,
  url,
  topic,
  handleSnippet,
  sentence,
  isPlaying,
  setIsPlaying,
  currentTimeState,
  setCurrentTimeState,
  handleLoad,
  isMediaContent,
}) => {
  if (isLoaded) {
    return (
      <SoundWidget
        soundRef={soundRef}
        url={url}
        topicName={topic}
        handleSnippet={handleSnippet}
        sentence={sentence}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentTimeState={currentTimeState}
        setCurrentTimeState={setCurrentTimeState}
        isMediaContent={isMediaContent}
      />
    );
  }
  return (
    <View>
      <TouchableOpacity onPress={handleLoad}>
        <Text>Load URL</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  indexOrder,
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
  const isWithin3Indexs = indexOrder < 3;

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

  const {loadFile, filePath} = useMP3File(audioId);

  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({
    soundRef,
    url: filePath,
  });

  useEffect(() => {
    if (isWithin3Indexs) {
      loadFile(audioId, url);
    }
  }, [indexOrder, loadFile, audioId, url, isWithin3Indexs]);

  useEffect(() => {
    if (filePath) {
      triggerLoadURL();
    }
  }, [filePath, triggerLoadURL]);

  const handleLoad = () => {
    loadFile(audioId, url);
  };

  const handleDeleteContent = async () => {
    try {
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
      const phonetic = word.phonetic || word?.transliteration;
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
      <AudioComponent
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
        <>
          <DeleteWordSection deleteContent={handleDeleteContent} />
          <SRSTogglesSentences
            updateSentenceData={updateSentenceData}
            sentence={sentence}
            limitedOptionsMode={false}
          />
        </>
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
