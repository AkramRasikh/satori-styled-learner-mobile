import React, {Dimensions, View} from 'react-native';
import AnimationContainer from '../AnimationContainer';
import {Card, MD2Colors} from 'react-native-paper';

const FlashCardBodyContainer = ({
  fadeAnim,
  scaleAnim,
  isCardDue,
  isSelectedWord,
  cardReviewButNotDue,
  targetRef,
  children,
}) => {
  const {width} = Dimensions.get('window');

  return (
    <AnimationContainer fadeAnim={fadeAnim} scaleAnim={scaleAnim}>
      <View ref={targetRef}>
        <Card
          style={{
            padding: 5,
            width: isSelectedWord ? width * 0.9 : 'auto',
            backgroundColor: cardReviewButNotDue
              ? MD2Colors.blue100
              : isCardDue && MD2Colors.red100,
          }}>
          {children}
        </Card>
      </View>
    </AnimationContainer>
  );
};

export default FlashCardBodyContainer;
