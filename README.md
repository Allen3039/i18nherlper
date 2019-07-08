# i18n-helper README

问题 1:编码时国际化的 key 不能让人第一时间反应出对应的具体文案，增加代码的阅读成本和调试成本。

解决方案:提供`onCommand:i18n`快速查找对应的国际化文案。

问题 2:当使用页面上一些文字作为锚点去定位代码具体位置不方便，因为代码中全是具体的 key 了。

解决方案:您可以使用`onCommand:i18n.search`快速对匹配出的 key 进行查寻定位。

## Features

| command               | description                              |
| --------------------- | ---------------------------------------- |
| onCommand:i18n        | 查找 key 对应的国际化文案                |
| onCommand:i18n.search | 根据国家化文案(支持中英文)反查对应的 key |

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

- `18n.localePath`: 国际化匹配文件地址

## Known Issues

目前仅支持文件格式为:

```ts
type T18n = {
  [keyName: string]: {
    "en-US": string;
    "hi-IN": string;
    "ja-JP": string;
    "zh-CN": string;
  };
};
```

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release of ...

### 0.1.0

- 文件发生变更时，自动更新当前引用的国际化文件
- 支持国际化文案反查

### 0.2.0

- 查询国际化文案不存在匹配 key 时，引导重新查询国际化文案
- 检测到翻译文件不存在时，给出提示
- 优化查询到的翻译文案显示，目前只按顺序显示中、英、日三种翻译
