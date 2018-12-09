import * as messageFormatter from './messageFormatter';
import ProgressTracker from './ProgressTracker';
import RateTracker from './RateTracker';
import {Progress} from './progress';

interface LogFunction {
    (message: string): void;
}

interface LogCallback {
    (): void;
}

export default class ProgressLogger implements Progress {
    private readonly tracker: ProgressTracker | RateTracker;
    private intervalID: NodeJS.Timer | null;
    private logCallback: LogCallback | null;

    constructor(total?: number) {
        this.tracker = total != null
            ? new ProgressTracker(total)
            : new RateTracker();
        this.intervalID = null;
        this.logCallback = null;
    }

    start(): void {
        this.tracker.start();
    }

    stop(): void {
        this.tracker.stop();
        this.disableLogging();
    }

    tick(count: number = 1): void {
        this.tracker.tick(count);
        if (this.logCallback != null && this.intervalID == null) {
            this.logCallback();
        }
    }

    enableIntervalLogging(logFunction: LogFunction, interval: number): void {
        this.logCallback = () => logFunction(this.message());
        this.intervalID = setInterval(this.logCallback, interval);
    }

    enableOnTickLogging(logFunction: LogFunction): void {
        this.logCallback = () => logFunction(this.message());
        this.logCallback();
    }

    disableLogging(): void {
        if (this.intervalID != null) {
            clearInterval(this.intervalID);
        }
        if (this.logCallback != null) {
            this.logCallback();
        }
        this.intervalID = null;
        this.logCallback = null;
    }

    message(precision?: number): string {
        return messageFormatter.format(this.tracker, precision);
    }
}
