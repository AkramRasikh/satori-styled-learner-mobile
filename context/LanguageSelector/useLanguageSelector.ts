import {useContext} from 'react';
import {LanguageSelectorContext} from './LanguageSelectorProvider';

const useLanguageSelector = () => {
  const context = useContext(LanguageSelectorContext);

  if (!context)
    throw new Error(
      'useLanguageSelector must be used within a LanguageSelectorProvider',
    );

  return context;
};

export default useLanguageSelector;
