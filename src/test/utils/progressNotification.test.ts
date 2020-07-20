/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { CommandBuilder, CommandExecutor, ProgressNotification } from '../../utils';

// tslint:disable:no-unused-expression
describe('Progress Notification', () => {
    let tokenSource: vscode.CancellationTokenSource;
    let execution: CommandExecutor;
    beforeEach(() => {
        tokenSource = new vscode.CancellationTokenSource();
        const command = new CommandBuilder('sfdx').withArg('provar').withArg('--help');
        execution = new CommandExecutor(command, tokenSource.token);
    });

    it('Should display progress as a cancellable notification', async () => {
        const withProgressStub = sinon.stub(vscode.window, 'withProgress').returns(Promise.resolve());

        ProgressNotification.show(execution, tokenSource, execution.command.toString());

        expect(withProgressStub.called).to.be.true;
        expect(withProgressStub.getCall(0).args[0]).to.eql({
            title: `Running ${execution.command.toString()}`,
            location: vscode.ProgressLocation.Notification,
            cancellable: true
        });
        withProgressStub.restore();
    });

    it('Should display progress based on given progress location', () => {
        const progressLocation = vscode.ProgressLocation.Window;
        const withProgressStub = sinon.stub(vscode.window, 'withProgress').returns(Promise.resolve());

        ProgressNotification.show(execution, tokenSource, execution.command.toString(), progressLocation);

        expect(withProgressStub.getCall(0).args[0]).to.eql({
            title: `Running ${execution.command.toString()}`,
            location: progressLocation,
            cancellable: true
        });
        withProgressStub.restore();
    });
});
