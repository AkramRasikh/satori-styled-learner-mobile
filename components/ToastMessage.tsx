import {Text, View} from 'react-native';

const ToastMessage = ({toastText}) => {
  return (
    <View
      style={{
        position: 'absolute',
        alignItems: 'center',
        alignSelf: 'center',
        zIndex: 10,
        top: 20,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 2,
      }}>
      <Text>{toastText}</Text>
    </View>
  );
};

export default ToastMessage;
