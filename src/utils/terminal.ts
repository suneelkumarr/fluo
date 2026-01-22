/**
 * FLUO - Terminal Utilities
 * Terminal size detection and responsive text
 */

export interface TerminalSize {
    columns: number;
    rows: number;
}

/**
 * Get terminal size
 */
export const getTerminalSize = (): TerminalSize => {
    if (typeof process !== 'undefined' && process.stdout) {
        return {
            columns: process.stdout.columns || 80,
            rows: process.stdout.rows || 24,
        };
    }

    return { columns: 80, rows: 24 };
};

/**
 * Check if terminal is interactive (TTY)
 */
export const isInteractive = (): boolean => {
    return typeof process !== 'undefined' &&
        process.stdout &&
        (process.stdout as any).isTTY === true;
};

/**
 * Responsive text that adapts to terminal width
 */
export const responsive = (text: string, options: {
    maxWidth?: number | 'auto';
    truncate?: boolean;
    ellipsis?: string;
} = {}): string => {
    const {
        maxWidth = 'auto',
        truncate = true,
        ellipsis = '...',
    } = options;

    const termWidth = getTerminalSize().columns;
    const width = maxWidth === 'auto' ? termWidth : maxWidth;

    if (text.length <= width) {
        return text;
    }

    if (truncate) {
        return text.substring(0, width - ellipsis.length) + ellipsis;
    }

    // Word wrap
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        if ((currentLine + word).length > width) {
            if (currentLine) {
                lines.push(currentLine.trim());
                currentLine = '';
            }

            if (word.length > width) {
                // Word is longer than width, break it
                lines.push(word.substring(0, width));
                currentLine = word.substring(width) + ' ';
            } else {
                currentLine = word + ' ';
            }
        } else {
            currentLine += word + ' ';
        }
    }

    if (currentLine) {
        lines.push(currentLine.trim());
    }

    return lines.join('\n');
};

/**
 * Center text in terminal
 */
export const centerText = (text: string): string => {
    const { columns } = getTerminalSize();
    const lines = text.split('\n');

    return lines.map(line => {
        const padding = Math.max(0, Math.floor((columns - line.length) / 2));
        return ' '.repeat(padding) + line;
    }).join('\n');
};

/**
 * Fit text to terminal width
 */
export const fitToTerminal = (text: string, options: {
    padding?: number;
    align?: 'left' | 'center' | 'right';
} = {}): string => {
    const { padding = 0, align = 'left' } = options;
    const { columns } = getTerminalSize();
    const availableWidth = columns - (padding * 2);

    const lines = text.split('\n');

    return lines.map(line => {
        if (line.length > availableWidth) {
            line = line.substring(0, availableWidth);
        }

        const pad = ' '.repeat(padding);

        if (align === 'center') {
            const leftPad = Math.max(0, Math.floor((availableWidth - line.length) / 2));
            return pad + ' '.repeat(leftPad) + line + pad;
        } else if (align === 'right') {
            const leftPad = Math.max(0, availableWidth - line.length);
            return pad + ' '.repeat(leftPad) + line + pad;
        } else {
            return pad + line + pad;
        }
    }).join('\n');
};

/**
 * Create a full-width divider
 */
export const divider = (char: string = '─'): string => {
    const { columns } = getTerminalSize();
    return char.repeat(columns);
};

/**
 * Clear terminal screen
 */
export const clearScreen = (): void => {
    if (typeof process !== 'undefined' && process.stdout) {
        process.stdout.write('\x1b[2J\x1b[0f');
    }
};

/**
 * Move cursor to position
 */
export const moveCursor = (x: number, y: number): void => {
    if (typeof process !== 'undefined' && process.stdout) {
        process.stdout.write(`\x1b[${y};${x}H`);
    }
};

/**
 * Hide cursor
 */
export const hideCursor = (): void => {
    if (typeof process !== 'undefined' && process.stdout) {
        process.stdout.write('\x1b[?25l');
    }
};

/**
 * Show cursor
 */
export const showCursor = (): void => {
    if (typeof process !== 'undefined' && process.stdout) {
        process.stdout.write('\x1b[?25h');
    }
};
