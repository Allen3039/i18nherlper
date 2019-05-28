// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "nma" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'extension.helloWorld',
    () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage('Hello World1111!');
    }
  );
  let nima = vscode.commands.registerCommand('nima', () => {
    vscode.window.showInputBox({}).then((value) => {
      if (typeof value === 'string') {
        vscode.window.showInformationMessage(value);
      }
    });
  });

  let i18nHelper = vscode.commands.registerCommand('i18n', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const tabSize = editor.options.tabSize;
    const document = editor.document;
    const selection = editor.selection;
    const selectedVar = document.getText(selection);
    const lineOfSelectedVar = selection.active.line;
    const config = vscode.workspace.getConfiguration('18n');
    vscode.window.showInformationMessage(
      `${selectedVar} ${lineOfSelectedVar} ${JSON.stringify(config)}`
    );
  });
  context.subscriptions.push(disposable);
  context.subscriptions.push(nima);
  context.subscriptions.push(i18nHelper);
}

// this method is called when your extension is deactivated
export function deactivate() {}
