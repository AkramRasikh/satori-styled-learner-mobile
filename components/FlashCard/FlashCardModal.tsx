import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import useHighlightWordToWordBank from '../../hooks/useHighlightWordToWordBank';

import {DefaultTheme, IconButton, Text, TextInput} from 'react-native-paper';
import FlashCardAudio from '../FlashCard/FlashCardAudio';
import {SoundProvider} from '../WordSoundComponent/context/SoundProvider';
import useWordData from '../../context/WordData/useWordData';
import {DoubleClickButton} from '../Button';
import FlashCardCheckForKanji from './FlashCardCheckForKanji';

const ExampleSentences = ({sentenceExamples, baseForm, surfaceForm}) => {
  const {underlineWordsInSentence} = useHighlightWordToWordBank({
    pureWordsUnique: [baseForm, surfaceForm],
  });

  const getSafeText = targetText => {
    const textSegments = underlineWordsInSentence(targetText);
    return textSegments.map((segment, index) => {
      return (
        <Text key={index} id={segment.id} style={[segment.style]}>
          {segment.text}
        </Text>
      );
    });
  };

  return (
    <View>
      {sentenceExamples?.map((exampleSentence, index) => {
        if (!exampleSentence?.targetLang) {
          return null;
        }
        const exampleNumber = index + 1 + ') ';
        const baseLang = exampleSentence.baseLang;
        const targetLang = exampleSentence.targetLang;
        return (
          <View key={index}>
            <Text style={styles.modalContent}>
              {exampleNumber} {baseLang}
            </Text>
            <Text style={styles.modalContent}>{getSafeText(targetLang)}</Text>
            <SoundProvider sentenceData={exampleSentence}>
              <FlashCardAudio />
            </SoundProvider>
          </View>
        );
      })}
    </View>
  );
};

const FlashCardLineContainer = ({
  id,
  property,
  label,
  value,
  baseForm,
  updateWordData,
}) => {
  const [editModeState, setEditModeState] = useState(false);
  const [text, setText] = useState(value);

  const handleSubmit = async () => {
    await updateWordData({
      wordId: id,
      wordBaseForm: baseForm,
      fieldToUpdate: {
        [property]: text,
      },
    });
  };
  return (
    <View>
      <DoubleClickButton
        onPress={() => setEditModeState(true)}
        onLongPress={() => {}}>
        <Text style={styles.modalContent}>
          {label} {value}
        </Text>
      </DoubleClickButton>
      {editModeState && (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            padding: 20,
          }}>
          <TextInput value={text} onChangeText={setText} mode="outlined" />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 10,
            }}>
            <IconButton mode="contained" icon="send" onPress={handleSubmit} />
            <IconButton
              mode="contained"
              icon="close"
              onPress={() => {
                setEditModeState(false);
                setText(value);
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const kanjiRegex = /[\u4E00-\u9FFF\u3400-\u4DBF]/g;
function extractKanji(str: string): string[] {
  const matches = str.match(kanjiRegex);
  return matches ? matches : [];
}

export const FlashCardContent = ({
  id,
  baseForm,
  surfaceForm,
  definition,
  phonetic,
  transliteration,
  sentenceExamples,
  mnemonic,
  isJapanese,
}) => {
  const [kanjiDataState, setKanjiDataState] = useState<any>(null);
  const {updateWordData} = useWordData();

  const arr = [
    {label: 'Base Form:', value: baseForm, property: 'baseForm'},
    {label: 'Surface Form:', value: surfaceForm, property: 'surfaceForm'},
    {label: 'Definition:', value: definition, property: 'definition'},
    {label: 'Phonetic:', value: phonetic, property: 'phonetic'},
    {
      label: 'Transliteration:',
      value: transliteration,
      property: transliteration,
    },
    {
      label: 'Mnemonic:',
      value: mnemonic,
      property: 'mnemonic',
    },
  ];

  const hasKanji = isJapanese && extractKanji(baseForm);
  const uniqueSetOfKanj = [...new Set(hasKanji)];

  return (
    <View style={[styles.modalContainer]}>
      {sentenceExamples?.length > 0 && (
        <ExampleSentences
          sentenceExamples={sentenceExamples}
          baseForm={baseForm}
          surfaceForm={surfaceForm}
        />
      )}
      {arr.map((item, index) => {
        return (
          <FlashCardLineContainer
            id={id}
            key={index}
            label={item.label}
            value={item.value}
            property={item.property}
            baseForm={baseForm}
            updateWordData={updateWordData}
          />
        );
      })}
      {uniqueSetOfKanj?.length > 0 && (
        <FlashCardCheckForKanji
          kanjiDataState={kanjiDataState}
          setKanjiDataState={setKanjiDataState}
          uniqueSetOfKanj={uniqueSetOfKanj}
          kanji={hasKanji}
          baseForm={baseForm}
        />
      )}
    </View>
  );
};

const FlashCardModal = ({wordData, onClose, isJapanese}) => {
  const baseForm = wordData.baseForm;
  const surfaceForm = wordData.surfaceForm;
  const transliteration = wordData.transliteration;
  const definition = wordData.definition;
  const mnemonic = wordData?.mnemonic;
  const phonetic = wordData.phonetic || transliteration;
  const sentenceExamples = wordData?.contextData;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.background}
        onPress={onClose}
        activeOpacity={1}
      />
      <FlashCardContent
        id={wordData.id}
        baseForm={baseForm}
        surfaceForm={surfaceForm}
        definition={definition}
        phonetic={phonetic}
        transliteration={transliteration}
        sentenceExamples={sentenceExamples}
        isJapanese={isJapanese}
        mnemonic={mnemonic}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    padding: 10,
    borderRadius: 10,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
    width: '100%',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  modalContent: {
    ...DefaultTheme.fonts.bodyLarge,
    marginBottom: 10,
  },
  closeButton: {
    padding: 5,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    textAlign: 'right',
    color: '#fff',
    fontSize: 16,
  },
});

export default FlashCardModal;
