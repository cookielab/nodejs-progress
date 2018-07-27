// @flow

import type {Progress} from './progress';

class RateTracker implements Progress {
    current: number;
    startTime: number;
    endTime: ?number;

    constructor(): void {
        this.current = 0;
        this.start();
    }

    start(): void {
        this.startTime = Date.now();
        this.endTime = null;
    }

    stop(): void {
        this.endTime = Date.now();
    }

    tick(count: number = 1): void {
        this.current += count;
    }

    getCurrent(): number {
        return this.current;
    }

    getOperationsPerSecond(): number {
        const elapsedSeconds = (Date.now() - this.startTime) / 1000;
        return this.current / elapsedSeconds;
    }

    getRunningTime(): number {
        return this.endTime == null
            ? Date.now() - this.startTime
            : this.endTime - this.startTime;
    }
}

export default RateTracker;
