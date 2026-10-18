# Вояж-Тур — статический сайт

Многостраничный сайт на HTML и Tailwind CSS (CDN). Хостинг — Firebase Hosting (проект `voyage-c2b05`).
Дизайн-система: [source/vibrant_horizon/DESIGN.md](source/vibrant_horizon/DESIGN.md).

## Структура

```
public/              ← всё, что попадает в интернет (и только это)
  index.html           перенаправление на /tours/
  404.html             страница «не найдено»
  tours/ treatment/ destinations/ about/      основные разделы
  contacts/ privacy/ faq/                     служебные страницы
  login/ register/ account/                   вход, регистрация, личный кабинет
  assets/css/site.css, assets/js/             общие стили и скрипты
source/              ← исходники дизайна (_1…_6: выгрузка с картинками); на сайт не попадают
backend/             ← старые серверы (C# и Node+PostgreSQL); сейчас сайтом не используются
firebase.json        настройки хостинга
```

Страницы правятся прямо в `public/`. Старый скрипт-генератор `build-pages.py` удалён: он собирал
страницы из `source/_N`, а теперь они поддерживаются вручную.

## Запуск локально

```bash
npm start            # или: npx --yes serve public
```

Откройте адрес из терминала. Либо через Firebase: `npm run emulate` → http://localhost:5000.
Двойной клик по `index.html` не рекомендуется: относительные пути и переходы между папками
работают только через сервер.

## Публикация

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting      # или: npm run deploy
```

Адрес сайта: https://voyage-c2b05.web.app

## Вход и регистрация

Собственный сервер не нужен.

- **Сейчас — демо-режим.** Аккаунты хранятся в браузере посетителя. Можно войти как
  `test@voyage.ru` / `password123` или зарегистрироваться. Подходит для показа и проверки.
  Это не настоящая защита: аккаунты не общие между устройствами.
- **Настоящие аккаунты — Firebase Authentication.**
  1. Firebase Console → Authentication → Sign-in method → включите Email/Password.
  2. Project settings → Your apps → Web → скопируйте `firebaseConfig`.
  3. Вставьте его в [public/assets/js/firebase-config.js](public/assets/js/firebase-config.js)
     вместо `null` и сделайте `firebase deploy --only hosting`.
  После этого заработает и «Забыли пароль?».

## Папка backend

Прежние серверы (`dotnet-server` на C#, `node-postgres` с PostgreSQL) оставлены как есть,
но Firebase Hosting их не запускает, и сайту они больше не нужны. Если запускать их локально,
они раздают `public/`, но страницы входа всё равно используют `assets/js/auth.js`, а не их `/api`.
"# Voyage_Site2" 
