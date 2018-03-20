// @flow

import type {Progress} from './progress';

class ProgressTracker implements Progress {
    total: number;
    current: number;
    startTime: number;
    endTime: ?number;

    constructor(total: number): void {
        this.total = total;
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
        if (this.current > this.total) {
            this.current = this.total;
        }
    }

    getPercentage(): number {
        return (this.current / this.total) * 100;
    }

    getRemainingPercentage(): number {
        return 100 - this.getPercentage();
    }

    getRunningTime(): number {
        return this.endTime == null
            ? Date.now() - this.startTime
            : this.endTime - this.startTime;
    }

    getEtaTime(): number {
        return this.getRemainingPercentage() * this.getRunningTime() / this.getPercentage();
    }
}

export {
    ProgressTracker,
};
