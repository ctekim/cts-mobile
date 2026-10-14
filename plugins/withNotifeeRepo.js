const { withProjectBuildGradle } = require('expo/config-plugins');

const withNotifeeRepo = (config) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      const repoLine =
        'maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }';
      if (!config.modResults.contents.includes(repoLine)) {
        config.modResults.contents = config.modResults.contents.replace(
          /(allprojects\s*\{\s*repositories\s*\{)/,
          `$1\n    ${repoLine}`
        );
      }
    }
    return config;
  });
};

module.exports = withNotifeeRepo;