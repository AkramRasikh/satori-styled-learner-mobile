import {useEffect} from 'react';
import {Animated} from 'react-native';

const useAnimation = ({fadeAnim, scaleAnim}) => {
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const collapseAnimation = async () => {
    return new Promise(resolve => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 0.8,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start(() => resolve());
    });
  };

  return {
    collapseAnimation,
  };
};

export default useAnimation;
