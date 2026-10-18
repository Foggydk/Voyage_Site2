require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const bcrypt = require('bcrypt');
const { query } = require('./db');

async function seed() {
  const email = 'test@voyage.ru';
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);

  await query(
    `INSERT INTO users (email, password_hash, full_name)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING`,
    [email, hash, 'Тестовый пользователь']
  );

  console.log('Готово. Тестовый вход:');
  console.log('  email:', email);
  console.log('  пароль:', password);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
