const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

//SatoriNativeApp/node_modules/metro-file-map/src/watchers/NodeWatcher.js:82:12)

const config = {
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
