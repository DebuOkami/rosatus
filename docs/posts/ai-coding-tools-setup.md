---
title: Claude Code、Codex 与 cc-switch 开发环境安装指南
date: 2026-05-28
description: 在 WSL2 Ubuntu 环境中配置 Node.js，安装 Claude Code CLI、OpenAI Codex CLI，并使用 cc-switch 管理终端编码工具。
tags:
  - Claude Code
  - Codex
  - WSL2
  - Node.js
  - 开发环境
---

# Claude Code、Codex 与 cc-switch 开发环境安装指南

## 第一阶段：搭建 WSL2 Linux 环境（macos 和 linux 跳过）

我们将所有 AI 工具安装在 WSL2 (Ubuntu) 中，这样能获得原生、稳定的 Linux 隔离环境和工具链支持。

### 1. 启用 WSL2

以**管理员身份**打开 Windows PowerShell，依次运行以下命令：

```powershell
# 启用虚拟化和 WSL 功能
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

```

> **提示：** 运行完后，请**重启一次电脑**以确保虚拟化底层生效。

### 2. 安装 Ubuntu 24.04 LTS

重启后，再次打开 PowerShell，运行以下命令安装最新的 Ubuntu 发行版：

```powershell
wsl --install -d Ubuntu-24.04

```

安装完成后会弹出一个 Linux 终端窗口，提示你输入 `Enter new UNIX username:`。

* 输入你的用户名（例如 `dev`）
* 设置你的密码（输入时不会显示，盲打完回车即可）

### 3. 更新 Linux 系统组件（可选）

在进入的 Ubuntu 终端内，运行以下命令把基础包更新到最新状态：

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip build-essential

```

---

## 第二阶段：安装 fnm 与 Node.js 环境

Claude Code 需要 Node.js 环境。使用 `fnm` (Fast Node Manager) 是目前公认最快、最优雅的 Node 版本管理方式。

### 1. 一键安装 fnm

在 WSL 终端中运行：

```bash
curl -fsSL https://fnm.vercel.app/install | bash

```

### 2. 将 fnm 写入环境变量

为了让终端每次打开都能识别 `fnm` 命令，将配置写入 `~/.bashrc`：

```bash
echo 'export PATH="$HOME/.local/share/fnm:$PATH"' >> ~/.bashrc
echo 'eval "`fnm env`"' >> ~/.bashrc
source ~/.bashrc

```

### 3. 安装 Node.js 长期支持版 (LTS)

```bash
# 安装最新的 LTS 版本
fnm install --lts

# 激活并将其设为默认版本
fnm use --lts
fnm default $(fnm current)

# 验证安装是否成功（应显示 v22+ 或 v24+ 版本的 Node 和 npm）
node -v
npm -v

```

---

## 第三阶段：安装 Claude Code CLI

Claude Code 是 Anthropic 官方推出的终端 AI 编码助手。

### 1. 全局安装 Claude Code

利用刚刚配置好的 `npm` 直接全局安装官方包：

```bash
npm install -g @anthropic-ai/claude-code
```

---

## 第四阶段：安装 OpenAI Codex CLI

Codex CLI 是 OpenAI 官方推出的开源本地终端编码智能体，采用 Rust 编写，速度极快。

### 1. 一键脚本安装

在 WSL 终端中运行官方提供的 Linux 安装脚本：

```bash
npm install -g @openai/codex@latest
```

---

## 第五阶段：安装与配置 cc-switch 切换器

当你的电脑里同时拥有了 Claude Code 和 Codex CLI 时，为了在项目中一键切换首选 Agent，或者统一多模型中继站的配置，我们需要配置 **cc-switch** 终端工具。

[cc-switch](https://github.com/farion1231/cc-switch)
	
