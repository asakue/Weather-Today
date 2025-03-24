/**
 * Скрипт для подготовки сборки к размещению на GitHub Pages
 * Копирует необходимые файлы в папку dist после основной сборки
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получение абсолютного пути к текущему файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Пути
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const stylesDir = path.resolve(rootDir, 'styles');
const distStylesDir = path.resolve(distDir, 'styles');

// Создать папку стилей в dist, если она не существует
if (!fs.existsSync(distStylesDir)) {
  fs.mkdirSync(distStylesDir, { recursive: true });
}

// Копирование index.html
console.log('Копирование index.html в dist...');
fs.copyFileSync(
  path.resolve(rootDir, 'index.html'),
  path.resolve(distDir, 'index.html')
);

// Копирование CSS файлов
console.log('Копирование файлов стилей в dist/styles...');
const cssFiles = fs.readdirSync(stylesDir).filter(file => file.endsWith('.css'));
cssFiles.forEach(file => {
  fs.copyFileSync(
    path.resolve(stylesDir, file),
    path.resolve(distStylesDir, file)
  );
});

// Создание конфигурационного файла для GitHub Pages
console.log('Создание файла .nojekyll...');
fs.writeFileSync(path.resolve(distDir, '.nojekyll'), '');

console.log('Сборка для GitHub Pages успешно завершена!');