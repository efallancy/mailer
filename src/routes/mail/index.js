import { sendMail } from './handlers';
import { sendMailBodyRequestSchema } from './schemas';

function registerRoutes(server, opts, done) {
  server.post(
    '/mail/send',
    {
      schema: {
        body: sendMailBodyRequestSchema,
      },
      schemaCompiler: schema => data => schema.validate(data),
    },
    sendMail
  );
  done();
}

export default registerRoutes;
