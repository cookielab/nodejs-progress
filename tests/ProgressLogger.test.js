import * as messageFormatter from '../src/messageFormatter';
import ProgressLogger from '../src/ProgressLogger';
import ProgressTracker from '../src/ProgressTracker';

describe('progress logger', () => {
    const itemsCount = 100;

    it('creates its own tracker on creation', () => {
        const logger = new ProgressLogger(itemsCount);
        expect(logger.tracker).toBeInstanceOf(ProgressTracker);
    });

    it('recalls start on tracker on start call', () => {
        const logger = new ProgressLogger(itemsCount);
        const startSpy = jest.spyOn(logger.tracker, 'start');
        logger.start();
        expect(startSpy).toHaveBeenCalledTimes(1);
    });

    it('recalls stop on tracker on stop call', () => {
        const logger = new ProgressLogger(itemsCount);
        const stopSpy = jest.spyOn(logger.tracker, 'stop');
        logger.stop();
        expect(stopSpy).toHaveBeenCalledTimes(1);
    });

    it('calls log function on stop call', () => {
        const logger = new ProgressLogger(itemsCount);
        const logCallback = jest.fn();
        logger.logCallback = logCallback;
        logger.stop();
        expect(logCallback).toHaveBeenCalledTimes(1);
    });

    it('disables logging on stop call', () => {
        const logger = new ProgressLogger(itemsCount);
        const stopLoggingSpy = jest.spyOn(logger, 'disableLogging');
        logger.stop();
        expect(stopLoggingSpy).toHaveBeenCalledTimes(1);
    });

    it('recalls tick on tracker on tick call', () => {
        const logger = new ProgressLogger(itemsCount);
        const tickSpy = jest.spyOn(logger.tracker, 'tick');
        logger.tick();
        expect(tickSpy).toHaveBeenCalledTimes(1);
    });

    it('logs message on tick if it is turned on', () => {
        const logger = new ProgressLogger(itemsCount);
        const logCallback = jest.fn();
        logger.logCallback = logCallback;
        logger.tick();
        expect(logCallback).toHaveBeenCalledTimes(1);
    });

    it('enables logging for interval', () => {
        const logger = new ProgressLogger(itemsCount);
        const logFunction = jest.fn();
        logger.enableIntervalLogging(logFunction, 100);
        expect(logger.logCallback).not.toBeNull();
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
        await new Promise((resolve) => {
            setTimeout(() => {
                logger.disableLogging();
                expect(logFunction).toHaveBeenCalledTimes(5);
                resolve();
            }, 450);
        });
    });

    it('enables logging for tick', () => {
        const logger = new ProgressLogger(itemsCount);
        const logFunction = jest.fn();
        logger.enableOnTickLogging(logFunction);
        expect(logger.logCallback).not.toBeNull();
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
        expect(logger.logCallback).toBeNull();
        expect(logger.intervalID).toBeNull();
    });

    it('disables logging for tick', () => {
        const logger = new ProgressLogger(itemsCount);
        const logFunction = jest.fn();
        logger.enableOnTickLogging(logFunction, 100);
        logger.disableLogging();
        expect(logger.logCallback).toBeNull();
        expect(logger.intervalID).toBeNull();
    });

    it('creates message using message formatter passing precision parameter', () => {
        const logger = new ProgressLogger(itemsCount);
        const formatMessageSpy = jest.spyOn(messageFormatter, 'formatMessage');
        const getPercentageSpy = jest.spyOn(logger.tracker, 'getPercentage');
        const getRunningTimeSpy = jest.spyOn(logger.tracker, 'getRunningTime');
        const getEtaTimeSpy = jest.spyOn(logger.tracker, 'getEtaTime');
        logger.message(3);
        expect(formatMessageSpy).toHaveBeenCalledTimes(1);
        expect(formatMessageSpy).toHaveBeenCalledWith(expect.anything(), expect.anything(), null, 3);
        expect(getPercentageSpy).toHaveBeenCalledTimes(3);
        expect(getRunningTimeSpy).toHaveBeenCalledTimes(2);
        expect(getEtaTimeSpy).toHaveBeenCalledTimes(1);
    });
});
