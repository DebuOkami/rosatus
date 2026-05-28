# Rosatus Blog

基于 VitePress 的静态博客。

## 本地开发

```bash
npm install
npm run docs:dev
```

## 新增文章

把 Markdown 文件放到 `docs/posts/`，文章列表会自动更新。

推荐 frontmatter：

```md
---
title: 文章标题
date: 2026-05-28
description: 一句话摘要
tags:
  - 标签
---
```

## 构建

```bash
npm run docs:build
```

推送到 `main` 分支后，GitHub Actions 会自动发布到 GitHub Pages。

首次使用时，请在 GitHub 仓库的 `Settings -> Pages` 中把 `Source` 设为 `GitHub Actions`。
