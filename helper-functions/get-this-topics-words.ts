import {makeArrayUnique} from '../hooks/useHighlightWordToWordBank';

export const getThisTopicsWords = ({
  pureWordsUnique,
  topicData,
  japaneseLoadedWords,
}) => {
  const masterBank = makeArrayUnique([...(pureWordsUnique || [])]);
  if (masterBank?.length === 0) return [];
  const targetLangItems = topicData.map(item => item.targetLang);

  const pattern = new RegExp(`(${masterBank.join('|')})`, 'g');

  const segments = [] as any;
  targetLangItems.forEach(sentence => {
    sentence.split(pattern).forEach(segment => {
      if (segment.match(pattern)) {
        const thisWordData = japaneseLoadedWords.find(
          word => word.baseForm === segment || word.surfaceForm === segment,
        );
        segments.push(thisWordData);
      }
    });
  });

  return segments;
};
