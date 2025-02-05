export const sortObjByKeys = reducedObj => {
  const keys = Object.keys(reducedObj);
  keys.sort();

  const sortedObj = {};
  keys.forEach(key => {
    sortedObj[key] = reducedObj[key];
  });
  return sortedObj;
};
