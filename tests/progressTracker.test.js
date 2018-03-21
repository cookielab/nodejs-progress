import {ProgressTracker} from '../src/progressTracker';

describe('progress tracker', () => {
    const itemsCount = 100;

    it('starts on creation', () => {
        const tracker = new ProgressTracker(itemsCount);
        expect(tracker.startTime).not.toBeNull();
    });

    it('changes start time on "start" method call', async () => {
        const tracker = new ProgressTracker(itemsCount);
        const originalStart = tracker.startTime;
        await new Promise((resolve) => {
            setTimeout(() => {
                tracker.start();
                expect(tracker.startTime - originalStart).toBeGreaterThanOrEqual(500);
                resolve();
            }, 500);
        });
    });

    it('saves end time on "stop" method call', () => {
        const tracker = new ProgressTracker(itemsCount);
        expect(tracker.endTime).toBeNull();
        tracker.stop();
        expect(tracker.endTime).not.toBeNull();
    });

    it('removes end time calling "start" after "stop"', () => {
        const tracker = new ProgressTracker(itemsCount);
        tracker.stop();
        tracker.start();
        expect(tracker.endTime).toBeNull();
    });

    it('adds one tick on "tick" method call', () => {
        const tracker = new ProgressTracker(itemsCount);
        tracker.tick();
        expect(tracker.current).toBe(1);
        tracker.tick();
        expect(tracker.current).toBe(2);
    });

    it('adds specified count of ticks on "tick" method call', () => {
        const tracker = new ProgressTracker(itemsCount);
        tracker.tick(5);
        expect(tracker.current).toBe(5);
        tracker.tick(8);
        expect(tracker.current).toBe(13);
    });

    it('does not adds more than total count on "tick" method call', () => {
        const tracker = new ProgressTracker(itemsCount);
        tracker.tick(itemsCount + 1); // N + 1
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
        expect(tracker.getRunningTime()).toBe(0);
        await new Promise((resolve) => {
            setTimeout(() => {
                expect(tracker.getRunningTime()).toBeGreaterThanOrEqual(500);
                resolve();
            }, 500);
        });
    });

    it('returns time of running with "stop" method call', async () => {
        const tracker = new ProgressTracker(itemsCount);
        expect(tracker.getRunningTime()).toBe(0);
        await new Promise((resolve) => {
            setTimeout(() => {
                tracker.stop();
                expect(tracker.getRunningTime()).toBeGreaterThanOrEqual(500);
                setTimeout(() => {
                    expect(tracker.getRunningTime()).toBeGreaterThanOrEqual(500);
                    expect(tracker.getRunningTime()).toBeLessThan(1000);
                    resolve();
                }, 500);
            }, 500);
        });
    });

    it('returns estimated time of completeness', () => {
        const elapsedTime = 10 * 1000; // 10s
        const tracker = new ProgressTracker(itemsCount);
        expect(tracker.getEtaTime()).toBeNull();
        tracker.startTime = tracker.startTime - elapsedTime;
        tracker.tick(itemsCount / 2); // 50 %
        expect(tracker.getEtaTime()).toBeGreaterThanOrEqual(elapsedTime);
    });
});
