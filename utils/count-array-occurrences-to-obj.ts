import {sortObjByKeys} from './sort-obj-by-keys';

export const countArrayOccurrencesToObj = arr =>
  sortObjByKeys(
    arr.reduce((acc, current) => {
      acc[current] = (acc[current] || 0) + 1;
      return acc;
    }, {}),
  );
