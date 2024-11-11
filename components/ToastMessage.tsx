import {Text, View} from 'react-native';

const ToastMessage = ({toastText}) => {
  return (
    <View
      style={{
        position: 'absolute',
        alignItems: 'center',
        alignSelf: 'center',
        zIndex: 10,
        top: 50,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 2,
        opacity: 0.5,
      }}>
      <Text>{toastText}</Text>
    </View>
  );
};

export default ToastMessage;
