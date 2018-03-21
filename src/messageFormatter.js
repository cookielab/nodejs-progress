// @flow

import prettyBytes from 'pretty-bytes';
import prettyMs from 'pretty-ms';

const formatMessage = (percentage: number, runningTime: number, etaTime: ?number, precision: number = 3): string => {
    const etaFormatted = etaTime != null ? prettyMs(etaTime) : 'calculating';
    const memory = process.memoryUsage().rss;
    return `Progress: ${percentage.toFixed(precision)}% Running: ${prettyMs(runningTime)} Eta: ${etaFormatted} Memory usage: ${prettyBytes(memory)}`;
};

export {
    formatMessage,
};
