import * as _ from 'lodash-es';

// Types
export type PrometheusLabels = { [key: string]: string };
export type PrometheusValue = [number, string];

// Only covers range and instant vector responses for now.
export type PrometheusResult = {
    metric: PrometheusLabels;
    values?: PrometheusValue[];
    value?: PrometheusValue;
};

type PrometheusData = {
    resultType: 'matrix' | 'vector' | 'scalar' | 'string';
    result: PrometheusResult[];
};

type PrometheusResponse = {
    status: string;
    data: PrometheusData;
    errorType?: string;
    error?: string;
    warnings?: string[];
};

type DataPoint<X = Date | number | string> = {
    x?: X;
    y?: number;
    label?: string;
    metric?: { [key: string]: string };
    description?: (date: string, value: string) => string;
};

type HumanizeResult = {
    string: string;
    value: number;
    unit: string;
};

type Humanize = {
    (v: React.ReactText, initialUnit?: string, preferredUnit?: string): HumanizeResult;
};


export const getRangeVectorStats: GetStats<Date> = (response) => {
    const values = _.get(response, 'data.result[0].values');
    return _.map(values, (value) => ({
        x: new Date(value[0] * 1000),
        y: parseFloat(value[1]),
    }));
};

export const getInstantVectorStats: GetStats<number> = (response, metric, humanize) => {
    const results = _.get(response, 'data.result', []);
    return results.map((r) => {
        const y = parseFloat(_.get(r, 'value[1]'));
        return {
            label: humanize ? humanize(y).string : null,
            x: _.get(r, ['metric', metric], ''),
            y,
            metric: r.metric,
        };
    });
};

export type GetStats<X = Date | number | string> = {
    (response: PrometheusResponse, metric?: string, humanize?: Humanize): DataPoint<X>[];
};
