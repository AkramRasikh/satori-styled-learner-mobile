const mapSentenceIdsToSeconds = ({contentArr, duration}) => {
  if (!contentArr || !duration) {
    return null;
  }
  const arrOfSecondsMappedIds: string[] = [];
  contentArr.forEach((item, index) => {
    const isFirst = index === 0;
    const isLast = index + 1 === contentArr.length;

    const startAt = isFirst ? 0 : item.startAt;
    const endAt = isLast ? duration : item.endAt - 1;
    const secondsArr = Array.from({length: endAt - startAt + 1}, (_, i) => {
      arrOfSecondsMappedIds.push(item.id);
      return startAt + i;
    });
    return {
      secondsArr,
      id: item.id,
    };
  });

  return arrOfSecondsMappedIds;
};

export default mapSentenceIdsToSeconds;
