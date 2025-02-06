import {createContext, PropsWithChildren} from 'react';

export const FlashCardContext = createContext(null);

export const FlashCardProvider = ({children}: PropsWithChildren<{}>) => {
  return <FlashCardContext.Provider>{children}</FlashCardContext.Provider>;
};
