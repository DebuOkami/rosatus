---
title: WSL 手动安装 Ubuntu：绕过商店和 wsl --install 下载失败
date: 2026-06-02
description: 当 Microsoft Store 或 wsl --install 下载 Ubuntu 很慢、卡住或报错时，可以手动下载 Ubuntu WSL 镜像，再通过 .wsl 或 rootfs tarball 安装。
tags:
  - WSL2
  - Ubuntu
  - Windows
  - 开发环境
---

# WSL 手动安装 Ubuntu：绕过商店和 wsl --install 下载失败

如果 `wsl --install`、Microsoft Store 或 Windows Terminal 里的 Ubuntu 安装一直卡住，最稳的办法通常不是反复重试，而是先把 Ubuntu WSL 镜像下载到本地，再手动安装。

这篇文章记录两种方式：

1. 推荐方式：下载官方 `.wsl` 镜像，然后用 `wsl --install --from-file` 安装。
2. 备用方式：下载 Ubuntu WSL rootfs 的 `.tar.gz`，然后用 `wsl --import` 导入。

## 先说结论

原教程的大方向是对的：Ubuntu 的 WSL 系统可以离线下载后手动安装，`wsl --import` 也确实可以把 tar 包导入成一个新的 WSL 发行版。

但有几个地方建议修正：

- 下载链接不要写成 Google 搜索跳转，应该直接指向 Ubuntu 官方站点。
- Ubuntu 24.04 LTS 及后续版本更推荐下载 `.wsl` 镜像，用 `wsl --install --from-file` 安装。
- `wsl --import` 导入 rootfs 后默认登录 `root`，需要自己创建普通用户。
- 默认用户设置推荐写入 `/etc/wsl.conf`，这是更通用的做法。

## 前置条件

先确认 Windows 已经启用 WSL 和虚拟化能力。管理员 PowerShell 中运行：

```powershell
wsl --install --no-distribution
wsl --update
wsl --version
```

如果系统提示需要重启，先重启 Windows。虚拟化也需要在 BIOS/UEFI 中打开，否则 WSL2 可能无法启动。

## 方式一：使用官方 `.wsl` 镜像安装

这是现在更推荐的方式，尤其适合 Ubuntu 24.04 LTS。

打开 Ubuntu 官方发布页：

- Ubuntu 24.04 LTS: <https://releases.ubuntu.com/noble/>

在页面中找到 **WSL image**，下载类似这样的文件：

```text
ubuntu-24.04.4-wsl-amd64.wsl
```

文件名里的小版本号会随 Ubuntu 发布节奏变化，以页面实际显示为准。

如果官方站点下载慢，可以尝试国内镜像站的 Ubuntu releases 目录：

- 南京大学镜像站：<https://mirror.nju.edu.cn/ubuntu-releases/24.04/>
- 中国科学技术大学镜像站：<https://mirrors.ustc.edu.cn/ubuntu-releases/24.04/>
- 清华大学开源软件镜像站：<https://mirrors.tuna.tsinghua.edu.cn/ubuntu-releases/24.04/>

进入目录后，寻找类似下面的 WSL 镜像文件：

```text
ubuntu-24.04.4-wsl-amd64.wsl
```

如果镜像站没有同步这个文件，就回到 Ubuntu 官方发布页下载。

下载完成后，进入下载目录，运行：

```powershell
wsl --install --from-file .\ubuntu-24.04.4-wsl-amd64.wsl
```

如果文件不在当前目录，就写完整路径：

```powershell
wsl --install --from-file D:\WSL\download\ubuntu-24.04.4-wsl-amd64.wsl
```

安装完成后，查看发行版列表：

```powershell
wsl -l -v
```

然后启动 Ubuntu：

```powershell
wsl -d Ubuntu-24.04
```

如果你的 WSL 版本太旧，不支持 `--from-file`，先执行：

```powershell
wsl --update
```

然后重启终端再试一次。

## 方式二：使用 rootfs tarball 手动导入

如果你拿到的是 `.tar.gz` rootfs 文件，可以用 `wsl --import`。

Ubuntu WSL rootfs 官方目录：

- Ubuntu 24.04 LTS: <https://cloud-images.ubuntu.com/wsl/releases/noble/current/>
- Ubuntu 22.04 LTS: <https://cloud-images.ubuntu.com/wsl/releases/jammy/current/>

国内可以尝试这些 Ubuntu Cloud Images 镜像目录：

- 中国科学技术大学镜像站：<https://mirrors.ustc.edu.cn/ubuntu-cloud-images/wsl/releases/noble/current/>
- 南京大学镜像站：<https://mirror.nju.edu.cn/ubuntu-cloud-images/wsl/releases/noble/current/>

如果要下载 Ubuntu 22.04，把路径里的 `noble` 换成 `jammy`：

```text
https://mirrors.ustc.edu.cn/ubuntu-cloud-images/wsl/releases/jammy/current/
https://mirror.nju.edu.cn/ubuntu-cloud-images/wsl/releases/jammy/current/
```

例如 Ubuntu 24.04 的 amd64 rootfs 文件名通常是：

```text
ubuntu-noble-wsl-amd64-wsl.rootfs.tar.gz
```

Ubuntu 22.04 的 amd64 rootfs 文件名通常是：

```text
ubuntu-jammy-wsl-amd64-wsl.rootfs.tar.gz
```

下载后不要解压。假设文件放在：

```text
D:\WSL\download\ubuntu-noble-wsl-amd64-wsl.rootfs.tar.gz
```

准备一个安装目录：

```text
D:\WSL\Ubuntu24
```

然后在 PowerShell 中导入：

```powershell
wsl --import Ubuntu-24.04 D:\WSL\Ubuntu24 D:\WSL\download\ubuntu-noble-wsl-amd64-wsl.rootfs.tar.gz --version 2
```

检查是否导入成功：

```powershell
wsl -l -v
```

启动：

```powershell
wsl -d Ubuntu-24.04
```

## 导入后创建普通用户

通过 `wsl --import` 导入的系统通常会默认进入 `root` 用户。建议第一件事就是创建自己的普通用户。

进入 Ubuntu 后执行，把 `yourname` 换成自己的用户名：

```bash
adduser yourname
usermod -aG sudo yourname
```

然后设置默认登录用户：

```bash
cat >/etc/wsl.conf <<'EOF'
[user]
default=yourname
EOF
```

退出 Ubuntu：

```bash
exit
```

回到 PowerShell，终止这个发行版：

```powershell
wsl --terminate Ubuntu-24.04
```

再次启动：

```powershell
wsl -d Ubuntu-24.04
```

如果配置正确，进入后就不再是 `root`，而是你刚刚创建的普通用户。

## 初始化系统环境

进入 Ubuntu 后可以先更新基础包：

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl git unzip build-essential ca-certificates
```

如果后续要安装 Node.js、Claude Code、Codex CLI 之类的开发工具，建议先完成这一步。

## 常见问题

### 下载很慢怎么办？

优先用浏览器、下载器或国内镜像站下载 `.wsl` / `.tar.gz` 文件。下载完成后再本地安装，通常比让 `wsl --install` 自己拉取更稳定。

国内镜像站可能不会完整同步每一个 WSL 文件。如果目录里找不到对应文件，换另一个镜像站，或者回到 Ubuntu 官方源下载。

### 可以安装到 D 盘吗？

可以。使用 `wsl --import` 时，第二个参数就是安装位置，例如：

```powershell
wsl --import Ubuntu-24.04 D:\WSL\Ubuntu24 D:\WSL\download\ubuntu-noble-wsl-amd64-wsl.rootfs.tar.gz --version 2
```

这样 WSL 的虚拟磁盘和发行版数据会放在 `D:\WSL\Ubuntu24`。

### 如何删除导入错的发行版？

先确认名字：

```powershell
wsl -l -v
```

如果确认要删除：

```powershell
wsl --unregister Ubuntu-24.04
```

注意：这个命令会删除该发行版的数据。执行前请确认里面没有重要文件。

## 参考资料

- Microsoft Learn: <https://learn.microsoft.com/en-us/windows/wsl/use-custom-distro>
- Ubuntu WSL 安装文档: <https://documentation.ubuntu.com/wsl/latest/howto/install-ubuntu-wsl2/>
- Ubuntu 24.04 发布页: <https://releases.ubuntu.com/noble/>
- Ubuntu WSL rootfs 镜像目录: <https://cloud-images.ubuntu.com/wsl/releases/>
- USTC Ubuntu Cloud Images 镜像说明: <https://mirrors.ustc.edu.cn/help/ubuntu-cloud-images.html>
- NJU Ubuntu releases 镜像目录: <https://mirror.nju.edu.cn/ubuntu-releases/24.04/>
