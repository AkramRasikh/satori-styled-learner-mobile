import {Linking, Alert} from 'react-native';

const useOpenGoogleTranslate = () => {
  const openGoogleTranslateApp = targetLangTxtToTranslate => {
    if (!targetLangTxtToTranslate) {
      return;
    }

    const sourceLang = 'ja';
    const targetLanguage = 'en'; // english (target language)
    const googleTranslateUrl = `googletranslate://?sl=${sourceLang}&tl=${targetLanguage}&text=${targetLangTxtToTranslate}`;
    const appStoreUrl = 'https://apps.apple.com/app/id414706506'; // Google Translate app store link

    Linking.canOpenURL(googleTranslateUrl)
      .then(supported => {
        if (supported) {
          Linking.openURL(googleTranslateUrl);
        } else {
          Alert.alert(
            'Google Translate Not Installed',
            'Google Translate app is not installed. Do you want to install it?',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Install', onPress: () => Linking.openURL(appStoreUrl)},
            ],
          );
        }
      })
      .catch(err => console.error('An error occurred', err));
  };

  return {openGoogleTranslateApp};
};

export default useOpenGoogleTranslate;