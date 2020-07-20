/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as fs from 'fs';
import * as vscode from 'vscode';
import { COMMANDS } from '../constants';
import { messages } from '../messages';
import {
    channelService,
    CommandBuilder,
    CommandExecutor,
    PreConditionChecker,
    ProgressNotification,
    PropertiesFileSelector
} from '../utils';

class Validate {
    constructor() {}

    public async run(): Promise<void> {
        const preConditionsMet = await PreConditionChecker.check();
        if (preConditionsMet) {
            let propertiesFileLocation: string | undefined = await new PropertiesFileSelector().selectPropertiesFile();
            if (!propertiesFileLocation) {
                return;
            }

            const pathExists = fs.existsSync(propertiesFileLocation);
            if (!pathExists) {
                vscode.window.showErrorMessage(messages.error_invalid_file);
                return;
            }
            const cancellationTokenSource = new vscode.CancellationTokenSource();
            const cancellationToken = cancellationTokenSource.token;

            const command = new CommandBuilder('sfdx')
                .withArg(COMMANDS.PROVARDX_VALIDATE)
                .withFlag('-p', propertiesFileLocation);

            const execution = new CommandExecutor(command, cancellationToken);
            execution.processExitSubject.subscribe(async (data) => {
                if (data !== undefined && data.toString() === '0') {
                    vscode.window.showInformationMessage(
                        `${COMMANDS.PROVARDX_VALIDATE} ${messages.notification_successful_execution_text}`
                    );
                }
            });

            execution.stderrSubject.subscribe(async (data) => {
                vscode.window.showErrorMessage(
                    `${COMMANDS.PROVARDX_VALIDATE} ${messages.notification_unsuccessful_execution_text}`
                );
            });

            ProgressNotification.show(execution, cancellationTokenSource, COMMANDS.PROVARDX_VALIDATE);
            channelService.showChannelOutput();
            channelService.streamCommandOutput(execution);
        }
    }
}

export default async function validate() {
    await new Validate().run();
}
