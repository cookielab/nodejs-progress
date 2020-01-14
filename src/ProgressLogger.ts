import * as messageFormatter from './messageFormatter';
import {Progress} from './progress';
import ProgressTracker from './ProgressTracker';
import RateTracker from './RateTracker';

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

	public constructor(total?: number) {
		this.tracker = total != null
			? new ProgressTracker(total)
			: new RateTracker();
		this.intervalID = null;
		this.logCallback = null;
	}

	public start(): void {
		this.tracker.start();
	}

	public stop(): void {
		this.tracker.stop();
		this.disableLogging();
	}

	public tick(count: number = 1): void {
		this.tracker.tick(count);
		if (this.logCallback != null && this.intervalID == null) {
			this.logCallback();
		}
	}

	public enableIntervalLogging(logFunction: LogFunction, interval: number): void {
		const logCallback = (): void => logFunction(this.message());
		this.logCallback = logCallback;
		this.intervalID = setInterval(logCallback, interval);
	}

	public enableOnTickLogging(logFunction: LogFunction): void {
		this.logCallback = () => logFunction(this.message());
		this.logCallback();
	}

	public disableLogging(): void {
		if (this.intervalID != null) {
			clearInterval(this.intervalID);
		}
		if (this.logCallback != null) {
			this.logCallback();
		}
		this.intervalID = null;
		this.logCallback = null;
	}

	public message(precision?: number): string {
		return messageFormatter.format(this.tracker, precision);
	}
}
