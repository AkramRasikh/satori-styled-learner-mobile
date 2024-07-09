import React from 'react';

export const filterElementsById = (elements, targetId) => {
  const filteredElements = React.Children.toArray(elements).filter(
    element => React.isValidElement(element) && element.props.id === targetId,
  );
  // Map filtered elements to strings
  const elementTexts = filteredElements.map(element => element.props.children);

  // Join strings with ', '
  return elementTexts.join(', ');
};
