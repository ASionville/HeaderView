// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "headerview" is now active!');

	vscode.window.onDidChangeActiveTextEditor((editor) => {
		if (!editor) {
			return;
		}
		// Get the name of the active file
		let activeEditor = vscode.window.activeTextEditor;
		if (!activeEditor) {
			return;
		}
		let fileName = activeEditor.document.fileName;
		let fileExtension = fileName.split('.').pop();

		const moveExistingHeaderFiles = vscode.workspace.getConfiguration('headerview').get('moveExistingHeaderFiles', true);

		// if a .c file is active and it is not the main.c file, show the header file
		if (fileExtension === 'c' && !fileName.includes('main.c')) {
			// Remove the .c extension and add .h extension (not replace because there could be .c in the path)
			let fileNoExtension = fileName.substring(0, fileName.length - 2);
			let headerFileName = fileNoExtension + '.h';
			
			// If the header file does not exist, create it
			if (!fs.existsSync(headerFileName)) {
				vscode.workspace.fs.writeFile(vscode.Uri.file(headerFileName), new Uint8Array());
				// Small delay to allow the file to be created
				setTimeout(() => {}, 100);
			}
			
			// If the header file is already open, just move it to the right side of the editor
			if (vscode.window.visibleTextEditors.some((editor) => editor.document.fileName === headerFileName)) {
				if (moveExistingHeaderFiles) {
					vscode.window.showTextDocument(vscode.Uri.file(headerFileName), { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true});
					return;
				}
			}else {
			// Open the header file on the right side of the editor
			vscode.window.showTextDocument(vscode.Uri.file(headerFileName), { viewColumn: vscode.ViewColumn.Beside, preserveFocus: true});
			}
		}
	});

}

// This method is called when your extension is deactivated
export function deactivate() {}
