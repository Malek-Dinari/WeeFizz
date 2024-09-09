const path = require("path");
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
const { resolver: { sourceExts, assetExts } } = defaultConfig;

const config = {

  resolver: {
    assetExts: [...assetExts, 'tflite'],
    sourceExts: sourceExts,
  },
};

module.exports = mergeConfig(defaultConfig, config);
