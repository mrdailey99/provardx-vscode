/*
 * Copyright (c) 2020 Make Positive Provar Ltd
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.md file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

export const messages = {
    create_properties_new_file_filename: 'New File Name?',
    create_properties_file_create_prop_file: 'Create Properties File',
    create_properties_file_successMsg: 'ProvarDX properties file created successfully!',
    create_properties_file_provar_project_folder: 'Select Provar Project Folder',
    create_properties_file_enter_prop_file_name: 'Enter properties file name or use the default file name',

    validate_select_file: 'Select file',

    props_file_selector_from_workspace: 'Choose properties file from Workspace',
    props_file_selector_from_other_location: 'Choose properties file from Other Location',
    props_file_selector_select_properties_file:
        'Select properties file. Matched files with format: "*-properties.json"',

    warning_prompt_dir_overwrite:
        'A file with the specified file name already exists in the selected directory. Do you want to overwrite it?',
    warning_prompt_overwrite: 'Overwrite',
    warning_prompt_overwrite_diff_file_name: 'Choose Different File Name',
    warning_prompt_cancel: 'Cancel',
    warning_prompt_provardx_plugin_not_installed: 'ProvarDX sfdx plugin not installed. See how to install plugin?',
    warning_prompt_continue: 'Continue',

    error: 'Error:',
    error_something_went_wrong: 'Something went wrong!',
    error_enter_valid_filename: 'Invalid property file name. Should be *-properties.json.',
    error_sfdx_plugin_not_installed: 'SFDX plugin not installed.',
    error_mac_sfdx_comand_not_found: 'sfdx: command not found',
    error_win32_sfdx_comand_not_found: '"sfdx" is not recognized as an internal or external command',
    error_no_plugins_installed: 'no plugins installed',
    error_invalid_file: 'Invalid file',
    error_validating_properties_file: 'Error in validating properties file',
    error_invalid_property_file: 'ProvarDX: Invalid property file. Plese see console logs for detailed error message.',
    error_error_running_testcases:
        'ProvarDX: Error running testcases. Plese see console logs for detailed error message.',
    error_provar_home: 'The Provar Home folder does not exist.',
    error_provardx_props_file_not_found:
        'No ProvarDX properties files found. These files must have file names that end with "-properties.json"',

    progress_title_validating_file: 'Validating properties file',
    progress_title_running_testcases: 'Running Testcases',

    notification_successful_execution_text: 'successfully ran',
    notification_unsuccessful_execution_text: 'failed to run',

    channel_name: 'ProvarDX CLI',
    channel_starting_message: 'Starting ',
    channel_end_with_exit_code: 'ended with exit code',
    channel_end_with_sfdx_not_found:
        'Salesforce CLI is not installed. Install it from https://developer.salesforce.com/tools/sfdxcli',
    channel_end_with_error: 'ended with error',
    channel_end: 'ended'
};
