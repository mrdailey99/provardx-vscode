/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

import * as vscode from 'vscode';
import { CommandExecutor } from './CommandExecutor';

export class ProgressNotification {
    public static show(
        execution: CommandExecutor,
        token: vscode.CancellationTokenSource,
        progressTitle?: string,
        progressLocation?: vscode.ProgressLocation
    ) {
        return vscode.window.withProgress(
            {
                location: progressLocation || vscode.ProgressLocation.Notification,
                title: `Running ${progressTitle}`,
                cancellable: true
            },
            (progress, cancellationToken) => {
                return new Promise((resolve) => {
                    cancellationToken.onCancellationRequested(() => {
                        token.cancel();
                        return resolve();
                    });

                    execution.processExitSubject.subscribe((data) => {
                        return resolve();
                    });

                    execution.processErrorSubject.subscribe((data) => {
                        return resolve();
                    });
                });
            }
        );
    }
}
