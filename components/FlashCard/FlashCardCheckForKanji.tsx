import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {getHexCode} from '../../utils/get-hex-code';

const FlashCardCheckForKanji = ({
  uniqueSetOfKanj,
  kanji,
  kanjiDataState,
  setKanjiDataState,
  baseForm,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetKanjiArray = async () => {
    if (!uniqueSetOfKanj.length || kanjiDataState) {
      setError('Please enter at least one kanji character.');
      return;
    }

    setError(null);
    setLoading(true);
    setKanjiDataState(null);

    try {
      // Fetch all kanji data in parallel
      const results = await Promise.all(
        uniqueSetOfKanj.map(async k => {
          const res = await fetch(`https://kanjiapi.dev/v1/kanji/${k}`);
          if (!res.ok) throw new Error(`Kanji ${k} not found`);
          const json = await res.json();
          return {[k]: json};
        }),
      );

      // Merge array of objects into one object
      const combined = results.reduce((acc, curr) => ({...acc, ...curr}), {});

      // Example: { "日": {...}, "本": {...}, "語": {...} }
      setKanjiDataState(combined);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!kanjiDataState) {
      handleGetKanjiArray();
    }
  }, []);

  const kanjiColorCode = Object.assign(
    {},
    ...kanji.map((kanjiItem, index) => ({
      [kanjiItem]: getHexCode(index),
    })),
  );

  const splitBaseForm = baseForm.split('').map((baseFormItem, index) => {
    const isKanjiColorCoded = kanjiColorCode[baseFormItem];
    return (
      <Text key={index} style={{color: isKanjiColorCoded}}>
        {baseFormItem}
      </Text>
    );
  });

  return (
    <View style={{alignItems: 'center', gap: 4}}>
      <Text style={{textAlign: 'center', fontSize: 20, fontWeight: '500'}}>
        {splitBaseForm}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 8,
        }}>
        {kanji?.map((kanjiItem, index) => {
          const correspondingEnglishMeaning =
            kanjiDataState?.[kanjiItem]?.meanings;
          const meanings = correspondingEnglishMeaning?.join(', ');
          const color = getHexCode(index);

          console.log('## kanjiItem', kanjiItem);
          console.log('## meanings', meanings);
          console.log('## splitBaseForm', splitBaseForm);

          return (
            <View
              key={index}
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 8,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowOffset: {width: 0, height: 1},
                shadowRadius: 2,
                elevation: 2,
                gap: 4,
                borderWidth: 2,
                borderColor: color,
                margin: 4,
              }}>
              {kanjiItem && (
                <Text style={{color, fontWeight: 'bold', fontSize: 20}}>
                  {kanjiItem}
                </Text>
              )}

              {correspondingEnglishMeaning && (
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 12,
                    color: '#4B5563',
                    maxWidth: 120,
                  }}>
                  {meanings}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default FlashCardCheckForKanji;
