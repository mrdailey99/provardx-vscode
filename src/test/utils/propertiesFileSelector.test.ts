/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { messages } from '../../messages';
import { PropertiesFileSelector } from '../../utils';

describe('Properties File Selector', () => {
    let choiceQuickPickStub: sinon.SinonStub;
    let fileFinderStub: sinon.SinonStub;
    let showOpenDialogStub: sinon.SinonStub;

    describe('From Workspace', () => {
        before(() => {
            choiceQuickPickStub = sinon.stub(vscode.window, 'showQuickPick');
            choiceQuickPickStub.onCall(0).returns(messages.props_file_selector_from_workspace);
            choiceQuickPickStub.onCall(1).returns({
                label: 'provardx-properties.json',
                description: '/somepath/provardx-properties.json'
            });
            choiceQuickPickStub.onCall(2).returns(messages.props_file_selector_from_workspace);
            choiceQuickPickStub.onCall(3).returns(undefined);

            fileFinderStub = sinon.stub(vscode.workspace, 'findFiles');
            fileFinderStub.onCall(0).returns([vscode.Uri.file('/somepath/provardx-properties.json')]);
            fileFinderStub.onCall(1).returns([vscode.Uri.file('/somepath/provardx-properties.json')]);
        });

        after(() => {
            choiceQuickPickStub.restore();
            fileFinderStub.restore();
        });

        it('Should return properties file name if file has been selected', async () => {
            const response = await new PropertiesFileSelector().selectPropertiesFile();
            expect(response, '/somepath/provardx-properties.json');
        });

        it('Should return undefined if no file has been selected', async () => {
            const response = await new PropertiesFileSelector().selectPropertiesFile();
            expect(response, undefined);
        });
    });

    describe('Other Folder', () => {
        before(() => {
            choiceQuickPickStub = sinon.stub(vscode.window, 'showQuickPick');
            choiceQuickPickStub.onCall(0).returns(messages.props_file_selector_from_other_location);
            choiceQuickPickStub.onCall(1).returns(messages.props_file_selector_from_other_location);

            showOpenDialogStub = sinon.stub(vscode.window, 'showOpenDialog');
            showOpenDialogStub.onCall(0).returns(vscode.Uri.parse('/somepath/provardx-properties.json'));
            showOpenDialogStub.onCall(1).returns(undefined);
        });

        after(() => {
            choiceQuickPickStub.restore();
            fileFinderStub.restore();
        });

        it('Should return properties file name if file has been selected', async () => {
            const response = await new PropertiesFileSelector().selectPropertiesFile();
            expect(response, '/somepath/provardx-properties.json');
        });

        it('Should return undefined if no file has been selected', async () => {
            const response = await new PropertiesFileSelector().selectPropertiesFile();
            expect(response, undefined);
        });
    });
});
