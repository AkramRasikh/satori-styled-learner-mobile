import React, {View} from 'react-native';
import AddSentenceContainer from '../../components/AddSentenceContainer';
import HomeContainerToSentencesOrWords from '../../components/HomeContainerToSentencesOrWords';
import {FAB} from 'react-native-paper';
import ContentCreationContainer from '../../components/ContentCreationContainer';
import {useState} from 'react';

const AdhocExpressionsLegacy = ({navigation}) => {
  const [showAddSentenceState, setShowAddSentenceState] =
    useState<boolean>(false);
  const [addContentFormState, setAddContentFormState] =
    useState<boolean>(false);
  return (
    <>
      <HomeContainerToSentencesOrWords navigation={navigation} />
      {showAddSentenceState ? (
        <AddSentenceContainer
          setShowAddSentenceState={setShowAddSentenceState}
        />
      ) : (
        <View style={{padding: 10}}>
          <FAB
            label="Add sentence"
            size="small"
            onPress={() => setShowAddSentenceState(!showAddSentenceState)}
          />
        </View>
      )}
      {addContentFormState ? (
        <ContentCreationContainer
          setAddContentFormState={setAddContentFormState}
        />
      ) : (
        <View style={{padding: 10}}>
          <FAB
            label="Add Content"
            size="small"
            onPress={() => setAddContentFormState(!addContentFormState)}
          />
        </View>
      )}
    </>
  );
};

export default AdhocExpressionsLegacy;
