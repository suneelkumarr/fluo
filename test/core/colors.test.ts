
import { describe, it, expect } from 'vitest';
import { 
  hexToRgb, 
  rgbToHex, 
  hslToRgb, 
  rgbToHsl, 
  rgbToAnsi256,
  ansi256ToRgb,
  interpolateRgb,
  getContrastColor,
  lighten,
  darken,
} from '../../src/core/colors';

describe('Color Utilities', () => {
  describe('Hex <-> RGB', () => {
    it('should convert hex to rgb', () => {
      expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
      expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
      expect(hexToRgb('#ff0000')).toEqual([255, 0, 0]);
      expect(hexToRgb('#00ff00')).toEqual([0, 255, 0]);
      expect(hexToRgb('#0000ff')).toEqual([0, 0, 255]);
    });

    it('should handle shorthand hex', () => {
      expect(hexToRgb('#000')).toEqual([0, 0, 0]);
      expect(hexToRgb('#fff')).toEqual([255, 255, 255]);
      expect(hexToRgb('#f00')).toEqual([255, 0, 0]);
    });

    it('should handle hex without hash', () => {
      expect(hexToRgb('ffffff')).toEqual([255, 255, 255]);
      expect(hexToRgb('f00')).toEqual([255, 0, 0]);
    });

    it('should convert rgb to hex', () => {
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
    });
  });

  describe('HSL <-> RGB', () => {
    it('should convert hsl to rgb', () => {
      expect(hslToRgb(0, 0, 0)).toEqual([0, 0, 0]); // Black
      expect(hslToRgb(0, 0, 100)).toEqual([255, 255, 255]); // White
      expect(hslToRgb(0, 100, 50)).toEqual([255, 0, 0]); // Red
      expect(hslToRgb(120, 100, 50)).toEqual([0, 255, 0]); // Green
      expect(hslToRgb(240, 100, 50)).toEqual([0, 0, 255]); // Blue
    });

    it('should convert rgb to hsl', () => {
      expect(rgbToHsl(0, 0, 0)).toEqual([0, 0, 0]);
      expect(rgbToHsl(255, 255, 255)).toEqual([0, 0, 100]);
      expect(rgbToHsl(255, 0, 0)).toEqual([0, 100, 50]);
    });
  });

  describe('ANSI 256', () => {
    it('should convert rgb to ansi 256 code', () => {
      expect(rgbToAnsi256(0, 0, 0)).toBe(16);
      expect(rgbToAnsi256(255, 0, 0)).toBe(196);
      expect(rgbToAnsi256(0, 255, 0)).toBe(46);
      expect(rgbToAnsi256(0, 0, 255)).toBe(21);
    });

    it('should convert ansi 256 code to rgb', () => {
      expect(ansi256ToRgb(16)).toEqual([0, 0, 0]);
      expect(ansi256ToRgb(196)).toEqual([255, 0, 0]);
    });

    it('should handle standard colors (0-15)', () => {
      expect(ansi256ToRgb(0)).toEqual([0, 0, 0]);
      expect(ansi256ToRgb(1)).toEqual([128, 0, 0]);
      expect(ansi256ToRgb(15)).toEqual([255, 255, 255]);
    });

    it('should handle grayscale range (232-255)', () => {
      expect(ansi256ToRgb(232)).toEqual([8, 8, 8]);
      expect(ansi256ToRgb(255)).toEqual([238, 238, 238]);
    });
  });

  describe('Interpolation', () => {
    it('should interpolate rgb colors', () => {
      const start: [number, number, number] = [0, 0, 0];
      const end: [number, number, number] = [100, 100, 100];
      expect(interpolateRgb(start, end, 0.5)).toEqual([50, 50, 50]);
      expect(interpolateRgb(start, end, 0)).toEqual([0, 0, 0]);
      expect(interpolateRgb(start, end, 1)).toEqual([100, 100, 100]);
    });
  });

  describe('Manipulation', () => {
    it('should get contrast color', () => {
      expect(getContrastColor(0, 0, 0)).toBe('white');
      expect(getContrastColor(255, 255, 255)).toBe('black');
    });

    it('should lighten color', () => {
      const red: [number, number, number] = [255, 0, 0]; // HSL: 0, 100, 50
      // Lighten by 25% -> HSL: 0, 100, 75 -> RGB: 255, 128, 128
      expect(lighten(red, 25)).toEqual([255, 128, 128]);
    });

    it('should darken color', () => {
      const red: [number, number, number] = [255, 0, 0]; // HSL: 0, 100, 50
      // Darken by 25% -> HSL: 0, 100, 25 -> RGB: 128, 0, 0
      expect(darken(red, 25)).toEqual([128, 0, 0]);
    });
  });
});
