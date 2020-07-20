/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export const DEFAULT_PROPERTIES_FILE_CONTENT = `{
    "provarHome":"{{provarHome}}",
    "projectPath":"{{projectPath}}",
    "resultsPath":"{{resultsPath}}",
    "smtpPath": "",
    "resultsPathDisposition": "Increment", 
    "testOutputLevel":"WARNING",
    "pluginOutputlevel":"WARNING",
    "stopOnError":false,
    "lightningMode":true,
    "connectionRefreshType":"Reload",
    "metadata":{
       "metadataLevel":"Reuse",
       "cachePath":"../.provarCaches"
    },
    "environment":{
       "testEnvironment":"",
       "webBrowser":"Chrome",
       "webBrowserConfig":"Full Screen",
       "webBrowserProviderName":"Desktop",
       "webBrowserDeviceName":"Full Screen"
    }
    ,"testCase":[
         "/Test Case 1.testcase"  
     ]
 }
`;

export const COMMANDS = {
    PLUGINS: 'sfdx plugins',
    PROVARDX_PLUGIN_INSTALL: 'sfdx plugins:install @muenzpraeger/sfdx-plugin',
    PROVARDX_VALIDATE: 'provar:validate',
    PROVARDX_RUN_TESTS: 'provar:runtests'
};

export const PROVARDX_GITHUB_URL = 'https://github.com/ProvarTesting/provardx';

export const DEFAULT_PROPS_FILE_NAME = 'provardx-properties.json';

export const PLUGIN_NAME = '@provartesting/provardx';
