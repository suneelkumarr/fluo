/**
 * FLUO - Markdown Renderer
 * Render markdown in terminal with colors
 */

import { applyStyle } from '../core/factory';
import { OPEN, CLOSE } from '../core/ansi';

export interface MarkdownOptions {
    /**
     * Color for headings
     */
    headingColor?: (text: string, level: number) => string;

    /**
     * Color for bold text
     */
    boldColor?: (text: string) => string;

    /**
     * Color for italic text
     */
    italicColor?: (text: string) => string;

    /**
     * Color for code
     */
    codeColor?: (text: string) => string;

    /**
     * Color for links
     */
    linkColor?: (text: string) => string;

    /**
     * Color for quotes
     */
    quoteColor?: (text: string) => string;

    /**
     * List bullet character
     */
    bullet?: string;
}

/**
 * Render markdown to colored terminal output
 */
export const markdown = (text: string, options: MarkdownOptions = {}): string => {
    const {
        headingColor = (t, level) => applyStyle(t, OPEN.bold, CLOSE.bold),
        boldColor = (t) => applyStyle(t, OPEN.bold, CLOSE.bold),
        italicColor = (t) => applyStyle(t, OPEN.italic, CLOSE.italic),
        codeColor = (t) => applyStyle(t, OPEN.inverse, CLOSE.inverse),
        linkColor = (t) => applyStyle(t, OPEN.underline + OPEN.cyan, CLOSE.cyan + CLOSE.underline),
        quoteColor = (t) => applyStyle(t, OPEN.dim, CLOSE.dim),
        bullet = '•',
    } = options;

    const lines = text.split('\n');
    const result: string[] = [];
    let inCodeBlock = false;
    let codeBlockLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Code blocks
        if (line.trim().startsWith('```')) {
            if (inCodeBlock) {
                // End code block
                result.push(codeColor(codeBlockLines.join('\n')));
                codeBlockLines = [];
                inCodeBlock = false;
            } else {
                // Start code block
                inCodeBlock = true;
            }
            continue;
        }

        if (inCodeBlock) {
            codeBlockLines.push(line);
            continue;
        }

        // Headings
        const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const text = headingMatch[2];
            result.push(headingColor(text, level));
            continue;
        }

        // Blockquotes
        if (line.trim().startsWith('>')) {
            const quoteText = line.replace(/^>\s*/, '');
            result.push('│ ' + quoteColor(quoteText));
            continue;
        }

        // Lists
        const unorderedListMatch = line.match(/^(\s*)[-*+]\s+(.+)$/);
        if (unorderedListMatch) {
            const indent = unorderedListMatch[1];
            const text = unorderedListMatch[2];
            result.push(indent + bullet + ' ' + processInlineMarkdown(text, options));
            continue;
        }

        const orderedListMatch = line.match(/^(\s*)(\d+)\.\s+(.+)$/);
        if (orderedListMatch) {
            const indent = orderedListMatch[1];
            const number = orderedListMatch[2];
            const text = orderedListMatch[3];
            result.push(indent + number + '. ' + processInlineMarkdown(text, options));
            continue;
        }

        // Horizontal rule
        if (line.match(/^[-*_]{3,}$/)) {
            result.push('─'.repeat(50));
            continue;
        }

        // Regular paragraph
        if (line.trim()) {
            result.push(processInlineMarkdown(line, options));
        } else {
            result.push('');
        }
    }

    return result.join('\n');
};

/**
 * Process inline markdown (bold, italic, code, links)
 */
function processInlineMarkdown(text: string, options: MarkdownOptions): string {
    const {
        boldColor = (t) => applyStyle(t, OPEN.bold, CLOSE.bold),
        italicColor = (t) => applyStyle(t, OPEN.italic, CLOSE.italic),
        codeColor = (t) => applyStyle(t, OPEN.inverse, CLOSE.inverse),
        linkColor = (t) => applyStyle(t, OPEN.underline + OPEN.cyan, CLOSE.cyan + CLOSE.underline),
    } = options;

    let result = text;

    // Links [text](url)
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text) => linkColor(text));

    // Inline code `code`
    result = result.replace(/`([^`]+)`/g, (_, code) => codeColor(code));

    // Bold **text** or __text__
    result = result.replace(/\*\*([^*]+)\*\*/g, (_, text) => boldColor(text));
    result = result.replace(/__([^_]+)__/g, (_, text) => boldColor(text));

    // Italic *text* or _text_
    result = result.replace(/\*([^*]+)\*/g, (_, text) => italicColor(text));
    result = result.replace(/_([^_]+)_/g, (_, text) => italicColor(text));

    return result;
}

/**
 * Simple markdown stripper (remove all markdown syntax)
 */
export const stripMarkdown = (text: string): string => {
    return text
        .replace(/```[\s\S]*?```/g, '') // Code blocks
        .replace(/`([^`]+)`/g, '$1') // Inline code
        .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
        .replace(/__([^_]+)__/g, '$1') // Bold
        .replace(/\*([^*]+)\*/g, '$1') // Italic
        .replace(/_([^_]+)_/g, '$1') // Italic
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
        .replace(/^#{1,6}\s+/gm, '') // Headings
        .replace(/^>\s*/gm, '') // Blockquotes
        .replace(/^[-*+]\s+/gm, '') // Unordered lists
        .replace(/^\d+\.\s+/gm, ''); // Ordered lists
};
