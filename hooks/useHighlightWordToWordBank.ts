export const makeArrayUnique = array => [...new Set(array)];

const useHighlightWordToWordBank = ({pureWordsUnique}) => {
  const underlineWordsInSentence = sentence => {
    const masterBank = makeArrayUnique([
      // ...savedWords,
      ...(pureWordsUnique || []),
    ]);
    if (masterBank?.length === 0) return [{text: sentence, style: {}}];

    const pattern = new RegExp(`(${masterBank.join('|')})`, 'g');

    const segments = [] as any;

    sentence.split(pattern).forEach(segment => {
      if (segment.match(pattern)) {
        segments.push({
          text: segment,
          style: {textDecorationLine: 'underline'},
          id: 'targetWord',
        });
      } else {
        segments.push({text: segment, style: {}});
      }
    });

    return segments;
  };

  return {
    underlineWordsInSentence,
  };
};
export default useHighlightWordToWordBank;
