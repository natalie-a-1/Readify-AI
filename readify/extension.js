const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
const { error } = require('console');
const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
//require('dotenv').config();

// Access the API key
const apiKey = '';

const MODEL_NAME = "models/chat-bison-001";
const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(apiKey),
});


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

  let disposable = vscode.commands.registerCommand('readify.Readify', async function () {
    const fileData = readFiles();
    const result = await client.generateMessage({

      model: MODEL_NAME, // Required. The model to use to generate the result.
      temperature: 0.5, // Optional. Value `0.0` always uses the highest-probability result.
      candidateCount: 1, // Optional. The number of candidate results to generate.
      prompt: {
        // optional, preamble context to prime responses
        context: fileData,
        // Optional. Examples for further fine-tuning of responses.
        // examples: [
        //   {
        //     input: { content: "Create a ReadMe.md file for my project" },
        //     output: {
        //       content:
        //         `Counting Numbers with a Python Loop

        //               About:
        //               This project is a simple Python script that demonstrates how to count numbers using a for loop.
                      
        //               Getting Started:
                      
        //               Prerequisites:
        //               There are no specific prerequisites for running this Python script. You only need to have Python installed on your system.
                      
        //               Installation:
                      
        //               1. Clone this repository to your local machine:
        //                  - git clone https://github.com/yourusername/your-project.git
                      
        //               2. Navigate to the project directory:
        //                  - cd your-project
                      
        //               3. Run the Python script:
        //                  - python count_numbers.py
                      
        //               Usage:
        //               To use this project, simply run the Python script count_numbers.py. It will count numbers using a for loop and print them to the console.
                      
        //               Features:
        //               - Demonstrates how to use a for loop in Python for counting numbers.
        //               - Provides a basic Python script for counting.
                      
        //               Contributing:
        //               Contributions to this project are welcome! If you have any suggestions or improvements, please submit a pull request or open an issue.
                      
        //               License:
        //               This project is licensed under the MIT License.
                      
        //               Acknowledgments:
        //               - Python - The programming language used for this project.
        //               `,
        //     },
        //  },
        //],
        // Required. Alternating prompt/response messages.
        messages: [{ content: "Given the code context given, generate a ReadMe.md file for this project." }],
      },
    });
    const readMeContent = result[0].candidates[0].content;
    writeReadmeFile(readMeContent)
  });

  context.subscriptions.push(disposable);
}

function readFiles() {
  vscode.window.showInformationMessage('Reading through project code.');
  if (workspaceFolder) {
    const currentDirectory = workspaceFolder.uri.fsPath;
    let pythonFilesContent = '';

    fs.readdir(currentDirectory, (err, files) => {
      if (err) {
        vscode.window.showErrorMessage('Error reading directory.');
        console.error('Error reading directory:', err);
        return;
      }

      files.forEach((file) => {
        const filePath = path.join(currentDirectory, file);

        // Check if the file has a .py extension
        if (path.extname(file) === '.py') {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
              vscode.window.showErrorMessage('Error reading files.');
              console.error('Error reading file:', err);
              return;
            }
            pythonFilesContent += data + '\n';

            return pythonFilesContent;
            // Send the code data to the Google BERT API (or any other AI model)
            // Generate a README file based on the API response
          });
        }
      });
    });
  } else {
    vscode.window.showErrorMessage('No workspace folder opened.');
    return '';
  }
}

// Function to write the README file
function writeReadmeFile(readmeContent) {
  if (workspaceFolder) {
    const currentDirectory = workspaceFolder.uri.fsPath;
    const fileName = 'Readme.md';
    const filePath = path.join(currentDirectory, fileName);

    if (!fs.existsSync(filePath)) {
      // Create the file
      fs.writeFileSync(filePath, '', 'utf-8');
      vscode.window.showInformationMessage(`Created ${fileName} in ${currentDirectory}`);

      // Write the content to the README file
      fs.writeFileSync(filePath, readmeContent, 'utf-8');
      vscode.window.showInformationMessage(`Updated ${fileName} in ${currentDirectory}`);

    } else {
      vscode.window.showWarningMessage(`${fileName} already exists in ${currentDirectory}`);
    }
  } else {
    vscode.window.showErrorMessage('No workspace folder opened.');
  }

}

function deactivate() { }

module.exports = {
  activate,
  deactivate
}
