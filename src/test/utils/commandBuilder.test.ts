/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import { expect } from 'chai';

import { CommandBuilder } from '../../utils';

describe('CommandBuilder tests', () => {
    it('Should store the command string', () => {
        const actual = new CommandBuilder('sfdx');

        expect(actual.command).to.equal('sfdx');
    });

    it('Should store the command arg', () => {
        const actual = new CommandBuilder('sfdx').withArg('provar:validate');

        expect(actual.command).to.equal('sfdx');
        expect(actual.args).to.eql(['provar:validate']);
    });

    it('Should store the command args', () => {
        const actual = new CommandBuilder('sfdx').withArg('provar:validate').withArg('--help');

        expect(actual.command).to.equal('sfdx');
        expect(actual.args).to.eql(['provar:validate', '--help']);
    });

    it('Should store the command flag', () => {
        const actual = new CommandBuilder('sfdx')
            .withArg('provar:validate')
            .withFlag('-p', './provardx-properties.json');

        expect(actual.command).to.equal('sfdx');
        expect(actual.args).to.eql(['provar:validate', '-p', './provardx-properties.json']);
    });
});
