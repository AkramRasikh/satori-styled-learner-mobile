import {StyleSheet, Text, View} from 'react-native';

const SnippetTimeline = ({snippetsLocalAndDb, duration}) => {
  return (
    <View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 10,
        }}>
        <Text style={{fontStyle: 'italic'}}>
          Snippet Timeline {snippetsLocalAndDb?.length} points
        </Text>
      </View>
      <View style={styles.outerContainer}>
        <View style={styles.lineContainer}>
          <View style={styles.line} />
          {snippetsLocalAndDb.map((checkpoint, index) => {
            const checkpointPosition =
              (checkpoint.pointInAudio / duration) * 100;
            const saved = checkpoint?.saved;

            return (
              <View
                key={index}
                style={[
                  styles.checkpointContainer,
                  {left: `${checkpointPosition}%`},
                ]}>
                <View
                  style={[
                    styles.checkpoint,
                    {backgroundColor: !saved ? 'gold' : 'white'},
                  ]}
                />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  lineContainer: {
    width: '100%',
    position: 'relative',
    height: 16,
  },
  line: {
    height: 4,
    backgroundColor: 'black',
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
  },
  checkpointContainer: {
    position: 'absolute',
    top: 0,
    transform: [{translateX: -8}],
  },
  checkpoint: {
    width: 16, // can be dynamically set
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'red',
    backgroundColor: 'white',
  },
});

export default SnippetTimeline;
