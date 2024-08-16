import { Sequelize } from 'sequelize';
import path from 'path';

const dbPath = path.join(__dirname, '../../database.sqlite');
console.log('Database path:', dbPath);

const db = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log, // Enable logging
});

// Test the database connection
async function testConnection() {
  try {
    await db.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

export { db };