/**
 * Выполняет сборку проекта для GitHub Pages
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m'
};

try {
  // Шаг 1: Сборка клиентской части
  console.log(`${colors.bright}${colors.blue}Шаг 1: Сборка клиентской части...${colors.reset}`);
  execSync('npm run build', { stdio: 'inherit' });

  // Шаг 2: Запуск скрипта для GitHub Pages
  console.log(`\n${colors.bright}${colors.blue}Шаг 2: Запуск скрипта для GitHub Pages...${colors.reset}`);
  execSync('node scripts/build-for-github.js', { stdio: 'inherit' });

  console.log(`\n${colors.bright}${colors.green}Сборка завершена успешно! Файлы готовы к деплою.${colors.reset}`);
  console.log(`\n${colors.yellow}Чтобы запустить деплой, выполните: git push${colors.reset}`);
} catch (error) {
  console.error(`\n${colors.bright}\x1b[31mОшибка сборки:${colors.reset}`, error.message);
  process.exit(1);
}