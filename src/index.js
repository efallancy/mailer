import { configureServer } from './server';

const port = process.env.PORT || 3000;

const server = configureServer();

server.listen(port, err => {
  if (err) {
    server.log.fatal('Error starting server');
  }
});
