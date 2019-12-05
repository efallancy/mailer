import { isEmail } from 'validator';

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

  return recipient.to;
}

// Return emails for CC when emails are all valid
export function getCcRecipients(recipient) {
  if (!recipient || !validEmails(recipient.cc)) {
    return [];
  }

  return recipient.cc;
}

// Return emails for BCC when emails are all valid
export function getBccRecipients(recipient) {
  if (!recipient || !validEmails(recipient.bcc)) {
    return [];
  }

  return recipient.bcc;
}
