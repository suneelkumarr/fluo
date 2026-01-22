/**
 * FLUO - Interactive Prompts
 * Built-in prompts for user input
 */

import * as readline from 'readline';
import { applyStyle } from '../core/factory';
import { OPEN, CLOSE, ESC } from '../core/ansi';

export interface PromptOptions {
    /**
     * Default value
     */
    default?: string;

    /**
     * Validation function
     */
    validate?: (value: string) => boolean | string;

    /**
     * Transform input
     */
    transform?: (value: string) => string;
}

export interface SelectOptions<T = string> {
    /**
     * Choices to select from
     */
    choices: T[] | { value: T; label: string }[];

    /**
     * Default selected index
     */
    default?: number;
}

export interface ConfirmOptions {
    /**
     * Default value
     */
    default?: boolean;
}

/**
 * Create readline interface
 */
function createInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
}

/**
 * Prompt for text input
 */
export const prompt = async (message: string, options: PromptOptions = {}): Promise<string> => {
    const { default: defaultValue, validate, transform } = options;

    const rl = createInterface();

    return new Promise((resolve) => {
        const promptText = applyStyle(message, OPEN.cyan, CLOSE.cyan) +
            (defaultValue ? applyStyle(` (${defaultValue})`, OPEN.dim, CLOSE.dim) : '') +
            ': ';

        rl.question(promptText, (answer) => {
            rl.close();

            let value = answer.trim() || defaultValue || '';

            if (transform) {
                value = transform(value);
            }

            if (validate) {
                const result = validate(value);
                if (result !== true) {
                    const error = typeof result === 'string' ? result : 'Invalid input';
                    console.log(applyStyle('✗ ' + error, OPEN.red, CLOSE.red));
                    // Retry
                    resolve(prompt(message, options));
                    return;
                }
            }

            resolve(value);
        });
    });
};

/**
 * Prompt for selection from list
 */
export const select = async <T = string>(
    message: string,
    options: SelectOptions<T>
): Promise<T> => {
    const { choices, default: defaultIndex = 0 } = options;

    const items = choices.map((choice) => {
        if (typeof choice === 'object' && 'value' in choice) {
            return choice;
        }
        return { value: choice as T, label: String(choice) };
    });

    console.log(applyStyle(message, OPEN.cyan, CLOSE.cyan));

    items.forEach((item, index) => {
        const prefix = index === defaultIndex ? '❯' : ' ';
        const style = index === defaultIndex ? OPEN.cyan : '';
        const close = index === defaultIndex ? CLOSE.cyan : '';
        console.log(applyStyle(`${prefix} ${index + 1}. ${item.label}`, style, close));
    });

    const rl = createInterface();

    return new Promise((resolve) => {
        rl.question('\nSelect (1-' + items.length + '): ', (answer) => {
            rl.close();

            const index = parseInt(answer.trim()) - 1;

            if (isNaN(index) || index < 0 || index >= items.length) {
                if (answer.trim() === '') {
                    resolve(items[defaultIndex].value);
                } else {
                    console.log(applyStyle('✗ Invalid selection', OPEN.red, CLOSE.red));
                    resolve(select(message, options));
                }
            } else {
                resolve(items[index].value);
            }
        });
    });
};

/**
 * Prompt for yes/no confirmation
 */
export const confirm = async (message: string, options: ConfirmOptions = {}): Promise<boolean> => {
    const { default: defaultValue = false } = options;

    const rl = createInterface();

    const suffix = defaultValue ? ' (Y/n)' : ' (y/N)';
    const promptText = applyStyle(message + suffix, OPEN.cyan, CLOSE.cyan) + ': ';

    return new Promise((resolve) => {
        rl.question(promptText, (answer) => {
            rl.close();

            const input = answer.trim().toLowerCase();

            if (input === '') {
                resolve(defaultValue);
            } else if (input === 'y' || input === 'yes') {
                resolve(true);
            } else if (input === 'n' || input === 'no') {
                resolve(false);
            } else {
                console.log(applyStyle('✗ Please answer yes or no', OPEN.red, CLOSE.red));
                resolve(confirm(message, options));
            }
        });
    });
};

/**
 * Prompt for password (hidden input)
 */
export const password = async (message: string): Promise<string> => {
    const rl = createInterface();

    // Disable echo
    if (process.stdin.isTTY) {
        (process.stdin as any).setRawMode(true);
    }

    return new Promise((resolve) => {
        const promptText = applyStyle(message, OPEN.cyan, CLOSE.cyan) + ': ';
        process.stdout.write(promptText);

        let password = '';

        process.stdin.on('data', (char) => {
            const str = char.toString('utf8');

            if (str === '\n' || str === '\r' || str === '\r\n') {
                // Enter pressed
                process.stdout.write('\n');
                if (process.stdin.isTTY) {
                    (process.stdin as any).setRawMode(false);
                }
                process.stdin.pause();
                rl.close();
                resolve(password);
            } else if (str === '\u0003') {
                // Ctrl+C
                process.exit();
            } else if (str === '\u007f' || str === '\b') {
                // Backspace
                if (password.length > 0) {
                    password = password.slice(0, -1);
                    process.stdout.write('\b \b');
                }
            } else {
                password += str;
                process.stdout.write('*');
            }
        });
    });
};

/**
 * Prompt for multi-line input
 */
export const multiline = async (message: string): Promise<string> => {
    console.log(applyStyle(message, OPEN.cyan, CLOSE.cyan));
    console.log(applyStyle('(Press Ctrl+D when done)', OPEN.dim, CLOSE.dim));

    const rl = createInterface();
    const lines: string[] = [];

    return new Promise((resolve) => {
        rl.on('line', (line) => {
            lines.push(line);
        });

        rl.on('close', () => {
            resolve(lines.join('\n'));
        });
    });
};
