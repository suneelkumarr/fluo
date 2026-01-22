/**
 * FLUO - Instance Creation API
 * Create isolated fluo instances with custom settings
 */

import { createBuilder } from './factory';
import type { ColorLevel, Styler } from '../types';

export interface FluoOptions {
    /**
     * Color level (0-3)
     */
    level?: ColorLevel;

    /**
     * Enable/disable colors
     */
    enabled?: boolean;
}

/**
 * Fluo class for creating isolated instances
 */
export class Fluo {
    private _level: ColorLevel;
    private _enabled: boolean;
    public instance: Styler;

    constructor(options: FluoOptions = {}) {
        this._level = options.level ?? 3;
        this._enabled = options.enabled ?? true;

        // Create isolated instance
        this.instance = createBuilder();
    }

    get level(): ColorLevel {
        return this._level;
    }

    set level(value: ColorLevel) {
        this._level = value;
    }

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        this._enabled = value;
    }
}

/**
 * Create a new Fluo instance
 */
export const createInstance = (options: FluoOptions = {}): Styler => {
    const instance = new Fluo(options);
    return instance.instance;
};
