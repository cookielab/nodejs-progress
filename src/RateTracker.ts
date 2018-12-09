import {Progress} from './progress';

export default class RateTracker implements Progress {
    private current: number;
    private startTime: number;
    private endTime: number | null;

    constructor() {
        this.current = 0;
        this.startTime = Date.now();
        this.endTime = null;
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
