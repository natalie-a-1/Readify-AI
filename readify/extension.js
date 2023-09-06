const vscode = require('vscode');
const fs = require('fs');
const path = require('path');


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('readify.Readify', function () {

		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

		if (workspaceFolder) {
			const currentDirectory = workspaceFolder.uri.fsPath;
            const fileName = 'Readme.md';
            const filePath = path.join(currentDirectory, fileName);

			if (!fs.existsSync(filePath)) {
                // Create the file
                fs.writeFileSync(filePath, '', 'utf-8');
                vscode.window.showInformationMessage(`Created ${fileName} in ${currentDirectory}`);
            } else {
                vscode.window.showWarningMessage(`${fileName} already exists in ${currentDirectory}`);
            }
        } else {
            vscode.window.showErrorMessage('No workspace folder opened.');
        }
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
