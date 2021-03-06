import axios from 'axios';

import {
  getReceiverRecipients,
  getBccRecipients,
  getCcRecipients,
} from '../helper';
import config from '../config';

export async function sendMail(sender, recipient, subject, content) {
  if (!sender || !recipient || !subject || !content) {
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
    to: receiverRecipients.map(email => ({ email })),
    subject,
  };

  // If found with all valid email(s) for CC recipients, add into "personalization" payload
  if (ccRecipients.length) {
    personalization = {
      ...personalization,
      cc: ccRecipients.map(email => ({ email })),
    };
  }

  // If found with all valid email(s) for BCC recipients, add into "personalization" payload
  if (bccRecipients.length) {
    personalization = {
      ...personalization,
      bcc: bccRecipients.map(email => ({ email })),
    };
  }

  const res = await axios
    .post(
      'https://api.sendgrid.com/v3/mail/send',
      {
        from: { email: sender },
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
