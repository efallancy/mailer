import { sendMail as sendgridSendMail } from '../../services/sendgrid';

export async function sendMail(req, reply) {
  const bodyRequest = req.body;

  const to = bodyRequest.to;
  const cc = bodyRequest.cc;
  const bcc = bodyRequest.bcc;
  const emailContent = bodyRequest.content;
  const recipient = { to, cc, bcc };

  const response = await sendgridSendMail(recipient, emailContent);

  if (response.errorMessage) {
    req.log.error(`Error in making Sendgrid request: ${response.errorMessage}`);
    reply.code(500).send({ message: 'Something went wrong! Come back later' });
  } else {
    reply.code(202).send({ message: 'Email message has been sent!' });
  }
}
