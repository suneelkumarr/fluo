/**
 * FLUO - Table Formatter
 * Create beautiful formatted tables in terminal
 */

import { visibleLength } from '../utils/visible';
import { applyStyle } from '../core/factory';
import { OPEN, CLOSE } from '../core/ansi';

export interface TableOptions {
    /**
     * Whether first row is header
     */
    header?: boolean;

    /**
     * Border style
     */
    border?: 'single' | 'double' | 'rounded' | 'bold' | 'none';

    /**
     * Column alignment
     */
    align?: ('left' | 'center' | 'right')[];

    /**
     * Padding inside cells
     */
    padding?: number;

    /**
     * Column widths (auto if not specified)
     */
    columnWidths?: number[];

    /**
     * Header color function
     */
    headerColor?: (text: string) => string;

    /**
     * Border color function
     */
    borderColor?: (text: string) => string;
}

interface BorderChars {
    topLeft: string;
    topRight: string;
    bottomLeft: string;
    bottomRight: string;
    horizontal: string;
    vertical: string;
    cross: string;
    leftT: string;
    rightT: string;
    topT: string;
    bottomT: string;
}

const BORDERS: Record<string, BorderChars> = {
    single: {
        topLeft: '┌',
        topRight: '┐',
        bottomLeft: '└',
        bottomRight: '┘',
        horizontal: '─',
        vertical: '│',
        cross: '┼',
        leftT: '├',
        rightT: '┤',
        topT: '┬',
        bottomT: '┴',
    },
    double: {
        topLeft: '╔',
        topRight: '╗',
        bottomLeft: '╚',
        bottomRight: '╝',
        horizontal: '═',
        vertical: '║',
        cross: '╬',
        leftT: '╠',
        rightT: '╣',
        topT: '╦',
        bottomT: '╩',
    },
    rounded: {
        topLeft: '╭',
        topRight: '╮',
        bottomLeft: '╰',
        bottomRight: '╯',
        horizontal: '─',
        vertical: '│',
        cross: '┼',
        leftT: '├',
        rightT: '┤',
        topT: '┬',
        bottomT: '┴',
    },
    bold: {
        topLeft: '┏',
        topRight: '┓',
        bottomLeft: '┗',
        bottomRight: '┛',
        horizontal: '━',
        vertical: '┃',
        cross: '╋',
        leftT: '┣',
        rightT: '┫',
        topT: '┳',
        bottomT: '┻',
    },
};

/**
 * Pad text to width with alignment
 */
const padCell = (text: string, width: number, align: 'left' | 'center' | 'right', padding: number): string => {
    const textLen = visibleLength(text);
    const totalWidth = width + (padding * 2);
    const contentWidth = totalWidth - (padding * 2);

    let padded = text;
    const diff = contentWidth - textLen;

    if (diff > 0) {
        if (align === 'center') {
            const leftPad = Math.floor(diff / 2);
            const rightPad = diff - leftPad;
            padded = ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
        } else if (align === 'right') {
            padded = ' '.repeat(diff) + text;
        } else {
            padded = text + ' '.repeat(diff);
        }
    }

    return ' '.repeat(padding) + padded + ' '.repeat(padding);
};

/**
 * Calculate column widths
 */
const calculateWidths = (rows: string[][], options: TableOptions): number[] => {
    if (options.columnWidths) {
        return options.columnWidths;
    }

    const numCols = Math.max(...rows.map(row => row.length));
    const widths: number[] = new Array(numCols).fill(0);

    for (const row of rows) {
        for (let i = 0; i < row.length; i++) {
            const len = visibleLength(row[i]);
            if (len > widths[i]) {
                widths[i] = len;
            }
        }
    }

    return widths;
};

/**
 * Create a formatted table
 */
export const table = (data: string[][], options: TableOptions = {}): string => {
    if (!data || data.length === 0) {
        return '';
    }

    const {
        header = false,
        border = 'single',
        align = [],
        padding = 1,
        headerColor = (t) => applyStyle(t, OPEN.bold, CLOSE.bold),
        borderColor = (t) => t,
    } = options;

    if (border === 'none') {
        // Simple table without borders
        const widths = calculateWidths(data, options);
        const lines: string[] = [];

        for (let i = 0; i < data.length; i++) {
            const row = data[i];
            const cells = row.map((cell, j) => {
                const cellAlign = align[j] || 'left';
                const padded = padCell(cell, widths[j], cellAlign, padding);
                return i === 0 && header ? headerColor(padded) : padded;
            });
            lines.push(cells.join('  '));

            if (i === 0 && header) {
                lines.push(widths.map(w => '─'.repeat(w + padding * 2)).join('  '));
            }
        }

        return lines.join('\n');
    }

    const chars = BORDERS[border];
    const widths = calculateWidths(data, options);
    const lines: string[] = [];

    // Top border
    const topBorder = borderColor(
        chars.topLeft +
        widths.map(w => chars.horizontal.repeat(w + padding * 2)).join(chars.topT) +
        chars.topRight
    );
    lines.push(topBorder);

    // Rows
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const cells = row.map((cell, j) => {
            const cellAlign = align[j] || 'left';
            const padded = padCell(cell, widths[j], cellAlign, padding);
            return i === 0 && header ? headerColor(padded) : padded;
        });

        const rowLine = borderColor(chars.vertical) + cells.join(borderColor(chars.vertical)) + borderColor(chars.vertical);
        lines.push(rowLine);

        // Separator after header
        if (i === 0 && header && i < data.length - 1) {
            const separator = borderColor(
                chars.leftT +
                widths.map(w => chars.horizontal.repeat(w + padding * 2)).join(chars.cross) +
                chars.rightT
            );
            lines.push(separator);
        }
    }

    // Bottom border
    const bottomBorder = borderColor(
        chars.bottomLeft +
        widths.map(w => chars.horizontal.repeat(w + padding * 2)).join(chars.bottomT) +
        chars.bottomRight
    );
    lines.push(bottomBorder);

    return lines.join('\n');
};

/**
 * Create a simple ASCII table (for maximum compatibility)
 */
export const asciiTable = (data: string[][], options: Omit<TableOptions, 'border'> = {}): string => {
    return table(data, { ...options, border: 'none' });
};
