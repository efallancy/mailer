import uuid from 'uuid';

const config = {
  sendgrid: {
    sender: process.env.SENDGRID_EMAIL_SENDER,
    apiKey: process.env.SENDGRID_API_KEY,
    emailSubject: 'Sent from Sendgrid',
  },
  fastify: {
    logger: true,
    genReqId: () => uuid(),
  },
};

export default config;
