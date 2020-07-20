/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { messages } from '../messages';

export class PropertiesFileSelector {
    constructor() {}

    public async selectPropertiesFile() {
        let propertiesFileLocation: string | undefined;
        const options = [messages.props_file_selector_from_workspace, messages.props_file_selector_from_other_location];
        const choice = await vscode.window.showQuickPick(options);
        switch (choice) {
            case options[0]:
                propertiesFileLocation = await this.getPropertiesFileFromWorkspace();
                break;
            case options[1]:
                propertiesFileLocation = await this.getPropertiesFileFromFolder();
                break;
        }
        return propertiesFileLocation;
    }

    private async getPropertiesFileFromWorkspace() {
        if (vscode.workspace && vscode.workspace.workspaceFolders) {
            const files = await vscode.workspace.findFiles('*-properties.json');
            const fileItems = files.map((file) => {
                return {
                    label: path.basename(file.toString()),
                    description: file.fsPath
                };
            });

            if (!fileItems.length) {
                vscode.window.showErrorMessage(messages.error_provardx_props_file_not_found);
                return;
            } else {
                const selection = await vscode.window.showQuickPick(fileItems, {
                    placeHolder: messages.props_file_selector_select_properties_file
                });
                if (!selection) {
                    return;
                }
                return selection.description.toString();
            }
        }
    }

    private async getPropertiesFileFromFolder() {
        const propertiesFileUri = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            openLabel: messages.validate_select_file,
            filters: {
                'Properties File': ['json']
            }
        });
        if (!propertiesFileUri || !propertiesFileUri.length) {
            return;
        }
        const propertiesFilePath = propertiesFileUri[0].fsPath;
        const document = await vscode.workspace.openTextDocument(propertiesFilePath);
        vscode.window.showTextDocument(document);
        return propertiesFilePath;
    }
}
