import { sendMail as mailgunSendMail } from '../../services/mailgun';
import { sendMail as sendgridSendMail } from '../../services/sendgrid';
import { sendMessage } from '../../services/mailer';

export async function sendMail(req, reply) {
  const bodyRequest = req.body;

  const sender = bodyRequest.from;
  const to = bodyRequest.to;
  const cc = bodyRequest.cc;
  const bcc = bodyRequest.bcc;
  const subject = bodyRequest.subject;
  const content = bodyRequest.content;
  const recipient = { to, cc, bcc };

  const messaging = sendMessage(sendgridSendMail, mailgunSendMail);
  const response = await messaging(sender, recipient, subject, content);

  if (response.errorMessage) {
    req.log.error(
      `Error in sending request through provider ${response.provider}: ${response.errorMessage}`
    );
    reply.code(500).send({ message: 'Something went wrong! Come back later' });
  } else {
    req.log.info(`Message sent through provider: ${response.provider}`);
    reply.code(202).send({ message: 'Email message has been sent!' });
  }
}
