/**
 * FLUO - Tree View
 * Display hierarchical data as a tree structure
 */

export interface TreeNode {
    name: string;
    children?: TreeNode[];
    [key: string]: unknown;
}

export interface TreeOptions {
    /**
     * Color function for nodes
     */
    color?: (node: TreeNode, depth: number) => string;

    /**
     * Show icons
     */
    icons?: boolean;

    /**
     * Custom icon for folders
     */
    folderIcon?: string;

    /**
     * Custom icon for files
     */
    fileIcon?: string;

    /**
     * Indent size
     */
    indent?: number;
}

const DEFAULT_ICONS = {
    folder: '📁',
    file: '📄',
    branch: '├──',
    lastBranch: '└──',
    vertical: '│',
    space: '   ',
};

/**
 * Render a tree structure
 */
export const tree = (node: TreeNode | TreeNode[], options: TreeOptions = {}): string => {
    const {
        color = (n) => n.name,
        icons = true,
        folderIcon = DEFAULT_ICONS.folder,
        fileIcon = DEFAULT_ICONS.file,
        indent = 0,
    } = options;

    const lines: string[] = [];

    const renderNode = (
        node: TreeNode,
        prefix: string = '',
        isLast: boolean = true,
        depth: number = 0
    ) => {
        const hasChildren = node.children && node.children.length > 0;
        const icon = icons ? (hasChildren ? folderIcon : fileIcon) + ' ' : '';
        const branch = depth === 0 ? '' : (isLast ? DEFAULT_ICONS.lastBranch : DEFAULT_ICONS.branch) + ' ';
        const name = typeof color === 'function' ? color(node, depth) : node.name;

        lines.push(prefix + branch + icon + name);

        if (hasChildren) {
            const childPrefix = prefix + (depth === 0 ? '' : (isLast ? DEFAULT_ICONS.space : DEFAULT_ICONS.vertical + '  '));

            node.children!.forEach((child, index) => {
                const isLastChild = index === node.children!.length - 1;
                renderNode(child, childPrefix, isLastChild, depth + 1);
            });
        }
    };

    if (Array.isArray(node)) {
        node.forEach((n, i) => {
            renderNode(n, '', i === node.length - 1, 0);
        });
    } else {
        renderNode(node, '', true, 0);
    }

    return lines.join('\n');
};

/**
 * Create a simple ASCII tree (no icons)
 */
export const asciiTree = (node: TreeNode | TreeNode[], options: Omit<TreeOptions, 'icons'> = {}): string => {
    return tree(node, { ...options, icons: false });
};
