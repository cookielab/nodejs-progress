# Progress

## Overview
This package allows you to track progress, running time, operations per second, calculate ETA and consumed memory. It can measure rate of operations in time or percents done and remaining if number of operations to be performed is known.

## Installation
```sh
$ npm install --save @cookielab.io/configuration
```
or
```sh
$ yarn add @cookielab.io/progress
```

## Usage
To track progess, `.tick()` function is used. It takes number of operations performed as parameter. Default value is 1.

You have to specify how do you want to log progress. There are 2 options available: 
  * on `.tick()` change via `.enableOnTickLogging()` function
  * specified time interval via `.enableIntervalLogging()` function

### Tracking percents
```typescript
import {ProgressLogger} from '@cookielab.io/progress';

const forceUsers: string[] = ['Darth Vader', 'Luke Skywalker', 'Obi-Wan Kenobi', 'Yoda', 'Qui-Gon Jin', 'Mace Windu'];

const logger = new ProgressLogger(forceUsers.length); // to enable tracking of percents, we have to set total amount performed actions

logger.enableOnTickLogging((message: string): void => console.log(message)); // enable logging of progress when tick changes and set logging function
logger.start(); // starts measuring

forceUsers.forEach((user: string): void => {
	// do something 
	logger.tick(); // mark operation for this element as ended and log status
})

logger.end(); // stops measuring
```

### Tracking rate
```typescript
import {ProgressLogger} from '@cookielab.io/progress';

const forceUsers: string[] = ['Darth Vader', 'Luke Skywalker', 'Obi-Wan Kenobi', 'Yoda', 'Qui-Gon Jin', 'Mace Windu'];

const logger = new ProgressLogger();

logger.enableIntervalLogging(500, (message: string): void => console.log(message)); // enable logging of progress every 500 ms and set logging function
logger.start(); // starts measuring

forceUsers.forEach((user: string): void => {
	// do something

	logger.tick(number); // save number of operations performed
})

logger.end(); // stops measuring
```

## API
### `new ProgressLogger(total?: number)`
Used to initialize logger. If total is supplied, class measures percents, remaining percents and ETA.
If total is not supplied, class measures rate of operations per ms.

#### `.start(): void`
Used to initialize logger measuring.
It is already started in the constructor.
This can be useful for restarts or to keep the time precise as much as possible when doing more preparations before the process starts.

#### `.stop(): void`
Used to stop logger measuring and logging.

#### `tick(count: number = 1): void`
Used to track progress change. You can specify number of operations performed. If not, 1 is used.

#### `.enableOnTickLogging(logFunction: (message: string) => void): void`
Used to enable logging when `.tick()` method is called.
Parameter `logFunction` specifies the function that is called each time a `tick` method is called.

#### `.enableIntervalLogging(interval: number, logFunction: (message: string) => void): void`
Used to enable logging in specified interval in ms.
Parameter `interval` specifies the interval in which the `logFunction` should be called.
Parameter `logFunction` specifies the function that is called every specified interval.

#### `disableLogging(): void`
Used to disable logging.
It stops at the end of measuring by default. This can be used explicitly at any time.
