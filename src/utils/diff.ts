/**
 * FLUO - Diff Viewer
 * Display git-style diffs with colors
 */

import { applyStyle } from '../core/factory';
import { OPEN, CLOSE } from '../core/ansi';

export interface DiffOptions {
    /**
     * Context lines to show
     */
    context?: number;

    /**
     * Show line numbers
     */
    showLineNumbers?: boolean;

    /**
     * Color for added lines
     */
    addedColor?: (text: string) => string;

    /**
     * Color for removed lines
     */
    removedColor?: (text: string) => string;

    /**
     * Color for context lines
     */
    contextColor?: (text: string) => string;

    /**
     * Color for line numbers
     */
    lineNumberColor?: (text: string) => string;
}

interface DiffLine {
    type: 'add' | 'remove' | 'context';
    content: string;
    oldLine?: number;
    newLine?: number;
}

/**
 * Generate diff between two texts
 */
export const diff = (oldText: string, newText: string, options: DiffOptions = {}): string => {
    const {
        context = 3,
        showLineNumbers = true,
        addedColor = (t) => applyStyle(t, OPEN.green, CLOSE.green),
        removedColor = (t) => applyStyle(t, OPEN.red, CLOSE.red),
        contextColor = (t) => t,
        lineNumberColor = (t) => applyStyle(t, OPEN.dim, CLOSE.dim),
    } = options;

    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');

    const diffLines = computeDiff(oldLines, newLines);
    const result: string[] = [];

    // Group changes with context
    const groups = groupDiffLines(diffLines, context);

    for (const group of groups) {
        for (const line of group) {
            let prefix = ' ';
            let color = contextColor;

            if (line.type === 'add') {
                prefix = '+';
                color = addedColor;
            } else if (line.type === 'remove') {
                prefix = '-';
                color = removedColor;
            }

            let lineStr = prefix + ' ' + line.content;

            if (showLineNumbers) {
                const oldNum = line.oldLine !== undefined ? String(line.oldLine).padStart(4) : '    ';
                const newNum = line.newLine !== undefined ? String(line.newLine).padStart(4) : '    ';
                lineStr = lineNumberColor(oldNum + ' ' + newNum) + ' ' + lineStr;
            }

            result.push(color(lineStr));
        }

        if (group !== groups[groups.length - 1]) {
            result.push(lineNumberColor('...'));
        }
    }

    return result.join('\n');
};

/**
 * Simple diff algorithm (Myers' diff)
 */
function computeDiff(oldLines: string[], newLines: string[]): DiffLine[] {
    const result: DiffLine[] = [];
    let oldIndex = 0;
    let newIndex = 0;

    while (oldIndex < oldLines.length || newIndex < newLines.length) {
        if (oldIndex >= oldLines.length) {
            // Only new lines left
            result.push({
                type: 'add',
                content: newLines[newIndex],
                newLine: newIndex + 1,
            });
            newIndex++;
        } else if (newIndex >= newLines.length) {
            // Only old lines left
            result.push({
                type: 'remove',
                content: oldLines[oldIndex],
                oldLine: oldIndex + 1,
            });
            oldIndex++;
        } else if (oldLines[oldIndex] === newLines[newIndex]) {
            // Lines match
            result.push({
                type: 'context',
                content: oldLines[oldIndex],
                oldLine: oldIndex + 1,
                newLine: newIndex + 1,
            });
            oldIndex++;
            newIndex++;
        } else {
            // Lines differ - look ahead to find next match
            const lookAhead = 5;
            let foundMatch = false;

            // Check if old line was removed
            for (let i = 1; i <= lookAhead && newIndex + i < newLines.length; i++) {
                if (oldLines[oldIndex] === newLines[newIndex + i]) {
                    // Old line appears later in new, so lines were added
                    for (let j = 0; j < i; j++) {
                        result.push({
                            type: 'add',
                            content: newLines[newIndex + j],
                            newLine: newIndex + j + 1,
                        });
                    }
                    newIndex += i;
                    foundMatch = true;
                    break;
                }
            }

            if (!foundMatch) {
                // Check if new line was added
                for (let i = 1; i <= lookAhead && oldIndex + i < oldLines.length; i++) {
                    if (oldLines[oldIndex + i] === newLines[newIndex]) {
                        // New line appears later in old, so lines were removed
                        for (let j = 0; j < i; j++) {
                            result.push({
                                type: 'remove',
                                content: oldLines[oldIndex + j],
                                oldLine: oldIndex + j + 1,
                            });
                        }
                        oldIndex += i;
                        foundMatch = true;
                        break;
                    }
                }
            }

            if (!foundMatch) {
                // No match found, treat as remove + add
                result.push({
                    type: 'remove',
                    content: oldLines[oldIndex],
                    oldLine: oldIndex + 1,
                });
                result.push({
                    type: 'add',
                    content: newLines[newIndex],
                    newLine: newIndex + 1,
                });
                oldIndex++;
                newIndex++;
            }
        }
    }

    return result;
}

/**
 * Group diff lines with context
 */
function groupDiffLines(lines: DiffLine[], context: number): DiffLine[][] {
    const groups: DiffLine[][] = [];
    let currentGroup: DiffLine[] = [];
    let lastChangeIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.type !== 'context') {
            // This is a change
            lastChangeIndex = i;

            // Add context before if starting new group
            if (currentGroup.length === 0) {
                const start = Math.max(0, i - context);
                for (let j = start; j < i; j++) {
                    currentGroup.push(lines[j]);
                }
            }

            currentGroup.push(line);
        } else if (lastChangeIndex >= 0 && i - lastChangeIndex <= context) {
            // Context line within range of last change
            currentGroup.push(line);
        } else if (currentGroup.length > 0) {
            // End current group
            groups.push(currentGroup);
            currentGroup = [];
            lastChangeIndex = -1;
        }
    }

    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }

    return groups.length > 0 ? groups : [lines];
}

/**
 * Create a unified diff string (like git diff)
 */
export const unifiedDiff = (
    oldText: string,
    newText: string,
    oldFile: string = 'a/file',
    newFile: string = 'b/file'
): string => {
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');

    const result: string[] = [];
    result.push(`--- ${oldFile}`);
    result.push(`+++ ${newFile}`);

    const diffLines = computeDiff(oldLines, newLines);

    // Simple unified format
    for (const line of diffLines) {
        if (line.type === 'add') {
            result.push('+' + line.content);
        } else if (line.type === 'remove') {
            result.push('-' + line.content);
        } else {
            result.push(' ' + line.content);
        }
    }

    return result.join('\n');
};
