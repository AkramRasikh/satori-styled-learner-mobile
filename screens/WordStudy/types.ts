import {WordType} from '../../types/core-types';

interface WordContextData {
  id: string;
  baseLang: string;
  fullTitle: string;
  hasAudio: string;
  isMediaContent: boolean;
  notes?: string;
  tags?: string[];
  targetLang: string;
  title: string;
}

export interface FlashCardWordType {
  id: WordType['id'];
  baseForm: WordType['baseForm'];
  contexts: WordType['contexts'];
  definition: WordType['definition'];
  isCardDue: boolean;
  surfaceForm: WordType['surfaceForm'];
  thisWordsCategories: string[];
  transliteration: WordType['transliteration'];
  phonetic?: WordType['phonetic'];
  contextData: WordContextData;
}
