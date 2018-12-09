export interface Progress {
    start(): void;

    stop(): void;

    tick(count: number): void;
}
