
module.exports = (config) => {
config.set({
    plugins: [
        'karma-vite',
        'karma-jasmine',
        '@chiragrupani/karma-chromium-edge-launcher',
        'karma-spec-reporter'
    ],
    frameworks: ['vite', 'jasmine'],
    files: [
    {
        pattern: 'test/**/*.spec.js',
        type: 'module',
        watched: false,
        served: false,
    },
    ],
    browsers: ['EdgeHeadless'],
    reporters: ['spec'],
    singleRun: true,
    vite: {
        autoInit: true,
        config: {
        
            }
        }
    });
};