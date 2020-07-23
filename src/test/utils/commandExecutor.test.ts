/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import * as vscode from 'vscode';
import { CommandBuilder, CommandExecutor } from '../../utils';

describe('CommandExecutor tests', () => {
    let tokenSource: vscode.CancellationTokenSource = new vscode.CancellationTokenSource();
    it('Should pipe stdout', async () => {
        const command = new CommandBuilder('sfdx').withArg('provar').withArg('--help');
        const execution = new CommandExecutor(command, tokenSource.token);

        let stdout = '';
        execution.stdoutSubject.subscribe((data) => (stdout += data.toString()));
        let stderr = '';
        execution.stderrSubject.subscribe((data) => (stderr += data.toString()));
        const exitCode = await new Promise<string>((resolve, reject) => {
            execution.processExitSubject.subscribe(
                (data) => {
                    resolve(data !== undefined ? data.toString() : '');
                },
                (err) => {
                    reject(err);
                }
            );
        });

        expect(exitCode).to.equal('0,');
        expect(stdout).to.contain('USAGE\n  $ sfdx provar');
        expect(stderr).to.contain('');
    }).timeout(10000);
});
