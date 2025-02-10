import {generateRandomId} from '../utils/generate-random-id';

const useContentControls = ({
  url,
  targetLanguageLoadedWords,
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
  pauseSound,
  isText,
  setCurrentTimeState,
  setSelectedSnippetsState,
  removeSnippet,
}) => {
  const timeDataWithinSnippet = (thisItem, currentTimeState) => {
    const pointInAudioInSnippet = currentTimeState - thisItem.startAt;
    return pointInAudioInSnippet;
  };
  const getTimeStamp = () => {
    const id = topicName + '-' + generateRandomId();
    const thisItem = topicData.find(item => item.id === masterPlay);
    const targetLang = thisItem?.targetLang;
    if (!targetLang) {
      return null;
    }
    const itemToSave = {
      id,
      sentenceId: masterPlay,
      pointInAudio: isText
        ? timeDataWithinSnippet(thisItem, currentTimeState)
        : currentTimeState,
      isIsolated: isText ? true : false,
      endAt: thisItem.endAt,
      startAt: thisItem.startAt,
      url,
      pointInAudioOnClick: currentTimeState,
      targetLang,
      topicName,
    };
    setMiniSnippets(prev => [...prev, itemToSave]);
    pauseSound();
    setIsPlaying(false);
  };

  const onLongPress = text => {
    const longPressedTexts = targetLanguageLoadedWords?.filter(word =>
      text.includes(word.surfaceForm),
    );
    if (longPressedTexts.length > 0) {
      setLongPressedWord(longPressedTexts);
    }
  };
  const formatTextForTargetWords = () => {
    const formattedText = topicData.map(sentence => {
      const textWithUnderlinedWords = getSafeText(sentence.targetLang);
      const matchedWords = [];
      textWithUnderlinedWords.props.textSegments.forEach(segment => {
        if (segment.id === 'targetWord') {
          matchedWords.push(segment.text);
        }
      });

      const matchedWordsComprehensive =
        matchedWords.length > 0
          ? matchedWords
              .map(x => {
                return targetLanguageLoadedWords.filter(word =>
                  x.includes(word.surfaceForm),
                );
              })
              .flat()
          : [];

      return {
        ...sentence,
        safeText: textWithUnderlinedWords,
        matchedWords: matchedWordsComprehensive,
      };
    });

    return formattedText;
  };
  const playFromThisSentence = playFromHere => {
    if (soundRef.current && isFinite(playFromHere)) {
      soundRef.current.getCurrentTime(() => {
        soundRef.current.setCurrentTime(playFromHere);
      });
      setCurrentTimeState(playFromHere);
      soundRef.current.play();
      setIsPlaying(true);
    }
  };

  const deleteSnippet = ({snippetId, sentenceId}) => {
    removeSnippet({snippetId, sentenceId});
    const newSnippets = miniSnippets.filter(
      snippet => snippet.id !== snippetId,
    );
    setMiniSnippets(newSnippets);
    setSelectedSnippetsState(prev =>
      prev.filter(snippetData => snippetData.id !== snippetId),
    );
  };

  const getLongPressedWordData = () => {
    return longPressedWord.map((word, index) => {
      const surfaceForm = word.surfaceForm;
      const baseForm = word.baseForm;
      const phonetic = word.phonetic || word?.transliteration;
      const definition = word.definition;

      const isLastInArr = index + 1 === longPressedWord.length;

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
