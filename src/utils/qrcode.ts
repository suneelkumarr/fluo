/**
 * FLUO - QR Code Generator
 * Generate QR codes in terminal
 */

/**
 * Simple QR code generator for terminal
 * Note: This is a basic implementation. For production use, consider a full QR library.
 */

export interface QRCodeOptions {
    /**
     * Size of each module (1-3)
     */
    size?: number;

    /**
     * Character to use for filled modules
     */
    filled?: string;

    /**
     * Character to use for empty modules
     */
    empty?: string;

    /**
     * Add border
     */
    border?: boolean;
}

/**
 * Generate a simple QR code pattern (placeholder implementation)
 * For a real implementation, you would use a proper QR encoding algorithm
 */
export const qrcode = (text: string, options: QRCodeOptions = {}): string => {
    const {
        size = 1,
        filled = '██',
        empty = '  ',
        border = true,
    } = options;

    // This is a simplified placeholder that creates a pattern
    // A real implementation would use Reed-Solomon error correction and QR encoding

    const moduleSize = 21; // Standard QR code size for version 1
    const pattern: boolean[][] = Array(moduleSize).fill(null).map(() => Array(moduleSize).fill(false));

    // Create finder patterns (corners)
    const createFinderPattern = (row: number, col: number) => {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
                    if (row + i < moduleSize && col + j < moduleSize) {
                        pattern[row + i][col + j] = true;
                    }
                }
            }
        }
    };

    // Top-left
    createFinderPattern(0, 0);
    // Top-right
    createFinderPattern(0, moduleSize - 7);
    // Bottom-left
    createFinderPattern(moduleSize - 7, 0);

    // Timing patterns
    for (let i = 8; i < moduleSize - 8; i++) {
        pattern[6][i] = i % 2 === 0;
        pattern[i][6] = i % 2 === 0;
    }

    // Add some data pattern based on text (simplified)
    const textHash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    for (let i = 8; i < moduleSize - 8; i++) {
        for (let j = 8; j < moduleSize - 8; j++) {
            pattern[i][j] = ((i + j + textHash) % 3) === 0;
        }
    }

    // Render pattern
    const lines: string[] = [];

    if (border) {
        const borderLine = filled.repeat((moduleSize + 2) * size);
        lines.push(borderLine);
    }

    for (let row = 0; row < moduleSize; row++) {
        let line = border ? filled : '';

        for (let col = 0; col < moduleSize; col++) {
            const char = pattern[row][col] ? filled : empty;
            line += char.repeat(size);
        }

        if (border) {
            line += filled;
        }

        // Repeat line for vertical size
        for (let s = 0; s < size; s++) {
            lines.push(line);
        }
    }

    if (border) {
        const borderLine = filled.repeat((moduleSize + 2) * size);
        lines.push(borderLine);
    }

    return lines.join('\n');
};

/**
 * Generate a simple text-based QR code representation
 */
export const qrcodeText = (text: string): string => {
    return qrcode(text, {
        size: 1,
        filled: '█',
        empty: ' ',
        border: true,
    });
};

/**
 * Generate QR code with URL
 */
export const qrcodeURL = (url: string): string => {
    return qrcode(url, {
        size: 1,
        filled: '██',
        empty: '  ',
        border: true,
    });
};
