module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
    ],
    files: ['src/**/*.spec.js'],
    browsers: ['ChromeHeadless'],
    reporters: ['progress'],
    singleRun: false,
  });
};