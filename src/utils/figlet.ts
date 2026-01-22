/**
 * FLUO - ASCII Art / Figlet
 * Generate large ASCII art text
 */

// Simple ASCII font (standard)
const STANDARD_FONT: Record<string, string[]> = {
    'A': [
        '  ___  ',
        ' / _ \\ ',
        '/ /_\\ \\',
        '|  _  |',
        '| | | |',
        '\\_| |_/'
    ],
    'B': [
        ' ____  ',
        '| __ ) ',
        '|  _ \\ ',
        '| |_) |',
        '|____/ ',
        '       '
    ],
    'C': [
        '  ____ ',
        ' / ___|',
        '| |    ',
        '| |___ ',
        ' \\____|',
        '       '
    ],
    'D': [
        ' ____  ',
        '|  _ \\ ',
        '| | | |',
        '| |_| |',
        '|____/ ',
        '       '
    ],
    'E': [
        ' _____ ',
        '| ____|',
        '|  _|  ',
        '| |___ ',
        '|_____|',
        '       '
    ],
    'F': [
        ' _____ ',
        '|  ___|',
        '| |_   ',
        '|  _|  ',
        '|_|    ',
        '       '
    ],
    'G': [
        '  ____ ',
        ' / ___|',
        '| |  _ ',
        '| |_| |',
        ' \\____|',
        '       '
    ],
    'H': [
        ' _   _ ',
        '| | | |',
        '| |_| |',
        '|  _  |',
        '| | | |',
        '|_| |_|'
    ],
    'I': [
        ' ___ ',
        '|_ _|',
        ' | | ',
        ' | | ',
        '|___|',
        '     '
    ],
    'J': [
        '     _ ',
        '    | |',
        ' _  | |',
        '| |_| |',
        ' \\___/ ',
        '       '
    ],
    'K': [
        ' _  __',
        '| |/ /',
        '| \' / ',
        '| . \\ ',
        '|_|\\_\\',
        '      '
    ],
    'L': [
        ' _     ',
        '| |    ',
        '| |    ',
        '| |___ ',
        '|_____|',
        '       '
    ],
    'M': [
        ' __  __ ',
        '|  \\/  |',
        '| |\\/| |',
        '| |  | |',
        '|_|  |_|',
        '        '
    ],
    'N': [
        ' _   _ ',
        '| \\ | |',
        '|  \\| |',
        '| |\\  |',
        '|_| \\_|',
        '       '
    ],
    'O': [
        '  ___  ',
        ' / _ \\ ',
        '| | | |',
        '| |_| |',
        ' \\___/ ',
        '       '
    ],
    'P': [
        ' ____  ',
        '|  _ \\ ',
        '| |_) |',
        '|  __/ ',
        '|_|    ',
        '       '
    ],
    'Q': [
        '  ___  ',
        ' / _ \\ ',
        '| | | |',
        '| |_| |',
        ' \\__\\_\\',
        '       '
    ],
    'R': [
        ' ____  ',
        '|  _ \\ ',
        '| |_) |',
        '|  _ < ',
        '|_| \\_\\',
        '       '
    ],
    'S': [
        ' ____  ',
        '/ ___| ',
        '\\___ \\ ',
        ' ___) |',
        '|____/ ',
        '       '
    ],
    'T': [
        ' _____ ',
        '|_   _|',
        '  | |  ',
        '  | |  ',
        '  |_|  ',
        '       '
    ],
    'U': [
        ' _   _ ',
        '| | | |',
        '| | | |',
        '| |_| |',
        ' \\___/ ',
        '       '
    ],
    'V': [
        '__     __',
        '\\ \\   / /',
        ' \\ \\ / / ',
        '  \\ V /  ',
        '   \\_/   ',
        '         '
    ],
    'W': [
        '__        __',
        '\\ \\      / /',
        ' \\ \\ /\\ / / ',
        '  \\ V  V /  ',
        '   \\_/\\_/   ',
        '            '
    ],
    'X': [
        '__  __',
        '\\ \\/ /',
        ' \\  / ',
        ' /  \\ ',
        '/_/\\_\\',
        '      '
    ],
    'Y': [
        '__   __',
        '\\ \\ / /',
        ' \\ V / ',
        '  | |  ',
        '  |_|  ',
        '       '
    ],
    'Z': [
        ' _____',
        '|__  /',
        '  / / ',
        ' / /_ ',
        '/____|',
        '      '
    ],
    ' ': [
        '   ',
        '   ',
        '   ',
        '   ',
        '   ',
        '   '
    ],
    '0': [
        '  ___  ',
        ' / _ \\ ',
        '| | | |',
        '| |_| |',
        ' \\___/ ',
        '       '
    ],
    '1': [
        ' _ ',
        '/ |',
        '| |',
        '| |',
        '|_|',
        '   '
    ],
    '2': [
        ' ____  ',
        '|___ \\ ',
        '  __) |',
        ' / __/ ',
        '|_____|',
        '       '
    ],
    '3': [
        ' _____ ',
        '|___ / ',
        '  |_ \\ ',
        ' ___) |',
        '|____/ ',
        '       '
    ],
    '4': [
        ' _  _   ',
        '| || |  ',
        '| || |_ ',
        '|__   _|',
        '   |_|  ',
        '        '
    ],
    '5': [
        ' ____  ',
        '| ___| ',
        '|___ \\ ',
        ' ___) |',
        '|____/ ',
        '       '
    ],
    '6': [
        '  __   ',
        ' / /_  ',
        '| \'_ \\ ',
        '| (_) |',
        ' \\___/ ',
        '       '
    ],
    '7': [
        ' _____ ',
        '|___  |',
        '   / / ',
        '  / /  ',
        ' /_/   ',
        '       '
    ],
    '8': [
        '  ___  ',
        ' ( _ ) ',
        ' / _ \\ ',
        '| (_) |',
        ' \\___/ ',
        '       '
    ],
    '9': [
        '  ___  ',
        ' / _ \\ ',
        '| (_) |',
        ' \\__, |',
        '   /_/ ',
        '       '
    ],
};

export interface FigletOptions {
    /**
     * Font to use
     */
    font?: 'standard';

    /**
     * Color function
     */
    color?: (text: string) => string;

    /**
     * Horizontal layout
     */
    horizontalLayout?: 'default' | 'fitted' | 'full';
}

/**
 * Generate ASCII art text
 */
export const figlet = (text: string, options: FigletOptions = {}): string => {
    const {
        font = 'standard',
        color = (t) => t,
        horizontalLayout = 'default',
    } = options;

    const upperText = text.toUpperCase();
    const lines: string[] = ['', '', '', '', '', ''];

    for (const char of upperText) {
        const charLines = STANDARD_FONT[char] || STANDARD_FONT[' '];

        for (let i = 0; i < 6; i++) {
            lines[i] += charLines[i];
        }
    }

    const result = lines.join('\n');
    return color(result);
};

/**
 * Create a banner with ASCII art
 */
export const banner = (text: string, options: FigletOptions & { border?: boolean } = {}): string => {
    const { border = true, ...figletOpts } = options;
    const art = figlet(text, figletOpts);

    if (!border) {
        return art;
    }

    const lines = art.split('\n');
    const maxWidth = Math.max(...lines.map(l => l.length));

    const topBorder = '═'.repeat(maxWidth + 4);
    const bottomBorder = '═'.repeat(maxWidth + 4);

    const borderedLines = lines.map(line => {
        return '║ ' + line.padEnd(maxWidth) + ' ║';
    });

    return '╔' + topBorder + '╗\n' + borderedLines.join('\n') + '\n╚' + bottomBorder + '╝';
};
