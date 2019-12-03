import supertest from 'supertest';
import { configureServer } from '../server';
import * as sendgrid from '../services/sendgrid';

let server;

// Mock services
jest.mock('../services/sendgrid');

describe('Server', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    server = configureServer();
    server.ready();
  });

  afterEach(() => {
    server.close();
    server = undefined;
  });

  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const res = await supertest(server.server).get('/health');

      expect(res.status).toEqual(200);
    });
  });

  describe('POST /v1/mail/send', () => {
    it('should return 202 Accepted when successfully sending request', async () => {
      const validEmails = ['jessie@docker.com'];

      sendgrid.sendMail.mockImplementation(() =>
        Promise.resolve({ errorMessage: null, message: 'OK' })
      );

      const res = await supertest(server.server)
        .post('/v1/mail/send')
        .set('Content-Type', 'application/json')
        .send({ to: validEmails, content: 'Hello world!' });

      expect(res.status).toEqual(202);
      expect(res.body.message).toEqual('Email message has been sent!');
    });
  });

  it('should return 500 Internal Server Error when failing on making request to service', async () => {
    const validEmails = ['james@docker.com'];

    // eslint-disable-next-line
    sendgrid.sendMail.mockImplementation(() =>
      Promise.resolve({ errorMessage: 'Fail to mail recipient', message: null })
    );

    const res = await supertest(server.server)
      .post('/v1/mail/send')
      .set('Content-Type', 'application/json')
      .send({ to: validEmails, content: 'Hello world!' });

    expect(res.status).toEqual(500);
    expect(res.body.message).toEqual('Something went wrong! Come back later');
  });

  it('should return 400 Bad Request when payload not satisfied', async () => {
    const someValidEmails = ['james@docker.com', 'notjames.com'];

    // eslint-disable-next-line
    sendgrid.sendMail.mockImplementation(() =>
      Promise.resolve({ errorMessage: null, message: 'All good' })
    );

    const res = await supertest(server.server)
      .post('/v1/mail/send')
      .set('Content-Type', 'application/json')
      .send({ to: someValidEmails, content: 'Hello world!' });

    expect(res.status).toEqual(400);
  });
});
