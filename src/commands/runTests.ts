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
const kill = require('tree-kill');

class RunTests {
    constructor() {}

    public async run() {
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
                .withArg(COMMANDS.PROVARDX_RUN_TESTS)
                .withFlag('-p', propertiesFileLocation);

            const execution = new CommandExecutor(command, cancellationToken);

            execution.processExitSubject.subscribe(async (data) => {
                if (data !== undefined && data.toString() === '0') {
                    vscode.window.showInformationMessage(
                        `${COMMANDS.PROVARDX_RUN_TESTS} ${messages.notification_successful_execution_text}`
                    );
                }
            });

            ProgressNotification.show(execution, cancellationTokenSource, COMMANDS.PROVARDX_RUN_TESTS);
            channelService.showChannelOutput();
            channelService.streamCommandOutput(execution);
        }
    }

    public async killExecution(childProcessPid: any, signal: string = 'SIGKILL') {
        return killPromise(childProcessPid, signal);
    }
}

async function killPromise(processId: number, signal: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        kill(processId, signal, (err: {}) => {
            err ? reject(err) : resolve();
        });
    });
}

export default async function runTests() {
    await new RunTests().run();
}
