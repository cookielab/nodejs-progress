import * as messageFormatter from '../src/messageFormatter';

describe('message formatter', () => {
    it('returns message for given parameters', () => {
        const message = messageFormatter.formatMessage(50, 59000, 59000);

        expect(message).toMatch(/Progress: 50.000% Running: 59s Eta: 59s Memory usage: \d+\.\d+ MB/);
    });

    it('returns message with specified percentage precision', () => {
        const message = messageFormatter.formatMessage(50, 59000, 59000, 7);

        expect(message).toMatch(/Progress: 50.0000000% Running: 59s Eta: 59s Memory usage: \d+\.\d+ MB/);
    });
});
