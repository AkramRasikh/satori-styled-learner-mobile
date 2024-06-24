import {useState} from 'react';

export const makeArrayUnique = array => [...new Set(array)];

const useHighlightWordToWordBank = ({pureWordsUnique}) => {
  const [highlightedWord, setHighlightedWord] = useState('');
  const [highlightedWordSentenceId, setHighlightedWordSentenceId] = useState();
  const [savedWords, setSavedWords] = useState([]);

  // const handleHighlight = sentenceId => {
  //   const highlightedText = selection.toString().trim();
  //   if (highlightedText !== '') {
  //     setHighlightedWord(highlightedText);
  //     setHighlightedWordSentenceId(sentenceId);
  //   }
  // };

  const removeFromHighlightWordBank = () => {
    setHighlightedWord('');
    setHighlightedWordSentenceId(undefined);
  };

  const saveToWordBank = async () => {
    if (!highlightedWordSentenceId) {
      return;
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;
      const response = await fetch(baseUrl + '/add-word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: highlightedWord,
          contexts: [highlightedWordSentenceId],
        }),
      });
      const res = await response.json();

      const wordAdded = res.word;

      setSavedWords(prev =>
        prev?.length === 0 ? [wordAdded] : [...prev, wordAdded],
      );
    } catch (error) {
      console.error('## saveToWordBank Error:', error);
    } finally {
      removeFromHighlightWordBank();
      setHighlightedWordSentenceId(undefined);
    }
  };

  const underlineWordsInSentence = sentence => {
    const masterBank = makeArrayUnique([
      ...savedWords,
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
    saveToWordBank,
    underlineWordsInSentence,
    removeFromHighlightWordBank,
    highlightedWord,
  };
};
export default useHighlightWordToWordBank;
