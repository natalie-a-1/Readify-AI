const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
require('dotenv').config();

// Access the API key
const apiKey = process.env.API_KEY;

const MODEL_NAME = "models/chat-bison-001";
const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(apiKey),
  });


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('readify.Readify', async function () {

		// const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

		// if (workspaceFolder) {
		// 	const currentDirectory = workspaceFolder.uri.fsPath;
        //     const fileName = 'Readme.md';
        //     const filePath = path.join(currentDirectory, fileName);

		// 	if (!fs.existsSync(filePath)) {
        //         // Create the file
        //         fs.writeFileSync(filePath, '', 'utf-8');
        //         vscode.window.showInformationMessage(`Created ${fileName} in ${currentDirectory}`);
        //     } else {
        //         vscode.window.showWarningMessage(`${fileName} already exists in ${currentDirectory}`);
        //     }
        // } else {
        //     vscode.window.showErrorMessage('No workspace folder opened.');
        // }

        const result = await client.generateMessage({
            model: MODEL_NAME, // Required. The model to use to generate the result.
            temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
            candidateCount: 1, // Optional. The number of candidate results to generate.
            prompt: {
              // optional, preamble context to prime responses
              context: "Respond to all questions with a rhyming poem.",
              // Optional. Examples for further fine-tuning of responses.
              examples: [
                {
                  input: { content: "What is the capital of California?" },
                  output: {
                    content:
                      `If the capital of California is what you seek,
        Sacramento is where you ought to peek.`,
                  },
                },
              ],
              // Required. Alternating prompt/response messages.
              messages: [{ content: "How tall is the Eiffel Tower?" }],
            },
          });
        
          console.log(result[0].candidates[0].content);
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
