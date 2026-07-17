---
title: 在 Windows 上安装 Claude Code 与 Codex CLI
date: 2026-07-17
description: 在 Windows 原生环境中配置 Windows Terminal、PowerShell 7、Git、fnm 和 Node.js，再安装并验证 Claude Code 与 OpenAI Codex CLI。
tags:
  - Windows
  - PowerShell
  - Claude Code
  - Codex
  - 开发环境
---

# 在 Windows 上安装 Claude Code 与 Codex CLI

这篇文章介绍如何在 Windows 10 或 Windows 11 的原生环境中安装 Claude Code 和 OpenAI Codex CLI，不需要先配置 WSL。完整流程如下：

1. 准备 Windows Terminal、WinGet 和 PowerShell 7。
2. 安装 Git for Windows。
3. 使用 fnm 安装 Node.js LTS。
4. 安装并登录 Claude Code。
5. 安装并登录 Codex CLI。
6. 检查版本并处理常见的 PATH、代理和 PowerShell 配置问题。

如果你的项目和工具链本来就在 Linux 或 WSL2 中，建议继续使用 WSL，不要在 Windows 和 WSL 里混装同一套命令行工具。WSL 的配置方式可以参考[从手动安装 WSL 到配置 Claude Code 与 Codex](./wsl-ai-coding-tools-setup.md)。

## 适用环境

- Windows 10 1809 或更高版本，或者 Windows 11。
- x64 或 ARM64 处理器。
- 可以访问 GitHub、npm、Anthropic 和 OpenAI 的网络环境。
- 一个可用的 Claude Code 账户，以及 ChatGPT 账户或 OpenAI API Key。

安装系统软件时，Windows 可能弹出管理员权限确认。完成安装后，日常运行 `claude` 和 `codex` 不需要管理员权限，也不建议把 Windows Terminal 设置为始终以管理员身份启动。

## 第一步：安装 Windows Terminal

Windows 11 通常已经自带 Windows Terminal。先在开始菜单中搜索 **Terminal**，能正常打开就可以跳过这一步。

如果没有安装，可以从 Microsoft Store 安装，也可以在 PowerShell 中运行：

```powershell
winget install --id Microsoft.WindowsTerminal -e
```

安装后打开 Windows Terminal，后面的命令都在其中执行。

## 第二步：确认 WinGet 可用

运行：

```powershell
winget --version
```

如果输出版本号，说明 WinGet 已经可用。如果提示找不到 `winget`，先在 Microsoft Store 中安装或更新 **应用安装程序（App Installer）**。

在 Microsoft Store 不可用的环境中，可以使用 Microsoft 官方的 PowerShell 修复方式。在 **Windows PowerShell 5.1** 中以管理员身份运行：

```powershell
$progressPreference = 'SilentlyContinue'
Install-PackageProvider -Name NuGet -Force | Out-Null
Install-Module -Name Microsoft.WinGet.Client -Force -Repository PSGallery | Out-Null
Repair-WinGetPackageManager -AllUsers
```

修复完成后关闭终端，重新打开并再次运行 `winget --version`。

## 第三步：安装 PowerShell 7

Windows 自带的 Windows PowerShell 5.1 可以完成安装，但 PowerShell 7 的兼容性和终端体验更好：

```powershell
winget install --id Microsoft.PowerShell -e
```

安装完成后关闭当前终端，在 Windows Terminal 的下拉菜单中打开 **PowerShell**。运行下面的命令确认当前版本：

```powershell
$PSVersionTable.PSVersion
```

版本号的第一位应为 `7`。也可以在 Windows Terminal 设置中把 PowerShell 设为默认配置文件。

## 第四步：配置网络代理（可选）

如果你平时需要通过本机代理访问 GitHub、npm、Anthropic 或 OpenAI，可以先为当前 PowerShell 会话设置代理。把 `7890` 换成代理软件实际提供的 HTTP 端口：

```powershell
$env:HTTP_PROXY = "http://127.0.0.1:7890"
$env:HTTPS_PROXY = "http://127.0.0.1:7890"
```

这两个变量只对当前终端窗口及其启动的程序生效，关闭窗口后不会永久保留。可以用下面的命令检查：

```powershell
$env:HTTP_PROXY
$env:HTTPS_PROXY
```

不要直接照抄别人的端口，也不要在不需要代理时长期设置全局代理变量。

## 第五步：安装 Git for Windows

Claude Code 在 Windows 上可以使用 PowerShell 执行命令；安装 Git for Windows 后，它还可以使用 Git Bash。Codex 和 Claude Code 在修改代码前后也都需要 Git 来查看差异和管理版本。

```powershell
winget install --id Git.Git -e --source winget
```

关闭并重新打开终端，然后验证：

```powershell
git --version
```

第一次使用 Git 时，可以设置提交用户名和邮箱：

```powershell
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

如果 Claude Code 没有自动找到 Git Bash，可以在 Claude Code 的 `settings.json` 中设置：

```json
{
  "env": {
    "CLAUDE_CODE_GIT_BASH_PATH": "C:\\Program Files\\Git\\bin\\bash.exe"
  }
}
```

## 第六步：安装 fnm 和 Node.js LTS

Codex CLI 可以通过 npm 安装，因此需要 Node.js。这里使用 fnm 管理 Node.js 版本，后续升级或切换版本会更方便。

安装 fnm：

```powershell
winget install --id Schniz.fnm -e
```

关闭所有终端窗口，重新打开 PowerShell 7，然后创建 PowerShell 配置文件：

```powershell
New-Item -ItemType Directory -Path (Split-Path $PROFILE) -Force | Out-Null
New-Item -ItemType File -Path $PROFILE -Force | Out-Null
notepad $PROFILE
```

在打开的文件末尾加入这一行并保存：

```powershell
fnm env --use-on-cd --shell powershell | Out-String | Invoke-Expression
```

关闭并重新打开 PowerShell 7，安装当前 Node.js LTS：

```powershell
fnm install --lts --use
fnm default (fnm current)
```

确认 Node.js 和 npm 可用：

```powershell
node --version
npm --version
```

不要把教程中的 Node.js 代号或具体版本永久写死。安装时使用当前 LTS，遇到项目版本要求时再通过 fnm 单独切换。

## 第七步：安装 Claude Code

Anthropic 当前推荐在 Windows PowerShell 中使用原生安装器。该安装方式不依赖前面安装的 Node.js，并且会在后台自动更新：

```powershell
irm https://claude.ai/install.ps1 | iex
```

这个命令会从 Anthropic 官方地址下载并执行安装脚本。安装完成后关闭并重新打开终端，再验证：

```powershell
claude --version
claude doctor
```

如果公司策略不允许执行远程 PowerShell 脚本，也可以通过 WinGet 安装：

```powershell
winget install --id Anthropic.ClaudeCode -e
```

WinGet 版本默认不会由 Claude Code 自动更新，需要定期手动升级：

```powershell
winget upgrade --id Anthropic.ClaudeCode -e
```

不要同时使用原生安装器、WinGet 和 npm 重复安装 Claude Code，否则可能出现多个 `claude` 命令互相覆盖的问题。

## 第八步：登录 Claude Code

进入一个代码项目目录，然后启动 Claude Code：

```powershell
cd C:\projects\your-project
claude
```

第一次启动时，按照终端和浏览器提示完成登录。Claude Code 需要支持 Claude Code 的 Anthropic 订阅或 Console 账户；免费的 Claude.ai 方案不包含 Claude Code。

如果已经在环境变量中配置了 `ANTHROPIC_API_KEY`，Claude Code 会询问是否使用该 Key。不要把 API Key 写进项目文件、提交到 Git，或者粘贴到公开日志中。

## 第九步：安装 Codex CLI

使用 npm 安装 OpenAI 官方包：

```powershell
npm install -g @openai/codex@latest
```

安装完成后验证：

```powershell
codex --version
```

以后可以用同一条命令升级到最新版：

```powershell
npm install -g @openai/codex@latest
```

不要安装名称相近的第三方包，也不要为了复现其他人的环境长期固定一个已经过期的版本。

## 第十步：登录 Codex CLI

进入项目目录并启动：

```powershell
cd C:\projects\your-project
codex
```

首次启动时可以选择：

- **Sign in with ChatGPT**：在浏览器中登录，使用账户可用的 Codex 权益。
- **API Key**：使用 OpenAI Platform API Key，按照 API 实际用量计费。

两种登录方式的计费和功能范围不同。使用 API Key 不等于使用 ChatGPT 订阅额度。

登录信息会缓存在本机。Codex 可能把凭据保存在操作系统凭据存储或用户目录下的 `.codex/auth.json` 中，不要提交或分享这个文件。

## 第十一步：完成一次运行检查

在一个已经由 Git 管理的测试项目中运行：

```powershell
git status
codex
```

可以先让 Codex 执行只读任务，例如：

```text
请阅读这个项目，并说明目录结构、启动命令和测试命令，不要修改文件。
```

退出后再运行 Claude Code：

```powershell
claude
```

同样先从只读任务开始。确认两者都能读取项目、调用 Git 并正常返回结果后，安装就完成了。

在让 AI 修改项目之前，建议先确认工作区状态并提交现有改动：

```powershell
git status
```

AI 编码工具可以执行本机命令和修改文件。仔细阅读权限提示，尤其不要在包含重要未提交文件的目录中直接批准高风险操作。

## 常见问题

### 找不到 `winget`

先更新 Microsoft Store 中的 **应用安装程序（App Installer）**，然后重启终端。如果 Store 不可用，再使用本文第二步的修复命令。

### 找不到 `fnm`、`node`、`claude` 或 `codex`

安装后先关闭所有终端窗口再重新打开。然后用 `Get-Command` 检查 PowerShell 实际找到的程序：

```powershell
Get-Command fnm
Get-Command node
Get-Command claude
Get-Command codex
```

如果 `fnm` 存在但 `node` 不存在，确认 `$PROFILE` 中包含 fnm 初始化命令，并运行：

```powershell
. $PROFILE
fnm use default
```

### PowerShell 提示禁止运行脚本

先确认你使用的是自己的电脑，并检查当前策略：

```powershell
Get-ExecutionPolicy -List
```

如果 `CurrentUser` 的策略阻止加载个人配置文件，可以只为当前用户设置 Microsoft 常用的 `RemoteSigned` 策略：

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

公司管理的电脑可能通过组策略强制限制脚本执行，这时不要绕过策略，应联系管理员或改用允许的安装方式。

### npm 下载很慢或连接失败

优先确认代理端口和 `$env:HTTP_PROXY`、`$env:HTTPS_PROXY` 是否正确。第三方 npm 镜像可能同步滞后，导致最新版包不存在，因此安装 AI CLI 时优先使用 npm 官方源：

```powershell
npm config set registry https://registry.npmjs.org/
npm ping
```

### `claude doctor` 提示存在多个安装

检查命令来源：

```powershell
Get-Command claude -All
```

保留一种安装方式，并使用对应的卸载命令移除其他版本。例如 npm 版本可以这样卸载：

```powershell
npm uninstall -g @anthropic-ai/claude-code
```

### Windows 原生环境还是 WSL2？

Windows 原生环境适合代码、IDE 和工具链都在 `C:\` 盘中的项目。WSL2 更适合 Linux 工具链、容器开发或需要 Linux 沙箱的场景。

两者是相互独立的环境。在 PowerShell 中安装的 `codex` 和 `claude` 不会自动出现在 WSL 中；反过来也一样。项目在哪里运行，就在哪里安装 CLI。

## 参考资料

- Claude Code 安装文档：<https://code.claude.com/docs/en/setup>
- OpenAI Codex CLI：<https://developers.openai.com/codex/cli>
- OpenAI Codex 认证：<https://developers.openai.com/codex/auth>
- Git for Windows：<https://git-scm.com/downloads/win>
- fnm：<https://github.com/Schniz/fnm>
- 原始参考文章：<https://linux.do/t/topic/803265>
