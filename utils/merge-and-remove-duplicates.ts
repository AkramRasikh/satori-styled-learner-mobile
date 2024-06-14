export const mergeAndRemoveDuplicates = (array1, array2) => {
  const map = new Map();

  [...array1, ...array2].forEach(item => {
    map.set(item.id, item);
  });

  return Array.from(map.values());
};
