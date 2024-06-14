export const mergeAndRemoveDuplicates = (array1, array2) => {
  const map = new Map();

  [...array1, ...array2].forEach(item => {
    // If the item already exists in the map and the existing item's save property is false,
    // replace it with the new item if the new item's save property is true
    if (map.has(item.id)) {
      const existingItem = map.get(item.id);
      if (!existingItem.save && item.save) {
        map.set(item.id, item);
      }
    } else {
      map.set(item.id, item);
    }
  });

  return Array.from(map.values());
};
