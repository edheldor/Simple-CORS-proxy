/**
 * Простой CORS‑прокси на базе Express.
 *
 * - Принимаем запросы от фронтенда.
 * - Проксируем их на `TARGET_URL`.
 * - На ответы добавляем CORS‑заголовки, чтобы браузер не блокировал запросы.
 */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const signale = require('signale');

const app = express();

// Порт, на котором поднимается локальный прокси‑сервер.
// Можно переопределить через переменную окружения PORT.
const PORT = process.env.PORT ?? 3000;

// Базовый адрес целевого (удалённого) сервера, на который будут уходить запросы.
// Обязательно указывать протокол (http / https).
const TARGET_URL = process.env.TARGET_URL ?? 'https://example.com';

// Глобальный логгер всех входящих запросов в прокси.
app.use('*', (req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  signale.success(`Received request: ${req.method} ${fullUrl}`);
  next();
});

// Оборачиваем прокси‑middleware, чтобы фильтровать служебные CORS‑запросы (OPTIONS).
// Это позволяет отдельно и более явно обработать preflight‑запросы ниже через `app.options`.
app.use('/', (req, res, next) => {
  if (req.method !== 'OPTIONS') {
    proxy(req, res, next);
  } else {
    // Для OPTIONS отдаём управление дальше, до хэндлера `app.options('*', ...)`.
    next();
  }
});

// Основной прокси‑middleware.
// Весь остальной код выше/ниже лишь подготавливает запросы и настраивает CORS‑ответы.
const proxy = createProxyMiddleware({
  target: TARGET_URL,
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req, res) => {
      // Логируем конечный адрес и метод запроса, который уходит на удалённый сервер.
      signale.success(`Proxying request to: ${req.method} ${TARGET_URL}${req.url}`);
    },
    proxyRes: (proxyRes, req, res) => {
      // На этом этапе ответ уже пришёл от удалённого сервера,
      // но ещё не отправлен клиенту — можно модифицировать заголовки/тело.
      // Добавляем CORS‑заголовок, чтобы браузер позволял кросс‑доменные запросы.
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
  },
});

// Обработка preflight‑CORS‑запросов (OPTIONS), которые браузер шлёт перед "настоящим" запросом.
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(204); // No Content
});

// Старт HTTP‑сервера прокси.
app.listen(PORT, () => {
  signale.start(`Proxy server is running on port ${PORT}`);
  signale.success(`Target server address is ${TARGET_URL}`);
});
