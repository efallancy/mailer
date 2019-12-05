import axios from 'axios';
import { sendMail } from './mailgun';

const allValidEmails = ['alpaca@gmail.com', 'anakin.skywalker@yahoo.com'];

jest.mock('axios');
jest.mock('../config', () => ({
  mailgun: { domain: 'simplemailer.dev', apiKey: 'abc123' },
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe('sendMail', () => {
  describe('when successfully sending request to Mailgun', () => {
    it('should return object with value in property "message" and "null" in property "errorMessage"', async () => {
      const sender = 'example.sender@gmail.com';
      const subject = 'Sent from Mailgun';
      const recipient = { to: allValidEmails };
      const content = 'Hello world!';

      const apiKey = 'abc123';

      // Mock implementation for HTTP request
      axios.post.mockImplementation(() => Promise.resolve());

      expect(await sendMail(sender, recipient, subject, content)).toEqual({
        message: 'Sent',
        errorMessage: null,
      });
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.mailgun.net/v3/simplemailer.dev/messages',
        {},
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          auth: {
            username: 'api',
            password: apiKey,
          },
          params: {
            from: sender,
            to: recipient.to.join(','),
            subject,
            text: content,
          },
        }
      );
    });
  });

  describe('when argument is invalid', () => {
    it('should return generic error message', async () => {
      const sender = 'example@gmail.com';
      const recipient = null;
      const subject = 'Sent from Mailgun';
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
      const recipient = {};
      const subject = 'Sent from Mailgun';
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

  describe('when receiving error on sending request to Mailgun', () => {
    it('should return default error message when no error message found', async () => {
      const sender = 'example@gmail.com';
      const recipient = { to: allValidEmails };
      const subject = 'Sent from Mailgun';
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
      const subject = 'Sent from Mailgun';
      const content = 'Hello there!';

      // Mock implementation for HTTP request
      axios.post.mockImplementation(() =>
        Promise.reject({
          response: { data: { message: 'Invalid email found' } },
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
