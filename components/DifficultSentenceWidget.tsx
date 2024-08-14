import {Text, TouchableOpacity, View} from 'react-native';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import {useRef, useState} from 'react';
import {getFirebaseAudioURL} from '../hooks/useGetCombinedAudioData';
import useSoundHook from '../hooks/useSoundHook';
import {isSameDay} from '../utils/check-same-date';

const SoundWidget = ({soundRef, url, topicName}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const {playSound, pauseSound} = useSoundHook({
    url,
    soundRef,
    isPlaying,
    setIsPlaying,
    topicName,
  });

  return (
    <View
      style={{
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            backgroundColor: isPlaying ? 'green' : 'red',
            padding: 5,
            borderRadius: 5,
          }}>
          {isPlaying ? (
            <TouchableOpacity onPress={pauseSound}>
              <Text>⏸️ Pause</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={playSound}>
              <Text>▶️ Play</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const Content = ({
  topic,
  isCore,
  targetLang,
  baseLang,
  nextReview,
  todayDateObj,
}) => {
  const thisNextReviewObj = new Date(nextReview);

  const getAdjustedDifferenceInDays = (dateA, dateB) => {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // Hours * minutes * seconds * milliseconds
    const differenceInTime = dateB - dateA; // Difference in milliseconds
    const differenceInDays = Math.floor(
      differenceInTime / oneDayInMilliseconds,
    );

    // Check if the dates are on different calendar days
    const isDifferentCalendarDay =
      dateA.getDate() !== dateB.getDate() ||
      dateA.getMonth() !== dateB.getMonth() ||
      dateA.getFullYear() !== dateB.getFullYear();

    // If dates are on different calendar days, acknowledge it as a full day difference
    if (isDifferentCalendarDay) {
      return differenceInDays + 1;
    }

    return differenceInDays;
  };
  const calculateDueDate = () => {
    if (isSameDay(todayDateObj, thisNextReviewObj)) {
      return `Due today`;
    }

    const daysDifference = getAdjustedDifferenceInDays(
      todayDateObj,
      thisNextReviewObj,
    );

    if (daysDifference < 0) {
      return `Due ${Math.abs(daysDifference)} days ago`;
    }

    return `Due in ${daysDifference} days`;
  };

  const dueText = calculateDueDate();
  return (
    <>
      <Text
        style={{
          fontStyle: 'italic',
          textDecorationLine: 'underline',
        }}>
        {topic} {isCore ? '🧠' : ''}
      </Text>
      <View>
        <Text>{targetLang}</Text>
      </View>
      <View>
        <Text>{baseLang}</Text>
      </View>
      <View>
        <Text>{dueText}</Text>
      </View>
    </>
  );
};

const DifficultSentenceWidget = ({sentence, todayDateObj}) => {
  const id = sentence.id;
  const topic = sentence.topic;
  const isCore = sentence?.isCore;
  const baseLang = sentence.baseLang;
  const targetLang = sentence.targetLang;
  const nextReview = sentence?.nextReview;

  const soundRef = useRef();
  const url = getFirebaseAudioURL(id);

  const {triggerLoadURL, isLoaded} = useLoadAudioInstance({soundRef, url});

  return (
    <View
      key={id}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginBottom: 10,
      }}>
      <Content
        topic={topic}
        isCore={isCore}
        targetLang={targetLang}
        baseLang={baseLang}
        nextReview={nextReview}
        todayDateObj={todayDateObj}
      />
      {isLoaded ? (
        <SoundWidget soundRef={soundRef} url={url} topicName={topic} />
      ) : (
        <View>
          <TouchableOpacity onPress={triggerLoadURL}>
            <Text>Load URL</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DifficultSentenceWidget;
