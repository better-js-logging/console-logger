/* global require */
var LoggingEnhancer = require('../bower_components/better-logging-base/dist/logging-enhancer.min').LoggingEnhancer;

(function(logEnhancer, sprintf, moment) {
    'use strict';

    var datetimePattern = 'LLL'; // default datetime stamp pattern, overwrite in config phase
    var datetimeLocale = window.navigator.userLanguage || window.navigator.language || 'en';
    var prefixPattern = '%s::[%s]> '; // default prefix pattern, overwrite in config phase

    var init = false;

    console.getLogger = function(context) {
        var logger = {
            trace: logEnhancer.enhanceLogging(bind(console.debug), logEnhancer.LEVEL.TRACE, context, logEnhancer, datetimePattern, datetimeLocale, prefixPattern),
            debug: logEnhancer.enhanceLogging(bind(console.debug), logEnhancer.LEVEL.DEBUG, context, logEnhancer, datetimePattern, datetimeLocale, prefixPattern),
            log: logEnhancer.enhanceLogging(bind(console.log), logEnhancer.LEVEL.INFO, context, logEnhancer, datetimePattern, datetimeLocale, prefixPattern),
            info: logEnhancer.enhanceLogging(bind(console.info), logEnhancer.LEVEL.INFO, context, logEnhancer, datetimePattern, datetimeLocale, prefixPattern),
            warn: logEnhancer.enhanceLogging(bind(console.warn), logEnhancer.LEVEL.WARN, context, logEnhancer, datetimePattern, datetimeLocale, prefixPattern),
            error: logEnhancer.enhanceLogging(bind(console.error), logEnhancer.LEVEL.ERROR, context, logEnhancer, datetimePattern, datetimeLocale, prefixPattern)
        };

        // init has to come afterwards, else the console logging functions would have been replaced already and we'd get double timestamps
        if (!init) {
            doInit();
        }

        return logger;
    };

    function doInit() {
        if (!sprintf) {
            console.warn('[console-logger] sprintf.js not found: https://github.com/alexei/sprintf.js, using fixed layout pattern "%s::[%s]> "');
        }
        if (!moment) {
            console.warn('[console-logger] moment.js not found: http://momentjs.com, using non-localized simple Date format');
        }

        // override global logging functions to add at least a timestamp
        console.trace = logEnhancer.enhanceLogging(bind(console.debug), logEnhancer.LEVEL.TRACE, 'global', logEnhancer, datetimePattern, datetimeLocale, prefixPattern);
        console.debug = logEnhancer.enhanceLogging(bind(console.debug), logEnhancer.LEVEL.DEBUG, 'global', logEnhancer, datetimePattern, datetimeLocale, prefixPattern);
        console.log = logEnhancer.enhanceLogging(bind(console.log), logEnhancer.LEVEL.INFO, 'global', logEnhancer, datetimePattern, datetimeLocale, prefixPattern);
        console.info = logEnhancer.enhanceLogging(bind(console.info), logEnhancer.LEVEL.INFO, 'global', logEnhancer, datetimePattern, datetimeLocale, prefixPattern);
        console.warn = logEnhancer.enhanceLogging(bind(console.warn), logEnhancer.LEVEL.WARN, 'global', logEnhancer, datetimePattern, datetimeLocale, prefixPattern);
        console.error = logEnhancer.enhanceLogging(bind(console.error), logEnhancer.LEVEL.ERROR, 'global', logEnhancer, datetimePattern, datetimeLocale, prefixPattern);

        init = true;

        var logger = logEnhancer.enhanceLogging(bind(console.info), logEnhancer.LEVEL.INFO, 'console-logger', logEnhancer, datetimePattern, datetimeLocale, prefixPattern);
        logger('logging enhancer initiated');
    }

    function bind(func) {
        return function() {
            func.apply(console, arguments);
        };
    }

}(new LoggingEnhancer(window.sprintf, window.moment), window.sprintf, window.moment));