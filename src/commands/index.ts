/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import createPropertiesFile from './createPropertiesFile';
import validate from './validate';
import runTests from './runTests';

const { registerCommand } = vscode.commands;

export default {
    /**
     * Registers all plugin related commands
     *
     * @returns {vscode.Disposable[]}
     */
    register(): vscode.Disposable[] {
        return [
            registerCommand('provardx-vscode.createPropertiesFile', createPropertiesFile),
            registerCommand('provardx-vscode.validate', validate),
            registerCommand('provardx-vscode.runTests', runTests)
        ];
    }
};
