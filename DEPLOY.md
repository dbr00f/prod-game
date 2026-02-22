# 🚀 Деплой Pomodoro Battle

Полное руководство по развертыванию проекта на Vercel и интеграции с Telegram Mini Apps.

---

## 📋 Содержание

1. [Подготовка репозитория](#1-подготовка-репозитория)
2. [Деплой на Vercel](#2-деплой-на-vercel)
3. [Настройка Telegram Mini App](#3-настройка-telegram-mini-app)
4. [Полезные команды](#4-полезные-команды)

---

## 1. Подготовка репозитория

### Создание репозитория на GitHub

1. Перейди на [github.com](https://github.com) и войди в аккаунт
2. Нажми **New repository** (кнопка `+` в правом верхнем углу)
3. Заполни поля:
   - **Repository name**: `pomodoro-battle`
   - **Description**: `Геймифицированный планировщик задач`
   - **Public** (для бесплатного Vercel)
4. Нажми **Create repository**

### Инициализация Git и пуш

```bash
# Перейди в папку проекта
cd C:\Users\Alexander\Documents\GitHub\prod-game

# Инициализируй git (если ещё не)
git init

# Добавь все файлы
git add .

# Создай первый коммит
git commit -m "Initial commit: Pomodoro Battle game"

# Добавь remote
git remote add origin https://github.com/TVOY_USERNAME/pomodoro-battle.git

# Запуши в main
git branch -M main
git push -u origin main
```

---

## 2. Деплой на Vercel

### Способ 1: Через Vercel Dashboard (рекомендуется)

1. Перейди на [vercel.com](https://vercel.com)
2. Войди через GitHub аккаунт
3. Нажми **Add New...** → **Project**
4. Выбери репозиторий `pomodoro-battle`
5. Настройки оставь по умолчанию:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Нажми **Deploy**
7. Жди завершения (~2-3 минуты)
8. Получи ссылку: `https://pomodoro-battle-твой-логин.vercel.app`

### Способ 2: Через Vercel CLI

```bash
# Установи Vercel CLI
npm i -g vercel

# Авторизуйся
vercel login

# Деплой
vercel

# Продакшн деплой
vercel --prod
```

### Переменные окружения (если понадобятся)

В Vercel Dashboard → Settings → Environment Variables:

```
# Для будущих фич (Grok AI)
GROK_API_KEY=your_api_key_here
```

---

## 3. Настройка Telegram Mini App

### Шаг 1: Создание бота через BotFather

1. Открой Telegram и найди **@BotFather**
2. Отправь команду `/newbot`
3. Введи имя бота: `Pomodoro Battle`
4. Введи username: `pomodoro_battle_bot` (или свой)
5. **Сохрани токен**: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`

### Шаг 2: Настройка Web App

В @BotFather отправь команды:

```
/setmenubutton
```

Выбери своего бота → введи текст кнопки: `⚔️ Играть`

```
/setnewapp
```

Заполни поля:
- **Short name**: `pomodoro`
- **Title**: `Pomodoro Battle`
- **Description**: `Геймифицированный планировщик задач`
- **Web App URL**: `https://твой-домен.vercel.app`
- **Photo**: (опционально, можно пропустить)

### Шаг 3: Готово!

Теперь в твоём боте появится кнопка **⚔️ Играть**, которая откроет Web App.

---

## 4. Полезные команды

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Продакшн билд (проверка перед деплоем)
npm run build

# Запуск продакшн версии локально
npm run start

# Линтинг
npm run lint
```

### Git команды

```bash
# Проверить статус
git status

# Добавить изменения
git add .

# Коммит
git commit -m "Описание изменений"

# Пуш
git push

# Пулл изменений
git pull
```

### Очистка localStorage (для тестов)

Открой консоль браузера (F12) и выполни:

```javascript
localStorage.removeItem('pomodoro-battle-storage')
location.reload()
```

---

## 📱 PWA Установка

Приложение можно установить на телефон как PWA:

1. Открой сайт в Chrome/Safari
2. Нажми "Добавить на главный экран" в меню браузера
3. Приложение будет работать как нативное

---

## 🔧 Структура проекта

```
pomodoro-battle/
├── app/
│   ├── layout.tsx      # Главный layout + мета-теги
│   ├── page.tsx        # Главный экран
│   └── globals.css     # Глобальные стили
├── components/
│   ├── PlayerStats.tsx # Статы игрока
│   ├── BossStats.tsx   # Статы босса дня
│   ├── TaskList.tsx    # Список задач
│   ├── AddTaskForm.tsx # Форма добавления
│   ├── BattleArena.tsx # Арена битвы
│   ├── BattleSetup.tsx # Настройка боя
│   ├── SkillsPanel.tsx # Панель способностей
│   └── ErrorBoundary.tsx # Обработка ошибок
├── store/
│   └── useGameStore.ts # Zustand store с persist
├── types/
│   └── index.ts        # TypeScript типы
├── public/
│   └── manifest.json   # PWA манифест
├── tailwind.config.js  # Конфиг Tailwind
├── next.config.js      # Конфиг Next.js
└── package.json        # Зависимости
```

---

## ⚡ Фичи

- ✅ Pomodoro таймер (1-60 минут)
- ✅ Система уровней и XP
- ✅ Ежедневные боссы
- ✅ 3 активные способности
- ✅ Сохранение прогресса в localStorage
- ✅ PWA поддержка
- ✅ Telegram Mini App ready
- ✅ Mobile-first дизайн
- ✅ Error Boundary

---

## 🐛 Troubleshooting

### Проблема: Белый экран
**Решение**: Открой консоль (F12), проверь ошибки. Если есть ошибки в localStorage — сбрось данные.

### Проблема: Не работает в Telegram
**Решение**: Проверь, что URL в BotFather начинается с `https://`

### Проблема: Стили не грузятся
**Решение**: Убедись, что Tailwind CSS правильно настроен и `globals.css` импортирован.

---

**Босс, проект готов к битве в продакшене! Твоя ссылка на деплой ждет тебя.** ⚔️
