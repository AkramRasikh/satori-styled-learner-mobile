import {useEffect} from 'react';

export const formatTextForTargetWords = (
  contentToFormat,
  getSafeText,
  targetLanguageLoadedWords,
) => {
  const formattedText = contentToFormat.map(sentence => {
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
const useFormatUnderlyingWords = ({
  setUpdateWordList,
  updateWordList,
  setSelectedContentState,
  loadedContent,
  getSafeText,
  targetLanguageLoadedWords,
}) => {
  useEffect(() => {
    if (updateWordList) {
      console.log('## setSelectedContentState!');
      setSelectedContentState({
        ...loadedContent,
        content: formatTextForTargetWords(
          loadedContent.content,
          getSafeText,
          targetLanguageLoadedWords,
        ),
      });
      setUpdateWordList(false);
    }
  }, [updateWordList]);
};

export default useFormatUnderlyingWords;
