const useContentControls = ({
  targetLanguageLoadedWords,
  getSafeText,
  topicData,
}) => {
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

  return {
    formatTextForTargetWords,
  };
};

export default useContentControls;
