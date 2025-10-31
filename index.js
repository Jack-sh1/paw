#!/usr/bin/env node

const { Command } = require('commander');
const clipboardy = require('clipboardy');
const fs = require('fs');
const path = require('path');
const os = require('os');

const program = new Command();

// 历史记录文件路径
const HISTORY_FILE = path.join(os.homedir(), '.password-generator-history.json');

// 历史记录管理函数
function loadHistory() {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const data = fs.readFileSync(HISTORY_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('⚠️  读取历史记录失败，将创建新的历史记录');
  }
  return [];
}

function saveHistory(history) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (error) {
    console.warn('⚠️  保存历史记录失败:', error.message);
  }
}

function addToHistory(password, length, includeNumbers, includeSymbols) {
  const history = loadHistory();
  const entry = {
    password,
    length,
    includeNumbers,
    includeSymbols,
    timestamp: new Date().toISOString(),
    components: []
  };
  
  // 记录密码组成
  entry.components.push('字母');
  if (includeNumbers) entry.components.push('数字');
  if (includeSymbols) entry.components.push('特殊符号');
  
  history.unshift(entry); // 添加到开头
  
  // 限制历史记录数量为50条
  if (history.length > 50) {
    history.splice(50);
  }
  
  saveHistory(history);
}

// 密码生成函数
function generatePassword(length, includeNumbers, includeSymbols) {
  // 基础字符集（字母）
  let charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  // 添加数字
  if (includeNumbers) {
    charset += '0123456789';
  }
  
  // 添加特殊符号
  if (includeSymbols) {
    charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
  }
  
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

// 配置命令行程序
program
  .name('password-generator')
  .description('一个简单而强大的密码生成器')
  .version('0.0.2');

// 主命令
program
  .argument('[length]', '密码长度', '12')
  .option('-n, --no-numbers', '不包含数字')
  .option('-s, --no-symbols', '不包含特殊符号')
  .option('--no-copy', '不复制到剪贴板')
  .action(async (lengthArg, options) => {
    try {
      const length = parseInt(lengthArg);
      
      // 验证密码长度
      if (isNaN(length) || length < 1) {
        console.error('❌ 错误: 密码长度必须是大于0的数字');
        process.exit(1);
      }
      
      if (length > 128) {
        console.error('❌ 错误: 密码长度不能超过128位');
        process.exit(1);
      }
      
      // 生成密码
      const includeNumbers = options.numbers !== false;
      const includeSymbols = options.symbols !== false;
      
      const password = generatePassword(length, includeNumbers, includeSymbols);
      
      // 显示生成的密码
      console.log('\n🔐 生成的密码:');
      console.log(`📋 ${password}`);
      console.log(`📏 长度: ${password.length} 位`);
      
      // 显示密码组成
      const components = [];
      components.push('字母');
      if (includeNumbers) components.push('数字');
      if (includeSymbols) components.push('特殊符号');
      console.log(`🧩 包含: ${components.join(', ')}`);
      
      // 复制到剪贴板
      if (options.copy !== false) {
        try {
          await clipboardy.write(password);
          console.log('✅ 密码已复制到剪贴板!');
        } catch (error) {
          console.log('⚠️  无法复制到剪贴板，但密码生成成功');
        }
      }
      
      // 保存到历史记录
      addToHistory(password, length, includeNumbers, includeSymbols);
      
      console.log('');
      
    } catch (error) {
      console.error('❌ 生成密码时发生错误:', error.message);
      process.exit(1);
    }
  });

// 添加示例命令
program
  .command('examples')
  .description('显示使用示例')
  .action(() => {
    console.log('\n📚 使用示例:');
    console.log('');
    console.log('  # 生成12位默认密码（包含字母、数字、特殊符号）');
    console.log('  $ password-generator');
    console.log('');
    console.log('  # 生成16位密码');
    console.log('  $ password-generator 16');
    console.log('');
    console.log('  # 生成8位密码，不包含数字');
    console.log('  $ password-generator 8 --no-numbers');
    console.log('');
    console.log('  # 生成20位密码，不包含特殊符号');
    console.log('  $ password-generator 20 --no-symbols');
    console.log('');
    console.log('  # 生成密码但不复制到剪贴板');
    console.log('  $ password-generator 12 --no-copy');
    console.log('');
    console.log('  # 生成只包含字母的密码');
    console.log('  $ password-generator 10 --no-numbers --no-symbols');
    console.log('');
  });

// 历史记录命令
program
  .command('history')
  .description('查看密码生成历史记录')
  .option('-n, --number <count>', '显示的历史记录数量', '10')
  .action((options) => {
    try {
      const history = loadHistory();
      const count = parseInt(options.number);
      
      if (history.length === 0) {
        console.log('\n📝 暂无历史记录');
        console.log('💡 生成密码后会自动保存到历史记录中\n');
        return;
      }
      
      const displayCount = Math.min(count, history.length);
      console.log(`\n📝 最近 ${displayCount} 条密码生成记录:\n`);
      
      for (let i = 0; i < displayCount; i++) {
        const entry = history[i];
        const date = new Date(entry.timestamp);
        const timeStr = date.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
        
        console.log(`${i + 1}. 🔐 ${entry.password}`);
        console.log(`   📏 长度: ${entry.length} 位`);
        console.log(`   🧩 包含: ${entry.components.join(', ')}`);
        console.log(`   🕒 时间: ${timeStr}`);
        console.log('');
      }
      
      if (history.length > displayCount) {
        console.log(`💡 还有 ${history.length - displayCount} 条历史记录，使用 -n ${history.length} 查看全部\n`);
      }
      
    } catch (error) {
      console.error('❌ 读取历史记录失败:', error.message);
    }
  });

// 清除历史记录命令
program
  .command('clear-history')
  .description('清除所有历史记录')
  .option('-y, --yes', '跳过确认直接清除')
  .action(async (options) => {
    try {
      const history = loadHistory();
      
      if (history.length === 0) {
        console.log('\n📝 历史记录已经是空的\n');
        return;
      }
      
      if (!options.yes) {
        // 简单的确认机制
        console.log(`\n⚠️  即将清除 ${history.length} 条历史记录`);
        console.log('💡 如果确认清除，请重新运行命令并添加 -y 参数:');
        console.log('   paw clear-history -y\n');
        return;
      }
      
      // 清除历史记录
      saveHistory([]);
      console.log('\n✅ 历史记录已清除\n');
      
    } catch (error) {
      console.error('❌ 清除历史记录失败:', error.message);
    }
  });

// 解析命令行参数
program.parse();