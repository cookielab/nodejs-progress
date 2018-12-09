import {Progress} from './progress';

export default class ProgressTracker implements Progress {
    private readonly total: number;
    private current: number;
    private startTime: number;
    private endTime: number | null;

    constructor(total: number) {
        this.total = total;
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

    getEtaTime(): number | null {
        const etaTime = this.getRemainingPercentage() * this.getRunningTime() / this.getPercentage();
        return Number.isFinite(etaTime) && !Number.isNaN(etaTime)
            ? etaTime
            : null;
    }
}
