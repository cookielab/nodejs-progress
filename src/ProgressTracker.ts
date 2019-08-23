import {Progress} from './progress';

export default class ProgressTracker implements Progress {
	private readonly total: number;
	private current: number;
	private startTime: number;
	private endTime: number | null;

	public constructor(total: number) {
		this.total = total;
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
		if (this.current > this.total) {
			this.current = this.total;
		}
	}

	public getPercentage(): number {
		return (this.current / this.total) * 100;
	}

	public getRemainingPercentage(): number {
		return 100 - this.getPercentage();
	}

	public getRunningTime(): number {
		return this.endTime == null
			? Date.now() - this.startTime
			: this.endTime - this.startTime;
	}

	public getEtaTime(): number | null {
		const etaTime = this.getRemainingPercentage() * this.getRunningTime() / this.getPercentage();

		return Number.isFinite(etaTime) && !Number.isNaN(etaTime)
			? etaTime
			: null;
	}
}
