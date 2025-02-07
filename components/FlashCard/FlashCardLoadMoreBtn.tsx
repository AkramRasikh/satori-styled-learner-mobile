import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';

const FlashCardLoadMoreBtn = ({handleExpandWordArray}) => (
  <View
    style={{
      width: '100%',
      paddingBottom: 30,
      marginTop: 10,
    }}>
    <Button onPress={handleExpandWordArray} icon="refresh" mode="outlined">
      See More
    </Button>
  </View>
);

export default FlashCardLoadMoreBtn;
