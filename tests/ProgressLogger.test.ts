import * as messageFormatter from '../src/messageFormatter';
import ProgressLogger from '../src/ProgressLogger';
import ProgressTracker from '../src/ProgressTracker';
import RateTracker from '../src/RateTracker';

describe('progress logger', () => {
	const itemsCount = 100;

	it('creates its own tracker on creation', () => {
		const logger = new ProgressLogger(itemsCount);

		// @ts-ignore
		expect(logger.tracker).toBeInstanceOf(ProgressTracker);
	});

	it('recalls start on tracker on start call', () => {
		const logger = new ProgressLogger(itemsCount);

		// @ts-ignore
		const startSpy = jest.spyOn(logger.tracker, 'start');
		logger.start();
		expect(startSpy).toHaveBeenCalledTimes(1);
		startSpy.mockRestore();
	});

	it('recalls stop on tracker on stop call', () => {
		const logger = new ProgressLogger(itemsCount);

		// @ts-ignore
		const stopSpy = jest.spyOn(logger.tracker, 'stop');
		logger.stop();
		expect(stopSpy).toHaveBeenCalledTimes(1);
		stopSpy.mockRestore();
	});

	it('calls log function on stop call', () => {
		const logger = new ProgressLogger(itemsCount);
		const logCallback = jest.fn();

		// @ts-ignore
		logger.logCallback = logCallback;
		logger.stop();
		expect(logCallback).toHaveBeenCalledTimes(1);
	});

	it('disables logging on stop call', () => {
		const logger = new ProgressLogger(itemsCount);
		const stopLoggingSpy = jest.spyOn(logger, 'disableLogging');
		logger.stop();
		expect(stopLoggingSpy).toHaveBeenCalledTimes(1);
		stopLoggingSpy.mockRestore();
	});

	it('recalls tick on tracker on tick call', () => {
		const logger = new ProgressLogger(itemsCount);

		// @ts-ignore
		const tickSpy = jest.spyOn(logger.tracker, 'tick');
		logger.tick();
		expect(tickSpy).toHaveBeenCalledTimes(1);
		tickSpy.mockRestore();
	});

	it('logs message on tick if it is turned on', () => {
		const logger = new ProgressLogger(itemsCount);
		const logCallback = jest.fn();

		// @ts-ignore
		logger.logCallback = logCallback;
		logger.tick();
		expect(logCallback).toHaveBeenCalledTimes(1);
	});

	it('enables logging for interval', () => {
		const logger = new ProgressLogger(itemsCount);
		const logFunction = jest.fn();
		logger.enableIntervalLogging(logFunction, 100);

		// @ts-ignore
		expect(logger.logCallback).not.toBeNull();

		// @ts-ignore
		expect(logger.intervalID).not.toBeNull();
		logger.disableLogging();
	});

	it('enables logging for interval without direct log call', () => {
		const logger = new ProgressLogger(itemsCount);
		const logFunction = jest.fn();
		logger.enableIntervalLogging(logFunction, 100);
		expect(logFunction).toHaveBeenCalledTimes(0);
		logger.disableLogging();
	});

	it('logs on interval if it is turned on', async () => {
		const logger = new ProgressLogger(itemsCount);
		const logFunction = jest.fn();
		logger.enableIntervalLogging(logFunction, 100);
		await new Promise((resolve: () => void) => {
			setTimeout(() => {
				logger.disableLogging();
				resolve();
			}, 499);
		});
		expect(logFunction).toHaveBeenCalledTimes(5);
	});

	it('enables logging for tick', () => {
		const logger = new ProgressLogger(itemsCount);
		const logFunction = jest.fn();
		logger.enableOnTickLogging(logFunction);

		// @ts-ignore
		expect(logger.logCallback).not.toBeNull();

		// @ts-ignore
		expect(logger.intervalID).toBeNull();
	});

	it('enables logging for tick with direct log call', () => {
		const logger = new ProgressLogger(itemsCount);
		const logFunction = jest.fn();
		logger.enableOnTickLogging(logFunction);
		expect(logFunction).toHaveBeenCalledTimes(1);
	});

	it('disables logging for interval', () => {
		const logger = new ProgressLogger(itemsCount);
		const logFunction = jest.fn();
		logger.enableIntervalLogging(logFunction, 100);
		logger.disableLogging();

		// @ts-ignore
		expect(logger.logCallback).toBeNull();

		// @ts-ignore
		expect(logger.intervalID).toBeNull();
	});

	it('disables logging for tick', () => {
		const logger = new ProgressLogger(itemsCount);
		const logFunction = jest.fn();
		logger.enableOnTickLogging(logFunction);
		logger.disableLogging();

		// @ts-ignore
		expect(logger.logCallback).toBeNull();

		// @ts-ignore
		expect(logger.intervalID).toBeNull();
	});

	it('creates progress message using message formatter passing precision parameter', () => {
		const logger = new ProgressLogger(itemsCount);
		const formatMessageSpy = jest.spyOn(messageFormatter, 'format');
		logger.message(3);
		expect(formatMessageSpy).toHaveBeenCalledWith(expect.any(ProgressTracker), 3);
		formatMessageSpy.mockRestore();
	});

	it('creates rate message using message formatter passing precision parameter', () => {
		const logger = new ProgressLogger();
		const formatMessageSpy = jest.spyOn(messageFormatter, 'format');
		logger.message(0);
		expect(formatMessageSpy).toHaveBeenCalledWith(expect.any(RateTracker), 0);
		formatMessageSpy.mockRestore();
	});
});
