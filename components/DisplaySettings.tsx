import {Text, View} from 'react-native';
import SwitchButton from './SwitchButton';

const DisplaySettings = ({
  setSeparateLines,
  seperateLines,
  wordTest,
  setWordTest,
  englishOnly,
  setEnglishOnly,
  highlightMode,
  setHighlightMode,
  setOpenTopicWords,
  openTopicWords,
  isFlowingSentences,
  setIsFlowingSentences,
  engMaster,
  setEngMaster,
  showWordStudyList,
  setShowWordStudyList,
}) => {
  return (
    <View
      style={{
        gap: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View>
        <Text
          style={{
            alignSelf: 'center',
          }}>
          Seperate
        </Text>
        <SwitchButton isOn={seperateLines} setIsOn={setSeparateLines} />
      </View>
      <View>
        <Text
          style={{
            alignSelf: 'center',
          }}>
          Word hint
        </Text>
        <SwitchButton isOn={wordTest} setIsOn={setWordTest} />
      </View>
      <View>
        <Text
          style={{
            alignSelf: 'center',
          }}>
          English
        </Text>
        <SwitchButton isOn={englishOnly} setIsOn={setEnglishOnly} />
      </View>
      <View>
        <Text
          style={{
            alignSelf: 'center',
          }}>
          English Master
        </Text>
        <SwitchButton isOn={engMaster} setIsOn={setEngMaster} />
      </View>
      <View>
        <Text
          style={{
            alignSelf: 'center',
          }}>
          Highlight
        </Text>
        <SwitchButton isOn={highlightMode} setIsOn={setHighlightMode} />
      </View>
      <View>
        <Text
          style={{
            alignSelf: 'center',
          }}>
          Word list
        </Text>
        <SwitchButton isOn={openTopicWords} setIsOn={setOpenTopicWords} />
      </View>
      <View>
        <Text
          style={{
            alignSelf: 'center',
          }}>
          Cards
        </Text>
        <SwitchButton isOn={showWordStudyList} setIsOn={setShowWordStudyList} />
      </View>
      <View>
        <Text
          style={{
            alignSelf: 'center',
          }}>
          {' '}
          {isFlowingSentences ? 'Flowing 🏄🏽' : '1 by 1 🧱'}
        </Text>
        <SwitchButton
          isOn={isFlowingSentences}
          setIsOn={setIsFlowingSentences}
        />
      </View>
    </View>
  );
};

export default DisplaySettings;
