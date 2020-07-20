/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export class CommandBuilder {
    public readonly command: string;
    public args: string[] = [];

    public constructor(command: string) {
        this.command = command;
    }

    public withArg(arg: string): CommandBuilder {
        this.args.push(arg);
        return this;
    }

    public withFlag(name: string, value: string): CommandBuilder {
        this.args.push(name, value);
        return this;
    }

    public toString(): string {
        return `${this.command} ${this.args.join(' ')}`;
    }
}
