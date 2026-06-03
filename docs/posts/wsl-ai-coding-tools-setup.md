---
title: 从手动安装 WSL 到配置 Claude Code 与 Codex
date: 2026-06-03
description: 当 wsl --install 或 Microsoft Store 安装失败时，按 Microsoft 官方手动安装流程配置 WSL2，再安装 Node.js、Claude Code、Codex CLI 和 cc-switch。
tags:
  - WSL2
  - Ubuntu
  - Claude Code
  - Codex
  - 开发环境
---

# 从手动安装 WSL 到配置 Claude Code 与 Codex

如果 `wsl --install` 或 Microsoft Store 下载 Ubuntu 很慢、卡住、报错，不建议继续到处找来历不明的 rootfs 镜像。更稳的做法是参考 Microsoft 官方的 WSL 手动安装流程：先启用 WSL2 需要的 Windows 功能，再直接下载 Ubuntu 的 `.AppxBundle` 包安装。

这篇文章把流程收束成一条线：

1. 手动启用 WSL2。
2. 手动下载并安装 Ubuntu 24.04 LTS。
3. 初始化 Ubuntu。
4. 安装 Node.js、Claude Code、Codex CLI。
5. 用 cc-switch 管理终端编码工具。

## 适用场景

这个流程适合这些情况：

- Microsoft Store 打不开或下载很慢。
- `wsl --install -d Ubuntu-24.04` 一直失败。
- 公司网络或系统策略限制 Store。
- 你希望把安装过程拆开，明确知道每一步发生了什么。

如果你的机器能直接运行 `wsl --install -d Ubuntu-24.04` 并顺利进入 Ubuntu，那就不需要走完整手动流程。

## 第一步：启用 WSL 功能

以管理员身份打开 PowerShell，运行：

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

这一步启用 Windows Subsystem for Linux 可选功能。

## 第二步：启用虚拟机平台

继续在管理员 PowerShell 中运行：

```powershell
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

WSL2 依赖虚拟化能力。运行后重启 Windows。

如果重启后 WSL2 仍然无法启动，还需要检查 BIOS/UEFI 里的虚拟化选项是否打开。

## 第三步：设置 WSL2 为默认版本

重启后打开 PowerShell：

```powershell
wsl --set-default-version 2
```

如果系统提示 WSL 内核需要更新，先运行：

```powershell
wsl --update
```

如果 `wsl --update` 不可用，说明你的 Windows / WSL 组件比较旧，可以按 Microsoft 手动安装文档下载 WSL2 Linux kernel update package。

## 第四步：下载 Ubuntu 24.04 LTS 安装包

Microsoft 手动安装文档给出了 Ubuntu 24.04 LTS 的直接下载方式。可以用浏览器下载，也可以用 PowerShell 的 `curl.exe` 下载。

```powershell
curl.exe -LR -o ubuntu-2404.AppxBundle https://wslstorestorage.blob.core.windows.net/wslblob/Ubuntu2404-240425.AppxBundle
```

这里要写 `curl.exe`，不要只写 `curl`。在 PowerShell 里，`curl` 可能是 `Invoke-WebRequest` 的别名，行为不完全一样。

下载完成后，进入文件所在目录。

## 第五步：安装 AppxBundle

在 PowerShell 中运行：

```powershell
Add-AppxPackage .\ubuntu-2404.AppxBundle
```

如果系统禁止 `Add-AppxPackage`，或你在 Windows Server Core 上操作，需要参考 Microsoft 文档中的 Windows Server 备用安装说明。

安装完成后，从开始菜单启动 **Ubuntu 24.04 LTS**。第一次启动会解压文件，并要求创建 Linux 用户名和密码。

## 第六步：确认 Ubuntu 正常进入 WSL2

在 PowerShell 里查看发行版：

```powershell
wsl -l -v
```

你应该能看到类似：

```text
  NAME            STATE           VERSION
* Ubuntu-24.04    Stopped         2
```

如果版本是 1，可以切到 WSL2：

```powershell
wsl --set-version Ubuntu-24.04 2
```

## 第七步：初始化 Ubuntu

进入 Ubuntu 后，先更新基础包：

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl git unzip build-essential ca-certificates
```

这一步会安装后面配置开发环境常用的基础工具链。

## 第八步：安装 fnm 和 Node.js

Claude Code 和 Codex CLI 都依赖 Node.js 运行环境。这里用 `fnm` 管理 Node 版本。

安装 `fnm`：

```bash
curl -fsSL https://fnm.vercel.app/install | bash
```

让当前 shell 读取新配置：

```bash
source ~/.bashrc
```

安装 Node.js LTS：

```bash
fnm install --lts
fnm use --lts
fnm default $(fnm current)
```

确认版本：

```bash
node -v
npm -v
```

## 第九步：安装 Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后验证：

```bash
claude --version
```

首次使用时按终端提示登录。

## 第十步：安装 OpenAI Codex CLI

```bash
npm install -g @openai/codex@latest
```

安装完成后验证：

```bash
codex --version
```

后续按 Codex CLI 的提示完成认证和模型配置。

## 第十一步：安装 cc-switch

如果你同时使用 Claude Code 和 Codex CLI，可以用 cc-switch 管理不同 Agent 或中继配置。

项目地址：

<https://github.com/farion1231/cc-switch>

安装和配置方式以项目 README 为准。建议先读完 README，再决定是否全局安装。

## 常见问题

### `wsl --install` 和本文流程是什么关系？

`wsl --install` 是首选的一键安装方式。本文是它失败时的手动路径。

如果一键命令可用，直接运行：

```powershell
wsl --install -d Ubuntu-24.04
```

如果它不可用，再按本文拆分步骤处理。

### 为什么不用 `wsl --import`？

`wsl --import` 更适合导入已有 rootfs 或迁移已有发行版。它导入后通常默认进入 `root`，还要额外处理默认用户等细节。

对于普通安装 Ubuntu WSL，Microsoft 官方手动流程里的 `.AppxBundle` 更接近常规安装体验。

## 参考资料

- Microsoft Learn: <https://learn.microsoft.com/en-us/windows/wsl/install-manual>
- Microsoft WSL 安装文档: <https://learn.microsoft.com/en-us/windows/wsl/install>
- cc-switch: <https://github.com/farion1231/cc-switch>
