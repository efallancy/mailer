import axios from 'axios';
import {
  validEmails,
  getReceiverRecipients,
  getCcRecipients,
  getBccRecipients,
  sendMail,
} from './sendgrid';

const allValidEmails = ['alpaca@gmail.com', 'anakin.skywalker@yahoo.com'];
const someValidEmails = ['dyson@gmail.com', 'invalid42'];

jest.mock('axios');
jest.mock('../config', () => ({
  sendgrid: { sender: 'example.sender@gmail.com', apiKey: 'abc123' },
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe('validEmails', () => {
  it('should return true when all items in the list are valid emails', () => {
    expect(validEmails(allValidEmails)).toEqual(true);
  });

  it('should return false when one of the item in the list is an invalid email', () => {
    expect(validEmails(someValidEmails)).toEqual(false);
  });
});

describe('getReceiverRecipients', () => {
  it('should return all email in transformed structure when emails are valid', () => {
    const expectedResult = allValidEmails.map(email => ({ email }));
    const recipient = { to: allValidEmails };

    expect(getReceiverRecipients(recipient)).toEqual(expectedResult);
  });

  it('should return empty list when invalid email found', () => {
    const recipient = { to: someValidEmails };

    expect(getReceiverRecipients(recipient)).toEqual([]);
  });

  it('should return empty list when "to" recipient not found', () => {
    const recipient = { cc: allValidEmails };

    expect(getReceiverRecipients(recipient)).toEqual([]);
  });
});

describe('getCcRecipients', () => {
  it('should return all email in transformed structure when emails are valid', () => {
    const expectedResult = allValidEmails.map(email => ({ email }));
    const recipient = { cc: allValidEmails };

    expect(getCcRecipients(recipient)).toEqual(expectedResult);
  });

  it('should return empty list when invalid email found', () => {
    const recipient = { cc: someValidEmails };

    expect(getCcRecipients(recipient)).toEqual([]);
  });

  it('should return empty list when "cc" recipient not found', () => {
    const recipient = { bcc: allValidEmails };

    expect(getCcRecipients(recipient)).toEqual([]);
  });
});

describe('getBccRecipients', () => {
  it('should return all email in transformed structure when emails are valid', () => {
    const recipient = { bcc: allValidEmails };
    const expectedResult = allValidEmails.map(email => ({ email }));

    expect(getBccRecipients(recipient)).toEqual(expectedResult);
  });

  it('should return empty list when invalid email found', () => {
    const recipient = { bcc: someValidEmails };

    expect(getBccRecipients(recipient)).toEqual([]);
  });

  it('should return empty list when "bcc" recipient not found', () => {
    const recipient = { cc: allValidEmails };

    expect(getBccRecipients(recipient)).toEqual([]);
  });
});

describe('sendMail', () => {
  describe('when successfully sending request to Sendgrid', () => {
    it('should return object with value in property "message" and "null" in property "errorMessage"', async () => {
      const emailSender = 'example.sender@gmail.com';
      const apiKey = 'abc123';
      const recipient = {
        to: allValidEmails,
      };

      const content = 'Hello world!';

      // Mock implementation for HTTP request
      axios.post.mockImplementation(() => Promise.resolve());

      expect(await sendMail(recipient, content)).toEqual({
        message: 'Sent',
        errorMessage: null,
      });
      expect(axios.post).toHaveBeenCalledWith(
        'https://api.sendgrid.com/v3/mail/send',
        {
          from: { email: emailSender },
          personalizations: [{ to: allValidEmails.map(email => ({ email })) }],
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
      const recipient = null;
      const content = 'Hello no recipient!';

      // Mock implementation for HTTP request
      axios.post.mockImplementation(() => Promise.resolve());

      const response = await sendMail(recipient, content);
      expect(response).toEqual({
        message: null,
        errorMessage: 'Invalid argument value',
      });
    });
  });

  describe('when no receiver recipient found', () => {
    it('should return about no receipent error message', async () => {
      const recipient = { to: [] };
      const content = 'Hello no recipient!';

      // Mock implementation for HTTP request
      axios.post.mockImplementation(() => Promise.resolve());

      const response = await sendMail(recipient, content);
      expect(response).toEqual({
        message: null,
        errorMessage: 'No email found to be send as recipient',
      });
    });
  });

  describe('when receiving error on sending request to Sendgrid', () => {
    it('should return default error message when no error message found', async () => {
      const recipient = { to: allValidEmails };
      const content = 'Hello there!';

      // Mock implementation for HTTP request
      axios.post.mockImplementation(() =>
        Promise.reject({ response: { data: null } })
      ); // eslint-disable-line

      const response = await sendMail(recipient, content);
      expect(response).toEqual({
        message: null,
        errorMessage: 'Fail to mail recipient',
      });
    });

    it('should return first error message found when response received', async () => {
      const recipient = { to: allValidEmails };
      const content = 'Hello there!';

      // Mock implementation for HTTP request
      axios.post.mockImplementation(() =>
        Promise.reject({
          response: { data: { errors: [{ message: 'Invalid email found' }] } },
        })
      ); // eslint-disable-line

      const response = await sendMail(recipient, content);
      expect(response).toEqual({
        message: null,
        errorMessage: 'Invalid email found',
      });
    });
  });
});
