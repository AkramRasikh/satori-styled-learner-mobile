import {Text, TouchableOpacity, View} from 'react-native';
import useLoadAudioInstance from '../hooks/useLoadAudioInstance';
import {useEffect, useRef, useState} from 'react';
import {getFirebaseAudioURL} from '../hooks/useGetCombinedAudioData';
import useSoundHook from '../hooks/useSoundHook';
import ProgressBarComponent from './Progress';
import {isSameDay} from '../utils/check-same-date';

const SoundWidget = ({soundRef, url, topicName}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  // const [currentTimeState, setCurrentTimeState] = useState(0);

  // console.log('## soundRef', soundRef.current.isLoaded());

  // useEffect(() => {
  //   const getCurrentTimeFunc = () => {
  //     soundRef.current.getCurrentTime(currentTime => {
  //       setCurrentTimeState(currentTime);
  //     });
  //   };
  //   const interval = setInterval(() => {
  //     if (soundRef.current && soundRef.current?.isPlaying() && isPlaying) {
  //       getCurrentTimeFunc();
  //     }
  //   }, 100);

  //   return () => clearInterval(interval);
  // }, [soundRef, isPlaying]);

  // const {playSound, pauseSound} = useSoundHook({
  //   url,
  //   soundRef,
  //   isPlaying,
  //   setIsPlaying,
  //   topicName,
  //   isSnippet: true,
  // });
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
      {/* <ProgressBarComponent
        progress={10}
        time={(1).toFixed(2)}
        endTime={soundRef.current.duration}
      /> */}
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
  // const DifficultSentenceWidget = ({sentence, getDaysLater}) => {
  // const [loadURL, setLoadURL] = useState(false);
  const id = sentence.id;
  const topic = sentence.topic;
  const isCore = sentence?.isCore;
  const baseLang = sentence.baseLang;
  const targetLang = sentence.targetLang;
  const nextReview = sentence?.nextReview;

  // const soundRef = useRef();
  // const url = getFirebaseAudioURL(id);

  // const {triggerLoadURL, soundState} = useLoadAudioInstance({soundRef, url});

  // const loadURLfunc = () => {
  //   if (!soundState) {
  //     triggerLoadURL();
  //   }
  // };

  // useEffect(() => {
  //   if (soundState) {
  //     setLoadURL(true);
  //     soundRef.current = soundState;
  //   }
  // }, [soundState, soundRef, loadURL]);

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
    </View>
  );
};

export default DifficultSentenceWidget;
