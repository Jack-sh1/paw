# 🔐 密码生成器 CLI

一个简单而强大的命令行密码生成器，基于 Node.js 和 Commander.js 构建。

## ✨ 特性

- 🎯 **灵活的长度控制** - 生成 1-128 位任意长度的密码
- 🔢 **可选数字** - 可以选择是否包含数字 (0-9)
- 🔣 **可选特殊符号** - 可以选择是否包含特殊符号 (!@#$%^&*等)
- 📋 **自动复制** - 生成的密码自动复制到剪贴板
- 🎨 **美观输出** - 彩色和图标化的命令行界面
- ⚡ **快速便捷** - 一条命令即可生成安全密码

## 🚀 安装

### 本地安装
```bash
# 克隆项目
git clone <repository-url>
cd password

# 安装依赖
npm install

# 全局链接（可选）
npm link
```

### 全局安装（如果发布到 npm）
```bash
npm install -g password-generator-cli
```

## 📖 使用方法

### 基本用法

```bash
# 生成12位默认密码（包含字母、数字、特殊符号）
node index.js

# 或者如果已全局安装
password-generator
pwgen  # 简短别名
```

### 指定密码长度

```bash
# 生成16位密码
node index.js 16

# 生成8位密码
node index.js 8
```

### 自定义密码组成

```bash
# 生成不包含数字的密码
node index.js 12 --no-numbers

# 生成不包含特殊符号的密码
node index.js 12 --no-symbols

# 生成只包含字母的密码
node index.js 12 --no-numbers --no-symbols

# 生成密码但不复制到剪贴板
node index.js 12 --no-copy
```

### 查看使用示例

```bash
node index.js examples
```

### 查看帮助

```bash
node index.js --help
```

## 🎯 命令选项

| 选项 | 简写 | 描述 | 默认值 |
|------|------|------|--------|
| `[length]` | - | 密码长度 | 12 |
| `--no-numbers` | `-n` | 不包含数字 | false |
| `--no-symbols` | `-s` | 不包含特殊符号 | false |
| `--no-copy` | - | 不复制到剪贴板 | false |
| `--help` | `-h` | 显示帮助信息 | - |
| `--version` | `-V` | 显示版本号 | - |

## 📝 使用示例

```bash
# 示例1: 生成默认12位密码
$ node index.js
🔐 生成的密码:
📋 aB3$kL9@mN2!
📏 长度: 12 位
🧩 包含: 字母, 数字, 特殊符号
✅ 密码已复制到剪贴板!

# 示例2: 生成16位纯字母密码
$ node index.js 16 --no-numbers --no-symbols
🔐 生成的密码:
📋 aBcDeFgHiJkLmNoP
📏 长度: 16 位
🧩 包含: 字母
✅ 密码已复制到剪贴板!

# 示例3: 生成8位密码，不包含特殊符号
$ node index.js 8 --no-symbols
🔐 生成的密码:
📋 aB3kL9mN
📏 长度: 8 位
🧩 包含: 字母, 数字
✅ 密码已复制到剪贴板!
```

## 🔧 技术栈

- **Node.js** - JavaScript 运行时
- **Commander.js** - 命令行界面框架
- **Clipboardy** - 跨平台剪贴板操作

## 📋 字符集说明

- **字母**: a-z, A-Z (52个字符)
- **数字**: 0-9 (10个字符)
- **特殊符号**: !@#$%^&*()_+-=[]{}|;:,.<>? (25个字符)

## 🛡️ 安全性

- 使用 `Math.random()` 生成随机数
- 支持最长128位密码
- 字符集可自定义组合
- 不存储或记录生成的密码

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

ISC License

## 🔗 相关链接

- [Commander.js 文档](https://github.com/tj/commander.js)
- [Clipboardy 文档](https://github.com/sindresorhus/clipboardy)
- [Node.js 官网](https://nodejs.org/)