// @flow

import * as messageFormatter from './messageFormatter';
import {ProgressTracker} from './progressTracker';
import type {Progress} from './progress';

type LogFunction = (string) => void;
type LogCallback = () => void;

class ProgressLogger implements Progress {
    tracker: ProgressTracker;
    intervalID: ?IntervalID;
    logCallback: ?LogCallback;

    constructor(total: number): void {
        this.tracker = new ProgressTracker(total);
        this.intervalID = null;
        this.logCallback = null;
    }

    start(): void {
        this.tracker.start();
    }

    stop(): void {
        this.tracker.stop();
        this.stopLogging();
    }

    tick(count: number = 1): void {
        this.tracker.tick(count);
        if (this.logCallback != null && this.intervalID == null) {
            this.logCallback();
        }
    }

    startIntervalLogging(logFunction: LogFunction, interval: number): void {
        this.logCallback = () => logFunction(this.message());
        this.intervalID = setInterval(this.logCallback, interval);
    }

    startOnTickLogging(logFunction: LogFunction): void {
        this.logCallback = () => logFunction(this.message());
        this.logCallback();
    }

    stopLogging(): void {
        if (this.intervalID != null) {
            clearInterval(this.intervalID);
        }
        if (this.logCallback != null) {
            this.logCallback();
        }
        this.intervalID = null;
        this.logCallback = null;
    }

    message(precision: number = 3): string {
        return messageFormatter.formatMessage(
            this.tracker.getPercentage(),
            this.tracker.getRunningTime(),
            this.tracker.getEtaTime(),
            precision
        );
    }
}

export {
    ProgressLogger,
};
