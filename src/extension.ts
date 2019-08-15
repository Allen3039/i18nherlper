// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { fstat } from "fs";
import { resolve } from "url";
import * as cp from "child_process";
import {
  loadFile,
  findMatchedKeys,
  getLocalPath,
  findMatched18n,
  showHoverTip
} from "./util";
import * as _ from "lodash";

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
    "extension.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed

      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World1111!");
    }
  );
  let nima = vscode.commands.registerCommand("nima", () => {
    vscode.window.showInputBox({}).then(value => {
      if (typeof value === "string") {
        vscode.window.showInformationMessage(value);
      }
    });
  });

  let i18nHelper = vscode.commands.registerCommand("i18n", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const tabSize = editor.options.tabSize;
    const document = editor.document;
    const selection = editor.selection;
    const key = document.getText(selection);

    const localePath = getLocalPath();
    const file = loadFile(localePath);
    if (file === null) {
      vscode.window.showErrorMessage("请填写正确的国际化文件地址");
      return;
    }
    const matchedConfig = findMatched18n(file, key);

    if (!matchedConfig) {
      vscode.window.showInformationMessage("没有匹配的key");
    } else {
      const mainMatchedConfig = _.pick(matchedConfig, [
        "zh-CN",
        "en-US",
        "ja-JP"
      ]);
      vscode.window.showInformationMessage(
        JSON.stringify(mainMatchedConfig, null, "\n\t")
      );
    }
  });

  const i18nSearch = vscode.commands.registerCommand("i18n.search", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const configFile = loadFile(getLocalPath());
    if (configFile === null) {
      return;
    }
    console.log({ configFile });
    const showSearchWindow = () => {
      vscode.window
        .showInputBox({
          placeHolder: "国际化文案"
        })
        .then(i18nText => {
          if (typeof i18nText === "string") {
            const keys = findMatchedKeys(configFile, i18nText);
            // 不存在搜索的key 重新检索
            if (!keys.length) {
              showSearchWindow();
              return;
            }
            vscode.window.showQuickPick(keys, {}).then(pickedKey => {
              console.log(pickedKey);

              vscode.env.clipboard.writeText(pickedKey as string).then(() => {
                vscode.window.showInformationMessage(
                  "当前选中的key已复制到剪贴板"
                );
              });
            });
          }
        });
    };

    showSearchWindow();
  });

  const i18nHoverTip = vscode.languages.registerHoverProvider("*", {
    provideHover(doc, pos, token) {
      if (!showHoverTip()) {
        return;
      }
      const word = doc.getText(doc.getWordRangeAtPosition(pos));
      console.log("TCL: provideHover -> word", word);
      if (word) {
        const localePath = getLocalPath();
        const file = loadFile(localePath);
        if (file === null) {
          return;
        }
        const matchedConfig = findMatched18n(file, word);
        if (!matchedConfig) {
          return;
        }
        const mainMatchedConfig = _.pick(matchedConfig, [
          "zh-CN",
          "en-US",
          "ja-JP"
        ]);
        return new vscode.Hover(JSON.stringify(mainMatchedConfig));
      }
    }
  });

  context.subscriptions.push(i18nSearch);
  context.subscriptions.push(i18nHelper);
  context.subscriptions.push(i18nHoverTip);
}

// vscode.languages.registerHoverProvider('aa',)

// this method is called when your extension is deactivated
export function deactivate() {}
