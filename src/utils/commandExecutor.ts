/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as cross_spawn from 'cross-spawn';
import { fromEvent, interval, Observable, Subscription } from 'rxjs';
import * as vscode from 'vscode';
import { CommandBuilder } from './CommandBuilder';

const kill = require('tree-kill');

export class CommandExecutor {
    public readonly command: CommandBuilder;
    public readonly cancellationToken?: vscode.CancellationToken;
    public readonly processExitSubject: Observable<number | undefined>;
    public readonly processErrorSubject: Observable<Error | undefined>;
    public readonly stdoutSubject: Observable<Buffer | string>;
    public readonly stderrSubject: Observable<Buffer | string>;

    private readonly childProcessPid: number;

    constructor(command: CommandBuilder, cancellationToken?: vscode.CancellationToken) {
        this.command = command;
        this.cancellationToken = cancellationToken;

        const childProcess = cross_spawn(this.command.command, this.command.args, {});

        this.childProcessPid = childProcess.pid;

        let timerSubscriber: Subscription | null;

        // Process
        this.processExitSubject = fromEvent(childProcess, 'exit');
        this.processExitSubject.subscribe((next) => {
            if (timerSubscriber) {
                timerSubscriber.unsubscribe();
            }
        });
        this.processErrorSubject = fromEvent(childProcess, 'error');
        this.processErrorSubject.subscribe((next) => {
            if (timerSubscriber) {
                timerSubscriber.unsubscribe();
            }
        });

        // Output
        this.stdoutSubject = fromEvent(childProcess.stdout!, 'data');
        this.stderrSubject = fromEvent(childProcess.stderr!, 'data');

        // Cancellation watcher
        if (cancellationToken) {
            const timer = interval(1000);
            timerSubscriber = timer.subscribe(async (next) => {
                if (cancellationToken.isCancellationRequested) {
                    try {
                        await this.killExecution();
                    } catch (e) {
                        console.log(e);
                    }
                }
            });
        }
    }

    public async killExecution(signal: string = 'SIGKILL') {
        return killPromise(this.childProcessPid, signal);
    }
}

async function killPromise(processId: number, signal: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        kill(processId, signal, (err: {}) => {
            err ? reject(err) : resolve();
        });
    });
}
