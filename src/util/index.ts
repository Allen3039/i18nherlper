import { resolve } from "url";
import * as vscode from "vscode";
import { watchFile } from "fs";

interface I18nObj {
  "en-US": string;
  "hi-IN": string;
  "ja-JP": string;
  "zh-CN": string;
}

type T18n = {
  [keyName: string]: {
    "en-US": string;
    "hi-IN": string;
    "ja-JP": string;
    "zh-CN": string;
  };
};

export const getLocalPath = () => {
  const config = vscode.workspace.getConfiguration("18n");
  const localePath = config["localePath"];
  return localePath;
};

const getAbsolutePath = (relativePath: string) => {
  const filePath = resolve(
    (vscode.workspace.rootPath as string) + "/" + vscode.workspace.name,
    relativePath,
  );
  return filePath;
};

export const loadFile = (relativePath: string) => {
  const filePath = getAbsolutePath(relativePath);
  console.log(filePath);
  watchOneTime(relativePath);
  return require(filePath);
};

const disableCache = (relativePath: string) => {
  const filePath = getAbsolutePath(relativePath);
  delete require.cache[filePath];
};

const watchOneTime = (() => {
  let executed = false;
  const _watchOneTime = (relativePath: string) => {
    if (executed) {
      return;
    }

    const filePath = getAbsolutePath(relativePath);
    watchFile(filePath, () => {
      console.info("字典文件变更，清除缓存");
      disableCache(relativePath);
    });

    executed = true;
  };
  return _watchOneTime;
})();
// FIXME:dsds
export const findMatchedKeys = (i1n8Config: T18n, text: string) => {
  const _text = text.trim();
  const timeLabel = "查找匹配keys耗时";
  console.time(timeLabel);
  const keys = Object.keys(i1n8Config).reduce<string[]>(
    (choosedKeys, curKey) => {
      if (
        i1n8Config[curKey]["en-US"] === _text ||
        i1n8Config[curKey]["zh-CN"] === text
      ) {
        choosedKeys.push(curKey);
      }
      return choosedKeys;
    },
    [],
  );
  console.timeEnd(timeLabel);
  return keys;
};

export const findMatched18n = (i1n8Config: T18n, key: string) => {
  if (typeof i1n8Config[key] !== undefined) {
    return i1n8Config[key] as I18nObj;
  }
  return null;
};
