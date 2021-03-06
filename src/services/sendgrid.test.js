import axios from 'axios';
import { sendMail } from './sendgrid';

const allValidEmails = ['alpaca@gmail.com', 'anakin.skywalker@yahoo.com'];

jest.mock('axios');
jest.mock('../config', () => ({
  sendgrid: { apiKey: 'abc123' },
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe('sendMail', () => {
  describe('when successfully sending request to Sendgrid', () => {
    it('should return object with value in property "message" and "null" in property "errorMessage"', async () => {
      const sender = 'example.sender@gmail.com';
      const subject = 'Sent from Sendgrid';
      const apiKey = 'abc123';
      const recipient = {
        to: allValidEmails,
      };

      const content = 'Hello world!';

      // Mock implementation for HTTP request
      axios.post.mockImplementation(() => Promise.resolve());

      expect(await sendMail(sender, recipient, subject, content)).toEqual({
        message: 'Sent',
        errorMessage: null,
      });
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.sendgrid.com/v3/mail/send',
        {
          from: { email: sender },
          personalizations: [
            { subject, to: allValidEmails.map(email => ({ email })) },
          ],
          content: [{ type: 'text/plain', value: content }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
    });
  });

  describe('when argument is invalid', () => {
    it('should return generic error message', async () => {
      const sender = 'example@gmail.com';
      const recipient = null;
      const subject = 'Sent from Sendgrid';
      const content = 'Hello no recipient!';

      // Mock implementation for HTTP request
      axios.post.mockImplementation(() => Promise.resolve());

      const response = await sendMail(sender, recipient, subject, content);
      expect(response).toEqual({
        message: null,
        errorMessage: 'Invalid argument value',
      });
    });
  });

  describe('when no receiver recipient found', () => {
    it('should return about no receipent error message', async () => {
      const sender = 'example@gmail.com';
      const recipient = { to: [] };
      const subject = 'Sent from Sendgrid';
      const content = 'Hello no recipient!';

      // Mock implementation for HTTP request
      axios.post.mockImplementation(() => Promise.resolve());

      const response = await sendMail(sender, recipient, subject, content);
      expect(response).toEqual({
        message: null,
        errorMessage: 'No email found to be send as recipient',
      });
    });
  });

  describe('when receiving error on sending request to Sendgrid', () => {
    it('should return default error message when no error message found', async () => {
      const sender = 'example@gmail.com';
      const recipient = { to: allValidEmails };
      const subject = 'Sent from Sendgrid';
      const content = 'Hello there!';

      // Mock implementation for HTTP request
      axios.post.mockImplementation(() =>
        Promise.reject({ response: { data: null } })
      );

      const response = await sendMail(sender, recipient, subject, content);
      expect(response).toEqual({
        message: null,
        errorMessage: 'Fail to mail recipient',
      });
    });

    it('should return first error message found when response received', async () => {
      const sender = 'example@gmail.com';
      const recipient = { to: allValidEmails };
      const subject = 'Sent from Sendgrid';
      const content = 'Hello there!';

      // Mock implementation for HTTP request
      axios.post.mockImplementation(() =>
        Promise.reject({
          response: { data: { errors: [{ message: 'Invalid email found' }] } },
        })
      );

      const response = await sendMail(sender, recipient, subject, content);
      expect(response).toEqual({
        message: null,
        errorMessage: 'Invalid email found',
      });
    });
  });
});
