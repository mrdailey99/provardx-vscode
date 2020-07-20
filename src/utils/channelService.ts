/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import { CommandExecutor } from './CommandExecutor';
import { messages } from '../messages';

export const DEFAULT_CHANNEL = vscode.window.createOutputChannel(messages.channel_name);

export class ChannelService {
    private readonly channel: vscode.OutputChannel;
    private static instance: ChannelService;

    public constructor() {
        this.channel = DEFAULT_CHANNEL;
    }

    public static getInstance() {
        if (!ChannelService.instance) {
            ChannelService.instance = new ChannelService();
        }
        return ChannelService.instance;
    }

    public streamCommandOutput(execution: CommandExecutor) {
        this.streamCommandStartStop(execution);
        execution.stderrSubject.subscribe((data) => this.channel.append(data.toString()));
        execution.stdoutSubject.subscribe((data) => this.channel.append(data.toString()));
    }

    public streamCommandStartStop(execution: CommandExecutor) {
        this.channel.append(messages.channel_starting_message);
        this.channel.appendLine(execution.command.toString());
        this.channel.appendLine('');

        this.showCommandWithTimestamp(execution.command.toString());

        execution.processExitSubject.subscribe((data) => {
            this.showCommandWithTimestamp(execution.command.toString());
            this.channel.append(' ');
            if (data !== undefined && data !== null) {
                this.channel.appendLine(`${messages.channel_end_with_exit_code} ${data.toString()}`);
            } else {
                this.channel.appendLine(messages.channel_end);
            }
            this.channel.appendLine('');
        });

        execution.processErrorSubject.subscribe((data) => {
            this.showCommandWithTimestamp(execution.command.toString());

            this.channel.append(' ');
            if (data !== undefined) {
                this.channel.appendLine(`${messages.channel_end_with_error} ${data.message}`);

                if (/sfdx.*ENOENT/.test(data.message)) {
                    this.channel.appendLine(messages.channel_end_with_sfdx_not_found);
                }
            } else {
                this.channel.appendLine(messages.channel_end);
            }
            this.channel.appendLine('');
        });
    }

    public showCommandWithTimestamp(commandName: string) {
        this.channel.appendLine(this.getExecutionTime() + ' ' + commandName);
    }

    private getExecutionTime() {
        const d = new Date();
        const hr = this.ensureDoubleDigits(d.getHours());
        const mins = this.ensureDoubleDigits(d.getMinutes());
        const sec = this.ensureDoubleDigits(d.getSeconds());
        const milli = d.getMilliseconds();
        return `${hr}:${mins}:${sec}.${milli}`;
    }

    private ensureDoubleDigits(num: number) {
        return num < 10 ? `0${num.toString()}` : num.toString();
    }

    public showChannelOutput() {
        this.channel.show(true);
    }
}
