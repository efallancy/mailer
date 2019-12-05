import uuid from 'uuid';

const config = {
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
  },
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN_NAME,
  },
  fastify: {
    logger: true,
    genReqId: () => uuid(),
  },
};

export default config;
