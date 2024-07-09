import {generateRandomId} from '../utils/generate-random-id';

const useContentControls = ({
  japaneseLoadedWords,
  setLongPressedWord,
  soundRef,
  setIsPlaying,
  setMiniSnippets,
  longPressedWord,
  getSafeText,
  topicData,
  miniSnippets,
  topicName,
  masterPlay,
  currentTimeState,
  url,
  pauseSound,
}) => {
  const getTimeStamp = () => {
    const id = topicName + '-' + generateRandomId();
    const thisItem = topicData.find(item => item.id === masterPlay);
    const targetLang = thisItem.targetLang;
    const itemToSave = {
      id,
      sentenceId: masterPlay,
      pointInAudio: currentTimeState,
      url,
      targetLang,
      topicName,
    };
    setMiniSnippets(prev => [...prev, itemToSave]);
    pauseSound();
    setIsPlaying(false);
  };

  const onLongPress = text => {
    const longPressedText = japaneseLoadedWords.find(
      word => word.surfaceForm === text,
    );
    if (longPressedText) {
      setLongPressedWord(longPressedText);
    }
  };
  const formatTextForTargetWords = () => {
    const formattedText = topicData.map(sentence => {
      return {
        ...sentence,
        safeText: getSafeText(sentence.targetLang),
      };
    });

    return formattedText;
  };
  const playFromThisSentence = id => {
    if (soundRef.current) {
      const thisItem = topicData.find(item => item.id === id);
      if (thisItem) {
        soundRef.current.getCurrentTime(() => {
          soundRef.current.setCurrentTime(thisItem.startAt);
        });
        soundRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteSnippet = idToBeDeleted => {
    const newSnippets = miniSnippets.filter(
      snippet => snippet.id !== idToBeDeleted,
    );
    setMiniSnippets(newSnippets);
  };

  const getLongPressedWordData = () => {
    const surfaceForm = longPressedWord.surfaceForm;
    const baseForm = longPressedWord.baseForm;
    const phonetic = longPressedWord.phonetic;
    const definition = longPressedWord.definition;

    return (
      surfaceForm + '...' + baseForm + '...' + phonetic + '...' + definition
    );
  };

  return {
    onLongPress,
    formatTextForTargetWords,
    playFromThisSentence,
    deleteSnippet,
    getLongPressedWordData,
    getTimeStamp,
  };
};

export default useContentControls;
