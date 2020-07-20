/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';
import * as fs from 'fs';
import * as process from 'child_process';
import * as sinon from 'sinon';
import * as vscode from 'vscode';
import { SinonStub, stub } from 'sinon';
import { PreConditionChecker, PropertiesFileSelector } from '../../utils';
import validate from '../../commands/validate';
import { messages } from '../../messages';

describe('Validate Properties File', () => {
    let execStub: SinonStub;
    let propertiesFileStub: SinonStub;
    let preConditionCheckerStub: SinonStub;
    let fsExistSyncStub: SinonStub;
    let errorMsgStub: SinonStub;

    beforeEach(() => {
        execStub = stub(process, 'exec');
        propertiesFileStub = sinon.stub(PropertiesFileSelector.prototype, 'selectPropertiesFile');
        preConditionCheckerStub = sinon.stub(PreConditionChecker, 'check');
        fsExistSyncStub = stub(fs, 'existsSync');
        errorMsgStub = stub(vscode.window, 'showErrorMessage');
    });

    afterEach(() => {
        execStub.restore();
        propertiesFileStub.restore();
        preConditionCheckerStub.restore();
        fsExistSyncStub.restore();
        errorMsgStub.restore();
    });

    it('Should return as preconditions are not met', async () => {
        let preConditionChecker = preConditionCheckerStub.callsFake(() => Promise.resolve(false));

        await validate();
        expect(preConditionChecker.calledOnce).to.be.true;
    });

    it('Should return as No Properties File selected', async () => {
        preConditionCheckerStub.callsFake(() => Promise.resolve(true));

        propertiesFileStub.returns(Promise.resolve(undefined));

        await validate();
        expect(preConditionCheckerStub.calledOnce).to.be.true;
        expect(propertiesFileStub.calledOnce).to.be.true;
    });

    it('Should show Invalid File Error', async () => {
        preConditionCheckerStub.callsFake(() => Promise.resolve(true));

        propertiesFileStub.returns(Promise.resolve('/somepath/test.json'));
        fsExistSyncStub.returns(false);

        await validate();
        expect(errorMsgStub.getCall(0).args[0]).to.equal(messages.error_invalid_file);
    });
});
