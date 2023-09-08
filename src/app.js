import { app } from './app/server.js';
import { logger } from './app/logging.js';

const PORT = process.env['PRIMARYPORT'] || 5000;
const DOMAIN = '127.0.0.1';

app.listen(PORT, DOMAIN, () => {
  logger.info(`Server berjalan pada ${DOMAIN} dengan port ${PORT}`);
});
