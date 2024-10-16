import {useEffect, useState} from 'react';
// import {AppState} from 'react-native';
import RNFS from 'react-native-fs';

const useMP3File = initFileName => {
  const [filePath, setFilePath] = useState(null);

  const downloadFile = async (url, fileName) => {
    const path = `${RNFS.TemporaryDirectoryPath}${fileName}`;
    const download = RNFS.downloadFile({
      fromUrl: url,
      toFile: path,
    });

    try {
      const result = await download.promise;
      if (result.statusCode === 200) {
        return path;
      } else {
        console.log('## Failed to download file:', result.statusCode);
        return null;
      }
    } catch (error) {
      console.error('## Download error:', error);
      return null;
    }
  };

  const checkFileExists = async fileName => {
    const path = `${RNFS.TemporaryDirectoryPath}${fileName}`;
    try {
      const exists = await RNFS.exists(path);
      return exists ? path : null;
    } catch (error) {
      console.error('## Error checking file existence:', error);
      return null;
    }
  };

  const initLoad = async initFileName => {
    const path = `${RNFS.TemporaryDirectoryPath}${initFileName}`;
    try {
      const exists = await RNFS.exists(path);
      return exists ? setFilePath(path) : null;
    } catch (error) {
      console.error('## Error checking file existence:', error);
      return null;
    }
  };

  const loadFile = async (thisFileName, url) => {
    let path = await checkFileExists(thisFileName);
    if (!path) {
      path = await downloadFile(url, thisFileName);
    }
    setFilePath(path);
  };

  useEffect(() => {
    if (initFileName) {
      initLoad(initFileName); // Load file when app comes to foreground
    }
  }, []);

  return {loadFile, filePath};
};

export default useMP3File;
