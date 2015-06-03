/* global describe, beforeEach, expect, it, fail*/

var gutil = require('gulp-util');

var moment = require('../bower_components/momentjs/moment.js');
var sprintf = require('../bower_components/sprintf/dist/sprintf.min.js').sprintf;
var ConsoleLogger = require('../src/console-logger.js').ConsoleLogger;

describe('console-logger', function() {

    var logger = null;

    beforeEach(function resetCounters() {
        logger = new ConsoleLogger(sprintf, moment);
    });
    
    it("should enhance the console with current configuration", function() {
        logger.datetimePattern = 'YYYY';
        expectGlobalLog('debug', ['Hello World!'], [moment().year() + '::[global]> ', 'Hello World!']);
        logger.prefixPattern = ':%2$s:';
        expectGlobalLog('debug', ['Hello World!'], [':global:', 'Hello World!']);
        expectGlobalLog('debug', ['Hello World!', 5, { 'this': 'a test'}], [':global:', 'Hello World!', 5, { 'this': 'a test'}]);
        expectGlobalLog('debug', ['Hello %s! %s', 'World', 'yeah!', 5], [':global:', 'Hello World! yeah!', 5]);
    });
    
    function expectGlobalLog(func, input, output) {
        var c = fakeConsole(func);
        logger.enhanceLogging(c);
        expect(c[func].apply(null, input)).toEqual(output);
    }
    
    it("should provide contextual loggers", function() {
        var enhancedConsole = fakeConsole('warn');
        logger.enhanceLogging(enhancedConsole);
        
        logger.prefixPattern = ':%2$s:';
        var localA = enhancedConsole.getLogger('A');
        
        logger.prefixPattern = '>%2$s<';
        var localB = enhancedConsole.getLogger('B');
        
        expect(localA.warn('Test [%s]', 'A')).toEqual([':A:', 'Test [A]']);
        expect(localB.warn('Test [%s]', 'B')).toEqual(['>B<', 'Test [B]']);
    });
    
    function fakeConsole(func) {
        var c = {
            debug: function() {fail('unexpected logging function "debug" invoked');},
            log: function() {fail('unexpected logging function "log" invoked');},
            info: function() {/*don't fail, is used to display inited info*/},
            warn: function() {fail('unexpected logging function "warn" invoked');},
            error: function() {fail('unexpected logging function "error" invoked');}
        };
        c[func] = function() {
            // no fail
        };
        return c;
    }
    
    /*
    console.info('test 1');
    ConsoleLogger.enhanceLogging(console);
    console.info('test 2');
    console.getLogger('local context').info('test 3');
    */
});