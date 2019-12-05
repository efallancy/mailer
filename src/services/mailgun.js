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

  let payload = {
    from: sender,
    to: receiverRecipients.join(','),
    subject,
    text: content,
  };

  // If found with all valid email(s) for CC recipients, add into payload
  if (ccRecipients.length) {
    payload = { ...payload, cc: ccRecipients.join(',') };
  }

  // If found with all valid email(s) for BCC recipients, add into payload
  if (bccRecipients.length) {
    payload = { ...payload, bcc: bccRecipients.join(',') };
  }

  const res = await axios
    .post(
      `https://api.mailgun.net/v3/${config.mailgun.domain}/messages`,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: 'api',
          password: config.mailgun.apiKey,
        },
        params: payload,
      }
    )
    .then(() => {
      return { message: 'Sent', errorMessage: null };
    })
    .catch(({ response }) => {
      const { data } = response;
      const err =
        data && data.message
          ? { message: data.message }
          : { message: 'Fail to mail recipient' };
      return { message: null, errorMessage: err.message };
    });

  return res;
}
