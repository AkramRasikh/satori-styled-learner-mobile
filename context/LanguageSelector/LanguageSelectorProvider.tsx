import React from 'react';
import {createContext, PropsWithChildren, useState} from 'react';
export const LanguageSelectorContext = createContext(null);

export enum LanguageEnum {
  Chinese = 'chinese',
  Japanese = 'japanese',
  Arabic = 'arabic',
}

export const characterBasedLanguages = [
  LanguageEnum.Chinese,
  LanguageEnum.Japanese,
];

export const LanguageSelectorProvider = ({children}: PropsWithChildren<{}>) => {
  const [languageSelectedState, setLanguageSelectedState] =
    useState<LanguageEnum>();

  return (
    <LanguageSelectorContext.Provider
      value={{
        languageSelectedState,
        setLanguageSelectedState,
        languagesAvailable: [
          LanguageEnum.Chinese,
          LanguageEnum.Japanese,
          LanguageEnum.Arabic,
        ],
      }}>
      {children}
    </LanguageSelectorContext.Provider>
  );
};
