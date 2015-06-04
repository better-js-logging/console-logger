[![MIT License][license-image]][license-url] [![Build Status][travis-image]][travis-url] [![Code Climate][codeclimate-gpa-image]][codeclimate-url] [![Codacy Badge][codacy-shields-image]][codacy-url] [![Coverage Status][coveralls-image]][coveralls-url]

#console-logger

```javascript
console.info('Hello Legacy %s!', 'world', { 'extra': ['pass-through params'] }); 
// Hello Legacy %s! world >Object { "extra": "pass-through params" }

// enhance logging
consoleLogger.prefixPattern = '%s::[%s]>';
consoleLogger.datetimePattern = 'LLL';
consoleLogger.logLevels = {
    '*': consoleLogger.LEVEL.INFO,
    'main': consoleLogger.LEVEL.WARN,
    'main.subB': consoleLogger.LEVEL.TRACE
};

console.info('Hello %s!', 'World'); // 17-5-2015 11:53:51::[global]> Hello World!

console.getLogger('banana').debug('Hello brave new world!'); // ignored, logging set to INFO for '*'
console.getLogger('main.subA').info('Hello brave new world!'); // ignored, doesn't pass logging threshold of 'main'
console.getLogger('main.subB').info('Hello %s!', 'brave new world', { 'extra': ['pass-through params'] });
// 17-5-2015 11:53:51::[main.subB]> Hello World! >Object { "extra": "pass-through params" }
```

[live demo](https://jsfiddle.net/plantface/gmg8bgv2/)

---

* Enhances the standard console's logging functions so that you can define **separate contexts** to log for, where the output will be prepended with the context's name and a datetime stamp.
* Further enhances the logging functions so that you can **apply patterns** eliminatinging the need of manually concatenating your strings
* Introduces **log levels**, where you can manage logging output per context or even a group of contexts
* Works as a **complete drop-in** replacement for your current console logging statements

---

- [Installing](#installing)
		- [Bower](#bower)
		- [Manually](#manually)
- [Getting Started](#getting-started)
- [Applying Patterns](#applying-patterns)
		- [Prefix pattern](#prefix-pattern)
		- [Datetime stamp patterns](#datetime-stamp-patterns)
		- [Logging patterns](#logging-patterns)
- [Managing logging priority](#managing-logging-priority)

---

<a name='installing'/>
## Installing

console-logger has optional dependencies on _[momentjs](https://github.com/moment/moment)_ and _[sprintf.js](https://github.com/alexei/sprintf.js)_: without moment you can't pattern a nicely readable datetime stamp and without sprintf you can't pattern your logging input lines. Default fixed patterns are applied if either they are missing.

<a name='bower'/>
#### Bower

Will be implemented under [issue #1](https://github.com/better-js-logging/console-logger/issues/1)

<a name='manually'/>
#### Manually

Include _console-logger.js_, _[momentjs](https://github.com/moment/moment)_ and _[sprintf.js](https://github.com/alexei/sprintf.js)_ in your web app.

<a name='getting-started'/>
## Getting Started

After installing, console-logger should have registered a global `consoleLogger` on the _Window_ object. 

> If available, it will be exported as constructor on module.exports or exports. However, outside of unit testing this in nodejs itself, this has not been tested to work properly. Register an issue if you run into trouble.

   [working demo](TODO)

<a name='applying-patterns'/>
## Applying Patterns
<a name='prefix-pattern'/>
#### Prefix pattern

By default, the prefix is formatted like so:

`datetime here::[context's name here]>your logging input here`

However, you can change this as follows:

```javascript
consoleLogger.prefixPattern = '%s - %s: ';
consoleLogger.getLogger('app').info('Hello World');
// was:    Sunday 12:55:07 am::[app]>Hello World
// became: Sunday 12:55:07 am - app: Hello World
```

You can also remove it completely, or have just the datetime stamp or just the context prefixed:

```javascript
// by the power of sprintf!
consoleLogger.prefixPattern = '%s - %s: '; // both
consoleLogger.prefixPattern = '%s: '; // timestamp
consoleLogger.prefixPattern = '%1$s: '; // timestamp by index
consoleLogger.prefixPattern = '%2$s: '; // context by index
consoleLogger.prefixPattern = '%2$s - %1$s: '; // both, reversed
```

This works, because console-logger will use two arguments for the prefix, which can be referenced by index.

<a name='datetime-stamp-patterns'/>
#### Datetime stamp patterns

If you have included _moment.js_ in your webapp, you can start using datetime stamp patterns with console-logger. The default pattern is `dddd h:mm:ss a`, which translates to _Sunday 12:55:07 am_. You customize the pattern as follows:

```javascript
consoleLogger.datetimePattern = 'dddd';
consoleLogger.getLogger()('app').info('Hello World');
// was:    Sunday 12:55:07 am::[app]>Hello World
// became: Sunday::[app]>Hello World
```

This way you can switch to a 24h format this way as well, for example, or use your locale-specific format.

 * For all options, see [moment.js](http://momentjs.com/docs/#/displaying/)

<a name='logging-patterns'/>
#### Logging patterns

If you have included _sprintf.js_ in your webapp, you can start using patterns with _console-logger_.

Traditional style with `console`:
```javascript
logger.error ("Error uploading document [" + filename + "], Error: '" + err.message + "'. Try again later.")
// Error uploading document [contract.pdf], Error: 'Service currently down'. Try again later. "{ ... }"
```

Modern style with console-logger enhanced `console.error`:
 ```javascript
var logger = consoleLogger.getLogger("myapp.file-upload");
logger.error("Error uploading document [%s], Error: '%s'. Try again later.", filename, err.message)
// Sunday 12:13:06 pm::[myapp.file-upload]> Error uploading document [contract.pdf], Error: 'Service currently down'. Try again later.
 ```

---

You can even **combine pattern input and normal input**:
 ```javascript
var logger = consoleLogger.getLogger('test');
logger.warn("This %s pattern %j", "is", "{ 'in': 'put' }", "but this is not!", ['this', 'is', ['handled'], 'by the browser'], { 'including': 'syntax highlighting', 'and': 'console interaction' });
// 17-5-2015 00:16:08::[test]>  This is pattern "{ 'in': 'put' }" but this is not! ["this", "is handled", "by the browser"] Object {including: "syntax highlighting", and: "console interaction"}
 ```
 
To **log an `Object`**, you now have three ways of doing it, but the combined solution shown above has best integration with the browser.
 ```javascript
logger.warn("Do it yourself: " + JSON.stringify(obj)); // json string with stringify's limitations
logger.warn("Let sprintf handle it: %j", obj); // json string with sprintf's limitations
logger.warn("Let the browser handle it: ", obj); // interactive tree in the browser with syntax highlighting
logger.warn("Or combine all!: %s, %j", JSON.stringify(obj), obj, obj);
 ```

 * For all options, see [sprintf.js](https://github.com/alexei/sprintf.js)

[working demo](TODO)

<a name='managing-logging-priority'/>
## Managing logging priority

Using logging levels, we can manage output on several levels. Contexts can be named using dot '.' notation, where the names before dots are intepreted as groups or packages.

For example for `'a.b'` and `a.c` we can define a general log level for `a` and have a different log level for only 'a.c'.

The following logging functions (left side) are available:

logging function  | mapped to: | with logLevel
----------------- | --------------- | --------------
_`logger.trace`_  | _`console.debug`_       | `TRACE`
_`logger.debug`_  | _`console.debug`_       | `DEBUG`
_`logger.log*`_   | _`console.log`_        | `INFO`
_`logger.info`_   | _`console.info`_        | `INFO`
_`logger.warn`_   | _`console.warn`_        | `WARN`
_`logger.error`_  | _`console.error`_       | `ERROR`
`*` maintained for backwards compatibility with `console.log`

The level's order are as follows:
```
  1. TRACE: displays all levels, is the finest output and only recommended during debugging
  2. DEBUG: display all but the finest logs, only recommended during develop stages
  3. INFO :  Show info, warn and error messages
  4. WARN :  Show warn and error messages
  5. ERROR: Show only error messages.
  6. OFF  : Disable all logging, recommended for silencing noisy logging during debugging. *will* surpress errors logging.
```
Example:

```javascript
consoleLogger.prefixPattern = '%s::[%s]> ';
consoleLogger.logLevels = {
	'a.b.c': consoleLogger.LEVEL.TRACE, // trace + debug + info + warn + error
	'a.b.d': consoleLogger.LEVEL.ERROR, // error
	'a.b': consoleLogger.LEVEL.DEBUG, // debug + info + warn + error
	'a': consoleLogger.LEVEL.WARN, // warn + error
	'*': consoleLogger.LEVEL.INFO // info + warn + error
};
// globally only INFO and more important are logged
// for group 'a' default is WARN and ERROR
// a.b.c and a.b.d override logging everything-with-TRACE and least-with-ERROR respectively

// modify log levels later
consoleLogger.logLevels['a.b.c'] = $log.LEVEL.ERROR;
consoleLogger.logLevels['*'] = $log.LEVEL.OFF;
```

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[travis-url]: http://travis-ci.org/better-js-logging/console-logger
[travis-image]: https://img.shields.io/travis/better-js-logging/console-logger.svg?style=flat

[coveralls-url]: https://coveralls.io/r/better-js-logging/console-logger?branch=master
[coveralls-image]: https://coveralls.io/repos/better-js-logging/console-logger/badge.svg?branch=master

[codeclimate-url]: https://codeclimate.com/github/better-js-logging/console-logger
[codeclimate-gpa-image]: https://codeclimate.com/github/better-js-logging/console-logger/badges/gpa.svg

[codacy-url]: https://www.codacy.com/app/b-bottema/console-logger/dashboard
[codacy-image]: https://www.codacy.com/project/badge/fc9f04daa6cd4005bbe02683c3d0b558
[codacy-shields-image]: https://img.shields.io/codacy/fc9f04daa6cd4005bbe02683c3d0b558.svg?style=flat
