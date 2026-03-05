## Simple CORS Proxy

Простой CORS‑прокси на Node.js (Express + `http-proxy-middleware`) для обхода ограничений CORS.  
Подходит как для локальной разработки, так и для использования в виде глобальной npm‑утилиты или скомпилированного бинарника.

---

## Возможности

- **Обход CORS** – добавляет заголовок `Access-Control-Allow-Origin: *` ко всем ответам.
- **Поддержка preflight‑запросов** – корректно отвечает на OPTIONS‑запросы 
- **Гибкая конфигурация цели** – целевой URL задаётся через:
  - флаг `--target` / `-t`,
  - либо переменную окружения `TARGET_URL`,
- **Гибкая конфигурация порта** – порт задаётся через:
  - флаг `--port` / `-p`,
  - либо переменную окружения `PORT`,
  - либо значение по умолчанию (`3000`).
- **CLI‑утилита** – можно устанавливать как глобальный npm‑пакет и вызывать командой `simple-cors-proxy`.
- **Бинарники через `pkg`** – сборка в standalone‑исполняемые файлы для Windows, Linux и macOS.
- **Красивое логирование** – все запросы логируются с помощью `signale`.

---

## Установка

### Установка из исходников (локальная разработка)

```bash
git clone <URL_РЕПОЗИТОРИЯ>
cd Simple-CORS-proxy
npm install
```

### Установка как глобальная npm‑утилита

```bash
npm install -g @edheldor/simple-cors-proxy
```

После этого команда `simple-cors-proxy` будет доступна глобально.

---

## CLI‑интерфейс

Поддерживаемые флаги:

- `-p`, `--port` – порт локального прокси‑сервера.
- `-t`, `--target` – целевой URL, на который проксируются запросы (обязательно с `http://` или `https://`).
- `-h`, `--help` – показать справку и выйти.

Переменные окружения:

- `PORT` – порт локального прокси (по умолчанию `3000`).
- `TARGET_URL` – целевой URL (по умолчанию `https://example.com`).

Приоритет значений:

1. CLI‑флаг (`--port`, `--target`)
2. Переменная окружения (`PORT`, `TARGET_URL`)
3. Вшитое значение по умолчанию

---

## Примеры запуска

### 1. Прямой запуск через Node.js

#### Минимальный запуск (всё по умолчанию)

```bash
node server.js
```

Что произойдёт:

- Порт: `3000`
- Цель: `https://example.com`

#### Указать только целевой URL (через env)

```bash
TARGET_URL=https://api.example.com node server.js
```

#### Указать только порт (через env)

```bash
PORT=4000 node server.js
```

#### Указать и порт, и цель (через env)

```bash
PORT=4000 TARGET_URL=https://api.example.com node server.js
```

#### Указать порт и цель через CLI‑флаги

```bash
node server.js --port 4000 --target https://api.example.com
```

#### Смешанный вариант: порт через CLI, URL через env

```bash
TARGET_URL=https://api.example.com node server.js --port 5000
```

#### Показать справку по CLI

```bash
node server.js --help
# или
node server.js -h
```

---

## Запуск через npm‑scripts

В `package.json` определены скрипты:

- `run` – обычный запуск:

  ```bash
  npm run run
  # под капотом: node server.js
  ```

- `run:example` – пример запуска с заданными флагами:

  ```bash
  npm run run:example
  # под капотом: node server.js --port 4000 --target https://api.example.com
  ```

- `dev` – запуск в режиме разработки (с авто‑перезапуском через `nodemon`):

  ```bash
  npm run dev
  # под капотом: nodemon server.js
  ```

- `dev:example` – пример dev‑запуска с заданными флагами:

  ```bash
  npm run dev:example
  # под капотом: nodemon server.js --port 4000 --target https://api.example.com
  ```

### Передача своих флагов в npm‑скрипты

Всё, что идёт после `--`, передаётся в `server.js` как аргументы командной строки:

```bash
# Задать свой порт и целевой URL при запуске обычного скрипта
npm run run -- --port 5000 --target https://my.api.com

# То же самое в dev-режиме с nodemon
npm run dev -- --port 8080 --target https://backend.local
```

Можно комбинировать с env‑переменными:

```bash
PORT=5000 TARGET_URL=https://api.example.com npm run run
```

---

## Использование как глобальной npm‑утилиты

После установки:

```bash
npm install -g @edheldor/simple-cors-proxy
```

Команда `simple-cors-proxy` будет доступна из любого места.

### Примеры

#### Запуск с параметрами по умолчанию

```bash
simple-cors-proxy
```

#### Задать целевой URL и порт через флаги

```bash
simple-cors-proxy --port 4000 --target https://api.example.com
```

#### Задать параметры через переменные окружения

```bash
PORT=5000 TARGET_URL=https://api.example.com simple-cors-proxy
```

#### Смешанный вариант

```bash
TARGET_URL=https://api.example.com simple-cors-proxy --port 8080
```

#### Показать справку

```bash
simple-cors-proxy --help
```

---

## Сборка бинарников через `pkg`

Проект настроен для сборки в standalone‑исполняемые файлы с помощью [`pkg`](https://github.com/vercel/pkg).  
Конфигурация хранится в `package.json` (секция `pkg`).

### Общая сборка

```bash
npm run build
```

Соберутся бинарники для:

- `node18-linux-x64`
- `node18-win-x64`
- `node18-macos-x64`

Файлы появятся в папке `dist/`.

### Сборка под конкретную платформу

- **Windows**:

  ```bash
  npm run build:win
  ```

- **Linux**:

  ```bash
  npm run build:linux
  ```

- **macOS**:

  ```bash
  npm run build:mac
  ```

### Запуск бинарников с параметрами

`pkg` сохраняет и `process.argv`, и переменные окружения, так что параметры работают так же, как и у `node server.js`.

#### Linux / macOS

```bash
# только бинарник, всё по умолчанию
./dist/simple-cors-proxy-linux

# задать порт и целевой URL через флаги
./dist/simple-cors-proxy-linux --port 4000 --target https://api.example.com

# задать через env
PORT=5000 TARGET_URL=https://api.example.com ./dist/simple-cors-proxy-linux
```

#### Windows (PowerShell)

```powershell
.\dist\simple-cors-proxy-win.exe

.\dist\simple-cors-proxy-win.exe --port 4000 --target https://api.example.com

$env:PORT = 5000
$env:TARGET_URL = "https://api.example.com"
.\dist\simple-cors-proxy-win.exe
```

#### Windows (cmd)

```cmd
dist\simple-cors-proxy-win.exe

dist\simple-cors-proxy-win.exe --port 4000 --target https://api.example.com

set PORT=5000
set TARGET_URL=https://api.example.com
dist\simple-cors-proxy-win.exe
```

---

## Конфигурация и расширение

Основная логика находится в `server.js`:

- Настройка порта и целевого URL.
- Обработка preflight‑запросов.
- Логирование запросов.
- Настройка прокси (`createProxyMiddleware`).

Что можно поменять/расширить:

- Добавить авторизацию (например, по токену или API‑ключу) перед проксированием.
- Фильтровать/переписывать заголовки запросов и ответов.
- Ограничивать список допустимых методов / путей.
- Добавить более строгую CORS‑конфигурацию (не `*`, а конкретные origin).

---

## Форматирование кода

В проекте используется Prettier:

```bash
npm run format
```

Проверка без автозамен:

```bash
npm run format:check
```
---

## Автор

Edheldor

---

## Используемые библиотеки

- [Express](https://expressjs.com/)
- [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)
- [signale](https://github.com/klaussinani/signale)
- [pkg](https://github.com/vercel/pkg)
- [Prettier](https://prettier.io/)