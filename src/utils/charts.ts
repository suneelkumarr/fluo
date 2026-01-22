/**
 * FLUO - Charts & Graphs
 * Simple bar charts and visualizations for terminal
 */

import { visibleLength } from './visible';

export interface BarChartOptions {
    /**
     * Chart data
     */
    data: number[];

    /**
     * Labels for each bar
     */
    labels?: string[];

    /**
     * Maximum width of bars
     */
    width?: number;

    /**
     * Color function for bars
     */
    color?: (value: number, index: number) => string;

    /**
     * Show values at end of bars
     */
    showValues?: boolean;

    /**
     * Bar character
     */
    barChar?: string;

    /**
     * Format value display
     */
    format?: (value: number) => string;
}

/**
 * Create a horizontal bar chart
 */
export const barChart = (options: BarChartOptions): string => {
    const {
        data,
        labels = [],
        width = 50,
        color = (v) => String(v),
        showValues = true,
        barChar = '█',
        format = (v) => String(v),
    } = options;

    if (!data || data.length === 0) {
        return '';
    }

    const max = Math.max(...data);
    const lines: string[] = [];

    // Calculate label width
    const labelWidth = Math.max(...labels.map(l => visibleLength(l)), 0);

    for (let i = 0; i < data.length; i++) {
        const value = data[i];
        const label = labels[i] || '';
        const barLength = Math.round((value / max) * width);
        const bar = barChar.repeat(barLength);
        const coloredBar = color(value, i);
        const paddedLabel = label.padEnd(labelWidth);

        let line = paddedLabel;
        if (paddedLabel) line += ' ';
        line += typeof coloredBar === 'function' ? coloredBar(bar) : bar;

        if (showValues) {
            line += ' ' + format(value);
        }

        lines.push(line);
    }

    return lines.join('\n');
};

/**
 * Create a vertical bar chart
 */
export const verticalBarChart = (options: BarChartOptions): string => {
    const {
        data,
        labels = [],
        width = 10,
        color = (v) => String(v),
        barChar = '█',
    } = options;

    if (!data || data.length === 0) {
        return '';
    }

    const max = Math.max(...data);
    const height = 10;
    const lines: string[] = [];

    // Draw bars from top to bottom
    for (let row = height; row > 0; row--) {
        let line = '';
        for (let i = 0; i < data.length; i++) {
            const value = data[i];
            const barHeight = Math.round((value / max) * height);
            const char = barHeight >= row ? barChar : ' ';
            const colored = color(value, i);
            const cell = (typeof colored === 'function' ? colored(char) : char).repeat(width);
            line += cell + ' ';
        }
        lines.push(line);
    }

    // Add labels
    if (labels.length > 0) {
        let labelLine = '';
        for (let i = 0; i < labels.length; i++) {
            const label = labels[i].substring(0, width);
            labelLine += label.padEnd(width) + ' ';
        }
        lines.push('─'.repeat(labelLine.length));
        lines.push(labelLine);
    }

    return lines.join('\n');
};

/**
 * Create a simple sparkline
 */
export const sparkline = (data: number[], options: { color?: (v: number) => string } = {}): string => {
    const chars = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    return data.map((value, i) => {
        const normalized = range === 0 ? 0 : (value - min) / range;
        const index = Math.min(Math.floor(normalized * chars.length), chars.length - 1);
        const char = chars[index];
        return options.color ? options.color(value)(char) : char;
    }).join('');
};

/**
 * Create a progress bar
 */
export const progressBar = (
    current: number,
    total: number,
    options: {
        width?: number;
        complete?: string;
        incomplete?: string;
        showPercent?: boolean;
        color?: (percent: number) => string;
    } = {}
): string => {
    const {
        width = 30,
        complete = '█',
        incomplete = '░',
        showPercent = true,
        color = (p) => String(p),
    } = options;

    const percent = Math.min(100, Math.max(0, (current / total) * 100));
    const filled = Math.round((percent / 100) * width);
    const empty = width - filled;

    const bar = complete.repeat(filled) + incomplete.repeat(empty);
    const coloredBar = typeof color === 'function' ? color(percent)(bar) : bar;

    let result = coloredBar;
    if (showPercent) {
        result += ` ${percent.toFixed(1)}%`;
    }

    return result;
};
