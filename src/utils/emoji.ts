/**
 * FLUO - Emoji Support
 * Named emoji shortcuts for terminal output
 */

// Common emoji mappings
export const emojiMap: Record<string, string> = {
    // Symbols
    'check': '✓',
    'cross': '✗',
    'star': '★',
    'heart': '♥',
    'diamond': '♦',
    'arrow_right': '→',
    'arrow_left': '←',
    'arrow_up': '↑',
    'arrow_down': '↓',

    // Status
    'success': '✓',
    'error': '✗',
    'warning': '⚠',
    'info': 'ℹ',
    'question': '?',

    // Common
    'rocket': '🚀',
    'fire': '🔥',
    'sparkles': '✨',
    'tada': '🎉',
    'package': '📦',
    'folder': '📁',
    'file': '📄',
    'gear': '⚙',
    'wrench': '🔧',
    'hammer': '🔨',
    'lock': '🔒',
    'unlock': '🔓',
    'key': '🔑',
    'link': '🔗',
    'search': '🔍',
    'bell': '🔔',
    'light_bulb': '💡',
    'zap': '⚡',
    'boom': '💥',
    'clock': '🕐',
    'hourglass': '⌛',
    'stopwatch': '⏱',

    // Faces
    'smile': '😊',
    'grin': '😀',
    'thinking': '🤔',
    'confused': '😕',
    'worried': '😟',
    'sad': '😢',
    'angry': '😠',
    'cool': '😎',
    'nerd': '🤓',
    'robot': '🤖',

    // Nature
    'sun': '☀',
    'moon': '🌙',
    'star_full': '⭐',
    'cloud': '☁',
    'rain': '🌧',
    'snow': '❄',
    'tree': '🌳',
    'flower': '🌸',

    // Objects
    'computer': '💻',
    'phone': '📱',
    'email': '📧',
    'calendar': '📅',
    'book': '📖',
    'pencil': '✏',
    'clipboard': '📋',
    'chart': '📊',
    'trophy': '🏆',
    'medal': '🏅',

    // Arrows & Symbols
    'up': '↑',
    'down': '↓',
    'left': '←',
    'right': '→',
    'check_box': '☑',
    'ballot_box': '☐',
    'radio_button': '◉',
    'circle': '○',
    'dot': '•',
    'bullet': '•',
    'ellipsis': '…',

    // Progress
    'hourglass_flowing': '⏳',
    'watch': '⌚',
    'timer': '⏲',
    'alarm': '⏰',

    // Development
    'bug': '🐛',
    'construction': '🚧',
    'recycle': '♻',
    'refresh': '🔄',
    'repeat': '🔁',
    'play': '▶',
    'pause': '⏸',
    'stop': '⏹',
    'eject': '⏏',

    // Math & Logic
    'plus': '+',
    'minus': '-',
    'multiply': '×',
    'divide': '÷',
    'equals': '=',
    'not_equal': '≠',
    'greater': '>',
    'less': '<',
    'infinity': '∞',

    // Misc
    'copyright': '©',
    'registered': '®',
    'trademark': '™',
    'degree': '°',
    'section': '§',
    'paragraph': '¶',
};

/**
 * Get emoji by name
 */
export const emoji = (name: string): string => {
    // Handle :emoji: syntax
    const cleanName = name.replace(/^:/, '').replace(/:$/, '');
    return emojiMap[cleanName] || name;
};

/**
 * Replace all :emoji: in text
 */
export const emojify = (text: string): string => {
    return text.replace(/:([a-z_]+):/g, (match, name) => {
        return emojiMap[name] || match;
    });
};

// Create emoji object with property access
const emojiProxy = new Proxy(emoji, {
    get(target, prop: string) {
        if (prop in emojiMap) {
            return emojiMap[prop];
        }
        return target;
    },
}) as typeof emoji & Record<string, string>;

export { emojiProxy as e };
export default emojiProxy;
