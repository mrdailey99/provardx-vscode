/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import * as fs from 'fs';
import * as sinon from 'sinon';
import { SinonStub, stub } from 'sinon';
import * as vscode from 'vscode';
import { messages } from '../../messages';
import createPropertiesFile from '../../commands/createPropertiesFile';

describe('Create Properties File', () => {
    let errorMsgStub: SinonStub;
    let fsExistSyncStub: SinonStub;
    let inputBoxSpy: SinonStub;
    let fsStatSyncStub: SinonStub;
    let showOpenDialogStub: SinonStub;
    let writeFileStub: SinonStub;
    let showInformationMessageStub: SinonStub;

    beforeEach(() => {
        errorMsgStub = stub(vscode.window, 'showErrorMessage');
        showInformationMessageStub = stub(vscode.window, 'showInformationMessage');

        fsExistSyncStub = stub(fs, 'existsSync');
        fsStatSyncStub = stub(fs, 'statSync');
        inputBoxSpy = sinon.stub(vscode.window, 'showInputBox');
        showOpenDialogStub = sinon.stub(vscode.window, 'showOpenDialog');
        writeFileStub = sinon.stub(fs, 'writeFileSync');
    });

    afterEach(() => {
        errorMsgStub.restore();
        fsExistSyncStub.restore();
        fsStatSyncStub.restore();
        inputBoxSpy.restore();
        showOpenDialogStub.restore();
        writeFileStub.restore();
        showInformationMessageStub.restore();
    });

    it('Should display error if Provar Home does not exist', async () => {
        fsExistSyncStub.returns(false);
        fsStatSyncStub.returns({ isFile: () => false });

        await createPropertiesFile();
        expect(errorMsgStub.getCall(0).args[0]).to.equal(messages.error_provar_home);
    });

    it('Should not create properties file if Provar Project folder is undefined', async () => {
        fsExistSyncStub.onCall(0).returns(true);
        fsStatSyncStub.returns({ isFile: () => false });

        showOpenDialogStub.returns(undefined);
        await createPropertiesFile();
        expect(showOpenDialogStub.calledOnce).to.be.true;
        expect(showOpenDialogStub()).to.be.undefined;
    });

    it('Should not create properties file if Properties File Name is undefined', async () => {
        fsExistSyncStub.onCall(0).returns(true);
        fsStatSyncStub.returns({ isFile: () => false });

        showOpenDialogStub.returns([vscode.Uri.parse('/somepath/provardx')]);
        inputBoxSpy.returns(undefined);
        await createPropertiesFile();
        expect(inputBoxSpy.calledOnce).to.be.true;
        expect(inputBoxSpy()).to.be.undefined;
    });

    it('Should not create properties file if Folder is undefined', async () => {
        fsExistSyncStub.onCall(0).returns(true);
        fsStatSyncStub.returns({ isFile: () => false });

        showOpenDialogStub.returns([vscode.Uri.parse('/somepath/provardx')]);
        inputBoxSpy.returns('provardx-properties.json');
        showOpenDialogStub.returns(undefined);

        await createPropertiesFile();
        expect(showOpenDialogStub.calledOnce).to.be.true;
        expect(showOpenDialogStub()).to.be.undefined;
    });

    it('Should create properties file successfully', async () => {
        fsExistSyncStub.onCall(0).returns(true);
        fsExistSyncStub.onCall(1).returns(false);

        fsStatSyncStub.returns({ isFile: () => true });
        showOpenDialogStub.returns([vscode.Uri.parse('/somepath/provardx')]);
        inputBoxSpy.returns('provardx-properties.json');
        showOpenDialogStub.returns([vscode.Uri.parse('/somepath/testfolder')]);

        const executeCommandStub = sinon.stub(vscode.commands, 'executeCommand');
        executeCommandStub.returns(Promise.resolve());

        const openTextDocumentStub = sinon.stub(vscode.workspace, 'openTextDocument');
        openTextDocumentStub.returns(Promise.resolve({} as vscode.TextDocument));

        await createPropertiesFile();
        expect(showInformationMessageStub.getCall(0).args[0]).to.equal(messages.create_properties_file_successMsg);
    }).timeout(10000);
});
