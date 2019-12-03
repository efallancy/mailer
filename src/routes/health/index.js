import { getHealth } from './handlers';

function registerRoutes(server, opts, done) {
  server.get('/health', getHealth);
  done();
}

export default registerRoutes;
