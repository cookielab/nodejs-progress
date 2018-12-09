import RateTracker from '../src/RateTracker';

describe('rate tracker', () => {
    it('starts on creation', () => {
        const tracker = new RateTracker();

        // @ts-ignore
        expect(tracker.startTime).not.toBeNull();
    });

    it('changes start time on "start" method call', async () => {
        const tracker = new RateTracker();

        // @ts-ignore
        const originalStart = tracker.startTime;

        await new Promise((resolve) => setTimeout(resolve, 500));
        tracker.start();

        // @ts-ignore
        expect(tracker.startTime - originalStart).toBeGreaterThanOrEqual(500);

        // @ts-ignore
        expect(tracker.startTime - originalStart).toBeLessThan(550);
    });

    it('saves end time on "stop" method call', () => {
        const tracker = new RateTracker();

        // @ts-ignore
        expect(tracker.endTime).toBeNull();
        tracker.stop();

        // @ts-ignore
        expect(tracker.endTime).not.toBeNull();
    });

    it('removes end time calling "start" after "stop"', () => {
        const tracker = new RateTracker();
        tracker.stop();
        tracker.start();

        // @ts-ignore
        expect(tracker.endTime).toBeNull();
    });

    it('adds one tick on "tick" method call', () => {
        const tracker = new RateTracker();
        tracker.tick();
        expect(tracker.getCurrent()).toBe(1);
        tracker.tick();
        expect(tracker.getCurrent()).toBe(2);
    });

    it('adds specified count of ticks on "tick" method call', () => {
        const tracker = new RateTracker();
        tracker.tick(5);
        expect(tracker.getCurrent()).toBe(5);
        tracker.tick(8);
        expect(tracker.getCurrent()).toBe(13);
    });

    it('returns current value', () => {
        const tracker = new RateTracker();
        expect(tracker.getCurrent()).toBe(0);
        tracker.tick(42);
        expect(tracker.getCurrent()).toBe(42);
    });

    it('returns current operations per second', async () => {
        const tracker = new RateTracker();
        await new Promise((resolve) => setTimeout(resolve, 500));
        expect(tracker.getOperationsPerSecond()).toBe(0);
        tracker.tick(42);
        await new Promise((resolve) => setTimeout(resolve, 500));
        expect(tracker.getOperationsPerSecond()).toBeLessThanOrEqual(42);
        expect(tracker.getOperationsPerSecond()).toBeGreaterThan(41);
    });

    it('returns time of running without "stop" method call', async () => {
        const tracker = new RateTracker();
        expect(tracker.getRunningTime()).toBeLessThanOrEqual(1);
        await new Promise((resolve) => setTimeout(resolve, 500));
        expect(tracker.getRunningTime()).toBeGreaterThanOrEqual(500);
        expect(tracker.getRunningTime()).toBeLessThan(550);
    });

    it('returns time of running with "stop" method call', async () => {
        const tracker = new RateTracker();
        expect(tracker.getRunningTime()).toBeLessThanOrEqual(1);
        await new Promise((resolve) => setTimeout(resolve, 500));
        tracker.stop();
        expect(tracker.getRunningTime()).toBeGreaterThanOrEqual(500);
        await new Promise((resolve) => setTimeout(resolve, 500));
        expect(tracker.getRunningTime()).toBeGreaterThanOrEqual(500);
        expect(tracker.getRunningTime()).toBeLessThan(1000);
    });
});
