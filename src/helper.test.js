import {
  validEmails,
  getReceiverRecipients,
  getCcRecipients,
  getBccRecipients,
} from './helper';

const allValidEmails = ['alpaca@gmail.com', 'anakin.skywalker@yahoo.com'];
const someValidEmails = ['dyson@gmail.com', 'invalid42'];

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
    const expectedResult = allValidEmails;
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
    const expectedResult = allValidEmails;
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
    const expectedResult = allValidEmails;
    const recipient = { bcc: allValidEmails };

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
