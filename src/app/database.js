import mysql from 'mysql2/promise';
import EventsEmitter from 'events';
import { logger } from './logging.js';

const emitter = new EventsEmitter();
emitter.addListener('error', (e) => {
  logger.error(e);
});
emitter.addListener('warn', (e) => {
  logger.warn(e);
});
emitter.addListener('info', (e) => {
  logger.info(e);
});
emitter.addListener('query', (e) => {
  logger.query(e);
});

const databaseConfig = {
  connectionLimit: 10,
  host: process.env['DBHOST'] || '127.0.0.1',
  user: process.env['DBUSER'] || 'root',
  password: process.env['DBPASSWORD'] || '',
  database: process.env['DBNAME'] || 'idoru',
};

async function query(sql, params) {
  try {
    const connection = await mysql.createConnection(databaseConfig);
    const [results] = await connection.execute(sql, params);
    await connection.end();
    return results;
  } catch (error) {
    emitter.emit('error', error);
  }
}

async function getDb() {
  try {
    const connection = await mysql.createConnection(databaseConfig);
    return connection;
  } catch (error) {
    emitter.emit('error', error);
  }
}

export { query, getDb };
