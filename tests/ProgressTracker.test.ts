import ProgressTracker from '../src/ProgressTracker';

describe('progress tracker', () => {
    const itemsCount = 100;

    it('starts on creation', () => {
        const tracker = new ProgressTracker(itemsCount);

        // @ts-ignore
        expect(tracker.startTime).not.toBeNull();
    });

    it('changes start time on "start" method call', async () => {
        const tracker = new ProgressTracker(itemsCount);

        // @ts-ignore
        const originalStart = tracker.startTime;
        await new Promise((resolve) => {
            setTimeout(() => {
                tracker.start();
                resolve();
            }, 500);
        });

        // @ts-ignore
        expect(tracker.startTime - originalStart).toBeGreaterThanOrEqual(500);
    });

    it('saves end time on "stop" method call', () => {
        const tracker = new ProgressTracker(itemsCount);

        // @ts-ignore
        expect(tracker.endTime).toBeNull();
        tracker.stop();

        // @ts-ignore
        expect(tracker.endTime).not.toBeNull();
    });

    it('removes end time calling "start" after "stop"', () => {
        const tracker = new ProgressTracker(itemsCount);
        tracker.stop();
        tracker.start();

        // @ts-ignore
        expect(tracker.endTime).toBeNull();
    });

    it('adds one tick on "tick" method call', () => {
        const tracker = new ProgressTracker(itemsCount);
        tracker.tick();

        // @ts-ignore
        expect(tracker.current).toBe(1);
        tracker.tick();

        // @ts-ignore
        expect(tracker.current).toBe(2);
    });

    it('adds specified count of ticks on "tick" method call', () => {
        const tracker = new ProgressTracker(itemsCount);
        tracker.tick(5);

        // @ts-ignore
        expect(tracker.current).toBe(5);
        tracker.tick(8);

        // @ts-ignore
        expect(tracker.current).toBe(13);
    });

    it('does not adds more than total count on "tick" method call', () => {
        const tracker = new ProgressTracker(itemsCount);
        tracker.tick(itemsCount + 1); // N + 1

        // @ts-ignore
        expect(tracker.current).toBe(itemsCount);
    });

    it('returns current percentage of completeness', () => {
        const tracker = new ProgressTracker(itemsCount);
        expect(tracker.getPercentage()).toBe(0);
        tracker.tick(itemsCount / 2); // 50 %
        expect(tracker.getPercentage()).toBe(50);
    });

    it('returns current remaining percentage', () => {
        const tracker = new ProgressTracker(itemsCount);
        expect(tracker.getRemainingPercentage()).toBe(100);
        tracker.tick(itemsCount / 2); // 50 %
        expect(tracker.getRemainingPercentage()).toBe(50);
    });

    it('returns time of running without "stop" method call', async () => {
        const tracker = new ProgressTracker(itemsCount);
        expect(tracker.getRunningTime()).toBeLessThanOrEqual(1);
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
        expect(tracker.getRunningTime()).toBeGreaterThanOrEqual(500);
    });

    it('returns time of running with "stop" method call', async () => {
        const tracker = new ProgressTracker(itemsCount);
        expect(tracker.getRunningTime()).toBeLessThanOrEqual(1);
        await new Promise((resolve) => {
            setTimeout(() => {
                tracker.stop();
                expect(tracker.getRunningTime()).toBeGreaterThanOrEqual(500);
                expect(tracker.getRunningTime()).toBeLessThan(1000);
                setTimeout(() => {
                    resolve();
                }, 500);
            }, 500);
        });
        expect(tracker.getRunningTime()).toBeGreaterThanOrEqual(500);
        expect(tracker.getRunningTime()).toBeLessThan(1000);
    });

    it('returns estimated time of completeness', () => {
        const elapsedTime = 10 * 1000; // 10s
        const tracker = new ProgressTracker(itemsCount);
        expect(tracker.getEtaTime()).toBeNull();

        // @ts-ignore
        tracker.startTime = tracker.startTime - elapsedTime;
        tracker.tick(itemsCount / 2); // 50 %
        expect(tracker.getEtaTime()).toBeGreaterThanOrEqual(elapsedTime);
    });
});
