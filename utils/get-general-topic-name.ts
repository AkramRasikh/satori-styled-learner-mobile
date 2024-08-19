// food-01 -> food
export const getGeneralTopicName = topicName => {
  return topicName.split('-').slice(0, -1).join('-');
};
