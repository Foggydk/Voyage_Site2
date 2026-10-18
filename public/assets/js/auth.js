/*
 * Вход и регистрация без собственного сервера.
 *  - Если в firebase-config.js указаны настройки — используется Firebase Authentication.
 *  - Иначе работает демо-режим: аккаунты лежат в localStorage браузера.
 * Страницы используют только window.VoyageAuth.
 */
(function () {
  var SESSION_KEY = 'voyage_user';
  var USERS_KEY = 'voyage_users';
  var DEMO = { email: 'test@voyage.ru', password: 'password123', name: 'Тестовый пользователь' };
  var FB_VERSION = '10.12.2';

  var cfg = window.VOYAGE_FIREBASE;
  var useFirebase = !!(cfg && cfg.apiKey);

  // localStorage может быть недоступен (приватный режим и т.п.) — тогда храним в памяти
  var memory = {};
  function read(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return memory[key] || null; }
  }
  function write(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { memory[key] = value; }
  }
  function remove(key) {
    try { window.localStorage.removeItem(key); } catch (e) { delete memory[key]; }
  }
  function fail(message) { return Promise.reject(new Error(message)); }

  function normEmail(email) { return String(email || '').trim().toLowerCase(); }
  function nameFromEmail(email) { return String(email || '').split('@')[0]; }

  function setSession(user) { write(SESSION_KEY, JSON.stringify(user)); return user; }

  function current() {
    try {
      var u = JSON.parse(read(SESSION_KEY));
      return u && u.email ? u : null;
    } catch (e) { return null; }
  }

  // ---------- демо-режим ----------
  function hash(text) {
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) {
          return ('0' + b.toString(16)).slice(-2);
        }).join('');
      });
    }
    return Promise.resolve('plain:' + text);
  }
  function users() {
    try { return JSON.parse(read(USERS_KEY)) || {}; } catch (e) { return {}; }
  }

  var local = {
    register: function (name, email, password) {
      if (users()[email]) return fail('Пользователь с таким email уже существует');
      return hash(email + ':' + password).then(function (h) {
        var all = users();
        all[email] = { name: name, hash: h };
        write(USERS_KEY, JSON.stringify(all));
        return setSession({ email: email, name: name });
      });
    },
    login: function (email, password) {
      if (email === DEMO.email && password === DEMO.password) {
        return Promise.resolve(setSession({ email: email, name: DEMO.name }));
      }
      var rec = users()[email];
      if (!rec) return fail('Неверный email или пароль');
      return hash(email + ':' + password).then(function (h) {
        if (h !== rec.hash) throw new Error('Неверный email или пароль');
        return setSession({ email: email, name: rec.name });
      });
    },
    logout: function () { return Promise.resolve(); },
    resetPassword: function () {
      return fail('Восстановление пароля заработает после подключения Firebase (см. assets/js/firebase-config.js)');
    }
  };

  // ---------- Firebase ----------
  var fbPromise = null;
  function fb() {
    if (!fbPromise) {
      var base = 'https://www.gstatic.com/firebasejs/' + FB_VERSION + '/';
      fbPromise = Promise.all([import(base + 'firebase-app.js'), import(base + 'firebase-auth.js')])
        .then(function (m) {
          var app = m[0].initializeApp(cfg);
          return { auth: m[1].getAuth(app), api: m[1] };
        });
    }
    return fbPromise;
  }
  var FB_ERRORS = {
    'auth/invalid-credential': 'Неверный email или пароль',
    'auth/user-not-found': 'Неверный email или пароль',
    'auth/wrong-password': 'Неверный email или пароль',
    'auth/invalid-email': 'Некорректный email',
    'auth/email-already-in-use': 'Пользователь с таким email уже существует',
    'auth/weak-password': 'Пароль должен быть не короче 6 символов',
    'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
    'auth/network-request-failed': 'Нет связи с сервером. Проверьте интернет',
    'auth/operation-not-allowed': 'В Firebase не включён вход по Email/Password'
  };
  function fbError(e) {
    return new Error(FB_ERRORS[e && e.code] || 'Ошибка. Попробуйте ещё раз позже');
  }
  function fbUser(u, fallbackName) {
    return { email: u.email, name: u.displayName || fallbackName || nameFromEmail(u.email), uid: u.uid };
  }

  var remote = {
    register: function (name, email, password) {
      return fb().then(function (f) {
        return f.api.createUserWithEmailAndPassword(f.auth, email, password).then(function (cred) {
          return f.api.updateProfile(cred.user, { displayName: name }).then(function () {
            return setSession(fbUser(cred.user, name));
          });
        });
      }).catch(function (e) { throw fbError(e); });
    },
    login: function (email, password) {
      return fb().then(function (f) {
        return f.api.signInWithEmailAndPassword(f.auth, email, password);
      }).then(function (cred) { return setSession(fbUser(cred.user)); })
        .catch(function (e) { throw fbError(e); });
    },
    logout: function () {
      return fb().then(function (f) { return f.api.signOut(f.auth); }).catch(function () {});
    },
    resetPassword: function (email) {
      return fb().then(function (f) { return f.api.sendPasswordResetEmail(f.auth, email); })
        .catch(function (e) { throw fbError(e); });
    }
  };

  var impl = useFirebase ? remote : local;

  window.VoyageAuth = {
    mode: useFirebase ? 'firebase' : 'demo',
    demoAccount: DEMO,
    current: current,
    register: function (name, email, password) {
      name = String(name || '').trim(); email = normEmail(email);
      if (!name || !email || !password) return fail('Заполните все поля');
      if (String(password).length < 6) return fail('Пароль должен быть не короче 6 символов');
      return impl.register(name, email, password);
    },
    login: function (email, password) {
      email = normEmail(email);
      if (!email || !password) return fail('Укажите email и пароль');
      return impl.login(email, password);
    },
    logout: function () {
      remove(SESSION_KEY);
      return impl.logout();
    },
    resetPassword: function (email) {
      email = normEmail(email);
      if (!email) return fail('Введите email в поле выше');
      return impl.resetPassword(email);
    }
  };
})();
