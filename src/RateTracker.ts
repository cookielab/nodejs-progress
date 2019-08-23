import {Progress} from './progress';

export default class RateTracker implements Progress {
	private current: number;
	private startTime: number;
	private endTime: number | null;

	public constructor() {
		this.current = 0;
		this.startTime = Date.now();
		this.endTime = null;
	}

	public start(): void {
		this.startTime = Date.now();
		this.endTime = null;
	}

	public stop(): void {
		this.endTime = Date.now();
	}

	public tick(count: number = 1): void {
		this.current = this.current + count;
	}

	public getCurrent(): number {
		return this.current;
	}

	public getOperationsPerSecond(): number {
		const elapsedSeconds = (Date.now() - this.startTime) / 1000;

		return this.current / elapsedSeconds;
	}

	public getRunningTime(): number {
		return this.endTime == null
			? Date.now() - this.startTime
			: this.endTime - this.startTime;
	}
}
