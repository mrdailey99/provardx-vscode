/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DEFAULT_PROPERTIES_FILE_CONTENT, DEFAULT_PROPS_FILE_NAME } from '../constants';
import { messages } from '../messages';

const DEFAULT_PROPS_INPUT_OPTIONS = {
    prompt: messages.create_properties_file_enter_prop_file_name,
    placeHolder: DEFAULT_PROPS_FILE_NAME,
    validateInput: (value) => {
        return /\-properties.json$/.test(value.trim()) || value === '' ? null : messages.error_enter_valid_filename;
    }
} as vscode.InputBoxOptions;

class CreatePropertiesFile {
    constructor() {}

    public async run(): Promise<void> {
        const provarHomeUri = this.getProvarHome();
        if (!fs.existsSync(provarHomeUri) || !fs.statSync(provarHomeUri).isFile) {
            vscode.window.showErrorMessage(messages.error_provar_home);
            return;
        }
        const provarProjectUri: string = await this.showFolderPicker(
            messages.create_properties_file_provar_project_folder
        );
        if (!provarProjectUri) {
            return;
        }

        let propertiesFileName: string | undefined = await this.showInputBox();
        if (propertiesFileName === undefined) {
            return;
        }
        propertiesFileName = propertiesFileName === '' ? DEFAULT_PROPS_FILE_NAME : propertiesFileName;

        const folderUri: string = await this.showFolderPicker(messages.create_properties_file_create_prop_file);
        if (!folderUri) {
            return;
        }

        propertiesFileName = await this.checkIfFileExists(folderUri, propertiesFileName);
        if (!propertiesFileName) {
            return;
        }

        await this.writePropertiesFile(provarHomeUri, provarProjectUri, folderUri, propertiesFileName);
        vscode.window.showInformationMessage(messages.create_properties_file_successMsg);
    }

    private async showInputBox(
        propertiesInputOptions: vscode.InputBoxOptions = DEFAULT_PROPS_INPUT_OPTIONS
    ): Promise<string | undefined> {
        return await vscode.window.showInputBox(propertiesInputOptions);
    }

    private async showFolderPicker(label: string): Promise<string> {
        const projectUri: vscode.Uri[] | undefined = await vscode.window.showOpenDialog({
            canSelectFiles: false,
            canSelectFolders: true,
            canSelectMany: false,
            openLabel: label
        });
        const projectLocation = projectUri && projectUri.length === 1 ? projectUri[0].fsPath : '';
        return projectLocation;
    }

    // @ts-ignore
    private async checkIfFileExists(folderUri: string, fileName: string): Promise<string | undefined> {
        const filePath: string = path.join(folderUri, fileName);

        if (!fs.existsSync(filePath)) {
            return fileName;
        }
        const overwrite = await vscode.window.showErrorMessage(
            messages.warning_prompt_dir_overwrite,
            messages.warning_prompt_overwrite,
            messages.warning_prompt_overwrite_diff_file_name,
            messages.warning_prompt_cancel
        );
        if (overwrite === messages.warning_prompt_overwrite) {
            return fileName;
        } else if (overwrite === messages.warning_prompt_overwrite_diff_file_name) {
            const propertiesInputOptions = {
                prompt: messages.create_properties_new_file_filename,
                value: fileName,
                validateInput: (value) => {
                    return value && /\-properties.json$/.test(value.trim())
                        ? null
                        : messages.error_enter_valid_filename;
                }
            } as vscode.InputBoxOptions;
            const propertiesFileName: string | undefined = await this.showInputBox(propertiesInputOptions);
            if (propertiesFileName) {
                return this.checkIfFileExists(folderUri, propertiesFileName);
            }
        }
        return;
    }

    private async writePropertiesFile(
        provarHomeUri: string,
        provarProjectUri: string,
        folderUri: string,
        fileName: string
    ): Promise<void> {
        const resultsPath = path.join(provarProjectUri, 'ANT', 'Results');

        const propertiesFileConent = DEFAULT_PROPERTIES_FILE_CONTENT.replace('{{provarHome}}', provarHomeUri)
            .replace('{{projectPath}}', provarProjectUri)
            .replace('{{resultsPath}}', resultsPath);

        const propertiesFilePath = path.join(folderUri, fileName);
        fs.writeFileSync(propertiesFilePath, propertiesFileConent);
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(folderUri));
        const document = await vscode.workspace.openTextDocument(propertiesFilePath);
        vscode.window.showTextDocument(document);
    }

    private getProvarHome(): any {
        switch (process.platform) {
            case 'darwin':
                return path.join('/Applications', 'Provar.app', 'Contents', 'Eclipse');
            case 'win32':
                return process.env.PROVAR_HOME || path.join('C:\\', 'Program Files', 'Provar');
        }
    }
}

export default async function createPropertiesFile() {
    await new CreatePropertiesFile().run();
}
