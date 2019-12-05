import { sendMessage } from './mailer';

describe('sendMessage', () => {
  it('should return request status of message sent', async () => {
    const sender = 'main.sender@gmail.com';
    const recipient = { to: ['audience@gmail.com'] };
    const subject = 'Sending message';
    const content = 'Hello world!';

    const primaryProvider = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ message: 'Sent', errorMessage: null })
      );
    const secondaryProvider = jest.fn();
    const sending = sendMessage(primaryProvider, secondaryProvider);
    const response = await sending(sender, recipient, subject, content);

    expect(response).toEqual({
      message: 'Sent',
      errorMessage: null,
      provider: 'primary',
    });
  });

  it('should failover to secondary provider', async () => {
    const sender = 'main.sender@gmail.com';
    const recipient = { to: ['audience@gmail.com'] };
    const subject = 'Sending message';
    const content = 'Hello world!';

    const primaryProvider = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ message: null, errorMessage: 'Fail to sent mail' })
      );
    const secondaryProvider = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ message: 'Sent', errorMessage: null })
      );
    const sending = sendMessage(primaryProvider, secondaryProvider);
    const response = await sending(sender, recipient, subject, content);

    expect(response).toEqual({
      message: 'Sent',
      errorMessage: null,
      provider: 'secondary',
    });
  });
});
