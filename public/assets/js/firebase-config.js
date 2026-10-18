/*
 * Настройки Firebase для входа и регистрации.
 *
 * Пока здесь null — сайт работает в ДЕМО-режиме: аккаунты хранятся только
 * в браузере посетителя (для проверки дизайна и переходов этого достаточно).
 *
 * Чтобы включить настоящую регистрацию (аккаунты хранит Firebase):
 *  1. Firebase Console → Build → Authentication → Get started →
 *     Sign-in method → Email/Password → Enable.
 *  2. Project settings (шестерёнка) → Your apps → «</>» (Web) → зарегистрируйте
 *     приложение и скопируйте объект firebaseConfig.
 *  3. Вставьте его ниже вместо null, сохраните и выполните
 *     firebase deploy --only hosting
 *
 * apiKey веб-приложения Firebase не является секретом — его можно хранить в коде.
 *
 * window.VOYAGE_FIREBASE = {
 *   apiKey: "...",
 *   authDomain: "voyage-c2b05.firebaseapp.com",
 *   projectId: "voyage-c2b05",
 *   appId: "..."
 * };
 */
window.VOYAGE_FIREBASE = null;
