// Karma configuration
// Generated on Wed Sep 18 2013 14:27:40 GMT-0700 (PDT)

module.exports = function(config) {
    config.set({

        // base path, that will be used to resolve files and exclude
        basePath: '',


        // frameworks to use
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'components/angular/angular.js',
            'components/angular-mocks/angular-mocks.js',
            'phonegap.js',
            'test/**/*.js'
        ],

        preprocessors:{
            "phonegap.js":["coverage"]
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters:["progress", "html", "junit", "coverage"],

        coverageReporter:{
            type: 'html',
            dir: 'reports/'
        },

        junitReporter:{
            outputFile: 'reports/test-results.xml'
        },

        htmlReporter: {
            outputDir: 'reports/test/'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS', 'Chrome'],


        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,


        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true
    });
};