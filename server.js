const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { createConsola } = require('consola');

const app = express();
const PORT = 3000; // Порт вашего прокси-сервера
const TARGET_URL = 'https://example.com'; // URL удаленного сервера

app.use('*', (req, res, next) => {
  // логгируем все входящие запросы
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  console.log(`Received request: ${req.method} ${fullUrl}`);
  next();
});

app.use('/', (req, res, next) => {
  // Прокси только если метод не OPTIONS
  if (req.method !== 'OPTIONS') {
    proxy(req, res, next); // Вызываем прокси middleware
  } else {
    next(); // Если метод OPTIONS, просто передаем управление дальше
  }
});

// Создаем прокси middleware
const proxy = createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      // Логируем информацию о проксируемом запросе
      console.log(`Proxying request to: ${req.method} ${TARGET_URL}${req.url}`);
    },
    proxyRes: (proxyRes, req, res) => {
      // Здесь можно модифицировать ответ от удаленного сервера
      // Например, добавляем CORS заголовки
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
  },
});

// Обработка запросов OPTIONS
app.options('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(204); // No Content
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});
