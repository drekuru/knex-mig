import chalk from 'chalk';
import { cleanFileName, Colors, pp } from '../utils';
import { EnvManager } from './env.manager';
import { existsSync, lstatSync, readdirSync } from 'fs';
import { SeedNode } from '../types';
import path from 'path';

export class SeedManager {
    private static tree: SeedNode;
    private static fileCount: number = 0;

    static initFileTree(): void {
        if (!this.tree) {
            // build the tree
            const pathToSeeds = EnvManager.get().SEED_DIR;

            if (!pathToSeeds || !existsSync(pathToSeeds)) {
                pp.error(`Seed directory not found at ${chalk.redBright(pathToSeeds)}`);
                process.exit(1);
            }

            this.tree = this.buildTree(pathToSeeds);
        }
    }

    static printTree(rootNode?: SeedNode): void {
        this.initFileTree();

        if (!rootNode) {
            rootNode = this.tree;
        }

        pp.info('Seed Dir:');
        this.printNode(rootNode, 0, true);
    }

    // this was generated by chatgpt
    private static printNode(node: SeedNode, depth: number, isLast: boolean, prefix: string = ''): void {
        const connector = isLast ? '└── ' : '├── ';
        const newPrefix = prefix + (isLast ? '    ' : '│   ');

        if (node.isFile) {
            pp.info(`${prefix}${connector}${node.index} - ${node.name}`);
        } else {
            pp.info(`${prefix}${connector}${Colors.orange(node.name)}`);

            const children = Array.from(node.children?.values() || []);
            children.forEach((child, index) => {
                const isLastChild = index === children.length - 1;
                this.printNode(child, depth + 1, isLastChild, newPrefix);
            });
        }
    }

    // recursive function to build the tree
    private static buildTree(nodePath: string): SeedNode {
        const stats = lstatSync(nodePath);
        const name = path.basename(nodePath);

        if (stats.isDirectory()) {
            const node: SeedNode = {
                fullPath: nodePath,
                name,
                children: new Map(),
                isFile: false
            };

            const files = readdirSync(nodePath);

            for (const file of files) {
                const childPath = `${nodePath}/${file}`;
                const childNode = this.buildTree(childPath);

                node.children?.set(childNode.name, childNode);
            }

            return node;
        } else {
            const node: SeedNode = {
                fullPath: nodePath,
                name: cleanFileName(name),
                isFile: true,
                type: path.extname(name),
                index: ++this.fileCount
            };

            return node;
        }
    }

    public static getFile(filepath: string): SeedNode | undefined {
        this.initFileTree();

        const parts = filepath.split('/');
        let currentNode = this.tree;

        for (const part of parts) {
            const child = currentNode.children?.get(part);

            if (!child) {
                return undefined;
            }

            currentNode = child;
        }

        return currentNode;
    }
}