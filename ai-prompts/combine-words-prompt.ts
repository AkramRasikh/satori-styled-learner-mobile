// const words = [
//   {id: 1, word: '宇宙人', definition: 'Alien'},
//   {id: 2, word: '自転車', definition: 'Bicycle'},
//   {
//     id: 3,
//     word: '目覚まし時計',
//     definition: 'Alarm clock',
//   },
// ];

// const targetLanguage = 'Japanese';

export const combineWordsPrompt = ({words, targetLanguage}) => `
Generate quirky but coherent sentences using the following words. The sentences do not need to be related to each other, but it’s great if they are. Provide the response as a JSON object with a \`sentences\` array. Each sentence should contain:
  1. \`baseLang\`: The English sentence.
  2. \`targetLang\`: The translated sentence in ${targetLanguage}.
  3. \`matchedWordsSurface\`: An array of the words (in their original script) that appear in the sentence.
  4. \`matchedWordsId\`: An array of the corresponding word IDs that were used in the sentence.

### Words List:
${words
  .map(
    w =>
      `- { "id": ${w.id}, "word": "${w.word}", "definition": "${w.definition}" }`,
  )
  .join('\n')}

Ensure the sentences are quirky and memorable to reinforce vocabulary.
Return only the JSON object, no additional text.
`;
