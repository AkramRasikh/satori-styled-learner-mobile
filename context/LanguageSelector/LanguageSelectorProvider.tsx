import React from 'react';
import {createContext, PropsWithChildren, useState} from 'react';
export const LanguageSelectorContext = createContext(null);

export enum LanguageEnum {
  Chinese = 'chinese',
  Japanese = 'japanese',
}

export const LanguageSelectorProvider = ({children}: PropsWithChildren<{}>) => {
  const [languageSelectedState, setLanguageSelectedState] =
    useState<LanguageEnum>();

  return (
    <LanguageSelectorContext.Provider
      value={{
        languageSelectedState,
        setLanguageSelectedState,
        languagesAvailable: [LanguageEnum.Chinese, LanguageEnum.Japanese],
      }}>
      {children}
    </LanguageSelectorContext.Provider>
  );
};
