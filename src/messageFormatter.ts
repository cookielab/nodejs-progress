import ProgressTracker from './ProgressTracker';
import RateTracker from './RateTracker';

import prettyBytes = require('pretty-bytes'); // eslint-disable-line @typescript-eslint/no-require-imports
import prettyMs = require('pretty-ms'); // eslint-disable-line @typescript-eslint/no-require-imports

const formatMemory = (): string => {
	const memory = process.memoryUsage().rss;

	return `Memory usage: ${prettyBytes(memory)}`;
};

const formatProgress = (percentage: number, runningTime: number, etaTime: number | null, precision: number = 3): string => {
	const etaFormatted = etaTime != null ? prettyMs(etaTime) : 'calculating';

	return `Progress: ${percentage.toFixed(precision)}% Running: ${prettyMs(runningTime)} Eta: ${etaFormatted} ${formatMemory()}`;
};

const formatRate = (current: number, operationsPerSecond: number, runningTime: number, precision: number = 0): string => {
	const minuteRate = 60 * operationsPerSecond;
	const hourRate = 60 * minuteRate;
	const dayRate = 24 * hourRate;
	const rateFormatted = `${minuteRate.toFixed(precision)}ops/m, ${hourRate.toFixed(precision)}ops/h, ${dayRate.toFixed(precision)}ops/d`;

	return `Done: ${current} Rate: ${rateFormatted} Running: ${prettyMs(runningTime)} ${formatMemory()}`;
};

const format = (tracker: ProgressTracker | RateTracker, precision?: number): string => {
	if (tracker instanceof ProgressTracker) {
		return formatProgress(tracker.getPercentage(), tracker.getRunningTime(), tracker.getEtaTime(), precision != null ? precision : 3);
	}

	if (tracker instanceof RateTracker) {
		return formatRate(tracker.getCurrent(), tracker.getOperationsPerSecond(), tracker.getRunningTime(), precision != null ? precision : 0);
	}

	// @ts-ignore
	throw new Error(`Unexpected instance of tracker "${tracker.constructor.name}".`);
};

export {
	format,
};
