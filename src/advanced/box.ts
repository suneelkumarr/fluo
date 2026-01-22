/**
 * BLITZ - Box Drawing
 * Create styled boxes around text
 */

import { fluo } from '../core/factory';
import type { BoxOptions, BoxBorderStyle } from '../types';

// Box drawing characters
const BORDERS = {
  single: {
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '─',
    vertical: '│',
  },
  double: {
    topLeft: '╔',
    topRight: '╗',
    bottomLeft: '╚',
    bottomRight: '╝',
    horizontal: '═',
    vertical: '║',
  },
  round: {
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    horizontal: '─',
    vertical: '│',
  },
  bold: {
    topLeft: '┏',
    topRight: '┓',
    bottomLeft: '┗',
    bottomRight: '┛',
    horizontal: '━',
    vertical: '┃',
  },
  singleDouble: {
    topLeft: '╓',
    topRight: '╖',
    bottomLeft: '╙',
    bottomRight: '╜',
    horizontal: '─',
    vertical: '║',
  },
  doubleSingle: {
    topLeft: '╒',
    topRight: '╕',
    bottomLeft: '╘',
    bottomRight: '╛',
    horizontal: '═',
    vertical: '│',
  },
  classic: {
    topLeft: '+',
    topRight: '+',
    bottomLeft: '+',
    bottomRight: '+',
    horizontal: '-',
    vertical: '|',
  },
  arrow: {
    topLeft: '↘',
    topRight: '↙',
    bottomLeft: '↗',
    bottomRight: '↖',
    horizontal: '─',
    vertical: '│',
  },
  none: {
    topLeft: ' ',
    topRight: ' ',
    bottomLeft: ' ',
    bottomRight: ' ',
    horizontal: ' ',
    vertical: ' ',
  },
};

/**
 * Strip ANSI codes for width calculation
 */
const stripAnsi = (str: string): string => str.replace(/\x1b\[[0-9;]*m/g, '');

/**
 * Get visible length of string (without ANSI codes)
 */
const visibleLength = (str: string): number => stripAnsi(str).length;

/**
 * Pad string to width while preserving ANSI codes
 */
const padString = (str: string, width: number, align: 'left' | 'center' | 'right' = 'left'): string => {
  const visible = visibleLength(str);
  if (visible >= width) return str;
  
  const padding = width - visible;
  
  switch (align) {
    case 'center': {
      const left = Math.floor(padding / 2);
      const right = padding - left;
      return ' '.repeat(left) + str + ' '.repeat(right);
    }
    case 'right':
      return ' '.repeat(padding) + str;
    default:
      return str + ' '.repeat(padding);
  }
};

/**
 * Normalize padding value
 */
const normalizePadding = (
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number }
): { top: number; right: number; bottom: number; left: number } => {
  if (typeof padding === 'number') {
    return { top: padding, right: padding, bottom: padding, left: padding };
  }
  return {
    top: padding?.top ?? 0,
    right: padding?.right ?? 1,
    bottom: padding?.bottom ?? 0,
    left: padding?.left ?? 1,
  };
};

/**
 * Create a box around text
 */
export const box = (content: string, options: BoxOptions = {}): string => {
  const {
    borderStyle = 'single',
    borderColor,
    backgroundColor,
    title,
    titleAlignment = 'left',
    textAlignment = 'left',
    width: customWidth,
    float,
  } = options;
  
  const padding = normalizePadding(options.padding);
  const margin = normalizePadding(options.margin);
  // @ts-ignore
  const border = BORDERS[borderStyle] || BORDERS.single;
  
  // Split content into lines
  const lines = content.split('\n');
  
  // Calculate content width
  const maxLineWidth = Math.max(...lines.map(visibleLength));
  const contentWidth = customWidth 
    ? customWidth - 2 - padding.left - padding.right 
    : maxLineWidth;
  const totalWidth = contentWidth + padding.left + padding.right;
  
  // Apply border color
  const colorBorder = (str: string) => 
    borderColor ? fluo.hex(borderColor)(str) : str;
  
  // Apply background color
  const colorBg = (str: string) =>
    backgroundColor ? fluo.bgHex(backgroundColor)(str) : str;
  
  // Build the box
  const result: string[] = [];
  
  // Top margin
  for (let i = 0; i < margin.top; i++) {
    result.push('');
  }
  
  // Top border with optional title
  let topBorder = border.horizontal.repeat(totalWidth);
  if (title) {
    const titleStr = ` ${title} `;
    const titlePad = titleAlignment === 'center'
      ? Math.floor((totalWidth - titleStr.length) / 2)
      : titleAlignment === 'right'
        ? totalWidth - titleStr.length - 1
        : 1;
    topBorder = topBorder.substring(0, titlePad) + titleStr + topBorder.substring(titlePad + titleStr.length);
  }
  result.push(
    ' '.repeat(margin.left) +
    colorBorder(border.topLeft + topBorder + border.topRight)
  );
  
  // Top padding
  for (let i = 0; i < padding.top; i++) {
    result.push(
      ' '.repeat(margin.left) +
      colorBorder(border.vertical) +
      colorBg(' '.repeat(totalWidth)) +
      colorBorder(border.vertical)
    );
  }
  
  // Content lines
  for (const line of lines) {
    const paddedLine = padString(line, contentWidth, textAlignment);
    result.push(
      ' '.repeat(margin.left) +
      colorBorder(border.vertical) +
      colorBg(' '.repeat(padding.left) + paddedLine + ' '.repeat(padding.right)) +
      colorBorder(border.vertical)
    );
  }
  
  // Bottom padding
  for (let i = 0; i < padding.bottom; i++) {
    result.push(
      ' '.repeat(margin.left) +
      colorBorder(border.vertical) +
      colorBg(' '.repeat(totalWidth)) +
      colorBorder(border.vertical)
    );
  }
  
  // Bottom border
  result.push(
    ' '.repeat(margin.left) +
    colorBorder(
      border.bottomLeft +
      border.horizontal.repeat(totalWidth) +
      border.bottomRight
    )
  );
  
  // Bottom margin
  for (let i = 0; i < margin.bottom; i++) {
    result.push('');
  }
  
  // Handle float
  if (float === 'center') {
    const termWidth = process.stdout?.columns ?? 80;
    const boxWidth = totalWidth + 2 + margin.left + margin.right;
    const leftPad = Math.max(0, Math.floor((termWidth - boxWidth) / 2));
    return result.map(line => ' '.repeat(leftPad) + line).join('\n');
  }
  
  if (float === 'right') {
    const termWidth = process.stdout?.columns ?? 80;
    const boxWidth = totalWidth + 2 + margin.left + margin.right;
    const leftPad = Math.max(0, termWidth - boxWidth);
    return result.map(line => ' '.repeat(leftPad) + line).join('\n');
  }
  
  return result.join('\n');
};

/**
 * Create a simple frame around text
 */
export const frame = (text: string, style: keyof typeof BORDERS = 'single'): string => {
  return box(text, { borderStyle: style as BoxBorderStyle });
};
