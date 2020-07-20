/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import * as process from 'child_process';
import { COMMANDS, PROVARDX_GITHUB_URL, PLUGIN_NAME } from '../constants';
import { messages } from '../messages';

export class PreConditionChecker {
    public static check(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            process.exec(COMMANDS.PLUGINS, null, async (err, stdout, stderr) => {
                if (err) {
                    err.message.indexOf(messages.error_mac_sfdx_comand_not_found) > -1 ||
                    err.message.indexOf(messages.error_win32_sfdx_comand_not_found) > -1
                        ? vscode.window.showErrorMessage(messages.error_sfdx_plugin_not_installed)
                        : vscode.window.showErrorMessage(`${messages.error} ${err.message}`);
                    console.error(`${messages.error} ${err}`);
                    return reject(false);
                }
                const response = stdout.toString().trim();
                if (response === messages.error_no_plugins_installed || response.indexOf(PLUGIN_NAME) === -1) {
                    const overwrite = await vscode.window.showErrorMessage(
                        messages.warning_prompt_provardx_plugin_not_installed,
                        messages.warning_prompt_continue,
                        messages.warning_prompt_cancel
                    );
                    if (overwrite === messages.warning_prompt_continue) {
                        vscode.env.openExternal(vscode.Uri.parse(PROVARDX_GITHUB_URL));
                        return reject(false);
                    } else {
                        return reject(false);
                    }
                }
                return resolve(true);
            });
        });
    }
}
