import * as messageFormatter from '../src/messageFormatter';
import ProgressTracker from '../src/ProgressTracker';
import RateTracker from '../src/RateTracker';

const createProgressTrackerMock = (): ProgressTracker => {
	return Object.setPrototypeOf({
		getPercentage: () => 50,
		getRunningTime: () => 59000,
		getEtaTime: () => 59000,
	}, ProgressTracker.prototype);
};

const createRateTrackerMock = (): RateTracker => {
	return Object.setPrototypeOf({
		getCurrent: () => 30000,
		getOperationsPerSecond: () => 4,
		getRunningTime: () => 59000,
	}, RateTracker.prototype);
};

describe('message formatter using progress tracker', () => {
	it('returns message for given instance', () => {
		const message = messageFormatter.format(createProgressTrackerMock());

		expect(message).toMatch(/Progress: 50\.000% Running: 59s Eta: 59s Memory usage: \d+(\.\d+)? MB/u);
	});

	it('return message for given instance with specified percentage precision', () => {
		const message = messageFormatter.format(createProgressTrackerMock(), 7);

		expect(message).toMatch(/Progress: 50\.0000000% Running: 59s Eta: 59s Memory usage: \d+(\.\d+)? MB/u);
	});
});

describe('message formatter using progress tracker', () => {
	it('returns message for given instance', () => {
		const message = messageFormatter.format(createRateTrackerMock());

		expect(message).toMatch(/Done: 30000 Rate: 240ops\/m, 14400ops\/h, 345600ops\/d Running: 59s Memory usage: \d+(\.\d+)? MB/u);
	});

	it('return message for given instance with specified percentage precision', () => {
		const message = messageFormatter.format(createRateTrackerMock(), 3);

		expect(message).toMatch(/Done: 30000 Rate: 240\.000ops\/m, 14400\.000ops\/h, 345600\.000ops\/d Running: 59s Memory usage: \d+(\.\d+)? MB/u);
	});
});
