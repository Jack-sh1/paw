#!/usr/bin/env node

const { Command } = require('commander');
const clipboardy = require('clipboardy');

const program = new Command();

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
  .version('0.0.1');

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

// 解析命令行参数
program.parse();