import axios from 'axios';
import { isEmail } from 'validator';

import config from '../config';

export function validEmails(emails) {
  return (
    emails && Array.isArray(emails) && emails.every(email => isEmail(email))
  );
}

// Return emails for receiver when emails are all valid
export function getReceiverRecipients(recipient) {
  if (!recipient || !validEmails(recipient.to)) {
    return [];
  }

  return recipient.to.map(email => ({ email }));
}

// Return emails for CC when emails are all valid
export function getCcRecipients(recipient) {
  if (!recipient || !validEmails(recipient.cc)) {
    return [];
  }

  return recipient.cc.map(email => ({ email }));
}

// Return emails for BCC when emails are all valid
export function getBccRecipients(recipient) {
  if (!recipient || !validEmails(recipient.bcc)) {
    return [];
  }

  return recipient.bcc.map(email => ({ email }));
}

export async function sendMail(recipient, content) {
  if (!recipient || !content) {
    return {
      message: null,
      errorMessage: 'Invalid argument value',
    };
  }

  const receiverRecipients = getReceiverRecipients(recipient);
  const bccRecipients = getBccRecipients(recipient);
  const ccRecipients = getCcRecipients(recipient);

  if (!receiverRecipients.length) {
    return {
      message: null,
      errorMessage: 'No email found to be send as recipient',
    };
  }

  let personalization = {
    to: receiverRecipients,
    subject: config.sendgrid.emailSubject,
  };

  // If found with all valid email(s) for CC recipients, add into "personalization" payload
  if (ccRecipients.length) {
    personalization = { ...personalization, cc: ccRecipients };
  }

  // If found with all valid email(s) for BCC recipients, add into "personalization" payload
  if (bccRecipients.length) {
    personalization = { ...personalization, bcc: bccRecipients };
  }

  const res = await axios
    .post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        from: { email: config.sendgrid.sender },
        personalizations: [personalization],
        content: [
          {
            type: 'text/plain',
            value: content,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.sendgrid.apiKey}`,
        },
      }
    )
    .then(() => {
      return { message: 'Sent', errorMessage: null };
    })
    .catch(({ response }) => {
      const { data } = response;
      const err =
        data && Array.isArray(data.errors)
          ? data.errors[0]
          : { message: 'Fail to mail recipient' };
      return { message: null, errorMessage: err.message };
    });

  return res;
}
