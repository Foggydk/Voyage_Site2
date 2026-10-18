require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.error('Файл server/.env не найден.');
  console.error('Скопируйте server/.env.example → server/.env');
  console.error('и укажите DATABASE_URL как в DBeaver (с вашим паролем).');
  process.exit(1);
}

const hasUrl = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('ВАШ_ПАРОЛЬ');
const hasPg = process.env.PGPASSWORD && !process.env.PGPASSWORD.includes('ВАШ_ПАРОЛЬ');
if (!hasUrl && !hasPg) {
  console.error('В server/.env задайте PGPASSWORD (или DATABASE_URL) как в DBeaver.');
  process.exit(1);
}

const { pool } = require('./db');

pool
  .query('SELECT current_database() AS db, current_user AS usr')
  .then((r) => {
    console.log('Подключение OK');
    console.log('  база:', r.rows[0].db);
    console.log('  пользователь:', r.rows[0].usr);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Не удалось подключиться:', err.message);
    console.error('');
    console.error('Проверьте в DBeaver: Host, Port, Database, User, Password');
    console.error('и те же значения в DATABASE_URL, например:');
    console.error('postgresql://postgres:пароль@localhost:5432/postgres');
    process.exit(1);
  });
