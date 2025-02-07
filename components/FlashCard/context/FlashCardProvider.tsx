import React, {createContext, PropsWithChildren} from 'react';

export const FlashCardContext = createContext(null);

export const FlashCardProvider = ({
  selectedDueCardState,
  setSelectedDueCardState,
  children,
}: PropsWithChildren<{}>) => {
  return (
    <FlashCardContext.Provider
      value={{selectedDueCardState, setSelectedDueCardState}}>
      {children}
    </FlashCardContext.Provider>
  );
};
