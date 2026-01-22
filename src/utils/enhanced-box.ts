/**
 * FLUO - Enhanced Box Borders
 * Additional border styles for boxes
 */

import { visibleLength } from './visible';

export interface EnhancedBoxOptions {
    /**
     * Border style
     */
    style?: 'ascii' | 'heavy' | 'light' | 'curved' | 'double-single' | 'custom';

    /**
     * Custom border characters
     */
    customChars?: {
        topLeft: string;
        topRight: string;
        bottomLeft: string;
        bottomRight: string;
        horizontal: string;
        vertical: string;
    };

    /**
     * Padding
     */
    padding?: number;

    /**
     * Title
     */
    title?: string;

    /**
     * Title alignment
     */
    titleAlign?: 'left' | 'center' | 'right';

    /**
     * Color function
     */
    color?: (text: string) => string;
}

const BORDER_STYLES = {
    ascii: {
        topLeft: '+',
        topRight: '+',
        bottomLeft: '+',
        bottomRight: '+',
        horizontal: '-',
        vertical: '|',
    },
    heavy: {
        topLeft: '┏',
        topRight: '┓',
        bottomLeft: '┗',
        bottomRight: '┛',
        horizontal: '━',
        vertical: '┃',
    },
    light: {
        topLeft: '┌',
        topRight: '┐',
        bottomLeft: '└',
        bottomRight: '┘',
        horizontal: '─',
        vertical: '│',
    },
    curved: {
        topLeft: '╭',
        topRight: '╮',
        bottomLeft: '╰',
        bottomRight: '╯',
        horizontal: '─',
        vertical: '│',
    },
    'double-single': {
        topLeft: '╓',
        topRight: '╖',
        bottomLeft: '╙',
        bottomRight: '╜',
        horizontal: '─',
        vertical: '║',
    },
};

/**
 * Create an enhanced box with additional styles
 */
export const enhancedBox = (content: string, options: EnhancedBoxOptions = {}): string => {
    const {
        style = 'light',
        customChars,
        padding = 1,
        title,
        titleAlign = 'left',
        color = (t) => t,
    } = options;

    const chars = customChars || BORDER_STYLES[style] || BORDER_STYLES.light;
    const lines = content.split('\n');
    const maxWidth = Math.max(...lines.map(l => visibleLength(l)));

    const pad = ' '.repeat(padding);
    const innerWidth = maxWidth + (padding * 2);

    // Top border
    let topBorder = chars.topLeft + chars.horizontal.repeat(innerWidth) + chars.topRight;

    if (title) {
        const titleText = ` ${title} `;
        const titleLen = visibleLength(titleText);

        if (titleAlign === 'center') {
            const leftPad = Math.floor((innerWidth - titleLen) / 2);
            const rightPad = innerWidth - titleLen - leftPad;
            topBorder = chars.topLeft + chars.horizontal.repeat(leftPad) + titleText +
                chars.horizontal.repeat(rightPad) + chars.topRight;
        } else if (titleAlign === 'right') {
            const leftPad = innerWidth - titleLen;
            topBorder = chars.topLeft + chars.horizontal.repeat(leftPad) + titleText + chars.topRight;
        } else {
            const rightPad = innerWidth - titleLen;
            topBorder = chars.topLeft + titleText + chars.horizontal.repeat(rightPad) + chars.topRight;
        }
    }

    const result: string[] = [color(topBorder)];

    // Content lines
    for (const line of lines) {
        const lineLen = visibleLength(line);
        const rightPad = ' '.repeat(maxWidth - lineLen);
        result.push(color(chars.vertical) + pad + line + rightPad + pad + color(chars.vertical));
    }

    // Bottom border
    const bottomBorder = chars.bottomLeft + chars.horizontal.repeat(innerWidth) + chars.bottomRight;
    result.push(color(bottomBorder));

    return result.join('\n');
};

/**
 * Create ASCII box (maximum compatibility)
 */
export const asciiBox = (content: string, options: Omit<EnhancedBoxOptions, 'style'> = {}): string => {
    return enhancedBox(content, { ...options, style: 'ascii' });
};

/**
 * Create heavy box
 */
export const heavyBox = (content: string, options: Omit<EnhancedBoxOptions, 'style'> = {}): string => {
    return enhancedBox(content, { ...options, style: 'heavy' });
};

/**
 * Create curved box
 */
export const curvedBox = (content: string, options: Omit<EnhancedBoxOptions, 'style'> = {}): string => {
    return enhancedBox(content, { ...options, style: 'curved' });
};
