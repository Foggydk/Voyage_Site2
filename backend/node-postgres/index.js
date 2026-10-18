require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const fs = require('fs');
const path = require('path');
const express = require('express');

const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('\n[!] Нет файла server/.env');
  console.error('    Скопируйте server/.env.example → server/.env');
  console.error('    и укажите DATABASE_URL (пароль как в DBeaver).\n');
} else {
  const bad =
    (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('ВАШ_ПАРОЛЬ')) ||
    (process.env.PGPASSWORD && process.env.PGPASSWORD.includes('ВАШ_ПАРОЛЬ'));
  if (bad) {
    console.error('\n[!] В server/.env укажите пароль как в DBeaver (PGPASSWORD или DATABASE_URL).\n');
  }
}
const cors = require('cors');
const bcrypt = require('bcrypt');
const { query } = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;
const siteRoot = path.join(__dirname, '..', '..', 'public');

app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Укажите email и пароль' });
  }

  try {
    const { rows } = await query(
      'SELECT id, email, password_hash, full_name FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера. Проверьте подключение к PostgreSQL.' });
  }
});

app.get('/api/health', async (_req, res) => {
  const configured =
    (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('ВАШ_ПАРОЛЬ')) ||
    (process.env.PGPASSWORD && !process.env.PGPASSWORD.includes('ВАШ_ПАРОЛЬ'));
  if (!configured) {
    return res.status(503).json({
      ok: false,
      database: 'disconnected',
      hint: 'Создайте server/.env и задайте PGPASSWORD (как в DBeaver)',
    });
  }
  try {
    await query('SELECT 1');
    res.json({ ok: true, database: 'connected' });
  } catch (err) {
    res.status(503).json({
      ok: false,
      database: 'disconnected',
      hint: 'Неверный пароль/логин (сверьте с DBeaver) или PostgreSQL не запущен',
      detail: err.message,
    });
  }
});

app.use(express.static(siteRoot));

app.listen(PORT, () => {
  console.log(`Сайт и API: http://localhost:${PORT}`);
  console.log(`Проверка БД: http://localhost:${PORT}/api/health`);
});
