import { configureServer } from './server';

const server = configureServer();

server.listen(process.env.PORT || 3000, err => {
  if (err) {
    server.log.fatal('Error starting server');
  }
});
