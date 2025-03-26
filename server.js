const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3000; // Порт вашего прокси-сервера
const TARGET_URL = 'https://example.com'; // URL удаленного сервера

// // Включаем CORS
// app.use(cors());

// Обработка запросов OPTIONS
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(204); // No Content
});

// Создаем прокси middleware один раз
const proxy = createProxyMiddleware({
    target: TARGET_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        // Логируем информацию о проксируемом запросе
        console.log(`Proxying request to: ${TARGET_URL}${req.url}`);
        console.log('Request Method:', req.method);
        console.log('Request Headers:', req.headers);
    },
    onProxyRes: (proxyRes, req, res) => {
        // Здесь можно модифицировать ответ от удаленного сервера
        // Например, добавляем CORS заголовки
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
});

// Настраиваем прокси
app.use('/', (req, res, next) => {
    // Логируем информацию о запросе перед проксированием
    console.log(`Received request: ${req.method} ${req.url}`);

    // Прокси только если метод не OPTIONS
    if (req.method !== 'OPTIONS') {
        proxy(req, res, next); // Вызываем прокси middleware
    } else {
        next(); // Если метод OPTIONS, просто передаем управление дальше
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});