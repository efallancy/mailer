import fastify from 'fastify';
import cors from 'fastify-cors';
import helmet from 'fastify-helmet';

import config from './config';
import health from './routes/health';
import mail from './routes/mail';

export function configureServer() {
  const server = fastify(config.fastify);

  // Register middleware
  server.register(helmet);
  server.register(cors);

  // Register routes
  server.register(health);
  server.register(mail, { prefix: 'v1' });

  return server;
}
