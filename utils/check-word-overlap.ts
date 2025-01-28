export function checkOverlap(words) {
  // Sort the array by `indexStart` (and `indexEnd` for ties)
  words.sort((a, b) => a.indexStart - b.indexStart || a.indexEnd - b.indexEnd);

  // Array to store results
  const results = words.map(word => ({
    ...word,
    fullOverlap: false,
    nestedIn: null, // Will store the ID of the word it is nested within, if any
  }));
  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < words.length; j++) {
      if (i === j) continue; // Skip comparison with itself

      const currentWord = words[i];
      const otherWord = words[j];

      // Check if the current word is fully within another word's range
      if (
        currentWord.indexStart >= otherWord.indexStart && // Starts within the other word
        currentWord.indexEnd <= otherWord.indexEnd // Ends within the other word
      ) {
        if (
          currentWord.indexStart === otherWord.indexStart &&
          currentWord.indexEnd === otherWord.indexEnd
        ) {
          // Full overlap (exact match in range)
          results[i].fullOverlap = true;
        } else {
          // Nested word (not identical, but within range)
          results[i].nestedIn = otherWord.id;
        }
      }
    }
  }

  return results;
}
